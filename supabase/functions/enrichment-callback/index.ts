import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface EnrichmentCallbackPayload {
  event_type: 'enrichment_completed' | string;
  job_id?: string;
  company_id?: string;
  company_name?: string;
  leads_found?: number;
  enrichment_source?: string;
  client_id?: string;
  timestamp?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: EnrichmentCallbackPayload = await req.json();

    if (body.event_type !== 'enrichment_completed') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const jobId = body.job_id;
    const companyId = body.company_id;

    if (!jobId && !companyId) {
      return new Response(
        JSON.stringify({ error: 'Missing job_id or company_id' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Determine company and name
    let companyName = body.company_name || '';
    let resolvedCompanyId = companyId || '';

    if (!companyName || !resolvedCompanyId) {
      const { data: company } = await supabase
        .from('companies')
        .select('id, name')
        .eq('id', companyId || '')
        .maybeSingle();
      if (company) {
        companyName = company.name || companyName;
        resolvedCompanyId = company.id || resolvedCompanyId;
      }
    }

    // Find the user who qualified the job to notify
    let userIdToNotify: string | null = null;
    if (jobId && body.client_id) {
      const { data: cj } = await supabase
        .from('client_jobs')
        .select('qualified_by')
        .eq('job_id', jobId)
        .eq('client_id', body.client_id)
        .maybeSingle();
      userIdToNotify = (cj?.qualified_by as string) || null;
    }

    // Fallback: notify all client users if client_id present
    if (!userIdToNotify && body.client_id) {
      const { data: clientUsers } = await supabase
        .from('client_users')
        .select('user_id')
        .eq('client_id', body.client_id);
      if (clientUsers && clientUsers.length > 0) {
        // Notify the first owner/admin if available, else first user
        userIdToNotify = clientUsers[0].user_id as string;
      }
    }

    if (userIdToNotify) {
      await supabase.from('user_notifications').insert({
        user_id: userIdToNotify,
        type: 'company_enriched',
        priority: 'high',
        title: 'Company Enriched',
        message: companyName
          ? `${companyName} enriched with decision makers`
          : 'Company enriched with decision makers',
        action_type: 'navigate',
        action_url: `/companies/${resolvedCompanyId}`,
        action_entity_type: 'company',
        action_entity_id: resolvedCompanyId || null,
        metadata: {
          job_id: jobId,
          company_id: resolvedCompanyId,
          leads_found: body.leads_found,
          enrichment_source: body.enrichment_source,
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('enrichment-callback error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});









