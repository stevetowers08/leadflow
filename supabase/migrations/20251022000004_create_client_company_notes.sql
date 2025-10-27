-- Add client_id and related_lead_id to notes table for efficient client-scoped notes
-- Migration: add_client_scoping_to_notes
-- Date: 2025-10-22
-- Description: Adds client_id and related_lead_id columns to notes table for efficient client isolation
--              This is simpler than an association table while maintaining multi-tenant security

-- Add client_id column (nullable for existing data, will be required for new notes)
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

-- Add related_lead_id for optional lead association
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS related_lead_id UUID REFERENCES people(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_client_id ON public.notes(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_client_company ON public.notes(client_id, entity_id) WHERE entity_type = 'company';
CREATE INDEX IF NOT EXISTS idx_notes_related_lead ON public.notes(related_lead_id);

-- Update RLS policies to enforce client scoping
DROP POLICY IF EXISTS "Users can view notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view client notes" ON public.notes;

CREATE POLICY "Users can view notes for their clients"
  ON public.notes FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Keep existing insert/update/delete policies (already enforce author_id)
-- But update to require client_id
DROP POLICY IF EXISTS "Users can insert notes" ON public.notes;
CREATE POLICY "Users can insert notes"
  ON public.notes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND auth.uid() = author_id
    AND client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Update policies to enforce client scoping for updates/deletes
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
CREATE POLICY "Users can update own notes"
  ON public.notes FOR UPDATE
  USING (
    auth.uid() = author_id
    AND client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = author_id
    AND client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;
CREATE POLICY "Users can delete own notes"
  ON public.notes FOR DELETE
  USING (
    auth.uid() = author_id
    AND client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

-- Comments
COMMENT ON COLUMN public.notes.client_id IS 'The client organization this note belongs to (required for multi-tenant isolation)';
COMMENT ON COLUMN public.notes.related_lead_id IS 'Optional: Links this note to a specific person/lead within the company';

