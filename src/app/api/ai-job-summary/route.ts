import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

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

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const envCheck = APIErrorHandler.validateEnvVars([
      'GEMINI_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'ai-job-summary'
      );
    }

    const body = await request.json();
    const { jobData, jobId } = body;

    if (!jobData || !jobId) {
      return APIErrorHandler.handleError(
        new Error('Missing jobData or jobId'),
        'ai-job-summary'
      );
    }

    // Get Gemini API key from environment (server-side, secure)
    const geminiApiKey = process.env.GEMINI_API_KEY!;

    // Call Google Gemini API from server
    const geminiResponse = await callGeminiAPI(geminiApiKey, jobData);

    if (!geminiResponse.success) {
      return NextResponse.json(
        { error: geminiResponse.error },
        { status: 500 }
      );
    }

    // Update Supabase database with AI-generated summary
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update the job record
    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        summary: geminiResponse.data.summary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    if (updateError) {
      throw new Error('Failed to update job in database');
    }

    return NextResponse.json(
      {
        success: true,
        data: geminiResponse.data,
        tokens_used: geminiResponse.tokens_used,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return APIErrorHandler.handleError(error, 'ai-job-summary');
  }
}

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
            temperature: 0.1,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 2048,
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

