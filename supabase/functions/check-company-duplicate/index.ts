import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface CheckDuplicateRequest {
  domain?: string;
  linkedin_url?: string;
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: CheckDuplicateRequest = await req.json();

    // Call the database function
    const { data, error } = await supabase.rpc('check_company_exists', {
      p_domain: body.domain || null,
      p_linkedin_url: body.linkedin_url || null,
    });

    if (error) {
      console.error('Database function error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = data[0];

    return new Response(
      JSON.stringify({
        company_id: result.company_id,
        exists: result.company_exists,
        message: result.company_exists
          ? 'Company already exists in database'
          : 'Company not found, proceed with enrichment',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
