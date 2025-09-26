-- COMPLETE FIX: Create user profile and fix authentication

-- First, create your user profile
INSERT INTO public.user_profiles (id, email, full_name, role, user_limit, is_active)
VALUES (
  'f100f6bc-22d8-456f-bcce-44c7881b68ef',
  'stevetowers08@gmail.com',
  'Steve Towers',
  'owner',
  1000,
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  user_limit = EXCLUDED.user_limit,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Update RLS policies to work with user profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Verify everything is set up
SELECT 'User Profile Created' as status, * FROM public.user_profiles WHERE email = 'stevetowers08@gmail.com';
SELECT 'RLS Policies' as status, COUNT(*) as policy_count FROM pg_policies WHERE schemaname = 'public';
