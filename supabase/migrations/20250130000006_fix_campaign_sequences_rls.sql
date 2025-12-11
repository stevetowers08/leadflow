-- Fix RLS policies for campaign_sequences table
-- Migration: fix_campaign_sequences_rls
-- Date: 2025-01-30
-- Description: Production-ready RLS policies following official Supabase best practices
-- Based on: https://supabase.com/docs/guides/database/postgres/row-level-security
-- 
-- Best practices applied:
-- 1. Specify roles with TO authenticated (prevents policy execution for anon users)
-- 2. Use (select auth.uid()) for performance (caches result per-statement)
-- 3. WITH CHECK required for INSERT operations
-- 4. Both USING and WITH CHECK required for UPDATE operations
-- 5. No NULL auth.uid() bypass (security requirement)

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can manage their own campaign sequences" ON public.campaign_sequences;
DROP POLICY IF EXISTS "Users can view their own campaign sequences" ON public.campaign_sequences;
DROP POLICY IF EXISTS "Users can insert their own campaign sequences" ON public.campaign_sequences;
DROP POLICY IF EXISTS "Users can update their own campaign sequences" ON public.campaign_sequences;
DROP POLICY IF EXISTS "Users can delete their own campaign sequences" ON public.campaign_sequences;

-- SELECT: Users can only view sequences they created
-- Using (select auth.uid()) for performance optimization
CREATE POLICY "Users can view their own campaign sequences" ON public.campaign_sequences
  FOR SELECT 
  TO authenticated
  USING ((select auth.uid()) = created_by);

-- INSERT: Users can only create sequences with themselves as creator
-- WITH CHECK is required for INSERT operations in PostgreSQL RLS
CREATE POLICY "Users can insert their own campaign sequences" ON public.campaign_sequences
  FOR INSERT 
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

-- UPDATE: Users can only update sequences they created
-- Both USING and WITH CHECK required for UPDATE
CREATE POLICY "Users can update their own campaign sequences" ON public.campaign_sequences
  FOR UPDATE 
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

-- DELETE: Users can only delete sequences they created
CREATE POLICY "Users can delete their own campaign sequences" ON public.campaign_sequences
  FOR DELETE 
  TO authenticated
  USING ((select auth.uid()) = created_by);
