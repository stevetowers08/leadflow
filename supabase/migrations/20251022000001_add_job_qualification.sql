-- Add job qualification fields to jobs table
-- This allows tracking of job qualification status and details

-- Add qualification fields
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS qualified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS qualified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS qualified_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS qualification_notes text,
ADD COLUMN IF NOT EXISTS qualification_status text CHECK (qualification_status IN ('new', 'qualified', 'not_qualified', 'needs_review'));

-- Set default status for existing jobs
UPDATE jobs 
SET qualification_status = 'new' 
WHERE qualification_status IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_qualification_status ON jobs(qualification_status);
CREATE INDEX IF NOT EXISTS idx_jobs_qualified ON jobs(qualified);
CREATE INDEX IF NOT EXISTS idx_jobs_qualified_by ON jobs(qualified_by);

-- Add comment for documentation
COMMENT ON COLUMN jobs.qualified IS 'Whether the job has been qualified';
COMMENT ON COLUMN jobs.qualified_at IS 'Timestamp when job was qualified';
COMMENT ON COLUMN jobs.qualified_by IS 'User who qualified the job';
COMMENT ON COLUMN jobs.qualification_notes IS 'Notes about job qualification';
COMMENT ON COLUMN jobs.qualification_status IS 'Current qualification status: new, qualified, not_qualified, needs_review';
