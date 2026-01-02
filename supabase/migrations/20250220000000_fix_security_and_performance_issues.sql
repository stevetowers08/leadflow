-- Migration: Fix Security and Performance Issues
-- Date: 2025-02-20
-- Description: Addresses all security and performance issues identified by Supabase advisors
-- Based on best practices: https://supabase.com/docs/guides/database/postgres/row-level-security

-- ============================================
-- PART 1: Add Missing RLS Policies
-- ============================================

-- email_replies table: Add RLS policies (RLS enabled but no policies exist)
-- Users can access email replies for leads they own
DROP POLICY IF EXISTS "Users can view email replies for their leads" ON public.email_replies;
CREATE POLICY "Users can view email replies for their leads" 
ON public.email_replies FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_replies.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can insert email replies for their leads" ON public.email_replies;
CREATE POLICY "Users can insert email replies for their leads" 
ON public.email_replies FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_replies.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can update email replies for their leads" ON public.email_replies;
CREATE POLICY "Users can update email replies for their leads" 
ON public.email_replies FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_replies.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_replies.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can delete email replies for their leads" ON public.email_replies;
CREATE POLICY "Users can delete email replies for their leads" 
ON public.email_replies FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_replies.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

-- email_sends table: Add RLS policies (RLS enabled but no policies exist)
-- Users can access email sends for leads they own
DROP POLICY IF EXISTS "Users can view email sends for their leads" ON public.email_sends;
CREATE POLICY "Users can view email sends for their leads" 
ON public.email_sends FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_sends.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can insert email sends for their leads" ON public.email_sends;
CREATE POLICY "Users can insert email sends for their leads" 
ON public.email_sends FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_sends.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can update email sends for their leads" ON public.email_sends;
CREATE POLICY "Users can update email sends for their leads" 
ON public.email_sends FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_sends.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_sends.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can delete email sends for their leads" ON public.email_sends;
CREATE POLICY "Users can delete email sends for their leads" 
ON public.email_sends FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = email_sends.lead_id
    AND leads.user_id = (SELECT auth.uid())
  )
);

-- ============================================
-- PART 2: Fix RLS Policy Performance
-- Replace auth.uid() with (SELECT auth.uid()) to cache function result per query
-- ============================================

-- leads table policies
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- invitations table policies (also consolidating multiple permissive policies)
DROP POLICY IF EXISTS "Users can view invitations they sent" ON public.invitations;
DROP POLICY IF EXISTS "Admins and owners can view all invitations" ON public.invitations;
-- Consolidated: Single policy for SELECT that handles both cases
CREATE POLICY "Users can view invitations" ON public.invitations
  FOR SELECT USING (
    invited_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = (SELECT auth.uid())
      AND up.role IN ('admin', 'owner')
      AND up.is_active = true
    )
  );

DROP POLICY IF EXISTS "Users can update invitations they sent" ON public.invitations;
DROP POLICY IF EXISTS "Admins and owners can update any invitation" ON public.invitations;
-- Consolidated: Single policy for UPDATE that handles both cases
CREATE POLICY "Users can update invitations" ON public.invitations
  FOR UPDATE USING (
    invited_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = (SELECT auth.uid())
      AND up.role IN ('admin', 'owner')
      AND up.is_active = true
    )
  )
  WITH CHECK (
    invited_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = (SELECT auth.uid())
      AND up.role IN ('admin', 'owner')
      AND up.is_active = true
    )
  );

DROP POLICY IF EXISTS "Users can create invitations" ON public.invitations;
CREATE POLICY "Users can create invitations" ON public.invitations
  FOR INSERT WITH CHECK (
    invited_by = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = (SELECT auth.uid())
      AND up.role IN ('admin', 'owner')
      AND up.is_active = true
    )
  );

-- user_profiles table policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- shows table policies
DROP POLICY IF EXISTS "Users can view own shows" ON public.shows;
CREATE POLICY "Users can view own shows" ON public.shows
  FOR SELECT USING (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own shows" ON public.shows;
CREATE POLICY "Users can insert own shows" ON public.shows
  FOR INSERT WITH CHECK (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own shows" ON public.shows;
CREATE POLICY "Users can update own shows" ON public.shows
  FOR UPDATE USING (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own shows" ON public.shows;
CREATE POLICY "Users can delete own shows" ON public.shows
  FOR DELETE USING (owner_id = (SELECT auth.uid()));

-- show_companies table policies
DROP POLICY IF EXISTS "Users can view show companies" ON public.show_companies;
CREATE POLICY "Users can view show companies" ON public.show_companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shows
      WHERE shows.id = show_companies.show_id
      AND shows.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert show companies" ON public.show_companies;
CREATE POLICY "Users can insert show companies" ON public.show_companies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shows
      WHERE shows.id = show_companies.show_id
      AND shows.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete show companies" ON public.show_companies;
CREATE POLICY "Users can delete show companies" ON public.show_companies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shows
      WHERE shows.id = show_companies.show_id
      AND shows.owner_id = (SELECT auth.uid())
    )
  );

-- email_threads table policies
DROP POLICY IF EXISTS "Authenticated users can view email threads" ON public.email_threads;
CREATE POLICY "Authenticated users can view email threads" ON public.email_threads
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert email threads" ON public.email_threads;
CREATE POLICY "Authenticated users can insert email threads" ON public.email_threads
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update email threads" ON public.email_threads;
CREATE POLICY "Authenticated users can update email threads" ON public.email_threads
  FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL);

-- error_logs table policies
DROP POLICY IF EXISTS "Users can view their own error logs" ON public.error_logs;
CREATE POLICY "Users can view their own error logs" ON public.error_logs
  FOR SELECT USING (user_id = (SELECT auth.uid()));

