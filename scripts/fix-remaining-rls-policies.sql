-- Fix remaining RLS policies for campaigns, interactions, and campaign_participants

-- Fix campaigns table
DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can delete campaigns" ON public.campaigns;

CREATE POLICY "Allow authenticated users to view campaigns" ON public.campaigns
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete campaigns" ON public.campaigns
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix interactions table
DROP POLICY IF EXISTS "Authenticated users can view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can update interactions" ON public.interactions;
DROP POLICY IF EXISTS "Authenticated users can delete interactions" ON public.interactions;

CREATE POLICY "Allow authenticated users to view interactions" ON public.interactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert interactions" ON public.interactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update interactions" ON public.interactions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete interactions" ON public.interactions
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix campaign_participants table
DROP POLICY IF EXISTS "Authenticated users can view campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can insert campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can update campaign_participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Authenticated users can delete campaign_participants" ON public.campaign_participants;

CREATE POLICY "Allow authenticated users to view campaign_participants" ON public.campaign_participants
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert campaign_participants" ON public.campaign_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update campaign_participants" ON public.campaign_participants
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete campaign_participants" ON public.campaign_participants
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify all policies are now consistent
SELECT 
  tablename, 
  policyname, 
  CASE 
    WHEN qual LIKE '%auth.uid() IS NOT NULL%' THEN '✅ CORRECT'
    WHEN qual LIKE '%auth.role() = ''authenticated''%' THEN '❌ OLD FORMAT'
    ELSE '⚠️ OTHER'
  END as policy_status
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
