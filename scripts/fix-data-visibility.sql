-- COMPREHENSIVE FIX: Restore data visibility after security implementation
-- This script fixes the RLS policy conflicts that are preventing data access

-- Step 1: Drop ALL existing conflicting policies
-- Companies table
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to view companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to insert companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to update companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to delete companies" ON public.companies;

-- People table
DROP POLICY IF EXISTS "Authenticated users can view people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can insert people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can update people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can delete people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to view people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to insert people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to update people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to delete people" ON public.people;

-- Jobs table
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to delete jobs" ON public.jobs;

-- Interactions table
DROP POLICY IF EXISTS "Authenticated users can view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can update interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can delete interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to update interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to delete interactions" ON public.interactions;

-- Campaigns table
DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can delete campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow authenticated users to view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow authenticated users to insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow authenticated users to update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow authenticated users to delete campaigns" ON public.campaigns;

-- Campaign participants table
DROP POLICY IF EXISTS "Authenticated users can view campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can insert campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can update campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can delete campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow authenticated users to view campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow authenticated users to insert campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow authenticated users to update campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow authenticated users to delete campaign_participants" ON public.campaign_participants;

-- Step 2: Create unified, working RLS policies
-- Using auth.uid() IS NOT NULL approach (more reliable than auth.role())

-- Companies policies
CREATE POLICY "Allow authenticated users to view companies" ON public.companies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert companies" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update companies" ON public.companies
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete companies" ON public.companies
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- People policies
CREATE POLICY "Allow authenticated users to view people" ON public.people
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert people" ON public.people
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update people" ON public.people
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete people" ON public.people
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Jobs policies
CREATE POLICY "Allow authenticated users to view jobs" ON public.jobs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete jobs" ON public.jobs
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Interactions policies
CREATE POLICY "Allow authenticated users to view interactions" ON public.interactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert interactions" ON public.interactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update interactions" ON public.interactions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete interactions" ON public.interactions
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Campaigns policies
CREATE POLICY "Allow authenticated users to view campaigns" ON public.campaigns
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete campaigns" ON public.campaigns
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Campaign participants policies
CREATE POLICY "Allow authenticated users to view campaign_participants" ON public.campaign_participants
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert campaign_participants" ON public.campaign_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update campaign_participants" ON public.campaign_participants
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete campaign_participants" ON public.campaign_participants
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Step 3: Ensure user profile exists for Steve Towers
INSERT INTO public.user_profiles (id, email, full_name, role, user_limit, is_active)
VALUES (
  'f100f6bc-22d8-456f-bcce-44c7881b68ef',
  'stevetowers08@gmail.com',
  'Steve Towers',
  'owner',
  1000,
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  user_limit = EXCLUDED.user_limit,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Step 4: Verify the fix worked
-- Check that RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'people', 'jobs', 'interactions', 'campaigns', 'campaign_participants')
ORDER BY tablename;

-- Check that policies are created
SELECT 
  schemaname, 
  tablename, 
  policyname,
  cmd as "Command",
  qual as "Policy Condition"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'people', 'jobs', 'interactions', 'campaigns', 'campaign_participants')
ORDER BY tablename, policyname;

-- Check user profile
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM public.user_profiles 
WHERE email = 'stevetowers08@gmail.com';

-- Test data access (this should return data if policies are working)
SELECT COUNT(*) as "Total Companies" FROM public.companies;
SELECT COUNT(*) as "Total People" FROM public.people;
SELECT COUNT(*) as "Total Jobs" FROM public.jobs;











