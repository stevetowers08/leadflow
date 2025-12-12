import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';

interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    messages?: Array<{
      role: 'user' | 'assistant' | 'system';
      content: string;
      timestamp: string;
    }>;
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

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function queryRelevantData(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  message: string
) {
  // Simplified: query recent jobs, leads, companies
  const [jobsResult, leadsResult, companiesResult] = await Promise.all([
    supabase.from('jobs').select('id, title, location').limit(5),
    supabase.from('leads').select('id, first_name, last_name, email, status').limit(5),
    supabase.from('companies').select('id, name, industry').limit(5),
  ]);

  return {
    recentJobs: jobsResult.data || [],
    recentLeads: leadsResult.data || [],
    recentCompanies: companiesResult.data || [],
  };
}

interface DataQueryResult {
  recentJobs: Array<{ id: string; title: string; location: string | null }>;
  recentLeads: Array<{ id: string; first_name: string | null; last_name: string | null; email: string | null; status: string | null }>;
  recentCompanies: Array<{ id: string; name: string | null; industry: string | null }>;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

function buildContextualPrompt(message: string, dataQuery: DataQueryResult, history: ChatMessage[]): string {
  let prompt = `You are a helpful AI assistant for a recruitment CRM system. Answer questions about jobs, people, and companies.\n\n`;

  if (dataQuery.recentJobs.length > 0) {
    prompt += `Recent Jobs:\n${JSON.stringify(dataQuery.recentJobs, null, 2)}\n\n`;
  }

  if (dataQuery.recentLeads.length > 0) {
    prompt += `Recent Leads:\n${JSON.stringify(dataQuery.recentLeads, null, 2)}\n\n`;
  }

  if (dataQuery.recentCompanies.length > 0) {
    prompt += `Recent Companies:\n${JSON.stringify(dataQuery.recentCompanies, null, 2)}\n\n`;
  }

  prompt += `User Question: ${message}\n\nPlease provide a helpful response based on the CRM data context.`;

  return prompt;
}

async function callGeminiAPI(geminiApiKey: string, prompt: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

  return { success: true, data: text };
}

export async function POST(request: NextRequest) {
  try {
    const envCheck = APIErrorHandler.validateEnvVars(['GEMINI_API_KEY']);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'ai-chat'
      );
    }

    const supabase = createServerSupabaseClient();
    const geminiApiKey = process.env.GEMINI_API_KEY!;

    const body: ChatRequest = await request.json();

    if (!body.message) {
      return APIErrorHandler.handleError(
        new Error('Message is required'),
        'ai-chat'
      );
    }

    // Query relevant CRM data
    const dataQuery = await queryRelevantData(supabase, body.message);

    // Build contextual prompt
    const prompt = buildContextualPrompt(
      body.message,
      dataQuery,
      body.context?.messages || []
    );

    // Call Gemini API
    const geminiResponse = await callGeminiAPI(geminiApiKey, prompt);

    if (!geminiResponse.success) {
      throw new Error(geminiResponse.data || 'Failed to get AI response');
    }

    const conversationId = body.conversationId || generateConversationId();

    return NextResponse.json(
      {
        message: geminiResponse.data,
        conversationId,
        dataContext: dataQuery,
        success: true,
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('AI Chat error:', error);
    return APIErrorHandler.handleError(error, 'ai-chat');
  }
}


