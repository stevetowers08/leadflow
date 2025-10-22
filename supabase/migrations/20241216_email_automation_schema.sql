-- Email Automation Database Schema
-- Comprehensive schema for Resend email integration and automation tracking

-- Email domains table
CREATE TABLE IF NOT EXISTS email_domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id VARCHAR(40) NOT NULL UNIQUE, -- Resend domain ID
    name VARCHAR(255) NOT NULL,
    status VARCHAR(24) CHECK (status IN ('pending', 'verified', 'failed')) NOT NULL DEFAULT 'pending',
    dns_records JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of email steps
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('email', 'sms', 'multi_channel')) NOT NULL DEFAULT 'email',
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'completed')) NOT NULL DEFAULT 'draft',
    sequence_id UUID REFERENCES email_sequences(id),
    domain_id UUID REFERENCES email_domains(id),
    target_audience JSONB DEFAULT '[]'::jsonb, -- Array of contact IDs or filters
    settings JSONB DEFAULT '{}'::jsonb, -- Campaign-specific settings
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    variables JSONB DEFAULT '[]'::jsonb, -- Available template variables
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email sends table (individual email sends)
CREATE TABLE IF NOT EXISTS email_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id),
    sequence_id UUID REFERENCES email_sequences(id),
    template_id UUID REFERENCES email_templates(id),
    contact_id UUID REFERENCES people(id),
    domain_id UUID REFERENCES email_domains(id),
    provider_email_id VARCHAR(100), -- Resend email ID
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body_html TEXT,
    body_text TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
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

-- SMS campaigns table (for Twilio integration)
CREATE TABLE IF NOT EXISTS sms_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'completed')) NOT NULL DEFAULT 'draft',
    target_audience JSONB DEFAULT '[]'::jsonb,
    message_template TEXT NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- SMS sends table
CREATE TABLE IF NOT EXISTS sms_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES sms_campaigns(id),
    contact_id UUID REFERENCES people(id),
    provider_message_id VARCHAR(100), -- Twilio message SID
    from_number VARCHAR(20) NOT NULL,
    to_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'undelivered')) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-channel campaigns table
CREATE TABLE IF NOT EXISTS multi_channel_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'completed')) NOT NULL DEFAULT 'draft',
    email_campaign_id UUID REFERENCES email_campaigns(id),
    sms_campaign_id UUID REFERENCES sms_campaigns(id),
    channel_rules JSONB DEFAULT '{}'::jsonb, -- Rules for when to use which channel
    target_audience JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation triggers table
CREATE TABLE IF NOT EXISTS automation_triggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL, -- 'lead_created', 'stage_changed', 'email_opened', etc.
    conditions JSONB DEFAULT '{}'::jsonb, -- Trigger conditions
    actions JSONB DEFAULT '[]'::jsonb, -- Actions to take
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trigger_id UUID REFERENCES automation_triggers(id),
    contact_id UUID REFERENCES people(id),
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email unsubscribes table
CREATE TABLE IF NOT EXISTS email_unsubscribes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    domain_id UUID REFERENCES email_domains(id),
    reason VARCHAR(100), -- 'user_request', 'bounce', 'complaint'
    unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(email, domain_id)
);

-- SMS opt-outs table
CREATE TABLE IF NOT EXISTS sms_opt_outs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    reason VARCHAR(100), -- 'user_request', 'carrier_rejection'
    opted_out_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(phone_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_domains_status ON email_domains(status);
CREATE INDEX IF NOT EXISTS idx_email_domains_provider_id ON email_domains(provider_id);

CREATE INDEX IF NOT EXISTS idx_email_sequences_active ON email_sequences(is_active);
CREATE INDEX IF NOT EXISTS idx_email_sequences_created_by ON email_sequences(created_by);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_type ON email_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_by ON email_campaigns(created_by);

CREATE INDEX IF NOT EXISTS idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_contact ON email_sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_provider_id ON email_sends(provider_email_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_sent_at ON email_sends(sent_at);

CREATE INDEX IF NOT EXISTS idx_email_events_email_send ON email_events(email_send_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_timestamp ON email_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_email_events_processed ON email_events(processed);

CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON sms_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_created_by ON sms_campaigns(created_by);

CREATE INDEX IF NOT EXISTS idx_sms_sends_campaign ON sms_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sms_sends_contact ON sms_sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_sms_sends_status ON sms_sends(status);
CREATE INDEX IF NOT EXISTS idx_sms_sends_provider_id ON sms_sends(provider_message_id);

CREATE INDEX IF NOT EXISTS idx_automation_triggers_active ON automation_triggers(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_triggers_type ON automation_triggers(trigger_type);

CREATE INDEX IF NOT EXISTS idx_automation_logs_trigger ON automation_logs(trigger_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_contact ON automation_logs(contact_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_automation_logs_executed_at ON automation_logs(executed_at);

-- RLS Policies
ALTER TABLE email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_channel_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_unsubscribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_opt_outs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_domains
CREATE POLICY "Users can view their own email domains" ON email_domains
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own email domains" ON email_domains
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own email domains" ON email_domains
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for email_sequences
CREATE POLICY "Users can view their own email sequences" ON email_sequences
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own email sequences" ON email_sequences
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own email sequences" ON email_sequences
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for email_campaigns
CREATE POLICY "Users can view their own email campaigns" ON email_campaigns
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own email campaigns" ON email_campaigns
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own email campaigns" ON email_campaigns
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for email_sends
CREATE POLICY "Users can view their own email sends" ON email_sends
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own email sends" ON email_sends
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own email sends" ON email_sends
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for email_events
CREATE POLICY "Users can view their own email events" ON email_events
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own email events" ON email_events
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own email events" ON email_events
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for sms_campaigns
CREATE POLICY "Users can view their own sms campaigns" ON sms_campaigns
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own sms campaigns" ON sms_campaigns
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own sms campaigns" ON sms_campaigns
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for sms_sends
CREATE POLICY "Users can view their own sms sends" ON sms_sends
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own sms sends" ON sms_sends
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own sms sends" ON sms_sends
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for automation_triggers
CREATE POLICY "Users can view their own automation triggers" ON automation_triggers
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own automation triggers" ON automation_triggers
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own automation triggers" ON automation_triggers
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for automation_logs
CREATE POLICY "Users can view their own automation logs" ON automation_logs
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own automation logs" ON automation_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own automation logs" ON automation_logs
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_email_domains_updated_at BEFORE UPDATE ON email_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON email_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sms_campaigns_updated_at BEFORE UPDATE ON sms_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_multi_channel_campaigns_updated_at BEFORE UPDATE ON multi_channel_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_triggers_updated_at BEFORE UPDATE ON automation_triggers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

