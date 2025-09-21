-- Migration: Create performance optimization views
-- Date: 2025-09-21

-- 1. Create view for company statistics
CREATE OR REPLACE VIEW company_stats AS
SELECT 
    c.id,
    c."Company Name",
    c."Industry",
    c."Lead Score",
    c.status_enum,
    c.priority_enum,
    COUNT(DISTINCT p.id) as total_leads,
    COUNT(DISTINCT j.id) as total_jobs,
    COUNT(DISTINCT CASE WHEN p.stage_enum = 'qualified' THEN p.id END) as qualified_leads,
    COUNT(DISTINCT CASE WHEN j.status_enum = 'active' THEN j.id END) as active_jobs,
    MAX(p.created_at) as last_lead_created,
    MAX(j.created_at) as last_job_created
FROM "Companies" c
LEFT JOIN "People" p ON c.id = p.company_id
LEFT JOIN "Jobs" j ON c.id = j.company_id
GROUP BY c.id, c."Company Name", c."Industry", c."Lead Score", c.status_enum, c.priority_enum;

-- 2. Create view for lead pipeline
CREATE OR REPLACE VIEW lead_pipeline AS
SELECT 
    p.id,
    p."Name",
    p."Company Role",
    p."Email Address",
    p.stage_enum,
    p.priority_enum,
    p."Lead Score",
    p.automation_status_enum,
    c."Company Name",
    c."Industry",
    c."Lead Score" as company_lead_score,
    p.created_at,
    p.updated_at
FROM "People" p
LEFT JOIN "Companies" c ON p.company_id = c.id
WHERE p.stage_enum IS NOT NULL;

-- 3. Create view for active jobs
CREATE OR REPLACE VIEW active_jobs AS
SELECT 
    j.id,
    j."Job Title",
    j."Job Location",
    j."Employment Type",
    j."Salary",
    j.status_enum,
    j.seniority_level_enum,
    j."Posted Date",
    c."Company Name",
    c."Industry",
    c."Company Size",
    c."Lead Score" as company_lead_score,
    j.created_at,
    j.updated_at
FROM "Jobs" j
LEFT JOIN "Companies" c ON j.company_id = c.id
WHERE j.status_enum = 'active';

-- 4. Create materialized view for dashboard metrics (refresh periodically)
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT 
    COUNT(DISTINCT c.id) as total_companies,
    COUNT(DISTINCT p.id) as total_leads,
    COUNT(DISTINCT j.id) as total_jobs,
    COUNT(DISTINCT CASE WHEN c.status_enum = 'active' THEN c.id END) as active_companies,
    COUNT(DISTINCT CASE WHEN p.stage_enum = 'qualified' THEN p.id END) as qualified_leads,
    COUNT(DISTINCT CASE WHEN j.status_enum = 'active' THEN j.id END) as active_jobs,
    AVG(c."Lead Score") as avg_company_score,
    AVG(CAST(p."Lead Score" AS NUMERIC)) as avg_lead_score,
    COUNT(DISTINCT CASE WHEN p.automation_status_enum = 'running' THEN p.id END) as active_automations
FROM "Companies" c
LEFT JOIN "People" p ON c.id = p.company_id
LEFT JOIN "Jobs" j ON c.id = j.company_id;

-- Create index on materialized view
CREATE INDEX idx_dashboard_metrics ON dashboard_metrics (total_companies);

-- 5. Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_metrics;
END;
$$ LANGUAGE plpgsql;
