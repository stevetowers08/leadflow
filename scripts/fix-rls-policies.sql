-- PROPER FIX: Update RLS policies to work with authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to view companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to insert companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to update companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to delete companies" ON public.companies;

-- Create new policies that work with Supabase auth
CREATE POLICY "Allow authenticated users to view companies" ON public.companies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert companies" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update companies" ON public.companies
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete companies" ON public.companies
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Apply same fixes to other tables
DROP POLICY IF EXISTS "Authenticated users can view people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can insert people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can update people" ON public.people;
DROP POLICY IF EXISTS "Authenticated users can delete people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to view people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to insert people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to update people" ON public.people;
DROP POLICY IF EXISTS "Allow authenticated users to delete people" ON public.people;

CREATE POLICY "Allow authenticated users to view people" ON public.people
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert people" ON public.people
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update people" ON public.people
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete people" ON public.people
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Jobs table
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated users to delete jobs" ON public.jobs;

CREATE POLICY "Allow authenticated users to view jobs" ON public.jobs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete jobs" ON public.jobs
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify policies are updated
SELECT schemaname, tablename, policyname, qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
