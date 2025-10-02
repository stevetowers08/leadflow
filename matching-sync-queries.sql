-- AIRTABLE TO SUPABASE MATCHING AND UPDATE SYNC

-- Generated: 2025-10-02T03:02:56.497Z

-- Strategy: Match existing records and update automation/stage status



-- COMPANY UPDATE QUERIES


-- Update company: Tyrolit Group
UPDATE companies SET 
    airtable_id = 'rec00pm1ZK9pXWGKZ',
    website = 'http://www.tyrolit.group',
    linkedin_url = 'https://at.linkedin.com/company/tyrolit',
    head_office = 'Schwaz, Tyrol',
    industry = 'Industrial Machinery Manufacturing',
    company_size = '1.001–5.000 Beschäftigte',
    priority = 'MEDIUM',
    automation_active = true,
    lead_score = '54',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tyrolit Group') OR linkedin_url = 'https://at.linkedin.com/company/tyrolit')
  AND airtable_id IS NULL;


-- Update company: OneTrust
UPDATE companies SET 
    airtable_id = 'rec0JDpaTCNwnA7dD',
    website = 'http://www.onetrust.com',
    linkedin_url = 'https://www.linkedin.com/company/onetrust',
    head_office = 'Atlanta, Georgia',
    industry = 'Software Development',
    company_size = '1,001-5,000 employees',
    priority = 'HIGH',
    automation_active = true,
    lead_score = '78',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('OneTrust') OR linkedin_url = 'https://www.linkedin.com/company/onetrust')
  AND airtable_id IS NULL;


-- Update company: ECI Software Solutions
UPDATE companies SET 
    airtable_id = 'rec0Zk3EQG9sRKJzl',
    website = 'https://www.ecisolutions.com',
    linkedin_url = 'https://www.linkedin.com/company/eci-software--solutions',
    head_office = 'Westlake, Texas, US',
    industry = 'Computer Software',
    company_size = '1001 - 5000',
    priority = 'HIGH',
    automation_active = true,
    lead_score = '70',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('ECI Software Solutions') OR linkedin_url = 'https://www.linkedin.com/company/eci-software--solutions')
  AND airtable_id IS NULL;


-- Update company: Nothing
UPDATE companies SET 
    airtable_id = 'rec0w2oZsEiNl7G2F',
    website = 'http://nothing.tech',
    linkedin_url = 'https://uk.linkedin.com/company/nothingtech',
    head_office = 'London, England, GB',
    industry = 'Computer Software',
    company_size = '501 - 1000',
    priority = 'HIGH',
    automation_active = true,
    lead_score = '70',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nothing') OR linkedin_url = 'https://uk.linkedin.com/company/nothingtech')
  AND airtable_id IS NULL;


-- Update company: Fastly
UPDATE companies SET 
    airtable_id = 'rec1HR7BXZU4LUOwU',
    website = 'http://www.fastly.com',
    linkedin_url = 'https://www.linkedin.com/company/fastly',
    head_office = 'San Francisco, CA',
    industry = 'Software Development',
    company_size = '501-1,000 employees',
    priority = 'HIGH',
    automation_active = true,
    lead_score = '77',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Fastly') OR linkedin_url = 'https://www.linkedin.com/company/fastly')
  AND airtable_id IS NULL;


-- Update company: Cornerstone OnDemand
UPDATE companies SET 
    airtable_id = 'rec1hIOX6aNQSO2xj',
    website = 'https://www.cornerstoneondemand.com/company/',
    linkedin_url = 'https://www.linkedin.com/company/cornerstoneondemand',
    head_office = 'Santa Monica, CA',
    industry = 'Software Development,Human Resources Services,IT Services and IT Consulting',
    company_size = '1,001-5,000 employees',
    priority = 'MEDIUM',
    automation_active = true,
    lead_score = '62',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cornerstone OnDemand') OR linkedin_url = 'https://www.linkedin.com/company/cornerstoneondemand')
  AND airtable_id IS NULL;


-- Update company: Adaptalift Group
UPDATE companies SET 
    airtable_id = 'rec2EvgsfCxpJ7kVH',
    website = 'https://www.adaptalift.com.au',
    linkedin_url = 'https://au.linkedin.com/company/adaptalift-group',
    head_office = 'Melbourne, VIC',
    industry = 'Machinery Manufacturing',
    company_size = '501-1,000 employees',
    priority = 'MEDIUM',
    automation_active = true,
    lead_score = '57',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adaptalift Group') OR linkedin_url = 'https://au.linkedin.com/company/adaptalift-group')
  AND airtable_id IS NULL;


-- Update company: Think & Grow
UPDATE companies SET 
    airtable_id = 'rec2ML9bryGU0JeSd',
    website = 'https://www.thinkandgrowinc.com/',
    linkedin_url = 'https://au.linkedin.com/company/thinkandgrow',
    head_office = 'East Melbourne, Victoria, AU',
    industry = 'Computer Software',
    company_size = '11 - 50',
    priority = 'LOW',
    automation_active = true,
    lead_score = NULL,
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Think & Grow') OR linkedin_url = 'https://au.linkedin.com/company/thinkandgrow')
  AND airtable_id IS NULL;


-- Update company: Josys
UPDATE companies SET 
    airtable_id = 'rec2Nl4Ai06N55SIc',
    website = 'https://josys.com/',
    linkedin_url = 'https://jp.linkedin.com/company/josys-inc',
    head_office = 'Tokyo',
    industry = 'Technology, Information and Internet,Software Development,IT Services and IT Consulting',
    company_size = '社員 201-500名',
    priority = 'HIGH',
    automation_active = true,
    lead_score = '81',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Josys') OR linkedin_url = 'https://jp.linkedin.com/company/josys-inc')
  AND airtable_id IS NULL;


