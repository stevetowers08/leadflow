-- Rename ai_info to ai_company_intelligence and add new AI JSONB fields
-- Safe-guard: only rename if column exists and target doesn't
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'ai_info'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'ai_company_intelligence'
  ) THEN
    EXECUTE 'ALTER TABLE public.companies RENAME COLUMN ai_info TO ai_company_intelligence';
  END IF;
END $$;

-- Add ai_marketi_info if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'ai_marketi_info'
  ) THEN
    EXECUTE 'ALTER TABLE public.companies ADD COLUMN ai_marketi_info JSONB';
  END IF;
END $$;

-- Add ai_funding if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'ai_funding'
  ) THEN
    EXECUTE 'ALTER TABLE public.companies ADD COLUMN ai_funding JSONB';
  END IF;
END $$;

-- Add ai_new_location if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'ai_new_location'
  ) THEN
    EXECUTE 'ALTER TABLE public.companies ADD COLUMN ai_new_location JSONB';
  END IF;
END $$;


