-- Enhanced RLS Policies with Ownership-based Authorization
-- Migration: enhance_rls_policies_with_ownership
-- Date: 2025-01-30
-- Description: Implements proper ownership-based RLS policies for all CRM tables

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON public.companies;

DROP POLICY IF EXISTS "Authenticated users can view people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can insert people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can update people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can delete people" ON public.people;

DROP POLICY IF EXISTS "Authenticated users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON public.jobs;

DROP POLICY IF EXISTS "Authenticated users can view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can update interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can delete interactions" ON public.interactions;

DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can delete campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "Authenticated users can view campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can insert campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can update campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can delete campaign_participants" ON public.campaign_participants;

-- Create ownership-based policies for companies
CREATE POLICY "Users can view companies they own or admin/owner can view all" 
ON public.companies FOR SELECT 
USING (
  -- Owner/Admin can view all companies
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can view companies assigned to them
  owner_id = auth.uid()
);

CREATE POLICY "Users can insert companies and assign to themselves" 
ON public.companies FOR INSERT 
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only assign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Users can update companies they own or admin/owner can update all" 
ON public.companies FOR UPDATE 
USING (
  -- Owner/Admin can update all companies
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can update companies assigned to them
  owner_id = auth.uid()
)
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only reassign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Only admin/owner can delete companies" 
ON public.companies FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
);

-- Create ownership-based policies for people (leads)
CREATE POLICY "Users can view people they own or admin/owner can view all" 
ON public.people FOR SELECT 
USING (
  -- Owner/Admin can view all people
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can view people assigned to them
  owner_id = auth.uid()
);

CREATE POLICY "Users can insert people and assign to themselves" 
ON public.people FOR INSERT 
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only assign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Users can update people they own or admin/owner can update all" 
ON public.people FOR UPDATE 
USING (
  -- Owner/Admin can update all people
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can update people assigned to them
  owner_id = auth.uid()
)
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only reassign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Only admin/owner can delete people" 
ON public.people FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
);

-- Create ownership-based policies for jobs
CREATE POLICY "Users can view jobs they own or admin/owner can view all" 
ON public.jobs FOR SELECT 
USING (
  -- Owner/Admin can view all jobs
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can view jobs assigned to them
  owner_id = auth.uid()
);

CREATE POLICY "Users can insert jobs and assign to themselves" 
ON public.jobs FOR INSERT 
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only assign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Users can update jobs they own or admin/owner can update all" 
ON public.jobs FOR UPDATE 
USING (
  -- Owner/Admin can update all jobs
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can update jobs assigned to them
  owner_id = auth.uid()
)
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only reassign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Only admin/owner can delete jobs" 
ON public.jobs FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
);

