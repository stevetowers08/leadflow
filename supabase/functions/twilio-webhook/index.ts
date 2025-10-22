/**
 * Twilio Webhook Handler
 * Processes webhook events from Twilio for SMS tracking
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getTwilioService } from '../services/twilioService.ts';

interface TwilioWebhookData {
  MessageSid: string;
  MessageStatus: string;
  To: string;
  From: string;
  Body: string;
  ErrorCode?: string;
  ErrorMessage?: string;
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

    // Get form data from Twilio webhook
    const formData = await req.formData();

    // Parse webhook payload
    const twilioService = getTwilioService();
    const webhookData = twilioService.parseWebhookPayload(formData);

    console.log(
      'Received Twilio webhook:',
      webhookData.messageStatus,
      webhookData.messageSid
    );

    // Process the webhook event
    await processSMSWebhook(webhookData);

    // Return TwiML response for status callbacks
    if (webhookData.messageStatus) {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/xml',
          },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, processed: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('SMS webhook processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'SMS webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processSMSWebhook(webhookData: TwilioWebhookData) {
  try {
    const {
      messageSid,
      messageStatus,
      to,
      from,
      body,
      errorCode,
      errorMessage,
    } = webhookData;

    // Find the SMS send record by provider message ID
    const { data: smsSend, error: smsError } = await supabase
      .from('sms_sends')
      .select('*')
      .eq('provider_message_id', messageSid)
      .single();

    if (smsError) {
      console.error('Error finding SMS send record:', smsError);
      return;
    }

    if (!smsSend) {
      console.warn('SMS send record not found for ID:', messageSid);
      return;
    }

    // Update SMS send status based on webhook status
    let updateData: Record<string, unknown> = {};

    switch (messageStatus) {
      case 'queued':
        updateData = { status: 'pending' };
        break;

      case 'sending':
        updateData = { status: 'sent' };
        break;

      case 'sent':
        updateData = { status: 'sent', sent_at: new Date().toISOString() };
        break;

      case 'delivered':
        updateData = {
          status: 'delivered',
          delivered_at: new Date().toISOString(),
        };
        break;

      case 'undelivered':
        updateData = {
          status: 'undelivered',
          error_message: errorMessage || 'Message undelivered',
          error_code: errorCode,
        };
        break;

      case 'failed':
        updateData = {
          status: 'failed',
          error_message: errorMessage || 'Message failed',
          error_code: errorCode,
        };
        break;

      default:
        console.warn('Unknown SMS status:', messageStatus);
        return;
    }

    // Update the SMS send record
    const { error: updateError } = await supabase
      .from('sms_sends')
      .update(updateData)
      .eq('id', smsSend.id);

    if (updateError) {
      console.error('Error updating SMS send record:', updateError);
      return;
    }

    // Handle specific status types
    await handleSMSStatus(messageStatus, smsSend, webhookData);

    console.log(
      `Successfully processed SMS ${messageStatus} event for message ${messageSid}`
    );
  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    throw error;
  }
}

async function handleSMSStatus(
  status: string,
  smsSend: Record<string, unknown>,
  webhookData: TwilioWebhookData
) {
  switch (status) {
    case 'delivered':
      // SMS delivered successfully - could trigger next step in sequence
      console.log(`SMS delivered to ${smsSend.to_number}`);

      // Update contact engagement
      await supabase
        .from('people')
        .update({
          last_sms_delivered_at: new Date().toISOString(),
          lead_score: 'High', // Boost score for SMS engagement
        })
        .eq('phone_number', smsSend.to_number);
      break;

    case 'undelivered':
    case 'failed':
      // Handle failed SMS - mark contact as having invalid phone
      console.log(
        `SMS failed to ${smsSend.to_number}: ${webhookData.errorMessage}`
      );

      // Add to SMS opt-out list
      await supabase.from('sms_opt_outs').upsert({
        phone_number: smsSend.to_number,
        reason: 'carrier_rejection',
      });

      // Update contact record
      await supabase
        .from('people')
        .update({
          phone_number: null, // Remove invalid phone
          notes: `SMS failed: ${webhookData.errorMessage || 'Invalid phone number'}`,
        })
        .eq('phone_number', smsSend.to_number);
      break;

    default:
      // No specific handling needed
      break;
  }
}
