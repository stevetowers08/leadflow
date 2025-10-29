-- Search Campaigns and Decision Makers Migration
-- Migration: add_search_campaigns_and_decision_makers
-- Date: 2025-10-22
-- Description: Implements automated job search campaigns and enhanced decision maker tracking

-- =======================
-- PART 1: Job Sources Table (Provenance Tracking)
-- =======================

CREATE TABLE IF NOT EXISTS public.job_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  
  -- Source information
  source_type TEXT NOT NULL CHECK (source_type IN (
    'linkedin',
    'indeed',
    'glassdoor',
    'company_website',
    'recruiter',
    'referral',
    'job_board',
    'search_campaign',
    'api',
    'manual_entry',
    'other'
  )),
  source_url TEXT, -- Original job posting URL
  source_identifier TEXT, -- External ID from the source (e.g., LinkedIn job ID)
  
  -- Discovery information
  discovered_by_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  discovered_by_campaign_id UUID, -- References client_search_campaigns
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Enrichment tracking
  was_enriched BOOLEAN DEFAULT false,
  enriched_at TIMESTAMP WITH TIME ZONE,
  enrichment_cost_usd DECIMAL(10,4),
  
  -- Metadata
  raw_data JSONB DEFAULT '{}'::jsonb, -- Original enriched/API data
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 2: Decision Makers Enhanced Table
-- =======================

-- First, check if we need to enhance the existing people table or create a new one
-- We'll add decision maker specific fields to the people table

ALTER TABLE public.people
ADD COLUMN IF NOT EXISTS is_decision_maker BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS decision_maker_level TEXT CHECK (decision_maker_level IN ('c_level', 'vp', 'director', 'manager', 'individual_contributor')),
ADD COLUMN IF NOT EXISTS hiring_authority BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS budget_authority BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS contact_quality_score INTEGER CHECK (contact_quality_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS contact_enriched_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS contact_enrichment_source TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
ADD COLUMN IF NOT EXISTS last_outreach_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS outreach_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_rate DECIMAL(5,2), -- Percentage
ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'linkedin', 'phone', 'unknown'));

-- =======================
-- PART 3: Client Search Campaigns Table
-- =======================

CREATE TABLE IF NOT EXISTS public.client_search_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Campaign details
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')) DEFAULT 'draft',
  
  -- Search criteria
  keywords TEXT[], -- Job title keywords
  excluded_keywords TEXT[], -- Words to exclude
  companies TEXT[], -- Specific companies to target/exclude
  locations TEXT[], -- Geographic locations
  remote_only BOOLEAN DEFAULT false,
  job_types TEXT[], -- 'full_time', 'part_time', 'contract', etc
  experience_levels TEXT[], -- 'entry', 'mid', 'senior', 'executive'
  salary_min INTEGER,
  salary_max INTEGER,
  
  -- Search sources
  search_sources TEXT[] DEFAULT ARRAY['linkedin', 'indeed', 'glassdoor'], -- Which job boards to search
  
  -- Automation settings
  frequency TEXT CHECK (frequency IN ('hourly', 'daily', 'weekly', 'manual')) DEFAULT 'daily',
  auto_qualify BOOLEAN DEFAULT false, -- Automatically run qualification on found jobs
  auto_enrich BOOLEAN DEFAULT false, -- Automatically enrich job and company data
  notify_on_match BOOLEAN DEFAULT true,
  notification_emails TEXT[],
  
  -- Execution tracking
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  total_jobs_found INTEGER DEFAULT 0,
  jobs_found_this_month INTEGER DEFAULT 0,
  
  -- Budget controls
  max_monthly_cost DECIMAL(10,2),
  current_month_cost DECIMAL(10,2) DEFAULT 0,
  
  -- Advanced filters
  custom_filters JSONB DEFAULT '{}'::jsonb,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 4: Campaign Execution Logs
-- =======================

CREATE TABLE IF NOT EXISTS public.campaign_execution_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.client_search_campaigns(id) ON DELETE CASCADE,
  
  -- Execution details
  status TEXT CHECK (status IN ('running', 'completed', 'failed', 'cancelled')) DEFAULT 'running',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Results
  jobs_discovered INTEGER DEFAULT 0,
  jobs_qualified INTEGER DEFAULT 0,
  jobs_enriched INTEGER DEFAULT 0,
  new_companies_found INTEGER DEFAULT 0,
  
  -- Cost tracking
  execution_cost_usd DECIMAL(10,4) DEFAULT 0,
  
  -- Error handling
  error_message TEXT,
  
  -- Metadata
  execution_details JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 5: Campaign Job Matches (Many-to-Many)
-- =======================

CREATE TABLE IF NOT EXISTS public.campaign_job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.client_search_campaigns(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  
  -- Match details
  match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
  match_reasons TEXT[], -- Why this job matched the campaign
  
  -- Status
  reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Action taken
  added_to_deals BOOLEAN DEFAULT false, -- Added to client_job_deals
  
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(campaign_id, job_id)
);

