-- Campaign Sequences Migration
-- Migration: create_campaign_sequences
-- Date: 2025-10-22
-- Description: Creates the campaign sequence system as defined in the PDR

-- =======================
-- PART 1: Campaign Sequences Table
-- =======================

CREATE TABLE IF NOT EXISTS public.campaign_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  total_leads INTEGER DEFAULT 0,
  active_leads INTEGER DEFAULT 0
);

-- =======================
-- PART 2: Campaign Sequence Steps Table
-- =======================

CREATE TABLE IF NOT EXISTS public.campaign_sequence_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.campaign_sequences(id) ON DELETE CASCADE,
  order_position INTEGER NOT NULL,
  step_type TEXT CHECK (step_type IN ('email', 'wait', 'condition')) NOT NULL,
  
  -- Email step fields
  email_subject TEXT,
  email_body TEXT,
  email_template_id UUID,
  send_immediately BOOLEAN DEFAULT false,
  send_time TIME,
  
  -- Wait step fields
  wait_duration INTEGER, -- in hours
  wait_unit TEXT CHECK (wait_unit IN ('hours', 'days', 'weeks')) DEFAULT 'hours',
  business_hours_only BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'UTC',
  
  -- Condition step fields
  condition_type TEXT CHECK (condition_type IN ('opened', 'clicked', 'replied', 'bounced', 'unsubscribed')),
  condition_wait_duration INTEGER DEFAULT 24, -- hours to wait before checking condition
  condition_next_step_true UUID REFERENCES public.campaign_sequence_steps(id),
  condition_next_step_false UUID REFERENCES public.campaign_sequence_steps(id),
  
  -- Common fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 3: Campaign Sequence Leads Table
-- =======================

CREATE TABLE IF NOT EXISTS public.campaign_sequence_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.campaign_sequences(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'unsubscribed')) DEFAULT 'active',
  current_step_id UUID REFERENCES public.campaign_sequence_steps(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(sequence_id, lead_id)
);

-- =======================
-- PART 4: Campaign Sequence Executions Table
-- =======================

