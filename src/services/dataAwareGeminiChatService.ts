/**
 * Data-Aware Gemini Chat Service
 *
 * This service extends the existing Gemini service to provide chat capabilities
 * with direct access to CRM data. It intelligently queries relevant data based
 * on user questions and provides context-aware responses.
 */

import { supabase } from '@/integrations/supabase/client';
import { geminiService } from './geminiService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  dataContext?: Record<string, unknown>;
  isLoading?: boolean;
}

export interface ChatContext {
  conversationId: string;
  messages: ChatMessage[];
  lastDataQuery?: string;
}

export interface DataQueryResult {
  type: 'companies' | 'leads' | 'mixed';
  data: CompanyData[] | LeadData[] | (CompanyData | LeadData)[];
  query: string;
}

interface CompanyData {
  id: string;
  name: string;
  industry?: string;
  company_size?: string;
  head_office?: string;
  website?: string;
  lead_score?: number;
  automation_active?: boolean;
  created_at: string;
  pipeline_stage?: string;
}

interface LeadData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  company?: string;
  company_id?: string;
  job_title?: string;
  status?: string;
  quality_rank?: string;
  linkedin_url?: string;
  created_at: string;
  last_reply_at?: string;
}

class DataAwareGeminiChatService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private model: string = 'gemini-2.0-flash-001'; // Fast model optimized for speed

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * System message that defines the AI's role and capabilities
   */
  private readonly SYSTEM_MESSAGE = `You are a LeadFlow CRM assistant. You can access:

- Companies (id, name, industry, size, location, score)
- Leads (id, first_name, last_name, email, company, job_title, status, quality_rank)

Leads are linked to companies via company_id. Be concise and direct. Use bullet points for lists. No bold formatting.`;

  /**
   * Main chat method that handles user messages with CRM data context
   */
  async chatWithData(
    userMessage: string,
    context: ChatContext,
    onChunk?: (chunk: {
      content: string;
      done: boolean;
      conversationId: string;
      dataContext?: Record<string, unknown>;
    }) => void
  ): Promise<{
    message: string;
    dataContext?: Record<string, unknown>;
    conversationId: string;
  }> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Send initial status update
      if (onChunk) {
        onChunk({
          content: 'Let me check that for you...',
          done: false,
          conversationId: context.conversationId,
        });

        // Add a small delay to make it feel more natural
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 1. Query relevant CRM data based on user message
      const dataQuery = await this.queryRelevantData(userMessage);

      // Send data found update
      if (onChunk && dataQuery.data.length > 0) {
        const statusMessages = [
          `Found ${dataQuery.data.length} ${dataQuery.type} records. Analyzing...`,
          `Looking through ${dataQuery.data.length} ${dataQuery.type}...`,
          `Checking ${dataQuery.data.length} ${dataQuery.type} records...`,
          `Found ${dataQuery.data.length} ${dataQuery.type}. Processing...`,
        ];

        onChunk({
          content:
            statusMessages[Math.floor(Math.random() * statusMessages.length)],
          done: false,
          conversationId: context.conversationId,
        });

        // Add another small delay
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 2. Build context-aware prompt
      const prompt = this.buildContextualPrompt(
        userMessage,
        dataQuery,
        context.messages
      );

      // 3. Send to Gemini
      const response = await this.callGeminiAPI(prompt);

      if (!response.success) {
        throw new Error(response.error || 'Failed to get AI response');
      }

      const finalMessage = response.data || 'No response received';

      // Send final response
      if (onChunk) {
        onChunk({
          content: finalMessage,
          done: true,
          conversationId: context.conversationId,
          dataContext: dataQuery,
        });
      }

      return {
        message: finalMessage,
        dataContext: dataQuery,
        conversationId: context.conversationId,
      };
    } catch (error) {
      console.error('Data-aware chat error:', error);

      let errorMessage = 'Sorry, I encountered an error';
      let errorType = 'unknown';

      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage =
            'API key not configured. Please check your Gemini API key.';
          errorType = 'config';
        } else if (
          error.message.includes('network') ||
          error.message.includes('fetch')
        ) {
          errorMessage = 'Network error. Please check your connection.';
          errorType = 'network';
        } else if (
          error.message.includes('quota') ||
          error.message.includes('limit')
        ) {
          errorMessage = 'API quota exceeded. Please try again later.';
          errorType = 'quota';
        } else {
          errorMessage = `Sorry, I ran into an issue: ${error.message}`;
          errorType = 'api';
        }
      }

      if (onChunk) {
        onChunk({
          content: errorMessage,
          done: true,
          conversationId: context.conversationId,
        });
      }

      return {
        message: errorMessage,
        conversationId: context.conversationId,
        error: errorType,
      };
    }
  }

  /**
   * Intelligently query relevant CRM data based on user message
   */
  private async queryRelevantData(
    userMessage: string
  ): Promise<DataQueryResult> {
    const message = userMessage.toLowerCase();
    const queries: Promise<CompanyData[] | LeadData[] | JobData[]>[] = [];
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

    // If no specific intent detected, query all data types
    if (queries.length === 0) {
      queries.push(this.queryCompanies(userMessage));
      queries.push(this.queryLeads(userMessage));
      queryTypes.push('companies', 'leads');
    }

    // Execute queries in parallel
    const results = await Promise.all(queries);
    const allData = results.flat();

    return {
      type:
        queryTypes.length === 1
          ? (queryTypes[0] as 'companies' | 'leads')
          : 'mixed',
      data: allData,
      query: userMessage,
    };
  }

  /**
   * Query companies based on user message
   */
  private async queryCompanies(userMessage: string): Promise<CompanyData[]> {
    try {
      let query = supabase
        .from('companies')
        .select('id, name, industry, company_size, head_office, lead_score')
        .limit(5);

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

      // Note: automation_active field doesn't exist - removed filter

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

  /**
   * Query leads based on user message
   */
  private async queryLeads(userMessage: string): Promise<LeadData[]> {
    try {
      let query = supabase
        .from('leads')
        .select(
          'id, first_name, last_name, email, company, company_id, job_title, status, quality_rank, linkedin_url, created_at'
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
          'job_title.ilike.%senior%,job_title.ilike.%director%,job_title.ilike.%manager%'
        );
      }

      if (message.includes('sales') || message.includes('marketing')) {
        query = query.or('job_title.ilike.%sales%,job_title.ilike.%marketing%');
      }

      if (message.includes('replied') || message.includes('responded')) {
        query = query.eq('status', 'replied_manual');
      } else if (message.includes('new') || message.includes('fresh')) {
        query = query.eq('status', 'active');
      }

      if (message.includes('hot') || message.includes('high quality')) {
        query = query.eq('quality_rank', 'hot');
      } else if (message.includes('warm')) {
        query = query.eq('quality_rank', 'warm');
      } else if (message.includes('cold')) {
        query = query.eq('quality_rank', 'cold');
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

  /**
   * Build contextual prompt with CRM data and conversation history
   */
  private buildContextualPrompt(
    userMessage: string,
    dataQuery: DataQueryResult,
    conversationHistory: ChatMessage[]
  ): string {
    const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context

    return `
${this.SYSTEM_MESSAGE}

CRM Data Context (${dataQuery.type}):
${JSON.stringify(dataQuery.data, null, 2)}

Recent Conversation History:
${recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current User Question: ${userMessage}

Please provide a helpful response based on the CRM data and conversation context. If you're showing data, format it clearly and provide actionable insights.`;
  }

  /**
   * Call Gemini API with the contextual prompt
   */
  private async callGeminiAPI(
    prompt: string
  ): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
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

  /**
   * Generate a new conversation ID
   */
  generateConversationId(): string {
    return `data_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get service status
   */
  getStatus(): {
    available: boolean;
    model: string;
    features: string[];
  } {
    return {
      available: this.isAvailable(),
      model: this.model,
      features: [
        'crm_data_query',
        'intelligent_context',
        'conversation_history',
        'companies_analysis',
        'leads_analysis',
        'real_time_data',
      ],
    };
  }
}

export const dataAwareGeminiChatService = new DataAwareGeminiChatService();
