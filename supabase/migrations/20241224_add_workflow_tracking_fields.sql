-- Add workflow tracking fields to people table
-- Migration: add_workflow_tracking_fields
-- Date: 2024-12-24
-- Description: Adds workflow stage tracking fields for LinkedIn outreach campaigns

-- Add workflow tracking fields to people table
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS connection_request_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS message_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS linkedin_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS linkedin_responded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS campaign_finished BOOLEAN DEFAULT FALSE;

-- Create indexes for workflow tracking performance
CREATE INDEX IF NOT EXISTS idx_people_connection_request_sent ON people(connection_request_sent);
CREATE INDEX IF NOT EXISTS idx_people_message_sent ON people(message_sent);
CREATE INDEX IF NOT EXISTS idx_people_linkedin_connected ON people(linkedin_connected);
CREATE INDEX IF NOT EXISTS idx_people_linkedin_responded ON people(linkedin_responded);
CREATE INDEX IF NOT EXISTS idx_people_campaign_finished ON people(campaign_finished);

-- Add comments for documentation
COMMENT ON COLUMN people.connection_request_sent IS 'Whether LinkedIn connection request has been sent';
COMMENT ON COLUMN people.message_sent IS 'Whether LinkedIn message has been sent';
COMMENT ON COLUMN people.linkedin_connected IS 'Whether LinkedIn connection has been accepted';
COMMENT ON COLUMN people.linkedin_responded IS 'Whether LinkedIn contact has responded';
COMMENT ON COLUMN people.campaign_finished IS 'Whether the campaign for this lead is finished';


