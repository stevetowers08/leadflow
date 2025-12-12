-- LeadFlow PDR Schema Migration
-- Aligns database schema with PDR Section 7 requirements
-- Date: 2025-01-27

-- ============================================
-- 1. Profiles Table (API Keys Storage)
-- ============================================
-- Stores encrypted API keys for integrations
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lemlist_api_key TEXT, -- Encrypted
  gmail_access_token TEXT, -- Encrypted
  gmail_refresh_token TEXT, -- Encrypted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. Leads Table (Core Record - PDR Section 7)
-- ============================================
-- Note: This may conflict with existing 'leads' table
-- If 'leads' exists, we'll add missing columns instead
DO $$
BEGIN
  -- Check if leads table exists
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'leads') THEN
    -- Add missing columns to existing leads table
    ALTER TABLE public.leads
      ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id),
      ADD COLUMN IF NOT EXISTS first_name TEXT,
      ADD COLUMN IF NOT EXISTS last_name TEXT,
      ADD COLUMN IF NOT EXISTS company TEXT,
      ADD COLUMN IF NOT EXISTS job_title TEXT,
      ADD COLUMN IF NOT EXISTS scan_image_url TEXT,
      ADD COLUMN IF NOT EXISTS quality_rank TEXT CHECK (quality_rank IN ('hot', 'warm', 'cold')),
      ADD COLUMN IF NOT EXISTS ai_summary TEXT,
      ADD COLUMN IF NOT EXISTS ai_icebreaker TEXT,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'replied_manual')),
      ADD COLUMN IF NOT EXISTS gmail_thread_id TEXT;
    
    -- If 'name' exists, split into first_name and last_name
    DO $$
    DECLARE
      name_col_exists BOOLEAN;
    BEGIN
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'leads' 
        AND column_name = 'name'
      ) INTO name_col_exists;
      
      IF name_col_exists THEN
        -- Try to split name into first_name and last_name
        UPDATE public.leads
        SET 
          first_name = SPLIT_PART(name, ' ', 1),
          last_name = CASE 
            WHEN POSITION(' ' IN name) > 0 
            THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
            ELSE NULL
          END
        WHERE first_name IS NULL AND name IS NOT NULL;
      END IF;
    END $$;
  ELSE
    -- Create new leads table per PDR
    CREATE TABLE public.leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES public.profiles(id),
      -- Capture Data
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      company TEXT,
      job_title TEXT,
      scan_image_url TEXT,
      quality_rank TEXT CHECK (quality_rank IN ('hot', 'warm', 'cold')),
      -- AI Data
      ai_summary TEXT,
      ai_icebreaker TEXT,
      -- System State
      status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'replied_manual')),
      gmail_thread_id TEXT, -- For 2-Way Sync
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own leads
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. Emails Table (Inbox View - PDR Section 7)
-- ============================================
CREATE TABLE IF NOT EXISTS public.emails (
  id TEXT PRIMARY KEY, -- Gmail Message ID
  thread_id TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  snippet TEXT,
  body_html TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on emails
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see emails for their leads
CREATE POLICY "Users can view own emails" ON public.emails
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = emails.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own emails" ON public.emails
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = emails.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

-- ============================================
-- 4. Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_quality_rank ON public.leads(quality_rank);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_gmail_thread_id ON public.leads(gmail_thread_id);

CREATE INDEX IF NOT EXISTS idx_emails_lead_id ON public.emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_emails_thread_id ON public.emails(thread_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_at ON public.emails(sent_at);

-- ============================================
-- 5. Update Triggers
-- ============================================
-- Create or replace update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. Comments for Documentation
-- ============================================
COMMENT ON TABLE public.profiles IS 'Stores encrypted API keys for Lemlist and Gmail integrations';
COMMENT ON TABLE public.leads IS 'Core lead record from business card scans with AI enrichment';
COMMENT ON TABLE public.emails IS 'Email messages synced from Gmail for inbox view';

COMMENT ON COLUMN public.leads.quality_rank IS 'Lead quality: hot (high priority), warm (medium), cold (low)';
COMMENT ON COLUMN public.leads.status IS 'System state: processing (AI enrichment), active (in sequence), replied_manual (paused)';
COMMENT ON COLUMN public.leads.gmail_thread_id IS 'Gmail thread ID for 2-way email sync';
COMMENT ON COLUMN public.emails.direction IS 'Email direction: inbound (from lead) or outbound (to lead)';