-- Create ownership-based policies for interactions
CREATE POLICY "Users can view interactions for their assigned entities or admin/owner can view all" 
ON public.interactions FOR SELECT 
USING (
  -- Owner/Admin can view all interactions
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can view interactions for entities they own
  EXISTS (
    SELECT 1 FROM public.people p 
    WHERE p.id = interactions.person_id 
    AND p.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = interactions.company_id 
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can insert interactions for their assigned entities" 
ON public.interactions FOR INSERT 
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only create interactions for entities they own
  (
    EXISTS (
      SELECT 1 FROM public.people p 
      WHERE p.id = interactions.person_id 
      AND p.owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.companies c 
      WHERE c.id = interactions.company_id 
      AND c.owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Users can update interactions for their assigned entities" 
ON public.interactions FOR UPDATE 
USING (
  -- Owner/Admin can update all interactions
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can update interactions for entities they own
  EXISTS (
    SELECT 1 FROM public.people p 
    WHERE p.id = interactions.person_id 
    AND p.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = interactions.company_id 
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Only admin/owner can delete interactions" 
ON public.interactions FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
);

-- Create ownership-based policies for campaigns
CREATE POLICY "Users can view campaigns they own or admin/owner can view all" 
ON public.campaigns FOR SELECT 
USING (
  -- Owner/Admin can view all campaigns
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can view campaigns assigned to them
  owner_id = auth.uid()
);

CREATE POLICY "Users can insert campaigns and assign to themselves" 
ON public.campaigns FOR INSERT 
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only assign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Users can update campaigns they own or admin/owner can update all" 
ON public.campaigns FOR UPDATE 
USING (
  -- Owner/Admin can update all campaigns
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can update campaigns assigned to them
  owner_id = auth.uid()
)
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only reassign to themselves unless admin/owner
  (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Only admin/owner can delete campaigns" 
ON public.campaigns FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
);

-- Create ownership-based policies for campaign_participants
CREATE POLICY "Users can view campaign participants for their campaigns or admin/owner can view all" 
ON public.campaign_participants FOR SELECT 
USING (
  -- Owner/Admin can view all campaign participants
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can view participants for campaigns they own
  EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_participants.campaign_id 
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can insert campaign participants for their campaigns" 
ON public.campaign_participants FOR INSERT 
WITH CHECK (
  -- Must be authenticated and active
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.is_active = true
  )
  AND
  -- Can only create participants for campaigns they own
  (
    EXISTS (
      SELECT 1 FROM public.campaigns c 
      WHERE c.id = campaign_participants.campaign_id 
      AND c.owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('owner', 'admin')
      AND up.is_active = true
    )
  )
);

CREATE POLICY "Users can update campaign participants for their campaigns" 
ON public.campaign_participants FOR UPDATE 
USING (
  -- Owner/Admin can update all campaign participants
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
  OR
  -- Users can update participants for campaigns they own
  EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_participants.campaign_id 
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Only admin/owner can delete campaign participants" 
ON public.campaign_participants FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.role IN ('owner', 'admin')
    AND up.is_active = true
  )
);

-- Create indexes for better performance on ownership queries
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_people_owner_id ON public.people(owner_id);
CREATE INDEX IF NOT EXISTS idx_jobs_owner_id ON public.jobs(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner_id ON public.campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_interactions_person_id ON public.interactions(person_id);
CREATE INDEX IF NOT EXISTS idx_interactions_company_id ON public.interactions(company_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign_id ON public.campaign_participants(campaign_id);

-- Create function to check if user can access entity
CREATE OR REPLACE FUNCTION can_access_entity(
  entity_type TEXT,
  entity_id UUID,
  user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  entity_owner_id UUID;
BEGIN
  -- Get user role
  SELECT role INTO user_role
  FROM public.user_profiles
  WHERE id = user_id AND is_active = true;
  
  -- Admin/Owner can access all entities
  IF user_role IN ('owner', 'admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Get entity owner
  CASE entity_type
    WHEN 'companies' THEN
      SELECT owner_id INTO entity_owner_id FROM public.companies WHERE id = entity_id;
    WHEN 'people' THEN
      SELECT owner_id INTO entity_owner_id FROM public.people WHERE id = entity_id;
    WHEN 'jobs' THEN
      SELECT owner_id INTO entity_owner_id FROM public.jobs WHERE id = entity_id;
    WHEN 'campaigns' THEN
      SELECT owner_id INTO entity_owner_id FROM public.campaigns WHERE id = entity_id;
    ELSE
      RETURN FALSE;
  END CASE;
  
  -- Check if user owns the entity
  RETURN entity_owner_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate assignment permissions
CREATE OR REPLACE FUNCTION can_assign_entity(
  entity_type TEXT,
  entity_id UUID,
  new_owner_id UUID,
  current_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  current_user_role TEXT;
  new_owner_role TEXT;
  entity_owner_id UUID;
BEGIN
  -- Get current user role
  SELECT role INTO current_user_role
  FROM public.user_profiles
  WHERE id = current_user_id AND is_active = true;
  
  -- Get new owner role
  SELECT role INTO new_owner_role
  FROM public.user_profiles
  WHERE id = new_owner_id AND is_active = true;
  
  -- Admin/Owner can assign to anyone
  IF current_user_role IN ('owner', 'admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Get current entity owner
  CASE entity_type
    WHEN 'companies' THEN
      SELECT owner_id INTO entity_owner_id FROM public.companies WHERE id = entity_id;
    WHEN 'people' THEN
      SELECT owner_id INTO entity_owner_id FROM public.people WHERE id = entity_id;
    WHEN 'jobs' THEN
      SELECT owner_id INTO entity_owner_id FROM public.jobs WHERE id = entity_id;
    WHEN 'campaigns' THEN
      SELECT owner_id INTO entity_owner_id FROM public.campaigns WHERE id = entity_id;
    ELSE
      RETURN FALSE;
  END CASE;
  
  -- Users can only reassign entities they own
  RETURN entity_owner_id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
