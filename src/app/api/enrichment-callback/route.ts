import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { PDLEnrichmentResponse } from '@/types/peopleDataLabs';
import { simplifyEnrichmentData } from '@/services/peopleDataLabsService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Enrichment Callback Endpoint
 * POST /api/enrichment-callback
 *
 * Receives enriched person data from n8n workflow and updates the lead record
 *
 * Expected payload from n8n:
 * {
 *   lead_id: string,
 *   enrichment_data: PDLEnrichmentResponse[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key (same key used to trigger the webhook)
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.N8N_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the payload
    const payload = await request.json();
    const { lead_id, enrichment_data } = payload;

    if (!lead_id) {
      return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 });
    }

    // enrichment_data is an array from PDL, get the first result
    const pdlResponse: PDLEnrichmentResponse | undefined = Array.isArray(
      enrichment_data
    )
      ? enrichment_data[0]
      : enrichment_data;

    if (!pdlResponse || !pdlResponse.data) {
      // No enrichment data found - mark as failed
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          enrichment_status: 'failed',
          enrichment_timestamp: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead_id);

      if (updateError) {
        console.error('Error updating lead with failed status:', updateError);
      }

      return NextResponse.json({
        success: true,
        message: 'No enrichment data found',
      });
    }

    // Simplify the enrichment data
    const simplifiedData = simplifyEnrichmentData(pdlResponse);

    // Update the lead with enrichment data
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        enrichment_data: simplifiedData as unknown as Record<string, unknown>,
        enrichment_timestamp: new Date().toISOString(),
        enrichment_status: 'completed',
        linkedin_url: simplifiedData.linkedin_url || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id);

    if (updateError) {
      console.error('Error updating lead with enrichment data:', updateError);
      return NextResponse.json(
        { error: 'Failed to update lead', details: updateError.message },
        { status: 500 }
      );
    }

    // Log the enrichment activity
    await supabase
      .from('activity_log')
      .insert({
        lead_id,
        activity_type: 'lead_updated',
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'pdl_enrichment',
          likelihood: pdlResponse.likelihood,
          enriched_at: new Date().toISOString(),
        },
      })
      .select();

    console.log(
      `Successfully enriched lead ${lead_id} with PDL data (likelihood: ${pdlResponse.likelihood})`
    );

    return NextResponse.json({
      success: true,
      message: 'Lead enriched successfully',
      likelihood: pdlResponse.likelihood,
    });
  } catch (error) {
    console.error('Error processing enrichment callback:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}
