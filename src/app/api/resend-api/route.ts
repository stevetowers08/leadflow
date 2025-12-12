import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const envCheck = APIErrorHandler.validateEnvVars(['RESEND_API_KEY']);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'resend-api'
      );
    }

    const supabase = createServerSupabaseClient();
    const resendApiKey = process.env.RESEND_API_KEY!;

    const url = new URL(request.url);
    const path = url.pathname.replace('/api/resend-api', '');

    // Route: POST /domains - Create domain
    if (path === '/domains' || path === '') {
      const body = await request.json();
      const { name } = body;

      if (!name) {
        return APIErrorHandler.handleError(
          new Error('Domain name is required'),
          'resend-api'
        );
      }

      const domainResponse = await fetch('https://api.resend.com/domains', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!domainResponse.ok) {
        throw new Error(`Resend API error: ${domainResponse.status}`);
      }

      const domain = await domainResponse.json();

      // Note: email_domains table doesn't exist - skipping database save
      // If needed, create the table or use activity_log for tracking
      console.log('Domain created:', { id: domain.id, name: domain.name, status: domain.status });

      return NextResponse.json(
        { success: true, domain },
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return APIErrorHandler.handleError(
      new Error('Invalid route'),
      'resend-api'
    );
  } catch (error) {
    return APIErrorHandler.handleError(error, 'resend-api');
  }
}

export async function GET(request: NextRequest) {
  try {
    const envCheck = APIErrorHandler.validateEnvVars(['RESEND_API_KEY']);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'resend-api'
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY!;
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/resend-api', '');

    // Route: GET /domains - List domains
    if (path === '/domains' || path === '') {
      const domainsResponse = await fetch('https://api.resend.com/domains', {
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
        },
      });

      if (!domainsResponse.ok) {
        throw new Error(`Resend API error: ${domainsResponse.status}`);
      }

      const domains = await domainsResponse.json();

      return NextResponse.json(
        { success: true, domains },
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return APIErrorHandler.handleError(new Error('Invalid route'), 'resend-api');
  } catch (error) {
    return APIErrorHandler.handleError(error, 'resend-api');
  }
}


