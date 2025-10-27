-- Add test users for assignment testing
-- Since user_profiles references auth.users, we can't easily add users via SQL
-- This migration documents what needs to be done manually

-- Manual steps to add test users for development:
-- 1. Create auth users via Supabase dashboard or API
-- 2. Then insert into user_profiles

-- For now, let's just make sure the existing user is active
UPDATE user_profiles 
SET 
  is_active = true,
  updated_at = NOW()
WHERE id = '8fecfbaf-34e3-4106-9dd8-2cadeadea100';

-- Add a comment about how to add test users
COMMENT ON TABLE user_profiles IS 'Test users can be added via Supabase dashboard. Go to Authentication > Users and create new users, then they will automatically get user_profiles entries.';

