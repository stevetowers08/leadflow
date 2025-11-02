import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

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
    // Validate environment variables
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'check-company-duplicate'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