CREATE TABLE IF NOT EXISTS public.campaign_sequence_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.campaign_sequences(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.campaign_sequence_steps(id) ON DELETE CASCADE,
  
  -- Execution details
  status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed')) DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  
  -- Email specific fields
  email_send_id UUID,
  email_subject TEXT,
  email_body TEXT,
  
  -- Event tracking
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 5: Indexes
-- =======================

-- Campaign sequences indexes
CREATE INDEX IF NOT EXISTS idx_campaign_sequences_created_by ON public.campaign_sequences(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_sequences_status ON public.campaign_sequences(status);
CREATE INDEX IF NOT EXISTS idx_campaign_sequences_created_at ON public.campaign_sequences(created_at);

-- Campaign sequence steps indexes
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_steps_sequence_id ON public.campaign_sequence_steps(sequence_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_steps_order ON public.campaign_sequence_steps(sequence_id, order_position);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_steps_type ON public.campaign_sequence_steps(step_type);

-- Campaign sequence leads indexes
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_leads_sequence_id ON public.campaign_sequence_leads(sequence_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_leads_lead_id ON public.campaign_sequence_leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_leads_status ON public.campaign_sequence_leads(status);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_leads_current_step ON public.campaign_sequence_leads(current_step_id);

-- Campaign sequence executions indexes
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_executions_sequence_id ON public.campaign_sequence_executions(sequence_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_executions_lead_id ON public.campaign_sequence_executions(lead_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_executions_step_id ON public.campaign_sequence_executions(step_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_executions_status ON public.campaign_sequence_executions(status);
CREATE INDEX IF NOT EXISTS idx_campaign_sequence_executions_scheduled_at ON public.campaign_sequence_executions(scheduled_at);

-- =======================
-- PART 6: Row Level Security
-- =======================

ALTER TABLE public.campaign_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sequence_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sequence_executions ENABLE ROW LEVEL SECURITY;

-- Campaign sequences: Users can only see their own sequences
CREATE POLICY "Users can view their own campaign sequences" ON public.campaign_sequences
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can manage their own campaign sequences" ON public.campaign_sequences
  FOR ALL 
  USING (created_by = auth.uid());

-- Campaign sequence steps: Users can see steps for their sequences
CREATE POLICY "Users can view steps for their sequences" ON public.campaign_sequence_steps
  FOR SELECT 
  USING (
    sequence_id IN (
      SELECT id FROM public.campaign_sequences 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage steps for their sequences" ON public.campaign_sequence_steps
  FOR ALL 
  USING (
    sequence_id IN (
      SELECT id FROM public.campaign_sequences 
      WHERE created_by = auth.uid()
    )
  );

-- Campaign sequence leads: Users can see leads for their sequences
CREATE POLICY "Users can view leads for their sequences" ON public.campaign_sequence_leads
  FOR SELECT 
  USING (
    sequence_id IN (
      SELECT id FROM public.campaign_sequences 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage leads for their sequences" ON public.campaign_sequence_leads
  FOR ALL 
  USING (
    sequence_id IN (
      SELECT id FROM public.campaign_sequences 
      WHERE created_by = auth.uid()
    )
  );

-- Campaign sequence executions: Users can see executions for their sequences
CREATE POLICY "Users can view executions for their sequences" ON public.campaign_sequence_executions
  FOR SELECT 
  USING (
    sequence_id IN (
      SELECT id FROM public.campaign_sequences 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage executions for their sequences" ON public.campaign_sequence_executions
  FOR ALL 
  USING (
    sequence_id IN (
      SELECT id FROM public.campaign_sequences 
      WHERE created_by = auth.uid()
    )
  );

-- =======================
-- PART 7: Triggers
-- =======================

-- Trigger to update sequence lead counts
CREATE OR REPLACE FUNCTION update_sequence_lead_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.campaign_sequences
    SET 
      total_leads = total_leads + 1,
      active_leads = CASE WHEN NEW.status = 'active' THEN active_leads + 1 ELSE active_leads END
    WHERE id = NEW.sequence_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != NEW.status THEN
      UPDATE public.campaign_sequences
      SET 
        active_leads = CASE 
          WHEN OLD.status = 'active' AND NEW.status != 'active' THEN active_leads - 1
          WHEN OLD.status != 'active' AND NEW.status = 'active' THEN active_leads + 1
          ELSE active_leads
        END
      WHERE id = NEW.sequence_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.campaign_sequences
    SET 
      total_leads = total_leads - 1,
      active_leads = CASE WHEN OLD.status = 'active' THEN active_leads - 1 ELSE active_leads END
    WHERE id = OLD.sequence_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_sequence_lead_counts
  AFTER INSERT OR UPDATE OR DELETE ON public.campaign_sequence_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_sequence_lead_counts();

-- Standard updated_at triggers
CREATE TRIGGER update_campaign_sequences_updated_at 
  BEFORE UPDATE ON public.campaign_sequences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_sequence_steps_updated_at 
  BEFORE UPDATE ON public.campaign_sequence_steps 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_sequence_leads_updated_at 
  BEFORE UPDATE ON public.campaign_sequence_leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_sequence_executions_updated_at 
  BEFORE UPDATE ON public.campaign_sequence_executions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- PART 8: Helper Functions
-- =======================

-- Function to get next step in sequence
CREATE OR REPLACE FUNCTION get_next_step_in_sequence(
  p_sequence_id UUID,
  p_current_step_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_next_step_id UUID;
BEGIN
  IF p_current_step_id IS NULL THEN
    -- Get first step
    SELECT id INTO v_next_step_id
    FROM public.campaign_sequence_steps
    WHERE sequence_id = p_sequence_id
    ORDER BY order_position ASC
    LIMIT 1;
  ELSE
    -- Get next step
    SELECT id INTO v_next_step_id
    FROM public.campaign_sequence_steps
    WHERE sequence_id = p_sequence_id
      AND order_position > (
        SELECT order_position 
        FROM public.campaign_sequence_steps 
        WHERE id = p_current_step_id
      )
    ORDER BY order_position ASC
    LIMIT 1;
  END IF;
  
  RETURN v_next_step_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to schedule next execution
CREATE OR REPLACE FUNCTION schedule_next_execution(
  p_sequence_id UUID,
  p_lead_id UUID,
  p_step_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_execution_id UUID;
  v_scheduled_at TIMESTAMP WITH TIME ZONE;
  v_step RECORD;
BEGIN
  -- Get step details
  SELECT * INTO v_step
  FROM public.campaign_sequence_steps
  WHERE id = p_step_id;
  
  -- Calculate scheduled time
  IF v_step.step_type = 'email' AND v_step.send_immediately THEN
    v_scheduled_at := now();
  ELSIF v_step.step_type = 'wait' THEN
    v_scheduled_at := now() + (v_step.wait_duration || ' ' || v_step.wait_unit)::INTERVAL;
  ELSE
    v_scheduled_at := now();
  END IF;
  
  -- Create execution record
  INSERT INTO public.campaign_sequence_executions (
    sequence_id,
    lead_id,
    step_id,
    status,
    scheduled_at,
    email_subject,
    email_body
  ) VALUES (
    p_sequence_id,
    p_lead_id,
    p_step_id,
    'pending',
    v_scheduled_at,
    v_step.email_subject,
    v_step.email_body
  ) RETURNING id INTO v_execution_id;
  
  RETURN v_execution_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =======================
-- PART 9: Comments
-- =======================

COMMENT ON TABLE public.campaign_sequences IS 'Email sequence campaigns for automated outreach';
COMMENT ON TABLE public.campaign_sequence_steps IS 'Individual steps within a campaign sequence (email, wait, condition)';
COMMENT ON TABLE public.campaign_sequence_leads IS 'Leads enrolled in campaign sequences';
COMMENT ON TABLE public.campaign_sequence_executions IS 'Individual executions of sequence steps';
COMMENT ON FUNCTION get_next_step_in_sequence IS 'Gets the next step in a sequence for a lead';
COMMENT ON FUNCTION schedule_next_execution IS 'Schedules the next execution for a lead in a sequence';
COMMENT ON FUNCTION update_sequence_lead_counts IS 'Trigger function to update lead counts on sequence changes';