-- Update company: Remote
UPDATE companies SET 
    airtable_id = 'rec2XC2fF2mTJmURM',
    website = 'https://www.remote.com',
    linkedin_url = 'https://www.linkedin.com/company/remote.com',
    head_office = 'San Francisco, CA',
    industry = 'Human Resources Services',
    company_size = '1,001-5,000 employees',
    priority = 'HIGH',
    automation_active = true,
    lead_score = '84',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Remote') OR linkedin_url = 'https://www.linkedin.com/company/remote.com')
  AND airtable_id IS NULL;



-- COMPANY INSERT QUERIES (for truly new records)


-- Insert new company if no match found: Tyrolit Group
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec00pm1ZK9pXWGKZ', 'Tyrolit Group', 'http://www.tyrolit.group', 'https://at.linkedin.com/company/tyrolit', 'Schwaz, Tyrol', 'Industrial Machinery Manufacturing', '1.001–5.000 Beschäftigte', 'MEDIUM', true, false, '54', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Tyrolit Group') OR linkedin_url = 'https://at.linkedin.com/company/tyrolit'
);


-- Insert new company if no match found: OneTrust
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec0JDpaTCNwnA7dD', 'OneTrust', 'http://www.onetrust.com', 'https://www.linkedin.com/company/onetrust', 'Atlanta, Georgia', 'Software Development', '1,001-5,000 employees', 'HIGH', true, false, '78', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('OneTrust') OR linkedin_url = 'https://www.linkedin.com/company/onetrust'
);


-- Insert new company if no match found: ECI Software Solutions
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec0Zk3EQG9sRKJzl', 'ECI Software Solutions', 'https://www.ecisolutions.com', 'https://www.linkedin.com/company/eci-software--solutions', 'Westlake, Texas, US', 'Computer Software', '1001 - 5000', 'HIGH', true, false, '70', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('ECI Software Solutions') OR linkedin_url = 'https://www.linkedin.com/company/eci-software--solutions'
);


-- Insert new company if no match found: Nothing
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec0w2oZsEiNl7G2F', 'Nothing', 'http://nothing.tech', 'https://uk.linkedin.com/company/nothingtech', 'London, England, GB', 'Computer Software', '501 - 1000', 'HIGH', true, false, '70', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Nothing') OR linkedin_url = 'https://uk.linkedin.com/company/nothingtech'
);


-- Insert new company if no match found: Fastly
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec1HR7BXZU4LUOwU', 'Fastly', 'http://www.fastly.com', 'https://www.linkedin.com/company/fastly', 'San Francisco, CA', 'Software Development', '501-1,000 employees', 'HIGH', true, false, '77', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Fastly') OR linkedin_url = 'https://www.linkedin.com/company/fastly'
);


-- Insert new company if no match found: Cornerstone OnDemand
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec1hIOX6aNQSO2xj', 'Cornerstone OnDemand', 'https://www.cornerstoneondemand.com/company/', 'https://www.linkedin.com/company/cornerstoneondemand', 'Santa Monica, CA', 'Software Development,Human Resources Services,IT Services and IT Consulting', '1,001-5,000 employees', 'MEDIUM', true, false, '62', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Cornerstone OnDemand') OR linkedin_url = 'https://www.linkedin.com/company/cornerstoneondemand'
);


-- Insert new company if no match found: Adaptalift Group
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec2EvgsfCxpJ7kVH', 'Adaptalift Group', 'https://www.adaptalift.com.au', 'https://au.linkedin.com/company/adaptalift-group', 'Melbourne, VIC', 'Machinery Manufacturing', '501-1,000 employees', 'MEDIUM', true, false, '57', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Adaptalift Group') OR linkedin_url = 'https://au.linkedin.com/company/adaptalift-group'
);


-- Insert new company if no match found: Think & Grow
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec2ML9bryGU0JeSd', 'Think & Grow', 'https://www.thinkandgrowinc.com/', 'https://au.linkedin.com/company/thinkandgrow', 'East Melbourne, Victoria, AU', 'Computer Software', '11 - 50', 'LOW', true, false, NULL, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Think & Grow') OR linkedin_url = 'https://au.linkedin.com/company/thinkandgrow'
);


-- Insert new company if no match found: Josys
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec2Nl4Ai06N55SIc', 'Josys', 'https://josys.com/', 'https://jp.linkedin.com/company/josys-inc', 'Tokyo', 'Technology, Information and Internet,Software Development,IT Services and IT Consulting', '社員 201-500名', 'HIGH', true, false, '81', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Josys') OR linkedin_url = 'https://jp.linkedin.com/company/josys-inc'
);


-- Insert new company if no match found: Remote
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT 'rec2XC2fF2mTJmURM', 'Remote', 'https://www.remote.com', 'https://www.linkedin.com/company/remote.com', 'San Francisco, CA', 'Human Resources Services', '1,001-5,000 employees', 'HIGH', true, false, '84', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('Remote') OR linkedin_url = 'https://www.linkedin.com/company/remote.com'
);



-- PEOPLE UPDATE QUERIES (includes stage and automation updates)


-- Update person: Collection mohit (Stage: CONNECT SENT -> connection_requested)
UPDATE people SET 
    airtable_id = 'rec00K14ZaDrRx7L1',
    company_role = 'Sales Manager',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Nothing''s 146% growth in India. That''s incredible momentum.',
    linkedin_follow_up_message = 'We''re working with some strong sales leaders in the ANZ market at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Lead for ANZ at Nothing. How are you finding it with all the expansion happening? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Collection mohit') OR linkedin_url = 'https://www.linkedin.com/in/collection-mohit-82ba96363')
  AND airtable_id IS NULL;


-- Update person: Emma-Jayne Owens (Stage: CONNECTED -> connected)
UPDATE people SET 
    airtable_id = 'rec0OJCtqkanR0vxY',
    company_role = 'RVP Sales - APJ ',
    employee_location = 'Greater Sydney Area',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the iPX Sydney event news. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, particularly with companies scaling their partnership teams like impact.com is doing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Emma-Jayne Owens') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk')
  AND airtable_id IS NULL;


