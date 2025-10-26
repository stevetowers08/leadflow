// Supabase Edge Function for AI Processing
// This runs on Supabase's serverless infrastructure
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

interface JobData {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  salary?: string;
  employment_type?: string;
  seniority_level?: string;
}

interface GeminiResponse {
  summary: string;
  key_requirements: string[];
  ideal_candidate: string;
  urgency_level: 'low' | 'medium' | 'high';
  market_demand: 'low' | 'medium' | 'high';
  skills_extracted: string[];
  salary_range?: string;
  remote_flexibility?: boolean;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { jobData, jobId } = await req.json();

    if (!jobData || !jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing jobData or jobId' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get Gemini API key from environment (server-side, secure)
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Call Google Gemini API from server
    const geminiResponse = await callGeminiAPI(geminiApiKey, jobData);

    if (!geminiResponse.success) {
      return new Response(JSON.stringify({ error: geminiResponse.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update Supabase database with AI-generated summary
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update the job record
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/jobs?id=eq.${jobId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey,
        },
        body: JSON.stringify({
          summary: geminiResponse.data.summary,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update job in database');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: geminiResponse.data,
        tokens_used: geminiResponse.tokens_used,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('AI processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

async function callGeminiAPI(
  apiKey: string,
  jobData: JobData
): Promise<{
  success: boolean;
  data?: GeminiResponse;
  tokens_used?: number;
  error?: string;
}> {
  try {
    const prompt = `You are an expert recruitment analyst. Analyze this job posting and provide a concise summary.

JOB DETAILS:
- Title: ${jobData.title}
- Location: ${jobData.location || 'Not specified'}
- Salary: ${jobData.salary || 'Not specified'}
- Employment Type: ${jobData.employment_type || 'Not specified'}
- Seniority Level: ${jobData.seniority_level || 'Not specified'}

JOB DESCRIPTION:
${jobData.description}

INSTRUCTIONS:
Provide a clear, concise 2-3 sentence summary that captures:
1. What the role is about
2. Key responsibilities or focus areas
3. What makes this opportunity attractive

RESPONSE FORMAT (plain text only, no JSON):
Write a natural, readable summary that a recruiter would use to quickly understand the job.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1, // Lower temperature for more consistent structured output
            topK: 20, // Reduced for more focused responses
            topP: 0.8, // Reduced for better consistency
            maxOutputTokens: 2048, // Increased for more detailed responses
            candidateCount: 1,
            stopSequences: [],
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error('Invalid response format from Gemini API');
    }

    const content = data.candidates[0].content.parts[0].text;
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    console.log('Gemini response content:', content);

    // Return simple text summary
    return {
      success: true,
      data: {
        summary: content.trim(),
        key_requirements: [],
        ideal_candidate: '',
        urgency_level: 'medium' as const,
        market_demand: 'medium' as const,
        skills_extracted: [],
        salary_range: undefined,
        remote_flexibility: undefined,
      },
      tokens_used: tokensUsed,
    };
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown API error',
    };
  }
}

/**
 * Parse and validate API response
 */
function parseAndValidateResponse(responseData: string): GeminiResponse {
  try {
    // Remove markdown formatting if present
    let cleanedData = responseData.trim();
    if (cleanedData.startsWith('```json')) {
      cleanedData = cleanedData
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedData.startsWith('```')) {
      cleanedData = cleanedData.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanedData);

    // Validate required fields
    const requiredFields = [
      'summary',
      'key_requirements',
      'ideal_candidate',
      'urgency_level',
      'market_demand',
      'skills_extracted',
    ];
    const missingFields = requiredFields.filter(field => !parsed[field]);

    if (missingFields.length > 0) {
      console.warn(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Ensure arrays are arrays
    if (!Array.isArray(parsed.key_requirements)) {
      parsed.key_requirements = [];
    }
    if (!Array.isArray(parsed.skills_extracted)) {
      parsed.skills_extracted = [];
    }

    // Validate enum values
    const validUrgencyLevels = ['low', 'medium', 'high'];
    const validMarketDemand = ['low', 'medium', 'high'];

    if (!validUrgencyLevels.includes(parsed.urgency_level)) {
      parsed.urgency_level = 'medium';
    }
    if (!validMarketDemand.includes(parsed.market_demand)) {
      parsed.market_demand = 'medium';
    }

    return parsed as GeminiResponse;
  } catch (error) {
    console.error('Failed to parse API response:', error);
    // Return fallback data
    return {
      summary: 'Unable to parse AI response',
      key_requirements: [],
      ideal_candidate: 'Unable to determine ideal candidate profile',
      urgency_level: 'medium',
      market_demand: 'medium',
      skills_extracted: [],
      salary_range: undefined,
      remote_flexibility: undefined,
    };
  }
}
