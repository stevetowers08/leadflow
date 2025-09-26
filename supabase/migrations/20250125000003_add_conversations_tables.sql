-- Add conversations tables for LinkedIn communications
-- Migration: add_conversations_tables
-- Date: 2025-01-25
-- Description: Adds tables for LinkedIn conversation tracking

-- Create conversations table for LinkedIn message threads
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  linkedin_message_id TEXT UNIQUE,
  subject TEXT,
  participants JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  conversation_type TEXT DEFAULT 'linkedin' CHECK (conversation_type IN ('linkedin', 'email')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversation_messages table for individual messages
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  linkedin_message_id TEXT UNIQUE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('us', 'them', 'system')),
  sender_name TEXT,
  sender_email TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'connection_request', 'follow_up', 'reply')),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expandi_status TEXT CHECK (expandi_status IN ('pending', 'sent', 'delivered', 'failed')),
  expandi_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversation_sync_logs table for tracking Expandi sync operations
CREATE TABLE IF NOT EXISTS public.conversation_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('sync_expandi', 'send_message', 'mark_read', 'webhook_received')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  message_count INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_person_id ON public.conversations(person_id);
CREATE INDEX IF NOT EXISTS idx_conversations_linkedin_message_id ON public.conversations(linkedin_message_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_person_id ON public.conversation_messages(person_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_linkedin_message_id ON public.conversation_messages(linkedin_message_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_sent_at ON public.conversation_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_received_at ON public.conversation_messages(received_at);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_sender_type ON public.conversation_messages(sender_type);

CREATE INDEX IF NOT EXISTS idx_conversation_sync_logs_user_id ON public.conversation_sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sync_logs_created_at ON public.conversation_sync_logs(created_at);

-- Create RLS policies
CREATE POLICY "Authenticated users can view conversations" ON public.conversations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conversations" ON public.conversations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view conversation messages" ON public.conversation_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversation messages" ON public.conversation_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conversation messages" ON public.conversation_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view conversation sync logs" ON public.conversation_sync_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversation sync logs" ON public.conversation_sync_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE public.conversations IS 'LinkedIn conversation threads with people in CRM';
COMMENT ON TABLE public.conversation_messages IS 'Individual messages within LinkedIn conversations';
COMMENT ON TABLE public.conversation_sync_logs IS 'Log of conversation synchronization operations with Expandi';








