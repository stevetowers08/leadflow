import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const AIRTABLE_API_URL = 'https://api.airtable.com/v0'
const BASE_ID = 'appcc1jJqJLZRcshk'
const TABLE_ID = 'tblMJJMVfpmlDDv6x'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting Airtable sync...')
    
    const airtableToken = Deno.env.get('AIRTABLE_PERSONAL_ACCESS_TOKEN')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!airtableToken || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables')
    }

    // Fetch data from Airtable
    const airtableResponse = await fetch(
      `${AIRTABLE_API_URL}/${BASE_ID}/${TABLE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${airtableToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!airtableResponse.ok) {
      throw new Error(`Airtable API error: ${airtableResponse.statusText}`)
    }

    const airtableData = await airtableResponse.json()
    console.log(`Fetched ${airtableData.records?.length || 0} records from Airtable`)

    if (!airtableData.records || airtableData.records.length === 0) {
      console.log('No records found in Airtable')
      return new Response(JSON.stringify({ message: 'No records to sync' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Transform Airtable data to match our schema
    const companies = airtableData.records.map((record: any) => ({
      name: record.fields.Name || record.fields.name || `Company ${record.id}`,
      industry: record.fields.Industry || record.fields.industry || null,
      email: record.fields.Email || record.fields.email || null,
      phone: record.fields.Phone || record.fields.phone || null,
      website: record.fields.Website || record.fields.website || null,
      address: record.fields.Address || record.fields.address || null,
      status: (record.fields.Status || record.fields.status || 'prospect').toLowerCase(),
      notes: record.fields.Notes || record.fields.notes || null,
    }))

    // Insert data into Supabase
    const supabaseResponse = await fetch(
      `${supabaseUrl}/rest/v1/companies`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(companies)
      }
    )

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      throw new Error(`Supabase error: ${supabaseResponse.statusText} - ${errorText}`)
    }

    const result = await supabaseResponse.json()
    console.log(`Successfully synced ${companies.length} companies`)

    return new Response(JSON.stringify({ 
      message: `Successfully synced ${companies.length} companies`,
      synced: companies.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error: any) {
    console.error('Sync error:', error.message)
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})