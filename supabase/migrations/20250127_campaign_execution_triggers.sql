-- ==============================================
-- Campaign Execution Triggers
-- Auto-creates first execution when lead is added to sequence
-- ==============================================
-- Function to create initial execution when lead is added
CREATE OR REPLACE FUNCTION create_initial_campaign_execution() RETURNS TRIGGER AS $$
DECLARE v_first_step_id UUID;
BEGIN -- Get the first step (lowest order_position) for this sequence
SELECT id INTO v_first_step_id
FROM campaign_sequence_steps
WHERE sequence_id = NEW.sequence_id
ORDER BY order_position ASC
LIMIT 1;
IF v_first_step_id IS NOT NULL THEN -- Create initial execution record
INSERT INTO campaign_sequence_executions (
        sequence_id,
        lead_id,
        step_id,
        status,
        scheduled_at,
        executed_at
    )
VALUES (
        NEW.sequence_id,
        NEW.lead_id,
        v_first_step_id,
        'pending',
        now(),
        now()
    );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger: Create first execution when lead joins sequence
DROP TRIGGER IF EXISTS on_lead_added_to_sequence ON campaign_sequence_leads;
CREATE TRIGGER on_lead_added_to_sequence
AFTER
INSERT ON campaign_sequence_leads FOR EACH ROW
    WHEN (NEW.status = 'active') EXECUTE FUNCTION create_initial_campaign_execution();
-- ==============================================
-- Function to auto-pause sequence on reply
-- ==============================================
-- Add pause_on_reply column to campaign_sequences
ALTER TABLE campaign_sequences
ADD COLUMN IF NOT EXISTS pause_on_reply BOOLEAN DEFAULT true;
CREATE OR REPLACE FUNCTION pause_sequence_on_reply() RETURNS TRIGGER AS $$
DECLARE v_campaign_sequence_lead_id UUID;
BEGIN -- Find the specific campaign sequence lead that sent the email
SELECT (es.metadata->>'campaign_sequence_lead_id')::uuid INTO v_campaign_sequence_lead_id
FROM email_sends es
WHERE es.person_id = NEW.person_id
    AND es.gmail_thread_id = NEW.gmail_thread_id
ORDER BY es.sent_at DESC
LIMIT 1;
-- Pause ONLY that specific contact's campaign sequence
IF v_campaign_sequence_lead_id IS NOT NULL THEN
UPDATE campaign_sequence_leads
SET status = 'paused',
    paused_at = now()
WHERE id = v_campaign_sequence_lead_id
    AND status = 'active' -- Only pause if campaign has pause_on_reply enabled
    AND EXISTS (
        SELECT 1
        FROM campaign_sequences cs
        WHERE cs.id = campaign_sequence_leads.sequence_id
            AND cs.status = 'active'
            AND COALESCE(cs.pause_on_reply, true) = true
    );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger: Auto-pause on reply
DROP TRIGGER IF EXISTS on_email_reply_detected ON email_replies;
CREATE TRIGGER on_email_reply_detected
AFTER
INSERT ON email_replies FOR EACH ROW
    WHEN (NEW.sentiment IS NOT NULL) EXECUTE FUNCTION pause_sequence_on_reply();
-- ==============================================
-- Comments
-- ==============================================
COMMENT ON FUNCTION create_initial_campaign_execution IS 'Creates first execution record when lead is added to sequence';
COMMENT ON FUNCTION pause_sequence_on_reply IS 'Auto-pauses campaign sequences when person replies';
COMMENT ON TRIGGER on_lead_added_to_sequence ON campaign_sequence_leads IS 'Creates first execution when lead joins active sequence';
COMMENT ON TRIGGER on_email_reply_detected ON email_replies IS 'Auto-pauses sequences when person replies to campaign email';