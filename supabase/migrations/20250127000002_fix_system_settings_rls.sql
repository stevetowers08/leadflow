-- Fix RLS policy for system_settings table
-- Migration: fix_system_settings_rls_policy
-- Date: 2025-01-27
-- Description: Updates system settings policy to check user_profiles.role instead of user_metadata

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;

-- Create new policy that checks user_profiles.role
CREATE POLICY "Admins can manage system settings" 
ON public.system_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'owner')
  )
);
