-- Add foreign key columns for proper relationships
ALTER TABLE "People" ADD COLUMN company_id uuid;
ALTER TABLE "Jobs" ADD COLUMN company_id uuid;

-- Create foreign key constraints
ALTER TABLE "People" ADD CONSTRAINT people_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES "Companies"(id) ON DELETE SET NULL;

ALTER TABLE "Jobs" ADD CONSTRAINT jobs_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES "Companies"(id) ON DELETE SET NULL;

-- Update existing records to link by company name
UPDATE "People" 
SET company_id = (
  SELECT c.id 
  FROM "Companies" c 
  WHERE c."Company Name" = "People"."Company"
  LIMIT 1
)
WHERE "Company" IS NOT NULL;

UPDATE "Jobs" 
SET company_id = (
  SELECT c.id 
  FROM "Companies" c 
  WHERE c."Company Name" = "Jobs"."Company"
  LIMIT 1
)
WHERE "Company" IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX idx_people_company_id ON "People"(company_id);
CREATE INDEX idx_jobs_company_id ON "Jobs"(company_id);