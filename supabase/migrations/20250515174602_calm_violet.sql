/*
  # Initial Database Schema

  This migration creates the complete database schema for the application, including:
  
  1. Tables
    - profiles: User profile information
    - applications: Job applications
    - application_steps: Steps/stages of each application
    - stripe_customers: Stripe customer information
    - stripe_subscriptions: Subscription data
    - stripe_orders: Order information
  
  2. Views
    - application_status: Current status of each application
    - stripe_user_subscriptions: User subscription information
    - stripe_user_orders: User order information
  
  3. Enums
    - stripe_order_status: Status of orders
    - stripe_subscription_status: Status of subscriptions
  
  4. Security
    - RLS enabled on all tables
    - Appropriate policies for CRUD operations
    - Security definer views for stripe data
*/

-- Drop existing schema objects to start fresh
DROP VIEW IF EXISTS public.application_status;
DROP VIEW IF EXISTS public.stripe_user_orders;
DROP VIEW IF EXISTS public.stripe_user_subscriptions;
DROP TABLE IF EXISTS public.application_steps;
DROP TABLE IF EXISTS public.applications;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.stripe_orders;
DROP TABLE IF EXISTS public.stripe_subscriptions;
DROP TABLE IF EXISTS public.stripe_customers;
DROP TYPE IF EXISTS public.stripe_order_status;
DROP TYPE IF EXISTS public.stripe_subscription_status;

-- Create enums
CREATE TYPE public.stripe_order_status AS ENUM (
  'pending',
  'completed',
  'canceled'
);

CREATE TYPE public.stripe_subscription_status AS ENUM (
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

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create applications table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own applications"
  ON public.applications
  FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());

-- Create application_steps table
CREATE TABLE public.application_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  status text NOT NULL,
  contact_person text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('applied', 'screening', 'progress', 'offer', 'rejected'))
);

ALTER TABLE public.application_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view steps for their applications"
  ON public.application_steps
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM public.applications
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert steps for their applications"
  ON public.application_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (
    application_id IN (
      SELECT id FROM public.applications
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update steps for their applications"
  ON public.application_steps
  FOR UPDATE
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM public.applications
      WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    application_id IN (
      SELECT id FROM public.applications
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete steps for their applications"
  ON public.application_steps
  FOR DELETE
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM public.applications
      WHERE profile_id = auth.uid()
    )
  );

-- Create stripe_customers table
CREATE TABLE public.stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
  ON public.stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create stripe_subscriptions table
CREATE TABLE public.stripe_subscriptions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id text NOT NULL UNIQUE REFERENCES public.stripe_customers(customer_id),
  subscription_id text,
  price_id text,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text,
  payment_method_last4 text,
  status public.stripe_subscription_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
  ON public.stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM public.stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Create stripe_orders table
CREATE TABLE public.stripe_orders (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL REFERENCES public.stripe_customers(customer_id),
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status public.stripe_order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE public.stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
  ON public.stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM public.stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Create views
CREATE OR REPLACE VIEW public.application_status AS
SELECT
  a.id AS application_id,
  s.status AS current_status,
  s.date AS status_date
FROM
  public.applications a
  LEFT JOIN LATERAL (
    SELECT status, date
    FROM public.application_steps
    WHERE application_id = a.id
    ORDER BY date DESC
    LIMIT 1
  ) s ON true;

CREATE OR REPLACE VIEW public.stripe_user_subscriptions WITH (security_invoker = false) AS
SELECT
  sc.customer_id,
  ss.subscription_id,
  ss.status AS subscription_status,
  ss.price_id,
  ss.current_period_start,
  ss.current_period_end,
  ss.cancel_at_period_end,
  ss.payment_method_brand,
  ss.payment_method_last4
FROM
  public.stripe_customers sc
  JOIN public.stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE
  sc.deleted_at IS NULL
  AND ss.deleted_at IS NULL;

CREATE OR REPLACE VIEW public.stripe_user_orders WITH (security_invoker = false) AS
SELECT
  sc.customer_id,
  so.id AS order_id,
  so.checkout_session_id,
  so.payment_intent_id,
  so.amount_subtotal,
  so.amount_total,
  so.currency,
  so.payment_status,
  so.status AS order_status,
  so.created_at AS order_date
FROM
  public.stripe_customers sc
  JOIN public.stripe_orders so ON sc.customer_id = so.customer_id
WHERE
  sc.deleted_at IS NULL
  AND so.deleted_at IS NULL;