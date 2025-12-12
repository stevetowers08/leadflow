// Client-side service for server-side AI processing
// This replaces the direct Gemini API calls with secure server-side processing

export interface ServerAIResponse {
  success: boolean;
  data?: unknown;
  tokens_used?: number;
  error?: string;
}

class ServerAIService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }

  /**
   * Check if server-side AI service is available
   */
  async checkServiceStatus(): Promise<{
    available: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/ai-chat`, {
        method: 'OPTIONS',
        headers: {
          Authorization: `Bearer ${this.supabaseAnonKey}`,
        },
      });

      return {
        available: response.ok,
      };
    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const serverAIService = new ServerAIService();
