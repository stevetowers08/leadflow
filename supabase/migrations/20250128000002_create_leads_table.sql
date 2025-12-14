-- Migration: Create leads table (simple, direct creation)
-- Date: 2025-01-28
-- Description: Creates leads table per PDR Section 7 if it doesn't exist

-- ============================================
-- Create leads table per PDR Section 7
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Capture Data (PDR Section 7)
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  company TEXT,
  job_title TEXT,
  scan_image_url TEXT,
  quality_rank TEXT CHECK (quality_rank IN ('hot', 'warm', 'cold')),
  -- AI Data (PDR Section 7)
  ai_summary TEXT,
  ai_icebreaker TEXT,
  -- System State (PDR Section 7)
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'replied_manual')),
  gmail_thread_id TEXT, -- For 2-Way Sync
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Drop existing policies if they exist
-- ============================================
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;

-- ============================================
-- RLS Policies
-- ============================================
-- Allow users to view their own leads
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own leads
CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own leads
CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own leads
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_quality_rank ON public.leads(quality_rank);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_gmail_thread_id ON public.leads(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- ============================================
-- Update Trigger
-- ============================================
-- Ensure update_updated_at_column function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update trigger
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE public.leads IS 'Core lead record from business card scans with AI enrichment (PDR Section 7)';
COMMENT ON COLUMN public.leads.quality_rank IS 'Lead quality: hot (high priority), warm (medium), cold (low)';
COMMENT ON COLUMN public.leads.status IS 'System state: processing (AI enrichment), active (in sequence), replied_manual (paused)';
COMMENT ON COLUMN public.leads.gmail_thread_id IS 'Gmail thread ID for 2-way email sync';















