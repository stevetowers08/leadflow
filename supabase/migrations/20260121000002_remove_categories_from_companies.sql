-- Remove categories column from companies table
-- Migration: remove_categories_from_companies
-- Date: 2026-01-21
-- Description: Remove categories column from companies table as it's no longer used

-- Drop the categories column
ALTER TABLE companies DROP COLUMN IF EXISTS categories;

-- Add comment for documentation
COMMENT ON TABLE companies IS 'Companies table - categories column removed on 2026-01-21';
