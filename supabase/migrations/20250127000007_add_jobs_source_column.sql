-- Migration: Add source column to jobs table
-- Date: 2025-01-27
-- Description: Add source field to track where jobs come from and set all existing jobs to LinkedIn

-- Add source column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS source TEXT;

-- Set all existing jobs to have source = 'LinkedIn'
UPDATE jobs 
SET source = 'LinkedIn'
WHERE source IS NULL;

-- Set default for future jobs
ALTER TABLE jobs 
ALTER COLUMN source SET DEFAULT 'LinkedIn';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);

-- Add comment for documentation
COMMENT ON COLUMN jobs.source IS 'Source of job: LinkedIn, Indeed, Seek, company_website, manual, etc.';

