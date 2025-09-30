-- Create error_logs table for comprehensive error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  error_id TEXT NOT NULL UNIQUE,
  message TEXT NOT NULL,
  stack TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('authentication', 'database', 'network', 'validation', 'ui', 'business_logic', 'unknown')),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  component TEXT,
  action TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  url TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create error_notifications table for tracking email notifications
CREATE TABLE IF NOT EXISTS public.error_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  error_log_id UUID REFERENCES public.error_logs(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'slack', 'webhook')),
  recipient_email TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create error_settings table for notification preferences
CREATE TABLE IF NOT EXISTS public.error_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  notification_severity TEXT DEFAULT 'high' CHECK (notification_severity IN ('low', 'medium', 'high', 'critical')),
  notification_email TEXT,
  slack_webhook_url TEXT,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for error_logs
CREATE POLICY "Users can view their own error logs" ON public.error_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert error logs" ON public.error_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update error logs" ON public.error_logs
  FOR UPDATE USING (true);

-- Create RLS policies for error_notifications
CREATE POLICY "Users can view notifications for their errors" ON public.error_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.error_logs 
      WHERE error_logs.id = error_notifications.error_log_id 
      AND error_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage notifications" ON public.error_notifications
  FOR ALL USING (true);

-- Create RLS policies for error_settings
CREATE POLICY "Users can manage their own error settings" ON public.error_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON public.error_logs(category);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_id ON public.error_logs(error_id);

CREATE INDEX IF NOT EXISTS idx_error_notifications_error_log_id ON public.error_notifications(error_log_id);
CREATE INDEX IF NOT EXISTS idx_error_notifications_status ON public.error_notifications(status);
CREATE INDEX IF NOT EXISTS idx_error_notifications_sent_at ON public.error_notifications(sent_at);

CREATE INDEX IF NOT EXISTS idx_error_settings_user_id ON public.error_settings(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for error_settings
CREATE TRIGGER update_error_settings_updated_at 
  BEFORE UPDATE ON public.error_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default error settings for admin users
INSERT INTO public.error_settings (user_id, email_notifications, notification_severity, notification_email)
SELECT 
  u.id,
  true,
  'high',
  u.email
FROM auth.users u
WHERE u.raw_user_meta_data->>'role' = 'owner'
ON CONFLICT (user_id) DO NOTHING;
