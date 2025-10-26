-- Fix Simplified Workflows Migration
-- Migration: fix_simplified_workflows
-- Date: 2025-10-22
-- Description: Updates job qualification status and people stage to match simplified workflows

-- =======================
-- PART 1: Fix Job Qualification Status
-- =======================

-- Update job qualification status constraint to match simplified workflow
-- Old values: 'new', 'qualified', 'not_qualified', 'needs_review'
-- New values: 'new', 'qualify', 'skip'

-- First, update existing data to match new values
UPDATE jobs 
SET qualification_status = CASE 
  WHEN qualification_status = 'qualified' THEN 'qualify'
  WHEN qualification_status = 'not_qualified' THEN 'skip'
  WHEN qualification_status = 'needs_review' THEN 'new'
  ELSE qualification_status
END
WHERE qualification_status IS NOT NULL;

-- Drop the old constraint
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_qualification_status_check;

-- Add the new constraint with simplified values
ALTER TABLE jobs 
ADD CONSTRAINT jobs_qualification_status_check 
CHECK (qualification_status IN ('new', 'qualify', 'skip'));

-- Update the comment
COMMENT ON COLUMN jobs.qualification_status IS 'Current qualification status: new, qualify, skip';

-- =======================
-- PART 2: Fix People Stage Values
-- =======================

-- Update people stage constraint to match simplified workflow
-- Old values: 'new', 'qualified', 'proceed', 'skip'
-- New values: 'new', 'qualify', 'skip'

-- First, update existing data to match new values
UPDATE people 
SET stage = CASE 
  WHEN stage = 'qualified' THEN 'qualify'
  WHEN stage = 'proceed' THEN 'qualify'
  ELSE stage
END
WHERE stage IS NOT NULL;

-- Check if constraint exists and update if needed
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'people_stage_check'
  ) THEN
    ALTER TABLE people DROP CONSTRAINT people_stage_check;
  END IF;
  
  -- Add new constraint with simplified values
  ALTER TABLE people 
  ADD CONSTRAINT people_stage_check 
  CHECK (stage IN ('new', 'qualify', 'skip'));
END $$;

-- Update the comment
COMMENT ON COLUMN people.stage IS 'Current stage: new, qualify, skip';

-- =======================
-- PART 3: Remove Automation Fields
-- =======================

-- Remove LinkedIn automation fields from people table
ALTER TABLE people DROP COLUMN IF EXISTS automation_started_at;
ALTER TABLE people DROP COLUMN IF EXISTS linkedin_request_message;
ALTER TABLE people DROP COLUMN IF EXISTS linkedin_follow_up_message;
ALTER TABLE people DROP COLUMN IF EXISTS linkedin_connected_message;
ALTER TABLE people DROP COLUMN IF EXISTS connected_at;
ALTER TABLE people DROP COLUMN IF EXISTS last_reply_at;
ALTER TABLE people DROP COLUMN IF EXISTS last_reply_channel;
ALTER TABLE people DROP COLUMN IF EXISTS last_reply_message;
ALTER TABLE people DROP COLUMN IF EXISTS last_interaction_at;
ALTER TABLE people DROP COLUMN IF EXISTS reply_type;

-- Remove automation fields from companies table
ALTER TABLE companies DROP COLUMN IF EXISTS automation_active;
ALTER TABLE companies DROP COLUMN IF EXISTS automation_started_at;

-- =======================
-- PART 4: Clean Up Automation Tables
-- =======================

-- Drop automation-related tables that are no longer needed
DROP TABLE IF EXISTS workflow_automations CASCADE;
DROP TABLE IF EXISTS automation_logs CASCADE;
DROP TABLE IF EXISTS linkedin_automation_sessions CASCADE;
DROP TABLE IF EXISTS automation_triggers CASCADE;
DROP TABLE IF EXISTS automation_actions CASCADE;

-- =======================
-- PART 5: Clean Up Automation Functions
-- =======================

-- Drop automation-related functions
DROP FUNCTION IF EXISTS trigger_automation CASCADE;
DROP FUNCTION IF EXISTS process_automation_workflow CASCADE;
DROP FUNCTION IF EXISTS send_linkedin_message CASCADE;
DROP FUNCTION IF EXISTS update_automation_status CASCADE;

-- =======================
-- PART 6: Update Indexes
-- =======================

-- Recreate indexes for simplified workflows
DROP INDEX IF EXISTS idx_jobs_qualification_status;
CREATE INDEX idx_jobs_qualification_status ON jobs(qualification_status);

DROP INDEX IF EXISTS idx_people_stage;
CREATE INDEX idx_people_stage ON people(stage);

-- =======================
-- PART 7: Add Comments
-- =======================

COMMENT ON TABLE jobs IS 'Job postings with simplified qualification workflow (new → qualify → skip)';
COMMENT ON TABLE people IS 'People/leads with simplified status workflow (new → qualified → proceed → skip)';
COMMENT ON TABLE companies IS 'Company profiles without automation features';

-- =======================
-- PART 8: Verify Changes
-- =======================

-- Verify the constraints are correct
DO $$
BEGIN
  -- Check jobs table constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'jobs_qualification_status_check'
    AND check_clause LIKE '%new%qualify%skip%'
  ) THEN
    RAISE EXCEPTION 'Jobs qualification status constraint not properly set';
  END IF;
  
  -- Check people table constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'people_stage_check'
    AND check_clause LIKE '%new%qualified%proceed%skip%'
  ) THEN
    RAISE EXCEPTION 'People stage constraint not properly set';
  END IF;
  
  RAISE NOTICE 'All constraints verified successfully';
END $$;
