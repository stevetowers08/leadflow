-- Add last_activity triggers for email sends and replies
-- Migration: add_outreach_last_activity_triggers
-- Date: 2025-01-30
-- Description: Adds triggers to update last_activity when emails are sent or replies are received

-- ========================
-- PART 1: Email sends trigger
-- ========================

CREATE OR REPLACE FUNCTION update_activity_from_email_send()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity when an email is sent
  UPDATE public.people
  SET last_activity = now()
  WHERE id = NEW.person_id;
  
  -- Update the associated company's last_activity
  UPDATE public.companies
  SET last_activity = now()
  WHERE id IN (
    SELECT company_id 
    FROM public.people 
    WHERE id = NEW.person_id AND company_id IS NOT NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_activity_from_email_send
  AFTER INSERT ON public.email_sends
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_from_email_send();

-- ========================
-- PART 2: Email replies trigger
-- ========================

CREATE OR REPLACE FUNCTION update_activity_from_email_reply()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity when a reply is received
  UPDATE public.people
  SET last_activity = now()
  WHERE id = NEW.person_id;
  
  -- Update the associated company's last_activity
  UPDATE public.companies
  SET last_activity = now()
  WHERE id = NEW.company_id OR id IN (
    SELECT company_id 
    FROM public.people 
    WHERE id = NEW.person_id AND company_id IS NOT NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_activity_from_email_reply
  AFTER INSERT ON public.email_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_from_email_reply();

-- ========================
-- PART 3: Comments
-- ========================

COMMENT ON FUNCTION update_activity_from_email_send() IS 'Updates last_activity timestamp when emails are sent to people/companies';
COMMENT ON FUNCTION update_activity_from_email_reply() IS 'Updates last_activity timestamp when email replies are received';

