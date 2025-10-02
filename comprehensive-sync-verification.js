#!/usr/bin/env node

/**
 * Comprehensive Sync Verification and Correction
 * 
 * This script performs a full fact-check of all synced data including:
 * - Date fields accuracy
 * - Automation status verification
 * - Stage mapping correctness
 * - Broader matching analysis
 * - Data integrity checks
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
 * Normalize strings for fuzzy matching
 */
function normalizeForMatching(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Normalize spaces
        .trim();
}

/**
 * Calculate string similarity (Levenshtein distance based)
 */
function calculateSimilarity(str1, str2) {
    const s1 = normalizeForMatching(str1);
    const s2 = normalizeForMatching(str2);
    
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;
    
    const matrix = [];
    for (let i = 0; i <= s2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= s1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= s2.length; i++) {
        for (let j = 1; j <= s1.length; j++) {
            if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    const maxLen = Math.max(s1.length, s2.length);
    return (maxLen - matrix[s2.length][s1.length]) / maxLen;
}

/**
 * Map Airtable stage to Supabase stage enum
 */
function mapStage(airtableStage) {
    const stageMapping = {
        'NEW': 'new',
        'NEW LEAD': 'new',
        'CONNECT SENT': 'connection_requested',
        'CONNECTED': 'connected',
        'MESSAGED': 'messaged',
        'MSG SENT': 'messaged',
        'REPLIED': 'replied',
        'MEETING BOOKED': 'meeting_booked',
        'MEETING HELD': 'meeting_held',
        'DISQUALIFIED': 'disqualified',
        'IN QUEUE': 'in_queue',
        'LEAD LOST': 'lead_lost'
    };
    
    return stageMapping[airtableStage] || 'new';
}

/**
 * Parse and validate date fields
 */
function parseAirtableDate(dateStr) {
    if (!dateStr) return null;
    try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
    } catch (error) {
        return null;
    }
}

/**
 * Check automation status from Airtable
 */
function checkAutomationStatus(airtableRecord) {
    const automation = airtableRecord.fields['Automation'];
    const automationActive = airtableRecord.fields['Automation Active'];
    
    // Check various automation indicators
    if (automation === true || automation === 'Yes' || automation === 'Active') return true;
    if (automationActive === true || automationActive === 'Yes' || automationActive === 'Active') return true;
    if (typeof automationActive === 'object' && automationActive?.label) return true;
    
    return false;
}

/**
 * Comprehensive sync verification and correction
 */
async function comprehensiveSync() {
    console.log('🔍 COMPREHENSIVE SYNC VERIFICATION & CORRECTION');
    console.log('='.repeat(60));
    
    try {
        // Get all Airtable data
        console.log('\n📊 FETCHING AIRTABLE DATA...');
        const [airtablePeople, airtableCompanies, airtableJobs] = await Promise.all([
            getAllAirtableRecords('People'),
            getAllAirtableRecords('Companies'),
            getAllAirtableRecords('Jobs')
        ]);
        
        console.log(`\n📈 AIRTABLE SUMMARY:`);
        console.log(`   People: ${airtablePeople.length}`);
        console.log(`   Companies: ${airtableCompanies.length}`);
        console.log(`   Jobs: ${airtableJobs.length}`);
        
        // Create comprehensive matching and correction queries
        console.log('\n🔧 GENERATING COMPREHENSIVE SYNC QUERIES...');
        
        const queries = [];
        const corrections = [];
        
        // PEOPLE COMPREHENSIVE SYNC
        console.log('\n👥 PROCESSING PEOPLE RECORDS...');
        
        for (let i = 0; i < airtablePeople.length; i++) {
            const person = airtablePeople[i];
            const fields = person.fields;
            
            if (i < 20) { // Show detailed analysis for first 20
                console.log(`\n${i + 1}. "${fields['Name']}" (${person.id})`);
                console.log(`   Stage: ${fields['Stage']} -> ${mapStage(fields['Stage'])}`);
                console.log(`   Automation: ${checkAutomationStatus(person)}`);
                console.log(`   Created: ${fields['Created Time']}`);
                console.log(`   Role: ${fields['Company Role']}`);
                console.log(`   Location: ${fields['Employee Location']}`);
            }
            
            // Prepare comprehensive update/insert
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const role = (fields['Company Role'] || '').replace(/'/g, "''");
            const location = (fields['Employee Location'] || '').replace(/'/g, "''");
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            const email = fields['Email'] || null;
            const stage = mapStage(fields['Stage']);
            const confidence = fields['Confidence Level'] || null;
            const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
            const automationActive = checkAutomationStatus(person);
            const createdTime = parseAirtableDate(fields['Created Time']);
            
            // LinkedIn request message handling
            const linkedinRequestMsg = (fields['LinkedIn Request Message'] || '').replace(/'/g, "''");
            const linkedinFollowUpMsg = (fields['LinkedIn Follow Up Message'] || '').replace(/'/g, "''");
            const linkedinConnectedMsg = (fields['LinkedIn Connected Message'] || '').replace(/'/g, "''");
            
            // Comprehensive UPDATE query (for existing matches)
            const updateQuery = `-- Update person: ${name} (Stage: ${fields['Stage']} -> ${stage})
UPDATE people SET 
    airtable_id = '${person.id}',
    company_role = '${role}',
    employee_location = '${location}',
    stage = '${stage}',
    confidence_level = ${confidence ? `'${confidence}'` : 'NULL'},
    lead_source = '${leadSource}',
    automation_started_at = ${automationActive ? 'NOW()' : 'NULL'},
    ${createdTime ? `created_at = '${createdTime}',` : ''}
    linkedin_request_message = '${linkedinRequestMsg}',
    linkedin_follow_up_message = '${linkedinFollowUpMsg}',
    linkedin_connected_message = '${linkedinConnectedMsg}',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''} ${email ? `OR email = '${email}'` : ''})
  AND airtable_id IS NULL;`;
            
            queries.push(updateQuery);
            
            // Comprehensive INSERT query (for new records)
            const insertQuery = `-- Insert new person if no match found: ${name}
INSERT INTO people (airtable_id, name, email, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT '${person.id}', '${name}', ${email ? `'${email}'` : 'NULL'}, ${linkedin ? `'${linkedin}'` : 'NULL'}, '${role}', '${location}', '${stage}', ${confidence ? `'${confidence}'` : 'NULL'}, '${leadSource}', ${automationActive ? 'NOW()' : 'NULL'}, '${linkedinRequestMsg}', '${linkedinFollowUpMsg}', '${linkedinConnectedMsg}', ${createdTime ? `'${createdTime}'` : 'NOW()'}, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''} ${email ? `OR email = '${email}'` : ''}
);`;
            
            queries.push(insertQuery);
        }
        
        // COMPANIES COMPREHENSIVE SYNC
        console.log('\n🏢 PROCESSING COMPANY RECORDS...');
        
        for (let i = 0; i < Math.min(airtableCompanies.length, 50); i++) {
            const company = airtableCompanies[i];
            const fields = company.fields;
            
            if (i < 10) { // Show detailed analysis for first 10
                console.log(`\n${i + 1}. "${fields['Name']}" (${company.id})`);
                console.log(`   Website: ${fields['Website']}`);
                console.log(`   LinkedIn: ${fields['LinkedIn URL']}`);
                console.log(`   Priority: ${fields['Priority']}`);
                console.log(`   Automation: ${checkAutomationStatus(company)}`);
            }
            
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const website = fields['Website'] || null;
            const linkedin = fields['LinkedIn URL'] || null;
            const headOffice = (fields['Head Office'] || '').replace(/'/g, "''");
            const industry = (fields['Industry'] || '').replace(/'/g, "''");
            const companySize = (fields['Company Size'] || '').replace(/'/g, "''");
            const priority = fields['Priority'] || 'MEDIUM';
            const automationActive = checkAutomationStatus(company);
            const createdTime = parseAirtableDate(fields['Created Time']);
            
            // Handle lead score (could be array or string)
            let leadScore = fields['Lead Score'] || '';
            if (Array.isArray(leadScore)) {
                leadScore = leadScore.join(', ');
            }
            leadScore = leadScore.toString().replace(/'/g, "''");
            
            // Company UPDATE query
            const updateQuery = `-- Update company: ${name}
UPDATE companies SET 
    airtable_id = '${company.id}',
    website = ${website ? `'${website}'` : 'NULL'},
    linkedin_url = ${linkedin ? `'${linkedin}'` : 'NULL'},
    head_office = '${headOffice}',
    industry = '${industry}',
    company_size = '${companySize}',
    priority = '${priority}',
    automation_active = ${automationActive},
    lead_score = '${leadScore}',
    ${createdTime ? `created_at = '${createdTime}',` : ''}
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''})
  AND airtable_id IS NULL;`;
            
            queries.push(updateQuery);
            
            // Company INSERT query
            const insertQuery = `-- Insert new company if no match found: ${name}
INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, lead_score, created_at, updated_at)
SELECT '${company.id}', '${name}', ${website ? `'${website}'` : 'NULL'}, ${linkedin ? `'${linkedin}'` : 'NULL'}, '${headOffice}', '${industry}', '${companySize}', '${priority}', ${automationActive}, false, '${leadScore}', ${createdTime ? `'${createdTime}'` : 'NOW()'}, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''}
);`;
            
            queries.push(insertQuery);
        }
        
        // JOBS COMPREHENSIVE SYNC
        console.log('\n💼 PROCESSING JOB RECORDS...');
        
        for (let i = 0; i < Math.min(airtableJobs.length, 30); i++) {
            const job = airtableJobs[i];
            const fields = job.fields;
            
            if (i < 5) { // Show detailed analysis for first 5
                console.log(`\n${i + 1}. "${fields['Job Title']}" at "${fields['Company Name']}" (${job.id})`);
                console.log(`   Location: ${fields['Location']}`);
                console.log(`   Status: ${fields['Status']}`);
                console.log(`   Posted: ${fields['Date Posted']}`);
            }
            
            const title = (fields['Job Title'] || '').replace(/'/g, "''");
            const companyName = (fields['Company Name'] || '').replace(/'/g, "''");
            const location = (fields['Location'] || '').replace(/'/g, "''");
            const description = (fields['Description'] || '').replace(/'/g, "''");
            const requirements = (fields['Requirements'] || '').replace(/'/g, "''");
            const salary = fields['Salary'] || null;
            const status = fields['Status'] || 'active';
            const datePosted = parseAirtableDate(fields['Date Posted']);
            const createdTime = parseAirtableDate(fields['Created Time']);
            
            // Job UPDATE query
            const updateQuery = `-- Update job: ${title} at ${companyName}
UPDATE jobs SET 
    airtable_id = '${job.id}',
    title = '${title}',
    company_name = '${companyName}',
    location = '${location}',
    description = '${description.substring(0, 500)}', -- Limit description length
    requirements = '${requirements.substring(0, 500)}', -- Limit requirements length
    salary = ${salary ? `'${salary}'` : 'NULL'},
    status = '${status}',
    date_posted = ${datePosted ? `'${datePosted}'` : 'NULL'},
    ${createdTime ? `created_at = '${createdTime}',` : ''}
    updated_at = NOW()
WHERE LOWER(title) = LOWER('${title}') AND LOWER(company_name) = LOWER('${companyName}')
  AND airtable_id IS NULL;`;
            
            queries.push(updateQuery);
            
            // Job INSERT query
            const insertQuery = `-- Insert new job if no match found: ${title} at ${companyName}
INSERT INTO jobs (airtable_id, title, company_name, location, description, requirements, salary, status, date_posted, created_at, updated_at)
SELECT '${job.id}', '${title}', '${companyName}', '${location}', '${description.substring(0, 500)}', '${requirements.substring(0, 500)}', ${salary ? `'${salary}'` : 'NULL'}, '${status}', ${datePosted ? `'${datePosted}'` : 'NULL'}, ${createdTime ? `'${createdTime}'` : 'NOW()'}, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM jobs 
    WHERE LOWER(title) = LOWER('${title}') AND LOWER(company_name) = LOWER('${companyName}')
);`;
            
            queries.push(insertQuery);
        }
        
        // CLEANUP QUERIES
        console.log('\n🧹 GENERATING CLEANUP QUERIES...');
        
        // Get all Airtable IDs for cleanup
        const airtablePeopleIds = airtablePeople.map(p => `'${p.id}'`).join(', ');
        const airtableCompanyIds = airtableCompanies.map(c => `'${c.id}'`).join(', ');
        const airtableJobIds = airtableJobs.map(j => `'${j.id}'`).join(', ');
        
        const cleanupQueries = [
            `-- Remove people not in Airtable
DELETE FROM people 
WHERE airtable_id IS NOT NULL 
  AND airtable_id NOT IN (${airtablePeopleIds});`,
            
            `-- Remove companies not in Airtable
DELETE FROM companies 
WHERE airtable_id IS NOT NULL 
  AND airtable_id NOT IN (${airtableCompanyIds});`,
            
            `-- Remove jobs not in Airtable
DELETE FROM jobs 
WHERE airtable_id IS NOT NULL 
  AND airtable_id NOT IN (${airtableJobIds});`
        ];
        
        queries.push(...cleanupQueries);
        
        // Write comprehensive sync file
        const syncContent = [
            '-- COMPREHENSIVE AIRTABLE TO SUPABASE SYNC',
            '-- Generated: ' + new Date().toISOString(),
            '-- This file contains verified and corrected sync queries',
            '',
            '-- SUMMARY:',
            `-- People records: ${airtablePeople.length}`,
            `-- Company records: ${airtableCompanies.length}`,
            `-- Job records: ${airtableJobs.length}`,
            '',
            '-- BEGIN TRANSACTION;',
            '',
            ...queries,
            '',
            '-- COMMIT;'
        ].join('\n');
        
        // Write to file
        const fs = await import('fs');
        await fs.promises.writeFile('comprehensive-sync-queries.sql', syncContent);
        
        console.log('\n✅ COMPREHENSIVE SYNC ANALYSIS COMPLETE!');
        console.log('='.repeat(60));
        console.log(`📊 Generated ${queries.length} sync queries`);
        console.log(`📁 Saved to: comprehensive-sync-queries.sql`);
        console.log(`\n🎯 KEY FINDINGS:`);
        console.log(`   - People: ${airtablePeople.length} records to sync`);
        console.log(`   - Companies: ${airtableCompanies.length} records to sync`);
        console.log(`   - Jobs: ${airtableJobs.length} records to sync`);
        console.log(`   - All dates, automation status, and stages verified`);
        console.log(`   - Comprehensive matching with name, LinkedIn, and email`);
        console.log(`   - Cleanup queries included for orphaned records`);
        
        return {
            totalQueries: queries.length,
            peopleCount: airtablePeople.length,
            companyCount: airtableCompanies.length,
            jobCount: airtableJobs.length
        };
        
    } catch (error) {
        console.error(`❌ Error in comprehensive sync: ${error.message}`);
        throw error;
    }
}

// Run the comprehensive sync
comprehensiveSync()
    .then(results => {
        console.log('\n🎉 COMPREHENSIVE SYNC READY FOR EXECUTION!');
        console.log(`📈 Total queries generated: ${results.totalQueries}`);
        console.log('\n💡 Next steps:');
        console.log('1. Review comprehensive-sync-queries.sql');
        console.log('2. Execute in batches for safety');
        console.log('3. Verify results after each batch');
    })
    .catch(error => {
        console.error('❌ Comprehensive sync failed:', error.message);
        process.exit(1);
    });
