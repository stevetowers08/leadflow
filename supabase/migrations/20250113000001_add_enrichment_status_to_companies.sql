-- Add enrichment_status column to companies table
-- This enables real-time enrichment tracking similar to leads table

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS enrichment_status text
CHECK (enrichment_status IN ('pending', 'enriching', 'completed', 'failed'));

-- Add index for better query performance on enrichment status
CREATE INDEX IF NOT EXISTS idx_companies_enrichment_status
ON companies(enrichment_status)
WHERE enrichment_status IS NOT NULL;

-- Add comment to document the column
COMMENT ON COLUMN companies.enrichment_status IS
'Tracks the status of external data enrichment: pending (queued), enriching (in progress), completed (success), failed (error)';
