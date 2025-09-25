-- Add missing fields to companies table
-- Migration: add_company_missing_fields
-- Date: 2024-12-24

-- Add missing fields to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_favourite BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_priority ON companies(priority);
CREATE INDEX IF NOT EXISTS idx_companies_favourite ON companies(is_favourite);

-- Add comments for documentation
COMMENT ON COLUMN companies.industry IS 'Company industry/sector';
COMMENT ON COLUMN companies.company_size IS 'Company size (e.g., 1-10, 11-50, 51-200, etc.)';
COMMENT ON COLUMN companies.priority IS 'Business priority level for this company';
COMMENT ON COLUMN companies.profile_image_url IS 'URL to company logo/profile image';
COMMENT ON COLUMN companies.is_favourite IS 'User bookmark/favourite status';


