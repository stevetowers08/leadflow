/**
 * People Data Labs Enrichment Service
 *
 * Supports two enrichment methods:
 * 1. Direct API call to PDL (synchronous)
 * 2. n8n webhook (asynchronous with callback)
 */

import type {
  PDLEnrichmentRequest,
  PDLEnrichmentResponse,
  SimplifiedEnrichmentData,
} from '@/types/peopleDataLabs';

const PDL_API_KEY = process.env.PEOPLE_DATA_LABS_API_KEY;
const PDL_API_URL =
  process.env.PEOPLE_DATA_LABS_API_URL ||
  'https://api.peopledatalabs.com/v5/person/enrich';
const N8N_ENRICHMENT_WEBHOOK_URL = process.env.N8N_ENRICHMENT_WEBHOOK_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

/**
 * Enrich person data using People Data Labs API directly
 *
 * @param params - Enrichment request parameters
 * @returns Enrichment response with person data
 */
export async function enrichPersonDirect(
  params: PDLEnrichmentRequest
): Promise<PDLEnrichmentResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PEOPLE_DATA_LABS_API_KEY is not configured');
  }

  // Build query string from params
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const url = `${PDL_API_URL}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': PDL_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `PDL API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enriching person with PDL:', error);
    throw error;
  }
}

/**
 * Trigger enrichment via n8n webhook (asynchronous)
 *
 * This sends the enrichment request to n8n which will:
 * 1. Call PDL API
 * 2. Process the response
 * 3. Send enriched data back to our callback endpoint
 *
 * @param leadId - Lead ID to enrich
 * @param params - Person identification parameters
 * @returns Success indicator
 */
export async function triggerEnrichmentViaWebhook(
  leadId: string,
  params: {
    company?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    linkedin_url?: string;
  }
): Promise<{ success: boolean; message: string }> {
  if (!N8N_ENRICHMENT_WEBHOOK_URL || !N8N_API_KEY) {
    throw new Error('N8N enrichment webhook is not configured');
  }

  try {
    const response = await fetch(N8N_ENRICHMENT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': N8N_API_KEY,
      },
      body: JSON.stringify({
        lead_id: leadId,
        ...params,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Enrichment workflow started',
    };
  } catch (error) {
    console.error('Error triggering n8n enrichment:', error);
    throw error;
  }
}

/**
 * Simplify PDL enrichment data for storage
 *
 * Extracts the most relevant fields from the full PDL response
 * to store in our database
 */
export function simplifyEnrichmentData(
  response: PDLEnrichmentResponse
): SimplifiedEnrichmentData {
  const { data, likelihood } = response;

  // Extract phone number - check mobile_phone string first, then phone_numbers array
  // Note: PDL sometimes returns booleans to indicate presence, but actual values may be in arrays
  let mobilePhone: string | undefined;
  if (typeof data.mobile_phone === 'string') {
    mobilePhone = data.mobile_phone;
  } else if (
    Array.isArray(data.phone_numbers) &&
    data.phone_numbers.length > 0
  ) {
    // Filter out boolean values and get first actual phone number string
    const phoneNumbers = data.phone_numbers.filter(
      (p): p is string => typeof p === 'string'
    );
    if (phoneNumbers.length > 0) {
      mobilePhone = phoneNumbers[0];
    }
  }

  // Extract work email - check work_email string first, then emails array
  // Note: PDL sometimes returns booleans to indicate presence, but actual values may be in arrays
  let workEmail: string | undefined;
  if (typeof data.work_email === 'string') {
    workEmail = data.work_email;
  } else if (Array.isArray(data.emails) && data.emails.length > 0) {
    // Filter out boolean values and get first actual email string
    const emails = data.emails.filter(
      (e): e is string => typeof e === 'string'
    );
    if (emails.length > 0) {
      workEmail = emails[0];
    }
  }

  return {
    pdl_id: data.id,
    likelihood,
    linkedin_url: data.linkedin_url,
    linkedin_username: data.linkedin_username,
    twitter_url: data.twitter_url,
    github_url: data.github_url || undefined,
    mobile_phone: mobilePhone,
    work_email: workEmail,
    personal_emails: Array.isArray(data.personal_emails)
      ? data.personal_emails
      : undefined,
    job_title: data.job_title,
    job_company: data.job_company_name,
    job_company_website: data.job_company_website,
    job_company_size: data.job_company_size,
    job_company_industry: data.job_company_industry,
    job_company_linkedin_url: data.job_company_linkedin_url,
    location:
      typeof data.location_name === 'string' ? data.location_name : undefined,
    skills: data.skills,
    experience: data.experience,
    education: data.education,
    enriched_at: new Date().toISOString(),
  };
}

/**
 * Get enrichment method based on configuration
 */
export function getEnrichmentMethod(): 'direct' | 'webhook' | 'none' {
  if (N8N_ENRICHMENT_WEBHOOK_URL && N8N_API_KEY) {
    return 'webhook';
  }
  if (PDL_API_KEY) {
    return 'direct';
  }
  return 'none';
}

/**
 * Check if enrichment is available
 */
export function isEnrichmentAvailable(): boolean {
  return getEnrichmentMethod() !== 'none';
}
