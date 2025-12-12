-- Create email_replies table
-- Migration: create_email_replies_table
-- Date: 2025-02-01
-- Description: Creates email_replies table for tracking email replies with sentiment analysis

CREATE TABLE IF NOT EXISTS public.email_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  gmail_message_id TEXT NOT NULL,
  gmail_thread_id TEXT NOT NULL,
  from_email TEXT NOT NULL,
  reply_subject TEXT,
  reply_body_plain TEXT,
  reply_body_html TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sentiment TEXT,
  sentiment_confidence NUMERIC,
  sentiment_reasoning TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  triggered_stage_change BOOLEAN DEFAULT false,
  previous_stage TEXT,
  new_stage TEXT,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processing_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_replies_person_id ON public.email_replies(person_id);
CREATE INDEX IF NOT EXISTS idx_email_replies_company_id ON public.email_replies(company_id);
CREATE INDEX IF NOT EXISTS idx_email_replies_gmail_message_id ON public.email_replies(gmail_message_id);
CREATE INDEX IF NOT EXISTS idx_email_replies_gmail_thread_id ON public.email_replies(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_email_replies_received_at ON public.email_replies(received_at);
CREATE INDEX IF NOT EXISTS idx_email_replies_detected_at ON public.email_replies(detected_at);

-- Enable RLS
ALTER TABLE public.email_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view email replies for their people" ON public.email_replies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.people
      WHERE people.id = email_replies.person_id
      AND (people.owner_id = auth.uid() OR people.owner_id IS NULL)
    )
  );

CREATE POLICY "Users can insert email replies for their people" ON public.email_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.people
      WHERE people.id = email_replies.person_id
      AND (people.owner_id = auth.uid() OR people.owner_id IS NULL)
    )
  );

CREATE POLICY "Users can update email replies for their people" ON public.email_replies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.people
      WHERE people.id = email_replies.person_id
      AND (people.owner_id = auth.uid() OR people.owner_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.people
      WHERE people.id = email_replies.person_id
      AND (people.owner_id = auth.uid() OR people.owner_id IS NULL)
    )
  );

-- Comments
COMMENT ON TABLE public.email_replies IS 'Tracks email replies received from people with sentiment analysis';
COMMENT ON COLUMN public.email_replies.sentiment IS 'Sentiment classification: interested, not_interested, maybe, out_of_office, neutral';
COMMENT ON COLUMN public.email_replies.sentiment_confidence IS 'Confidence score for sentiment analysis (0.0 to 1.0)';
COMMENT ON COLUMN public.email_replies.detected_at IS 'When the reply was first detected by the system';
COMMENT ON COLUMN public.email_replies.received_at IS 'When the email was actually received (from Gmail)';

