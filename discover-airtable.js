#!/usr/bin/env node

/**
 * Airtable Base Discovery Script
 * 
 * Since we can't access the Meta API, this script tries to discover
 * the base structure by attempting common table names and patterns.
 */

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

// Common base ID patterns and table names to try
const COMMON_TABLE_NAMES = [
    'Companies', 'Company', 'companies', 'company',
    'People', 'Person', 'people', 'person', 'Contacts', 'contacts',
    'Jobs', 'Job', 'jobs', 'job', 'Positions', 'positions',
    'Leads', 'Lead', 'leads', 'lead',
    'Prospects', 'prospects', 'Prospect',
    'Clients', 'clients', 'Client'
];

// Common base ID patterns (Airtable base IDs start with 'app')
const COMMON_BASE_PATTERNS = [
    'app', // We'll need the actual base ID
];

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

    const responseText = await response.text();
    
    if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} - ${responseText}`);
    }

    try {
        return JSON.parse(responseText);
    } catch (e) {
        return responseText;
    }
}

/**
 * Try to discover tables in a base
 */
async function discoverTablesInBase(baseId) {
    console.log(`🔍 Trying to discover tables in base: ${baseId}`);
    const discoveredTables = [];
    
    for (const tableName of COMMON_TABLE_NAMES) {
        try {
            console.log(`   Trying table: ${tableName}`);
            const data = await airtableRequest(`/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1`);
            
            if (data.records) {
                console.log(`   ✅ Found table: ${tableName} (${data.records.length} sample records)`);
                discoveredTables.push({
                    name: tableName,
                    sampleRecord: data.records[0] || null
                });
                
                // If we found a record, show its structure
                if (data.records[0]) {
                    console.log(`      Sample fields: ${Object.keys(data.records[0].fields).join(', ')}`);
                }
            }
        } catch (error) {
            // Ignore 404s and permission errors for non-existent tables
            if (!error.message.includes('404') && !error.message.includes('NOT_FOUND')) {
                console.log(`   ❌ Error accessing ${tableName}: ${error.message}`);
            }
        }
    }
    
    return discoveredTables;
}

/**
 * Try common base IDs or patterns
 */
async function discoverBases() {
    console.log('🚀 Starting Airtable base discovery...\n');
    
    // Since we can't get the base list, we need to try known patterns
    // or ask the user for the base ID
    
    console.log('❌ Cannot discover bases without Meta API access.');
    console.log('📝 Please provide your Airtable Base ID.\n');
    
    console.log('To find your Base ID:');
    console.log('1. Go to https://airtable.com');
    console.log('2. Open your CRM base');
    console.log('3. Look at the URL: https://airtable.com/[BASE_ID]/[TABLE_ID]');
    console.log('4. Copy the BASE_ID (starts with "app")');
    console.log('\nExample: app1234567890abcdef\n');
    
    // Try some example base IDs if provided
    const testBaseId = process.env.BASE_ID;
    if (testBaseId) {
        console.log(`🎯 Testing provided Base ID: ${testBaseId}\n`);
        try {
            const tables = await discoverTablesInBase(testBaseId);
            if (tables.length > 0) {
                console.log(`\n✅ Successfully discovered ${tables.length} tables in base ${testBaseId}:`);
                for (const table of tables) {
                    console.log(`   📋 ${table.name}`);
                    if (table.sampleRecord) {
                        const fields = Object.keys(table.sampleRecord.fields);
                        console.log(`      Fields (${fields.length}): ${fields.join(', ')}`);
                    }
                }
                return { baseId: testBaseId, tables };
            } else {
                console.log(`❌ No tables found in base ${testBaseId}`);
            }
        } catch (error) {
            console.log(`❌ Error accessing base ${testBaseId}: ${error.message}`);
        }
    }
    
    return null;
}

/**
 * Get all records from a table
 */
async function getAllRecords(baseId, tableName) {
    console.log(`📊 Fetching all records from ${tableName}...`);
    let allRecords = [];
    let offset = null;
    
    do {
        try {
            const params = new URLSearchParams();
            params.append('pageSize', '100'); // Max page size
            if (offset) params.append('offset', offset);
            
            const endpoint = `/${baseId}/${encodeURIComponent(tableName)}?${params.toString()}`;
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

// Run discovery
discoverBases()
    .then(result => {
        if (result) {
            console.log('\n🎉 Discovery completed successfully!');
            console.log(`Base ID: ${result.baseId}`);
            console.log(`Tables found: ${result.tables.length}`);
        } else {
            console.log('\n💡 Please provide BASE_ID environment variable:');
            console.log('BASE_ID=appXXXXXXXXXXXXXX node discover-airtable.js');
        }
    })
    .catch(error => {
        console.error('❌ Discovery failed:', error.message);
        process.exit(1);
    });

export {
    discoverTablesInBase,
    getAllRecords,
    airtableRequest
};
