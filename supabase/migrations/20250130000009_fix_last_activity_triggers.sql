-- Fix last_activity to only track outreach and interactions
-- Migration: fix_last_activity_triggers
-- Date: 2025-01-30
-- Description: Updates last_activity triggers to only fire on outreach and interactions, not on all field updates

-- ========================
-- PART 1: Drop the incorrect triggers that fire on any field update
-- ========================

DROP TRIGGER IF EXISTS trigger_update_people_last_activity ON public.people;
DROP TRIGGER IF EXISTS trigger_update_companies_last_activity ON public.companies;

-- Drop the trigger functions since they're no longer needed
DROP FUNCTION IF EXISTS update_people_last_activity();
DROP FUNCTION IF EXISTS update_companies_last_activity();

-- ========================
-- PART 2: Create new trigger function for interactions that updates BOTH person and company
-- ========================

CREATE OR REPLACE FUNCTION update_activity_from_interaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity
  UPDATE public.people
  SET last_activity = now()
  WHERE id = NEW.person_id;
  
  -- Update the associated company's last_activity if person has company
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

-- The trigger should already exist, but recreate it to be sure
DROP TRIGGER IF EXISTS trigger_update_activity_from_interaction ON public.interactions;

CREATE TRIGGER trigger_update_activity_from_interaction
  AFTER INSERT ON public.interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_from_interaction();

-- ========================
-- PART 3: Update comments
-- ========================

COMMENT ON FUNCTION update_activity_from_interaction() IS 'Updates last_activity timestamp on people and their associated companies when interactions are created (outreach activity)';
COMMENT ON COLUMN public.people.last_activity IS 'Timestamp of the most recent outreach/interaction activity (updated only when interactions are created)';
COMMENT ON COLUMN public.companies.last_activity IS 'Timestamp of the most recent outreach/interaction activity for people in this company (updated only when interactions are created)';

