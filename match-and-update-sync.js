#!/usr/bin/env node

/**
 * Match and Update Sync Script
 * 
 * This script matches existing Supabase records with Airtable data and updates:
 * - Automation status and actions
 * - Stage updates for people
 * - Priority and other key fields
 * - Only adds truly new records
 */

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';
const BASE_ID = 'appcc1jJqJLZRcshk';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

/**
 * Make authenticated request to Airtable API
 */
async function airtableRequest(endpoint, options = {}) {
    const url = `${AIRTABLE_API_BASE}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Airtable API error: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Get all records from an Airtable table
 */
async function getAllAirtableRecords(tableName) {
    console.log(`📊 Fetching all records from Airtable table: ${tableName}`);
    let allRecords = [];
    let offset = null;
    
    do {
        try {
            const params = new URLSearchParams();
            params.append('pageSize', '100');
            if (offset) params.append('offset', offset);
            
            const endpoint = `/${BASE_ID}/${encodeURIComponent(tableName)}?${params.toString()}`;
            const data = await airtableRequest(endpoint);
            
            allRecords = allRecords.concat(data.records);
            offset = data.offset;
            
            console.log(`   Fetched ${data.records.length} records (total: ${allRecords.length})`);
        } catch (error) {
            console.error(`   Error fetching records: ${error.message}`);
            break;
        }
    } while (offset);
    
    return allRecords;
}

/**
 * Generate matching and update queries for companies
 */
function generateCompanyMatchingQueries(airtableCompanies) {
    console.log('\n🏢 COMPANY MATCHING AND UPDATE QUERIES');
    console.log('='.repeat(60));
    
    const updateQueries = [];
    const insertQueries = [];
    
    console.log('-- Update existing companies by matching name or LinkedIn URL');
    
    for (const record of airtableCompanies.slice(0, 10)) { // Show first 10 as examples
        const fields = record.fields;
        const name = (fields['Company Name'] || '').replace(/'/g, "''");
        const website = fields['Website'] || null;
        const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
        const office = (fields['Head Office'] || '').replace(/'/g, "''");
        const industry = (fields['Industry'] || '').replace(/'/g, "''");
        const size = (fields['Company Size'] || '').replace(/'/g, "''");
        const priority = fields['Priority'] || null;
        const automationActive = fields['Automation'] ? true : false;
        const leadScore = Array.isArray(fields['Lead Score']) ? fields['Lead Score'].join(', ') : fields['Lead Score'] || null;
        const leadScoreStr = leadScore ? String(leadScore).replace(/'/g, "''") : null;
        
        // Update query - match by name or LinkedIn URL
        const updateQuery = `
-- Update company: ${name}
UPDATE companies SET 
    airtable_id = '${record.id}',
    website = ${website ? `'${website}'` : 'NULL'},
    linkedin_url = ${linkedin ? `'${linkedin}'` : 'NULL'},
    head_office = '${office}',
    industry = '${industry}',
    company_size = '${size}',
    priority = ${priority ? `'${priority}'` : 'NULL'},
    automation_active = ${automationActive},
    lead_score = ${leadScoreStr ? `'${leadScoreStr}'` : 'NULL'},
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('${name}') OR linkedin_url = '${linkedin}')
  AND airtable_id IS NULL;`;
        
        updateQueries.push(updateQuery);
        
        // Insert query for truly new records
        const insertQuery = `
