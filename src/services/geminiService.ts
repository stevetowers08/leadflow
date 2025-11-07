// Google Gemini AI Service for free job summarization and analysis
export interface GeminiJobSummary {
  summary: string;
  key_requirements: string[];
  ideal_candidate: string;
  urgency_level: 'low' | 'medium' | 'high';
  market_demand: 'low' | 'medium' | 'high';
  skills_extracted: string[];
  salary_range?: string;
  remote_flexibility?: boolean;
}

export interface GeminiAnalysisResult {
  success: boolean;
  data?: GeminiJobSummary;
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
   * Generate a comprehensive job summary using Google's Gemini AI
   * This is FREE with Google's Gemini API (60 requests per minute)
   */
  async generateJobSummary(jobData: {
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
    employment_type?: string;
    seniority_level?: string;
  }): Promise<GeminiAnalysisResult> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error:
            'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.',
        };
      }

      const prompt = this.buildJobSummaryPrompt(jobData);
      const response = await this.callGeminiAPI(prompt);

      if (!response.success) {
        return response;
      }

      // Parse the JSON response
      const parsedData = JSON.parse(response.data || '{}');

      return {
        success: true,
        data: parsedData,
        tokens_used: response.tokens_used,
      };
    } catch (error) {
      console.error('Gemini job summary error:', error);
      return {
        success: false,
        error: `Failed to generate job summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Summarize raw job description text from Supabase
   * Perfect for processing existing job data
   */
  async summarizeJobDescription(
    description: string,
    title?: string,
    company?: string
  ): Promise<GeminiAnalysisResult> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'Gemini API key not configured',
        };
      }

      const prompt = `
        Analyze this job description and create a concise summary:

        ${title ? `Job Title: ${title}` : ''}
        ${company ? `Company: ${company}` : ''}
        
        Job Description:
        ${description}

        Provide a structured analysis in JSON format:
        {
          "summary": "2-3 sentence summary of the role",
          "key_requirements": ["requirement1", "requirement2", "requirement3"],
          "ideal_candidate": "Brief description of ideal candidate",
          "urgency_level": "low|medium|high",
          "market_demand": "low|medium|high",
          "skills_extracted": ["skill1", "skill2", "skill3"],
          "salary_range": "estimated range if mentioned",
          "remote_flexibility": true/false
        }
      `;

      const response = await this.callGeminiAPI(prompt);

      if (!response.success) {
        return response;
      }

      const parsedData = JSON.parse(response.data || '{}');

      return {
        success: true,
        data: parsedData,
        tokens_used: response.tokens_used,
      };
    } catch (error) {
      console.error('Gemini description summarization error:', error);
      return {
        success: false,
        error: `Failed to summarize job description: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Batch process multiple job descriptions
   * Respects rate limits (60 requests per minute)
   */
  async batchSummarizeJobs(
    jobs: Array<{
      id: string;
      title: string;
      company: string;
      description: string;
      location?: string;
      salary?: string;
    }>
  ): Promise<Array<{ id: string; result: GeminiAnalysisResult }>> {
    const results: Array<{ id: string; result: GeminiAnalysisResult }> = [];
    const batchSize = 10; // Process 10 at a time to respect rate limits
    const delayMs = 1000; // 1 second delay between batches

    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);

      // Process batch in parallel
      const batchPromises = batch.map(async job => {
        const result = await this.summarizeJobDescription(
          job.description,
          job.title,
          job.company
        );
        return { id: job.id, result };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < jobs.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  /**
   * Extract key insights from job data for lead scoring
   */
  async analyzeJobForLeadScoring(jobData: {
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
  }): Promise<GeminiAnalysisResult> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'Gemini API key not configured',
        };
      }

      const prompt = `
        Analyze this job posting for lead scoring purposes:

        Title: ${jobData.title}
        Company: ${jobData.company}
        Location: ${jobData.location || 'Not specified'}
        Salary: ${jobData.salary || 'Not specified'}
        
        Description:
        ${jobData.description}

        Provide analysis in JSON format:
        {
          "summary": "Brief job summary",
          "urgency_level": "low|medium|high",
          "market_demand": "low|medium|high",
          "skills_extracted": ["skill1", "skill2"],
          "salary_range": "range if mentioned",
          "remote_flexibility": true/false,
          "lead_score_factors": {
            "seniority_level": "entry|mid|senior|executive",
            "decision_making_power": "low|medium|high",
            "budget_indicator": "low|medium|high",
            "urgency_indicator": "low|medium|high"
          }
        }
      `;

      const response = await this.callGeminiAPI(prompt);

      if (!response.success) {
        return response;
      }

      const parsedData = JSON.parse(response.data || '{}');

      return {
        success: true,
        data: parsedData,
        tokens_used: response.tokens_used,
      };
    } catch (error) {
      console.error('Gemini lead scoring analysis error:', error);
      return {
        success: false,
        error: `Failed to analyze job for lead scoring: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Build the prompt for job summary generation
   */
  private buildJobSummaryPrompt(jobData: {
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
    employment_type?: string;
    seniority_level?: string;
  }): string {
    return `
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

      Focus on:
      - Key technical and soft skills required
      - Experience level and seniority
      - Company culture indicators
      - Growth potential mentioned
      - Compensation competitiveness
    `;
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
      features: [
        'job_summarization',
        'description_analysis',
        'lead_scoring_analysis',
        'batch_processing',
        'skill_extraction',
        'salary_analysis',
      ],
      rateLimit: '60 requests per minute (free tier)',
      cost: 'FREE - No cost for basic usage',
    };
  }
}

export const geminiService = new GeminiService();
