-- Fix user visibility issue - Allow all authenticated users to view all user profiles
-- Based on Supabase RLS best practices
-- This is the final fix for the user management visibility issue

-- Drop all existing restrictive policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "All authenticated users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- Create a simple, permissive policy following Supabase best practices
-- This allows ALL authenticated users to view ALL profiles
CREATE POLICY "Authenticated users can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Keep the other policies for updates, inserts, and deletes
-- Users can still only update their own profile
-- Only owners can delete profiles  
-- Authenticated users can insert profiles