-- Insert new company if no match found: ${name}
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT '${record.id}', '${name}', ${website ? `'${website}'` : 'NULL'}, ${linkedin ? `'${linkedin}'` : 'NULL'}, '${office}', '${industry}', '${size}', ${priority ? `'${priority}'` : 'NULL'}, ${automationActive}, false, ${leadScoreStr ? `'${leadScoreStr}'` : 'NULL'}, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('${name}') OR linkedin_url = '${linkedin}'
);`;
        
        insertQueries.push(insertQuery);
    }
    
    // Print sample queries
    console.log(updateQueries[0]);
    console.log(insertQueries[0]);
    
    console.log(`\n📊 Generated ${updateQueries.length} update queries and ${insertQueries.length} insert queries for companies`);
    
    return { updateQueries, insertQueries };
}

/**
 * Generate matching and update queries for people
 */
function generatePeopleMatchingQueries(airtablePeople) {
    console.log('\n👥 PEOPLE MATCHING AND UPDATE QUERIES');
    console.log('='.repeat(60));
    
    const updateQueries = [];
    const insertQueries = [];
    
    console.log('-- Update existing people by matching name, LinkedIn URL, or email');
    
    for (const record of airtablePeople.slice(0, 10)) { // Show first 10 as examples
        const fields = record.fields;
        const name = (fields['Name'] || '').replace(/'/g, "''");
        const role = (fields['Company Role'] || '').replace(/'/g, "''");
        const location = (fields['Employee Location'] || '').replace(/'/g, "''");
        const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
        const stage = mapStage(fields['Stage']);
        const confidence = fields['Confidence Level'] || null;
        const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
        const automationStarted = fields['Automation'] ? 'NOW()' : 'NULL';
        
        // Key update: Stage and automation status from Airtable
        const updateQuery = `
-- Update person: ${name} (Stage: ${fields['Stage']} -> ${stage})
UPDATE people SET 
    airtable_id = '${record.id}',
    company_role = '${role}',
    employee_location = '${location}',
    stage = '${stage}',
    confidence_level = ${confidence ? `'${confidence}'` : 'NULL'},
    lead_source = '${leadSource}',
    automation_started_at = ${automationStarted},
    linkedin_request_message = ${fields['LinkedIn Request Message'] ? `'${fields['LinkedIn Request Message'].replace(/'/g, "''")}'` : 'NULL'},
    linkedin_follow_up_message = ${fields['LinkedIn Follow Up Message'] ? `'${fields['LinkedIn Follow Up Message'].replace(/'/g, "''")}'` : 'NULL'},
    linkedin_connected_message = ${fields['LinkedIn Connected Message'] ? `'${fields['LinkedIn Connected Message'].replace(/'/g, "''")}'` : 'NULL'},
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('${name}') OR linkedin_url = '${linkedin}')
  AND airtable_id IS NULL;`;
        
        updateQueries.push(updateQuery);
        
        // Insert query for truly new people
        const insertQuery = `
-- Insert new person if no match found: ${name}
INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT '${record.id}', '${name}', '${role}', '${location}', ${linkedin ? `'${linkedin}'` : 'NULL'}, '${stage}', ${confidence ? `'${confidence}'` : 'NULL'}, '${leadSource}', ${automationStarted}, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('${name}') OR linkedin_url = '${linkedin}'
);`;
        
        insertQueries.push(insertQuery);
    }
    
    // Print sample queries
    console.log(updateQueries[0]);
    console.log(insertQueries[0]);
    
    console.log(`\n📊 Generated ${updateQueries.length} update queries and ${insertQueries.length} insert queries for people`);
    
    return { updateQueries, insertQueries };
}

/**
 * Generate matching and update queries for jobs
 */
function generateJobsMatchingQueries(airtableJobs) {
    console.log('\n💼 JOBS MATCHING AND UPDATE QUERIES');
    console.log('='.repeat(60));
    
    const updateQueries = [];
    const insertQueries = [];
    
    console.log('-- Update existing jobs by matching title and company');
    
    for (const record of airtableJobs.slice(0, 10)) { // Show first 10 as examples
        const fields = record.fields;
        const title = (fields['Job Title'] || '').replace(/'/g, "''");
        const url = fields['Job URL'] || null;
        const location = (fields['Job Location'] || '').replace(/'/g, "''");
        const priority = fields['Priority'] || null;
        const employmentType = fields['Employment Type'] || null;
        const seniority = (fields['Seniority Level'] || '').replace(/'/g, "''");
        const functionField = (fields['Function'] || '').replace(/'/g, "''");
        const automationActive = fields['Automation'] ? true : false;
        const leadScore = typeof fields['Lead Score'] === 'number' ? fields['Lead Score'] : null;
        
        // Update query - match by title and URL
        const updateQuery = `
