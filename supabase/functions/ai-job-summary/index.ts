// Supabase Edge Function for AI Processing
// This runs on Supabase's serverless infrastructure
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
          headers: { 'Content-Type': 'application/json' }
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
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Call Google Gemini API from server
    const geminiResponse = await callGeminiAPI(geminiApiKey, jobData);
    
    if (!geminiResponse.success) {
      return new Response(
        JSON.stringify({ error: geminiResponse.error }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update Supabase database with AI-generated summary
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
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
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
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
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

async function callGeminiAPI(apiKey: string, jobData: JobData): Promise<{
  success: boolean;
  data?: GeminiResponse;
  tokens_used?: number;
  error?: string;
}> {
  try {
    const prompt = `
      Create a comprehensive job summary for this position:

      Title: ${jobData.title}
      Company: ${jobData.company}
      Description: ${jobData.description}
      Location: ${jobData.location || 'Not specified'}
      Salary: ${jobData.salary || 'Not specified'}
      Employment Type: ${jobData.employment_type || 'Not specified'}
      Seniority Level: ${jobData.seniority_level || 'Not specified'}

      Provide detailed analysis in JSON format:
      {
        "summary": "2-3 sentence comprehensive summary of the role and company",
        "key_requirements": ["requirement1", "requirement2", "requirement3", "requirement4", "requirement5"],
        "ideal_candidate": "Detailed description of the ideal candidate profile",
        "urgency_level": "low|medium|high",
        "market_demand": "low|medium|high",
        "skills_extracted": ["skill1", "skill2", "skill3", "skill4", "skill5"],
        "salary_range": "estimated salary range if mentioned",
        "remote_flexibility": true/false
      }
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const content = data.candidates[0].content.parts[0].text;
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    // Parse the JSON response
    const parsedData = JSON.parse(content);

    return {
      success: true,
      data: parsedData,
      tokens_used: tokensUsed
    };

  } catch (error) {
    console.error('Gemini API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown API error'
    };
  }
}
