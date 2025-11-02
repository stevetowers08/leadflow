import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

interface JobQualificationRequest {
  job_id: string;
  company_id: string;
  client_id?: string;
  user_id?: string;
}

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

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
  supabase: ReturnType<typeof createClient>,
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

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'job-qualification-webhook'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let bodyText: string;
    try {
      bodyText = await request.text();
    } catch (error) {
      return APIErrorHandler.handleError(
        new Error('Invalid request body'),
        'job-qualification-webhook'
      );
    }

    console.log('[Webhook] Raw body:', bodyText);

    let body: JobQualificationRequest;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      return APIErrorHandler.handleError(
        new Error(`Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Parse error'}`),
        'job-qualification-webhook'
      );
    }

    const { job_id, company_id, client_id, user_id } = body;

    console.log('[Webhook] Parsed body:', {
      job_id,
      company_id,
      client_id,
      user_id,
    });

    // Idempotency check
    const eventId = `${job_id}_${client_id || 'default'}_${new Date().toISOString().split('T')[0]}`;
    const { data: existingLog } = await supabase
      .from('webhook_logs')
      .select('id')
      .eq('event_id', eventId)
      .limit(1)
      .maybeSingle();

    if (existingLog) {
      console.log('[Idempotency] Duplicate webhook event detected, ignoring:', eventId);
      return NextResponse.json(
        {
          success: true,
          message: 'Duplicate event ignored',
          event_id: eventId,
        },
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!job_id || !company_id) {
      return APIErrorHandler.handleError(
        new Error('Invalid request: job_id and company_id required'),
        'job-qualification-webhook'
      );
    }

    // Fetch job data
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, company_id, location, description, qualification_status')
      .eq('id', job_id)
      .single();

    if (jobError || !jobData) {
      return APIErrorHandler.handleError(
        new Error('Job not found'),
        'job-qualification-webhook'
      );
    }

    // Fetch client_jobs data
    const { data: clientJobData } = await supabase
      .from('client_jobs')
      .select('qualified_by, qualified_at, notes')
      .eq('job_id', job_id)
      .eq('client_id', client_id || '')
      .maybeSingle();

    // Fetch company data
    const { data: companyData } = await supabase
      .from('companies')
      .select('id, name, website, linkedin_url, industry, company_size, head_office')
      .eq('id', jobData.company_id)
      .single();

    // Prepare payload
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

    // Get webhook URL from database
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'n8n_webhook_url')
      .single();

    const N8N_WEBHOOK_URL = settingsData?.value as string | undefined;
    const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

    // Send webhook to n8n if configured
    if (N8N_WEBHOOK_URL) {
      const webhookHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js-Job-Qualification-Webhook/1.0',
      };

      if (N8N_WEBHOOK_SECRET) {
        const signature = await generateWebhookSignature(payload, N8N_WEBHOOK_SECRET);
        webhookHeaders['X-Webhook-Signature'] = signature;
      }

      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: webhookHeaders,
        body: JSON.stringify(payload),
      });

      await logWebhookEvent(
        supabase,
        job_id,
        payload,
        webhookResponse.ok ? webhookResponse.status : 502,
        eventId
      );
    } else {
      console.warn('N8N_WEBHOOK_URL not configured in system_settings');
      await logWebhookEvent(supabase, job_id, payload, 200, eventId);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        job_id: job_id,
        company_name: payload.company_name,
      },
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing job qualification webhook:', error);
    const errorResponse = APIErrorHandler.handleError(error, 'job-qualification-webhook');
    const headers = new Headers(errorResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    return new NextResponse(errorResponse.body, {
      status: errorResponse.status,
      headers,
    });
  }
}
