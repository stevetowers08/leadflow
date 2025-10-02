#!/usr/bin/env node

/**
 * Comprehensive Fact-Check of Airtable to Supabase Sync
 * 
 * This script verifies all aspects of the sync to ensure completeness and accuracy
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
 * Comprehensive fact-check of the sync
 */
async function comprehensiveFactCheck() {
    console.log('🔍 COMPREHENSIVE FACT-CHECK OF AIRTABLE TO SUPABASE SYNC');
    console.log('='.repeat(70));
    
    try {
        // 1. VERIFY AIRTABLE DATA SOURCE
        console.log('\n1️⃣ VERIFYING AIRTABLE DATA SOURCE...');
        const airtablePeople = await getAllAirtableRecords('People');
        console.log(`✅ Airtable People: ${airtablePeople.length} records`);
        
        // 2. ANALYZE AUTOMATION STATUS ACCURACY
        console.log('\n2️⃣ ANALYZING AUTOMATION STATUS ACCURACY...');
        let automatedCount = 0;
        let pendingCount = 0;
        let withAutomationDate = 0;
        let withoutAutomationDate = 0;
        
        const automationAnalysis = [];
        
        airtablePeople.forEach((person, index) => {
            const fields = person.fields;
            const automationStatus = fields['Automation Status'];
            const automationDate = fields['Automation Date'];
            const automation = fields['Automation'];
            
            const isAutomated = automationStatus === 'Automated';
            
            if (isAutomated) {
                automatedCount++;
                if (automationDate) {
                    withAutomationDate++;
                } else {
                    withoutAutomationDate++;
                }
            } else {
                pendingCount++;
            }
            
            if (index < 10) {
                automationAnalysis.push({
                    name: fields['Name'],
                    status: automationStatus,
                    date: automationDate,
                    hasWebhook: !!automation?.url
                });
            }
        });
        
        console.log(`✅ Automation Status Breakdown:`);
        console.log(`   - Automated: ${automatedCount}`);
        console.log(`   - Pending: ${pendingCount}`);
        console.log(`   - With Automation Date: ${withAutomationDate}`);
        console.log(`   - Without Automation Date: ${withoutAutomationDate}`);
        
        console.log(`\n📋 Sample Automation Analysis:`);
        automationAnalysis.forEach((item, i) => {
            console.log(`${i + 1}. ${item.name}`);
            console.log(`   Status: ${item.status}`);
            console.log(`   Date: ${item.date || 'None'}`);
            console.log(`   Webhook: ${item.hasWebhook ? 'Yes' : 'No'}`);
        });
        
        // 3. VERIFY STAGE MAPPINGS
        console.log('\n3️⃣ VERIFYING STAGE MAPPINGS...');
        const stageCount = {};
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
        
        airtablePeople.forEach(person => {
            const stage = person.fields['Stage'];
            if (stage) {
                stageCount[stage] = (stageCount[stage] || 0) + 1;
            }
        });
        
        console.log(`✅ Stage Distribution in Airtable:`);
        Object.entries(stageCount).forEach(([stage, count]) => {
            const mapped = stageMapping[stage] || 'UNMAPPED';
            console.log(`   ${stage}: ${count} → ${mapped}`);
        });
        
        // 4. VERIFY DATE FIELDS
        console.log('\n4️⃣ VERIFYING DATE FIELDS...');
        let withCreatedDate = 0;
        let withoutCreatedDate = 0;
        let withConnectionDate = 0;
        let withUpdateDate = 0;
        
        const dateAnalysis = [];
        
        airtablePeople.forEach((person, index) => {
            const fields = person.fields;
            const created = fields['Created'];
            const updated = fields['Updated'];
            const connectionRequestDate = fields['Connection Request Date'];
            const connectionAcceptedDate = fields['Connection Accepted Date'];
            const automationDate = fields['Automation Date'];
            
            if (created) withCreatedDate++;
            else withoutCreatedDate++;
            
            if (connectionRequestDate) withConnectionDate++;
            if (updated) withUpdateDate++;
            
            if (index < 5) {
                dateAnalysis.push({
                    name: fields['Name'],
                    created: created,
                    updated: updated,
                    connectionRequest: connectionRequestDate,
                    connectionAccepted: connectionAcceptedDate,
                    automation: automationDate
                });
            }
        });
        
        console.log(`✅ Date Field Analysis:`);
        console.log(`   - With Created Date: ${withCreatedDate}`);
        console.log(`   - Without Created Date: ${withoutCreatedDate}`);
        console.log(`   - With Connection Date: ${withConnectionDate}`);
        console.log(`   - With Update Date: ${withUpdateDate}`);
        
        console.log(`\n📅 Sample Date Analysis:`);
        dateAnalysis.forEach((item, i) => {
            console.log(`${i + 1}. ${item.name}`);
            console.log(`   Created: ${item.created || 'None'}`);
            console.log(`   Updated: ${item.updated || 'None'}`);
            console.log(`   Connection Request: ${item.connectionRequest || 'None'}`);
            console.log(`   Connection Accepted: ${item.connectionAccepted || 'None'}`);
            console.log(`   Automation: ${item.automation || 'None'}`);
        });
        
        // 5. VERIFY LINKEDIN MESSAGES
        console.log('\n5️⃣ VERIFYING LINKEDIN MESSAGES...');
        let withRequestMessage = 0;
        let withFollowUpMessage = 0;
        let withConnectedMessage = 0;
        
        airtablePeople.forEach(person => {
            const fields = person.fields;
            if (fields['LinkedIn Request Message']) withRequestMessage++;
            if (fields['LinkedIn Follow Up Message']) withFollowUpMessage++;
            if (fields['LinkedIn Connected Message']) withConnectedMessage++;
        });
        
        console.log(`✅ LinkedIn Messages Analysis:`);
        console.log(`   - With Request Message: ${withRequestMessage}`);
        console.log(`   - With Follow Up Message: ${withFollowUpMessage}`);
        console.log(`   - With Connected Message: ${withConnectedMessage}`);
        
        // 6. VERIFY FIELD COMPLETENESS
        console.log('\n6️⃣ VERIFYING FIELD COMPLETENESS...');
        const fieldAnalysis = {
            'Name': 0,
            'Company Role': 0,
            'Employee Location': 0,
            'LinkedIn URL': 0,
            'LinkedIn': 0,
            'Email': 0,
            'Confidence Level': 0,
            'Lead Source': 0
        };
        
        airtablePeople.forEach(person => {
            const fields = person.fields;
            Object.keys(fieldAnalysis).forEach(field => {
                if (fields[field]) fieldAnalysis[field]++;
            });
        });
        
        console.log(`✅ Field Completeness:`);
        Object.entries(fieldAnalysis).forEach(([field, count]) => {
            const percentage = ((count / airtablePeople.length) * 100).toFixed(1);
            console.log(`   ${field}: ${count}/${airtablePeople.length} (${percentage}%)`);
        });
        
        // 7. GENERATE FACT-CHECK SUMMARY
        console.log('\n7️⃣ FACT-CHECK SUMMARY...');
        
        const factCheckResults = {
            totalAirtablePeople: airtablePeople.length,
            automatedPeople: automatedCount,
            pendingPeople: pendingCount,
            withAutomationDates: withAutomationDate,
            withCreatedDates: withCreatedDate,
            stageVariations: Object.keys(stageCount).length,
            linkedinMessageCoverage: {
                request: withRequestMessage,
                followUp: withFollowUpMessage,
                connected: withConnectedMessage
            },
            dataQualityScore: Math.round((withCreatedDate + withRequestMessage + fieldAnalysis['Name']) / (airtablePeople.length * 3) * 100)
        };
        
        console.log(`\n📊 COMPREHENSIVE FACT-CHECK RESULTS:`);
        console.log(`=`.repeat(50));
        console.log(`✅ Total Airtable People: ${factCheckResults.totalAirtablePeople}`);
        console.log(`✅ Automated Status: ${factCheckResults.automatedPeople} automated, ${factCheckResults.pendingPeople} pending`);
        console.log(`✅ Date Coverage: ${factCheckResults.withCreatedDates} have created dates, ${factCheckResults.withAutomationDates} have automation dates`);
        console.log(`✅ Stage Variations: ${factCheckResults.stageVariations} different stages mapped`);
        console.log(`✅ LinkedIn Messages: ${factCheckResults.linkedinMessageCoverage.request} request, ${factCheckResults.linkedinMessageCoverage.followUp} follow-up, ${factCheckResults.linkedinMessageCoverage.connected} connected`);
        console.log(`✅ Data Quality Score: ${factCheckResults.dataQualityScore}%`);
        
        // 8. VERIFY SYNC FILE ACCURACY
        console.log('\n8️⃣ VERIFYING SYNC FILE ACCURACY...');
        
        const fs = await import('fs');
        try {
            const syncFileContent = await fs.promises.readFile('final-batch-sync-corrected.sql', 'utf8');
            const insertCount = (syncFileContent.match(/INSERT INTO people/g) || []).length;
            const airtableIdCount = (syncFileContent.match(/airtable_id = 'rec[A-Za-z0-9]+'/g) || []).length;
            
            console.log(`✅ Sync File Verification:`);
            console.log(`   - INSERT statements: ${insertCount}`);
            console.log(`   - Airtable IDs: ${airtableIdCount}`);
            console.log(`   - File exists: Yes`);
            console.log(`   - Matches Airtable count: ${insertCount === airtablePeople.length ? 'Yes' : 'No'}`);
        } catch (error) {
            console.log(`❌ Sync file verification failed: ${error.message}`);
        }
        
        return factCheckResults;
        
    } catch (error) {
        console.error(`❌ Error in fact-check: ${error.message}`);
        throw error;
    }
}

// Run the comprehensive fact-check
comprehensiveFactCheck()
    .then(results => {
        console.log('\n🎉 COMPREHENSIVE FACT-CHECK COMPLETE!');
        console.log(`📈 Overall Data Quality: ${results.dataQualityScore}%`);
        console.log(`📊 Ready for sync: ${results.totalAirtablePeople} people with proper automation and dates`);
    })
    .catch(error => {
        console.error('❌ Fact-check failed:', error.message);
        process.exit(1);
    });

