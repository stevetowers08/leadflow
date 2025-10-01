-- Migration: Optimize User Assignment Queries
-- Date: 2025-01-30
-- Description: Add missing indexes and optimize queries for user assignments

-- 1. Add missing indexes on owner_id columns for all tables
CREATE INDEX IF NOT EXISTS idx_people_owner_id ON public.people(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_jobs_owner_id ON public.jobs(owner_id);
CREATE INDEX IF NOT EXISTS idx_interactions_owner_id ON public.interactions(owner_id);

-- 2. Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_people_owner_stage ON public.people(owner_id, stage);
CREATE INDEX IF NOT EXISTS idx_people_owner_created ON public.people(owner_id, created_at);

-- Check if pipeline_stage column exists in companies table, otherwise use status
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'companies' AND column_name = 'pipeline_stage') THEN
        CREATE INDEX IF NOT EXISTS idx_companies_owner_pipeline_stage ON public.companies(owner_id, pipeline_stage);
    ELSE
        CREATE INDEX IF NOT EXISTS idx_companies_owner_status ON public.companies(owner_id, status);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_companies_owner_created ON public.companies(owner_id, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_owner_status ON public.jobs(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_owner_created ON public.jobs(owner_id, created_at);

-- 3. Add indexes for user profile lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON public.user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- 4. Add indexes for assignment filtering queries
CREATE INDEX IF NOT EXISTS idx_people_unassigned ON public.people(owner_id) WHERE owner_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_unassigned ON public.companies(owner_id) WHERE owner_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_unassigned ON public.jobs(owner_id) WHERE owner_id IS NULL;

-- 5. Add indexes for dashboard statistics queries
CREATE INDEX IF NOT EXISTS idx_people_favorites ON public.people(is_favourite) WHERE is_favourite = true;
CREATE INDEX IF NOT EXISTS idx_companies_favorites ON public.companies(is_favourite) WHERE is_favourite = true;

-- 6. Create materialized view for user assignment statistics
CREATE MATERIALIZED VIEW user_assignment_stats AS
SELECT 
    up.id as user_id,
    up.full_name,
    up.email,
    up.role,
    COUNT(DISTINCT p.id) as total_leads,
    COUNT(DISTINCT c.id) as total_companies,
    COUNT(DISTINCT j.id) as total_jobs,
    COUNT(DISTINCT CASE WHEN p.stage = 'qualified' THEN p.id END) as qualified_leads,
    COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_companies,
    COUNT(DISTINCT CASE WHEN j.status = 'active' THEN j.id END) as active_jobs,
    MAX(p.created_at) as last_lead_created,
    MAX(c.created_at) as last_company_created,
    MAX(j.created_at) as last_job_created
FROM public.user_profiles up
LEFT JOIN public.people p ON up.id = p.owner_id
LEFT JOIN public.companies c ON up.id = c.owner_id
LEFT JOIN public.jobs j ON up.id = j.owner_id
WHERE up.is_active = true
GROUP BY up.id, up.full_name, up.email, up.role;

-- Create index on materialized view
CREATE INDEX idx_user_assignment_stats_user_id ON user_assignment_stats(user_id);

-- 7. Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_user_assignment_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_assignment_stats;
END;
$$ LANGUAGE plpgsql;

-- 8. Create optimized view for lead assignments with user info
CREATE OR REPLACE VIEW lead_assignments_with_users AS
SELECT 
    p.id,
    p.name,
    p.email_address,
    p.company_role,
    p.stage,
    p.lead_score,
    p.owner_id,
    p.created_at,
    c.name as company_name,
    c.website as company_website,
    up.full_name as owner_name,
    up.email as owner_email,
    up.role as owner_role
FROM public.people p
LEFT JOIN public.companies c ON p.company_id = c.id
LEFT JOIN public.user_profiles up ON p.owner_id = up.id;

-- 9. Create optimized view for company assignments with user info
CREATE OR REPLACE VIEW company_assignments_with_users AS
SELECT 
    c.id,
    c.name,
    c.website,
    c.industry,
    c.status,
    c.lead_score,
    c.owner_id,
    c.created_at,
    up.full_name as owner_name,
    up.email as owner_email,
    up.role as owner_role,
    COUNT(DISTINCT p.id) as total_leads,
    COUNT(DISTINCT j.id) as total_jobs
FROM public.companies c
LEFT JOIN public.user_profiles up ON c.owner_id = up.id
LEFT JOIN public.people p ON c.id = p.company_id
LEFT JOIN public.jobs j ON c.id = j.company_id
GROUP BY c.id, c.name, c.website, c.industry, c.status, c.lead_score, c.owner_id, c.created_at, up.full_name, up.email, up.role;

-- 10. Add RLS policies for new views
ALTER VIEW lead_assignments_with_users SET (security_invoker = true);
ALTER VIEW company_assignments_with_users SET (security_invoker = true);
