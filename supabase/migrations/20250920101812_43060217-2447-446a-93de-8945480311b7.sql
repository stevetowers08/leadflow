-- Update jobs table to match the new structure
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS logo text,
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS function text,
ADD COLUMN IF NOT EXISTS lead_score integer,
ADD COLUMN IF NOT EXISTS score_reason text,
ADD COLUMN IF NOT EXISTS posted_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS valid_through date,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';

-- Update existing columns if needed
ALTER TABLE public.jobs 
ALTER COLUMN location SET DEFAULT NULL,
ALTER COLUMN type DROP DEFAULT,
ALTER COLUMN status SET DEFAULT 'active';

COMMENT ON COLUMN public.jobs.logo IS 'URL or path to company logo';
COMMENT ON COLUMN public.jobs.industry IS 'Industry category';
COMMENT ON COLUMN public.jobs.function IS 'Job function/department';
COMMENT ON COLUMN public.jobs.lead_score IS 'Lead scoring value';
COMMENT ON COLUMN public.jobs.score_reason IS 'Reason for the lead score from company data';
COMMENT ON COLUMN public.jobs.posted_date IS 'Date when job was posted';
COMMENT ON COLUMN public.jobs.valid_through IS 'Date until when job posting is valid';
COMMENT ON COLUMN public.jobs.priority IS 'Job priority level (low, medium, high)';