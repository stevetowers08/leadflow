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
import { findOrCreateCompany } from '@/services/companiesService';
import { toTitleCase } from '@/utils/textFormatting';
import type { Json } from '@/integrations/supabase/types';
import { getOrStoreCompanyLogo } from '@/services/logoService';

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
/**
 * Extract domain from website URL
 */
function extractDomain(website: string | undefined | null): string | null {
  if (!website) return null;
  try {
    // Remove protocol if present
    const url = website.replace(/^https?:\/\//, '').replace(/^www\./, '');
    // Extract domain (everything before first /)
    const domain = url.split('/')[0].toLowerCase();
    return domain || null;
  } catch {
    return null;
  }
}

/**
 * Build location string from PDL location data
 * Extracts from experience[].company.location (primary/current job)
 */
function buildLocationString(
  pdlData: PDLEnrichmentResponse['data']
): string | null {
  // Try to get location from primary/current job experience
  const primaryExperience = pdlData.experience?.find(exp => exp.is_primary);
  const companyLocation = primaryExperience?.company?.location;

  if (companyLocation) {
    const parts: string[] = [];

    if (companyLocation.street_address) {
      parts.push(companyLocation.street_address);
    }
    if (companyLocation.locality) {
      parts.push(companyLocation.locality);
    }
    if (companyLocation.region) {
      parts.push(companyLocation.region);
    }
    if (companyLocation.postal_code) {
      parts.push(companyLocation.postal_code);
    }
    if (companyLocation.country) {
      parts.push(companyLocation.country);
    }

    // Use location name if we have parts, otherwise fallback to name field
    if (parts.length > 0) {
      return parts.join(', ');
    }
    if (companyLocation.name) {
      return companyLocation.name;
    }
  }

  return null;
}

async function enrichCompany(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  pdlData: PDLEnrichmentResponse['data']
): Promise<void> {
  // Extract company data from PDL response
  // Try to get from primary/current job experience first (most reliable)
  const primaryExperience = pdlData.experience?.find(exp => exp.is_primary);
  const companyFromExperience = primaryExperience?.company;

  const companyName = companyFromExperience?.name || pdlData.job_company_name;
  const companyLinkedIn =
    companyFromExperience?.linkedin_url || pdlData.job_company_linkedin_url;
  const companySize = companyFromExperience?.size || pdlData.job_company_size;
  const companyWebsite =
    companyFromExperience?.website || pdlData.job_company_website;
  const companyIndustry =
    companyFromExperience?.industry || pdlData.job_company_industry;
  const companyLocation = buildLocationString(pdlData);
  const companyFounded = companyFromExperience?.founded;

  // Extract domain from website (always extract, even if website exists)
  const companyDomain = extractDomain(companyWebsite);

  // Get lead's company name first
  const { data: lead } = await supabase
    .from('leads')
    .select('company')
    .eq('id', leadId)
    .single();

  // Use lead's company name if available, otherwise use PDL company name
  const companyNameToUse = lead?.company || companyName;

  // Only proceed if we have at least a company name OR LinkedIn URL (for matching)
  if (!companyNameToUse && !companyLinkedIn) {
    return;
  }

  // First try to find existing company by LinkedIn URL (most reliable - prevents duplicates)
  let companyId: string | null = null;
  if (companyLinkedIn) {
    const { data: existingByLinkedIn } = await supabase
      .from('companies')
      .select('id')
      .eq('linkedin_url', companyLinkedIn)
      .maybeSingle();

    if (existingByLinkedIn?.id) {
      companyId = existingByLinkedIn.id;
    }
  }

  // If not found by LinkedIn, find or create by name
  if (!companyId && companyNameToUse) {
    companyId = await findOrCreateCompany(
      companyNameToUse,
      {
        website: companyWebsite || null,
        linkedin_url: companyLinkedIn || null,
        company_size: companySize || null,
        industry: companyIndustry || null,
        head_office: companyLocation || null,
        domain: companyDomain || null,
        description: null, // PDL doesn't provide description, but we include it for consistency
      },
      supabase
    );
  }

  // If still no company ID, can't proceed
  if (!companyId) {
    return;
  }

  // Update company with enrichment data
  // Check what fields already exist (only fill missing fields)
  const { data: existingCompany } = await supabase
    .from('companies')
    .select(
      'website, linkedin_url, company_size, industry, head_office, domain, description'
    )
    .eq('id', companyId)
    .maybeSingle();

  const companyUpdate: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // Update website if missing
  if (companyWebsite && !existingCompany?.website) {
    companyUpdate.website = companyWebsite;
  }

  // Update LinkedIn URL if missing
  if (companyLinkedIn && !existingCompany?.linkedin_url) {
    companyUpdate.linkedin_url = companyLinkedIn;
  }

  // Update company size if missing
  if (companySize && !existingCompany?.company_size) {
    companyUpdate.company_size = companySize;
  }

  // Always extract and update domain from website if missing
  // Extract from existing website if domain is missing but website exists
  const domainToSet =
    companyDomain ||
    (existingCompany?.website ? extractDomain(existingCompany.website) : null);
  if (domainToSet && !existingCompany?.domain) {
    companyUpdate.domain = domainToSet;
  }

  // Update industry if missing or empty
  if (
    companyIndustry &&
    (!existingCompany?.industry || existingCompany.industry.trim() === '')
  ) {
    companyUpdate.industry = companyIndustry;
  }

  // Update location if missing
  if (companyLocation && !existingCompany?.head_office) {
    companyUpdate.head_office = companyLocation;
  }

  // Note: PDL doesn't provide company description, but we could add it from other sources later
  // For now, we only update fields that PDL provides

  // Update if there's data to update (more than just updated_at)
  if (Object.keys(companyUpdate).length > 1) {
    await supabase.from('companies').update(companyUpdate).eq('id', companyId);
  }

  // Automatically fetch and store company logo if not already present
  // Fetch updated company data to get the latest website/name
  const { data: updatedCompany } = await supabase
    .from('companies')
    .select('id, name, website, logo_url')
    .eq('id', companyId)
    .maybeSingle();

  if (updatedCompany && !updatedCompany.logo_url) {
    try {
      // Fetch logo asynchronously (don't block enrichment if logo fetch fails)
      await getOrStoreCompanyLogo({
        id: updatedCompany.id,
        name: updatedCompany.name,
        website: updatedCompany.website,
        logo_url: updatedCompany.logo_url,
      });
    } catch (error) {
      // Log but don't fail enrichment if logo fetch fails
      console.error(
        `Failed to fetch logo for company ${updatedCompany.name}:`,
        error
      );
    }
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

    // Get existing lead data to check what's already populated
    const { data: existingLead } = await supabase
      .from('leads')
      .select(
        'phone, job_title, linkedin_url, email, company, first_name, last_name'
      )
      .eq('id', params.lead_id)
      .single();

    // Simplify and store enrichment data
    const simplifiedData = simplifyEnrichmentData(pdlResponse);

    // Only update fields that are missing - never overwrite existing data
    const updateFields: Record<string, unknown> = {
      enrichment_data: simplifiedData as unknown as Json,
      enrichment_timestamp: new Date().toISOString(),
      enrichment_status: 'completed',
      updated_at: new Date().toISOString(),
    };

    // Only enrich missing fields - never overwrite business card data
    if (simplifiedData.linkedin_url && !existingLead?.linkedin_url) {
      updateFields.linkedin_url = simplifiedData.linkedin_url;
    }
    if (simplifiedData.job_title && !existingLead?.job_title) {
      updateFields.job_title = simplifiedData.job_title;
    }
    // Only enrich phone if missing (never overwrite business card phone)
    if (simplifiedData.mobile_phone && !existingLead?.phone) {
      updateFields.phone = simplifiedData.mobile_phone;
    }
    // Only enrich company name if missing (never overwrite business card company)
    if (simplifiedData.job_company && !existingLead?.company) {
      updateFields.company = simplifiedData.job_company;
    }

    await supabase.from('leads').update(updateFields).eq('id', params.lead_id);

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
