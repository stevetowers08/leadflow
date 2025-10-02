#!/usr/bin/env node

/**
 * Execute Batch Sync to Supabase
 * 
 * This script executes the sync in small batches to avoid query size limits
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
 * Generate simple insert queries for manual execution
 */
async function generateSimpleInserts() {
    console.log('🚀 Generating simple insert queries for manual execution...\n');
    
    try {
        // Get companies
        const companies = await getAllAirtableRecords('Company');
        console.log(`\n-- COMPANIES (${companies.length} records)`);
        console.log('-- Sample company inserts:');
        
        for (let i = 0; i < Math.min(5, companies.length); i++) {
            const record = companies[i];
            const fields = record.fields;
            
            const name = (fields['Company Name'] || '').replace(/'/g, "''");
            const website = fields['Website'] || null;
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            const office = (fields['Head Office'] || '').replace(/'/g, "''");
            const industry = (fields['Industry'] || '').replace(/'/g, "''");
            const size = (fields['Company Size'] || '').replace(/'/g, "''");
            const priority = fields['Priority'] || null;
            
            console.log(`INSERT INTO companies (airtable_id, name, website, linkedin_url, head_office, industry, company_size, priority, automation_active, is_favourite, created_at, updated_at) VALUES ('${record.id}', '${name}', ${website ? `'${website}'` : 'NULL'}, ${linkedin ? `'${linkedin}'` : 'NULL'}, '${office}', '${industry}', '${size}', ${priority ? `'${priority}'` : 'NULL'}, ${fields['Automation'] ? 'true' : 'false'}, false, NOW(), NOW()) ON CONFLICT (airtable_id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();`);
        }
        
        // Get people
        const people = await getAllAirtableRecords('People');
        console.log(`\n-- PEOPLE (${people.length} records)`);
        console.log('-- Sample people inserts:');
        
        for (let i = 0; i < Math.min(5, people.length); i++) {
            const record = people[i];
            const fields = record.fields;
            
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const role = (fields['Company Role'] || '').replace(/'/g, "''");
            const location = (fields['Employee Location'] || '').replace(/'/g, "''");
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            const stage = mapStage(fields['Stage']);
            const confidence = fields['Confidence Level'] || null;
            const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
            
            console.log(`INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, is_favourite, created_at, updated_at) VALUES ('${record.id}', '${name}', '${role}', '${location}', ${linkedin ? `'${linkedin}'` : 'NULL'}, '${stage}', ${confidence ? `'${confidence}'` : 'NULL'}, '${leadSource}', false, NOW(), NOW()) ON CONFLICT (airtable_id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();`);
        }
        
        // Get jobs
        const jobs = await getAllAirtableRecords('Jobs');
        console.log(`\n-- JOBS (${jobs.length} records)`);
        console.log('-- Sample job inserts:');
        
        for (let i = 0; i < Math.min(5, jobs.length); i++) {
            const record = jobs[i];
            const fields = record.fields;
            
            const title = (fields['Job Title'] || '').replace(/'/g, "''");
            const url = fields['Job URL'] || null;
            const location = (fields['Job Location'] || '').replace(/'/g, "''");
            const priority = fields['Priority'] || null;
            const employmentType = fields['Employment Type'] || null;
            const seniority = (fields['Seniority Level'] || '').replace(/'/g, "''");
            const functionField = (fields['Function'] || '').replace(/'/g, "''");
            
            console.log(`INSERT INTO jobs (airtable_id, title, job_url, location, priority, employment_type, seniority_level, function, created_at, updated_at) VALUES ('${record.id}', '${title}', ${url ? `'${url}'` : 'NULL'}, '${location}', ${priority ? `'${priority}'` : 'NULL'}, ${employmentType ? `'${employmentType.toLowerCase()}'` : 'NULL'}, '${seniority}', '${functionField}', NOW(), NOW()) ON CONFLICT (airtable_id) DO UPDATE SET title = EXCLUDED.title, updated_at = NOW();`);
        }
        
        // Generate cleanup queries
        console.log('\n-- CLEANUP QUERIES');
        const companyIds = companies.map(r => `'${r.id}'`).join(', ');
        const peopleIds = people.map(r => `'${r.id}'`).join(', ');
        const jobIds = jobs.map(r => `'${r.id}'`).join(', ');
        
        console.log(`DELETE FROM companies WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${companyIds});`);
        console.log(`DELETE FROM people WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${peopleIds});`);
        console.log(`DELETE FROM jobs WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${jobIds});`);
        
        console.log('\n✅ Sample queries generated!');
        console.log(`📊 Total records: Companies(${companies.length}), People(${people.length}), Jobs(${jobs.length})`);
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

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

// Run the generator
generateSimpleInserts();
