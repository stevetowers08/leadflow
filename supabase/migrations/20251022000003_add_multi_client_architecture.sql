-- Multi-Client Architecture Migration
-- Migration: add_multi_client_architecture
-- Date: 2025-10-22
-- Description: Implements multi-tenant architecture with shared canonical data and client-specific views

-- =======================
-- PART 1: Multi-Client Tables
-- =======================

-- Clients table (the tenant organizations)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
  subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'trial', 'cancelled')) DEFAULT 'trial',
  monthly_budget DECIMAL(10,2),
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Client users (users belong to clients)
CREATE TABLE IF NOT EXISTS public.client_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'recruiter', 'viewer')) DEFAULT 'recruiter',
  is_primary_contact BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id, user_id)
);

-- Client job opportunities (which jobs each client is actively pursuing)
CREATE TABLE IF NOT EXISTS public.client_job_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('researching', 'preparing', 'outreach', 'interviewing', 'offer', 'placed', 'lost')) DEFAULT 'researching',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  notes TEXT,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id, job_id)
);

-- Client decision maker outreach (tracking which DMs each client is contacting)
CREATE TABLE IF NOT EXISTS public.client_decision_maker_outreach (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  decision_maker_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('identified', 'researching', 'preparing', 'outreach_scheduled', 'contacted', 'responded', 'meeting_scheduled', 'meeting_held', 'follow_up', 'qualified', 'not_interested', 'no_response')) DEFAULT 'identified',
  outreach_method TEXT CHECK (outreach_method IN ('email', 'linkedin', 'phone', 'referral', 'event', 'other')),
  first_contact_at TIMESTAMP WITH TIME ZONE,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  next_action_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id, decision_maker_id, job_id)
);

-- =======================
-- PART 2: Add client_id to existing tables
-- =======================

-- Add client_id to user_profiles (users can belong to multiple clients via client_users)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS default_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- NOTE: We do NOT add client_id to companies, jobs, or people
-- because these are SHARED CANONICAL DATA
-- Access control is via client_job_opportunities and client_decision_maker_outreach

-- =======================
-- PART 3: Indexes
-- =======================

CREATE INDEX IF NOT EXISTS idx_clients_subscription_status ON public.clients(subscription_status);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON public.clients(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

CREATE INDEX IF NOT EXISTS idx_client_users_client_id ON public.client_users(client_id);
CREATE INDEX IF NOT EXISTS idx_client_users_user_id ON public.client_users(user_id);
CREATE INDEX IF NOT EXISTS idx_client_users_role ON public.client_users(role);

CREATE INDEX IF NOT EXISTS idx_client_job_opportunities_client_id ON public.client_job_opportunities(client_id);
CREATE INDEX IF NOT EXISTS idx_client_job_opportunities_job_id ON public.client_job_opportunities(job_id);
CREATE INDEX IF NOT EXISTS idx_client_job_opportunities_status ON public.client_job_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_client_job_opportunities_priority ON public.client_job_opportunities(priority);

CREATE INDEX IF NOT EXISTS idx_client_decision_maker_outreach_client_id ON public.client_decision_maker_outreach(client_id);
CREATE INDEX IF NOT EXISTS idx_client_decision_maker_outreach_dm_id ON public.client_decision_maker_outreach(decision_maker_id);
CREATE INDEX IF NOT EXISTS idx_client_decision_maker_outreach_job_id ON public.client_decision_maker_outreach(job_id);
CREATE INDEX IF NOT EXISTS idx_client_decision_maker_outreach_status ON public.client_decision_maker_outreach(status);

-- =======================
-- PART 4: Row Level Security
-- =======================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_decision_maker_outreach ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's client IDs
CREATE OR REPLACE FUNCTION get_user_client_ids(user_uuid UUID)
RETURNS TABLE(client_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT cu.client_id
  FROM public.client_users cu
  WHERE cu.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clients: Users can see clients they belong to
CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT 
  USING (
    id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

CREATE POLICY "Admins can update their clients" ON public.clients
  FOR UPDATE 
  USING (
    id IN (
      SELECT cu.client_id 
      FROM public.client_users cu 
      WHERE cu.user_id = auth.uid() 
      AND cu.role IN ('owner', 'admin')
    )
  );

-- Client Users: Users can see other users in their clients
CREATE POLICY "Users can view client users" ON public.client_users
  FOR SELECT 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

CREATE POLICY "Admins can manage client users" ON public.client_users
  FOR ALL 
  USING (
    client_id IN (
      SELECT cu.client_id 
      FROM public.client_users cu 
      WHERE cu.user_id = auth.uid() 
      AND cu.role IN ('owner', 'admin')
    )
  );

-- Client Job Opportunities: Users can only see their client's jobs
CREATE POLICY "Users can view their client job opportunities" ON public.client_job_opportunities
  FOR SELECT 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

CREATE POLICY "Users can manage their client job opportunities" ON public.client_job_opportunities
  FOR ALL 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

-- Client Decision Maker Outreach: Users can only see their client's outreach
CREATE POLICY "Users can view their client outreach" ON public.client_decision_maker_outreach
  FOR SELECT 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

CREATE POLICY "Users can manage their client outreach" ON public.client_decision_maker_outreach
  FOR ALL 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

-- =======================
-- PART 5: Triggers for updated_at
-- =======================

CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON public.clients 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_job_opportunities_updated_at 
  BEFORE UPDATE ON public.client_job_opportunities 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_decision_maker_outreach_updated_at 
  BEFORE UPDATE ON public.client_decision_maker_outreach 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- PART 6: Comments
-- =======================

COMMENT ON TABLE public.clients IS 'Multi-tenant client organizations using the platform';
COMMENT ON TABLE public.client_users IS 'Maps users to their client organizations with roles';
COMMENT ON TABLE public.client_job_opportunities IS 'Tracks which jobs each client is actively pursuing';
COMMENT ON TABLE public.client_decision_maker_outreach IS 'Tracks which decision makers each client is contacting';
COMMENT ON FUNCTION get_user_client_ids IS 'Helper function to get all client IDs for a user (for RLS)';