-- Update person: David Phillips (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec0QFvn5fa8ZcC7y',
    company_role = 'Lead Account Manager - Financial Services',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Low',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Simplus featured at the Agentforce World Tour. Great to see you leading the AI transformation space.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Presales candidates in the Salesforce space. Happy to chat if useful.',
    linkedin_connected_message = 'I see the team is hiring a Presales Executive at Simplus. How''s the market looking? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Phillips') OR linkedin_url = 'https://www.linkedin.com/in/david-phillips-a6017315')
  AND airtable_id IS NULL;


-- Update person: Cameron Fenley (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec0kSyo4N7LWp7uS',
    company_role = 'Enterprise Strategic Sales ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing SUGCON ANZ coming to Sydney. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates focused on new business development at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team for ANZ new business. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around SDR hiring, particularly with companies expanding their ANZ presence like Sitecore is doing with events like SUGCON.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cameron Fenley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI')
  AND airtable_id IS NULL;


-- Update person: Stephanie French (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec0kd22pifT1Midg',
    company_role = 'Subcontractor Sales Manager',
    employee_location = 'Greensborough, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Stephanie! Love seeing the growth at E1 across the APAC region.',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for E1. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Stephanie French') OR linkedin_url = 'https://www.linkedin.com/in/stephanie-jayne-french')
  AND airtable_id IS NULL;


-- Update person: Anne-Sophie Purtell (Stage: CONNECT SENT -> connection_requested)
UPDATE people SET 
    airtable_id = 'rec0koPZSD5QJ1bFe',
    company_role = 'Head of Sales ANZ',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the GBG Go platform launch. Exciting move with the rebrand!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ operations.',
    linkedin_connected_message = 'I see you''re building out your ANZ team. How are you finding the market for senior account management talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the identity verification space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Anne-Sophie Purtell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk')
  AND airtable_id IS NULL;


-- Update person: Warren Reid (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec0qQAnW80XI17ko',
    company_role = 'Sales Director',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the new Melbourne office fit out. Great investment in the team!',
    linkedin_follow_up_message = 'We''re working with some excellent BD candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team with the Business Development Director role. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in Melbourne''s tech sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Warren Reid') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok')
  AND airtable_id IS NULL;


-- Update person: Martin Evans (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec12qIgXB6vOTdsP',
    company_role = 'Regional Sales Manager',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Melbourne office presence. Smart local move!',
    linkedin_follow_up_message = 'We''re seeing some strong customer success talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their renewals teams.',
    linkedin_connected_message = 'Hope you''re settling in well at Lumivero! I see you''re building out the renewals team. How are you finding the local talent market? We''re noticing some interesting shifts in the customer success landscape, particularly around renewals manager hires in the data analytics space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Martin Evans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM')
  AND airtable_id IS NULL;


-- Update person: Nick Bowden (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec1M3yBI49uSQTGT',
    company_role = 'Regional Vice President, Strategic | Enterprise ANZ at Elastic',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Tech Data partnership announcement. Great move for ANZ!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AEs with government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their public sector teams.',
    linkedin_connected_message = 'I see you''re building out your federal government team. How are you finding the talent market for enterprise AEs in that space? We''re noticing some interesting shifts around government sector sales hiring, particularly with companies expanding their public sector focus.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nick Bowden') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M')
  AND airtable_id IS NULL;


-- Update person: Sumit Bansal (Stage: NEW LEAD -> new)
UPDATE people SET 
    airtable_id = 'rec1NpANJAnAPPojx',
    company_role = 'Vice President of Sales, Asia',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney office at Australia Square. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. The demand for experienced AEs who can navigate complex enterprise sales cycles has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sumit Bansal') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8')
  AND airtable_id IS NULL;



-- PEOPLE INSERT QUERIES (for truly new records)


-- Insert new person if no match found: Collection mohit
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec00K14ZaDrRx7L1', 'Collection mohit', 'Sales Manager', 'Australia', 'https://www.linkedin.com/in/collection-mohit-82ba96363', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Collection mohit') OR linkedin_url = 'https://www.linkedin.com/in/collection-mohit-82ba96363'
);


-- Insert new person if no match found: Emma-Jayne Owens
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0OJCtqkanR0vxY', 'Emma-Jayne Owens', 'RVP Sales - APJ ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Emma-Jayne Owens') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk'
);


-- Insert new person if no match found: David Phillips
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0QFvn5fa8ZcC7y', 'David Phillips', 'Lead Account Manager - Financial Services', 'Melbourne, Australia', 'https://www.linkedin.com/in/david-phillips-a6017315', 'new', 'Low', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Phillips') OR linkedin_url = 'https://www.linkedin.com/in/david-phillips-a6017315'
);


-- Insert new person if no match found: Cameron Fenley
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0kSyo4N7LWp7uS', 'Cameron Fenley', 'Enterprise Strategic Sales ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cameron Fenley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI'
);


-- Insert new person if no match found: Stephanie French
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0kd22pifT1Midg', 'Stephanie French', 'Subcontractor Sales Manager', 'Greensborough, Australia', 'https://www.linkedin.com/in/stephanie-jayne-french', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Stephanie French') OR linkedin_url = 'https://www.linkedin.com/in/stephanie-jayne-french'
);


-- Insert new person if no match found: Anne-Sophie Purtell
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0koPZSD5QJ1bFe', 'Anne-Sophie Purtell', 'Head of Sales ANZ', 'Australia', 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Anne-Sophie Purtell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk'
);


-- Insert new person if no match found: Warren Reid
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0qQAnW80XI17ko', 'Warren Reid', 'Sales Director', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Warren Reid') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok'
);


-- Insert new person if no match found: Martin Evans
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec12qIgXB6vOTdsP', 'Martin Evans', 'Regional Sales Manager', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Martin Evans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM'
);


-- Insert new person if no match found: Nick Bowden
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1M3yBI49uSQTGT', 'Nick Bowden', 'Regional Vice President, Strategic | Enterprise ANZ at Elastic', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nick Bowden') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M'
);


-- Insert new person if no match found: Sumit Bansal
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1NpANJAnAPPojx', 'Sumit Bansal', 'Vice President of Sales, Asia', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sumit Bansal') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8'
);



