-- Migration: Align people table with PDR Section 7 requirements
-- Date: 2025-01-28
-- Description: Ensures people table has all PDR-required fields and proper relationships

-- ============================================
-- 1. Ensure people table exists with core fields
-- ============================================
DO $$
BEGIN
  -- Check if people table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables 
                 WHERE table_schema = 'public' 
                 AND table_name = 'people') THEN
    -- Create people table if it doesn't exist
    CREATE TABLE public.people (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT,
      email_address TEXT,
      company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
      company_role TEXT,
      employee_location TEXT,
      linkedin_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- ============================================
-- 2. Add PDR-required fields to people table
-- ============================================
ALTER TABLE public.people
  -- PDR Section 7: Capture Data
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT, -- Company name (text field, separate from company_id)
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS scan_image_url TEXT,
  ADD COLUMN IF NOT EXISTS quality_rank TEXT CHECK (quality_rank IN ('hot', 'warm', 'cold')),
  
  -- PDR Section 7: AI Data
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_icebreaker TEXT,
  
  -- PDR Section 7: System State
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'replied_manual')),
  ADD COLUMN IF NOT EXISTS gmail_thread_id TEXT,
  
  -- Ensure company_id foreign key exists
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- ============================================
-- 3. Migrate existing data
-- ============================================
-- If name exists, try to populate first_name and last_name
UPDATE public.people
SET 
  first_name = CASE 
    WHEN first_name IS NULL AND name IS NOT NULL 
    THEN SPLIT_PART(name, ' ', 1)
    ELSE first_name
  END,
  last_name = CASE 
    WHEN last_name IS NULL AND name IS NOT NULL AND POSITION(' ' IN name) > 0
    THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
    ELSE last_name
  END
WHERE (first_name IS NULL OR last_name IS NULL) AND name IS NOT NULL;

-- If company_id exists but company field is empty, populate from companies table
UPDATE public.people p
SET company = c.name
FROM public.companies c
WHERE p.company_id = c.id 
  AND (p.company IS NULL OR p.company = '');

-- ============================================
-- 4. Ensure companies table exists
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables 
                 WHERE table_schema = 'public' 
                 AND table_name = 'companies') THEN
    CREATE TABLE public.companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      website TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- ============================================
-- 5. Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_people_company_id ON public.people(company_id);
CREATE INDEX IF NOT EXISTS idx_people_email ON public.people(email_address);
CREATE INDEX IF NOT EXISTS idx_people_status ON public.people(status);
CREATE INDEX IF NOT EXISTS idx_people_quality_rank ON public.people(quality_rank);
CREATE INDEX IF NOT EXISTS idx_people_gmail_thread_id ON public.people(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);

-- ============================================
-- 6. Ensure RLS is enabled
-- ============================================
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. RLS Policies for people table
-- ============================================
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own people" ON public.people;
DROP POLICY IF EXISTS "Users can insert own people" ON public.people;
DROP POLICY IF EXISTS "Users can update own people" ON public.people;
DROP POLICY IF EXISTS "Users can delete own people" ON public.people;
DROP POLICY IF EXISTS "Allow all operations on People" ON public.people;

-- Create permissive RLS policies (allowing all operations for now)
-- TODO: Update these to use proper user_id/owner_id checks when auth is implemented
CREATE POLICY "Allow all operations on people" ON public.people
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================
-- 8. RLS Policies for companies table
-- ============================================
DROP POLICY IF EXISTS "Users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all operations on Companies" ON public.companies;

CREATE POLICY "Allow all operations on companies" ON public.companies
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================
-- 9. Update triggers
-- ============================================
-- Ensure update_updated_at_column function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
DROP TRIGGER IF EXISTS update_people_updated_at ON public.people;
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 10. Comments for documentation
-- ============================================
COMMENT ON TABLE public.people IS 'Lead records (aligned with PDR Section 7). Can be linked to companies via company_id.';
COMMENT ON COLUMN public.people.quality_rank IS 'Lead quality: hot (high priority), warm (medium), cold (low)';
COMMENT ON COLUMN public.people.status IS 'System state: processing (AI enrichment), active (in sequence), replied_manual (paused)';
COMMENT ON COLUMN public.people.gmail_thread_id IS 'Gmail thread ID for 2-way email sync';
COMMENT ON COLUMN public.people.company_id IS 'Foreign key to companies table';
COMMENT ON COLUMN public.people.company IS 'Company name (text field, may differ from companies.name)';






















