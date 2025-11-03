-- Migration: Change lead_score to score (numeric 1-10)
-- Date: 2025-01-27
-- Description: 
--   - Rename lead_score column to score
--   - Convert text values (High/Medium/Low) to numeric (1-10)
--   - Add CHECK constraint to ensure values are between 1-10

-- Step 1: Add new score column as SMALLINT
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS score SMALLINT CHECK (score >= 1 AND score <= 10);

-- Step 2: Migrate existing data
-- Map: High -> 8, Medium -> 5, Low -> 2
UPDATE people 
SET score = CASE 
  WHEN lead_score = 'High' THEN 8
  WHEN lead_score = 'Medium' THEN 5
  WHEN lead_score = 'Low' THEN 2
  ELSE NULL
END
WHERE lead_score IS NOT NULL;

-- Step 3: Drop the old lead_score column
ALTER TABLE people DROP COLUMN IF EXISTS lead_score;

-- Step 4: Add comment for documentation
COMMENT ON COLUMN people.score IS 'Lead score from 1-10 (1=low, 5=medium, 8-10=high)';

-- Step 5: Create index for performance
CREATE INDEX IF NOT EXISTS idx_people_score ON people(score) WHERE score IS NOT NULL;


