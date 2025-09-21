import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, leadData, action } = await req.json();

    console.log('Automation trigger received:', { leadId, action, leadData });

    // Get webhook URL from environment or use a default n8n webhook URL
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL') || 'https://your-n8n-instance.com/webhook/lead-automation';

    // Prepare payload for n8n
    const webhookPayload = {
      timestamp: new Date().toISOString(),
      source: 'crm_app',
      action: action,
      lead: {
        id: leadId,
        name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        stage: leadData.stage,
        priority: leadData.priority,
        linkedinUrl: leadData.linkedinUrl,
        leadScore: leadData.leadScore
      }
    };

    console.log('Sending webhook to n8n:', webhookPayload);

    // Send webhook to n8n
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CRM-Automation/1.0'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
    }

    const webhookResult = await webhookResponse.text();
    console.log('Webhook response:', webhookResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Automation triggered successfully',
        webhookResponse: webhookResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Automation trigger error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});