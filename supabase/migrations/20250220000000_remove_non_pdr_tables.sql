-- Migration: Remove Non-PDR Tables
-- Date: 2025-02-20
-- Purpose: Remove all tables and features not in the PDR
-- 
-- ⚠️ WARNING: This is a DESTRUCTIVE migration
-- ⚠️ BACKUP your database before running this migration
--
-- PDR Tables (KEEP):
-- - leads
-- - workflows
-- - activity_log
-- - user_profiles
-- - user_settings
--
-- Non-PDR Tables (REMOVE):
-- - jobs (recruitment)
-- - client_job_deals (recruitment)
-- - client_decision_maker_outreach (recruitment)
-- - clients (multi-tenant, not in PDR)
-- - client_users (multi-tenant, not in PDR)
-- - people (legacy, migrate to leads)
-- - leadflow_leads (duplicate of leads)
-- - campaign_sequences (not in PDR - workflows table is the PDR table)
-- - campaign_sequence_steps (not in PDR)
-- - campaign_sequence_leads (not in PDR)
-- - campaign_sequence_executions (not in PDR)
-- - companies (not explicitly in PDR schema)
-- - email_sends (not explicitly in PDR, but might be needed)
-- - email_replies (not explicitly in PDR, but might be needed)

-- ============================================
-- Step 1: Drop Recruitment Tables
-- ============================================

-- Drop dependent tables first (foreign key constraints)
DROP TABLE IF EXISTS client_job_deals CASCADE;
DROP TABLE IF EXISTS client_decision_maker_outreach CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;

-- ============================================
-- Step 2: Drop Multi-Tenant Tables (Not in PDR)
-- ============================================

-- Drop client_users first (references clients)
DROP TABLE IF EXISTS client_users CASCADE;

-- Drop clients table (multi-tenant feature not in PDR)
DROP TABLE IF EXISTS clients CASCADE;

-- ============================================
-- Step 3: Remove client_id columns from other tables
-- ============================================

-- Remove client_id from companies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'companies' 
    AND column_name = 'client_id'
  ) THEN
    ALTER TABLE public.companies DROP COLUMN client_id;
  END IF;
END $$;

-- Remove client_id from people
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'people' 
    AND column_name = 'client_id'
  ) THEN
    ALTER TABLE public.people DROP COLUMN client_id;
  END IF;
END $$;

-- Remove client_id from jobs (if still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'jobs' 
    AND column_name = 'client_id'
  ) THEN
    ALTER TABLE public.jobs DROP COLUMN client_id;
  END IF;
END $$;

-- ============================================
-- Step 4: Drop Legacy/Duplicate Tables
-- ============================================

-- Drop leadflow_leads (duplicate of leads)
DROP TABLE IF EXISTS leadflow_leads CASCADE;

-- Drop people table (legacy, should use leads)
-- NOTE: Migrate any data from people to leads before running this
DROP TABLE IF EXISTS people CASCADE;

-- ============================================
-- Step 5: Drop Campaign Sequence Tables (Not in PDR)
-- ============================================
-- PDR uses 'workflows' table, not campaign_sequences

DROP TABLE IF EXISTS campaign_sequence_executions CASCADE;
DROP TABLE IF EXISTS campaign_sequence_leads CASCADE;
DROP TABLE IF EXISTS campaign_sequence_steps CASCADE;
DROP TABLE IF EXISTS campaign_sequences CASCADE;

-- ============================================
-- Step 6: Clean up job_id references
-- ============================================

-- Remove job_id from client_decision_maker_outreach (if still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'client_decision_maker_outreach' 
    AND column_name = 'job_id'
  ) THEN
    ALTER TABLE public.client_decision_maker_outreach DROP COLUMN job_id;
  END IF;
END $$;

-- ============================================
-- Step 7: Update table comments
-- ============================================

COMMENT ON TABLE public.leads IS 'Event-captured leads with OCR data. Primary lead management table per PDR.';
COMMENT ON TABLE public.workflows IS 'Email automation workflows per PDR.';
COMMENT ON TABLE public.activity_log IS 'Activity tracking for leads per PDR.';

-- ============================================
-- Step 8: Verify PDR tables exist
-- ============================================

DO $$
BEGIN
  -- Check that required PDR tables exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
    RAISE EXCEPTION 'Required PDR table "leads" does not exist!';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflows') THEN
    RAISE EXCEPTION 'Required PDR table "workflows" does not exist!';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_log') THEN
    RAISE EXCEPTION 'Required PDR table "activity_log" does not exist!';
  END IF;
  
  RAISE NOTICE '✅ All required PDR tables verified';
END $$;