-- Update job: ${title}
UPDATE jobs SET 
    airtable_id = '${record.id}',
    job_url = ${url ? `'${url}'` : 'NULL'},
    location = '${location}',
    priority = ${priority ? `'${priority}'` : 'NULL'},
    employment_type = ${employmentType ? `'${employmentType.toLowerCase()}'` : 'NULL'},
    seniority_level = '${seniority}',
    function = '${functionField}',
    automation_active = ${automationActive},
    lead_score_job = ${leadScore},
    updated_at = NOW()
WHERE LOWER(title) = LOWER('${title}')
  AND airtable_id IS NULL;`;
        
        updateQueries.push(updateQuery);
        
        // Insert query for truly new jobs
        const insertQuery = `
-- Insert new job if no match found: ${title}
INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, automation_active, lead_score_job, created_at, updated_at)
SELECT '${record.id}', '${title}', ${url ? `'${url}'` : 'NULL'}, '${location}', ${priority ? `'${priority}'` : 'NULL'}, ${employmentType ? `'${employmentType.toLowerCase()}'` : 'NULL'}, '${seniority}', '${functionField}', ${automationActive}, ${leadScore}, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('${title}')
);`;
        
        insertQueries.push(insertQuery);
    }
    
    // Print sample queries
    console.log(updateQueries[0]);
    console.log(insertQueries[0]);
    
    console.log(`\n📊 Generated ${updateQueries.length} update queries and ${insertQueries.length} insert queries for jobs`);
    
    return { updateQueries, insertQueries };
}

/**
 * Generate cleanup queries to remove unmatched records
 */
function generateCleanupQueries(airtableCompanies, airtablePeople, airtableJobs) {
    console.log('\n🧹 CLEANUP QUERIES');
    console.log('='.repeat(60));
    
    // Get all Airtable names/identifiers for matching
    const companyNames = airtableCompanies.map(r => `'${(r.fields['Company Name'] || '').replace(/'/g, "''")}'`).join(', ');
    const peopleNames = airtablePeople.map(r => `'${(r.fields['Name'] || '').replace(/'/g, "''")}'`).join(', ');
    const jobTitles = airtableJobs.map(r => `'${(r.fields['Job Title'] || '').replace(/'/g, "''")}'`).join(', ');
    
    const cleanupQueries = [
        `-- Remove companies not in Airtable (but keep those without airtable_id as they might be manually added)
DELETE FROM companies 
WHERE airtable_id IS NOT NULL 
  AND LOWER(name) NOT IN (${companyNames.toLowerCase()});`,
        
        `-- Remove people not in Airtable
DELETE FROM people 
WHERE airtable_id IS NOT NULL 
  AND LOWER(name) NOT IN (${peopleNames.toLowerCase()});`,
        
        `-- Remove jobs not in Airtable
DELETE FROM jobs 
WHERE airtable_id IS NOT NULL 
  AND LOWER(title) NOT IN (${jobTitles.toLowerCase()});`
    ];
    
    cleanupQueries.forEach(query => console.log(query + '\n'));
    
    return cleanupQueries;
}

/**
 * Map Airtable stage to Supabase stage enum
 */
function mapStage(airtableStage) {
    const stageMapping = {
        'NEW': 'new',
        'CONNECT SENT': 'connection_requested',
        'CONNECTED': 'connected',
        'MESSAGED': 'messaged',
        'REPLIED': 'replied',
        'MEETING BOOKED': 'meeting_booked',
        'MEETING HELD': 'meeting_held',
        'DISQUALIFIED': 'disqualified',
        'IN QUEUE': 'in queue',
        'LEAD LOST': 'lead_lost'
    };
    
    return stageMapping[airtableStage] || 'new';
}

