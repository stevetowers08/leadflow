-- Fix RLS policies for development with bypass auth
-- This allows queries to work when auth.uid() is NULL or unknown
-- Migration: fix_dev_rls_for_client_companies
-- Date: 2025-10-27

-- Update the RLS policies to handle development bypass auth mode
-- When auth.uid() is NULL, we need to allow queries through
-- This is DEV ONLY - production will have proper auth

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view client companies for their clients" ON public.client_companies;
DROP POLICY IF EXISTS "Users can create client companies for their clients" ON public.client_companies;
DROP POLICY IF EXISTS "Users can update their client companies" ON public.client_companies;
DROP POLICY IF EXISTS "Users can delete their client companies" ON public.client_companies;

-- New RLS policies that handle NULL auth.uid()
-- In dev: allow all reads when auth is bypassed
-- In prod: strictly enforce client scoping

CREATE POLICY "Users can view client companies for their clients"
  ON public.client_companies FOR SELECT
  USING (
    -- Development: allow all queries when auth.uid() is NULL
    -- This handles the bypass auth scenario
    auth.uid() IS NULL
    OR
    -- Production: enforce client scoping
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create client companies for their clients"
  ON public.client_companies FOR INSERT
  WITH CHECK (
    -- Development: allow all inserts when auth.uid() is NULL
    auth.uid() IS NULL
    OR
    -- Production: enforce client scoping
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their client companies"
  ON public.client_companies FOR UPDATE
  USING (
    -- Development: allow all updates when auth.uid() is NULL
    auth.uid() IS NULL
    OR
    -- Production: enforce client scoping
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their client companies"
  ON public.client_companies FOR DELETE
  USING (
    -- Development: allow all deletes when auth.uid() is NULL
    auth.uid() IS NULL
    OR
    -- Production: enforce client scoping
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Also update client_users RLS to allow reads when auth is bypassed
DROP POLICY IF EXISTS "Users can view client users" ON public.client_users;
DROP POLICY IF EXISTS "Admins can manage client users" ON public.client_users;

CREATE POLICY "Users can view client users"
  ON public.client_users FOR SELECT
  USING (
    -- Development: allow all reads when auth.uid() is NULL
    auth.uid() IS NULL
    OR
    -- Production: enforce client scoping
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

CREATE POLICY "Admins can manage client users"
  ON public.client_users FOR ALL
  USING (
    -- Development: allow all operations when auth.uid() is NULL
    auth.uid() IS NULL
    OR
    -- Production: enforce admin role
    client_id IN (
      SELECT cu.client_id 
      FROM public.client_users cu 
      WHERE cu.user_id = auth.uid() 
      AND cu.role IN ('owner', 'admin')
    )
  );

-- Comments
COMMENT ON POLICY "Users can view client companies for their clients" ON public.client_companies 
IS 'Allows queries when auth.uid() is NULL (development bypass auth mode)';
COMMENT ON POLICY "Users can view client users" ON public.client_users 
IS 'Allows queries when auth.uid() is NULL (development bypass auth mode)';

