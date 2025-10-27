-- Simplify source tracking to one field
-- Migration: simplify_source_tracking
-- Date: 2025-10-22
-- Description: Add a simple 'source' field and populate it based on existing data

-- Add simple source field
ALTER TABLE companies ADD COLUMN IF NOT EXISTS source TEXT;

-- Update based on existing fields
UPDATE companies 
SET source = CASE
  WHEN added_manually = true THEN 'manual'
  WHEN source_job_id IS NOT NULL THEN 'job'
  WHEN lead_source IS NOT NULL THEN lead_source
  ELSE 'unknown'
END;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_companies_source ON companies(source);

-- Comments
COMMENT ON COLUMN companies.source IS 'Source of company: linkedin, indeed, seek, manual, job, referral, etc.';

