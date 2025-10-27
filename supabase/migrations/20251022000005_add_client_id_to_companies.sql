-- Add client_id to companies table for client-specific filtering
-- Migration: add_client_id_to_companies
-- Date: 2025-10-22
-- Description: Add client_id column to companies table so each client only sees their qualified companies

-- Add client_id column
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_companies_client_id ON public.companies(client_id);

-- Update RLS policies to enforce client scoping
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable update for all users" ON public.companies;

-- Users can view companies for their clients
CREATE POLICY "Users can view companies for their clients"
  ON public.companies FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Users can create companies for their clients
CREATE POLICY "Users can create companies for their clients"
  ON public.companies FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Users can update companies for their clients
CREATE POLICY "Users can update companies for their clients"
  ON public.companies FOR UPDATE
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Users can delete companies for their clients
CREATE POLICY "Users can delete companies for their clients"
  ON public.companies FOR DELETE
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Comments
COMMENT ON COLUMN public.companies.client_id IS 'The client who qualified this company (NULL for unqualified/global companies)';

