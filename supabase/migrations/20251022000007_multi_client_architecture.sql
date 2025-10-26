-- Migration: multi_client_architecture
-- Date: 2025-10-22
-- Description: Implements multi-client architecture with master tables and client-specific qualification tables

-- =======================
-- PART 1: Create Decision Makers Master Table
-- =======================

-- Create decision_makers table (master table for all decision makers)
CREATE TABLE IF NOT EXISTS decision_makers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  linkedin_url TEXT,
  company_id UUID REFERENCES companies(id),
  job_title TEXT,
  seniority_level TEXT CHECK (seniority_level IN ('c_level', 'vp', 'director', 'manager', 'individual_contributor')),
  location TEXT,
  phone TEXT,
  is_decision_maker BOOLEAN DEFAULT false,
  hiring_authority BOOLEAN DEFAULT false,
  budget_authority BOOLEAN DEFAULT false,
  decision_maker_level TEXT CHECK (decision_maker_level IN ('c_level', 'vp', 'director', 'manager', 'individual_contributor')),
  lead_score TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  source TEXT,
  source_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES user_profiles(id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_decision_makers_company_id ON decision_makers(company_id);
CREATE INDEX IF NOT EXISTS idx_decision_makers_email ON decision_makers(email);
CREATE INDEX IF NOT EXISTS idx_decision_makers_linkedin_url ON decision_makers(linkedin_url);
CREATE INDEX IF NOT EXISTS idx_decision_makers_owner_id ON decision_makers(owner_id);

-- =======================
-- PART 2: Update Existing Tables for Multi-Client Support
-- =======================

-- Add client_id to existing tables for multi-client support
ALTER TABLE companies ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE people ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS client_id UUID;

-- Add indexes for client_id columns
CREATE INDEX IF NOT EXISTS idx_companies_client_id ON companies(client_id);
CREATE INDEX IF NOT EXISTS idx_people_client_id ON people(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);

-- =======================
-- PART 3: Create Client-Specific Qualification Tables
-- =======================

-- Client Companies (client's qualified companies)
CREATE TABLE IF NOT EXISTS client_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_by UUID REFERENCES user_profiles(id),
  qualification_notes TEXT,
  qualification_status TEXT CHECK (qualification_status IN ('new', 'qualify', 'skip')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, company_id)
);

-- Client Decision Makers (client's qualified decision makers)
CREATE TABLE IF NOT EXISTS client_decision_makers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  decision_maker_id UUID NOT NULL REFERENCES decision_makers(id) ON DELETE CASCADE,
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_by UUID REFERENCES user_profiles(id),
  qualification_notes TEXT,
  qualification_status TEXT CHECK (qualification_status IN ('new', 'qualify', 'skip')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, decision_maker_id)
);

-- Client People (client's qualified people/leads)
CREATE TABLE IF NOT EXISTS client_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_by UUID REFERENCES user_profiles(id),
  qualification_notes TEXT,
  qualification_status TEXT CHECK (qualification_status IN ('new', 'qualify', 'skip')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, person_id)
);

-- Client Jobs (client's qualified jobs)
CREATE TABLE IF NOT EXISTS client_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_by UUID REFERENCES user_profiles(id),
  qualification_notes TEXT,
  qualification_status TEXT CHECK (qualification_status IN ('new', 'qualify', 'skip')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, job_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_companies_client_id ON client_companies(client_id);
CREATE INDEX IF NOT EXISTS idx_client_companies_company_id ON client_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_client_companies_status ON client_companies(qualification_status);

CREATE INDEX IF NOT EXISTS idx_client_decision_makers_client_id ON client_decision_makers(client_id);
CREATE INDEX IF NOT EXISTS idx_client_decision_makers_decision_maker_id ON client_decision_makers(decision_maker_id);
CREATE INDEX IF NOT EXISTS idx_client_decision_makers_status ON client_decision_makers(qualification_status);

CREATE INDEX IF NOT EXISTS idx_client_people_client_id ON client_people(client_id);
CREATE INDEX IF NOT EXISTS idx_client_people_person_id ON client_people(person_id);
CREATE INDEX IF NOT EXISTS idx_client_people_status ON client_people(qualification_status);

CREATE INDEX IF NOT EXISTS idx_client_jobs_client_id ON client_jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_client_jobs_job_id ON client_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_client_jobs_status ON client_jobs(qualification_status);

-- =======================
-- PART 4: Enable RLS and Create Policies
-- =======================

-- Enable RLS on all tables
ALTER TABLE decision_makers ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_decision_makers ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for decision_makers (master table - accessible to all authenticated users)
CREATE POLICY "Decision makers are viewable by authenticated users" ON decision_makers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Decision makers can be created by authenticated users" ON decision_makers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Decision makers can be updated by authenticated users" ON decision_makers
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for client_companies (client-specific access)
CREATE POLICY "Client companies are viewable by client users" ON client_companies
  FOR SELECT TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client companies can be created by client users" ON client_companies
  FOR INSERT TO authenticated WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client companies can be updated by client users" ON client_companies
  FOR UPDATE TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

-- RLS Policies for client_decision_makers (client-specific access)
CREATE POLICY "Client decision makers are viewable by client users" ON client_decision_makers
  FOR SELECT TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client decision makers can be created by client users" ON client_decision_makers
  FOR INSERT TO authenticated WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client decision makers can be updated by client users" ON client_decision_makers
  FOR UPDATE TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

-- RLS Policies for client_people (client-specific access)
CREATE POLICY "Client people are viewable by client users" ON client_people
  FOR SELECT TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client people can be created by client users" ON client_people
  FOR INSERT TO authenticated WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client people can be updated by client users" ON client_people
  FOR UPDATE TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

-- RLS Policies for client_jobs (client-specific access)
CREATE POLICY "Client jobs are viewable by client users" ON client_jobs
  FOR SELECT TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client jobs can be created by client users" ON client_jobs
  FOR INSERT TO authenticated WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

CREATE POLICY "Client jobs can be updated by client users" ON client_jobs
  FOR UPDATE TO authenticated USING (
    client_id IN (
      SELECT id FROM clients WHERE id = client_id
    )
  );

-- =======================
-- PART 5: Create Helper Functions
-- =======================

-- Function to get client ID from user context
CREATE OR REPLACE FUNCTION get_client_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT client_id FROM user_profiles WHERE id = auth.uid();
$$;

-- Function to qualify a company for a client
CREATE OR REPLACE FUNCTION qualify_company_for_client(
  p_company_id UUID,
  p_client_id UUID,
  p_status TEXT DEFAULT 'qualify',
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_qualification_id UUID;
BEGIN
  INSERT INTO client_companies (client_id, company_id, qualification_status, qualification_notes, qualified_by)
  VALUES (p_client_id, p_company_id, p_status, p_notes, auth.uid())
  ON CONFLICT (client_id, company_id) 
  DO UPDATE SET 
    qualification_status = EXCLUDED.qualification_status,
    qualification_notes = EXCLUDED.qualification_notes,
    qualified_by = EXCLUDED.qualified_by,
    updated_at = NOW()
  RETURNING id INTO v_qualification_id;
  
  RETURN v_qualification_id;
END;
$$;

-- Function to qualify a decision maker for a client
CREATE OR REPLACE FUNCTION qualify_decision_maker_for_client(
  p_decision_maker_id UUID,
  p_client_id UUID,
  p_status TEXT DEFAULT 'qualify',
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_qualification_id UUID;
BEGIN
  INSERT INTO client_decision_makers (client_id, decision_maker_id, qualification_status, qualification_notes, qualified_by)
  VALUES (p_client_id, p_decision_maker_id, p_status, p_notes, auth.uid())
  ON CONFLICT (client_id, decision_maker_id) 
  DO UPDATE SET 
    qualification_status = EXCLUDED.qualification_status,
    qualification_notes = EXCLUDED.qualification_notes,
    qualified_by = EXCLUDED.qualified_by,
    updated_at = NOW()
  RETURNING id INTO v_qualification_id;
  
  RETURN v_qualification_id;
END;
$$;

-- Function to qualify a person for a client
CREATE OR REPLACE FUNCTION qualify_person_for_client(
  p_person_id UUID,
  p_client_id UUID,
  p_status TEXT DEFAULT 'qualify',
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_qualification_id UUID;
BEGIN
  INSERT INTO client_people (client_id, person_id, qualification_status, qualification_notes, qualified_by)
  VALUES (p_client_id, p_person_id, p_status, p_notes, auth.uid())
  ON CONFLICT (client_id, person_id) 
  DO UPDATE SET 
    qualification_status = EXCLUDED.qualification_status,
    qualification_notes = EXCLUDED.qualification_notes,
    qualified_by = EXCLUDED.qualified_by,
    updated_at = NOW()
  RETURNING id INTO v_qualification_id;
  
  RETURN v_qualification_id;
END;
$$;

-- Function to qualify a job for a client
CREATE OR REPLACE FUNCTION qualify_job_for_client(
  p_job_id UUID,
  p_client_id UUID,
  p_status TEXT DEFAULT 'qualify',
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_qualification_id UUID;
BEGIN
  INSERT INTO client_jobs (client_id, job_id, qualification_status, qualification_notes, qualified_by)
  VALUES (p_client_id, p_job_id, p_status, p_notes, auth.uid())
  ON CONFLICT (client_id, job_id) 
  DO UPDATE SET 
    qualification_status = EXCLUDED.qualification_status,
    qualification_notes = EXCLUDED.qualification_notes,
    qualified_by = EXCLUDED.qualified_by,
    updated_at = NOW()
  RETURNING id INTO v_qualification_id;
  
  RETURN v_qualification_id;
END;
$$;

-- =======================
-- PART 6: Create Views for Easy Client Data Access
-- =======================

-- View for client's qualified companies with company details
CREATE OR REPLACE VIEW client_companies_view AS
SELECT 
  cc.*,
  c.name as company_name,
  c.website,
  c.linkedin_url,
  c.head_office,
  c.industry,
  c.company_size,
  c.logo_url,
  c.lead_score as company_lead_score,
  c.confidence_level as company_confidence_level
FROM client_companies cc
JOIN companies c ON cc.company_id = c.id;

-- View for client's qualified decision makers with details
CREATE OR REPLACE VIEW client_decision_makers_view AS
SELECT 
  cdm.*,
  dm.name as decision_maker_name,
  dm.email,
  dm.linkedin_url,
  dm.job_title,
  dm.seniority_level,
  dm.location,
  dm.is_decision_maker,
  dm.hiring_authority,
  dm.budget_authority,
  c.name as company_name,
  c.website as company_website
FROM client_decision_makers cdm
JOIN decision_makers dm ON cdm.decision_maker_id = dm.id
LEFT JOIN companies c ON dm.company_id = c.id;

-- View for client's qualified people with details
CREATE OR REPLACE VIEW client_people_view AS
SELECT 
  cp.*,
  p.name as person_name,
  p.email_address,
  p.linkedin_url,
  p.company_role,
  p.employee_location,
  p.lead_score as person_lead_score,
  c.name as company_name,
  c.website as company_website
FROM client_people cp
JOIN people p ON cp.person_id = p.id
LEFT JOIN companies c ON p.company_id = c.id;

-- View for client's qualified jobs with details
CREATE OR REPLACE VIEW client_jobs_view AS
SELECT 
  cj.*,
  j.title as job_title,
  j.job_url,
  j.location,
  j.description,
  j.employment_type,
  j.seniority_level,
  j.salary,
  j.function,
  c.name as company_name,
  c.website as company_website,
  c.logo_url as company_logo_url
FROM client_jobs cj
JOIN jobs j ON cj.job_id = j.id
LEFT JOIN companies c ON j.company_id = c.id;

-- =======================
-- PART 7: Comments and Documentation
-- =======================

COMMENT ON TABLE decision_makers IS 'Master table containing all decision makers across all clients';
COMMENT ON TABLE client_companies IS 'Client-specific qualified companies - each client only sees their qualified companies';
COMMENT ON TABLE client_decision_makers IS 'Client-specific qualified decision makers - each client only sees their qualified decision makers';
COMMENT ON TABLE client_people IS 'Client-specific qualified people/leads - each client only sees their qualified people';
COMMENT ON TABLE client_jobs IS 'Client-specific qualified jobs - each client only sees their qualified jobs';

COMMENT ON FUNCTION qualify_company_for_client IS 'Qualifies a company for a specific client with status and notes';
COMMENT ON FUNCTION qualify_decision_maker_for_client IS 'Qualifies a decision maker for a specific client with status and notes';
COMMENT ON FUNCTION qualify_person_for_client IS 'Qualifies a person for a specific client with status and notes';
COMMENT ON FUNCTION qualify_job_for_client IS 'Qualifies a job for a specific client with status and notes';

-- =======================
-- Migration Complete
-- =======================
