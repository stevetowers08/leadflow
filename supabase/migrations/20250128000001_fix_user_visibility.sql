-- Fix user visibility issue
-- Allow all authenticated users to view all user profiles for now
-- This is a temporary fix until we can properly debug the role-based access

-- Drop the restrictive admin-only policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Create a permissive policy that allows all authenticated users to view all profiles
CREATE POLICY "All authenticated users can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (auth.role() = 'authenticated');

-- Keep the other policies as they are
-- Users can still only update their own profile
-- Only owners can delete profiles
-- Authenticated users can insert profiles
