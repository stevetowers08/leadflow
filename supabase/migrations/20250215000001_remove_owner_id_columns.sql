-- Migration: remove_owner_id_columns
-- Date: 2025-02-15
-- Description: Remove owner_id columns and owner role references from all tables

-- ========================
-- PART 1: Drop owner_id columns from tables
-- ========================

-- Drop owner_id from companies table
ALTER TABLE public.companies DROP COLUMN IF EXISTS owner_id;

-- Drop owner_id from people table
ALTER TABLE public.people DROP COLUMN IF EXISTS owner_id;

-- Drop owner_id from jobs table
ALTER TABLE public.jobs DROP COLUMN IF EXISTS owner_id;

-- Drop owner_id from leads table
ALTER TABLE public.leads DROP COLUMN IF EXISTS owner_id;

-- Drop owner_id from interactions table (if exists)
ALTER TABLE public.interactions DROP COLUMN IF EXISTS owner_id;

-- Drop owner_id from campaigns table (if exists)
ALTER TABLE public.campaigns DROP COLUMN IF EXISTS owner_id;

-- Drop owner_id from decision_makers table (if exists)
ALTER TABLE public.decision_makers DROP COLUMN IF EXISTS owner_id;

-- ========================
-- PART 2: Drop indexes related to owner_id
-- ========================

DROP INDEX IF EXISTS idx_companies_client_owner;
DROP INDEX IF EXISTS idx_people_client_owner;
DROP INDEX IF EXISTS idx_jobs_client_owner;
DROP INDEX IF EXISTS idx_campaigns_owner_id;
DROP INDEX IF EXISTS idx_decision_makers_owner_id;

-- ========================
-- PART 3: Update RLS policies to remove owner role checks
-- ========================

-- Note: RLS policies that check for 'owner' role will need to be updated
-- to only check for 'admin' role. This is done in a separate migration
-- to avoid breaking existing policies.

-- ========================
-- PART 4: Update functions that reference owner_id
-- ========================

-- Drop or update functions that use owner_id
-- The can_access_entity function should be updated to remove owner role checks
-- The can_assign_entity function should be updated to remove owner role checks

-- ========================
-- PART 5: Update user_profiles role constraint
-- ========================

-- Remove 'owner' from role CHECK constraint if it exists
-- This will be handled by updating the constraint to only allow 'admin' and 'user'

-- Note: This migration removes the owner_id columns but does not update
-- all RLS policies. A follow-up migration should update RLS policies
-- to remove owner role checks.


