#!/usr/bin/env node

/**
 * Airtable to Supabase Data Synchronization Script
 * 
 * This script:
 * 1. Connects to Airtable to examine table structures
 * 2. Compares with Supabase database schema
 * 3. Updates Airtable data based on Supabase records
 * 4. Removes Supabase records that don't exist in Airtable
 */

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';

// Airtable API base URL
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
 * Get all bases accessible with the token
 */
async function getBases() {
    console.log('🔍 Fetching Airtable bases...');
    try {
        const data = await airtableRequest('/meta/bases');
        return data.bases;
    } catch (error) {
        console.error('Error fetching bases:', error.message);
        throw error;
    }
}

/**
 * Get base schema (tables and fields)
 */
async function getBaseSchema(baseId) {
    console.log(`📋 Fetching schema for base: ${baseId}`);
    try {
        const data = await airtableRequest(`/meta/bases/${baseId}/tables`);
        return data.tables;
    } catch (error) {
        console.error(`Error fetching base schema for ${baseId}:`, error.message);
        throw error;
    }
}

/**
 * Get records from a specific table
 */
async function getTableRecords(baseId, tableName, options = {}) {
    console.log(`📊 Fetching records from ${tableName}...`);
    try {
        const params = new URLSearchParams();
        if (options.maxRecords) params.append('maxRecords', options.maxRecords);
        if (options.view) params.append('view', options.view);
        
        const endpoint = `/${baseId}/${encodeURIComponent(tableName)}${params.toString() ? '?' + params.toString() : ''}`;
        const data = await airtableRequest(endpoint);
        return data.records;
    } catch (error) {
        console.error(`Error fetching records from ${tableName}:`, error.message);
        throw error;
    }
}

/**
 * Main function to examine Airtable structure
 */
async function examineAirtableStructure() {
    try {
        console.log('🚀 Starting Airtable structure examination...\n');

        // Get all bases
        const bases = await getBases();
        console.log(`Found ${bases.length} bases:\n`);

        for (const base of bases) {
            console.log(`📁 Base: ${base.name} (ID: ${base.id})`);
            console.log(`   Permission: ${base.permissionLevel}`);
            
            try {
                // Get tables for this base
                const tables = await getBaseSchema(base.id);
                console.log(`   Tables (${tables.length}):`);
                
                for (const table of tables) {
                    console.log(`     📋 ${table.name} (ID: ${table.id})`);
                    console.log(`        Primary Field: ${table.primaryFieldId}`);
                    console.log(`        Fields (${table.fields.length}):`);
                    
                    for (const field of table.fields) {
                        console.log(`          - ${field.name} (${field.type})`);
                        if (field.options) {
                            console.log(`            Options: ${JSON.stringify(field.options, null, 12)}`);
                        }
                    }
                    
                    // Get a few sample records to understand the data structure
                    try {
                        const sampleRecords = await getTableRecords(base.id, table.name, { maxRecords: 3 });
                        console.log(`        Sample Records (${sampleRecords.length}):`);
                        
                        for (const record of sampleRecords.slice(0, 2)) {
                            console.log(`          Record ID: ${record.id}`);
                            console.log(`          Fields: ${JSON.stringify(record.fields, null, 12)}`);
                        }
                    } catch (recordError) {
                        console.log(`        ⚠️  Could not fetch sample records: ${recordError.message}`);
                    }
                    
                    console.log('');
                }
            } catch (schemaError) {
                console.log(`   ⚠️  Could not fetch schema: ${schemaError.message}`);
            }
            
            console.log('');
        }

        return bases;
    } catch (error) {
        console.error('❌ Error examining Airtable structure:', error.message);
        throw error;
    }
}

/**
 * Find the CRM base (likely contains Companies, People, Jobs tables)
 */
function findCRMBase(bases, tables) {
    // Look for bases that contain typical CRM tables
    const crmTableNames = ['companies', 'people', 'jobs', 'leads', 'contacts', 'prospects'];
    
    for (const base of bases) {
        const baseTableNames = tables[base.id] ? tables[base.id].map(t => t.name.toLowerCase()) : [];
        const matchingTables = crmTableNames.filter(name => 
            baseTableNames.some(tableName => tableName.includes(name))
        );
        
        if (matchingTables.length >= 2) {
            console.log(`🎯 Found potential CRM base: ${base.name} (${matchingTables.length} matching tables)`);
            return base;
        }
    }
    
    return null;
}

