-- Fix RLS policies for leads table to handle bypass auth mode
-- This allows deletes to work when auth.uid() is NULL (development bypass auth)
-- Migration: fix_leads_rls_for_bypass_auth
-- Date: 2026-01-20

-- Update delete policy to allow bypass auth mode
-- Note: This replaces the policy from 20260120000000_optimize_leads_delete_rls.sql
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE
  USING (
    -- Development: allow ALL deletes when auth.uid() is NULL (bypass auth mode)
    -- This allows deletes to work in development without real authentication
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: enforce ownership when authenticated
    (SELECT auth.uid()) = user_id
  );

-- Also update other policies for consistency (optional but recommended)
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT
  USING (
    -- Development: allow reads when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: enforce ownership
    (SELECT auth.uid()) = user_id
  );

DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE
  USING (
    -- Development: allow updates when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: enforce ownership
    (SELECT auth.uid()) = user_id
  )
  WITH CHECK (
    -- Development: allow updates when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: enforce ownership
    (SELECT auth.uid()) = user_id
  );

DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT
  WITH CHECK (
    -- Development: allow inserts when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: enforce ownership
    (SELECT auth.uid()) = user_id
  );
