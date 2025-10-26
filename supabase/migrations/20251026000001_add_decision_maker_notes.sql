-- Add Decision Maker Notes Field
-- Migration: 20251026000001_add_decision_maker_notes
-- Date: 2025-10-26
-- Description: Add simple notes field for decision makers (for n8n/Clay context)

-- Add decision maker notes column
ALTER TABLE public.people
ADD COLUMN IF NOT EXISTS decision_maker_notes TEXT;

-- Add index for non-null notes (sparse index for efficiency)
CREATE INDEX IF NOT EXISTS idx_people_dm_notes 
ON public.people(decision_maker_notes) 
WHERE decision_maker_notes IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.people.decision_maker_notes IS 'Free-form notes about decision maker role, authority, and context for n8n/Clay workflows';