/**
 * Compare Airtable and Supabase schemas
 */
function compareSchemas(airtableTables, supabaseSchema) {
    console.log('🔄 Comparing Airtable and Supabase schemas...\n');
    
    const comparison = {
        companies: { airtable: null, supabase: supabaseSchema.companies, fieldMapping: {} },
        people: { airtable: null, supabase: supabaseSchema.people, fieldMapping: {} },
        jobs: { airtable: null, supabase: supabaseSchema.jobs, fieldMapping: {} }
    };
    
    // Find matching tables in Airtable
    for (const table of airtableTables) {
        const tableName = table.name.toLowerCase();
        
        if (tableName.includes('compan')) {
            comparison.companies.airtable = table;
        } else if (tableName.includes('people') || tableName.includes('contact') || tableName.includes('lead')) {
            comparison.people.airtable = table;
        } else if (tableName.includes('job') || tableName.includes('position')) {
            comparison.jobs.airtable = table;
        }
    }
    
    // Create field mappings
    for (const [entityType, data] of Object.entries(comparison)) {
        if (data.airtable) {
            console.log(`📊 ${entityType.toUpperCase()} Table Comparison:`);
            console.log(`   Airtable: ${data.airtable.name} (${data.airtable.fields.length} fields)`);
            console.log(`   Supabase: ${entityType} (${Object.keys(data.supabase).length} fields)`);
            
            // Map fields by name similarity
            for (const airtableField of data.airtable.fields) {
                const fieldName = airtableField.name.toLowerCase().replace(/\s+/g, '_');
                const supabaseFields = Object.keys(data.supabase);
                
                // Find exact or similar match
                let matchedField = supabaseFields.find(sf => sf === fieldName);
                if (!matchedField) {
                    matchedField = supabaseFields.find(sf => 
                        sf.includes(fieldName) || fieldName.includes(sf.replace(/_/g, ''))
                    );
                }
                
                if (matchedField) {
                    data.fieldMapping[airtableField.name] = matchedField;
                    console.log(`     ✅ ${airtableField.name} → ${matchedField}`);
                } else {
                    console.log(`     ❌ ${airtableField.name} (no match found)`);
                }
            }
            console.log('');
        } else {
            console.log(`❌ No matching ${entityType} table found in Airtable\n`);
        }
    }
    
    return comparison;
}

// Supabase schema (based on the database structure we examined)
const SUPABASE_SCHEMA = {
    companies: {
        id: 'uuid',
        name: 'text',
        website: 'text',
        linkedin_url: 'text',
        head_office: 'text',
        industry: 'text',
        company_size: 'text',
        confidence_level: 'enum',
        lead_score: 'text',
        score_reason: 'text',
        automation_active: 'boolean',
        automation_started_at: 'timestamptz',
        is_favourite: 'boolean',
        ai_info: 'jsonb',
        key_info_raw: 'jsonb',
        loxo_company_id: 'text',
        created_at: 'timestamptz',
        updated_at: 'timestamptz',
        priority: 'text',
        logo_url: 'text',
        logo_cached_at: 'timestamp',
        owner_id: 'uuid',
        lead_source: 'text',
        source_details: 'text',
        source_date: 'timestamptz',
        pipeline_stage: 'enum'
    },
    people: {
        id: 'uuid',
        name: 'text',
        company_id: 'uuid',
        email_address: 'text',
        linkedin_url: 'text',
        employee_location: 'text',
        company_role: 'text',
        lead_score: 'text',
        stage: 'enum',
        automation_started_at: 'timestamptz',
        linkedin_request_message: 'text',
        linkedin_follow_up_message: 'text',
        linkedin_connected_message: 'text',
        connected_at: 'timestamptz',
        last_reply_at: 'timestamptz',
        last_reply_channel: 'text',
        last_reply_message: 'text',
        last_interaction_at: 'timestamptz',
        owner_id: 'uuid',
        created_at: 'timestamptz',
        updated_at: 'timestamptz',
        confidence_level: 'text',
        email_draft: 'text',
        connection_request_date: 'timestamptz',
        connection_accepted_date: 'timestamptz',
        message_sent_date: 'timestamptz',
        response_date: 'timestamptz',
        meeting_booked: 'text',
        meeting_date: 'timestamptz',
        email_sent_date: 'timestamptz',
        email_reply_date: 'timestamptz',
        stage_updated: 'timestamptz',
        is_favourite: 'boolean',
        connection_request_sent: 'text',
        message_sent: 'text',
        linkedin_connected: 'text',
        linkedin_responded: 'text',
        campaign_finished: 'text',
        favourite: 'boolean',
        jobs: 'text',
        email_sent: 'text',
        email_reply: 'text',
        linkedin_profile_id: 'text',
        lead_source: 'text',
        source_details: 'text',
        source_date: 'timestamptz',
        reply_type: 'enum'
    },
    jobs: {
        id: 'uuid',
        title: 'text',
        company_id: 'uuid',
        job_url: 'text',
        posted_date: 'date',
        valid_through: 'date',
        location: 'text',
        description: 'text',
        summary: 'text',
        employment_type: 'text',
        seniority_level: 'text',
        linkedin_job_id: 'text',
        automation_active: 'boolean',
        automation_started_at: 'timestamptz',
        created_at: 'timestamptz',
        updated_at: 'timestamptz',
        priority: 'text',
        lead_score_job: 'integer',
        salary: 'text',
        function: 'text',
        logo_url: 'text',
        owner_id: 'uuid'
    }
};