/**
 * Main matching and update function
 */
async function executeMatchingSync() {
    console.log('🚀 Starting Airtable to Supabase MATCHING and UPDATE sync...\n');
    
    try {
        // Get all Airtable data
        const [airtableCompanies, airtablePeople, airtableJobs] = await Promise.all([
            getAllAirtableRecords('Company'),
            getAllAirtableRecords('People'),
            getAllAirtableRecords('Jobs')
        ]);
        
        console.log(`\n📊 Airtable Data Summary:`);
        console.log(`   Companies: ${airtableCompanies.length}`);
        console.log(`   People: ${airtablePeople.length}`);
        console.log(`   Jobs: ${airtableJobs.length}`);
        
        // Generate matching queries
        const companyQueries = generateCompanyMatchingQueries(airtableCompanies);
        const peopleQueries = generatePeopleMatchingQueries(airtablePeople);
        const jobQueries = generateJobsMatchingQueries(airtableJobs);
        
        // Generate cleanup queries
        const cleanupQueries = generateCleanupQueries(airtableCompanies, airtablePeople, airtableJobs);
        
        // Save all queries to file
        const allQueries = [
            '-- AIRTABLE TO SUPABASE MATCHING AND UPDATE SYNC',
            '-- Generated: ' + new Date().toISOString(),
            '-- Strategy: Match existing records and update automation/stage status',
            '',
            '-- COMPANY UPDATE QUERIES',
            ...companyQueries.updateQueries,
            '',
            '-- COMPANY INSERT QUERIES (for truly new records)',
            ...companyQueries.insertQueries,
            '',
            '-- PEOPLE UPDATE QUERIES (includes stage and automation updates)',
            ...peopleQueries.updateQueries,
            '',
            '-- PEOPLE INSERT QUERIES (for truly new records)',
            ...peopleQueries.insertQueries,
            '',
            '-- JOB UPDATE QUERIES',
            ...jobQueries.updateQueries,
            '',
            '-- JOB INSERT QUERIES (for truly new records)',
            ...jobQueries.insertQueries,
            '',
            '-- CLEANUP QUERIES (remove records not in Airtable)',
            ...cleanupQueries
        ];
        
        const queryContent = allQueries.join('\n\n');
        
        // Write to file
        const fs = await import('fs');
        fs.writeFileSync('matching-sync-queries.sql', queryContent);
        
        console.log('\n✅ All matching and update queries saved to matching-sync-queries.sql');
        console.log(`📊 Total queries generated: ${companyQueries.updateQueries.length + companyQueries.insertQueries.length + peopleQueries.updateQueries.length + peopleQueries.insertQueries.length + jobQueries.updateQueries.length + jobQueries.insertQueries.length + cleanupQueries.length}`);
        
        console.log('\n🎯 SYNC STRATEGY SUMMARY:');
        console.log('1. UPDATE existing records by matching name/LinkedIn/email');
        console.log('2. Focus on automation status and stage updates from Airtable');
        console.log('3. INSERT only truly new records that have no match');
        console.log('4. CLEANUP records that exist in Supabase but not in Airtable');
        
        return {
            companies: airtableCompanies.length,
            people: airtablePeople.length,
            jobs: airtableJobs.length,
            totalQueries: companyQueries.updateQueries.length + companyQueries.insertQueries.length + peopleQueries.updateQueries.length + peopleQueries.insertQueries.length + jobQueries.updateQueries.length + jobQueries.insertQueries.length + cleanupQueries.length
        };
        
    } catch (error) {
        console.error(`❌ Matching sync error: ${error.message}`);
        throw error;
    }
}

// Run the matching sync
executeMatchingSync()
    .then(results => {
        console.log('\n🎉 Matching and update sync preparation completed!');
        console.log('Execute the queries in matching-sync-queries.sql to complete the sync.');
    })
    .catch(error => {
        console.error('❌ Matching sync failed:', error.message);
        process.exit(1);
    });
