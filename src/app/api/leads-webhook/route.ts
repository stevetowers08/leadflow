import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createLead } from '@/services/leadsService';
import crypto from 'crypto';
import type { Json } from '@/integrations/supabase/types';

/**
 * Webhook Event Types (Attio-style)
 * Similar to Attio's event-based webhook system
 */
type WebhookEventType = 'lead.created' | 'lead.updated' | 'lead.batch';

interface LeadWebhookPayload {
  // Event metadata (Attio-style)
  event?: WebhookEventType;
  idempotency_key?: string; // Prevents duplicate processing
  timestamp?: string; // ISO timestamp

  // Required fields
  first_name?: string;
  last_name?: string;
  email?: string;
  company?: string;

  // Optional fields
  job_title?: string;
  phone?: string;
  quality_rank?: 'hot' | 'warm' | 'cold';
  show_name?: string;
  show_date?: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  scan_image_url?: string;

  // Metadata
  source?: string; // e.g., 'webhook', 'api', 'external', 'attio', 'clay'
  user_id?: string; // Optional: if not provided, will use authenticated user

  // Batch support (Attio-style)
  data?: LeadWebhookPayload[]; // For batch operations
}

interface WebhookResponse {
  success: boolean;
  lead_id?: string;
  lead_ids?: string[]; // For batch operations
  message?: string;
  error?: string;
  duplicate?: boolean; // Indicates if lead already exists
  enrichment_callback_url?: string; // Callback URL for enrichment (2026 best practice)
}

