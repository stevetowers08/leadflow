import { NextRequest, NextResponse } from 'next/server';
import { enrichAndStoreLead } from '@/services/enrichAndStoreLead';

/**
 * Enrich Lead Endpoint
 * POST /api/enrich-lead
 *
 * Calls n8n webhook to get enrichment data and stores it in the database
 *
 * Request body:
 * {
 *   lead_id: string,
 *   company?: string,
 *   email?: string,
 *   first_name?: string,
 *   last_name?: string,
 *   linkedin_url?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, company, email, first_name, last_name, linkedin_url } =
      body;

    if (!lead_id) {
      return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 });
    }

    // Enrich and store
    const result = await enrichAndStoreLead({
      lead_id,
      company,
      email,
      first_name,
      last_name,
      linkedin_url,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: result.error ? 500 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      likelihood: result.likelihood,
      enriched_data: result.enriched_data,
    });
  } catch (error) {
    console.error('Error in enrich-lead endpoint:', error);
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

/**
 * OPTIONS handler for CORS
 */
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
