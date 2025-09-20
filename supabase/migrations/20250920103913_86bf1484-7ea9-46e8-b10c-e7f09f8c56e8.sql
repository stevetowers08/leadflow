-- Create enum types for common dropdown fields
CREATE TYPE public.lead_stage AS ENUM ('new', 'contacted', 'qualified', 'interview', 'offer', 'hired', 'lost');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.company_status AS ENUM ('active', 'inactive', 'prospect');
CREATE TYPE public.job_status AS ENUM ('draft', 'active', 'paused', 'filled', 'cancelled');
CREATE TYPE public.employment_type AS ENUM ('full-time', 'part-time', 'contract', 'internship', 'freelance');
CREATE TYPE public.seniority_level AS ENUM ('entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive');

-- Create reference tables for dynamic dropdowns
CREATE TABLE public.industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.job_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.company_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  size_range text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on reference tables
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for reference tables (read-only for all authenticated users)
CREATE POLICY "Industries are viewable by everyone" ON public.industries FOR SELECT USING (true);
CREATE POLICY "Job functions are viewable by everyone" ON public.job_functions FOR SELECT USING (true);
CREATE POLICY "Company sizes are viewable by everyone" ON public.company_sizes FOR SELECT USING (true);

-- Insert default data for reference tables
INSERT INTO public.industries (name) VALUES 
  ('Technology'),
  ('Healthcare'),
  ('Finance'),
  ('Education'),
  ('Manufacturing'),
  ('Retail'),
  ('Consulting'),
  ('Marketing'),
  ('Real Estate'),
  ('Non-profit');

INSERT INTO public.job_functions (name) VALUES 
  ('Engineering'),
  ('Sales'),
  ('Marketing'),
  ('Operations'),
  ('Finance'),
  ('Human Resources'),
  ('Product'),
  ('Design'),
  ('Customer Success'),
  ('Data Science');

INSERT INTO public.company_sizes (name, size_range) VALUES 
  ('Startup', '1-10'),
  ('Small', '11-50'),
  ('Medium', '51-200'),
  ('Large', '201-1000'),
  ('Enterprise', '1000+');

-- Add new columns with enum types to existing tables
ALTER TABLE public.People ADD COLUMN stage_enum public.lead_stage;
ALTER TABLE public.People ADD COLUMN priority_enum public.priority_level;

ALTER TABLE public.Companies ADD COLUMN status_enum public.company_status;
ALTER TABLE public.Companies ADD COLUMN priority_enum public.priority_level;

ALTER TABLE public.Jobs ADD COLUMN status_enum public.job_status;
ALTER TABLE public.Jobs ADD COLUMN employment_type_enum public.employment_type;
ALTER TABLE public.Jobs ADD COLUMN seniority_level_enum public.seniority_level;

-- Add foreign key references to reference tables
ALTER TABLE public.Companies ADD COLUMN industry_id uuid REFERENCES public.industries(id);
ALTER TABLE public.Jobs ADD COLUMN function_id uuid REFERENCES public.job_functions(id);
ALTER TABLE public.Jobs ADD COLUMN company_size_id uuid REFERENCES public.company_sizes(id);

-- Update existing data to use enum values (mapping common text values to enums)
UPDATE public.People SET stage_enum = 'new' WHERE LOWER(Stage) = 'new';
UPDATE public.People SET stage_enum = 'contacted' WHERE LOWER(Stage) = 'contacted';
UPDATE public.People SET stage_enum = 'qualified' WHERE LOWER(Stage) = 'qualified';
UPDATE public.People SET stage_enum = 'interview' WHERE LOWER(Stage) IN ('interview', 'interviewing');
UPDATE public.People SET stage_enum = 'offer' WHERE LOWER(Stage) = 'offer';
UPDATE public.People SET stage_enum = 'hired' WHERE LOWER(Stage) = 'hired';
UPDATE public.People SET stage_enum = 'lost' WHERE LOWER(Stage) = 'lost';

UPDATE public.Companies SET status_enum = 'active' WHERE LOWER(STATUS) = 'active';
UPDATE public.Companies SET status_enum = 'inactive' WHERE LOWER(STATUS) = 'inactive';
UPDATE public.Companies SET status_enum = 'prospect' WHERE LOWER(STATUS) = 'prospect';

-- Update industry references based on existing text data
UPDATE public.Companies 
SET industry_id = i.id 
FROM public.industries i 
WHERE LOWER(Companies.Industry) = LOWER(i.name);

-- Create indexes for better performance
CREATE INDEX idx_people_stage_enum ON public.People(stage_enum);
CREATE INDEX idx_people_priority_enum ON public.People(priority_enum);
CREATE INDEX idx_companies_status_enum ON public.Companies(status_enum);
CREATE INDEX idx_companies_industry_id ON public.Companies(industry_id);
CREATE INDEX idx_jobs_status_enum ON public.Jobs(status_enum);