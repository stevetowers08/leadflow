-- Remove connection_strength column from companies table
-- Migration: remove_connection_strength_from_companies
-- Date: 2026-01-20
-- Description: Remove connection_strength column from companies table as it's no longer needed

-- Drop the connection_strength column
ALTER TABLE companies DROP COLUMN IF EXISTS connection_strength;

-- Note: If connection_strength_enum type exists and is no longer used elsewhere, 
-- it can be dropped separately if needed:
-- DROP TYPE IF EXISTS connection_strength_enum;
