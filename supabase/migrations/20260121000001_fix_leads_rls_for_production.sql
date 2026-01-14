-- Fix RLS policies for leads table to handle NULL user_id in production
-- Migration: fix_leads_rls_for_production
-- Date: 2026-01-21
-- Description: Updates RLS policies to allow authenticated users to view leads with NULL user_id
--              while still enforcing ownership for leads with user_id set

-- Update SELECT policy to allow viewing leads with NULL user_id
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT
  USING (
    -- Development: allow reads when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: allow viewing leads with NULL user_id (unassigned leads) for authenticated users
    -- OR leads that belong to the authenticated user
    (
      user_id IS NULL 
      AND (SELECT auth.uid()) IS NOT NULL
    )
    OR
    (SELECT auth.uid()) = user_id
  );

-- Update INSERT policy to allow creating leads with NULL user_id
DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT
  WITH CHECK (
    -- Development: allow inserts when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: allow inserting leads with NULL user_id (will be auto-assigned) OR with matching user_id
    (
      user_id IS NULL 
      AND (SELECT auth.uid()) IS NOT NULL
    )
    OR
    (SELECT auth.uid()) = user_id
  );

-- Update UPDATE policy
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE
  USING (
    -- Development: allow updates when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: allow updating leads with NULL user_id (unassigned) OR with matching user_id
    (
      user_id IS NULL 
      AND (SELECT auth.uid()) IS NOT NULL
    )
    OR
    (SELECT auth.uid()) = user_id
  )
  WITH CHECK (
    -- Development: allow updates when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: allow updating leads with NULL user_id (unassigned) OR with matching user_id
    (
      user_id IS NULL 
      AND (SELECT auth.uid()) IS NOT NULL
    )
    OR
    (SELECT auth.uid()) = user_id
  );

-- Update DELETE policy
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE
  USING (
    -- Development: allow ALL deletes when auth.uid() is NULL (bypass auth mode)
    (SELECT auth.uid()) IS NULL
    OR
    -- Production: allow deleting leads with NULL user_id (unassigned) OR with matching user_id
    (
      user_id IS NULL 
      AND (SELECT auth.uid()) IS NOT NULL
    )
    OR
    (SELECT auth.uid()) = user_id
  );
