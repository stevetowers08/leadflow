-- Migration: Normalize data types and improve consistency
-- Date: 2025-09-21

-- 1. Update Companies table to use proper foreign keys
-- First, populate company_size_id from company_sizes table
UPDATE "Companies" 
SET company_size_id = (
  SELECT cs.id 
  FROM company_sizes cs 
  WHERE cs.name = "Companies"."Company Size"
  LIMIT 1
)
WHERE "Company Size" IS NOT NULL;

-- 2. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_industry_id ON "Companies"(industry_id);
CREATE INDEX IF NOT EXISTS idx_companies_priority_enum ON "Companies"(priority_enum);
CREATE INDEX IF NOT EXISTS idx_companies_status_enum ON "Companies"(status_enum);
CREATE INDEX IF NOT EXISTS idx_companies_lead_score ON "Companies"("Lead Score");

-- 3. Add indexes for People table
CREATE INDEX IF NOT EXISTS idx_people_stage_enum ON "People"(stage_enum);
CREATE INDEX IF NOT EXISTS idx_people_priority_enum ON "People"(priority_enum);
CREATE INDEX IF NOT EXISTS idx_people_automation_status ON "People"(automation_status_enum);
CREATE INDEX IF NOT EXISTS idx_people_lead_score ON "People"("Lead Score");

-- 4. Add indexes for Jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_status_enum ON "Jobs"(status_enum);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON "Jobs"(employment_type_enum);
CREATE INDEX IF NOT EXISTS idx_jobs_seniority_level ON "Jobs"(seniority_level_enum);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON "Jobs"("Posted Date");

-- 5. Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_companies_status_priority ON "Companies"(status_enum, priority_enum);
CREATE INDEX IF NOT EXISTS idx_people_company_stage ON "People"(company_id, stage_enum);
CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON "Jobs"(company_id, status_enum);
