-- Create company_activities table for tracking company-related activities
CREATE TABLE IF NOT EXISTS company_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('automation', 'manual_note', 'lead_reply', 'system_event', 'email_sent', 'linkedin_message', 'meeting_scheduled', 'call_made')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  is_automated BOOLEAN DEFAULT FALSE,
  automation_campaign_id UUID,
  lead_id UUID REFERENCES people(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_activities_company_id ON company_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_company_activities_created_at ON company_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_activities_activity_type ON company_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_company_activities_created_by ON company_activities(created_by);
CREATE INDEX IF NOT EXISTS idx_company_activities_lead_id ON company_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_company_activities_job_id ON company_activities(job_id);

-- Enable RLS
ALTER TABLE company_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view company activities for companies they have access to" ON company_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies c 
      WHERE c.id = company_activities.company_id 
      AND (
        c.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM people p 
          WHERE p.company_id = c.id 
          AND p.owner_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert company activities for companies they have access to" ON company_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies c 
      WHERE c.id = company_activities.company_id 
      AND (
        c.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM people p 
          WHERE p.company_id = c.id 
          AND p.owner_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update their own company activities" ON company_activities
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own company activities" ON company_activities
  FOR DELETE USING (created_by = auth.uid());

-- Create a function to automatically log automation events
CREATE OR REPLACE FUNCTION log_company_automation_event(
  p_company_id UUID,
  p_activity_type VARCHAR(50),
  p_title VARCHAR(255),
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_lead_id UUID DEFAULT NULL,
  p_job_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO company_activities (
    company_id,
    activity_type,
    title,
    description,
    created_by,
    metadata,
    is_automated,
    lead_id,
    job_id
  ) VALUES (
    p_company_id,
    p_activity_type,
    p_title,
    p_description,
    auth.uid(),
    p_metadata,
    TRUE,
    p_lead_id,
    p_job_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to log manual notes
CREATE OR REPLACE FUNCTION log_company_manual_note(
  p_company_id UUID,
  p_title VARCHAR(255),
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO company_activities (
    company_id,
    activity_type,
    title,
    description,
    created_by,
    metadata,
    is_automated
  ) VALUES (
    p_company_id,
    'manual_note',
    p_title,
    p_description,
    auth.uid(),
    p_metadata,
    FALSE
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for easy querying of company activities with user names
CREATE VIEW company_activities_with_users AS
SELECT 
  ca.*,
  up.full_name as created_by_name,
  up.email as created_by_email,
  c.name as company_name,
  p.name as lead_name,
  j.title as job_title
FROM company_activities ca
LEFT JOIN user_profiles up ON ca.created_by = up.id
LEFT JOIN companies c ON ca.company_id = c.id
LEFT JOIN people p ON ca.lead_id = p.id
LEFT JOIN jobs j ON ca.job_id = j.id;

-- Grant permissions
GRANT SELECT ON company_activities_with_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON company_activities TO authenticated;
GRANT EXECUTE ON FUNCTION log_company_automation_event TO authenticated;
GRANT EXECUTE ON FUNCTION log_company_manual_note TO authenticated;

