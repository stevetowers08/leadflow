-- Add missing fields to jobs table
-- Migration: add_jobs_missing_fields
-- Date: 2024-12-24

-- Add missing fields to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS lead_score_job INTEGER,
ADD COLUMN IF NOT EXISTS salary TEXT,
ADD COLUMN IF NOT EXISTS function TEXT,
ADD COLUMN IF NOT EXISTS linkedin_job_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority);
CREATE INDEX IF NOT EXISTS idx_jobs_lead_score_job ON jobs(lead_score_job);
CREATE INDEX IF NOT EXISTS idx_jobs_function ON jobs(function);
CREATE INDEX IF NOT EXISTS idx_jobs_linkedin_job_id ON jobs(linkedin_job_id);

-- Add comments for documentation
COMMENT ON COLUMN jobs.priority IS 'Job priority level for outreach';
COMMENT ON COLUMN jobs.lead_score_job IS 'Job-specific lead score (separate from company lead score)';
COMMENT ON COLUMN jobs.salary IS 'Salary information for the job';
COMMENT ON COLUMN jobs.function IS 'Job function/department (e.g., Engineering, Sales, Marketing)';
COMMENT ON COLUMN jobs.linkedin_job_id IS 'LinkedIn job posting ID for integration';
COMMENT ON COLUMN jobs.logo_url IS 'URL to company logo for this job';