-- =======================
-- PART 6: Indexes
-- =======================

-- Job Sources indexes
CREATE INDEX IF NOT EXISTS idx_job_sources_job_id ON public.job_sources(job_id);
CREATE INDEX IF NOT EXISTS idx_job_sources_source_type ON public.job_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_job_sources_discovered_by_client ON public.job_sources(discovered_by_client_id);
CREATE INDEX IF NOT EXISTS idx_job_sources_discovered_by_campaign ON public.job_sources(discovered_by_campaign_id);
CREATE INDEX IF NOT EXISTS idx_job_sources_source_identifier ON public.job_sources(source_identifier);
CREATE INDEX IF NOT EXISTS idx_job_sources_discovered_at ON public.job_sources(discovered_at);

-- People (Decision Makers) indexes
CREATE INDEX IF NOT EXISTS idx_people_is_decision_maker ON public.people(is_decision_maker);
CREATE INDEX IF NOT EXISTS idx_people_decision_maker_level ON public.people(decision_maker_level);
CREATE INDEX IF NOT EXISTS idx_people_hiring_authority ON public.people(hiring_authority);
CREATE INDEX IF NOT EXISTS idx_people_contact_quality_score ON public.people(contact_quality_score);

-- Client Search Campaigns indexes
CREATE INDEX IF NOT EXISTS idx_client_search_campaigns_client_id ON public.client_search_campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_client_search_campaigns_status ON public.client_search_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_client_search_campaigns_frequency ON public.client_search_campaigns(frequency);
CREATE INDEX IF NOT EXISTS idx_client_search_campaigns_next_run ON public.client_search_campaigns(next_run_at);
CREATE INDEX IF NOT EXISTS idx_client_search_campaigns_created_by ON public.client_search_campaigns(created_by);

-- Campaign Execution Logs indexes
CREATE INDEX IF NOT EXISTS idx_campaign_execution_logs_campaign_id ON public.campaign_execution_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_execution_logs_status ON public.campaign_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_campaign_execution_logs_started_at ON public.campaign_execution_logs(started_at);

