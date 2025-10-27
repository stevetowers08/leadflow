-- Create client_companies association table
-- Migration: create_client_companies_table
-- Date: 2025-10-22
-- Description: Creates association table to link companies to clients
--              This allows multiple clients to qualify the same company globally

CREATE TABLE IF NOT EXISTS public.client_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  qualification_status TEXT NOT NULL DEFAULT 'qualify'
    CHECK (qualification_status IN ('qualify', 'skip')),
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_by UUID REFERENCES auth.users(id),
  qualification_notes TEXT,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, company_id)
);

-- Enable RLS
ALTER TABLE public.client_companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_companies
-- Users can view companies for their clients
CREATE POLICY "Users can view client companies for their clients"
  ON public.client_companies FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Users can create client companies for their clients
CREATE POLICY "Users can create client companies for their clients"
  ON public.client_companies FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Users can update their client companies
CREATE POLICY "Users can update their client companies"
  ON public.client_companies FOR UPDATE
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Users can delete their client companies
CREATE POLICY "Users can delete their client companies"
  ON public.client_companies FOR DELETE
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_client_companies_client_id ON public.client_companies(client_id);
CREATE INDEX idx_client_companies_company_id ON public.client_companies(company_id);
CREATE INDEX idx_client_companies_status ON public.client_companies(qualification_status);
CREATE INDEX idx_client_companies_qualified_at ON public.client_companies(qualified_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_client_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_client_companies_updated_at 
  BEFORE UPDATE ON public.client_companies
  FOR EACH ROW 
  EXECUTE FUNCTION update_client_companies_updated_at();

-- Comments
COMMENT ON TABLE public.client_companies IS 'Association table linking companies to clients - allows multiple clients to qualify the same company';
COMMENT ON COLUMN public.client_companies.client_id IS 'The client who qualified this company';
COMMENT ON COLUMN public.client_companies.company_id IS 'The company that was qualified (global companies table)';
COMMENT ON COLUMN public.client_companies.qualification_status IS 'Whether company was qualified or skipped';
COMMENT ON COLUMN public.client_companies.qualified_at IS 'When the company was qualified';
COMMENT ON COLUMN public.client_companies.qualified_by IS 'User who qualified the company';

