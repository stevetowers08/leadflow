-- Add financial tracking fields to companies table
-- Migration: add_company_financial_fields
-- Date: 2025-01-30
-- Description: Adds funding_raised and estimated_arr fields to track company financial information

-- ========================
-- PART 1: Add funding_raised column
-- ========================

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS funding_raised NUMERIC(15, 2);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_companies_funding_raised ON public.companies(funding_raised);

-- ========================
-- PART 2: Add estimated_arr column
-- ========================

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS estimated_arr NUMERIC(15, 2);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_companies_estimated_arr ON public.companies(estimated_arr);

-- ========================
-- PART 3: Comments
-- ========================

COMMENT ON COLUMN public.companies.funding_raised IS 'Total funding raised by the company (in USD)';
COMMENT ON COLUMN public.companies.estimated_arr IS 'Estimated Annual Recurring Revenue (in USD)';

