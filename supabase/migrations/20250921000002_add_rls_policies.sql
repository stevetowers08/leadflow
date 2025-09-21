-- Migration: Add Row Level Security (RLS) policies
-- Date: 2025-09-21

-- 1. Enable RLS on all tables
ALTER TABLE "Companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "People" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_functions ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for Companies table
-- Allow all authenticated users to read companies
CREATE POLICY "Allow read access to companies" ON "Companies"
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert companies
CREATE POLICY "Allow insert access to companies" ON "Companies"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update companies
CREATE POLICY "Allow update access to companies" ON "Companies"
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. Create policies for People table
CREATE POLICY "Allow read access to people" ON "People"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert access to people" ON "People"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update access to people" ON "People"
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Create policies for Jobs table
CREATE POLICY "Allow read access to jobs" ON "Jobs"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert access to jobs" ON "Jobs"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update access to jobs" ON "Jobs"
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Create policies for reference tables (read-only)
CREATE POLICY "Allow read access to industries" ON industries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to company_sizes" ON company_sizes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to job_functions" ON job_functions
  FOR SELECT USING (auth.role() = 'authenticated');
