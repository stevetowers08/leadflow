-- Create trigger to automatically insert into client_companies when a job is qualified
-- This ensures data consistency and immediate visibility in the Companies page

CREATE OR REPLACE FUNCTION insert_client_company_on_job_qualify()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger on INSERT or UPDATE when status changes to 'qualify'
  IF (TG_OP = 'INSERT' AND NEW.status = 'qualify') OR 
     (TG_OP = 'UPDATE' AND NEW.status = 'qualify' AND OLD.status != 'qualify') THEN
    
    -- Insert/update client_companies with the company from the job
    INSERT INTO client_companies (
      client_id,
      company_id,
      qualification_status,
      qualified_at,
      qualified_by,
      priority
    )
    SELECT 
      NEW.client_id,
      j.company_id,
      'qualify'::qualification_status_type,
      NEW.qualified_at,
      NEW.qualified_by,
      NEW.priority_level
    FROM jobs j
    WHERE j.id = NEW.job_id
    ON CONFLICT (client_id, company_id) 
    DO UPDATE SET
      qualification_status = 'qualify',
      qualified_at = COALESCE(EXCLUDED.qualified_at, client_companies.qualified_at),
      qualified_by = COALESCE(EXCLUDED.qualified_by, client_companies.qualified_by),
      updated_at = NOW(),
      priority = COALESCE(EXCLUDED.priority, client_companies.priority);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid duplicates
DROP TRIGGER IF EXISTS trigger_insert_client_company_on_qualify ON client_jobs;

-- Create trigger on client_jobs table
CREATE TRIGGER trigger_insert_client_company_on_qualify
AFTER INSERT OR UPDATE ON client_jobs
FOR EACH ROW
WHEN (NEW.status = 'qualify')
EXECUTE FUNCTION insert_client_company_on_job_qualify();

-- Backfill existing qualified jobs (only the recent ones that weren't added yet)
INSERT INTO client_companies (
  client_id,
  company_id,
  qualification_status,
  qualified_at,
  qualified_by,
  priority
)
SELECT 
  cj.client_id,
  j.company_id,
  'qualify'::qualification_status_type,
  cj.qualified_at,
  cj.qualified_by,
  COALESCE(cj.priority_level, 'medium'::priority_level_type)
FROM client_jobs cj
JOIN jobs j ON j.id = cj.job_id
WHERE cj.status = 'qualify'
AND NOT EXISTS (
  SELECT 1 FROM client_companies cc 
  WHERE cc.client_id = cj.client_id 
  AND cc.company_id = j.company_id
)
ON CONFLICT (client_id, company_id) DO NOTHING;

