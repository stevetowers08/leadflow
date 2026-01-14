import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { triggerEnrichmentWebhook } from '@/services/enrichLeadWebhook';

/**
 * Batch Trigger Enrichment Endpoint
 * POST /api/trigger-enrichment-batch
 *
 * Triggers enrichment webhook for multiple leads
 * Request body: { lead_ids?: string[], show_names?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { lead_ids, show_names, forceReEnrich } = body;

    // Get leads to enrich
    let query = supabase
      .from('leads')
      .select('id, email, company, first_name, last_name');

    // If force_re enrich or specific lead_ids provided, allow re-enriching completed/failed leads
    // Otherwise only get pending leads
    if (!forceReEnrich && (!lead_ids || lead_ids.length === 0)) {
      query = query.eq('enrichment_status', 'pending');
    }

    if (lead_ids && lead_ids.length > 0) {
      query = query.in('id', lead_ids);
    } else if (show_names && show_names.length > 0) {
      query = query.in('show_name', show_names);
    } else {
      // Default: enrich leads from the CSV data
      query = query.in('show_name', [
        'GFSI',
        'BETT',
        'Accountex',
        'Cyber UK',
        'Solar & Storage',
        'London Vet Show',
        'InfoSec',
        'IMPA',
        'Smile Train Activation',
        'Energy Innovation Summit',
        'Automechanika',
        'MRO',
        'Luxury Travel Fair',
        'London EV',
        'IAAPA',
        'Sirha Lyon',
        'IATEFL',
      ]);
    }

    // Only filter by date if not forcing re-enrichment
    if (!forceReEnrich) {
      query = query.gte(
        'created_at',
        new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      );
    }

    const { data: leads, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch leads: ${error.message}` },
        { status: 500 }
      );
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No leads found with pending enrichment',
        triggered: 0,
      });
    }

    // Trigger enrichment webhook for each lead (fire-and-forget)
    const results = await Promise.allSettled(
      leads.map(lead =>
        triggerEnrichmentWebhook({
          lead_id: lead.id,
          company: lead.company || undefined,
          email: lead.email || undefined,
          first_name: lead.first_name || undefined,
          last_name: lead.last_name || undefined,
          linkedin_url: null,
        })
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Triggered enrichment for ${successful} leads${failed > 0 ? ` (${failed} failed)` : ''}`,
      triggered: successful,
      failed,
      total: leads.length,
    });
  } catch (error) {
    console.error('Error in trigger-enrichment-batch:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
