-- Create notes table for storing notes on entities (leads, companies, jobs)
-- Migration: create_notes_table
-- Date: 2025-01-30
-- Description: Creates the notes table that was missing, causing the NotesSection to be stuck loading

CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('lead', 'company', 'job')),
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes
-- Users can view notes for entities they have access to
CREATE POLICY "Users can view notes" 
ON public.notes FOR SELECT 
USING (auth.role() = 'authenticated');

-- Users can insert notes
CREATE POLICY "Users can insert notes" 
ON public.notes FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- Users can update their own notes
CREATE POLICY "Users can update own notes" 
ON public.notes FOR UPDATE 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes" 
ON public.notes FOR DELETE 
USING (auth.uid() = author_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_entity_id ON public.notes(entity_id);
CREATE INDEX IF NOT EXISTS idx_notes_entity_type ON public.notes(entity_type);
CREATE INDEX IF NOT EXISTS idx_notes_author_id ON public.notes(author_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_entity_composite ON public.notes(entity_id, entity_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON public.notes
    FOR EACH ROW 
    EXECUTE FUNCTION update_notes_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.notes IS 'Stores notes attached to entities (leads, companies, jobs)';
COMMENT ON COLUMN public.notes.entity_id IS 'ID of the entity this note belongs to';
COMMENT ON COLUMN public.notes.entity_type IS 'Type of entity (lead, company, job)';
COMMENT ON COLUMN public.notes.content IS 'The note content';
COMMENT ON COLUMN public.notes.author_id IS 'ID of the user who created this note';

