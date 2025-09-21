import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const AIRTABLE_API_URL = 'https://api.airtable.com/v0'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { baseId, tableName, action, data } = await req.json()
    
    const token = Deno.env.get('AIRTABLE_PERSONAL_ACCESS_TOKEN')
    if (!token) {
      throw new Error('Airtable token not configured')
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...corsHeaders
    }

    let response
    const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}`

    switch (action) {
      case 'list':
        response = await fetch(url, { headers })
        break
      case 'create':
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ records: data })
        })
        break
      case 'update':
        response = await fetch(url, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ records: data })
        })
        break
      default:
        throw new Error('Invalid action')
    }

    const result = await response.json()
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.status
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})