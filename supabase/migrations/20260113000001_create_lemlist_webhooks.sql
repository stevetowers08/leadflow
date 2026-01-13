-- Lemlist webhook configurations table
CREATE TABLE IF NOT EXISTS public.lemlist_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  lemlist_webhook_id TEXT UNIQUE, -- ID from lemlist API
  event_types TEXT[] NOT NULL, -- Array of subscribed event types
  campaign_id TEXT, -- Optional: scope to specific campaign
  is_active BOOLEAN NOT NULL DEFAULT true,
  trigger_once BOOLEAN NOT NULL DEFAULT false, -- Only trigger first time event happens
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Webhook delivery log table
CREATE TABLE IF NOT EXISTS public.lemlist_webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES public.lemlist_webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  lead_email TEXT,
  campaign_id TEXT,
  processed BOOLEAN NOT NULL DEFAULT false,
  processing_error TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_lemlist_webhooks_user_id ON public.lemlist_webhooks(user_id);
CREATE INDEX idx_lemlist_webhooks_active ON public.lemlist_webhooks(is_active) WHERE is_active = true;
CREATE INDEX idx_lemlist_webhook_deliveries_webhook_id ON public.lemlist_webhook_deliveries(webhook_id);
CREATE INDEX idx_lemlist_webhook_deliveries_processed ON public.lemlist_webhook_deliveries(processed) WHERE processed = false;
CREATE INDEX idx_lemlist_webhook_deliveries_lead_email ON public.lemlist_webhook_deliveries(lead_email);
CREATE INDEX idx_lemlist_webhook_deliveries_received_at ON public.lemlist_webhook_deliveries(received_at DESC);

-- RLS policies
ALTER TABLE public.lemlist_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lemlist_webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Users can manage their own webhooks
CREATE POLICY "Users can view their own webhooks"
  ON public.lemlist_webhooks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks"
  ON public.lemlist_webhooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks"
  ON public.lemlist_webhooks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks"
  ON public.lemlist_webhooks FOR DELETE
  USING (auth.uid() = user_id);

-- Users can view deliveries for their webhooks
CREATE POLICY "Users can view their webhook deliveries"
  ON public.lemlist_webhook_deliveries FOR SELECT
  USING (
    webhook_id IN (
      SELECT id FROM public.lemlist_webhooks WHERE user_id = auth.uid()
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_lemlist_webhooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lemlist_webhooks_updated_at
  BEFORE UPDATE ON public.lemlist_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_lemlist_webhooks_updated_at();

COMMENT ON TABLE public.lemlist_webhooks IS 'Stores Lemlist webhook configurations for each user';
COMMENT ON TABLE public.lemlist_webhook_deliveries IS 'Audit log of all webhook deliveries from Lemlist';
