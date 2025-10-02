#!/usr/bin/env node

/**
 * Comprehensive Airtable to Supabase Data Synchronization Script
 * 
 * This script:
 * 1. Examines Airtable table structures and gets all records
 * 2. Compares with Supabase database schema
 * 3. Updates Airtable data based on Supabase records
 * 4. Removes Supabase records that don't exist in Airtable
 */

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';
const BASE_ID = 'appcc1jJqJLZRcshk';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

// Use the capitalized table names (they seem to be the primary ones)
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
 * Get table schema from Airtable
 */
async function getAirtableSchema(tableName) {
    try {
        const endpoint = `/meta/bases/${BASE_ID}/tables`;
        const data = await airtableRequest(endpoint);
        return data.tables.find(table => table.name === tableName);
    } catch (error) {
        console.log(`⚠️  Cannot get schema via Meta API: ${error.message}`);
        // Fallback: infer schema from sample records
        const sampleRecords = await airtableRequest(`/${BASE_ID}/${encodeURIComponent(tableName)}?maxRecords=5`);
        if (sampleRecords.records.length > 0) {
            const fields = Object.keys(sampleRecords.records[0].fields).map(fieldName => ({
                name: fieldName,
                type: 'unknown' // We can't determine type without Meta API
            }));
            return {
                name: tableName,
                fields: fields
            };
        }
        return null;
    }
}

/**
 * Create field mapping between Airtable and Supabase
 */
function createFieldMapping(airtableFields, supabaseFields) {
    const mapping = {};
    
    for (const airtableField of airtableFields) {
        const fieldName = airtableField.name;
        const normalizedName = fieldName.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
        
        // Try exact match first
        let supabaseMatch = supabaseFields.find(sf => sf === normalizedName);
        
        // Try partial matches
        if (!supabaseMatch) {
            supabaseMatch = supabaseFields.find(sf => {
                const sfNormalized = sf.replace(/_/g, '');
                const afNormalized = normalizedName.replace(/_/g, '');
                return sfNormalized.includes(afNormalized) || afNormalized.includes(sfNormalized);
            });
        }
        
        // Special mappings for common field names
        if (!supabaseMatch) {
            const specialMappings = {
                'company_name': 'name',
                'job_title': 'title',
                'job_location': 'location',
                'job_description': 'description',
                'job_summary': 'summary',
                'employee_location': 'employee_location',
                'company_role': 'company_role',
                'linkedin_url': 'linkedin_url',
                'head_office': 'head_office',
                'company_size': 'company_size',
                'lead_score': 'lead_score',
                'automation': 'automation_active',
                'website': 'website',
                'priority': 'priority',
                'created': 'created_at',
                'updated': 'updated_at'
            };
            
            supabaseMatch = specialMappings[normalizedName];
        }
        
        if (supabaseMatch) {
            mapping[fieldName] = supabaseMatch;
        }
    }
    
    return mapping;
}

/**
 * Transform Airtable record to Supabase format
 */
function transformAirtableToSupabase(airtableRecord, fieldMapping) {
    const supabaseRecord = {};
    
    for (const [airtableField, supabaseField] of Object.entries(fieldMapping)) {
        let value = airtableRecord.fields[airtableField];
        
        // Handle different data types
        if (value !== undefined && value !== null) {
            // Handle arrays (linked records)
            if (Array.isArray(value)) {
                if (value.length === 1 && typeof value[0] === 'string') {
                    value = value[0]; // Single linked record
                } else {
                    value = value.join(', '); // Multiple values as comma-separated string
                }
            }
            
            // Handle boolean conversions
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true' || value === '1') {
                    value = true;
                } else if (value.toLowerCase() === 'false' || value === '0') {
                    value = false;
                }
            }
            
            // Handle dates
            if (supabaseField.includes('_at') || supabaseField.includes('_date')) {
                if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                    value = new Date(value).toISOString();
                }
            }
            
            supabaseRecord[supabaseField] = value;
        }
    }
    
    return supabaseRecord;
}