-- JOB UPDATE QUERIES


-- Update job: Partnerships & Enterprise Sales Executive
UPDATE jobs SET 
    airtable_id = 'rec0012xeGqnyK8NW',
    job_url = 'https://au.linkedin.com/jobs/view/partnerships-enterprise-sales-executive-at-zenith-payments-pty-ltd-4303821821',
    location = 'Mascot, NSW',
    priority = 'MEDIUM',
    employment_type = 'full_time',
    seniority_level = 'Mid-Senior level',
    function = 'Sales and Business Development',
    automation_active = false,
    lead_score_job = 58,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Partnerships & Enterprise Sales Executive')
  AND airtable_id IS NULL;


-- Update job: Account Manager - Expression of Interest
UPDATE jobs SET 
    airtable_id = 'rec05rq6Ce6wD24aq',
    job_url = 'https://au.linkedin.com/jobs/view/account-manager-expression-of-interest-at-mri-software-4269387800',
    location = 'Greater Melbourne Area, ',
    priority = 'VERY HIGH',
    employment_type = 'full_time',
    seniority_level = 'Mid-Senior level',
    function = 'Sales and Business Development',
    automation_active = false,
    lead_score_job = 92,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Account Manager - Expression of Interest')
  AND airtable_id IS NULL;


-- Update job: Head of Sales
UPDATE jobs SET 
    airtable_id = 'rec0RlxycOSkgpGCp',
    job_url = 'https://au.linkedin.com/jobs/view/head-of-sales-at-zib-digital-australia-4267008117',
    location = 'Melbourne, Victoria, AU',
    priority = 'LOW',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = 36,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Head of Sales')
  AND airtable_id IS NULL;


-- Update job: Regional Sales Manager, Canberra, Australia
UPDATE jobs SET 
    airtable_id = 'rec0hu9dXj7VjrKMV',
    job_url = 'https://au.linkedin.com/jobs/view/regional-sales-manager-canberra-australia-at-airlock-digital-4278510908',
    location = 'Canberra, ',
    priority = 'MEDIUM',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = 53,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Regional Sales Manager, Canberra, Australia')
  AND airtable_id IS NULL;


-- Update job: Business Development Representative
UPDATE jobs SET 
    airtable_id = 'rec0invjCjUMdZSHa',
    job_url = 'https://au.linkedin.com/jobs/view/business-development-representative-at-nightingale-software-4303860908',
    location = 'Greater Melbourne Area, ',
    priority = 'MEDIUM',
    employment_type = 'full_time',
    seniority_level = 'Mid-Senior level',
    function = 'Sales and Business Development',
    automation_active = false,
    lead_score_job = 54,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Business Development Representative')
  AND airtable_id IS NULL;


-- Update job: SMB Account Executive
UPDATE jobs SET 
    airtable_id = 'rec0vXq7B2CDkHe0C',
    job_url = 'https://au.linkedin.com/jobs/view/smb-account-executive-at-clickup-4300986569',
    location = 'Sydney, NSW',
    priority = 'HIGH',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = 80,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('SMB Account Executive')
  AND airtable_id IS NULL;


-- Update job: Senior Enterprise Account Executive
UPDATE jobs SET 
    airtable_id = 'rec12BW708fMHMSXk',
    job_url = 'https://au.linkedin.com/jobs/view/senior-enterprise-account-executive-at-contentsquare-4225608974',
    location = 'Paris, , FR',
    priority = 'MEDIUM',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = null,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Senior Enterprise Account Executive')
  AND airtable_id IS NULL;


-- Update job: Senior Account Executive Australia
UPDATE jobs SET 
    airtable_id = 'rec1CdQHBLQnR8Pn8',
    job_url = 'https://au.linkedin.com/jobs/view/senior-account-executive-australia-at-vonage-4277726399',
    location = 'Holmdel, New Jersey, US',
    priority = 'MEDIUM',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = null,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Senior Account Executive Australia')
  AND airtable_id IS NULL;


-- Update job: Account Manager
UPDATE jobs SET 
    airtable_id = 'rec1hvT1u7ty5K6Qi',
    job_url = 'https://au.linkedin.com/jobs/view/account-manager-at-vertice-4298766514',
    location = 'Sydney, NSW',
    priority = 'VERY HIGH',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = 100,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Account Manager')
  AND airtable_id IS NULL;


-- Update job: Business Development Representative
UPDATE jobs SET 
    airtable_id = 'rec23oWbuQzzA0t9V',
    job_url = 'https://au.linkedin.com/jobs/view/business-development-representative-at-meltwater-4299083240',
    location = 'Melbourne, VIC',
    priority = 'HIGH',
    employment_type = NULL,
    seniority_level = '',
    function = '',
    automation_active = false,
    lead_score_job = 65,
    updated_at = NOW()
WHERE LOWER(title) = LOWER('Business Development Representative')
  AND airtable_id IS NULL;



-- JOB INSERT QUERIES (for truly new records)


-- Insert new job if no match found: Partnerships & Enterprise Sales Executive
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec0012xeGqnyK8NW', 'Partnerships & Enterprise Sales Executive', 'https://au.linkedin.com/jobs/view/partnerships-enterprise-sales-executive-at-zenith-payments-pty-ltd-4303821821', 'Mascot, NSW', 'MEDIUM', 'full_time', 'Mid-Senior level', 'Sales and Business Development', false, 58, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Partnerships & Enterprise Sales Executive')
);


-- Insert new job if no match found: Account Manager - Expression of Interest
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec05rq6Ce6wD24aq', 'Account Manager - Expression of Interest', 'https://au.linkedin.com/jobs/view/account-manager-expression-of-interest-at-mri-software-4269387800', 'Greater Melbourne Area, ', 'VERY HIGH', 'full_time', 'Mid-Senior level', 'Sales and Business Development', false, 92, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Account Manager - Expression of Interest')
);


