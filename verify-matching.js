#!/usr/bin/env node

/**
 * Verify Matching Between Airtable and Supabase
 * 
 * This script carefully checks which Airtable records would match existing Supabase records
 * before executing any updates
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
 * Verify matching between Airtable and Supabase people
 */
async function verifyPeopleMatching() {
    console.log('🔍 Verifying People Matching Between Airtable and Supabase...\n');
    
    try {
        // Get Airtable people
        const airtablePeople = await getAllAirtableRecords('People');
        console.log(`📊 Airtable has ${airtablePeople.length} people records`);
        
        // Show sample Airtable names for comparison
        console.log('\n📋 Sample Airtable People Names:');
        for (let i = 0; i < Math.min(20, airtablePeople.length); i++) {
            const person = airtablePeople[i];
            const name = person.fields['Name'] || '';
            const stage = person.fields['Stage'] || '';
            const role = person.fields['Company Role'] || '';
            const linkedin = person.fields['LinkedIn URL'] || person.fields['LinkedIn'] || '';
            
            console.log(`${i + 1}. "${name}" - ${stage} - ${role}`);
            if (linkedin) {
                console.log(`   LinkedIn: ${linkedin.substring(0, 60)}...`);
            }
        }
        
        // Generate matching verification queries
        console.log('\n🔍 MATCHING VERIFICATION QUERIES:');
        console.log('Execute these to see which records would be matched:\n');
        
        for (let i = 0; i < Math.min(10, airtablePeople.length); i++) {
            const person = airtablePeople[i];
            const name = (person.fields['Name'] || '').replace(/'/g, "''");
            const linkedin = person.fields['LinkedIn URL'] || person.fields['LinkedIn'] || null;
            
            const query = `-- Check if "${name}" exists in Supabase
SELECT name, linkedin_url, stage, company_role, airtable_id 
FROM people 
WHERE (LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''})
  AND airtable_id IS NULL;`;
            
            console.log(query);
            console.log('');
        }
        
        // Generate safe update queries with verification
        console.log('\n✅ SAFE UPDATE QUERIES (with existence checks):');
        console.log('These will only update if a match is found:\n');
        
        for (let i = 0; i < Math.min(5, airtablePeople.length); i++) {
            const person = airtablePeople[i];
            const fields = person.fields;
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const role = (fields['Company Role'] || '').replace(/'/g, "''");
            const location = (fields['Employee Location'] || '').replace(/'/g, "''");
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            const stage = mapStage(fields['Stage']);
            const confidence = fields['Confidence Level'] || null;
            const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
            const automationStarted = fields['Automation'] ? 'NOW()' : 'NULL';
            
            const updateQuery = `-- Safe update for "${name}" (${fields['Stage']} -> ${stage})
UPDATE people SET 
    airtable_id = '${person.id}',
    company_role = '${role}',
    employee_location = '${location}',
    stage = '${stage}',
    confidence_level = ${confidence ? `'${confidence}'` : 'NULL'},
    lead_source = '${leadSource}',
    automation_started_at = ${automationStarted},
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''})
  AND airtable_id IS NULL;`;
            
            console.log(updateQuery);
            console.log('');
        }
        
        return {
            airtableCount: airtablePeople.length,
            sampleNames: airtablePeople.slice(0, 10).map(p => p.fields['Name'])
        };
        
    } catch (error) {
        console.error(`❌ Error verifying matching: ${error.message}`);
        throw error;
    }
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

// Run the verification
verifyPeopleMatching()
    .then(results => {
        console.log('\n🎉 Matching verification completed!');
        console.log(`📊 Found ${results.airtableCount} Airtable people to potentially match`);
        console.log('\n💡 Review the verification queries above before executing updates');
    })
    .catch(error => {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    });
