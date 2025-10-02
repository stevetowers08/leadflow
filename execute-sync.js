#!/usr/bin/env node

/**
 * Execute Airtable to Supabase Sync
 * 
 * This script executes the actual synchronization by:
 * 1. Getting Airtable data
 * 2. Transforming it for Supabase
 * 3. Using batch inserts/updates
 * 4. Cleaning up orphaned records
 */

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';
const BASE_ID = 'appcc1jJqJLZRcshk';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

const AIRTABLE_TABLES = {
    companies: 'Company',
    people: 'People', 
    jobs: 'Jobs'
};

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
        is_favourite: false,
        ai_info: fields['AI Info'] ? { content: fields['AI Info'] } : null,
        key_info_raw: fields['Key Info Raw'] ? { content: fields['Key Info Raw'] } : null,
        priority: fields['Priority'] || null,
        logo_url: fields['Profile Image URL'] || null,
        created_at: fields['Created'] ? new Date(fields['Created']).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

/**
 * Transform Airtable people record to Supabase format
 */
function transformPeopleRecord(airtableRecord) {
    const fields = airtableRecord.fields;
    
    return {
        airtable_id: airtableRecord.id,
        name: fields['Name'] || '',
        email_address: null, // Not visible in sample data
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
        is_favourite: false
    };
}

/**
 * Transform Airtable jobs record to Supabase format
 */