-- Insert new job if no match found: Head of Sales
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec0RlxycOSkgpGCp', 'Head of Sales', 'https://au.linkedin.com/jobs/view/head-of-sales-at-zib-digital-australia-4267008117', 'Melbourne, Victoria, AU', 'LOW', NULL, '', '', false, 36, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Head of Sales')
);


-- Insert new job if no match found: Regional Sales Manager, Canberra, Australia
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec0hu9dXj7VjrKMV', 'Regional Sales Manager, Canberra, Australia', 'https://au.linkedin.com/jobs/view/regional-sales-manager-canberra-australia-at-airlock-digital-4278510908', 'Canberra, ', 'MEDIUM', NULL, '', '', false, 53, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Regional Sales Manager, Canberra, Australia')
);


-- Insert new job if no match found: Business Development Representative
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec0invjCjUMdZSHa', 'Business Development Representative', 'https://au.linkedin.com/jobs/view/business-development-representative-at-nightingale-software-4303860908', 'Greater Melbourne Area, ', 'MEDIUM', 'full_time', 'Mid-Senior level', 'Sales and Business Development', false, 54, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Business Development Representative')
);


-- Insert new job if no match found: SMB Account Executive
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec0vXq7B2CDkHe0C', 'SMB Account Executive', 'https://au.linkedin.com/jobs/view/smb-account-executive-at-clickup-4300986569', 'Sydney, NSW', 'HIGH', NULL, '', '', false, 80, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('SMB Account Executive')
);


-- Insert new job if no match found: Senior Enterprise Account Executive
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec12BW708fMHMSXk', 'Senior Enterprise Account Executive', 'https://au.linkedin.com/jobs/view/senior-enterprise-account-executive-at-contentsquare-4225608974', 'Paris, , FR', 'MEDIUM', NULL, '', '', false, null, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Senior Enterprise Account Executive')
);


-- Insert new job if no match found: Senior Account Executive Australia
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec1CdQHBLQnR8Pn8', 'Senior Account Executive Australia', 'https://au.linkedin.com/jobs/view/senior-account-executive-australia-at-vonage-4277726399', 'Holmdel, New Jersey, US', 'MEDIUM', NULL, '', '', false, null, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Senior Account Executive Australia')
);


-- Insert new job if no match found: Account Manager
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec1hvT1u7ty5K6Qi', 'Account Manager', 'https://au.linkedin.com/jobs/view/account-manager-at-vertice-4298766514', 'Sydney, NSW', 'VERY HIGH', NULL, '', '', false, 100, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Account Manager')
);


-- Insert new job if no match found: Business Development Representative
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT 'rec23oWbuQzzA0t9V', 'Business Development Representative', 'https://au.linkedin.com/jobs/view/business-development-representative-at-meltwater-4299083240', 'Melbourne, VIC', 'HIGH', NULL, '', '', false, 65, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('Business Development Representative')
);



-- CLEANUP QUERIES (remove records not in Airtable)

-- Remove companies not in Airtable (but keep those without airtable_id as they might be manually added)
DELETE FROM companies 
WHERE airtable_id IS NOT NULL 
  AND LOWER(name) NOT IN ('tyrolit group', 'onetrust', 'eci software solutions', 'nothing', 'fastly', 'cornerstone ondemand', 'adaptalift group', 'think & grow', 'josys', 'remote', 'rib software', 'diligent', 'meltwater', 'saviynt', 'syniti', 'securiti', 'celigo', 'nearmap', 'shiftcare', 'ideagen', 'micromine', 'menumiz™ (au)', 'huntress', 'inc', 'cognizant', 'netskope', 'akamai technologies', 'kpmg australia', 'zepto', 'rms', 'jd.com', 'ordermentum', 'stripe', 'sage', 'relevance ai', 'bigtincan', 'tiktok', 'civica', 'mimecast', 'madison group enterprises', 'hello clever', 'riskified', 'commvault', 'intercom', 'braze', 'grafana labs', 'mindbody', 'birdeye', 'fiserv', '4mation technologies', 'wiise', 'datadog', 'transvirtual', 'airlock digital', 'safetyculture', 'euromonitor international', 'cresta', 'proofpoint', 'onside', 'deputy', 'opswat', 'weka', 'trustwave, a levelblue company', 'niche 212', 'asana', 'rocket software', 'qlik', 'simpro software', 'vonage', 'appetise', 'ninjaone', 'simplus anz (infosys salesforce practice)', 'keepit', 'box', 'notion', 'zeller', 'patsnap', 'impact.com', 'cuscal limited', 'databricks', 'intersystems', 'cloudbeds', 'justco', 'canon australia', 'asiapay', 'podium', 'rapid7', 'one identity', 'monotype', 'cvent', 'prophet', 'mediaform', 'contentsquare', 'vimeo', 'squiz', 'e1 (au / nz)', 'elastic', 'airwallex', 'ingenico', 'cosol', 'objective corporation', 'cisco thousandeyes', 'employment hero', 'eset australia', 'devicie', 'sabre corporation', 'baidam pty ltd', 'wayflyer', 'monday.com', 'hcltech', 'eset', 'carta', 'darktrace', 'sensiba llp', 'beyondtrust', 'martianlogic', 'anomali', 'pure storage', 'atlassian', 'xref', 'sonar', 'absorb software', 'wiz', 'qualys', 'lumivero', 'canonical', 'netsol technologies inc.', 'axcelerate', 'info-tech research group', 'outcomex', 'humanforce', 'ofx', 'sprout social, inc.', 'fluke corporation', 'sprinklr', 'fireblocks', 'fico', 'confluent', 'vanta', 'avepoint', 'sitecore', 'gbg plc', 'entrust', 'assignar', 'ada', 'planful', 'rippling', 'omron automation and robotics australia', 'kpay group', 'dext', 'copado', 'clearer.io', 'centrepal', 'impel', 'phocas software', 'zenith payments pty ltd', 'talkdesk', 'sentrient', 'intellect', 'etrainu', 'hyperstrong', 'mri software', 'onboard', 'advantech', 'hyland', 'gigamon', 'adyen', 'klipboard', 'trustwave', 'foodbyus', 'multiplier', 'glean', 'gumtree group', 'verkada', 'eteam', 'docker, inc', 'obsidian security', 'lucid software', 'ifs', 'zib digital australia', 'vertice', 'sitemate', 'prolim australia & new zealand', 'helloteams', 'abnormal ai', 'sps commerce', 'nightingale software', 'docker', 'myriota', 'square', 'atturra', 'yokogawa australia & new zealand', 'pax8', 'shipbob', 'zilliz', 'kyriba', 'convera', 'lumi', 'a levelblue company', 'wild tech', 'ibm', 'firmable', 'jamf', 'github', 'hclsoftware', 'transvirtual ', 'clickup', 'amazon', 'qualtrics', 'mastercard', 'aspen technology', 'reward gateway');

