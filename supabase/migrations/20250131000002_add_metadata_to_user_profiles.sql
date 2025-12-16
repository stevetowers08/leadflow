-- Add metadata column to user_profiles table
-- This column stores integration credentials (lemlist_api_key, lemlist_email, etc.)
-- Migration: add_metadata_to_user_profiles
-- Date: 2025-01-31

-- Add metadata column as JSONB with default empty object
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.metadata IS 'Stores integration credentials and user preferences as JSON (e.g., lemlist_api_key, lemlist_email, gmail tokens)';















