-- Create system_settings table for persistent configuration
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system settings
-- Only admins can read/write system settings
CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.user_metadata->>'role' = 'admin'
  )
);

-- Insert default settings
INSERT INTO public.system_settings (key, value, description) VALUES 
('maxUsers', '100', 'Maximum number of users allowed'),
('allowRegistration', 'true', 'Allow new user registration'),
('requireEmailVerification', 'true', 'Require email verification for new users'),
('sessionTimeout', '24', 'Session timeout in hours'),
('dataRetentionDays', '365', 'Data retention period in days'),
('emailNotifications', 'true', 'Enable email notifications'),
('systemMaintenance', 'false', 'System maintenance mode'),
('apiRateLimit', '1000', 'API rate limit per hour'),
('backupFrequency', 'daily', 'Backup frequency'),
('companyName', '4Twenty CRM', 'Company name'),
('companyEmail', 'admin@4twenty.com', 'Company email address'),
('supportEmail', 'support@4twenty.com', 'Support email address'),
('privacyPolicy', '', 'Privacy policy URL'),
('termsOfService', '', 'Terms of service URL');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON public.system_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
