// Client-side service for server-side AI processing
// This replaces the direct Gemini API calls with secure server-side processing

export interface ServerAIJobSummary {
  summary: string;
  key_requirements: string[];
  ideal_candidate: string;
  urgency_level: 'low' | 'medium' | 'high';
  market_demand: 'low' | 'medium' | 'high';
  skills_extracted: string[];
  salary_range?: string;
  remote_flexibility?: boolean;
}

export interface ServerAIResponse {
  success: boolean;
  data?: ServerAIJobSummary;
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
   * Generate job summary using server-side AI processing
   * This is the SECURE way to handle AI processing
   */
  async generateJobSummary(jobData: {
    id: string;
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
    employment_type?: string;
    seniority_level?: string;
  }): Promise<ServerAIResponse> {
    try {
      // Use Next.js API route instead of Edge Function
      const apiUrl = typeof window !== 'undefined' 
        ? '/api/ai-job-summary' 
        : `${this.supabaseUrl}/functions/v1/ai-job-summary`; // Fallback for SSR
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          jobData: {
            title: jobData.title,
            company: jobData.company,
            description: jobData.description,
            location: jobData.location,
            salary: jobData.salary,
            employment_type: jobData.employment_type,
            seniority_level: jobData.seniority_level,
          },
          jobId: jobData.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || response.statusText;
        
        // Provide user-friendly message for missing API key
        if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('Missing environment variables')) {
          return {
            success: false,
            error: 'AI service is not configured. Please contact your administrator to set up the Gemini API key.',
          };
        }
        
        return {
          success: false,
          error: `Server AI error: ${response.status} - ${errorMessage}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Server AI processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Batch process multiple jobs using server-side AI
   */
  async batchProcessJobs(
    jobs: Array<{
      id: string;
      title: string;
      company: string;
      description: string;
      location?: string;
      salary?: string;
    }>
  ): Promise<Array<{ id: string; result: ServerAIResponse }>> {
    const results: Array<{ id: string; result: ServerAIResponse }> = [];

    // Process jobs in batches to respect rate limits
    const batchSize = 3; // Smaller batches for server processing
    const delayMs = 1000; // 1 second delay between batches

    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);

      // Process batch in parallel
      const batchPromises = batch.map(async job => {
        const result = await this.generateJobSummary(job);
        return { id: job.id, result };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < jobs.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  /**
   * Check if server-side AI service is available
   */
  async checkServiceStatus(): Promise<{
    available: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/functions/v1/ai-job-summary`,
        {
          method: 'OPTIONS',
          headers: {
            Authorization: `Bearer ${this.supabaseAnonKey}`,
          },
        }
      );

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
