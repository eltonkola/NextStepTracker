/*
  # Initial Schema Setup

  1. Tables
    - profiles
      - User profile information
      - Linked to auth.users
    - applications
      - Job application tracking
      - Linked to profiles
    - application_steps
      - Individual steps/stages in the application process
      - Linked to applications
    - stripe_customers
      - Stripe customer mapping
      - Links Supabase users to Stripe customers
    - stripe_subscriptions
      - Subscription tracking
      - Links stripe customers to their subscriptions
    - stripe_orders
      - One-time payment tracking
      - Links stripe customers to their orders

  2. Views
    - application_status
      - Current status of each application
    - stripe_user_subscriptions
      - User subscription information
    - stripe_user_orders
      - User order information

  3. Security
    - RLS enabled on all tables
    - Policies for authenticated users to access their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE stripe_subscription_status AS ENUM (
  'not_started',
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

CREATE TYPE stripe_order_status AS ENUM (
  'pending',
  'completed',
  'canceled'
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  salary text,
  location text,
  date_applied timestamptz NOT NULL,
  notes text,
  favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());

-- Application steps table
CREATE TABLE IF NOT EXISTS application_steps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  status text NOT NULL,
  contact_person text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (
    status = ANY (ARRAY['applied'::text, 'screening'::text, 'progress'::text, 'offer'::text, 'rejected'::text])
  )
);

ALTER TABLE application_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view steps for their applications"
  ON application_steps
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert steps for their applications"
  ON application_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update steps for their applications"
  ON application_steps
  FOR UPDATE
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete steps for their applications"
  ON application_steps
  FOR DELETE
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE profile_id = auth.uid()
    )
  );

-- Stripe customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX stripe_customers_user_id_key ON stripe_customers(user_id);

CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Stripe subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint PRIMARY KEY,
  customer_id text NOT NULL REFERENCES stripe_customers(customer_id),
  subscription_id text,
  price_id text,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text,
  payment_method_last4 text,
  status stripe_subscription_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX stripe_subscriptions_customer_id_key ON stripe_subscriptions(customer_id);

CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Stripe orders table
CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint PRIMARY KEY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL REFERENCES stripe_customers(customer_id),
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status stripe_order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Views
CREATE OR REPLACE VIEW application_status AS
WITH latest_steps AS (
  SELECT DISTINCT ON (application_id)
    application_id,
    status as current_status,
    date as status_date
  FROM application_steps
  ORDER BY application_id, date DESC
)
SELECT
  a.id as application_id,
  COALESCE(ls.current_status, 'applied') as current_status,
  COALESCE(ls.status_date, a.date_applied) as status_date
FROM applications a
LEFT JOIN latest_steps ls ON a.id = ls.application_id;

CREATE OR REPLACE VIEW stripe_user_subscriptions AS
SELECT
  c.customer_id,
  s.subscription_id,
  s.status as subscription_status,
  s.price_id,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.payment_method_brand,
  s.payment_method_last4
FROM stripe_customers c
JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.deleted_at IS NULL AND s.deleted_at IS NULL;

CREATE OR REPLACE VIEW stripe_user_orders AS
SELECT
  c.customer_id,
  o.id as order_id,
  o.checkout_session_id,
  o.payment_intent_id,
  o.amount_subtotal,
  o.amount_total,
  o.currency,
  o.payment_status,
  o.status as order_status,
  o.created_at as order_date
FROM stripe_customers c
JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.deleted_at IS NULL AND o.deleted_at IS NULL;