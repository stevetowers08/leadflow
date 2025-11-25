import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';

interface CheckDuplicateRequest {
  domain?: string;
  linkedin_url?: string;
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const body: CheckDuplicateRequest = await request.json();

    // Call the database function
    const { data, error } = await supabase.rpc('check_company_exists', {
      p_domain: body.domain || null,
      p_linkedin_url: body.linkedin_url || null,
    });

    if (error) {
      console.error('Database function error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = data[0];

    return NextResponse.json(
      {
        company_id: result.company_id,
        exists: result.company_exists,
        message: result.company_exists
          ? 'Company already exists in database'
          : 'Company not found, proceed with enrichment',
      },
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorResponse = APIErrorHandler.handleError(error, 'check-company-duplicate');
    // Preserve CORS headers in error response
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

