-- Cleanup companies table - Remove unused fields
-- Migration: cleanup_companies_table
-- Date: 2026-01-20
-- Description: Remove unused fields from companies table that are not referenced in the frontend or codebase

-- Drop unused AI enrichment fields (never populated)
ALTER TABLE companies DROP COLUMN IF EXISTS ai_company_intelligence;
ALTER TABLE companies DROP COLUMN IF EXISTS ai_marketi_info;
ALTER TABLE companies DROP COLUMN IF EXISTS ai_funding;
ALTER TABLE companies DROP COLUMN IF EXISTS ai_new_location;

-- Drop unused source tracking fields (only used for people/leads, not companies)
ALTER TABLE companies DROP COLUMN IF EXISTS lead_source;
ALTER TABLE companies DROP COLUMN IF EXISTS source_details;
ALTER TABLE companies DROP COLUMN IF EXISTS source_date;

-- Drop unused financial fields
ALTER TABLE companies DROP COLUMN IF EXISTS funding_raised;

-- Drop unused external ID fields
ALTER TABLE companies DROP COLUMN IF EXISTS loxo_company_id;

-- Drop unused raw data field (checked but never populated)
ALTER TABLE companies DROP COLUMN IF EXISTS key_info_raw;

-- Note: Keeping estimated_arr as it's populated by enrichment callback
-- Note: Keeping confidence_level, lead_score, score_reason, is_favourite, priority, pipeline_stage as they're used in UI
-- Note: Keeping logo_cached_at as it's used by logoService
