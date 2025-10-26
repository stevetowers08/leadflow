-- Migration: Add job qualification webhook system
-- Date: 2025-01-27
-- Description: Creates webhook logging table and updates job qualification to trigger n8n webhook

-- 1. Create webhook_logs table for tracking webhook events
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  response_status INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for webhook_logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_entity ON webhook_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);

-- 3. Add RLS policies for webhook_logs
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert webhook logs
CREATE POLICY "Service role can manage webhook logs" ON webhook_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read webhook logs
CREATE POLICY "Authenticated users can read webhook_logs" ON webhook_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Create function to trigger job qualification webhook
CREATE OR REPLACE FUNCTION trigger_job_qualification_webhook()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
BEGIN
  -- Only trigger when qualification_status changes to 'qualify'
  IF NEW.qualification_status = 'qualify' AND 
     (OLD.qualification_status IS NULL OR OLD.qualification_status != 'qualify') THEN
    
    -- Get webhook URL from environment or settings
    webhook_url := current_setting('app.job_qualification_webhook_url', true);
    
    -- If webhook URL is configured, trigger the webhook
    IF webhook_url IS NOT NULL AND webhook_url != '' THEN
      -- Prepare payload
      payload := json_build_object(
        'job_id', NEW.id,
        'qualification_status', NEW.qualification_status,
        'qualified_at', NEW.qualified_at,
        'qualified_by', NEW.qualified_by,
        'qualification_notes', NEW.qualification_notes
      );
      
      -- Log the webhook trigger attempt
      INSERT INTO webhook_logs (event_type, entity_id, entity_type, payload)
      VALUES ('job_qualification_trigger', NEW.id::text, 'job', payload);
      
      -- Note: The actual webhook call will be handled by the Edge Function
      -- This trigger just logs the event for debugging
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for job qualification webhook
DROP TRIGGER IF EXISTS job_qualification_webhook_trigger ON jobs;
CREATE TRIGGER job_qualification_webhook_trigger
  AFTER UPDATE OF qualification_status ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_job_qualification_webhook();

-- 6. Add updated_at trigger for webhook_logs
CREATE TRIGGER update_webhook_logs_updated_at 
  BEFORE UPDATE ON webhook_logs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Add comments for documentation
COMMENT ON TABLE webhook_logs IS 'Logs webhook events for debugging and monitoring';
COMMENT ON COLUMN webhook_logs.event_type IS 'Type of webhook event (e.g., job_qualification)';
COMMENT ON COLUMN webhook_logs.entity_id IS 'ID of the entity that triggered the webhook';
COMMENT ON COLUMN webhook_logs.entity_type IS 'Type of entity (e.g., job, company, person)';
COMMENT ON COLUMN webhook_logs.payload IS 'JSON payload sent to webhook';
COMMENT ON COLUMN webhook_logs.response_status IS 'HTTP response status from webhook endpoint';

COMMENT ON FUNCTION trigger_job_qualification_webhook() IS 'Triggers webhook when job qualification status changes to qualify';
COMMENT ON TRIGGER job_qualification_webhook_trigger ON jobs IS 'Trigger that fires when job qualification status changes to qualify';
