-- Migration: Link companies to shows (many-to-many relationship)
-- Date: 2025-02-26
-- Description: Creates junction table to track which companies are present at which shows

-- ============================================
-- Create show_companies junction table
-- ============================================
CREATE TABLE IF NOT EXISTS public.show_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(show_id, company_id)
);

-- ============================================
-- Enable RLS on show_companies
-- ============================================
ALTER TABLE public.show_companies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for show_companies
-- ============================================
DROP POLICY IF EXISTS "Users can view show companies" ON public.show_companies;
DROP POLICY IF EXISTS "Users can insert show companies" ON public.show_companies;
DROP POLICY IF EXISTS "Users can delete show companies" ON public.show_companies;

-- Users can view if they own the show
CREATE POLICY "Users can view show companies" ON public.show_companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shows
      WHERE shows.id = show_companies.show_id
      AND shows.owner_id = auth.uid()
    )
  );

-- Users can insert if they own the show
CREATE POLICY "Users can insert show companies" ON public.show_companies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shows
      WHERE shows.id = show_companies.show_id
      AND shows.owner_id = auth.uid()
    )
  );

-- Users can delete if they own the show
CREATE POLICY "Users can delete show companies" ON public.show_companies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shows
      WHERE shows.id = show_companies.show_id
      AND shows.owner_id = auth.uid()
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_show_companies_show_id ON public.show_companies(show_id);
CREATE INDEX IF NOT EXISTS idx_show_companies_company_id ON public.show_companies(company_id);

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE public.show_companies IS 'Junction table linking companies to shows (many-to-many)';
COMMENT ON COLUMN public.show_companies.show_id IS 'Foreign key to shows table';
COMMENT ON COLUMN public.show_companies.company_id IS 'Foreign key to companies table';



