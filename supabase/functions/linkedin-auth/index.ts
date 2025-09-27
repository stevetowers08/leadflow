import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
    const redirectUri = Deno.env.get('LINKEDIN_REDIRECT_URI')

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables')
    }

    if (!clientId || !redirectUri) {
      throw new Error('Missing required LinkedIn environment variables: LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    const requestBody = await req.json()
    const { userId } = requestBody

    if (!userId) {
      throw new Error('User ID is required')
    }

    // Generate LinkedIn OAuth URL
    const state = btoa(JSON.stringify({ userId, timestamp: Date.now() }))
    const scopes = 'r_liteprofile,r_emailaddress,w_messaging'

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=${scopes}`

    return new Response(
      JSON.stringify({ 
        success: true,
        authUrl,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('LinkedIn auth error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to generate LinkedIn auth URL',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('required') ? 400 : 500,
      },
    )
  }
})



