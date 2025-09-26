-- Create user profile for Steve Towers (Owner)
-- Run this in your Supabase SQL editor or via CLI

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

-- Verify the profile was created
SELECT * FROM public.user_profiles WHERE email = 'stevetowers08@gmail.com';
