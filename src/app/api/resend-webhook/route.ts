import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

interface ResendWebhookEvent {
  type: string;
  data: {
    id: string;
    to: string[];
    from: string;
    subject: string;
    status: string;
  };
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
        'resend-webhook'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get raw body for signature verification
    const bodyText = await request.text();
    const signature = request.headers.get('resend-signature');

    // Verify webhook signature if secret is provided
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      // Basic signature verification (implement proper HMAC verification)
      // For production, use proper HMAC-SHA256 verification
      console.log('Webhook signature verification (implement proper HMAC)');
    }

    // Parse the webhook event
    const event: ResendWebhookEvent = JSON.parse(bodyText);

    console.log('Received Resend webhook event:', event.type, event.data?.id);

    // Process the event based on type
    await processWebhookEvent(supabase, event);

    return NextResponse.json(
      { success: true, processed: true },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Resend webhook error:', error);
    // Return 200 to prevent webhook retries
    return new NextResponse('OK', { status: 200 });
  }
}

async function processWebhookEvent(
  supabase: ReturnType<typeof createClient>,
  event: ResendWebhookEvent
) {
  try {
    if (event.type === 'email.sent') {
      // Update email send record
      await supabase
        .from('email_sends')
        .update({
          status: 'sent',
          external_id: event.data.id,
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', event.data.id);
    } else if (event.type === 'email.delivered') {
      await supabase
        .from('email_sends')
        .update({
          status: 'delivered',
          delivered_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', event.data.id);
    } else if (event.type === 'email.opened') {
      // Track email opens
      await supabase.from('email_tracking').insert({
        email_id: event.data.id,
        event_type: 'opened',
        timestamp: new Date().toISOString(),
      });
    } else if (event.type === 'email.clicked') {
      await supabase.from('email_tracking').insert({
        email_id: event.data.id,
        event_type: 'clicked',
        timestamp: new Date().toISOString(),
      });
    } else if (event.type === 'email.bounced') {
      await supabase
        .from('email_sends')
        .update({
          status: 'bounced',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', event.data.id);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    throw error;
  }
}


