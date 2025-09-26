-- Enable Row Level Security on all public tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'recruiter' CHECK (role IN ('owner', 'admin', 'recruiter', 'viewer')),
  user_limit INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for companies (authenticated users only)
CREATE POLICY "Authenticated users can view companies" ON public.companies
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert companies" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update companies" ON public.companies
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete companies" ON public.companies
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for people
CREATE POLICY "Authenticated users can view people" ON public.people
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert people" ON public.people
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update people" ON public.people
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete people" ON public.people
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for jobs
CREATE POLICY "Authenticated users can view jobs" ON public.jobs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update jobs" ON public.jobs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete jobs" ON public.jobs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for interactions
CREATE POLICY "Authenticated users can view interactions" ON public.interactions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert interactions" ON public.interactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update interactions" ON public.interactions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete interactions" ON public.interactions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for campaigns
CREATE POLICY "Authenticated users can view campaigns" ON public.campaigns
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update campaigns" ON public.campaigns
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete campaigns" ON public.campaigns
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for campaign_participants
CREATE POLICY "Authenticated users can view campaign_participants" ON public.campaign_participants
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert campaign_participants" ON public.campaign_participants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update campaign_participants" ON public.campaign_participants
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete campaign_participants" ON public.campaign_participants
  FOR DELETE USING (auth.role() = 'authenticated');