-- Campaign Job Matches indexes
CREATE INDEX IF NOT EXISTS idx_campaign_job_matches_campaign_id ON public.campaign_job_matches(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_job_matches_job_id ON public.campaign_job_matches(job_id);
CREATE INDEX IF NOT EXISTS idx_campaign_job_matches_reviewed ON public.campaign_job_matches(reviewed);
CREATE INDEX IF NOT EXISTS idx_campaign_job_matches_match_score ON public.campaign_job_matches(match_score);

-- =======================
-- PART 7: Row Level Security
-- =======================

ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_search_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_job_matches ENABLE ROW LEVEL SECURITY;

-- Job Sources: Users can see sources for jobs their client has access to
CREATE POLICY "Users can view job sources for their client jobs" ON public.job_sources
  FOR SELECT 
  USING (
    job_id IN (
      SELECT cjo.job_id 
      FROM public.client_job_deals cjo
      WHERE cjo.client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
    )
    OR discovered_by_client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

-- Client Search Campaigns: Users can only see their client's campaigns
CREATE POLICY "Users can view their client campaigns" ON public.client_search_campaigns
  FOR SELECT 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

CREATE POLICY "Users can manage their client campaigns" ON public.client_search_campaigns
  FOR ALL 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

-- Campaign Execution Logs: Users can see logs for their client's campaigns
CREATE POLICY "Users can view their campaign logs" ON public.campaign_execution_logs
  FOR SELECT 
  USING (
    campaign_id IN (
      SELECT id FROM public.client_search_campaigns 
      WHERE client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
    )
  );

-- Campaign Job Matches: Users can see matches for their campaigns
CREATE POLICY "Users can view their campaign matches" ON public.campaign_job_matches
  FOR SELECT 
  USING (
    campaign_id IN (
      SELECT id FROM public.client_search_campaigns 
      WHERE client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
    )
  );

CREATE POLICY "Users can manage their campaign matches" ON public.campaign_job_matches
  FOR ALL 
  USING (
    campaign_id IN (
      SELECT id FROM public.client_search_campaigns 
      WHERE client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
    )
  );

-- =======================
-- PART 8: Triggers
-- =======================

-- Add foreign key constraint for campaign_id in job_sources now that the table exists
ALTER TABLE public.job_sources
ADD CONSTRAINT fk_job_sources_campaign 
FOREIGN KEY (discovered_by_campaign_id) 
REFERENCES public.client_search_campaigns(id) 
ON DELETE SET NULL;

-- Trigger to update campaign stats when jobs are found
CREATE OR REPLACE FUNCTION update_campaign_job_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.client_search_campaigns
  SET 
    total_jobs_found = total_jobs_found + 1,
    jobs_found_this_month = jobs_found_this_month + 1
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_campaign_job_count
  AFTER INSERT ON public.campaign_job_matches
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_job_count();

-- Trigger to update outreach count when decision makers are contacted
CREATE OR REPLACE FUNCTION update_decision_maker_outreach_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.first_contact_at IS NOT NULL AND OLD.first_contact_at IS NULL THEN
    UPDATE public.people
    SET 
      outreach_count = COALESCE(outreach_count, 0) + 1,
      last_outreach_at = NEW.first_contact_at
    WHERE id = NEW.decision_maker_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_dm_outreach_stats
  AFTER UPDATE ON public.client_decision_maker_outreach
  FOR EACH ROW
  EXECUTE FUNCTION update_decision_maker_outreach_stats();

-- Standard updated_at triggers
CREATE TRIGGER update_job_sources_updated_at 
  BEFORE UPDATE ON public.job_sources 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_search_campaigns_updated_at 
  BEFORE UPDATE ON public.client_search_campaigns 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- PART 9: Helper Functions
-- =======================

-- Function to start a campaign execution
CREATE OR REPLACE FUNCTION start_campaign_execution(
  p_campaign_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.campaign_execution_logs (
    campaign_id,
    status,
    started_at
  ) VALUES (
    p_campaign_id,
    'running',
    now()
  ) RETURNING id INTO v_log_id;
  
  UPDATE public.client_search_campaigns
  SET last_run_at = now()
  WHERE id = p_campaign_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a campaign execution
CREATE OR REPLACE FUNCTION complete_campaign_execution(
  p_log_id UUID,
  p_jobs_discovered INTEGER,
  p_jobs_qualified INTEGER,
  p_jobs_enriched INTEGER,
  p_new_companies_found INTEGER,
  p_execution_cost_usd DECIMAL,
  p_status TEXT DEFAULT 'completed'
)
RETURNS void AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  -- Get campaign ID and update execution log
  UPDATE public.campaign_execution_logs
  SET 
    status = p_status,
    completed_at = now(),
    jobs_discovered = p_jobs_discovered,
    jobs_qualified = p_jobs_qualified,
    jobs_enriched = p_jobs_enriched,
    new_companies_found = p_new_companies_found,
    execution_cost_usd = p_execution_cost_usd
  WHERE id = p_log_id
  RETURNING campaign_id INTO v_campaign_id;
  
  -- Update campaign's monthly cost
  UPDATE public.client_search_campaigns
  SET current_month_cost = current_month_cost + p_execution_cost_usd
  WHERE id = v_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =======================
-- PART 10: Views
-- =======================

-- View: Campaign Performance Summary
CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
  csc.id AS campaign_id,
  csc.name AS campaign_name,
  csc.client_id,
  c.name AS client_name,
  csc.status,
  csc.frequency,
  csc.total_jobs_found,
  csc.jobs_found_this_month,
  csc.current_month_cost,
  csc.max_monthly_cost,
  csc.last_run_at,
  csc.next_run_at,
  COUNT(DISTINCT cjm.id) AS total_matches,
  COUNT(DISTINCT CASE WHEN cjm.reviewed = true THEN cjm.id END) AS reviewed_matches,
  COUNT(DISTINCT CASE WHEN cjm.added_to_opportunities = true THEN cjm.id END) AS added_to_opportunities,
  AVG(cjm.match_score) AS avg_match_score
FROM public.client_search_campaigns csc
JOIN public.clients c ON csc.client_id = c.id
LEFT JOIN public.campaign_job_matches cjm ON csc.id = cjm.campaign_id
GROUP BY csc.id, csc.name, csc.client_id, c.name, csc.status, csc.frequency,
         csc.total_jobs_found, csc.jobs_found_this_month, csc.current_month_cost,
         csc.max_monthly_cost, csc.last_run_at, csc.next_run_at;

-- =======================
-- PART 11: Comments
-- =======================

COMMENT ON TABLE public.job_sources IS 'Tracks the origin and provenance of each job posting';
COMMENT ON TABLE public.client_search_campaigns IS 'Automated job search campaigns configured by clients';
COMMENT ON TABLE public.campaign_execution_logs IS 'Logs of campaign execution runs';
COMMENT ON TABLE public.campaign_job_matches IS 'Jobs discovered by campaigns with match scoring';
COMMENT ON FUNCTION start_campaign_execution IS 'Starts a new campaign execution run';
COMMENT ON FUNCTION complete_campaign_execution IS 'Marks a campaign execution as complete with results';
COMMENT ON FUNCTION update_campaign_job_count IS 'Trigger function to update campaign job discovery counts';
COMMENT ON FUNCTION update_decision_maker_outreach_stats IS 'Trigger function to update decision maker outreach statistics';
COMMENT ON VIEW campaign_performance_summary IS 'Summary view of campaign performance metrics';
