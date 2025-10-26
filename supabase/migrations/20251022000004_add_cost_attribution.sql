-- Cost Attribution System Migration
-- Migration: add_cost_attribution
-- Date: 2025-10-22
-- Description: Implements cost tracking and shared intelligence savings for multi-client platform

-- =======================
-- PART 1: Cost Events Table
-- =======================

CREATE TABLE IF NOT EXISTS public.cost_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- What operation triggered the cost
  operation_type TEXT NOT NULL CHECK (operation_type IN (
    'job_discovery',        -- Finding new jobs
    'job_enrichment',       -- Enriching job data (company, location, etc)
    'company_research',     -- Deep company research
    'company_enrichment',   -- Basic company data lookup
    'decision_maker_search', -- Finding decision makers
    'contact_enrichment',   -- Email/phone lookup
    'email_sent',           -- Sending emails
    'ai_analysis',          -- AI-powered analysis
    'web_scraping',         -- Web scraping operations
    'api_call',             -- Generic API calls
    'storage',              -- Data storage costs
    'other'
  )),
  
  -- Which entity this relates to
  entity_type TEXT CHECK (entity_type IN ('job', 'company', 'decision_maker', 'email', 'campaign', 'other')),
  entity_id UUID,
  
  -- Cost details
  cost_usd DECIMAL(10,4) NOT NULL,
  cost_provider TEXT, -- 'openai', 'anthropic', 'perplexity', 'apollo', 'sendgrid', etc
  credits_consumed INTEGER, -- If using a credit-based system
  
  -- Metadata
  was_cached BOOLEAN DEFAULT false, -- If this was served from cache/shared intelligence
  cache_source TEXT, -- Which client originally paid for this data
  operation_details JSONB DEFAULT '{}'::jsonb, -- Additional context
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 2: Shared Intelligence Savings Table
-- =======================

CREATE TABLE IF NOT EXISTS public.shared_intelligence_savings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Which client benefited from shared data
  beneficiary_client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Which client originally paid for the data
  original_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  
  -- What was reused
  data_type TEXT NOT NULL CHECK (data_type IN (
    'company_research',
    'job_data',
    'decision_maker_contact',
    'email_enrichment',
    'company_enrichment',
    'industry_analysis',
    'other'
  )),
  
  -- Which entity was reused
  entity_type TEXT CHECK (entity_type IN ('job', 'company', 'decision_maker', 'other')),
  entity_id UUID,
  
  -- Savings details
  estimated_savings_usd DECIMAL(10,4) NOT NULL, -- How much they would have paid
  actual_cost_usd DECIMAL(10,4) DEFAULT 0, -- What they actually paid (usually 0 for cached)
  
  -- Metadata
  reuse_count INTEGER DEFAULT 1, -- How many times this client has reused this data
  operation_details JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 3: Client Budget Tracking
-- =======================

-- Add budget tracking fields to clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS current_month_spend DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_month_spend DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spend DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_savings DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_alert_threshold DECIMAL(5,2) DEFAULT 0.80, -- Alert at 80% of budget
ADD COLUMN IF NOT EXISTS budget_exceeded BOOLEAN DEFAULT false;

-- =======================
-- PART 4: Indexes
-- =======================

CREATE INDEX IF NOT EXISTS idx_cost_events_client_id ON public.cost_events(client_id);
CREATE INDEX IF NOT EXISTS idx_cost_events_operation_type ON public.cost_events(operation_type);
CREATE INDEX IF NOT EXISTS idx_cost_events_entity_type ON public.cost_events(entity_type);
CREATE INDEX IF NOT EXISTS idx_cost_events_entity_id ON public.cost_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_cost_events_created_at ON public.cost_events(created_at);
CREATE INDEX IF NOT EXISTS idx_cost_events_was_cached ON public.cost_events(was_cached);
CREATE INDEX IF NOT EXISTS idx_cost_events_cost_provider ON public.cost_events(cost_provider);

