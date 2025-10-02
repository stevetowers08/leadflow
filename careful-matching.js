#!/usr/bin/env node

/**
 * Careful Matching Between Airtable and Supabase
 * 
 * This script carefully matches Supabase people (without airtable_id) 
 * with Airtable people to avoid duplicate updates
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
 * Normalize LinkedIn URL for comparison
 */
function normalizeLinkedInUrl(url) {
    if (!url) return null;
    // Remove trailing slashes and normalize
    return url.replace(/\/$/, '').toLowerCase();
}

/**
 * Normalize name for comparison
 */
function normalizeName(name) {
    if (!name) return '';
    // Convert to lowercase and trim
    return name.toLowerCase().trim();
}

/**
 * Find careful matches between Supabase and Airtable
 */
async function findCarefulMatches() {
    console.log('🔍 Finding Careful Matches Between Supabase and Airtable...\n');
    
    try {
        // Sample Supabase people without airtable_id (from previous query)
        const supabasePeople = [
            { name: "Aaron Berthelot", linkedin_url: "https://www.linkedin.com/in/ACwAAATzHfkBxxd1rkUUDAwDjv5X9t_Vpi6hn1g" },
            { name: "Aaron Thorne", linkedin_url: "https://www.linkedin.com/in/ACwAABGzwZUBA5LAplhseW7ZywUqYZgNT7uwujA" },
            { name: "Abhishek Nigam", linkedin_url: "https://www.linkedin.com/in/ACwAAAIfh94BHkk8hLf3tbr6NUYHp0kXiYJk53E" },
            { name: "Adam Beavis", linkedin_url: "https://www.linkedin.com/in/adambeavis" },
            { name: "Adam Brew", linkedin_url: "https://www.linkedin.com/in/ACwAAAhAqd0Bjs5Lwxsp7wy9DT87z-7eXIZ8vqo" },
            { name: "Adam Duncan", linkedin_url: "https://www.linkedin.com/in/ACwAABIRrgMBeRq8C32gXuza-3DnpydClkc6kgI" },
            { name: "Adam Furness, GAICD", linkedin_url: "https://www.linkedin.com/in/ACwAAAGjvXwBK7N2PovSM8bhD4dgLzkrNer7-Nc" },
            { name: "Adam Maine", linkedin_url: "https://www.linkedin.com/in/ACwAAAJwrrABLmGhjluE_TVDochkNzu69dgCrRw" },
            { name: "Adrian Towsey", linkedin_url: "https://www.linkedin.com/in/adriantowsey" },
            { name: "Adrian Valois", linkedin_url: "https://www.linkedin.com/in/ACwAABAXBnUBaOY1Vl_Lm1GYO2HAEE2RuRfT_P8" }
        ];
        
        // Get Airtable people
        const airtablePeople = await getAllAirtableRecords('People');
        console.log(`📊 Airtable has ${airtablePeople.length} people records`);
        
        // Create lookup maps for Airtable people
        const airtableByName = new Map();
        const airtableByLinkedIn = new Map();
        
        airtablePeople.forEach(person => {
            const name = normalizeName(person.fields['Name']);
            const linkedin = normalizeLinkedInUrl(person.fields['LinkedIn URL'] || person.fields['LinkedIn']);
            
            if (name) {
                airtableByName.set(name, person);
            }
            if (linkedin) {
                airtableByLinkedIn.set(linkedin, person);
            }
        });
        
        console.log('\n🔍 MATCHING ANALYSIS:');
        console.log('='.repeat(50));
        
        let matchCount = 0;
        const matches = [];
        
        supabasePeople.forEach((supabasePerson, index) => {
            const supabaseName = normalizeName(supabasePerson.name);
            const supabaseLinkedIn = normalizeLinkedInUrl(supabasePerson.linkedin_url);
            
            console.log(`\n${index + 1}. Supabase: "${supabasePerson.name}"`);
            console.log(`   LinkedIn: ${supabasePerson.linkedin_url}`);
            
            // Check for name match
            const nameMatch = airtableByName.get(supabaseName);
            if (nameMatch) {
                console.log(`   ✅ NAME MATCH: "${nameMatch.fields['Name']}" (${nameMatch.id})`);
                console.log(`      Stage: ${nameMatch.fields['Stage']} | Role: ${nameMatch.fields['Company Role']}`);
                matchCount++;
                matches.push({
                    type: 'name',
                    supabase: supabasePerson,
                    airtable: nameMatch
                });
                return;
            }
            
            // Check for LinkedIn match
            const linkedInMatch = airtableByLinkedIn.get(supabaseLinkedIn);
            if (linkedInMatch) {
                console.log(`   ✅ LINKEDIN MATCH: "${linkedInMatch.fields['Name']}" (${linkedInMatch.id})`);
                console.log(`      Stage: ${linkedInMatch.fields['Stage']} | Role: ${linkedInMatch.fields['Company Role']}`);
                matchCount++;
                matches.push({
                    type: 'linkedin',
                    supabase: supabasePerson,
                    airtable: linkedInMatch
                });
                return;
            }
            
            console.log(`   ❌ NO MATCH FOUND`);
        });
        
        console.log('\n' + '='.repeat(50));
        console.log(`📊 SUMMARY: Found ${matchCount} matches out of ${supabasePeople.length} Supabase people`);
        
        if (matches.length > 0) {
            console.log('\n🎯 SAFE UPDATE QUERIES FOR MATCHED RECORDS:');
            console.log('='.repeat(50));
            
            matches.forEach((match, index) => {
                const airtablePerson = match.airtable;
                const supabasePerson = match.supabase;
                const fields = airtablePerson.fields;
                
                const name = (fields['Name'] || '').replace(/'/g, "''");
                const role = (fields['Company Role'] || '').replace(/'/g, "''");
                const location = (fields['Employee Location'] || '').replace(/'/g, "''");
                const linkedin = fields['LinkedIn URL'] || fields['LinkedIn'] || null;
                const stage = mapStage(fields['Stage']);
                const confidence = fields['Confidence Level'] || null;
                const leadSource = (fields['Lead Source'] || '').replace(/'/g, "''");
                const automationStarted = fields['Automation'] ? 'NOW()' : 'NULL';
                
                console.log(`\n-- Match ${index + 1}: Update "${name}" (${match.type} match)`);
                console.log(`-- Supabase stage: ${supabasePerson.stage || 'unknown'} -> Airtable stage: ${stage}`);
                
                const updateQuery = `UPDATE people SET 
    airtable_id = '${airtablePerson.id}',
    company_role = '${role}',
    employee_location = '${location}',
    stage = '${stage}',
    confidence_level = ${confidence ? `'${confidence}'` : 'NULL'},
    lead_source = '${leadSource}',
    automation_started_at = ${automationStarted},
    updated_at = NOW()
WHERE ${match.type === 'name' ? 
    `LOWER(name) = LOWER('${name}')` : 
    `linkedin_url = '${linkedin}'`}
  AND airtable_id IS NULL;`;
                
                console.log(updateQuery);
            });
        }
        
        return {
            totalSupabase: supabasePeople.length,
            totalAirtable: airtablePeople.length,
            matches: matches.length
        };
        
    } catch (error) {
        console.error(`❌ Error finding matches: ${error.message}`);
        throw error;
    }
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
        'REPLIED': 'replied',
        'MEETING BOOKED': 'meeting_booked',
        'MEETING HELD': 'meeting_held',
        'DISQUALIFIED': 'disqualified',
        'IN QUEUE': 'in_queue',
        'LEAD LOST': 'lead_lost'
    };
    
    return stageMapping[airtableStage] || 'new';
}

// Run the careful matching
findCarefulMatches()
    .then(results => {
        console.log('\n🎉 Careful matching analysis completed!');
        console.log(`📊 Results: ${results.matches} matches found`);
        console.log(`   Supabase people (no airtable_id): ${results.totalSupabase}`);
        console.log(`   Airtable people: ${results.totalAirtable}`);
        console.log('\n💡 Execute the safe update queries above to sync matched records');
    })
    .catch(error => {
        console.error('❌ Matching analysis failed:', error.message);
        process.exit(1);
    });
