-- VERIFY ALL ENUM CONVERSIONS
-- Check if all dropdown fields were converted

-- ==============================================
-- 1. CHECK ALL ENUM USAGE
-- ==============================================

-- Companies table
SELECT 'COMPANIES TABLE' as table_name;
SELECT 
    'status_enum' as field,
    COUNT(*) as total,
    COUNT(status_enum) as converted,
    ROUND(COUNT(status_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "Companies"
UNION ALL
SELECT 
    'priority_enum' as field,
    COUNT(*) as total,
    COUNT(priority_enum) as converted,
    ROUND(COUNT(priority_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "Companies";

-- People table
SELECT 'PEOPLE TABLE' as table_name;
SELECT 
    'stage_enum' as field,
    COUNT(*) as total,
    COUNT(stage_enum) as converted,
    ROUND(COUNT(stage_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "People"
UNION ALL
SELECT 
    'automation_status_enum' as field,
    COUNT(*) as total,
    COUNT(automation_status_enum) as converted,
    ROUND(COUNT(automation_status_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "People"
UNION ALL
SELECT 
    'confidence_level_enum' as field,
    COUNT(*) as total,
    COUNT(confidence_level_enum) as converted,
    ROUND(COUNT(confidence_level_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "People"
UNION ALL
SELECT 
    'lead_source_enum' as field,
    COUNT(*) as total,
    COUNT(lead_source_enum) as converted,
    ROUND(COUNT(lead_source_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "People";

-- Jobs table
SELECT 'JOBS TABLE' as table_name;
SELECT 
    'employment_type_enum' as field,
    COUNT(*) as total,
    COUNT(employment_type_enum) as converted,
    ROUND(COUNT(employment_type_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "Jobs"
UNION ALL
SELECT 
    'seniority_level_enum' as field,
    COUNT(*) as total,
    COUNT(seniority_level_enum) as converted,
    ROUND(COUNT(seniority_level_enum)::numeric / COUNT(*)::numeric * 100, 2) as percentage
FROM "Jobs";

-- ==============================================
-- 2. SAMPLE DATA FROM ALL TABLES
-- ==============================================

-- Companies sample
SELECT 'COMPANIES SAMPLE' as section;
SELECT 
    "Company Name",
    "STATUS" as original_status,
    status_enum as converted_status,
    "Priority" as original_priority,
    priority_enum as converted_priority
FROM "Companies" 
WHERE status_enum IS NOT NULL OR priority_enum IS NOT NULL
LIMIT 3;

-- People sample
SELECT 'PEOPLE SAMPLE' as section;
SELECT 
    "Name",
    "Stage" as original_stage,
    stage_enum as converted_stage,
    "Automation Status" as original_automation,
    automation_status_enum as converted_automation
FROM "People" 
WHERE stage_enum IS NOT NULL OR automation_status_enum IS NOT NULL
LIMIT 3;

-- Jobs sample (you already saw this)
SELECT 'JOBS SAMPLE' as section;
SELECT 
    "Job Title",
    "Employment Type" as original_employment,
    employment_type_enum as converted_employment,
    "Seniority Level" as original_seniority,
    seniority_level_enum as converted_seniority
FROM "Jobs" 
WHERE employment_type_enum IS NOT NULL OR seniority_level_enum IS NOT NULL
LIMIT 3;
