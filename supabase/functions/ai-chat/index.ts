/**
 * Supabase Edge Function for AI Chat with CRM Data
 *
 * This function provides server-side AI chat processing with direct access
 * to CRM data. It uses Google Gemini API securely on the server side.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

interface ChatResponse {
  message: string;
  conversationId: string;
  dataContext?: any;
  success: boolean;
  error?: string;
}

class AIChatService {
  private supabase: any;
  private geminiApiKey: string;
  private geminiBaseUrl: string =
    'https://generativelanguage.googleapis.com/v1beta';
  private model: string = 'gemini-2.5-flash';

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.geminiApiKey = Deno.env.get('GEMINI_API_KEY') || '';
  }

  async handleChatRequest(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (!this.geminiApiKey) {
        return {
          message:
            'AI service not configured. Please set GEMINI_API_KEY environment variable.',
          conversationId:
            request.conversationId || this.generateConversationId(),
          success: false,
          error: 'Missing Gemini API key',
        };
      }

      // 1. Query relevant CRM data
      const dataQuery = await this.queryRelevantData(request.message);

      // 2. Build contextual prompt
      const prompt = this.buildContextualPrompt(
        request.message,
        dataQuery,
        request.context?.messages || []
      );

      // 3. Call Gemini API
      const geminiResponse = await this.callGeminiAPI(prompt);

      if (!geminiResponse.success) {
        throw new Error(geminiResponse.error || 'Failed to get AI response');
      }

      return {
        message: geminiResponse.data || 'No response received',
        conversationId: request.conversationId || this.generateConversationId(),
        dataContext: dataQuery,
        success: true,
      };
    } catch (error) {
      console.error('AI Chat error:', error);
      return {
        message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        conversationId: request.conversationId || this.generateConversationId(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async queryRelevantData(userMessage: string): Promise<any> {
    const message = userMessage.toLowerCase();
    const queries: Promise<any[]>[] = [];
    const queryTypes: string[] = [];

    // Detect intent and build appropriate queries
    if (message.includes('company') || message.includes('companies')) {
      queries.push(this.queryCompanies(userMessage));
      queryTypes.push('companies');
    }

    if (
      message.includes('lead') ||
      message.includes('leads') ||
      message.includes('people') ||
      message.includes('employee')
    ) {
      queries.push(this.queryLeads(userMessage));
      queryTypes.push('leads');
    }

    if (
      message.includes('job') ||
      message.includes('jobs') ||
      message.includes('position') ||
      message.includes('role')
    ) {
      queries.push(this.queryJobs(userMessage));
      queryTypes.push('jobs');
    }

    // If no specific intent detected, query all data types
    if (queries.length === 0) {
      queries.push(this.queryCompanies(userMessage));
      queries.push(this.queryLeads(userMessage));
      queries.push(this.queryJobs(userMessage));
      queryTypes.push('companies', 'leads', 'jobs');
    }

    // Execute queries in parallel
    const results = await Promise.all(queries);
    const allData = results.flat();

    return {
      type: queryTypes.length === 1 ? queryTypes[0] : 'mixed',
      data: allData,
      query: userMessage,
    };
  }

  private async queryCompanies(userMessage: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('companies')
        .select(
          `
          id,
          name,
          industry,
          company_size,
          head_office,
          website,
          lead_score,
          automation_active,
          created_at,
          pipeline_stage
        `
        )
        .limit(20);

      // Add filters based on message content
      const message = userMessage.toLowerCase();

      if (message.includes('tech') || message.includes('technology')) {
        query = query.ilike('industry', '%tech%');
      } else if (message.includes('finance') || message.includes('financial')) {
        query = query.ilike('industry', '%finance%');
      } else if (message.includes('health') || message.includes('healthcare')) {
        query = query.ilike('industry', '%health%');
      }

      if (message.includes('large') || message.includes('big')) {
        query = query.ilike('company_size', '%large%');
      } else if (message.includes('small') || message.includes('startup')) {
        query = query.ilike('company_size', '%small%');
      }

      if (message.includes('automated') || message.includes('automation')) {
        query = query.eq('automation_active', true);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) {
        console.error('Error querying companies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in queryCompanies:', error);
      return [];
    }
  }

  private async queryLeads(userMessage: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('people')
        .select(
          'id, name, company_id, company_role, employee_location, stage, lead_score'
        )
        .limit(5);

      // Add filters based on message content
      const message = userMessage.toLowerCase();

      if (
        message.includes('senior') ||
        message.includes('director') ||
        message.includes('manager')
      ) {
        query = query.or(
          'company_role.ilike.%senior%,company_role.ilike.%director%,company_role.ilike.%manager%'
        );
      }

      if (message.includes('sales') || message.includes('marketing')) {
        query = query.or(
          'company_role.ilike.%sales%,company_role.ilike.%marketing%'
        );
      }

      if (message.includes('replied') || message.includes('responded')) {
        query = query.not('last_reply_at', 'is', null);
      } else if (message.includes('new') || message.includes('fresh')) {
        query = query.is('last_reply_at', null);
      }

      if (message.includes('high score') || message.includes('high scoring')) {
        query = query.gte('lead_score', 80);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) {
        console.error('Error querying leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in queryLeads:', error);
      return [];
    }
  }

  private async queryJobs(userMessage: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('jobs')
        .select(
          `
          id,
          title,
          company_id,
          location,
          description,
          employment_type,
          seniority_level,
          salary,
          function,
          created_at
        `
        )
        .limit(20);

      // Add filters based on message content
      const message = userMessage.toLowerCase();

      if (message.includes('remote') || message.includes('work from home')) {
        query = query.ilike('location', '%remote%');
      }

      if (message.includes('senior') || message.includes('lead')) {
        query = query.or(
          'title.ilike.%senior%,title.ilike.%lead%,seniority_level.ilike.%senior%'
        );
      }

      if (message.includes('sales') || message.includes('marketing')) {
        query = query.or(
          'title.ilike.%sales%,title.ilike.%marketing%,function.ilike.%sales%,function.ilike.%marketing%'
        );
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) {
        console.error('Error querying jobs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in queryJobs:', error);
      return [];
    }
  }

  private buildContextualPrompt(
    userMessage: string,
    dataQuery: any,
    conversationHistory: Array<{
      role: string;
      content: string;
      timestamp: string;
    }>
  ): string {
    const systemMessage = `You are a recruitment CRM assistant. You can access:

- Companies (id, name, industry, size, location, score)
- Leads (id, name, company_id, role, location, stage, score)  
- Jobs (id, title, location, type, level)

Leads are linked to companies via company_id. Be concise and direct. Use bullet points for lists. No bold formatting.`;

    const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context

    return `
${systemMessage}

CRM Data Context (${dataQuery.type}):
${JSON.stringify(dataQuery.data, null, 2)}

Recent Conversation History:
${recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current User Question: ${userMessage}

Please provide a helpful response based on the CRM data and conversation context. If you're showing data, format it clearly and provide actionable insights.`;
  }

  private async callGeminiAPI(
    prompt: string
  ): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const response = await fetch(
        `${this.geminiBaseUrl}/models/${this.model}:generateContent?key=${this.geminiApiKey}`,
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
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
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

      return {
        success: true,
        data: content,
      };
    } catch (error) {
      console.error('Gemini API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown API error',
      };
    }
  }

  private generateConversationId(): string {
    return `edge_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Edge Function handler
serve(async req => {
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

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const chatService = new AIChatService(supabaseUrl, supabaseKey);

    const requestData: ChatRequest = await req.json();
    const response = await chatService.handleChatRequest(requestData);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
