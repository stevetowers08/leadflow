/**
 * Automatic Lead Enrichment Webhook Service
 *
 * Triggers n8n webhook automatically when leads are created/approved.
 * n8n workflow is configured to "respond when last node finishes" (synchronous).
 *
 * Best Practices:
 * - Fire-and-forget pattern (doesn't block lead creation)
 * - Proper timeout handling (60s, n8n Cloud has 100s limit)
 * - Status tracking (pending → enriching → completed/failed)
 * - Error handling with retry capability
 */

import { createClient } from '@supabase/supabase-js';
import type {
  PDLEnrichmentResponse,
  SimplifiedEnrichmentData,
} from '@/types/peopleDataLabs';
import { simplifyEnrichmentData } from '@/services/peopleDataLabsService';
import { toTitleCase } from '@/utils/textFormatting';
import type { Json } from '@/integrations/supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const N8N_ENRICHMENT_WEBHOOK_URL = process.env.N8N_ENRICHMENT_WEBHOOK_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;
const ENRICHMENT_TIMEOUT_MS = 60000; // 60 seconds (n8n Cloud limit is 100s)

interface EnrichmentWebhookParams {
  lead_id: string;
  company?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  linkedin_url?: string;
}

/**
 * Update lead enrichment status
 */
async function updateEnrichmentStatus(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  status: 'pending' | 'enriching' | 'completed' | 'failed',
  enrichmentData?: SimplifiedEnrichmentData | null
): Promise<void> {
  await supabase
    .from('leads')
    .update({
      enrichment_status: status,
      enrichment_timestamp: new Date().toISOString(),
      enrichment_data: enrichmentData
        ? (enrichmentData as unknown as Json)
        : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);
}

/**
 * Enrich company data from PDL response
 */
async function enrichCompany(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  pdlData: PDLEnrichmentResponse['data']
): Promise<void> {
  const companyName = pdlData.job_company_name;
  const companyLinkedIn = pdlData.job_company_linkedin_url;
  const companySize = pdlData.job_company_size;
  const companyWebsite = pdlData.job_company_website;

  if (!companyName && !companyLinkedIn && !companySize) {
    return;
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('company')
    .eq('id', leadId)
    .single();

  const companyNameToUse = lead?.company || companyName;
  if (!companyNameToUse) return;

  const { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .eq('name', toTitleCase(companyNameToUse) || companyNameToUse)
    .maybeSingle();

  const companyUpdate: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (companyLinkedIn) companyUpdate.linkedin_url = companyLinkedIn;
  if (companySize) companyUpdate.company_size = companySize;
  if (companyWebsite) companyUpdate.website = companyWebsite;

  if (existingCompany) {
    await supabase
      .from('companies')
      .update(companyUpdate)
      .eq('id', existingCompany.id);
  } else {
    await supabase.from('companies').insert({
      name: toTitleCase(companyNameToUse) || companyNameToUse,
      ...companyUpdate,
    });
  }
}

/**
 * Trigger enrichment webhook and process response
 * Called automatically when lead is created/approved
 */
export async function triggerEnrichmentWebhook(
  params: EnrichmentWebhookParams
): Promise<void> {
  // Skip if not configured
  if (!N8N_ENRICHMENT_WEBHOOK_URL || !N8N_API_KEY) {
    console.log('Enrichment webhook not configured, skipping');
    return;
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase not configured for enrichment');
    return;
  }

  // Validate required fields
  if (!params.email && !params.first_name && !params.last_name) {
    console.log(
      `Skipping enrichment for lead ${params.lead_id}: insufficient data`
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Set status to enriching
    await updateEnrichmentStatus(supabase, params.lead_id, 'enriching');

    // Call n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      ENRICHMENT_TIMEOUT_MS
    );

    let response: Response;
    try {
      response = await fetch(N8N_ENRICHMENT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': N8N_API_KEY,
        },
        body: JSON.stringify({
          lead_id: params.lead_id,
          company: params.company,
          email: params.email,
          first_name: params.first_name,
          last_name: params.last_name,
          linkedin_url: params.linkedin_url,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Enrichment request timed out');
      }
      throw error;
    }

    if (!response.ok) {
      // Clone response to read error body (can only read once)
      const responseClone = response.clone();

      // Try to get error details from response
      let errorDetails: string | null = null;
      let errorMessage = '';

      try {
        const errorBody = await responseClone.text();
        if (errorBody) {
          try {
            const errorJson = JSON.parse(errorBody);
            errorDetails = JSON.stringify(errorJson);
            // Extract message if available
            if (errorJson.message) {
              errorMessage = errorJson.message;
            } else if (errorJson.error) {
              errorMessage =
                typeof errorJson.error === 'string'
                  ? errorJson.error
                  : JSON.stringify(errorJson.error);
            } else {
              errorMessage = errorDetails;
            }
          } catch {
            errorDetails = errorBody.substring(0, 1000); // Limit length
            errorMessage = errorDetails;
          }
        }
      } catch (e) {
        // If we can't read error body, just use status
        console.error('Failed to read error response body:', e);
      }

      const fullErrorMessage = `n8n webhook returned ${response.status}${errorMessage ? `: ${errorMessage}` : ''}`;

      // Store error details in database
      await supabase
        .from('leads')
        .update({
          enrichment_status: 'failed',
          enrichment_timestamp: new Date().toISOString(),
          enrichment_data: {
            error: fullErrorMessage,
            error_code: response.status,
            error_message: errorMessage || null,
            error_details: errorDetails,
            failed_at: new Date().toISOString(),
          } as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.lead_id);

      throw new Error(fullErrorMessage);
    }

    // Parse response (n8n returns data when last node finishes)
    const data = await response.json();
    const enrichmentArray: PDLEnrichmentResponse[] = Array.isArray(data)
      ? data
      : [data];
    const pdlResponse = enrichmentArray[0];

    if (!pdlResponse || !pdlResponse.data || pdlResponse.status !== 200) {
      // Store failure reason in enrichment_data
      const failureReason = !pdlResponse
        ? 'No response from PDL'
        : pdlResponse.status !== 200
          ? `PDL returned status ${pdlResponse.status}`
          : 'No data in PDL response';

      await supabase
        .from('leads')
        .update({
          enrichment_status: 'failed',
          enrichment_timestamp: new Date().toISOString(),
          enrichment_data: {
            error: failureReason,
            pdl_status: pdlResponse?.status || null,
            failed_at: new Date().toISOString(),
          } as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.lead_id);
      return;
    }

    // Simplify and store enrichment data
    const simplifiedData = simplifyEnrichmentData(pdlResponse);

    await supabase
      .from('leads')
      .update({
        enrichment_data: simplifiedData as unknown as Json,
        enrichment_timestamp: new Date().toISOString(),
        enrichment_status: 'completed',
        linkedin_url: simplifiedData.linkedin_url || undefined,
        job_title: simplifiedData.job_title || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.lead_id);

    // Enrich company data if available
    await enrichCompany(supabase, params.lead_id, pdlResponse.data);

    // Log activity
    await supabase.from('activity_log').insert({
      lead_id: params.lead_id,
      activity_type: 'lead_updated',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'pdl_enrichment',
        likelihood: pdlResponse.likelihood,
        enriched_at: new Date().toISOString(),
      } as unknown as Json,
    });
  } catch (error) {
    console.error(`Error enriching lead ${params.lead_id}:`, error);

    // Store detailed error information
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    await supabase
      .from('leads')
      .update({
        enrichment_status: 'failed',
        enrichment_timestamp: new Date().toISOString(),
        enrichment_data: {
          error: errorMessage,
          error_type: error instanceof Error ? error.name : 'Unknown',
          error_stack: errorStack?.substring(0, 1000) || null, // Limit stack trace length
          failed_at: new Date().toISOString(),
        } as unknown as Json,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.lead_id);

    // Log to activity log for tracking
    await supabase
      .from('activity_log')
      .insert({
        lead_id: params.lead_id,
        activity_type: 'lead_updated',
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'pdl_enrichment',
          error: errorMessage,
          failed_at: new Date().toISOString(),
        } as unknown as Json,
      })
      .catch(err => {
        console.error('Failed to log enrichment error:', err);
      });
  }
}
