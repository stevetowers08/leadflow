/**
 * Resend Webhook Handler
 * Processes webhook events from Resend for email tracking
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getResendService } from '../services/resendService.ts';

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

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests for webhooks
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('resend-signature');

    // Verify webhook signature if secret is provided
    const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET');
    if (webhookSecret && signature) {
      const resendService = getResendService();
      const isValid = resendService.validateWebhookSignature(
        body,
        signature,
        webhookSecret
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Parse the webhook event
    const resendService = getResendService();
    const event = resendService.parseWebhookEvent(body);

    console.log('Received Resend webhook event:', event.type, event.id);

    // Process the event based on type
    await processWebhookEvent(event);

    return new Response(JSON.stringify({ success: true, processed: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processWebhookEvent(event: ResendWebhookEvent) {
  try {
    const { type, data } = event;

    // Find the email send record by provider email ID
    const { data: emailSend, error: emailError } = await supabase
      .from('email_sends')
      .select('*')
      .eq('provider_email_id', data.email_id)
      .single();

    if (emailError) {
      console.error('Error finding email send record:', emailError);
      return;
    }

    if (!emailSend) {
      console.warn('Email send record not found for ID:', data.email_id);
      return;
    }

    // Update email send status based on event type
    let updateData: Record<string, unknown> = {};
    const eventType = type;

    switch (type) {
      case 'email.sent':
        updateData = { status: 'sent', sent_at: event.created_at };
        break;

      case 'email.delivered':
        updateData = { status: 'delivered', delivered_at: event.created_at };
        break;

      case 'email.delivery_delayed':
        updateData = { status: 'delayed' };
        break;

      case 'email.bounced':
        updateData = { status: 'bounced', bounced_at: event.created_at };
        break;

      case 'email.complained':
        updateData = { status: 'complained' };
        break;

      case 'email.opened':
        updateData = { opened_at: event.created_at };
        break;

      case 'email.clicked':
        updateData = { clicked_at: event.created_at };
        break;

      default:
        console.warn('Unknown event type:', type);
        return;
    }

    // Update the email send record
    const { error: updateError } = await supabase
      .from('email_sends')
      .update(updateData)
      .eq('id', emailSend.id);

    if (updateError) {
      console.error('Error updating email send record:', updateError);
      return;
    }

    // Create email event record
    const { error: eventError } = await supabase.from('email_events').insert({
      email_send_id: emailSend.id,
      provider_event_id: event.id,
      event_type: eventType.replace('email.', ''),
      event_data: event,
      timestamp: event.created_at,
      processed: true,
    });

    if (eventError) {
      console.error('Error creating email event record:', eventError);
      return;
    }

    // Handle specific event types
    await handleSpecificEvent(event, emailSend);

    console.log(
      `Successfully processed ${eventType} event for email ${data.email_id}`
    );
  } catch (error) {
    console.error('Error processing webhook event:', error);
    throw error;
  }
}

async function handleSpecificEvent(
  event: ResendWebhookEvent,
  emailSend: Record<string, unknown>
) {
  const { type, data } = event;

  switch (type) {
    case 'email.bounced':
      // Handle hard bounces - mark contact as invalid
      if (data.bounce_type === 'hard') {
        await supabase
          .from('people')
          .update({
            email_address: null, // Remove invalid email
            stage: 'disqualified',
            notes: `Email bounced: ${data.bounce_reason || 'Invalid email address'}`,
          })
          .eq('email_address', emailSend.to_email);
      }
      break;

    case 'email.complained':
      // Handle spam complaints - add to unsubscribe list
      await supabase.from('email_unsubscribes').upsert({
        email: emailSend.to_email,
        domain_id: emailSend.domain_id,
        reason: 'complaint',
      });
      break;

    case 'email.opened':
      // Update lead score or trigger follow-up actions
      await supabase
        .from('people')
        .update({
          last_email_opened_at: event.created_at,
          lead_score: 'High', // Boost score for engagement
        })
        .eq('email_address', emailSend.to_email);
      break;

    case 'email.clicked':
      // High engagement - boost lead score significantly
      await supabase
        .from('people')
        .update({
          last_email_clicked_at: event.created_at,
          lead_score: 'High',
          stage: 'engaged', // Move to engaged stage
        })
        .eq('email_address', emailSend.to_email);
      break;

    case 'email.delivered':
      // Email delivered successfully - could trigger next step in sequence
      console.log(`Email delivered to ${emailSend.to_email}`);
      break;

    default:
      // No specific handling needed
      break;
  }
}