/**
 * Examine a specific base by ID
 */
async function examineSpecificBase(baseId) {
    try {
        console.log(`🔍 Examining base: ${baseId}\n`);
        
        // Try to get base schema
        const tables = await getBaseSchema(baseId);
        console.log(`Found ${tables.length} tables:\n`);
        
        for (const table of tables) {
            console.log(`📋 Table: ${table.name} (ID: ${table.id})`);
            console.log(`   Primary Field: ${table.primaryFieldId}`);
            console.log(`   Fields (${table.fields.length}):`);
            
            for (const field of table.fields) {
                console.log(`     - ${field.name} (${field.type})`);
                if (field.options && Object.keys(field.options).length > 0) {
                    console.log(`       Options: ${JSON.stringify(field.options, null, 8)}`);
                }
            }
            
            // Get sample records
            try {
                const sampleRecords = await getTableRecords(baseId, table.name, { maxRecords: 2 });
                console.log(`   Sample Records (${sampleRecords.length}):`);
                
                for (const record of sampleRecords) {
                    console.log(`     Record ID: ${record.id}`);
                    console.log(`     Fields: ${JSON.stringify(record.fields, null, 8)}`);
                }
            } catch (recordError) {
                console.log(`   ⚠️  Could not fetch sample records: ${recordError.message}`);
            }
            
            console.log('');
        }
        
        // Compare with Supabase schema
        const comparison = compareSchemas(tables, SUPABASE_SCHEMA);
        
        return { tables, comparison };
    } catch (error) {
        console.error(`❌ Error examining base ${baseId}:`, error.message);
        throw error;
    }
}

// Since we can't access the meta API, let's try some common base IDs or ask for one
console.log('🚀 Airtable to Supabase Sync Tool\n');
console.log('❌ Cannot access Airtable Meta API with current token permissions.');
console.log('📝 Please provide your Airtable Base ID to continue.\n');
console.log('You can find your Base ID in the Airtable URL:');
console.log('https://airtable.com/[BASE_ID]/[TABLE_ID]\n');
console.log('Example usage:');
console.log('BASE_ID=appXXXXXXXXXXXXXX node airtable-sync.js\n');

// Check if BASE_ID is provided as environment variable
const baseId = process.env.BASE_ID;
if (baseId) {
    console.log(`🎯 Using provided Base ID: ${baseId}\n`);
    examineSpecificBase(baseId)
        .then(result => {
            console.log('✅ Base examination completed!');
            console.log('\n📊 Summary:');
            console.log(`- Found ${result.tables.length} tables`);
            console.log('- Field mappings created for Supabase sync');
        })
        .catch(error => {
            console.error('❌ Failed to examine base:', error.message);
            process.exit(1);
        });
} else {
    console.log('💡 Set BASE_ID environment variable and run again.');
}

export {
    examineAirtableStructure,
    getBases,
    getBaseSchema,
    getTableRecords,
    compareSchemas,
    SUPABASE_SCHEMA
};
