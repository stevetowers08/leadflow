-- Enhanced Organization RLS Policies
-- Migration: enhance_organization_rls_policies
-- Date: 2025-01-31
-- Description: Implements 2025 best practices for multi-tenant RLS with helper functions and proper indexing

-- =======================
-- PART 1: Helper Functions (SECURITY DEFINER for efficiency)
-- =======================

-- Get user's organization IDs (cached for performance)
CREATE OR REPLACE FUNCTION get_user_organization_ids(user_uuid UUID)
RETURNS TABLE(organization_id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT cu.client_id
  FROM public.client_users cu
  WHERE cu.user_id = user_uuid;
END;
$$;

-- Get current user's active organization ID
CREATE OR REPLACE FUNCTION get_current_organization_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_org_id UUID;
BEGIN
  -- First try to get from user_profiles.default_client_id
  SELECT default_client_id INTO v_org_id
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  -- If not set, get first organization from client_users
  IF v_org_id IS NULL THEN
    SELECT client_id INTO v_org_id
    FROM public.client_users
    WHERE user_id = auth.uid()
    LIMIT 1;
  END IF;
  
  RETURN v_org_id;
END;
$$;

-- Check if user has access to organization
CREATE OR REPLACE FUNCTION user_has_organization_access(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.client_users
    WHERE user_id = auth.uid()
    AND client_id = org_id
  );
END;
$$;

-- =======================
-- PART 2: Enhanced Indexes for Performance
-- =======================

-- Index on client_id columns (critical for RLS performance)
CREATE INDEX IF NOT EXISTS idx_companies_client_id ON public.companies(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_people_client_id ON public.people(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_client_id ON public.interactions(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON public.campaigns(client_id) WHERE client_id IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_companies_client_owner ON public.companies(client_id, owner_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_people_client_owner ON public.people(client_id, owner_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_client_owner ON public.jobs(client_id, owner_id) WHERE client_id IS NOT NULL;

-- =======================
-- PART 3: Enhanced RLS Policies for Core Tables
-- =======================

-- Companies: Organization-scoped access
DROP POLICY IF EXISTS "Users can view companies for their clients" ON public.companies;
DROP POLICY IF EXISTS "Users can create companies for their clients" ON public.companies;
DROP POLICY IF EXISTS "Users can update companies for their clients" ON public.companies;
DROP POLICY IF EXISTS "Users can delete companies for their clients" ON public.companies;

CREATE POLICY "organization_companies_select" ON public.companies
  FOR SELECT
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
    OR client_id IS NULL -- Allow viewing unassigned companies
  );

CREATE POLICY "organization_companies_insert" ON public.companies
  FOR INSERT
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_companies_update" ON public.companies
  FOR UPDATE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  )
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_companies_delete" ON public.companies
  FOR DELETE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

-- People: Organization-scoped access
DROP POLICY IF EXISTS "Authenticated users can view people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can insert people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can update people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can delete people" ON public.people;

CREATE POLICY "organization_people_select" ON public.people
  FOR SELECT
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
    OR client_id IS NULL -- Allow viewing unassigned people
  );

CREATE POLICY "organization_people_insert" ON public.people
  FOR INSERT
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_people_update" ON public.people
  FOR UPDATE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  )
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_people_delete" ON public.people
  FOR DELETE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

-- Jobs: Organization-scoped access
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON public.jobs;

CREATE POLICY "organization_jobs_select" ON public.jobs
  FOR SELECT
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
    OR client_id IS NULL -- Allow viewing unassigned jobs
  );

CREATE POLICY "organization_jobs_insert" ON public.jobs
  FOR INSERT
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_jobs_update" ON public.jobs
  FOR UPDATE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  )
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_jobs_delete" ON public.jobs
  FOR DELETE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

-- Interactions: Organization-scoped access
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_interactions_client_id ON public.interactions(client_id) WHERE client_id IS NOT NULL;

DROP POLICY IF EXISTS "Users can view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can create interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can update interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can delete interactions" ON public.interactions;

CREATE POLICY "organization_interactions_select" ON public.interactions
  FOR SELECT
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
    OR client_id IS NULL
  );

CREATE POLICY "organization_interactions_insert" ON public.interactions
  FOR INSERT
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_interactions_update" ON public.interactions
  FOR UPDATE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  )
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_interactions_delete" ON public.interactions
  FOR DELETE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

-- Campaigns: Organization-scoped access
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON public.campaigns(client_id) WHERE client_id IS NOT NULL;

DROP POLICY IF EXISTS "Users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON public.campaigns;

CREATE POLICY "organization_campaigns_select" ON public.campaigns
  FOR SELECT
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
    OR client_id IS NULL
  );

CREATE POLICY "organization_campaigns_insert" ON public.campaigns
  FOR INSERT
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_campaigns_update" ON public.campaigns
  FOR UPDATE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  )
  WITH CHECK (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

CREATE POLICY "organization_campaigns_delete" ON public.campaigns
  FOR DELETE
  USING (
    client_id IN (SELECT organization_id FROM get_user_organization_ids(auth.uid()))
  );

-- =======================
-- PART 4: Comments and Documentation
-- =======================

COMMENT ON FUNCTION get_user_organization_ids IS 'Returns all organization IDs for a user (cached, SECURITY DEFINER for RLS efficiency)';
COMMENT ON FUNCTION get_current_organization_id IS 'Returns the current active organization ID for the authenticated user';
COMMENT ON FUNCTION user_has_organization_access IS 'Checks if user has access to a specific organization';





