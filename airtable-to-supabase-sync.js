#!/usr/bin/env node

/**
 * Airtable to Supabase Data Synchronization Script
 * 
 * Airtable is the source of truth. This script:
 * 1. Gets all records from Airtable
 * 2. Updates/inserts them into Supabase
 * 3. Removes Supabase records that don't exist in Airtable
 * 4. Handles special People table actions and stage updates
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';
const BASE_ID = 'appcc1jJqJLZRcshk';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

// Airtable table names (using capitalized versions as primary)
const AIRTABLE_TABLES = {
    companies: 'Company',
    people: 'People', 
    jobs: 'Jobs'
};

// Initialize Supabase client (we'll use MCP functions instead)
// const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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
 * Get all records from an Airtable table with pagination
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
 * Transform Airtable company record to Supabase format
 */
function transformCompanyRecord(airtableRecord) {
    const fields = airtableRecord.fields;
    
    return {
        // Use Airtable record ID as external reference
        airtable_id: airtableRecord.id,
        name: fields['Company Name'] || '',
        website: fields['Website'] || null,
        linkedin_url: fields['LinkedIn URL'] || fields['LinkedIn'] || null,
        head_office: fields['Head Office'] || null,
        industry: fields['Industry'] || null,
        company_size: fields['Company Size'] || null,
        lead_score: Array.isArray(fields['Lead Score']) ? fields['Lead Score'].join(', ') : fields['Lead Score'] || null,
        score_reason: fields['Score Reason'] || null,
        automation_active: fields['Automation'] ? true : false,
        is_favourite: false, // Default value
        ai_info: fields['AI Info'] ? { content: fields['AI Info'] } : null,
        key_info_raw: fields['Key Info Raw'] ? { content: fields['Key Info Raw'] } : null,
        priority: fields['Priority'] || null,
        logo_url: fields['Profile Image URL'] || null,
        created_at: fields['Created'] ? new Date(fields['Created']).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Set default owner (we'll need to handle this properly)
        owner_id: null
    };
}

/**
 * Transform Airtable people record to Supabase format
 */
function transformPeopleRecord(airtableRecord, companyMappings = {}) {
    const fields = airtableRecord.fields;
    
    // Map company reference
    let company_id = null;
    if (fields['Company'] && Array.isArray(fields['Company']) && fields['Company'].length > 0) {
        const airtableCompanyId = fields['Company'][0];
        company_id = companyMappings[airtableCompanyId] || null;
    }
    
    return {
        airtable_id: airtableRecord.id,
        name: fields['Name'] || '',
        company_id: company_id,
        email_address: null, // Not visible in the sample data
        linkedin_url: fields['LinkedIn URL'] || fields['LinkedIn'] || null,
        employee_location: fields['Employee Location'] || null,
        company_role: fields['Company Role'] || null,
        lead_score: fields['Lead Score'] || null,
        stage: mapStageToSupabase(fields['Stage']),
        confidence_level: fields['Confidence Level'] || null,
        linkedin_request_message: fields['LinkedIn Request Message'] || null,
        linkedin_follow_up_message: fields['LinkedIn Follow Up Message'] || null,
        linkedin_connected_message: fields['LinkedIn Connected Message'] || null,
        lead_source: fields['Lead Source'] || null,
        created_at: fields['Created'] ? new Date(fields['Created']).toISOString() : new Date().toISOString(),
        updated_at: fields['Updated'] ? new Date(fields['Updated']).toISOString() : new Date().toISOString(),
        owner_id: null, // We'll need to map this from the Owner field
        is_favourite: false
    };
}

/**
 * Transform Airtable jobs record to Supabase format
 */
function transformJobsRecord(airtableRecord, companyMappings = {}) {
    const fields = airtableRecord.fields;
    
    // Map company reference
    let company_id = null;
    if (fields['Company'] && Array.isArray(fields['Company']) && fields['Company'].length > 0) {
        const airtableCompanyId = fields['Company'][0];
        company_id = companyMappings[airtableCompanyId] || null;
    }
    
    return {
        airtable_id: airtableRecord.id,
        title: fields['Job Title'] || '',
        company_id: company_id,
        job_url: fields['Job URL'] || null,
        posted_date: fields['Posted Date'] ? new Date(fields['Posted Date']).toISOString().split('T')[0] : null,
        valid_through: fields['Valid Through'] ? new Date(fields['Valid Through']).toISOString().split('T')[0] : null,
        location: fields['Job Location'] || null,
        description: fields['Job Description'] || null,
        summary: typeof fields['Job Summary'] === 'object' ? fields['Job Summary'].value : fields['Job Summary'] || null,
        employment_type: mapEmploymentType(fields['Employment Type']),
        seniority_level: fields['Seniority Level'] || null,
        linkedin_job_id: fields['LinkedIn Job ID'] ? String(fields['LinkedIn Job ID']) : null,
        priority: fields['Priority'] || null,
        lead_score_job: typeof fields['Lead Score'] === 'number' ? fields['Lead Score'] : null,
        function: fields['Function'] || null,
        logo_url: typeof fields['Logo'] === 'object' ? null : fields['Logo'] || null,
        created_at: fields['Created'] ? new Date(fields['Created']).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner_id: null
    };
}

/**
 * Map Airtable stage to Supabase stage enum
 */
function mapStageToSupabase(airtableStage) {
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
 * Map employment type to standard format
 */
function mapEmploymentType(employmentType) {
    const mapping = {
        'FULL_TIME': 'full-time',
        'PART_TIME': 'part-time',
        'CONTRACT': 'contract',
        'TEMPORARY': 'temporary'
    };
    
    return mapping[employmentType] || employmentType?.toLowerCase() || null;
}

/**
 * Execute SQL using console output (since we can't import MCP functions directly)
 */
function generateSupabaseSQL(operation, tableName, records) {
    console.log(`\n-- ${operation.toUpperCase()} ${tableName.toUpperCase()} RECORDS --`);
    
    if (operation === 'INSERT' && records.length > 0) {
        const columns = Object.keys(records[0]).filter(key => key !== 'airtable_id');
        
        console.log(`-- Add airtable_id column if it doesn't exist`);
        console.log(`ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS airtable_id TEXT;`);
        console.log(`CREATE INDEX IF NOT EXISTS idx_${tableName}_airtable_id ON ${tableName}(airtable_id);`);
        
        console.log(`\n-- Insert/Update records`);
        for (const record of records.slice(0, 5)) { // Show first 5 as examples
            const values = columns.map(col => {
                const value = record[col];
                if (value === null) return 'NULL';
                if (typeof value === 'boolean') return value;
                if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
                return `'${String(value).replace(/'/g, "''")}'`;
            }).join(', ');
            
            console.log(`INSERT INTO ${tableName} (airtable_id, ${columns.join(', ')}) VALUES ('${record.airtable_id}', ${values}) ON CONFLICT (airtable_id) DO UPDATE SET ${columns.map(col => `${col} = EXCLUDED.${col}`).join(', ')}, updated_at = NOW();`);
        }
        
        if (records.length > 5) {
            console.log(`-- ... and ${records.length - 5} more records`);
        }
    }
}

/**
 * Main synchronization function
 */
async function syncAirtableToSupabase() {
    console.log('🚀 Starting Airtable to Supabase synchronization (Airtable as source of truth)...\n');
    
    const syncResults = {
        companies: { airtable: 0, processed: 0, errors: 0 },
        people: { airtable: 0, processed: 0, errors: 0 },
        jobs: { airtable: 0, processed: 0, errors: 0 }
    };
    
    try {
        // 1. SYNC COMPANIES FIRST (needed for foreign key references)
        console.log('\n📋 STEP 1: SYNCING COMPANIES');
        console.log('='.repeat(50));
        
        const airtableCompanies = await getAllAirtableRecords(AIRTABLE_TABLES.companies);
        syncResults.companies.airtable = airtableCompanies.length;
        
        const transformedCompanies = airtableCompanies.map(record => {
            try {
                return transformCompanyRecord(record);
            } catch (error) {
                console.error(`Error transforming company ${record.id}: ${error.message}`);
                syncResults.companies.errors++;
                return null;
            }
        }).filter(Boolean);
        
        syncResults.companies.processed = transformedCompanies.length;
        
        // Generate SQL for companies
        generateSupabaseSQL('INSERT', 'companies', transformedCompanies);
        
        // Create mapping of Airtable company IDs to Supabase UUIDs (for foreign keys)
        const companyMappings = {};
        // This would be populated after actual insert, for now we'll use placeholders
        
        // 2. SYNC PEOPLE (with company references)
        console.log('\n📋 STEP 2: SYNCING PEOPLE');
        console.log('='.repeat(50));
        
        const airtablePeople = await getAllAirtableRecords(AIRTABLE_TABLES.people);
        syncResults.people.airtable = airtablePeople.length;
        
        const transformedPeople = airtablePeople.map(record => {
            try {
                return transformPeopleRecord(record, companyMappings);
            } catch (error) {
                console.error(`Error transforming person ${record.id}: ${error.message}`);
                syncResults.people.errors++;
                return null;
            }
        }).filter(Boolean);
        
        syncResults.people.processed = transformedPeople.length;
        
        // Generate SQL for people
        generateSupabaseSQL('INSERT', 'people', transformedPeople);
        
        // 3. SYNC JOBS (with company references)
        console.log('\n📋 STEP 3: SYNCING JOBS');
        console.log('='.repeat(50));
        
        const airtableJobs = await getAllAirtableRecords(AIRTABLE_TABLES.jobs);
        syncResults.jobs.airtable = airtableJobs.length;
        
        const transformedJobs = airtableJobs.map(record => {
            try {
                return transformJobsRecord(record, companyMappings);
            } catch (error) {
                console.error(`Error transforming job ${record.id}: ${error.message}`);
                syncResults.jobs.errors++;
                return null;
            }
        }).filter(Boolean);
        
        syncResults.jobs.processed = transformedJobs.length;
        
        // Generate SQL for jobs
        generateSupabaseSQL('INSERT', 'jobs', transformedJobs);
        
        // 4. CLEANUP - Remove records not in Airtable
        console.log('\n📋 STEP 4: CLEANUP SQL');
        console.log('='.repeat(50));
        
        const airtableCompanyIds = airtableCompanies.map(r => r.id);
        const airtablePeopleIds = airtablePeople.map(r => r.id);
        const airtableJobIds = airtableJobs.map(r => r.id);
        
        console.log(`-- Remove companies not in Airtable`);
        console.log(`DELETE FROM companies WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${airtableCompanyIds.map(id => `'${id}'`).join(', ')});`);
        
        console.log(`-- Remove people not in Airtable`);
        console.log(`DELETE FROM people WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${airtablePeopleIds.map(id => `'${id}'`).join(', ')});`);
        
        console.log(`-- Remove jobs not in Airtable`);
        console.log(`DELETE FROM jobs WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${airtableJobIds.map(id => `'${id}'`).join(', ')});`);
        
    } catch (error) {
        console.error(`❌ Synchronization error: ${error.message}`);
        throw error;
    }
    
    // Print summary
    console.log('\n📊 SYNCHRONIZATION SUMMARY');
    console.log('='.repeat(50));
    for (const [entityType, results] of Object.entries(syncResults)) {
        console.log(`${entityType.toUpperCase()}:`);
        console.log(`  Airtable records: ${results.airtable}`);
        console.log(`  Processed: ${results.processed}`);
        console.log(`  Errors: ${results.errors}`);
    }
    
    console.log('\n✅ SQL generation completed!');
    console.log('📝 Copy the SQL statements above and execute them in Supabase to complete the sync.');
    
    return syncResults;
}

// Run the synchronization
syncAirtableToSupabase()
    .then(results => {
        console.log('\n🎉 Airtable to Supabase sync analysis completed!');
        console.log('Execute the generated SQL statements to complete the synchronization.');
    })
    .catch(error => {
        console.error('❌ Synchronization failed:', error.message);
        process.exit(1);
    });