// CORS headers - configurable origin (more secure than *)
const getCorsHeaders = (origin?: string | null) => {
  const allowedOrigins = process.env.ALLOWED_WEBHOOK_ORIGINS?.split(',') || [];
  const originHeader = origin && allowedOrigins.includes(origin) ? origin : '*';

  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-webhook-signature, x-idempotency-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

/**
 * Verify HMAC-SHA256 webhook signature (2025 best practice)
 * Uses timing-safe comparison to prevent timing attacks
 * Supports common formats: "sha256=..." or plain hex
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Remove "sha256=" prefix if present (common in webhook signatures)
    const cleanSignature = signature.replace(/^sha256=/, '').trim();

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Ensure both signatures are the same length before comparison
    if (cleanSignature.length !== expectedSignature.length) {
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Check for duplicate lead by email (idempotency)
 * Returns existing lead if found, null otherwise
 */
async function checkDuplicateLead(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  email: string | null | undefined
): Promise<string | null> {
  if (!email) return null;

  const { data } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  return data?.id || null;
}

/**
 * Check idempotency key to prevent duplicate processing
 * Returns true if already processed, false otherwise
 */
async function checkIdempotencyKey(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  idempotencyKey: string
): Promise<boolean> {
  // Check if we've seen this idempotency key before
  // In production, you'd use a dedicated idempotency table or cache
  // For now, we'll use a simple check against existing leads metadata
  // TODO: Implement proper idempotency key storage (Redis or dedicated table)
  return false;
}

/**
 * Log webhook event for audit trail
 */
async function logWebhookEvent(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  event: {
    event_type: string;
    payload: unknown;
    success: boolean;
    error?: string;
    lead_id?: string;
  }
): Promise<void> {
  try {
    // Log to activity_log or dedicated webhook_logs table
    await supabase.from('activity_log').insert({
      activity_type: 'webhook_received',
      metadata: {
        event_type: event.event_type,
        payload: event.payload,
        success: event.success,
        error: event.error,
        lead_id: event.lead_id,
        timestamp: new Date().toISOString(),
      } as unknown as Json,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Don't fail webhook if logging fails
    console.error('Failed to log webhook event:', error);
  }
}

/**
 * Process a single lead creation
 */
async function processLeadCreation(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  payload: LeadWebhookPayload
): Promise<{ lead_id: string; duplicate: boolean }> {
  // Validate required fields
  if (!payload.first_name || !payload.last_name || !payload.company) {
    throw new Error(
      'Missing required fields: first_name, last_name, and company are required'
    );
  }

  // Check for duplicate by email (idempotency)
  const existingLeadId = await checkDuplicateLead(supabase, payload.email);
  if (existingLeadId) {
    return { lead_id: existingLeadId, duplicate: true };
  }

  // Create the lead
  const lead = await createLead({
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email || null,
    company: payload.company,
    job_title: payload.job_title || null,
    phone: payload.phone || null,
    quality_rank: payload.quality_rank || 'warm',
    show_name: payload.show_name || null,
    show_date: payload.show_date || null,
    notes: payload.notes || null,
    scan_image_url: payload.scan_image_url || null,
    user_id: payload.user_id || null,
  });

  // Set enrichment status to pending (will be updated when n8n sends enrichment data back)
  await supabase
    .from('leads')
    .update({
      enrichment_status: 'pending',
      updated_at: new Date().toISOString(),
    })
    .eq('id', lead.id);

  // Webhook is one-way only - enrichment will be sent back via n8n workflow
  // No enrichment trigger here - handled externally

  return { lead_id: lead.id, duplicate: false };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const supabase = createServerSupabaseClient();

    // Get raw body for signature verification (must be before parsing)
    const bodyText = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    const idempotencyKey = request.headers.get('x-idempotency-key');

    // Verify webhook signature (2025 best practice: always verify if secret is set)
    const webhookSecret = process.env.LEADS_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing webhook signature',
          },
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const isValid = verifyWebhookSignature(
        bodyText,
        signature,
        webhookSecret
      );
      if (!isValid) {
        console.error('Invalid webhook signature');
        await logWebhookEvent(supabase, {
          event_type: 'lead.webhook.invalid_signature',
          payload: { hasSignature: !!signature },
          success: false,
          error: 'Invalid webhook signature',
        });

        return NextResponse.json(
          {
            success: false,
            error: 'Invalid webhook signature',
          },
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Parse the webhook payload
    let payload: LeadWebhookPayload;
    try {
      payload = JSON.parse(bodyText);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload',
        },
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check idempotency key (Attio-style)
    if (idempotencyKey) {
      const alreadyProcessed = await checkIdempotencyKey(
        supabase,
        idempotencyKey
      );
      if (alreadyProcessed) {
        return NextResponse.json(
          {
            success: true,
            message: 'Request already processed',
            duplicate: true,
          },
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const eventType = payload.event || 'lead.created';

    // Handle batch operations (Attio-style)
    if (
      eventType === 'lead.batch' &&
      payload.data &&
      Array.isArray(payload.data)
    ) {
      const results: WebhookResponse[] = [];
      const leadIds: string[] = [];
      let duplicateCount = 0;

      for (const item of payload.data) {
        try {
          const result = await processLeadCreation(supabase, item);
          leadIds.push(result.lead_id);
          if (result.duplicate) duplicateCount++;
        } catch (error) {
          console.error('Error processing batch item:', error);
          // Continue processing other items
        }
      }

      // Generate enrichment callback URL for batch
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
      const callbackUrl = `${siteUrl}/api/leads-enrichment-callback`;

      const response: WebhookResponse = {
        success: true,
        lead_ids: leadIds,
        message: `Processed ${leadIds.length} leads${duplicateCount > 0 ? ` (${duplicateCount} duplicates)` : ''}`,
        enrichment_callback_url: callbackUrl, // Include callback URL for n8n
      };

      await logWebhookEvent(supabase, {
        event_type: eventType,
        payload: { batch_size: payload.data.length },
        success: true,
        lead_id: leadIds[0], // First lead ID for reference
      });

      return NextResponse.json(response, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle single lead creation
    const result = await processLeadCreation(supabase, payload);

    // Generate enrichment callback URL (simple, dynamic based on site URL)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const callbackUrl = `${siteUrl}/api/leads-enrichment-callback`;

    const response: WebhookResponse = {
      success: true,
      lead_id: result.lead_id,
      message: result.duplicate
        ? 'Lead already exists'
        : 'Lead created successfully',
      duplicate: result.duplicate,
      enrichment_callback_url: callbackUrl, // Include callback URL for n8n
    };

    await logWebhookEvent(supabase, {
      event_type: eventType,
      payload: { email: payload.email, company: payload.company },
      success: true,
      lead_id: result.lead_id,
    });

    const processingTime = Date.now() - startTime;
    console.log(`Lead webhook processed in ${processingTime}ms:`, {
      event: eventType,
      lead_id: result.lead_id,
      duplicate: result.duplicate,
    });

    return NextResponse.json(response, {
      status: result.duplicate ? 200 : 201, // 201 Created for new resources
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Leads webhook error:', error);

    const supabase = createServerSupabaseClient();
    await logWebhookEvent(supabase, {
      event_type: 'lead.webhook.error',
      payload: {},
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Return appropriate status codes
    // 400: Client errors (validation, bad request)
    // 500: Server errors (database, internal)
    const isClientError =
      error instanceof Error &&
      (error.message.includes('Missing required fields') ||
        error.message.includes('Invalid') ||
        error.message.includes('Failed to create lead'));

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status: isClientError ? 400 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
