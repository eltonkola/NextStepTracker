/*
  # Add RLS policies for profiles table

  1. Changes
    - Add RLS policies for the profiles table to allow:
      - Users to create their own profile
      - Users to read their own profile
      - Users to update their own profile

  2. Security
    - Enable RLS on profiles table (if not already enabled)
    - Add policies for authenticated users to:
      - INSERT: Only allow users to create their own profile
      - SELECT: Only allow users to read their own profile
      - UPDATE: Only allow users to update their own profile
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own profile
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);