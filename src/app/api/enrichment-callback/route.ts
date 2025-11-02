import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

interface EnrichmentCallbackPayload {
  event_type: 'enrichment_completed' | string;
  job_id?: string;
  company_id?: string;
  company_name?: string;
  leads_found?: number;
  enrichment_source?: string;
  client_id?: string;
  timestamp?: string;
}

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
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'enrichment-callback'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: EnrichmentCallbackPayload = await request.json();

    if (body.event_type !== 'enrichment_completed') {
      return NextResponse.json(
        { success: true },
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const jobId = body.job_id;
    const companyId = body.company_id;

    if (!jobId && !companyId) {
      return APIErrorHandler.handleError(
        new Error('Missing job_id or company_id'),
        'enrichment-callback'
      );
    }

    // Determine company and name
    let companyName = body.company_name || '';
    let resolvedCompanyId = companyId || '';

    if (!companyName || !resolvedCompanyId) {
      const { data: company } = await supabase
        .from('companies')
        .select('id, name')
        .eq('id', companyId || '')
        .maybeSingle();
      if (company) {
        companyName = company.name || companyName;
        resolvedCompanyId = company.id || resolvedCompanyId;
      }
    }

    // Find user to notify
    let userIdToNotify: string | null = null;
    if (jobId && body.client_id) {
      const { data: cj } = await supabase
        .from('client_jobs')
        .select('qualified_by')
        .eq('job_id', jobId)
        .eq('client_id', body.client_id)
        .maybeSingle();
      userIdToNotify = (cj?.qualified_by as string) || null;
    }

    // Create notification if user found
    if (userIdToNotify) {
      await supabase.from('user_notifications').insert({
        user_id: userIdToNotify,
        type: 'enrichment_completed',
        priority: 'medium',
        title: 'Company Enrichment Completed',
        message: `Enrichment completed for ${companyName}. Found ${body.leads_found || 0} leads.`,
        metadata: {
          job_id: jobId,
          company_id: resolvedCompanyId,
          leads_found: body.leads_found || 0,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Enrichment callback processed',
        company_id: resolvedCompanyId,
        leads_found: body.leads_found || 0,
      },
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Enrichment callback error:', error);
    return APIErrorHandler.handleError(error, 'enrichment-callback');
  }
}


