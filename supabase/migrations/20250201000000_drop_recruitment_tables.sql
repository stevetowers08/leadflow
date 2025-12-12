-- Migration: Drop Recruitment Tables
-- Date: 2025-02-01
-- Purpose: Remove all recruitment-specific tables as part of LeadFlow cleanup
-- 
-- ⚠️ WARNING: This is a DESTRUCTIVE migration
-- ⚠️ BACKUP your database before running this migration
--
-- This migration drops the following tables:
-- - jobs
-- - client_jobs
-- - client_job_deals
-- - placements (if exists)
-- - interviews (if exists)
-- - candidates (if exists and distinct from people)
-- - applications (if exists)
-- - job_postings (if exists)
-- - job_sources (if exists)
-- - client_search_campaigns (if exists)
-- - campaign_execution_logs (if exists)
-- - campaign_job_matches (if exists)

-- Drop dependent tables first (foreign key constraints)
DROP TABLE IF EXISTS campaign_job_matches CASCADE;
DROP TABLE IF EXISTS campaign_execution_logs CASCADE;
DROP TABLE IF EXISTS client_search_campaigns CASCADE;
DROP TABLE IF EXISTS job_sources CASCADE;
DROP TABLE IF EXISTS client_job_deals CASCADE;
DROP TABLE IF EXISTS client_jobs CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS placements CASCADE;
DROP TABLE IF EXISTS job_postings CASCADE;

-- Drop main jobs table (cascade will handle dependent objects)
DROP TABLE IF EXISTS jobs CASCADE;

-- Drop related triggers if they exist
DROP TRIGGER IF EXISTS trigger_client_companies_on_job_qualify ON client_jobs;
DROP TRIGGER IF EXISTS trigger_job_qualification_webhook ON jobs;

-- Drop related functions if they exist
DROP FUNCTION IF EXISTS notify_job_qualification_webhook() CASCADE;
DROP FUNCTION IF EXISTS trigger_client_companies_on_job_qualify() CASCADE;

-- Clean up any job-related columns from other tables
-- Remove source_job_id from companies if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'source_job_id'
  ) THEN
    ALTER TABLE companies DROP COLUMN source_job_id;
  END IF;
END $$;

-- Remove job_id from client_decision_maker_outreach if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'client_decision_maker_outreach' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE client_decision_maker_outreach DROP COLUMN job_id;
  END IF;
END $$;

-- Update notes table to remove 'job' from entity_type enum if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notes' AND column_name = 'entity_type'
  ) THEN
    -- Check if 'job' is in the enum
    IF EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumlabel = 'job' 
      AND enumtypid = (
        SELECT oid FROM pg_type WHERE typname = (
          SELECT udt_name FROM information_schema.columns 
          WHERE table_name = 'notes' AND column_name = 'entity_type'
        )
      )
    ) THEN
      -- Note: PostgreSQL doesn't support removing enum values directly
      -- This would require recreating the enum type, which is complex
      -- For now, we'll leave it but document that 'job' should not be used
      RAISE NOTICE 'Note: entity_type enum may still contain ''job'' value. Manual cleanup may be required.';
    END IF;
  END IF;
END $$;

-- Update entity_tags table to remove 'job' from entity_type enum if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'entity_tags' AND column_name = 'entity_type'
  ) THEN
    -- Similar note about enum cleanup
    RAISE NOTICE 'Note: entity_type enum in entity_tags may still contain ''job'' value. Manual cleanup may be required.';
  END IF;
END $$;

-- Remove job-related operation types from cost_events if needed
-- Note: This would require updating the enum, which is complex in PostgreSQL
-- Document that 'job_discovery' and 'job_enrichment' should not be used

COMMENT ON TABLE companies IS 'Company profiles for LeadFlow. Recruitment-specific fields have been removed.';
COMMENT ON TABLE leads IS 'Event-captured leads with OCR data. Primary lead management table for LeadFlow.';

