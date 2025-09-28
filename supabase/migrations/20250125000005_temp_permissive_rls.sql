-- Temporary fix: Create a permissive policy for testing
-- This allows all authenticated users to see all user profiles
-- WARNING: This is for testing only and should be replaced with proper role-based policies

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create temporary permissive policies for testing
CREATE POLICY "Temporary: All authenticated users can view profiles" ON public.user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Temporary: All authenticated users can update profiles" ON public.user_profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Temporary: All authenticated users can insert profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Temporary: All authenticated users can delete profiles" ON public.user_profiles
  FOR DELETE USING (auth.role() = 'authenticated');
