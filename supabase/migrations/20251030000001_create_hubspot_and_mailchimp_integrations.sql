-- HubSpot and Mailchimp Integration Migration
-- Migration: create_hubspot_and_mailchimp_integrations
-- Date: 2025-10-30
-- Description: Creates database schema for HubSpot and Mailchimp API integrations

-- =======================
-- PART 1: HubSpot Integration Tables
-- =======================

-- HubSpot connections table
CREATE TABLE IF NOT EXISTS public.hubspot_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  portal_id TEXT,
  hub_id TEXT,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- HubSpot sync logs table
CREATE TABLE IF NOT EXISTS public.hubspot_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.hubspot_connections(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('contact', 'company', 'deal', 'all')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'bidirectional')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- HubSpot contact mappings (map internal contacts to HubSpot)
CREATE TABLE IF NOT EXISTS public.hubspot_contact_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.hubspot_connections(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  hubspot_contact_id TEXT NOT NULL,
  email TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(connection_id, person_id),
  UNIQUE(connection_id, hubspot_contact_id)
);

-- HubSpot company mappings
CREATE TABLE IF NOT EXISTS public.hubspot_company_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.hubspot_connections(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  hubspot_company_id TEXT NOT NULL,
  domain TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(connection_id, company_id),
  UNIQUE(connection_id, hubspot_company_id)
);

-- =======================
-- PART 2: Mailchimp Integration Tables
-- =======================

-- Mailchimp connections table
CREATE TABLE IF NOT EXISTS public.mailchimp_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  data_center TEXT NOT NULL,
  primary_list_id TEXT,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Mailchimp sync logs table
CREATE TABLE IF NOT EXISTS public.mailchimp_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.mailchimp_connections(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('subscriber', 'campaign', 'all')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'bidirectional')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  list_id TEXT,
  campaign_id TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mailchimp subscriber mappings (map internal people to Mailchimp subscribers)
CREATE TABLE IF NOT EXISTS public.mailchimp_subscriber_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.mailchimp_connections(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  subscriber_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  subscriber_id TEXT,
  list_id TEXT,
  status TEXT CHECK (status IN ('subscribed', 'unsubscribed', 'cleaned', 'pending')),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(connection_id, person_id),
  UNIQUE(connection_id, subscriber_hash)
);

-- =======================
-- PART 3: Integration Settings
-- =======================

-- Integration settings table (general settings for all integrations)
CREATE TABLE IF NOT EXISTS public.integration_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('hubspot', 'mailchimp', 'gmail')),
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform, setting_key)
);

-- =======================
-- PART 4: Indexes for Performance
-- =======================

-- HubSpot indexes
CREATE INDEX IF NOT EXISTS idx_hubspot_connections_user_id ON public.hubspot_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_connections_is_active ON public.hubspot_connections(is_active);
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_logs_connection_id ON public.hubspot_sync_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_logs_synced_at ON public.hubspot_sync_logs(synced_at);
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_logs_status ON public.hubspot_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_hubspot_contact_mappings_connection_person ON public.hubspot_contact_mappings(connection_id, person_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_contact_mappings_hubspot_id ON public.hubspot_contact_mappings(hubspot_contact_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_company_mappings_connection_company ON public.hubspot_company_mappings(connection_id, company_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_company_mappings_hubspot_id ON public.hubspot_company_mappings(hubspot_company_id);

-- Mailchimp indexes
CREATE INDEX IF NOT EXISTS idx_mailchimp_connections_user_id ON public.mailchimp_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_mailchimp_connections_is_active ON public.mailchimp_connections(is_active);
CREATE INDEX IF NOT EXISTS idx_mailchimp_sync_logs_connection_id ON public.mailchimp_sync_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_mailchimp_sync_logs_synced_at ON public.mailchimp_sync_logs(synced_at);
CREATE INDEX IF NOT EXISTS idx_mailchimp_sync_logs_status ON public.mailchimp_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_mailchimp_subscriber_mappings_connection_person ON public.mailchimp_subscriber_mappings(connection_id, person_id);
CREATE INDEX IF NOT EXISTS idx_mailchimp_subscriber_mappings_subscriber_hash ON public.mailchimp_subscriber_mappings(subscriber_hash);
CREATE INDEX IF NOT EXISTS idx_mailchimp_subscriber_mappings_email ON public.mailchimp_subscriber_mappings(email);

-- Integration settings indexes
CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON public.integration_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_platform ON public.integration_settings(platform);

-- =======================
-- PART 5: Enable RLS
-- =======================

-- Enable RLS on all tables
ALTER TABLE public.hubspot_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubspot_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubspot_contact_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubspot_company_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailchimp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailchimp_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailchimp_subscriber_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

-- =======================
-- PART 6: RLS Policies
-- =======================

-- HubSpot connection policies
CREATE POLICY "Users can view their own HubSpot connections"
ON public.hubspot_connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own HubSpot connections"
ON public.hubspot_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own HubSpot connections"
ON public.hubspot_connections FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own HubSpot connections"
ON public.hubspot_connections FOR DELETE
USING (auth.uid() = user_id);

-- HubSpot sync logs policies
CREATE POLICY "Users can view sync logs for their connections"
ON public.hubspot_sync_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hubspot_connections hc
    WHERE hc.id = hubspot_sync_logs.connection_id
    AND hc.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert hubspot sync logs"
ON public.hubspot_sync_logs FOR INSERT
WITH CHECK (true);

-- HubSpot contact mapping policies
CREATE POLICY "Users can view contact mappings for their connections"
ON public.hubspot_contact_mappings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hubspot_connections hc
    WHERE hc.id = hubspot_contact_mappings.connection_id
    AND hc.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage hubspot contact mappings"
ON public.hubspot_contact_mappings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.hubspot_connections hc
    WHERE hc.id = hubspot_contact_mappings.connection_id
    AND hc.user_id = auth.uid()
  )
);

-- HubSpot company mapping policies
CREATE POLICY "Users can view company mappings for their connections"
ON public.hubspot_company_mappings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hubspot_connections hc
    WHERE hc.id = hubspot_company_mappings.connection_id
    AND hc.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage hubspot company mappings"
ON public.hubspot_company_mappings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.hubspot_connections hc
    WHERE hc.id = hubspot_company_mappings.connection_id
    AND hc.user_id = auth.uid()
  )
);

