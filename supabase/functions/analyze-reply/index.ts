import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, personId, channel } = await req.json();

    if (!message || !personId) {
      return new Response(
        JSON.stringify({ error: 'Message and personId are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call Google AI API
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleApiKey) {
      throw new Error('Google AI API key not configured');
    }

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following message from a potential lead and determine their interest level in our recruitment services.

Channel: ${channel || 'unknown'}
Message: "${message}"

Please classify this message into one of these categories:
1. "interested" - The person shows clear interest, wants to proceed, asks questions about next steps, or expresses enthusiasm
2. "not_interested" - The person clearly declines, says they're not interested, or asks to be removed from communications
3. "maybe" - The person is neutral, uncertain, asks for more information, or gives a non-committal response

Respond with a JSON object in this exact format:
{
  "replyType": "interested|not_interested|maybe",
  "confidence": 0.85,
  "reasoning": "Brief explanation of why you classified it this way"
}

The confidence should be a number between 0 and 1, where 1 is completely confident.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      throw new Error(`Google AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.candidates[0].content.parts[0].text;

    // Parse the JSON response
    const analysis = JSON.parse(analysisText.trim());

    // Update the person's reply_type in the database
    const { error } = await supabase
      .from('people')
      .update({
        reply_type: analysis.replyType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', personId);

    if (error) {
      throw new Error(`Database update error: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          replyType: analysis.replyType,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-reply function:', error);

    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
