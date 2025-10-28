-- Update email triggers to track last_activity properly
-- Migration: update_email_triggers_for_last_activity
-- Date: 2025-01-30
-- Description: Updates triggers for email_sends and email_replies to properly track last_activity

-- ========================
-- PART 1: Update email_sends trigger
-- ========================

DROP TRIGGER IF EXISTS trigger_update_activity_from_email_send ON public.email_sends;

CREATE OR REPLACE FUNCTION update_activity_from_email_send()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity when an email is successfully sent
  IF NEW.status = 'sent' OR NEW.status = 'delivered' THEN
    UPDATE public.people
    SET last_activity = COALESCE(NEW.sent_at, now())
    WHERE id = NEW.person_id;
    
    -- Update the associated company's last_activity
    UPDATE public.companies
    SET last_activity = COALESCE(NEW.sent_at, now())
    WHERE id IN (
      SELECT company_id 
      FROM public.people 
      WHERE id = NEW.person_id AND company_id IS NOT NULL
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_activity_from_email_send
  AFTER INSERT OR UPDATE ON public.email_sends
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION update_activity_from_email_send();

-- ========================
-- PART 2: Update email_replies trigger
-- ========================

DROP TRIGGER IF EXISTS trigger_update_activity_from_email_reply ON public.email_replies;

CREATE OR REPLACE FUNCTION update_activity_from_email_reply()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity when a reply is received
  UPDATE public.people
  SET last_activity = COALESCE(NEW.received_at, now())
  WHERE id = NEW.person_id;
  
  -- Update the associated company's last_activity
  IF NEW.company_id IS NOT NULL THEN
    UPDATE public.companies
    SET last_activity = COALESCE(NEW.received_at, now())
    WHERE id = NEW.company_id;
  ELSE
    -- If no company_id on reply, get it from person
    UPDATE public.companies
    SET last_activity = COALESCE(NEW.received_at, now())
    WHERE id IN (
      SELECT company_id 
      FROM public.people 
      WHERE id = NEW.person_id AND company_id IS NOT NULL
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_activity_from_email_reply
  AFTER INSERT ON public.email_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_from_email_reply();

-- ========================
-- PART 3: Also track email_messages (separate from email_sends/replies)
-- ========================

CREATE OR REPLACE FUNCTION update_activity_from_email_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity when an email message is synced
  UPDATE public.people
  SET last_activity = COALESCE(NEW.received_at, NEW.sent_at, now())
  WHERE id = NEW.person_id;
  
  -- Update the associated company's last_activity
  UPDATE public.companies
  SET last_activity = COALESCE(NEW.received_at, NEW.sent_at, now())
  WHERE id IN (
    SELECT company_id 
    FROM public.people 
    WHERE id = NEW.person_id AND company_id IS NOT NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_activity_from_email_message ON public.email_messages;

CREATE TRIGGER trigger_update_activity_from_email_message
  AFTER INSERT ON public.email_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_from_email_message();

-- ========================
-- PART 4: Comments
-- ========================

COMMENT ON FUNCTION update_activity_from_email_send() IS 'Updates last_activity timestamp when emails are sent (tracks sent/delivered status)';
COMMENT ON FUNCTION update_activity_from_email_reply() IS 'Updates last_activity timestamp when email replies are received';
COMMENT ON FUNCTION update_activity_from_email_message() IS 'Updates last_activity timestamp when email messages are synced from Gmail';

