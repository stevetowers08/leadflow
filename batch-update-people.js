#!/usr/bin/env node

/**
 * Batch Update All People from Airtable
 * 
 * This script will update ALL people records by matching them with Airtable data
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
 * Generate all people update queries
 */
async function generateAllPeopleUpdates() {
    console.log('🚀 Generating ALL people update queries...\n');
    
    try {
        const airtablePeople = await getAllAirtableRecords('People');
        console.log(`\n📊 Processing ${airtablePeople.length} people from Airtable`);
        
        const updateQueries = [];
        const insertQueries = [];
        
        for (const record of airtablePeople) {
            const fields = record.fields;
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const role = (fields['Company Role'] || '').replace(/'/g, "''");
            const location = (fields['Employee Location'] || '').replace(/'/g, "''");
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            const stage = mapStage(fields['Stage']);
            const confidence = fields['Confidence Level'] || null;
            const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
            const automationStarted = fields['Automation'] ? 'NOW()' : 'NULL';
            
            // Update query - match by name or LinkedIn URL
            const updateQuery = `UPDATE people SET 
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
WHERE (LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''})
  AND airtable_id IS NULL;`;
            
            updateQueries.push(updateQuery);
            
            // Insert query for truly new people
            const insertQuery = `INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT '${record.id}', '${name}', '${role}', '${location}', ${linkedin ? `'${linkedin}'` : 'NULL'}, '${stage}', ${confidence ? `'${confidence}'` : 'NULL'}, '${leadSource}', ${automationStarted}, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''}
);`;
            
            insertQueries.push(insertQuery);
        }
        
        // Save all queries to file
        const allQueries = [
            '-- BATCH UPDATE ALL PEOPLE FROM AIRTABLE',
            '-- Generated: ' + new Date().toISOString(),
            `-- Total people to process: ${airtablePeople.length}`,
            '',
            '-- UPDATE EXISTING PEOPLE RECORDS',
            ...updateQueries,
            '',
            '-- INSERT NEW PEOPLE RECORDS',
            ...insertQueries
        ];
        
        const queryContent = allQueries.join('\n\n');
        
        // Write to file
        const fs = await import('fs');
        fs.writeFileSync('batch-people-updates.sql', queryContent);
        
        console.log(`\n✅ Generated ${updateQueries.length} update queries and ${insertQueries.length} insert queries`);
        console.log('📁 Saved to: batch-people-updates.sql');
        
        // Show first few queries as examples
        console.log('\n📄 Sample update queries:');
        for (let i = 0; i < Math.min(3, updateQueries.length); i++) {
            console.log(updateQueries[i]);
            console.log('');
        }
        
        return {
            totalPeople: airtablePeople.length,
            updateQueries: updateQueries.length,
            insertQueries: insertQueries.length
        };
        
    } catch (error) {
        console.error(`❌ Error generating people updates: ${error.message}`);
        throw error;
    }
}

// Run the batch generation
generateAllPeopleUpdates()
    .then(results => {
        console.log('\n🎉 Batch people update generation completed!');
        console.log(`📊 Total: ${results.totalPeople} people, ${results.updateQueries} updates, ${results.insertQueries} inserts`);
        console.log('\n💡 Next step: Execute the queries in batch-people-updates.sql');
    })
    .catch(error => {
        console.error('❌ Batch generation failed:', error.message);
        process.exit(1);
    });
