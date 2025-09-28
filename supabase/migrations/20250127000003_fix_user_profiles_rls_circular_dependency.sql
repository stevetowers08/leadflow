-- Fix circular dependency in user_profiles RLS policies
-- Migration: fix_user_profiles_rls_circular_dependency
-- Date: 2025-01-27
-- Description: Removes circular dependency by simplifying RLS policies

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Owners can update any profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Owners can delete profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create simplified policies without circular dependencies
-- 1. Users can view their own profile (no role check needed)
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can update their own profile (no role check needed)
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Allow authenticated users to insert profiles (for new user registration)
CREATE POLICY "Authenticated users can insert profiles" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. Only owners can delete profiles (using user_metadata as fallback)
CREATE POLICY "Owners can delete profiles" 
ON public.user_profiles FOR DELETE 
USING (
  -- Check if user is owner in user_metadata (fallback)
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'owner'
  OR
  -- Check if user is owner in the profile being deleted
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role = 'owner'
  )
);

-- 5. Allow admins/owners to view all profiles (using user_metadata as fallback)
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (
  -- Check if user is admin/owner in user_metadata (fallback)
  auth.jwt() ->> 'user_metadata' ->> 'role' IN ('admin', 'owner')
  OR
  -- Check if user is admin/owner in their own profile
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'owner')
  )
);