-- Remove people not in Airtable
DELETE FROM people 
WHERE airtable_id IS NOT NULL 
  AND LOWER(name) NOT IN ('collection mohit', 'emma-jayne owens', 'david phillips', 'cameron fenley', 'stephanie french', 'anne-sophie purtell', 'warren reid', 'martin evans', 'nick bowden', 'sumit bansal', 'brendan irwin', 'nicola gerber', 'chloe frost', 'ryan joseph rialp', 'christina chung', 'jordan k.', 'daniel corridon', 'sharryn napier (she/her)', 'chris haylock', 'jothi kumar', 'bharani iyer', 'adriana de souza', 'andrew fogarty', 'pamela ong', 'peter scott', 'ben luke', 'joe widing', 'mike hawley', 'charlotte buxton', 'julia ren', 'lawrence tso', 'ross f.', 'rheniel ibalio', 'natasha pennells', 'myron stein', 'chris smith', 'crispin kerr', 'james ross', 'steve grubmier', 'matt davison', 'greg baxter', 'kylie green', 'trent mccreanor', 'jonathan chua', 'jordan akers', 'jonathan mathers', 'daniel lawrence', 'polly parker', 'eric rollett', 'andrew wilkins', 'tom jackson', 'jack mullard', 'cheryl duggan', 'christie taylor', 'jude don', 'mohammed fouladi', 'geoff davies', 'daniel wong', 'izzy hettiarachchi', 'leo zhang', 'michael hull', 'adam brew', 'sruthi k.', 'pavel kamychnikov', 'naina vishnoi', 'james hanna', 'margaret selianakis', 'david wright', 'isobel shurley', 'kiran ajbani', 'randeep chhabra', 'avi ben-galil', 'jaye vernon', 'adrian valois', 'aaron thorne', 'eric seah', 'georgia hinks', 'rosie courtier', 'angus macrae', 'farooq fasih ghauri', 'dan hartman', 'kim gardiner', 'reece watson', 'gareth parker', 'yue wang', 'polly parker', 'oliver godwin', 'keith chen', 'justin barlow', 'serene foo', 'steven clement', 'lorena casillas', 'suhail ismail', 'steven newman', 'mark henderson', 'andrew maresca', 'sam salehi', 'luke corkin', 'michael van zoggel', 'tom tokic', 'arnold chan', 'steve bailey', 'kane mcmonigle', 'peter coulson', 'max ebdy', 'jimmy wang', 'will griffith', 'cam o''riordan', 'clayton bennell ☁️', 'damon scarr', 'daniel skaler', 'dan franklin', 'onur dincer', 'matt carter', 'chloe frost', 'tercio couceiro', 'jade marishel gaicd', 'scott smedley', 'james meischke', 'sarah rowley', 'tony spencer', 'matthew lowe', 'carly roper', 'gareth moore', 'henry zhou', 'jarod hart', 'cherie chay', 'david barrow', 'claudia kidd', 'darren paterson', 'aaron berthelot', 'paul richardson', 'sesh jayasuriya', 'shannon king', 'mario leonidou', 'dallen yi zhao long', 'julian lock', 'robert g.', 'jose alba', 'dylan clough', 'clare bagoly', 'anthony connors', 'victor yong', 'ash rahman', 'nicole daley', 'louis whelan', 'thana jahairam', 'wei li lim', 'craig bastow', 'prem kumar', 'marea ford', 'sheree springer', 'kiran mudunuru', 'will van schaik', 'todd wellard', 'janelle havill', 'allan wang', 'damien olbourne', 'kenny soutar', 'fabian teo', 'lisa cunningham', 'satory li', 'brett watkins', 'matt crowe', 'trent lowe', 'darren e.', 'byron rudenno', 'jerry sun', 'belma kubur', 'damian wrigley', 'shane verner', 'clare stokes', 'kelly johnson', 'jason leonidas', 'dave illman', 'ed layton', 'drew plummer', 'christina mastripolito', 'rino crescitelli', 'brad granger', 'gerald tjan', 'peter ferris', 'david  chin', 'alex riley', 'allie mairs', 'mark allen', 'phil harris', 'ankesh chopra', 'chris sharp', 'simon hickson', 'andrew browne', 'francesca m.', 'emlyn gavin', 'richard ford', 'cameron mclean', 'damien mcdade', 'stella ramette', 'stefan ellis', 'david hickey', 'david chapman', 'tiffany ong', 'david helleman', 'luke mccarthy', 'jonathon mccauley', 'theo mcpeake', 'martin cerantonio', 'praba krishnan', 'bhavik vashi', 'colin stapleton', 'aleks kakasiouris', 'stanley chia', 'basil botoulas', 'alex nemeth', 'paul mitchinson', 'jason ogg', 'vinod venugopal', 'bridie rees', 'thomas nguyen', 'john delbridge', 'ron gounder', 'adam duncan', 'gary zeng', 'aidan mcdonald', 'tim mcdonnell - svp sales', 'james hayward', 'blair hasforth', 'charlie pennington', 'richard exley', 'kyle baker', 'abhishek nigam', 'melissa kiew', 'mark gosney', 'kenneth yeo', 'kylie terrell', 'eunice zhou', 'rj price', 'sean walsh', 'jo gaines', 'houman sahraei', 'nicole russo', 'marc airo-farulla', 'darren bowie', 'terence t.', 'jeff yeoh', 'gary saw', 'kevin rawlings', 'john aguilar', 'kris h.', 'kayur desai (kd)', 'olivia willee', 'grant eggleton', 'darryn cann', 'simon dougall', 'russell palmer', 'rebecca tissington', 'marcel pitt', 'andrew amos', 'zeek ahamed', 'justin kumar', 'matthias hauser', 'mick brennan', 'craig moulin', 'david knapp', 'craig medlyn', 'ian berkery', 'keith chan', 'coreen chia', 'tim clark', 'soumi mukherjee', 'cassandra crothers', 'belinda glasson', 'sean phelps', 'eralp kubilay', 'jit shen t.', 'celeste kirby-brown', 'praveen kumar chandrashekhar', 'louisa jewitt', 'kimberley duggan', 'frankco shum', 'krina k.', 'nick best', 'nick lowther', 'zhiwei jiang', 'ben pascoe', 'lilli perkin', 'ellie g.', 'darren ward', 'sally matheson', 'gerry tucker', 'jeannine winiata', 'mark coughlan', 'shane ullman', 'scott bocksette', 'james jeffson', 'ash gibbs', 'mamoon huda', 'andrew rae', 'mzi mpande', 'michael small', 'lahif yalda', 'declan keir-saks', 'allie b.', 'jeremy pell', 'damian trubiano', 'mandy gallie', 'andrew walford', 'yamato toda', 'dajana büchner', 'adrian towsey', 'thomas godfrey', 'andrew cannington', 'charlie wood', 'julien fouter', 'dermot mccutcheon', 'pascal budd', 'florence douyere', 'will hiebert', 'elizabeth zab', 'grant s.', 'ben chandra', 'james harkin', 'adam furness, gaicd', 'ethan ng', 'simon laskaj', 'carol cao', 'cat rutledge jones', 'james o''sullivan', 'gregg mccallum', 'liying lim', 'alexander falkingham', 'rocco de villiers', 'tony burnside', 'changjie wang', 'nick martin', 'tony fulcher', 'nick randall', 'danni munro', 'elisabeth lind', 'sherryl m.', 'tom blackman', 'patrick browne-cooper', 'karl durrance', 'byron rudenno', 'alex gouramanis', 'rob dooley', 'reece appleton', 'zac beeten', 'alex belperio', 'evan blennerhassett', 'toni w.', 'franco costa', 'gavin altus', 'peter gregson', 'gautam ahuja', 'andrew mccarthy', 'prakash damoo', 'budd ilic', 'vicki sayer', 'martin yan', 'shaun haque', 'vanessa cause', 'sam symmans', 'clint elliott', 'ryan alexander', 'penny dolton', 'marco d. castelán', 'julian lock', 'matthew tyrrell', 'luke kavanagh', 'jackson duffy', 'hayley fisher', 'amanda kidd', 'alexander g.', 'luke kavanagh', 'simon robinson', 'danielle langley', 'damian wrigley', 'ashley carron-arthur', 'allison watts', 'renee rooney', 'anthony read', 'srikanth mohan', 'geoffrey andrews', 'michael clarke', 'elizabeth watson', 'lawrence du', 'laura lane', 'rayna k. mcnamara', 'johanes iskandar', 'charlotte buxton', 'steve smith', 'avinash kalyana sundaram', 'nathan archie', 'francis mcgahan', 'whitney liu', 'anthony harding', 'lara horne', 'paul lancaster', 'amy zhang', 'kristin carville', 'carlos bravo', 'stephanie may', 'adam maine', 'arran mulvaney', 'steve bray', 'jacob sinnott', 'leanne mackenzie', 'winnie nguyen', 'kane lu', 'vince tassone', 'matt ditchburn', 'christian whamond', 'sean taylor', 'jeremy auerbach', 'clint elliott', 'amy zobec', 'darin milner', 'giulia francesca pineda', 'adam beavis', 'byron rudenno', 'chris ponton dwyer', 'dane hart', 'alicia boey', 'colin birney', 'harry chichadjian', 'mel lucas', 'james p. hunt', 'geoff prentis', 'julian lock', 'jonathon coleman', 'malik ullah', 'max mcnamara', 'alex burton', 'krista gustafson', 'paul vella', 'jenny undefined', 'angus kilian', 'james delmar', 'richard wong', 'brian zerafa', 'dan shaw', 'simon horrocks', 'antoine letard', 'justin flower', 'chantelle conway', 'isaac lowrie', 'varun sareen', 'andrew mamonitis', 'andrew mccarthy', 'pete waldron', 'brendon mitchell', 'theo gessas', 'tiffany nee', 'michael shnider', 'john petty', 'david chester🎗', 'emma g.', 'zach sevelle', 'sebastian m.', 'mathew lovelock', 'dave o''connor', 'harsha hariharan', 'carol sun', 'john cunningham', 'ashutosh uniyal', 'de''angello harris', 'nikhil rolla', 'shane brown', 'claire burke', 'chloe frost', 'eric h.', 'martin creighan', 'nikolas kalogirou', 'khalid khan', 'neill wiffin', 'simon moxham', 'jack kruse', 'jo salisbury', 'susan atike', 'marea ford', 'patrick amate', 'emilia mosiejewski', 'chelsea sunderland', 'paul wittich', 'jeffrey leong', 'laura robinson', 'mukti prabhu, gaicd', 'matt perkes', 'rob arora', 'tony walkley', 'altay ayyuce', 'sarah jarman', 'shane lowe', 'james demetrios', 'ravi chandar', 'damon etherington', 'paul broughton', 'andrew mccarthy', 'lewis steere', 'pat bolster', 'brett waters', 'ki currie', 'gavin james vermaas', 'ashutosh razdan', 'tim bentley');

