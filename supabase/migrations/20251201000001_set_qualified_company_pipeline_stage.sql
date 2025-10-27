-- Set pipeline_stage for qualified companies
-- When a company is qualified (qualification_status='qualify' in client_companies),
-- it should start with 'qualified' pipeline stage instead of 'new_lead'

-- Function to update company pipeline_stage when qualified
CREATE OR REPLACE FUNCTION set_qualified_company_pipeline_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- When a company is qualified for a client, set its pipeline stage to 'qualified'
  IF NEW.qualification_status = 'qualify' AND OLD.qualification_status IS DISTINCT FROM 'qualify' THEN
    UPDATE companies
    SET 
      pipeline_stage = COALESCE(pipeline_stage, 'qualified'),
      updated_at = NOW()
    WHERE id = NEW.company_id
    AND (pipeline_stage IS NULL OR pipeline_stage = 'new_lead');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on client_companies
DROP TRIGGER IF EXISTS trigger_set_qualified_company_pipeline_stage ON client_companies;
CREATE TRIGGER trigger_set_qualified_company_pipeline_stage
AFTER INSERT OR UPDATE ON client_companies
FOR EACH ROW
WHEN (NEW.qualification_status = 'qualify')
EXECUTE FUNCTION set_qualified_company_pipeline_stage();

-- Backfill: Update existing qualified companies to 'qualified' if they're still 'new_lead'
UPDATE companies c
SET 
  pipeline_stage = 'qualified',
  updated_at = NOW()
WHERE c.pipeline_stage = 'new_lead'
AND EXISTS (
  SELECT 1 
  FROM client_companies cc
  WHERE cc.company_id = c.id
  AND cc.qualification_status = 'qualify'
);

-- Grant execute permission (if needed)
GRANT EXECUTE ON FUNCTION set_qualified_company_pipeline_stage() TO authenticated;
GRANT EXECUTE ON FUNCTION set_qualified_company_pipeline_stage() TO service_role;

