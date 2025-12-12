import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Database } from '@/integrations/supabase/types';

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
    const envCheck = APIErrorHandler.validateEnvVars(['GEMINI_API_KEY']);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'analyze-reply'
      );
    }

    const supabase = createServerSupabaseClient();

    const body = await request.json();
    const { message, personId, channel } = body;

    if (!message || !personId) {
      return APIErrorHandler.handleError(
        new Error('Message and personId are required'),
        'analyze-reply'
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY!;

    // Call Google AI API
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${geminiApiKey}`,
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
                  text: `Analyze the following message from a potential lead and determine their interest level.

Channel: ${channel || 'unknown'}
Message: "${message}"

Classify into: "interested", "not_interested", or "maybe".
Respond with JSON: {"replyType": "...", "confidence": 0.85, "reasoning": "..."}`,
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
    const analysisText = aiData.candidates[0]?.content?.parts[0]?.text || '';

    // Parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisText.trim());
    } catch {
      // Fallback if parsing fails
      analysis = {
        replyType: 'maybe',
        confidence: 0.5,
        reasoning: 'Could not parse AI response',
      };
    }

    // Update lead's status based on reply type
    // Note: leads table doesn't have reply_type, using status field instead
    const statusMap: Record<string, string> = {
      interested: 'active',
      not_interested: 'replied_manual',
      maybe: 'active',
    };
    
    const { error } = await supabase
      .from('leads')
      .update({
        status: statusMap[analysis.replyType] || 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', personId);

    if (error) {
      throw new Error(`Database update error: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        replyType: analysis.replyType,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Analyze reply error:', error);
    return APIErrorHandler.handleError(error, 'analyze-reply');
  }
}


