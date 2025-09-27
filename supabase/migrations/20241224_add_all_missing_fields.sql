-- Add ALL missing fields from Airtable to Supabase
-- Migration: add_all_missing_fields
-- Date: 2024-12-24
-- Description: Adds all important fields from Airtable that are missing in Supabase

-- ==============================================
-- COMPANIES TABLE ADDITIONS
-- ==============================================
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_favourite BOOLEAN DEFAULT FALSE;

-- Company indexes
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_priority ON companies(priority);
CREATE INDEX IF NOT EXISTS idx_companies_favourite ON companies(is_favourite);

-- ==============================================
-- PEOPLE TABLE ADDITIONS
-- ==============================================
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS email_draft TEXT,
ADD COLUMN IF NOT EXISTS connection_request_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS connection_accepted_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS message_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS meeting_booked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS meeting_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_reply_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stage_updated TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_favourite BOOLEAN DEFAULT FALSE;

-- People indexes
CREATE INDEX IF NOT EXISTS idx_people_confidence_level ON people(confidence_level);
CREATE INDEX IF NOT EXISTS idx_people_meeting_booked ON people(meeting_booked);
CREATE INDEX IF NOT EXISTS idx_people_meeting_date ON people(meeting_date);
CREATE INDEX IF NOT EXISTS idx_people_connection_request_date ON people(connection_request_date);
CREATE INDEX IF NOT EXISTS idx_people_response_date ON people(response_date);
CREATE INDEX IF NOT EXISTS idx_people_favourite ON people(is_favourite);

-- ==============================================
-- JOBS TABLE ADDITIONS
-- ==============================================
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS lead_score_job INTEGER,
ADD COLUMN IF NOT EXISTS salary TEXT,
ADD COLUMN IF NOT EXISTS function TEXT,
ADD COLUMN IF NOT EXISTS linkedin_job_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority);
CREATE INDEX IF NOT EXISTS idx_jobs_lead_score_job ON jobs(lead_score_job);
CREATE INDEX IF NOT EXISTS idx_jobs_function ON jobs(function);
CREATE INDEX IF NOT EXISTS idx_jobs_linkedin_job_id ON jobs(linkedin_job_id);

-- ==============================================
-- COMMENTS FOR DOCUMENTATION
-- ==============================================

-- Company field comments
COMMENT ON COLUMN companies.industry IS 'Company industry/sector';
COMMENT ON COLUMN companies.company_size IS 'Company size (e.g., 1-10, 11-50, 51-200, etc.)';
COMMENT ON COLUMN companies.priority IS 'Business priority level for this company';
COMMENT ON COLUMN companies.profile_image_url IS 'URL to company logo/profile image';
COMMENT ON COLUMN companies.is_favourite IS 'User bookmark/favourite status';

-- People field comments
COMMENT ON COLUMN people.confidence_level IS 'Lead confidence/quality level';
COMMENT ON COLUMN people.email_draft IS 'Draft email content for this lead';
COMMENT ON COLUMN people.connection_request_date IS 'When LinkedIn connection request was sent';
COMMENT ON COLUMN people.connection_accepted_date IS 'When LinkedIn connection was accepted';
COMMENT ON COLUMN people.message_sent_date IS 'When LinkedIn message was sent';
COMMENT ON COLUMN people.response_date IS 'When lead responded to outreach';
COMMENT ON COLUMN people.meeting_booked IS 'Whether a meeting has been booked';
COMMENT ON COLUMN people.meeting_date IS 'Scheduled meeting date';
COMMENT ON COLUMN people.email_sent_date IS 'When email was sent to lead';
COMMENT ON COLUMN people.email_reply_date IS 'When lead replied to email';
COMMENT ON COLUMN people.stage_updated IS 'When the lead stage was last updated';
COMMENT ON COLUMN people.is_favourite IS 'User bookmark/favourite status';

-- Jobs field comments
COMMENT ON COLUMN jobs.priority IS 'Job priority level for outreach';
COMMENT ON COLUMN jobs.lead_score_job IS 'Job-specific lead score (separate from company lead score)';
COMMENT ON COLUMN jobs.salary IS 'Salary information for the job';
COMMENT ON COLUMN jobs.function IS 'Job function/department (e.g., Engineering, Sales, Marketing)';
COMMENT ON COLUMN jobs.linkedin_job_id IS 'LinkedIn job posting ID for integration';
COMMENT ON COLUMN jobs.logo_url IS 'URL to company logo for this job';



