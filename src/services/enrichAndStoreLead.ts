/**
 * Lead Enrichment Service
 * Calls n8n webhook to enrich lead data and stores it in the database
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
const N8N_ENRICHMENT_WEBHOOK_URL = process.env.N8N_ENRICHMENT_WEBHOOK_URL!;
const N8N_API_KEY = process.env.N8N_API_KEY!;
const ENRICHMENT_TIMEOUT_MS = 60000; // 60 seconds

interface EnrichAndStoreParams {
  lead_id: string;
  company?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  linkedin_url?: string;
}

interface EnrichmentResult {
  success: boolean;
  message: string;
  likelihood?: number;
  enriched_data?: SimplifiedEnrichmentData;
  error?: string;
}

/**
 * Validate enrichment parameters
 */
function validateParams(params: EnrichAndStoreParams): string | null {
  if (!params.lead_id) return 'lead_id is required';
  if (!params.email && !params.first_name && !params.last_name) {
    return 'At least one of email, first_name, or last_name is required';
  }
  return null;
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
    return; // No company data to enrich
  }

  // Get lead's company name
  const { data: lead } = await supabase
    .from('leads')
    .select('company')
    .eq('id', leadId)
    .single();

  const companyNameToUse = lead?.company || companyName;
  if (!companyNameToUse) return;

  // Find or create company
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
    // Update existing company
    await supabase
      .from('companies')
      .update(companyUpdate)
      .eq('id', existingCompany.id);
  } else {
    // Create new company
    await supabase.from('companies').insert({
      name: toTitleCase(companyNameToUse) || companyNameToUse,
      ...companyUpdate,
    });
  }
}

/**
 * Enrich a lead and store the result
 */
export async function enrichAndStoreLead(
  params: EnrichAndStoreParams
): Promise<EnrichmentResult> {
  // Validate configuration
  if (!N8N_ENRICHMENT_WEBHOOK_URL || !N8N_API_KEY) {
    return {
      success: false,
      message: 'Enrichment webhook not configured',
      error: 'N8N_ENRICHMENT_WEBHOOK_URL or N8N_API_KEY missing',
    };
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      success: false,
      message: 'Supabase not configured',
      error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing',
    };
  }

  // Validate parameters
  const validationError = validateParams(params);
  if (validationError) {
    return {
      success: false,
      message: validationError,
      error: 'Invalid parameters',
    };
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

      // Store error details in database before throwing
      const errorData = {
        error: fullErrorMessage,
        error_code: response.status,
        error_message: errorMessage || null,
        error_details: errorDetails,
        failed_at: new Date().toISOString(),
      };

      await supabase
        .from('leads')
        .update({
          enrichment_status: 'failed',
          enrichment_timestamp: new Date().toISOString(),
          enrichment_data: errorData as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.lead_id);

      // Return error result instead of throwing (to preserve error details)
      return {
        success: false,
        message: 'Failed to enrich lead',
        error: fullErrorMessage,
      };
    }

    // Parse response
    const data = await response.json();
    const enrichmentArray: PDLEnrichmentResponse[] = Array.isArray(data)
      ? data
      : [data];
    const pdlResponse = enrichmentArray[0];

    if (!pdlResponse || !pdlResponse.data || pdlResponse.status !== 200) {
      await updateEnrichmentStatus(supabase, params.lead_id, 'failed');
      return {
        success: false,
        message: 'No enrichment data found for this lead',
      };
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

    return {
      success: true,
      message: 'Lead enriched successfully',
      likelihood: pdlResponse.likelihood,
      enriched_data: simplifiedData,
    };
  } catch (error) {
    console.error('Error enriching lead:', error);

    // Only store error if not already stored (network errors, timeouts, etc.)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Check if error details were already stored (from response.ok check)
    const { data: existingLead } = await supabase
      .from('leads')
      .select('enrichment_data')
      .eq('id', params.lead_id)
      .single();

    // Only update if error wasn't already stored
    if (
      !existingLead?.enrichment_data ||
      !(existingLead.enrichment_data as Record<string, unknown>)?.error_code
    ) {
      await supabase
        .from('leads')
        .update({
          enrichment_status: 'failed',
          enrichment_timestamp: new Date().toISOString(),
          enrichment_data: {
            error: errorMessage,
            error_type: error instanceof Error ? error.name : 'Unknown',
            error_stack: errorStack?.substring(0, 1000) || null,
            failed_at: new Date().toISOString(),
          } as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.lead_id);
    }

    return {
      success: false,
      message: 'Failed to enrich lead',
      error: errorMessage,
    };
  }
}
