-- Migration: Add show name and show date to leads table
-- Date: 2025-02-25
-- Description: Adds exhibition show tracking fields directly to leads table
-- 
-- Best Practices Applied:
-- ✅ Simple denormalized approach (show_name + show_date) for fast queries
-- ✅ Indexes on both fields for filtering
-- ✅ Composite index for common query pattern (show_name + show_date)
-- ✅ NULL allowed for leads not from exhibitions
-- ✅ Proper column comments for documentation

-- ============================================
-- Add show fields to leads table
-- ============================================
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS show_name TEXT,
  ADD COLUMN IF NOT EXISTS show_date DATE;

-- ============================================
-- Indexes for Performance
-- ============================================
-- Individual indexes for filtering by show name or date
CREATE INDEX IF NOT EXISTS idx_leads_show_name ON public.leads(show_name) WHERE show_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_show_date ON public.leads(show_date) WHERE show_date IS NOT NULL;

-- Composite index for common query: "Get all leads from Tech Expo 2025"
-- Partial index (WHERE clause) reduces index size by excluding NULL values
CREATE INDEX IF NOT EXISTS idx_leads_show_name_date ON public.leads(show_name, show_date) 
  WHERE show_name IS NOT NULL AND show_date IS NOT NULL;

-- ============================================
-- Ensure company_id index exists (if not already present)
-- ============================================
-- Companies table relationship: leads.company_id -> companies.id
-- This index is critical for JOIN performance
CREATE INDEX IF NOT EXISTS idx_leads_company_id ON public.leads(company_id) WHERE company_id IS NOT NULL;

-- ============================================
-- Comments
-- ============================================
COMMENT ON COLUMN public.leads.show_name IS 'Name of the exhibition/show where this lead was captured. NULL for non-exhibition leads.';
COMMENT ON COLUMN public.leads.show_date IS 'Date of the exhibition/show where this lead was captured. NULL for non-exhibition leads.';