CREATE INDEX IF NOT EXISTS idx_shared_intelligence_savings_beneficiary ON public.shared_intelligence_savings(beneficiary_client_id);
CREATE INDEX IF NOT EXISTS idx_shared_intelligence_savings_original ON public.shared_intelligence_savings(original_client_id);
CREATE INDEX IF NOT EXISTS idx_shared_intelligence_savings_data_type ON public.shared_intelligence_savings(data_type);
CREATE INDEX IF NOT EXISTS idx_shared_intelligence_savings_entity_type ON public.shared_intelligence_savings(entity_type);
CREATE INDEX IF NOT EXISTS idx_shared_intelligence_savings_entity_id ON public.shared_intelligence_savings(entity_id);
CREATE INDEX IF NOT EXISTS idx_shared_intelligence_savings_created_at ON public.shared_intelligence_savings(created_at);

-- =======================
-- PART 5: Row Level Security
-- =======================

ALTER TABLE public.cost_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_intelligence_savings ENABLE ROW LEVEL SECURITY;

-- Cost Events: Users can only see their client's costs
CREATE POLICY "Users can view their client cost events" ON public.cost_events
  FOR SELECT 
  USING (
    client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

-- Only system/backend can insert cost events (not users directly)
CREATE POLICY "Service role can manage cost events" ON public.cost_events
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- Shared Intelligence Savings: Users can see their client's savings
CREATE POLICY "Users can view their client savings" ON public.shared_intelligence_savings
  FOR SELECT 
  USING (
    beneficiary_client_id IN (SELECT client_id FROM get_user_client_ids(auth.uid()))
  );

-- Only system/backend can insert savings records
CREATE POLICY "Service role can manage savings" ON public.shared_intelligence_savings
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- =======================
-- PART 6: Helper Functions
-- =======================

-- Function to record a cost event
CREATE OR REPLACE FUNCTION record_cost_event(
  p_client_id UUID,
  p_operation_type TEXT,
  p_cost_usd DECIMAL,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_cost_provider TEXT DEFAULT NULL,
  p_was_cached BOOLEAN DEFAULT false,
  p_cache_source TEXT DEFAULT NULL,
  p_operation_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_cost_event_id UUID;
BEGIN
  -- Insert cost event
  INSERT INTO public.cost_events (
    client_id,
    operation_type,
    cost_usd,
    entity_type,
    entity_id,
    cost_provider,
    was_cached,
    cache_source,
    operation_details
  ) VALUES (
    p_client_id,
    p_operation_type,
    p_cost_usd,
    p_entity_type,
    p_entity_id,
    p_cost_provider,
    p_was_cached,
    p_cache_source,
    p_operation_details
  ) RETURNING id INTO v_cost_event_id;
  
  -- Update client's current month spend
  UPDATE public.clients
  SET 
    current_month_spend = current_month_spend + p_cost_usd,
    total_spend = total_spend + p_cost_usd,
    budget_exceeded = (
      CASE 
        WHEN monthly_budget IS NOT NULL 
        THEN (current_month_spend + p_cost_usd) > monthly_budget
        ELSE false
      END
    )
  WHERE id = p_client_id;
  
  RETURN v_cost_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a shared intelligence savings
CREATE OR REPLACE FUNCTION record_shared_savings(
  p_beneficiary_client_id UUID,
  p_original_client_id UUID,
  p_data_type TEXT,
  p_estimated_savings_usd DECIMAL,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_operation_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_savings_id UUID;
  v_reuse_count INTEGER;
BEGIN
  -- Check if this client has already benefited from this exact entity
  SELECT COALESCE(MAX(reuse_count), 0) INTO v_reuse_count
  FROM public.shared_intelligence_savings
  WHERE beneficiary_client_id = p_beneficiary_client_id
    AND entity_type = p_entity_type
    AND entity_id = p_entity_id;
  
  -- Insert savings record
  INSERT INTO public.shared_intelligence_savings (
    beneficiary_client_id,
    original_client_id,
    data_type,
    estimated_savings_usd,
    entity_type,
    entity_id,
    reuse_count,
    operation_details
  ) VALUES (
    p_beneficiary_client_id,
    p_original_client_id,
    p_data_type,
    p_estimated_savings_usd,
    p_entity_type,
    p_entity_id,
    v_reuse_count + 1,
    p_operation_details
  ) RETURNING id INTO v_savings_id;
  
  -- Update client's total savings
  UPDATE public.clients
  SET total_savings = total_savings + p_estimated_savings_usd
  WHERE id = p_beneficiary_client_id;
  
  RETURN v_savings_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly costs (call this at the start of each month)
CREATE OR REPLACE FUNCTION reset_monthly_costs()
RETURNS void AS $$
BEGIN
  UPDATE public.clients
  SET 
    last_month_spend = current_month_spend,
    current_month_spend = 0,
    budget_exceeded = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =======================
-- PART 7: Views for Reporting
-- =======================

-- View: Client Cost Summary
CREATE OR REPLACE VIEW client_cost_summary AS
SELECT 
  c.id AS client_id,
  c.name AS client_name,
  c.monthly_budget,
  c.current_month_spend,
  c.last_month_spend,
  c.total_spend,
  c.total_savings,
  c.budget_exceeded,
  CASE 
    WHEN c.monthly_budget IS NOT NULL AND c.monthly_budget > 0
    THEN ROUND((c.current_month_spend / c.monthly_budget * 100)::numeric, 2)
    ELSE 0
  END AS budget_used_percentage,
  COUNT(ce.id) AS total_cost_events,
  COUNT(CASE WHEN ce.was_cached THEN 1 END) AS cached_operations,
  ROUND(
    CASE 
      WHEN COUNT(ce.id) > 0 
      THEN (COUNT(CASE WHEN ce.was_cached THEN 1 END)::numeric / COUNT(ce.id)::numeric * 100)
      ELSE 0
    END, 2
  ) AS cache_hit_rate_percentage
FROM public.clients c
LEFT JOIN public.cost_events ce ON c.id = ce.client_id 
  AND ce.created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY c.id, c.name, c.monthly_budget, c.current_month_spend, 
         c.last_month_spend, c.total_spend, c.total_savings, c.budget_exceeded;

-- View: Cost Events by Operation Type
CREATE OR REPLACE VIEW cost_by_operation_type AS
SELECT 
  ce.client_id,
  c.name AS client_name,
  ce.operation_type,
  COUNT(*) AS event_count,
  SUM(ce.cost_usd) AS total_cost,
  AVG(ce.cost_usd) AS avg_cost,
  MIN(ce.cost_usd) AS min_cost,
  MAX(ce.cost_usd) AS max_cost,
  COUNT(CASE WHEN ce.was_cached THEN 1 END) AS cached_count
FROM public.cost_events ce
JOIN public.clients c ON ce.client_id = c.id
WHERE ce.created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY ce.client_id, c.name, ce.operation_type;

-- View: Shared Intelligence Impact
CREATE OR REPLACE VIEW shared_intelligence_impact AS
SELECT 
  sis.beneficiary_client_id AS client_id,
  c.name AS client_name,
  sis.data_type,
  COUNT(*) AS reuse_count,
  SUM(sis.estimated_savings_usd) AS total_savings,
  AVG(sis.estimated_savings_usd) AS avg_savings_per_reuse,
  COUNT(DISTINCT sis.original_client_id) AS distinct_source_clients
FROM public.shared_intelligence_savings sis
JOIN public.clients c ON sis.beneficiary_client_id = c.id
WHERE sis.created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY sis.beneficiary_client_id, c.name, sis.data_type;

-- =======================
-- PART 8: Comments
-- =======================

COMMENT ON TABLE public.cost_events IS 'Tracks all API and operational costs per client';
COMMENT ON TABLE public.shared_intelligence_savings IS 'Tracks savings when clients reuse data from shared canonical sources';
COMMENT ON FUNCTION record_cost_event IS 'Records a cost event and updates client spend';
COMMENT ON FUNCTION record_shared_savings IS 'Records shared intelligence savings and updates client total savings';
COMMENT ON FUNCTION reset_monthly_costs IS 'Resets monthly cost counters (run at start of each month)';
COMMENT ON VIEW client_cost_summary IS 'Summary of client costs, budgets, and savings';
COMMENT ON VIEW cost_by_operation_type IS 'Breakdown of costs by operation type per client';
COMMENT ON VIEW shared_intelligence_impact IS 'Impact of shared intelligence on client savings';
