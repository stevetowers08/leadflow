#!/usr/bin/env node

/**
 * Execute Final Comprehensive Sync
 * 
 * This script executes the complete sync with proper date handling,
 * focusing on INSERT operations for new Airtable people
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
        'NEW LEAD': 'new',
        'CONNECT SENT': 'connection_requested',
        'CONNECTED': 'connected',
        'MESSAGED': 'messaged',
        'MSG SENT': 'messaged',
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
 * Get automation info from Airtable record
 */
function getAutomationInfo(airtableRecord) {
    const automationStatus = airtableRecord.fields['Automation Status'];
    const automationDate = airtableRecord.fields['Automation Date'];
    
    const isAutomated = automationStatus === 'Automated';
    
    let automationStartedAt = 'NULL';
    if (isAutomated) {
        if (automationDate) {
            const parsedDate = parseAirtableDate(automationDate);
            automationStartedAt = parsedDate ? `'${parsedDate}'` : 'NOW()';
        } else {
            automationStartedAt = 'NOW()';
        }
    }
    
    return { isAutomated, automationStartedAt };
}

/**
 * Execute final comprehensive sync
 */
async function executeFinalSync() {
    console.log('🚀 EXECUTING FINAL COMPREHENSIVE SYNC');
    console.log('='.repeat(60));
    
    try {
        // Get all Airtable people
        const airtablePeople = await getAllAirtableRecords('People');
        console.log(`📊 Processing ${airtablePeople.length} people from Airtable`);
        
        console.log('\n🔧 GENERATING FINAL INSERT QUERIES...');
        
        const insertQueries = [];
        let processedCount = 0;
        
        for (const person of airtablePeople) {
            const fields = person.fields;
            
            // Prepare data with proper escaping
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const role = (fields['Company Role'] || '').replace(/'/g, "''");
            const location = (fields['Employee Location'] || '').replace(/'/g, "''");
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            const email = fields['Email'] || null;
            const stage = mapStage(fields['Stage']);
            const confidence = fields['Confidence Level'] || null;
            const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
            const createdTime = parseAirtableDate(fields['Created']);
            
            // Get automation info
            const { isAutomated, automationStartedAt } = getAutomationInfo(person);
            
            // LinkedIn messages
            const linkedinRequestMsg = (fields['LinkedIn Request Message'] || '').replace(/'/g, "''");
            const linkedinFollowUpMsg = (fields['LinkedIn Follow Up Message'] || '').replace(/'/g, "''");
            const linkedinConnectedMsg = (fields['LinkedIn Connected Message'] || '').replace(/'/g, "''");
            
            processedCount++;
            
            if (processedCount <= 20) {
                console.log(`${processedCount}. Processing: "${name}"`);
                console.log(`   Stage: ${fields['Stage']} -> ${stage}`);
                console.log(`   Automation: ${isAutomated ? 'Active' : 'Pending'} (${automationStartedAt})`);
                console.log(`   Created: ${createdTime || 'No date'}`);
            }
            
            // Generate INSERT query for new people
            const insertQuery = `-- Insert person: ${name} (${fields['Stage']})
INSERT INTO people (airtable_id, name, email, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT '${person.id}', '${name}', ${email ? `'${email}'` : 'NULL'}, ${linkedin ? `'${linkedin}'` : 'NULL'}, '${role}', '${location}', '${stage}', ${confidence ? `'${confidence}'` : 'NULL'}, '${leadSource}', ${automationStartedAt}, '${linkedinRequestMsg}', '${linkedinFollowUpMsg}', '${linkedinConnectedMsg}', ${createdTime ? `'${createdTime}'` : 'NOW()'}, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = '${person.id}' 
       OR (LOWER(name) = LOWER('${name}') ${linkedin ? `OR linkedin_url = '${linkedin}'` : ''} ${email ? `OR email = '${email}'` : ''})
);`;
            
            insertQueries.push(insertQuery);
        }
        
        // Write final sync queries
        const fs = await import('fs');
        const finalContent = [
            '-- FINAL COMPREHENSIVE SYNC - INSERT NEW PEOPLE',
            '-- Generated: ' + new Date().toISOString(),
            '-- All dates, automation status, and stages corrected',
            '',
            '-- SUMMARY:',
            `-- Total Airtable people: ${airtablePeople.length}`,
            `-- Automated people: ${airtablePeople.filter(p => getAutomationInfo(p).isAutomated).length}`,
            `-- Pending automation: ${airtablePeople.filter(p => !getAutomationInfo(p).isAutomated).length}`,
            '',
            '-- BEGIN TRANSACTION;',
            '',
            ...insertQueries,
            '',
            '-- COMMIT;'
        ].join('\n');
        
        await fs.promises.writeFile('final-comprehensive-sync.sql', finalContent);
        
        console.log('\n✅ FINAL SYNC QUERIES GENERATED!');
        console.log('='.repeat(60));
        console.log(`📊 Generated ${insertQueries.length} INSERT queries`);
        console.log(`📁 Saved to: final-comprehensive-sync.sql`);
        
        // Show automation summary
        const automatedCount = airtablePeople.filter(p => getAutomationInfo(p).isAutomated).length;
        const pendingCount = airtablePeople.length - automatedCount;
        
        console.log(`\n🤖 FINAL AUTOMATION SUMMARY:`);
        console.log(`   Automated (active): ${automatedCount}`);
        console.log(`   Pending automation: ${pendingCount}`);
        console.log(`   Total people: ${airtablePeople.length}`);
        
        return {
            totalPeople: airtablePeople.length,
            automatedCount,
            pendingCount,
            insertCount: insertQueries.length
        };
        
    } catch (error) {
        console.error(`❌ Error in final sync: ${error.message}`);
        throw error;
    }
}

// Run the final sync
executeFinalSync()
    .then(results => {
        console.log('\n🎉 FINAL COMPREHENSIVE SYNC READY FOR EXECUTION!');
        console.log(`📈 Results:`);
        console.log(`   - Total people: ${results.totalPeople}`);
        console.log(`   - Automated: ${results.automatedCount}`);
        console.log(`   - Pending: ${results.pendingCount}`);
        console.log(`   - Insert queries: ${results.insertCount}`);
        console.log('\n💡 Execute final-comprehensive-sync.sql to complete the sync');
    })
    .catch(error => {
        console.error('❌ Final sync generation failed:', error.message);
        process.exit(1);
    });
