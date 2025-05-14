/*
  # Add RLS policies for profiles table

  1. Security Changes
    - Enable RLS on profiles table (if not already enabled)
    - Add policy for authenticated users to insert their own profile
    - Add policy for authenticated users to update their own profile
    - Add policy for authenticated users to read their own profile

  Note: These policies ensure users can only manage their own profile data
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for inserting own profile
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for updating own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for reading own profile
CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);