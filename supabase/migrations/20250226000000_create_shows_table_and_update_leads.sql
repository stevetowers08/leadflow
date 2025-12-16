-- Migration: Create shows table and add show_id to leads
-- Date: 2025-02-26
-- Description: Creates shows table for exhibition tracking and adds show_id FK to leads

-- ============================================
-- Create shows table
-- ============================================
CREATE TABLE IF NOT EXISTS public.shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  city TEXT,
  venue TEXT,
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Enable RLS on shows
-- ============================================
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for shows
-- ============================================
DROP POLICY IF EXISTS "Users can view own shows" ON public.shows;
DROP POLICY IF EXISTS "Users can insert own shows" ON public.shows;
DROP POLICY IF EXISTS "Users can update own shows" ON public.shows;
DROP POLICY IF EXISTS "Users can delete own shows" ON public.shows;

CREATE POLICY "Users can view own shows" ON public.shows
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own shows" ON public.shows
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own shows" ON public.shows
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own shows" ON public.shows
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- Indexes for shows
-- ============================================
CREATE INDEX IF NOT EXISTS idx_shows_owner_id ON public.shows(owner_id);
CREATE INDEX IF NOT EXISTS idx_shows_status ON public.shows(status);
CREATE INDEX IF NOT EXISTS idx_shows_start_date ON public.shows(start_date);
CREATE INDEX IF NOT EXISTS idx_shows_name ON public.shows(name);

-- ============================================
-- Add show_id to leads table
-- ============================================
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS show_id UUID REFERENCES public.shows(id) ON DELETE SET NULL;

-- Index for show_id
CREATE INDEX IF NOT EXISTS idx_leads_show_id ON public.leads(show_id) WHERE show_id IS NOT NULL;

-- ============================================
-- Update trigger for shows
-- ============================================
DROP TRIGGER IF EXISTS update_shows_updated_at ON public.shows;
CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON public.shows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE public.shows IS 'Exhibition shows/events where leads are captured';
COMMENT ON COLUMN public.shows.status IS 'Show status: upcoming, live, or ended';
COMMENT ON COLUMN public.leads.show_id IS 'Foreign key to shows table (replaces show_name/show_date for normalized data)';

