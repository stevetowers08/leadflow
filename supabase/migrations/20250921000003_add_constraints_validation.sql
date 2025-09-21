-- Migration: Add constraints and data validation
-- Date: 2025-09-21

-- 1. Add check constraints for data validation
-- Companies table constraints
ALTER TABLE "Companies" 
ADD CONSTRAINT check_lead_score_range 
CHECK ("Lead Score" IS NULL OR ("Lead Score" >= 0 AND "Lead Score" <= 100));

ALTER TABLE "Companies" 
ADD CONSTRAINT check_company_name_not_empty 
CHECK ("Company Name" IS NOT NULL AND LENGTH(TRIM("Company Name")) > 0);

-- People table constraints
ALTER TABLE "People" 
ADD CONSTRAINT check_people_name_not_empty 
CHECK ("Name" IS NULL OR LENGTH(TRIM("Name")) > 0);

ALTER TABLE "People" 
ADD CONSTRAINT check_email_format 
CHECK ("Email Address" IS NULL OR "Email Address" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Jobs table constraints
ALTER TABLE "Jobs" 
ADD CONSTRAINT check_job_title_not_empty 
CHECK ("Job Title" IS NULL OR LENGTH(TRIM("Job Title")) > 0);

ALTER TABLE "Jobs" 
ADD CONSTRAINT check_posted_date_valid 
CHECK ("Posted Date" IS NULL OR "Posted Date"::date <= CURRENT_DATE);

-- 2. Add unique constraints where appropriate
-- Ensure company names are unique
ALTER TABLE "Companies" 
ADD CONSTRAINT unique_company_name 
UNIQUE ("Company Name");

-- 3. Add not null constraints for critical fields
ALTER TABLE "Companies" 
ALTER COLUMN "Company Name" SET NOT NULL;

ALTER TABLE "Companies" 
ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE "People" 
ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE "Jobs" 
ALTER COLUMN created_at SET NOT NULL;

-- 4. Add default values for timestamps
ALTER TABLE "Companies" 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE "Companies" 
ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE "People" 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE "People" 
ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE "Jobs" 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE "Jobs" 
ALTER COLUMN updated_at SET DEFAULT NOW();