-- Mailchimp connection policies
CREATE POLICY "Users can view their own Mailchimp connections"
ON public.mailchimp_connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Mailchimp connections"
ON public.mailchimp_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Mailchimp connections"
ON public.mailchimp_connections FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Mailchimp connections"
ON public.mailchimp_connections FOR DELETE
USING (auth.uid() = user_id);

-- Mailchimp sync logs policies
CREATE POLICY "Users can view sync logs for their connections"
ON public.mailchimp_sync_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mailchimp_connections mc
    WHERE mc.id = mailchimp_sync_logs.connection_id
    AND mc.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert mailchimp sync logs"
ON public.mailchimp_sync_logs FOR INSERT
WITH CHECK (true);

-- Mailchimp subscriber mapping policies
CREATE POLICY "Users can view subscriber mappings for their connections"
ON public.mailchimp_subscriber_mappings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mailchimp_connections mc
    WHERE mc.id = mailchimp_subscriber_mappings.connection_id
    AND mc.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage mailchimp subscriber mappings"
ON public.mailchimp_subscriber_mappings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.mailchimp_connections mc
    WHERE mc.id = mailchimp_subscriber_mappings.connection_id
    AND mc.user_id = auth.uid()
  )
);

-- Integration settings policies
CREATE POLICY "Users can view their own integration settings"
ON public.integration_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration settings"
ON public.integration_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration settings"
ON public.integration_settings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration settings"
ON public.integration_settings FOR DELETE
USING (auth.uid() = user_id);

-- =======================
-- PART 7: Update Triggers
-- =======================

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_integration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_hubspot_connections_updated_at
  BEFORE UPDATE ON public.hubspot_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_integration_updated_at();

CREATE TRIGGER update_mailchimp_connections_updated_at
  BEFORE UPDATE ON public.mailchimp_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_integration_updated_at();

CREATE TRIGGER update_integration_settings_updated_at
  BEFORE UPDATE ON public.integration_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_integration_updated_at();

-- =======================
-- PART 8: Comments for Documentation
-- =======================

COMMENT ON TABLE public.hubspot_connections IS 'Stores HubSpot OAuth connection credentials and status';
COMMENT ON TABLE public.hubspot_sync_logs IS 'Logs synchronization activity between app and HubSpot';
COMMENT ON TABLE public.hubspot_contact_mappings IS 'Maps internal people records to HubSpot contacts';
COMMENT ON TABLE public.hubspot_company_mappings IS 'Maps internal companies to HubSpot companies';

COMMENT ON TABLE public.mailchimp_connections IS 'Stores Mailchimp API credentials and connection status';
COMMENT ON TABLE public.mailchimp_sync_logs IS 'Logs synchronization activity between app and Mailchimp';
COMMENT ON TABLE public.mailchimp_subscriber_mappings IS 'Maps internal people records to Mailchimp subscribers';

COMMENT ON TABLE public.integration_settings IS 'Stores platform-specific integration settings per user';
