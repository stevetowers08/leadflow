-- Disable RLS for Public Access
-- This migration disables Row Level Security on main CRM tables to allow public access
-- WARNING: This removes all security restrictions - use only for public demos

-- Disable RLS on main CRM tables
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.people DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_threads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_activities DISABLE ROW LEVEL SECURITY;

-- Disable RLS on reference tables
ALTER TABLE public.industries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_sizes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_functions DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on sensitive tables
-- user_profiles, user_settings, admin_operations, etc. remain protected

-- Add comment for documentation
COMMENT ON TABLE public.companies IS 'RLS disabled for public access - demo mode';
COMMENT ON TABLE public.people IS 'RLS disabled for public access - demo mode';
COMMENT ON TABLE public.jobs IS 'RLS disabled for public access - demo mode';
