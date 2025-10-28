-- Add last_activity tracking to people and companies tables
-- Migration: add_last_activity_tracking
-- Date: 2025-01-30
-- Description: Adds last_activity fields and triggers to track recent activity on people and companies

-- ========================
-- PART 1: Add last_activity column to people table
-- ========================

ALTER TABLE public.people
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_people_last_activity ON public.people(last_activity);

-- ========================
-- PART 2: Add last_activity column to companies table
-- ========================

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_companies_last_activity ON public.companies(last_activity);

-- ========================
-- PART 3: Create function to update people last_activity
-- ========================

CREATE OR REPLACE FUNCTION update_people_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the person's last_activity when they are modified
  UPDATE public.people
  SET last_activity = now()
  WHERE id = NEW.id;
  
  -- Also update the associated company's last_activity
  IF NEW.company_id IS NOT NULL THEN
    UPDATE public.companies
    SET last_activity = now()
    WHERE id = NEW.company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================
-- PART 4: Create function to update companies last_activity
-- ========================

CREATE OR REPLACE FUNCTION update_companies_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the company's last_activity when it is modified
  UPDATE public.companies
  SET last_activity = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================
-- PART 5: Create triggers for people
-- ========================

-- Trigger on people table updates
CREATE TRIGGER trigger_update_people_last_activity
  AFTER UPDATE ON public.people
  FOR EACH ROW
  WHEN (
    OLD.name IS DISTINCT FROM NEW.name OR
    OLD.company_id IS DISTINCT FROM NEW.company_id OR
    OLD.email_address IS DISTINCT FROM NEW.email_address OR
    OLD.employee_location IS DISTINCT FROM NEW.employee_location OR
    OLD.company_role IS DISTINCT FROM NEW.company_role OR
    OLD.lead_score IS DISTINCT FROM NEW.lead_score OR
    OLD.stage IS DISTINCT FROM NEW.stage OR
    OLD.last_interaction_at IS DISTINCT FROM NEW.last_interaction_at OR
    OLD.confidence_level IS DISTINCT FROM NEW.confidence_level OR
    OLD.lead_source IS DISTINCT FROM NEW.lead_source OR
    OLD.is_favourite IS DISTINCT FROM NEW.is_favourite
  )
  EXECUTE FUNCTION update_people_last_activity();

-- ========================
-- PART 6: Create triggers for companies
-- ========================

-- Trigger on companies table updates
CREATE TRIGGER trigger_update_companies_last_activity
  AFTER UPDATE ON public.companies
  FOR EACH ROW
  WHEN (
    OLD.name IS DISTINCT FROM NEW.name OR
    OLD.website IS DISTINCT FROM NEW.website OR
    OLD.linkedin_url IS DISTINCT FROM NEW.linkedin_url OR
    OLD.head_office IS DISTINCT FROM NEW.head_office OR
    OLD.industry IS DISTINCT FROM NEW.industry OR
    OLD.company_size IS DISTINCT FROM NEW.company_size OR
    OLD.confidence_level IS DISTINCT FROM NEW.confidence_level OR
    OLD.lead_score IS DISTINCT FROM NEW.lead_score OR
    OLD.score_reason IS DISTINCT FROM NEW.score_reason OR
    OLD.is_favourite IS DISTINCT FROM NEW.is_favourite OR
    OLD.priority IS DISTINCT FROM NEW.priority OR
    OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage
  )
  EXECUTE FUNCTION update_companies_last_activity();

-- ========================
-- PART 7: Create trigger for interactions table
-- ========================

-- Function to update last_activity when interactions are created
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

-- Trigger on interactions table
CREATE TRIGGER trigger_update_activity_from_interaction
  AFTER INSERT ON public.interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_from_interaction();

-- ========================
-- PART 8: Update existing records
-- ========================

-- Initialize last_activity for existing people records based on last_interaction_at or updated_at
UPDATE public.people
SET last_activity = COALESCE(last_interaction_at, updated_at)
WHERE last_activity IS NULL;

-- Initialize last_activity for existing companies records based on updated_at
UPDATE public.companies
SET last_activity = updated_at
WHERE last_activity IS NULL;

-- ========================
-- PART 9: Comments
-- ========================

COMMENT ON COLUMN public.people.last_activity IS 'Timestamp of the most recent activity on this person record (updated via triggers)';
COMMENT ON COLUMN public.companies.last_activity IS 'Timestamp of the most recent activity on this company record (updated via triggers)';
COMMENT ON FUNCTION update_people_last_activity() IS 'Updates last_activity timestamp on people and associated companies';
COMMENT ON FUNCTION update_companies_last_activity() IS 'Updates last_activity timestamp on companies';
COMMENT ON FUNCTION update_activity_from_interaction() IS 'Updates last_activity when interactions are created';

