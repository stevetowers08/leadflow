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

// n8n webhook configuration
const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
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

    // Parse the request body
    const { job_id, qualification_status } = await req.json();

    if (!job_id || qualification_status !== 'qualify') {
      return new Response(
        JSON.stringify({
          error: 'Invalid request: job_id required and status must be qualify',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch job and company data
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select(
        `
        id,
        title,
        company_id,
        location,
        description,
        qualification_status,
        qualified_at,
        qualified_by,
        qualification_notes,
        companies (
          id,
          name,
          website,
          linkedin_url,
          industry,
          company_size,
          head_office
        )
      `
      )
      .eq('id', job_id)
      .single();

    if (jobError || !jobData) {
      console.error('Error fetching job data:', jobError);
      return new Response(JSON.stringify({ error: 'Job not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare payload for n8n
    const payload: JobQualificationPayload = {
      job_id: jobData.id,
      company_id: jobData.company_id || '',
      company_name: jobData.companies?.name || '',
      company_website: jobData.companies?.website || null,
      company_linkedin_url: jobData.companies?.linkedin_url || null,
      job_title: jobData.title,
      job_location: jobData.location,
      job_description: jobData.description,
      qualification_status: jobData.qualification_status,
      qualified_at: jobData.qualified_at || new Date().toISOString(),
      qualified_by: jobData.qualified_by || '',
      qualification_notes: jobData.qualification_notes,
      event_type: 'job_qualified',
      timestamp: new Date().toISOString(),
    };

    // Send webhook to n8n
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'n8n webhook URL not configured' }),
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
      return new Response(
        JSON.stringify({
          error: 'Failed to send webhook to n8n',
          status: webhookResponse.status,
          statusText: webhookResponse.statusText,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log the webhook event
    await logWebhookEvent(job_id, payload, webhookResponse.status);

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
 */
async function logWebhookEvent(
  jobId: string,
  payload: JobQualificationPayload,
  responseStatus: number
) {
  try {
    const { error } = await supabase.from('webhook_logs').insert({
      event_type: 'job_qualification',
      entity_id: jobId,
      entity_type: 'job',
      payload: payload,
      response_status: responseStatus,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to log webhook event:', error);
    }
  } catch (error) {
    console.error('Error logging webhook event:', error);
  }
}
