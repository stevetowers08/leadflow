-- Add missing fields to people table
-- Migration: add_people_missing_fields
-- Date: 2024-12-24

-- Add missing fields to people table
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS email_draft TEXT,
ADD COLUMN IF NOT EXISTS connection_request_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS connection_accepted_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS message_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS meeting_booked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS meeting_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_reply_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stage_updated TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_favourite BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_people_confidence_level ON people(confidence_level);
CREATE INDEX IF NOT EXISTS idx_people_meeting_booked ON people(meeting_booked);
CREATE INDEX IF NOT EXISTS idx_people_meeting_date ON people(meeting_date);
CREATE INDEX IF NOT EXISTS idx_people_connection_request_date ON people(connection_request_date);
CREATE INDEX IF NOT EXISTS idx_people_response_date ON people(response_date);
CREATE INDEX IF NOT EXISTS idx_people_favourite ON people(is_favourite);

-- Add comments for documentation
COMMENT ON COLUMN people.confidence_level IS 'Lead confidence/quality level';
COMMENT ON COLUMN people.email_draft IS 'Draft email content for this lead';
COMMENT ON COLUMN people.connection_request_date IS 'When LinkedIn connection request was sent';
COMMENT ON COLUMN people.connection_accepted_date IS 'When LinkedIn connection was accepted';
COMMENT ON COLUMN people.message_sent_date IS 'When LinkedIn message was sent';
COMMENT ON COLUMN people.response_date IS 'When lead responded to outreach';
COMMENT ON COLUMN people.meeting_booked IS 'Whether a meeting has been booked';
COMMENT ON COLUMN people.meeting_date IS 'Scheduled meeting date';
COMMENT ON COLUMN people.email_sent_date IS 'When email was sent to lead';
COMMENT ON COLUMN people.email_reply_date IS 'When lead replied to email';
COMMENT ON COLUMN people.stage_updated IS 'When the lead stage was last updated';
COMMENT ON COLUMN people.is_favourite IS 'User bookmark/favourite status';


