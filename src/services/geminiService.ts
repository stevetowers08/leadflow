// Google Gemini AI Service
export interface GeminiAnalysisResult {
  success: boolean;
  data?: unknown;
  error?: string;
  tokens_used?: number;
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private model: string = 'gemini-2.5-flash'; // Latest stable model

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Call Google Gemini API
   */
  private async callGeminiAPI(prompt: string): Promise<{
    success: boolean;
    data?: string;
    tokens_used?: number;
    error?: string;
  }> {
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
              maxOutputTokens: 1024,
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

      return {
        success: true,
        data: content,
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
   * Check if Gemini service is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get service status and capabilities
   */
  getStatus(): {
    available: boolean;
    model: string;
    features: string[];
    rateLimit: string;
    cost: string;
  } {
    return {
      available: this.isAvailable(),
      model: this.model,
      features: ['lead_scoring_analysis', 'batch_processing'],
      rateLimit: '60 requests per minute (free tier)',
      cost: 'FREE - No cost for basic usage',
    };
  }
}

export const geminiService = new GeminiService();
