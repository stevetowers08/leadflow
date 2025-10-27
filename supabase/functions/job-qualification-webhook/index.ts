/**
 * Job Qualification Webhook Handler
 * Triggers when a job's qualification_status changes to 'qualify'
 * Sends enriched company data to n8n for decision maker enrichment
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// n8n webhook configuration - will be fetched from database
const N8N_WEBHOOK_SECRET = Deno.env.get('N8N_WEBHOOK_SECRET');

interface JobQualificationPayload {
  job_id: string;
  company_id: string;
  company_name: string;
  company_website: string | null;
  company_linkedin_url: string | null;
  job_title: string;
  job_location: string | null;
  job_description: string | null;
  qualification_status: string;
  qualified_at: string;
  qualified_by: string;
  qualification_notes: string | null;
  event_type: 'job_qualified';
  timestamp: string;
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[Webhook] Received POST request');

    // Parse the request body
    const bodyText = await req.text();
    console.log('[Webhook] Raw body:', bodyText);

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('[Webhook] JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', details: parseError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { job_id, company_id, client_id, user_id } = body;
    console.log('[Webhook] Parsed body:', {
      job_id,
      company_id,
      client_id,
      user_id,
    });

    // Idempotency check - prevent duplicate processing within same day
    const eventId = `${job_id}_${client_id}_${new Date().toISOString().split('T')[0]}`;
    const { data: existingLog } = await supabase
      .from('webhook_logs')
      .select('id')
      .eq('event_id', eventId)
      .limit(1)
      .maybeSingle();

    if (existingLog) {
      console.log(
        '[Idempotency] Duplicate webhook event detected, ignoring:',
        eventId
      );
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Duplicate event ignored',
          event_id: eventId,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!job_id || !company_id) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request: job_id and company_id required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch job data
    console.log('[Webhook] Fetching job data for job_id:', job_id);
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select(
        `
        id,
        title,
        company_id,
        location,
        description,
        qualification_status
      `
      )
      .eq('id', job_id)
      .single();

    console.log('[Webhook] Job query result:', { jobData, jobError });

    if (jobError || !jobData) {
      console.error('Error fetching job data:', jobError);
      return new Response(
        JSON.stringify({ error: 'Job not found', details: jobError?.message }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch client_jobs data to get qualified_by and qualified_at
    const { data: clientJobData } = await supabase
      .from('client_jobs')
      .select('qualified_by, qualified_at, notes')
      .eq('job_id', job_id)
      .eq('client_id', client_id)
      .maybeSingle();

    console.log('[Webhook] Client job data:', clientJobData);

    // Fetch company data separately
    const { data: companyData } = await supabase
      .from('companies')
      .select(
        'id, name, website, linkedin_url, industry, company_size, head_office'
      )
      .eq('id', jobData.company_id)
      .single();

    console.log('[Webhook] Company data:', companyData);

    // NOTE: Database trigger now handles client_companies insertion automatically
    // This ensures immediate data consistency (trigger runs before webhook)

    // Prepare payload for n8n
    const payload: JobQualificationPayload = {
      job_id: jobData.id,
      company_id: jobData.company_id || '',
      company_name: companyData?.name || '',
      company_website: companyData?.website || null,
      company_linkedin_url: companyData?.linkedin_url || null,
      job_title: jobData.title,
      job_location: jobData.location,
      job_description: jobData.description,
      qualification_status: 'qualify',
      qualified_at: clientJobData?.qualified_at || new Date().toISOString(),
      qualified_by: clientJobData?.qualified_by || user_id || '',
      qualification_notes: clientJobData?.notes || null,
      event_type: 'job_qualified',
      timestamp: new Date().toISOString(),
    };

    // Get webhook URL from database settings
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'n8n_webhook_url')
      .single();

    const N8N_WEBHOOK_URL = settingsData?.value as string | undefined;

    console.log(
      '[Webhook] Fetched webhook URL from database:',
      N8N_WEBHOOK_URL
    );
    console.log('[Webhook] Payload:', JSON.stringify(payload, null, 2));

    // Send webhook to n8n
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL not configured in system_settings');
      return new Response(
        JSON.stringify({
          error: 'n8n webhook URL not configured in system_settings',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const webhookHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Supabase-Job-Qualification-Webhook/1.0',
    };

    // Add webhook signature if secret is provided
    if (N8N_WEBHOOK_SECRET) {
      const signature = await generateWebhookSignature(
        payload,
        N8N_WEBHOOK_SECRET
      );
      webhookHeaders['X-Webhook-Signature'] = signature;
    }

    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      console.error(
        'Failed to send webhook to n8n:',
        webhookResponse.status,
        webhookResponse.statusText
      );
      // Don't fail the entire request if n8n fails - companies are already added
    }

    // Log the webhook event (with event_id for idempotency)
    await logWebhookEvent(
      job_id,
      payload,
      webhookResponse.ok ? webhookResponse.status : 502,
      eventId
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook sent successfully',
        job_id: job_id,
        company_name: payload.company_name,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing job qualification webhook:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Generate webhook signature for security
 */
async function generateWebhookSignature(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(JSON.stringify(payload))
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Log webhook events for debugging and monitoring
 * Best practice: Log with event_id for idempotency tracking
 */
async function logWebhookEvent(
  jobId: string,
  payload: JobQualificationPayload,
  responseStatus: number,
  eventId?: string
) {
  try {
    const logData: Record<string, unknown> = {
      event_type: 'job_qualification',
      entity_id: jobId,
      entity_type: 'job',
      payload: payload,
      response_status: responseStatus,
      created_at: new Date().toISOString(),
    };

    // Add event_id for idempotency tracking if provided
    if (eventId) {
      logData.event_id = eventId;
    }

    const { error } = await supabase.from('webhook_logs').insert(logData);

    if (error) {
      console.error('Failed to log webhook event:', error);
    } else {
      console.log(`[Webhook] Event logged successfully: ${eventId || jobId}`);
    }
  } catch (error) {
    console.error('Error logging webhook event:', error);
  }
}
