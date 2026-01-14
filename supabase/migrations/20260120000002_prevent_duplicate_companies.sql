-- Prevent duplicate companies by adding unique constraint on name (case-insensitive)
-- Migration: prevent_duplicate_companies
-- Date: 2026-01-20
-- Description: Adds unique constraint on LOWER(name) to prevent case-insensitive duplicates

-- Step 1: Clean up existing duplicates by keeping the oldest record and merging data
-- This handles duplicates that may already exist in the database
DO $$
DECLARE
  duplicate_record RECORD;
  kept_id UUID;
BEGIN
  -- Find duplicate company names (case-insensitive)
  FOR duplicate_record IN
    SELECT LOWER(name) as lower_name, array_agg(id ORDER BY created_at ASC) as ids
    FROM companies
    WHERE name IS NOT NULL
    GROUP BY LOWER(name)
    HAVING COUNT(*) > 1
  LOOP
    -- Keep the first (oldest) record
    kept_id := duplicate_record.ids[1];
    
    -- Update all foreign key references to point to the kept record
    -- Update leads table
    UPDATE leads SET company_id = kept_id 
    WHERE company_id = ANY(duplicate_record.ids[2:array_length(duplicate_record.ids, 1)])
      AND company_id != kept_id;
    
    -- Update people table (if it exists and has company_id)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'people' AND column_name = 'company_id') THEN
      UPDATE people SET company_id = kept_id 
      WHERE company_id = ANY(duplicate_record.ids[2:array_length(duplicate_record.ids, 1)])
        AND company_id != kept_id;
    END IF;
    
    -- Update show_companies table
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'show_companies') THEN
      UPDATE show_companies SET company_id = kept_id 
      WHERE company_id = ANY(duplicate_record.ids[2:array_length(duplicate_record.ids, 1)])
        AND company_id != kept_id;
    END IF;
    
    -- Update client_companies table
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'client_companies') THEN
      UPDATE client_companies SET company_id = kept_id 
      WHERE company_id = ANY(duplicate_record.ids[2:array_length(duplicate_record.ids, 1)])
        AND company_id != kept_id;
    END IF;
    
    -- Update decision_makers table
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'decision_makers') THEN
      UPDATE decision_makers SET company_id = kept_id 
      WHERE company_id = ANY(duplicate_record.ids[2:array_length(duplicate_record.ids, 1)])
        AND company_id != kept_id;
    END IF;
    
    -- Delete duplicate records (keeping only the oldest one)
    DELETE FROM companies 
    WHERE id = ANY(duplicate_record.ids[2:array_length(duplicate_record.ids, 1)]);
  END LOOP;
END $$;

-- Step 2: Create a unique index on LOWER(name) to prevent future duplicates
-- This ensures case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_name_unique_lower 
ON companies(LOWER(name))
WHERE name IS NOT NULL;

-- Step 3: Add a comment explaining the constraint
COMMENT ON INDEX idx_companies_name_unique_lower IS 
'Ensures company names are unique case-insensitively. Prevents duplicate companies like "Microsoft" and "MICROSOFT".';