-- Remove jobs not in Airtable
DELETE FROM jobs 
WHERE airtable_id IS NOT NULL 
  AND LOWER(title) NOT IN ('partnerships & enterprise sales executive', 'account manager - expression of interest', 'head of sales', 'regional sales manager, canberra, australia', 'business development representative', 'smb account executive', 'senior enterprise account executive', 'senior account executive australia', 'account manager', 'business development representative', 'manager, sales development (outbound)', 'sales consultant', 'account executive', 'salesforce commercial director', 'account manager', 'senior sales director', 'enterprise sales executive', 'channel sales account manager', 'customer success manager', 'sales operations specialist', 'engagement manager', 'senior sales executive - government', 'sales application key account manager', 'commercial account executive (mid market)', 'channel sales manager - anz', 'customer success manager', 'enterprise account executive, apac', 'sales account executive', 'strategic enterprise account executive', 'sales development representative', 'sales manager, apac', 'gtm systems engineer', 'account manager | are you a recruiter looking for a new career pathway?', 'head of apj sales engineering (commercial & mid-market)', 'account executive', 'presales executive', 'account executive saas', 'account manager', 'sales director - apac', 'enterprise sales manager – micromine beyond', 'vp of sales and partnerships (anz)', 'account executive ii', 'account executive, strategic (sydney or melbourne preferred)', 'account director', 'regional sales manager (cybersecurity, sydney)', 'strategic sales manager', 'account executive, mid market', 'sales director', 'account manager', 'strategic sales director, australia', 'business development representative', 'sales development representative', 'account manager', 'sales director', 'sales development representative australia remote', 'business development manager', 'senior sales manager', 'account executive - local government (p691)', 'account executive', 'account executive, mid-market', 'head of strategic account management – corporate travel', 'enterprise business representative', 'presales consultant - ai growth and adoption', 'account executive', 'client account executive', 'sales development representative (anz, new business)', 'enterprise account executive - anz', 'customer success lead', 'account executive, new business (apac)', 'account executive - apac', 'enterprise account executive, melbourne', 'technical presales consultant', 'business development representative', 'account executive (enterprise)', 'partner sales executive, anz', 'manager, business development reps - asia pacific', 'business development representative i', 'account executive', 'enterprise account executive', 'enterprise sales account manager', 'sales development representative (australia+singapore)', 'account executive', 'business development representative, australia', 'sr. account executive (apac)', 'regional sales manager (vic)', 'business development representative - australia, apac', 'senior account manager', 'customer success manager', 'sales development representative - apj', 'account manager, existing sellers (fulfillment)', 'inside sales representative', 'senior product marketing and sales enablement manager (b2b saas)', 'enterprise account executive', 'senior sales executive - brisbane', 'client account manager - corporate', 'sales director, australia', 'sales executive (sydney)', 'sales development representative', 'business development representative, apac (aus)', 'business development executive', 'regional sales manager-anz, asean, china', 'business development representative - australia, apac', 'account executive', 'senior manager enterprise sales australia', 'tmt industry solutions group - service line specialist', 'enterprise account executive, sydney', 'enterprise account executive, strategic', 'customer success manager', 'strategic account executive', 'regional sales director', 'business development representative', 'channel sales account manager', 'senior account executive - mid-market', 'enterprise account executive', 'sales development representative', 'business development manager and key account manager- industrial automation', 'sales enablement manager', 'business development representative', 'sdr manager (outbound)', 'account executive, mid market', 'associate mid-market account executive sub 100', 'key account management - associate partner', 'sales development representative - hybrid', 'director, loyalty strategy consulting sales', 'smb sales specialist - outbound', 'business development representative', 'sales executive', 'business development representative', 'solutions consultant (presales)', 'enterprise account executive - melbourne', 'enterprise account manager', 'solutions engineer', 'sales executive - australia', 'national strategic account manager', 'sales development representative', 'sales development representative, sme & growth', 'sales executive', 'business development representative (australia)', 'regional sales director - melbourne, australia', 'enterprise account executive - remote - brisbane or canberra', 'business development lead', 'sales account executive', 'customer success manager', 'enterprise account manager', 'mid market account executive', 'account executive, mid market', 'sales development representative', 'account executive', 'new business sales executive', 'enterprise development representative - sydney', 'partner sales manager', 'renewals manager', 'sales development representative', 'sales lead, anz', 'senior account executive - australia', 'business development representative', 'sales development representative, aunz', 'account executive, enterprise', 'automation platform - brand sales specialist', 'sales development representative', 'business development representative, apac (aus)', 'sales development representative, small business', 'enterprise sales executive', 'business development director', 'sales development representative inbound au - remote', 'sales development associate', 'technical sales executive', 'senior enterprise sales executive, new and existing accounts', 'territory manager', 'account executive (existing business), commercial', 'manager ii, sales', 'commercial account executive', 'sales development representative', 'sales engineer', 'sales manager', 'enterprise account manager, public sector- remote', 'business development account management tga', 'b2b sales executive (saas)', 'business development representative', 'apac corporate new logo account executive', 'key account manager', 'sales development representative', 'sales development representative, australia', 'sales manager (anz)', 'account manager - b2b saas', 'account manager', 'sales development representative', 'senior account executive - australia', 'outbound sales development representative - australia/ new zealand', 'strategic account executive', 'senior business development manager', 'business development representative – fintech | uncapped commission', 'senior sales development rep - large enterprise', 'channel account manager', 'sales executive', 'senior account executive, enterprise', 'consulting engineer, apac', 'account executive - enterprise', 'regional sales executive', 'sales development representative sydney australia', 'enterprise bdm – cloud voice / microsoft teams', 'senior account manager', 'sales director', 'sales development representative', 'enterprise account executive', 'seller onboarding specialist', 'enterprise account executive (federal government)', 'customer success manager', 'partner sales manager anz', 'account executive', 'account executive (employee engagement consultant)', 'sales development representative', 'anz partner sales manager', 'anz senior account manager (3902)', 'senior regional sales director', 'new business development manager, small medium business - aunz', 'account executive (mid-market)', 'sales & account manager - access rental equipment', 'business development representative');