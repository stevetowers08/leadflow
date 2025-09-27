-- Migration: Add Row Level Security (RLS) policies
-- Date: 2025-09-21

-- 1. Enable RLS on all tables (using consistent lowercase naming)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_functions ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for companies table
-- Allow all authenticated users to read companies
CREATE POLICY "Allow read access to companies" ON public.companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert companies
CREATE POLICY "Allow insert access to companies" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update companies
CREATE POLICY "Allow update access to companies" ON public.companies
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. Create policies for people table
CREATE POLICY "Allow read access to people" ON public.people
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert access to people" ON public.people
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update access to people" ON public.people
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Create policies for jobs table
CREATE POLICY "Allow read access to jobs" ON public.jobs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert access to jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update access to jobs" ON public.jobs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Create policies for reference tables (read-only)
CREATE POLICY "Allow read access to industries" ON public.industries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to company_sizes" ON public.company_sizes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to job_functions" ON public.job_functions
  FOR SELECT USING (auth.role() = 'authenticated');
