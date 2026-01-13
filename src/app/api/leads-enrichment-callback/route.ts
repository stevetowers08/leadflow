import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';
import type { Json } from '@/integrations/supabase/types';
import { toTitleCase } from '@/utils/textFormatting';

/**
 * Enrichment Callback Endpoint for n8n
 * Receives enriched lead data from n8n workflow and updates the lead
 */

interface EnrichmentPayload {
  lead_id: string;
  // Enriched fields
  email?: string;
  phone?: string;
  company_size?: string;
  arr?: number; // Annual Recurring Revenue
  company_linkedin_url?: string;
  lead_linkedin_url?: string;
  position?: string; // Job title/position

  // Metadata
  enrichment_status?: 'completed' | 'failed';
  enrichment_source?: string;
  enrichment_timestamp?: string;
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-webhook-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Verify HMAC-SHA256 webhook signature
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const cleanSignature = signature.replace(/^sha256=/, '').trim();
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (cleanSignature.length !== expectedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get raw body for signature verification
    const bodyText = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    // Verify webhook signature if secret is provided
    const webhookSecret = process.env.LEADS_ENRICHMENT_WEBHOOK_SECRET;
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
        console.error('Invalid enrichment webhook signature');
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

    // Parse the enrichment payload
    let payload: EnrichmentPayload;
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

    // Validate required fields
    if (!payload.lead_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: lead_id',
        },
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if lead exists
    const { data: existingLead, error: fetchError } = await supabase
      .from('leads')
      .select('id, enrichment_status')
      .eq('id', payload.lead_id)
      .single();

    if (fetchError || !existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead not found',
        },
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Update enriched fields if provided (with Title Case formatting)
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.phone !== undefined) updateData.phone = payload.phone;
    if (payload.position !== undefined)
      updateData.job_title = toTitleCase(payload.position);
    if (payload.lead_linkedin_url !== undefined)
      updateData.linkedin_url = payload.lead_linkedin_url;

    // Update enrichment metadata
    const enrichmentStatus =
      payload.enrichment_status || (payload.error ? 'failed' : 'completed');
    updateData.enrichment_status = enrichmentStatus;
    updateData.enrichment_timestamp = new Date().toISOString();

    // Store enrichment data in JSONB field
    const enrichmentData: Record<string, unknown> = {
      company_size: payload.company_size,
      arr: payload.arr,
      company_linkedin_url: payload.company_linkedin_url,
      enrichment_source: payload.enrichment_source,
      enriched_at: payload.enrichment_timestamp || new Date().toISOString(),
    };

    if (payload.error) {
      enrichmentData.error = payload.error;
    }

    updateData.enrichment_data = enrichmentData as unknown as Json;

    // If company data is provided, update or create company record
    // Note: leads table has 'company' (string) field, not 'company_id'
    if (payload.company_linkedin_url || payload.company_size || payload.arr) {
      const { data: lead } = await supabase
        .from('leads')
        .select('company')
        .eq('id', payload.lead_id)
        .single();

      if (lead?.company) {
        // Try to find existing company by name
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('name', lead.company)
          .maybeSingle();

        let companyId: string | null = existingCompany?.id || null;

        if (!companyId) {
          // Create new company (with Title Case formatting)
          const { data: newCompany } = await supabase
            .from('companies')
            .insert({
              name: toTitleCase(lead.company),
              industry: null,
            })
            .select('id')
            .single();

          if (newCompany) {
            companyId = newCompany.id;
          }
        } else {
          // Update existing company
          const companyUpdate: Record<string, unknown> = {};
          if (payload.company_linkedin_url)
            companyUpdate.linkedin_url = payload.company_linkedin_url;
          if (payload.company_size)
            companyUpdate.company_size = payload.company_size;
          if (payload.arr) companyUpdate.estimated_arr = payload.arr;

          if (Object.keys(companyUpdate).length > 0) {
            await supabase
              .from('companies')
              .update({
                ...companyUpdate,
                updated_at: new Date().toISOString(),
              })
              .eq('id', companyId);
          }
        }

        // Note: leads table doesn't have company_id field
        // Company relationship is maintained via company name string field
      }
    }

    // Update the lead
    const { error: updateError } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', payload.lead_id);

    if (updateError) {
      console.error('Failed to update lead with enrichment data:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to update lead: ${updateError.message}`,
        },
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log enrichment event
    await supabase.from('activity_log').insert({
      activity_type: 'lead_enriched',
      metadata: {
        lead_id: payload.lead_id,
        enrichment_status: enrichmentStatus,
        enrichment_source: payload.enrichment_source,
        fields_enriched: Object.keys(payload).filter(
          key =>
            key !== 'lead_id' &&
            key !== 'enrichment_status' &&
            key !== 'enrichment_source' &&
            key !== 'enrichment_timestamp' &&
            key !== 'error'
        ),
      } as unknown as Json,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        lead_id: payload.lead_id,
        message: 'Lead enriched successfully',
        enrichment_status: enrichmentStatus,
      },
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Enrichment callback error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