function transformJobsRecord(airtableRecord) {
    const fields = airtableRecord.fields;
    
    return {
        airtable_id: airtableRecord.id,
        title: fields['Job Title'] || '',
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
        created_at: fields['Created'] ? new Date(fields['Created']).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
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
 * Generate batch upsert SQL for a table
 */
function generateBatchUpsertSQL(tableName, records, batchSize = 50) {
    if (records.length === 0) return [];
    
    const queries = [];
    const columns = Object.keys(records[0]).filter(key => key !== 'airtable_id');
    
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        
        const values = batch.map(record => {
            const valuesList = columns.map(col => {
                const value = record[col];
                if (value === null || value === undefined) return 'NULL';
                if (typeof value === 'boolean') return value;
                if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
                return `'${String(value).replace(/'/g, "''")}'`;
            });
            return `('${record.airtable_id}', ${valuesList.join(', ')})`;
        }).join(',\n    ');
        
        const conflictUpdate = columns.map(col => `${col} = EXCLUDED.${col}`).join(', ');
        
        const query = `
INSERT INTO ${tableName} (airtable_id, ${columns.join(', ')}) 
VALUES 
    ${values}
ON CONFLICT (airtable_id) DO UPDATE SET 
    ${conflictUpdate}, 
    updated_at = NOW();`;
        
        queries.push(query);
    }
    
    return queries;
}

/**
 * Main sync execution function
 */
async function executeSync() {
    console.log('🚀 Starting Airtable to Supabase data synchronization...\n');
    
    try {
        // 1. SYNC COMPANIES
        console.log('📋 STEP 1: SYNCING COMPANIES');
        console.log('='.repeat(50));
        
        const airtableCompanies = await getAllAirtableRecords(AIRTABLE_TABLES.companies);
        const transformedCompanies = airtableCompanies.map(transformCompanyRecord);
        
        console.log(`✅ Transformed ${transformedCompanies.length} company records`);
        
        // Generate batch SQL for companies
        const companyQueries = generateBatchUpsertSQL('companies', transformedCompanies);
        console.log(`📝 Generated ${companyQueries.length} batch queries for companies`);
        
        // Print first query as example
        if (companyQueries.length > 0) {
            console.log('\n📄 Sample company batch query:');
            console.log(companyQueries[0].substring(0, 500) + '...');
        }
        
        // 2. SYNC PEOPLE
        console.log('\n📋 STEP 2: SYNCING PEOPLE');
        console.log('='.repeat(50));
        
        const airtablePeople = await getAllAirtableRecords(AIRTABLE_TABLES.people);
        const transformedPeople = airtablePeople.map(transformPeopleRecord);
        
        console.log(`✅ Transformed ${transformedPeople.length} people records`);
        
        const peopleQueries = generateBatchUpsertSQL('people', transformedPeople);
        console.log(`📝 Generated ${peopleQueries.length} batch queries for people`);
        
        // 3. SYNC JOBS
        console.log('\n📋 STEP 3: SYNCING JOBS');
        console.log('='.repeat(50));
        
        const airtableJobs = await getAllAirtableRecords(AIRTABLE_TABLES.jobs);
        const transformedJobs = airtableJobs.map(transformJobsRecord);
        
        console.log(`✅ Transformed ${transformedJobs.length} job records`);
        
        const jobQueries = generateBatchUpsertSQL('jobs', transformedJobs);
        console.log(`📝 Generated ${jobQueries.length} batch queries for jobs`);
        
        // 4. GENERATE CLEANUP QUERIES
        console.log('\n📋 STEP 4: GENERATING CLEANUP QUERIES');
        console.log('='.repeat(50));
        
        const airtableCompanyIds = airtableCompanies.map(r => `'${r.id}'`).join(', ');
        const airtablePeopleIds = airtablePeople.map(r => `'${r.id}'`).join(', ');
        const airtableJobIds = airtableJobs.map(r => `'${r.id}'`).join(', ');
        
        const cleanupQueries = [
            `DELETE FROM companies WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${airtableCompanyIds});`,
            `DELETE FROM people WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${airtablePeopleIds});`,
            `DELETE FROM jobs WHERE airtable_id IS NOT NULL AND airtable_id NOT IN (${airtableJobIds});`
        ];
        
        // 5. SAVE ALL QUERIES TO FILE
        console.log('\n📋 STEP 5: SAVING QUERIES TO FILE');
        console.log('='.repeat(50));
        
        const allQueries = [
            '-- AIRTABLE TO SUPABASE SYNC QUERIES',
            '-- Generated: ' + new Date().toISOString(),
            '',
            '-- COMPANY SYNC QUERIES',
            ...companyQueries,
            '',
            '-- PEOPLE SYNC QUERIES', 
            ...peopleQueries,
            '',
            '-- JOB SYNC QUERIES',
            ...jobQueries,
            '',
            '-- CLEANUP QUERIES',
            ...cleanupQueries
        ];
        
        const queryContent = allQueries.join('\n\n');
        
        // Write to file
        const fs = await import('fs');
        fs.writeFileSync('sync-queries.sql', queryContent);
        
        console.log('✅ All sync queries saved to sync-queries.sql');
        console.log(`📊 Total queries generated: ${companyQueries.length + peopleQueries.length + jobQueries.length + cleanupQueries.length}`);
        
        // Print summary
        console.log('\n📊 SYNC SUMMARY');
        console.log('='.repeat(50));
        console.log(`Companies: ${transformedCompanies.length} records (${companyQueries.length} batches)`);
        console.log(`People: ${transformedPeople.length} records (${peopleQueries.length} batches)`);
        console.log(`Jobs: ${transformedJobs.length} records (${jobQueries.length} batches)`);
        console.log(`Cleanup: ${cleanupQueries.length} queries`);
        
        console.log('\n✅ Sync preparation completed!');
        console.log('📝 Execute the queries in sync-queries.sql to complete the synchronization.');
        
        return {
            companies: transformedCompanies.length,
            people: transformedPeople.length,
            jobs: transformedJobs.length,
            totalQueries: companyQueries.length + peopleQueries.length + jobQueries.length + cleanupQueries.length
        };
        
    } catch (error) {
        console.error(`❌ Sync execution error: ${error.message}`);
        throw error;
    }
}

// Run the sync
executeSync()
    .then(results => {
        console.log('\n🎉 Airtable to Supabase sync preparation completed successfully!');
    })
    .catch(error => {
        console.error('❌ Sync execution failed:', error.message);
        process.exit(1);
    });
