-- Add email integration tables
-- Migration: add_email_integration_tables
-- Date: 2025-01-25
-- Description: Adds tables for Gmail integration and email management

-- Create email_threads table for conversation tracking
CREATE TABLE IF NOT EXISTS public.email_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gmail_thread_id TEXT UNIQUE NOT NULL,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  subject TEXT,
  participants JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_messages table for individual emails
CREATE TABLE IF NOT EXISTS public.email_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.email_threads(id) ON DELETE CASCADE,
  gmail_message_id TEXT UNIQUE NOT NULL,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  from_email TEXT NOT NULL,
  to_emails TEXT[] NOT NULL,
  cc_emails TEXT[] DEFAULT '{}',
  bcc_emails TEXT[] DEFAULT '{}',
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_templates table for reusable email templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  category TEXT CHECK (category IN ('outreach', 'follow_up', 'meeting', 'proposal', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_sync_logs table for tracking sync operations
CREATE TABLE IF NOT EXISTS public.email_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('sync_inbox', 'sync_sent', 'send_email', 'mark_read')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  message_count INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_threads_person_id ON public.email_threads(person_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_gmail_thread_id ON public.email_threads(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_last_message_at ON public.email_threads(last_message_at);

CREATE INDEX IF NOT EXISTS idx_email_messages_thread_id ON public.email_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_person_id ON public.email_messages(person_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_gmail_message_id ON public.email_messages(gmail_message_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_sent_at ON public.email_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_messages_received_at ON public.email_messages(received_at);

CREATE INDEX IF NOT EXISTS idx_email_templates_category ON public.email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON public.email_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_email_sync_logs_user_id ON public.email_sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sync_logs_created_at ON public.email_sync_logs(created_at);

-- Create RLS policies
CREATE POLICY "Authenticated users can view email threads" ON public.email_threads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email threads" ON public.email_threads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update email threads" ON public.email_threads
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view email messages" ON public.email_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email messages" ON public.email_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update email messages" ON public.email_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view email templates" ON public.email_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email templates" ON public.email_templates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update email templates" ON public.email_templates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view email sync logs" ON public.email_sync_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email sync logs" ON public.email_sync_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE public.email_threads IS 'Email conversation threads synced from Gmail';
COMMENT ON TABLE public.email_messages IS 'Individual email messages within threads';
COMMENT ON TABLE public.email_templates IS 'Reusable email templates for outreach';
COMMENT ON TABLE public.email_sync_logs IS 'Log of email synchronization operations';








