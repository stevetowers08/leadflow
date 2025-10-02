#!/usr/bin/env node

/**
 * Fix Automation Status and Dates
 * 
 * This script specifically fixes automation status and date fields
 * based on comprehensive Airtable analysis
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
 * Analyze automation fields in Airtable
 */
async function analyzeAutomationFields() {
    console.log('🔍 ANALYZING AUTOMATION FIELDS IN AIRTABLE...\n');
    
    try {
        const airtablePeople = await getAllAirtableRecords('People');
        
        console.log('📊 AUTOMATION FIELD ANALYSIS:');
        console.log('='.repeat(50));
        
        const automationFields = new Set();
        const automationValues = new Map();
        
        // Analyze first 20 records for automation fields
        for (let i = 0; i < Math.min(20, airtablePeople.length); i++) {
            const person = airtablePeople[i];
            const fields = person.fields;
            
            console.log(`\n${i + 1}. "${fields['Name']}" (${person.id})`);
            
            // Check all possible automation-related fields
            Object.keys(fields).forEach(key => {
                if (key.toLowerCase().includes('automat') || 
                    key.toLowerCase().includes('active') ||
                    key.toLowerCase().includes('trigger') ||
                    key.toLowerCase().includes('webhook')) {
                    automationFields.add(key);
                    const value = fields[key];
                    console.log(`   ${key}: ${JSON.stringify(value)}`);
                    
                    if (!automationValues.has(key)) {
                        automationValues.set(key, new Set());
                    }
                    automationValues.get(key).add(JSON.stringify(value));
                }
            });
            
            // Check date fields
            Object.keys(fields).forEach(key => {
                if (key.toLowerCase().includes('date') || 
                    key.toLowerCase().includes('time') ||
                    key.toLowerCase().includes('created') ||
                    key.toLowerCase().includes('updated')) {
                    console.log(`   📅 ${key}: ${fields[key]}`);
                }
            });
        }
        
        console.log('\n📋 AUTOMATION FIELDS FOUND:');
        automationFields.forEach(field => {
            console.log(`   - ${field}`);
            const values = Array.from(automationValues.get(field) || []);
            console.log(`     Values: ${values.join(', ')}`);
        });
        
        // Generate corrected automation queries
        console.log('\n🔧 GENERATING AUTOMATION CORRECTION QUERIES...');
        
        const correctionQueries = [];
        
        for (let i = 0; i < Math.min(50, airtablePeople.length); i++) {
            const person = airtablePeople[i];
            const fields = person.fields;
            
            // Check for automation indicators
            const automationActive = fields['Automation Active'];
            const automation = fields['Automation'];
            const webhookUrl = fields['Webhook URL'] || fields['Automation URL'];
            
            let isAutomated = false;
            
            // Determine if automation is active
            if (automationActive) {
                if (typeof automationActive === 'object' && automationActive.label) {
                    isAutomated = true;
                } else if (automationActive === true || automationActive === 'Yes' || automationActive === 'Active') {
                    isAutomated = true;
                }
            }
            
            if (automation === true || automation === 'Yes' || automation === 'Active') {
                isAutomated = true;
            }
            
            if (webhookUrl && webhookUrl.includes('webhook')) {
                isAutomated = true;
            }
            
            const name = (fields['Name'] || '').replace(/'/g, "''");
            const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
            
            if (i < 10) {
                console.log(`${i + 1}. "${name}" - Automation: ${isAutomated}`);
                if (automationActive) console.log(`   Automation Active: ${JSON.stringify(automationActive)}`);
                if (automation) console.log(`   Automation: ${JSON.stringify(automation)}`);
                if (webhookUrl) console.log(`   Webhook: ${webhookUrl}`);
            }
            
            // Generate correction query
            const correctionQuery = `-- Fix automation for: ${name}
UPDATE people SET 
    automation_started_at = ${isAutomated ? 'NOW()' : 'NULL'},
    updated_at = NOW()
WHERE airtable_id = '${person.id}';`;
            
            correctionQueries.push(correctionQuery);
        }
        
        // Write correction queries to file
        const fs = await import('fs');
        const correctionContent = [
            '-- AUTOMATION STATUS CORRECTIONS',
            '-- Generated: ' + new Date().toISOString(),
            '',
            ...correctionQueries
        ].join('\n');
        
        await fs.promises.writeFile('automation-corrections.sql', correctionContent);
        
        console.log('\n✅ AUTOMATION ANALYSIS COMPLETE!');
        console.log(`📁 Generated automation-corrections.sql with ${correctionQueries.length} corrections`);
        
        return {
            totalPeople: airtablePeople.length,
            automationFields: Array.from(automationFields),
            correctionCount: correctionQueries.length
        };
        
    } catch (error) {
        console.error(`❌ Error analyzing automation: ${error.message}`);
        throw error;
    }
}

// Run the automation analysis
analyzeAutomationFields()
    .then(results => {
        console.log('\n🎉 AUTOMATION ANALYSIS COMPLETED!');
        console.log(`📊 Analyzed ${results.totalPeople} people`);
        console.log(`🔧 Found ${results.automationFields.length} automation fields`);
        console.log(`📝 Generated ${results.correctionCount} correction queries`);
    })
    .catch(error => {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    });