/**
 * Get Supabase records for comparison
 */
async function getSupabaseRecords(tableName) {
    console.log(`📊 Fetching Supabase records from ${tableName}...`);
    
    // This would normally use the Supabase client, but since we have MCP access:
    // We'll use the MCP Supabase functions
    try {
        // For now, return empty array - we'll implement this with MCP calls
        return [];
    } catch (error) {
        console.error(`Error fetching Supabase records: ${error.message}`);
        return [];
    }
}

/**
 * Main synchronization function
 */
async function syncAirtableToSupabase() {
    console.log('🚀 Starting comprehensive Airtable to Supabase synchronization...\n');
    
    const syncResults = {
        companies: { airtable: 0, supabase: 0, synced: 0, removed: 0 },
        people: { airtable: 0, supabase: 0, synced: 0, removed: 0 },
        jobs: { airtable: 0, supabase: 0, synced: 0, removed: 0 }
    };
    
    for (const [entityType, airtableTableName] of Object.entries(AIRTABLE_TABLES)) {
        console.log(`\n📋 Processing ${entityType.toUpperCase()} (${airtableTableName})`);
        console.log('='.repeat(50));
        
        try {
            // Get Airtable data
            const airtableRecords = await getAllAirtableRecords(airtableTableName);
            const airtableSchema = await getAirtableSchema(airtableTableName);
            
            syncResults[entityType].airtable = airtableRecords.length;
            console.log(`✅ Found ${airtableRecords.length} records in Airtable`);
            
            if (airtableSchema) {
                console.log(`📝 Schema: ${airtableSchema.fields.length} fields`);
                
                // Show sample field mapping
                const supabaseFields = Object.keys(getSupabaseSchema(entityType));
                const fieldMapping = createFieldMapping(airtableSchema.fields, supabaseFields);
                
                console.log(`🔗 Field mappings (${Object.keys(fieldMapping).length} mapped):`);
                for (const [airtableField, supabaseField] of Object.entries(fieldMapping)) {
                    console.log(`   ${airtableField} → ${supabaseField}`);
                }
                
                // Show sample transformed record
                if (airtableRecords.length > 0) {
                    console.log('\n📄 Sample transformed record:');
                    const sampleTransformed = transformAirtableToSupabase(airtableRecords[0], fieldMapping);
                    console.log(JSON.stringify(sampleTransformed, null, 2));
                }
            }
            
            // Get Supabase data for comparison
            const supabaseRecords = await getSupabaseRecords(entityType);
            syncResults[entityType].supabase = supabaseRecords.length;
            
        } catch (error) {
            console.error(`❌ Error processing ${entityType}: ${error.message}`);
        }
    }
    
    // Print summary
    console.log('\n📊 SYNCHRONIZATION SUMMARY');
    console.log('='.repeat(50));
    for (const [entityType, results] of Object.entries(syncResults)) {
        console.log(`${entityType.toUpperCase()}:`);
        console.log(`  Airtable records: ${results.airtable}`);
        console.log(`  Supabase records: ${results.supabase}`);
        console.log(`  Synced: ${results.synced}`);
        console.log(`  Removed: ${results.removed}`);
    }
    
    return syncResults;
}

/**
 * Get Supabase schema for entity type
 */
function getSupabaseSchema(entityType) {
    const schemas = {
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
    
    return schemas[entityType] || {};
}

// Run the synchronization
syncAirtableToSupabase()
    .then(results => {
        console.log('\n✅ Synchronization analysis completed!');
        console.log('Next steps: Implement actual data sync with Supabase MCP functions');
    })
    .catch(error => {
        console.error('❌ Synchronization failed:', error.message);
        process.exit(1);
    });

export {
    syncAirtableToSupabase,
    getAllAirtableRecords,
    createFieldMapping,
    transformAirtableToSupabase
};
