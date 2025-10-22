-- Comprehensive Workflow Automation Database Schema
-- Consolidates email automation, SMS automation, and workflow management
-- Created: 2024-12-16

-- ==============================================
-- EMAIL AUTOMATION TABLES
-- ==============================================

-- Email domains table (Resend integration)
CREATE TABLE IF NOT EXISTS email_domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id VARCHAR(40) NOT NULL UNIQUE, -- Resend domain ID
    name VARCHAR(255) NOT NULL,
    status VARCHAR(24) CHECK (status IN ('pending', 'verified', 'failed')) NOT NULL DEFAULT 'pending',
    dns_records JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT,
    text_content TEXT,
    variables JSONB DEFAULT '[]'::jsonb, -- Available template variables
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of email steps
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('email', 'sms', 'multi_channel')) NOT NULL DEFAULT 'email',
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'completed')) NOT NULL DEFAULT 'draft',
    sequence_id UUID REFERENCES email_sequences(id),
    domain_id UUID REFERENCES email_domains(id),
    target_audience JSONB DEFAULT '[]'::jsonb, -- Array of contact IDs or filters
    settings JSONB DEFAULT '{}'::jsonb, -- Campaign-specific settings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Email sends table (tracks individual emails)
CREATE TABLE IF NOT EXISTS email_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id),
    person_id UUID REFERENCES people(id),
    email_template_id UUID REFERENCES email_templates(id),
    provider_email_id VARCHAR(100), -- Resend email ID
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'replied', 'failed')) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email events table (webhook events from Resend)
CREATE TABLE IF NOT EXISTS email_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_send_id UUID REFERENCES email_sends(id),
    provider_event_id VARCHAR(100), -- Resend event ID
    event_type VARCHAR(20) CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'replied', 'complained')) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb, -- Full webhook payload
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- SMS AUTOMATION TABLES (Twilio Integration)
-- ==============================================

-- SMS campaigns table
CREATE TABLE IF NOT EXISTS sms_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'completed')) NOT NULL DEFAULT 'draft',
    target_audience JSONB DEFAULT '[]'::jsonb,
    message_template TEXT NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- SMS sends table
CREATE TABLE IF NOT EXISTS sms_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES sms_campaigns(id),
    person_id UUID REFERENCES people(id),
    provider_message_id VARCHAR(100), -- Twilio message SID
    from_number VARCHAR(20) NOT NULL,
    to_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'undelivered')) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    error_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS opt-outs table
CREATE TABLE IF NOT EXISTS sms_opt_outs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    reason VARCHAR(50) DEFAULT 'user_request',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- WORKFLOW AUTOMATION TABLES
-- ==============================================

-- Workflow templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'lead_followup', 'appointment_reminder', 'nurturing', etc.
    template_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Complete workflow structure
    is_prebuilt BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'archived')) NOT NULL DEFAULT 'draft',
    workflow_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Complete workflow structure
    trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb, -- Trigger configuration
    settings JSONB DEFAULT '{}'::jsonb, -- Workflow-specific settings
    template_id UUID REFERENCES workflow_templates(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activated_at TIMESTAMP WITH TIME ZONE,
    paused_at TIMESTAMP WITH TIME ZONE
);

-- Workflow nodes table (individual steps in a workflow)
CREATE TABLE IF NOT EXISTS workflow_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL, -- Unique ID within the workflow
    node_type VARCHAR(50) NOT NULL, -- 'trigger', 'action', 'condition', 'delay', 'end'
    node_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Node-specific configuration
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, node_id)
);

-- Workflow connections table (links between nodes)
CREATE TABLE IF NOT EXISTS workflow_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    from_node_id VARCHAR(50) NOT NULL,
    to_node_id VARCHAR(50) NOT NULL,
    connection_type VARCHAR(20) DEFAULT 'default', -- 'default', 'true', 'false' for conditions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, from_node_id, to_node_id, connection_type)
);

-- Workflow executions table (tracks when workflows run)
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id),
    person_id UUID REFERENCES people(id),
    trigger_data JSONB DEFAULT '{}'::jsonb, -- Data that triggered the workflow
    status VARCHAR(20) CHECK (status IN ('running', 'completed', 'failed', 'paused')) NOT NULL DEFAULT 'running',
    current_node_id VARCHAR(50), -- Current position in workflow
    execution_data JSONB DEFAULT '{}'::jsonb, -- Data collected during execution
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Workflow execution logs table (detailed step-by-step logs)
CREATE TABLE IF NOT EXISTS workflow_execution_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'started', 'completed', 'failed', 'skipped'
    event_data JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- MULTI-CHANNEL CAMPAIGNS
-- ==============================================

