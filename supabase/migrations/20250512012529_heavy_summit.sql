/*
  # User and Application Schema Update
  
  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to auth.users
    - `applications`
      - Stores job applications
      - Links to profiles
    - `application_steps`
      - Stores steps for each application
      - Links to applications
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    
  3. Changes
    - Remove status from applications table
    - Status is now determined by the most recent step
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
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

-- Create application steps table
CREATE TABLE IF NOT EXISTS application_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  date timestamptz NOT NULL,
  status text NOT NULL,
  contact_person text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (
    status IN ('applied', 'screening', 'progress', 'offer', 'rejected')
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

-- Create a view that includes the current status for each application
CREATE VIEW application_status AS
SELECT DISTINCT ON (a.id)
  a.id as application_id,
  s.status as current_status,
  s.date as status_date
FROM applications a
LEFT JOIN application_steps s ON a.id = s.application_id
ORDER BY a.id, s.date DESC;

-- Function to get current status
CREATE OR REPLACE FUNCTION get_application_status(application_id uuid)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT current_status
  FROM application_status
  WHERE application_id = $1;
$$;