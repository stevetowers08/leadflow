-- Migration: Ensure steve@polarislabs.io user profile exists
-- Date: 2025-01-28
-- Description: Ensures user_profile exists for steve@polarislabs.io
-- Note: User must be created via Supabase Admin API (use scripts/admin/create-steve-user.js)
-- This migration only ensures the profile exists if the user already exists in auth.users

-- ============================================
-- 1. Ensure user_profile exists for steve@polarislabs.io
-- ============================================
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = 'steve@polarislabs.io'
  LIMIT 1;

  IF user_id IS NOT NULL THEN
    -- User exists, ensure profile exists and is active
    INSERT INTO public.user_profiles (
      id,
      email,
      full_name,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      'steve@polarislabs.io',
      'Steve Towers',
      'owner',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = 'owner',
      is_active = true,
      updated_at = NOW();

    RAISE NOTICE 'User profile ensured for steve@polarislabs.io (ID: %)', user_id;
  ELSE
    RAISE NOTICE 'User steve@polarislabs.io not found in auth.users. Run scripts/admin/create-steve-user.js to create the user.';
  END IF;
END $$;

-- ============================================
-- 2. Ensure user can access leads table
-- ============================================
-- Update RLS policies to allow the user to access their own leads
-- The existing policy should work, but let's ensure it's correct

-- Note: The leads table RLS policy requires auth.uid() = user_id
-- So leads created with this user's ID will be accessible

-- ============================================
-- 3. Create a test lead for steve if none exist
-- ============================================
DO $$
DECLARE
  user_id UUID;
  lead_count INTEGER;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'steve@polarislabs.io';
  
  IF user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO lead_count 
    FROM public.leads 
    WHERE user_id = user_id;
    
    IF lead_count = 0 THEN
      -- Create a sample lead for testing
      INSERT INTO public.leads (
        user_id,
        first_name,
        last_name,
        email,
        company,
        job_title,
        status,
        quality_rank,
        created_at,
        updated_at
      ) VALUES (
        user_id,
        'Test',
        'Lead',
        'test@example.com',
        'Test Company',
        'Test Role',
        'processing',
        'warm',
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Created sample lead for steve@polarislabs.io';
    END IF;
  END IF;
END $$;

-- ============================================
-- 4. Comments
-- ============================================
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Ensures steve@polarislabs.io user exists for testing';