-- Multi-channel campaigns table
CREATE TABLE IF NOT EXISTS multi_channel_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'completed')) NOT NULL DEFAULT 'draft',
    channels JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of channel configurations
    target_audience JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- INTEGRATION SETTINGS
-- ==============================================

-- Integration settings table
CREATE TABLE IF NOT EXISTS integration_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL, -- 'resend', 'twilio', 'webhook'
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, integration_type)
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Email automation indexes
CREATE INDEX IF NOT EXISTS idx_email_domains_user_id ON email_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_email_domains_status ON email_domains(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_user_id ON email_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_user_id ON email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_person_id ON email_sends(person_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_events_email_send_id ON email_events(email_send_id);
CREATE INDEX IF NOT EXISTS idx_email_events_event_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_timestamp ON email_events(timestamp);

-- SMS automation indexes
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_user_id ON sms_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON sms_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sms_sends_campaign_id ON sms_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sms_sends_person_id ON sms_sends(person_id);
CREATE INDEX IF NOT EXISTS idx_sms_sends_status ON sms_sends(status);
CREATE INDEX IF NOT EXISTS idx_sms_sends_provider_message_id ON sms_sends(provider_message_id);

-- Workflow automation indexes
CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_workflow_id ON workflow_nodes(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_workflow_id ON workflow_connections(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_person_id ON workflow_executions(person_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_execution_id ON workflow_execution_logs(execution_id);

-- Multi-channel campaign indexes
CREATE INDEX IF NOT EXISTS idx_multi_channel_campaigns_user_id ON multi_channel_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_multi_channel_campaigns_status ON multi_channel_campaigns(status);

-- Integration settings indexes
CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON integration_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_type ON integration_settings(integration_type);

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_opt_outs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_channel_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- Email automation RLS policies
CREATE POLICY "Users can view their own email domains" ON email_domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own email domains" ON email_domains FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own email domains" ON email_domains FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own email domains" ON email_domains FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email templates" ON email_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own email templates" ON email_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own email templates" ON email_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own email templates" ON email_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email sequences" ON email_sequences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own email sequences" ON email_sequences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own email sequences" ON email_sequences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own email sequences" ON email_sequences FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email campaigns" ON email_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own email campaigns" ON email_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own email campaigns" ON email_campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own email campaigns" ON email_campaigns FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email sends" ON email_sends FOR SELECT USING (
    EXISTS (SELECT 1 FROM email_campaigns WHERE id = email_sends.campaign_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own email sends" ON email_sends FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM email_campaigns WHERE id = email_sends.campaign_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own email sends" ON email_sends FOR UPDATE USING (
    EXISTS (SELECT 1 FROM email_campaigns WHERE id = email_sends.campaign_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own email events" ON email_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM email_sends es 
            JOIN email_campaigns ec ON es.campaign_id = ec.id 
            WHERE es.id = email_events.email_send_id AND ec.user_id = auth.uid())
);

-- SMS automation RLS policies
CREATE POLICY "Users can view their own SMS campaigns" ON sms_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own SMS campaigns" ON sms_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own SMS campaigns" ON sms_campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own SMS campaigns" ON sms_campaigns FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own SMS sends" ON sms_sends FOR SELECT USING (
    EXISTS (SELECT 1 FROM sms_campaigns WHERE id = sms_sends.campaign_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own SMS sends" ON sms_sends FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM sms_campaigns WHERE id = sms_sends.campaign_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own SMS sends" ON sms_sends FOR UPDATE USING (
    EXISTS (SELECT 1 FROM sms_campaigns WHERE id = sms_sends.campaign_id AND user_id = auth.uid())
);

-- SMS opt-outs are global (no user-specific access needed)
CREATE POLICY "Anyone can view SMS opt-outs" ON sms_opt_outs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert SMS opt-outs" ON sms_opt_outs FOR INSERT WITH CHECK (true);

-- Workflow automation RLS policies
CREATE POLICY "Users can view their own workflows" ON workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workflows" ON workflows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workflows" ON workflows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workflows" ON workflows FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow nodes" ON workflow_nodes FOR SELECT USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_nodes.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own workflow nodes" ON workflow_nodes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_nodes.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own workflow nodes" ON workflow_nodes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_nodes.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their own workflow nodes" ON workflow_nodes FOR DELETE USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_nodes.workflow_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own workflow connections" ON workflow_connections FOR SELECT USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_connections.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own workflow connections" ON workflow_connections FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_connections.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own workflow connections" ON workflow_connections FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_connections.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their own workflow connections" ON workflow_connections FOR DELETE USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_connections.workflow_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own workflow executions" ON workflow_executions FOR SELECT USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_executions.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own workflow executions" ON workflow_executions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_executions.workflow_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own workflow executions" ON workflow_executions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workflows WHERE id = workflow_executions.workflow_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own workflow execution logs" ON workflow_execution_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM workflow_executions we 
            JOIN workflows w ON we.workflow_id = w.id 
            WHERE we.id = workflow_execution_logs.execution_id AND w.user_id = auth.uid())
);

-- Workflow templates are global (shared across users)
CREATE POLICY "Anyone can view workflow templates" ON workflow_templates FOR SELECT USING (true);
CREATE POLICY "Users can insert workflow templates" ON workflow_templates FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own workflow templates" ON workflow_templates FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own workflow templates" ON workflow_templates FOR DELETE USING (auth.uid() = created_by);

-- Multi-channel campaigns RLS policies
CREATE POLICY "Users can view their own multi-channel campaigns" ON multi_channel_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own multi-channel campaigns" ON multi_channel_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own multi-channel campaigns" ON multi_channel_campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own multi-channel campaigns" ON multi_channel_campaigns FOR DELETE USING (auth.uid() = user_id);

-- Integration settings RLS policies
CREATE POLICY "Users can view their own integration settings" ON integration_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own integration settings" ON integration_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own integration settings" ON integration_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own integration settings" ON integration_settings FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_email_domains_updated_at BEFORE UPDATE ON email_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON email_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sms_campaigns_updated_at BEFORE UPDATE ON sms_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_templates_updated_at BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_multi_channel_campaigns_updated_at BEFORE UPDATE ON multi_channel_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integration_settings_updated_at BEFORE UPDATE ON integration_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- SAMPLE DATA (OPTIONAL)
-- ==============================================

-- Insert sample workflow templates
INSERT INTO workflow_templates (name, description, category, template_data, is_prebuilt) VALUES
('New Lead Follow-up', 'Automatically follow up with new leads via email and SMS', 'lead_followup', '{
  "nodes": [
    {"id": "trigger", "type": "trigger", "data": {"trigger_type": "new_lead"}},
    {"id": "email1", "type": "action", "data": {"action_type": "send_email", "template": "welcome_email"}},
    {"id": "delay1", "type": "delay", "data": {"delay_hours": 24}},
    {"id": "sms1", "type": "action", "data": {"action_type": "send_sms", "message": "Thanks for your interest! We''ll be in touch soon."}},
    {"id": "end", "type": "end", "data": {}}
  ],
  "connections": [
    {"from": "trigger", "to": "email1"},
    {"from": "email1", "to": "delay1"},
    {"from": "delay1", "to": "sms1"},
    {"from": "sms1", "to": "end"}
  ]
}', true),
('Appointment Reminders', 'Send reminders before scheduled appointments', 'appointment_reminder', '{
  "nodes": [
    {"id": "trigger", "type": "trigger", "data": {"trigger_type": "appointment_scheduled"}},
    {"id": "delay1", "type": "delay", "data": {"delay_hours": 24}},
    {"id": "email1", "type": "action", "data": {"action_type": "send_email", "template": "appointment_reminder"}},
    {"id": "delay2", "type": "delay", "data": {"delay_hours": 2}},
    {"id": "sms1", "type": "action", "data": {"action_type": "send_sms", "message": "Reminder: You have an appointment in 2 hours."}},
    {"id": "end", "type": "end", "data": {}}
  ],
  "connections": [
    {"from": "trigger", "to": "delay1"},
    {"from": "delay1", "to": "email1"},
    {"from": "email1", "to": "delay2"},
    {"from": "delay2", "to": "sms1"},
    {"from": "sms1", "to": "end"}
  ]
}', true),
('Lead Nurturing', 'Nurture leads with a series of educational emails', 'lead_nurturing', '{
  "nodes": [
    {"id": "trigger", "type": "trigger", "data": {"trigger_type": "lead_added"}},
    {"id": "email1", "type": "action", "data": {"action_type": "send_email", "template": "intro_email"}},
    {"id": "delay1", "type": "delay", "data": {"delay_days": 3}},
    {"id": "email2", "type": "action", "data": {"action_type": "send_email", "template": "value_prop_email"}},
    {"id": "delay2", "type": "delay", "data": {"delay_days": 7}},
    {"id": "email3", "type": "action", "data": {"action_type": "send_email", "template": "case_study_email"}},
    {"id": "end", "type": "end", "data": {}}
  ],
  "connections": [
    {"from": "trigger", "to": "email1"},
    {"from": "email1", "to": "delay1"},
    {"from": "delay1", "to": "email2"},
    {"from": "email2", "to": "delay2"},
    {"from": "delay2", "to": "email3"},
    {"from": "email3", "to": "end"}
  ]
}', true)
ON CONFLICT DO NOTHING;