-- user_settings table policies
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
CREATE POLICY "Users can insert their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;
CREATE POLICY "Users can delete their own settings" ON public.user_settings
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- email_messages table policies
DROP POLICY IF EXISTS "Authenticated users can view email messages" ON public.email_messages;
CREATE POLICY "Authenticated users can view email messages" ON public.email_messages
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert email messages" ON public.email_messages;
CREATE POLICY "Authenticated users can insert email messages" ON public.email_messages
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update email messages" ON public.email_messages;
CREATE POLICY "Authenticated users can update email messages" ON public.email_messages
  FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL);

-- ============================================
-- PART 3: Fix Function Search Path Issues
-- Set explicit search_path to prevent security vulnerabilities
-- ============================================

-- Fix update_user_settings_updated_at function
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Fix get_user_client_ids function
CREATE OR REPLACE FUNCTION public.get_user_client_ids(user_uuid UUID)
RETURNS TABLE(client_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT cu.client_id
  FROM public.client_users cu
  WHERE cu.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Fix can_access_entity function
CREATE OR REPLACE FUNCTION public.can_access_entity(
    entity_type TEXT,
    entity_id UUID,
    user_id UUID
  ) RETURNS BOOLEAN AS $$
DECLARE 
  user_role TEXT;
BEGIN 
  -- Get user role
  SELECT role INTO user_role
  FROM public.user_profiles
  WHERE id = user_id
    AND is_active = true;
  
  -- Admin can access all entities
  IF user_role = 'admin' THEN 
    RETURN TRUE;
  END IF;
  
  -- Regular users can only access entities they created
  CASE entity_type
    WHEN 'companies' THEN
      RETURN EXISTS (
        SELECT 1 FROM public.companies 
        WHERE id = entity_id 
        AND (created_by = user_id OR user_id = user_id)
      );
    WHEN 'people' THEN
      RETURN EXISTS (
        SELECT 1 FROM public.people 
        WHERE id = entity_id 
        AND (created_by = user_id OR user_id = user_id)
      );
    WHEN 'campaigns' THEN
      RETURN EXISTS (
        SELECT 1 FROM public.campaigns 
        WHERE id = entity_id 
        AND (created_by = user_id OR user_id = user_id)
      );
    ELSE 
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Fix can_assign_entity function
CREATE OR REPLACE FUNCTION public.can_assign_entity(
    entity_type TEXT,
    entity_id UUID,
    new_owner_id UUID,
    current_user_id UUID
  ) RETURNS BOOLEAN AS $$
DECLARE 
  current_user_role TEXT;
BEGIN 
  -- Get current user role
  SELECT role INTO current_user_role
  FROM public.user_profiles
  WHERE id = current_user_id
    AND is_active = true;
  
  -- Admin can assign to anyone
  IF current_user_role = 'admin' THEN 
    RETURN TRUE;
  END IF;
  
  -- Regular users cannot assign
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Fix get_user_organization_ids function
CREATE OR REPLACE FUNCTION public.get_user_organization_ids(user_uuid UUID)
RETURNS TABLE(organization_id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT cu.client_id
  FROM public.client_users cu
  WHERE cu.user_id = user_uuid;
END;
$$;

-- Fix get_current_organization_id function
CREATE OR REPLACE FUNCTION public.get_current_organization_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
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

-- Fix user_has_organization_access function
CREATE OR REPLACE FUNCTION public.user_has_organization_access(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
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

-- Fix setup_admin_user function
CREATE OR REPLACE FUNCTION public.setup_admin_user(
  user_email TEXT,
  user_role TEXT DEFAULT 'admin'
)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email in auth.users
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found in auth.users. User must sign in first.', user_email;
  END IF;

  -- Upsert user profile with admin role
  INSERT INTO public.user_profiles (
    id,
    email,
    role,
    is_active,
    updated_at
  )
  VALUES (
    user_id,
    user_email,
    user_role,
    true,
    now()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = now();

  RAISE NOTICE 'User % set as %', user_email, user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Fix update_leadflow_leads_updated_at function
CREATE OR REPLACE FUNCTION public.update_leadflow_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- ============================================
-- PART 4: Add Indexes for Unindexed Foreign Keys
-- Improves query performance for joins and lookups
-- ============================================

-- error_logs.resolved_by foreign key
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved_by 
ON public.error_logs(resolved_by);

-- invitations.accepted_by foreign key
CREATE INDEX IF NOT EXISTS idx_invitations_accepted_by 
ON public.invitations(accepted_by);

-- leads.workflow_id foreign key
CREATE INDEX IF NOT EXISTS idx_leads_workflow_id 
ON public.leads(workflow_id);

-- ============================================
-- PART 5: Notes
-- ============================================

-- NOTE: Leaked Password Protection
-- This is a Supabase Auth dashboard setting that cannot be changed via migration.
-- To enable: Go to Supabase Dashboard > Authentication > Password Security
-- Enable "Leaked Password Protection" to check passwords against HaveIBeenPwned.org
-- Reference: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

-- ============================================
-- PART 6: Comments
-- ============================================

COMMENT ON POLICY "Users can view email replies for their leads" ON public.email_replies IS 
'RLS policy: Users can view email replies for leads they own. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "Users can view email sends for their leads" ON public.email_sends IS 
'RLS policy: Users can view email sends for leads they own. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "Users can view invitations" ON public.invitations IS 
'Consolidated RLS policy: Users can view invitations they sent or all invitations if admin/owner. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "Users can update invitations" ON public.invitations IS 
'Consolidated RLS policy: Users can update invitations they sent or any invitation if admin/owner. Uses (SELECT auth.uid()) for performance.';

