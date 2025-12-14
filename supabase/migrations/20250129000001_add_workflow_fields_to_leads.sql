-- Migration: Add workflow fields to leads table
-- Date: 2025-01-29
-- Description: Adds workflow_id and workflow_status fields per PDR Section 7

-- Add workflow fields to leads table
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS workflow_id UUID REFERENCES public.workflows(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS workflow_status TEXT CHECK (workflow_status IN ('active', 'paused', 'completed')) DEFAULT NULL;

-- Update status check constraint to include workflow statuses
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('processing', 'active', 'replied_manual', 'paused', 'completed'));

-- Create index for workflow queries
CREATE INDEX IF NOT EXISTS idx_leads_workflow_id ON public.leads(workflow_id);
CREATE INDEX IF NOT EXISTS idx_leads_workflow_status ON public.leads(workflow_status);

-- Create workflows table if it doesn't exist (simplified version per PDR)
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  email_provider TEXT CHECK (email_provider IN ('lemlist', 'gmail')) NOT NULL,
  lemlist_campaign_id TEXT,
  gmail_sequence JSONB DEFAULT '[]'::jsonb,
  pause_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflows
DROP POLICY IF EXISTS "Users can view own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can insert own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can update own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can delete own workflows" ON public.workflows;

CREATE POLICY "Users can view own workflows" ON public.workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workflows" ON public.workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows" ON public.workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows" ON public.workflows
  FOR DELETE USING (auth.uid() = user_id);

-- Create activity_log table for workflow tracking
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('email_sent', 'email_opened', 'email_clicked', 'email_replied', 'workflow_paused')),
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on activity_log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_log
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_log;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.activity_log;

CREATE POLICY "Users can view own activity logs" ON public.activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = activity_log.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own activity logs" ON public.activity_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = activity_log.lead_id
      AND leads.user_id = auth.uid()
    )
  );

-- Indexes for activity_log
CREATE INDEX IF NOT EXISTS idx_activity_log_lead_id ON public.activity_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_workflow_id ON public.activity_log(workflow_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON public.activity_log(timestamp);









