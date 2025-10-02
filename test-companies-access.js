#!/usr/bin/env node

const AIRTABLE_TOKEN = 'patdAb0U3YW81fton.0f50eea87e1ee7adcc1eb3fd109b61bde55bc9a5e6b96d90fe2fd7fb4faba9a4';
const BASE_ID = 'appcc1jJqJLZRcshk';

async function testCompaniesAccess() {
    console.log('🔍 Testing Companies table access...');
    
    try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Companies?pageSize=5`, {
            headers: { 
                'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Companies table accessible!');
            console.log(`Found ${data.records.length} sample records`);
            data.records.forEach((record, i) => {
                console.log(`${i+1}. ${record.fields['Name'] || 'Unnamed'} (${record.id})`);
                console.log(`   Website: ${record.fields['Website'] || 'N/A'}`);
                console.log(`   LinkedIn: ${record.fields['LinkedIn URL'] || 'N/A'}`);
            });
        } else {
            const error = await response.text();
            console.log('❌ Companies table not accessible:', response.status);
            console.log('Error:', error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testCompaniesAccess();
