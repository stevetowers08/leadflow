// Utility functions for integrating Gemini AI with Supabase job data
import { geminiService, type GeminiAnalysisResult, type GeminiJobSummary } from '../services/geminiService';
import { supabase } from '../integrations/supabase/client';

export interface JobSummaryUpdate {
  id: string;
  summary: string;
  key_requirements: string[];
  ideal_candidate: string;
  urgency_level: 'low' | 'medium' | 'high';
  market_demand: 'low' | 'medium' | 'high';
  skills_extracted: string[];
  salary_range?: string;
  remote_flexibility?: boolean;
}

export interface SupabaseJobData {
  id: string;
  title: string;
  company_id: string | null;
  description: string | null;
  summary: string | null;
  location: string | null;
  salary: string | null;
  employment_type: string | null;
  seniority_level: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Summarize a single job from Supabase using Gemini AI
 */
export async function summarizeJobFromSupabase(jobId: string): Promise<{
  success: boolean;
  data?: JobSummaryUpdate;
  error?: string;
}> {
  try {
    // Fetch job data from Supabase
    const { data: jobData, error: fetchError } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        company_id,
        description,
        summary,
        location,
        salary,
        employment_type,
        seniority_level,
        created_at,
        updated_at
      `)
      .eq('id', jobId)
      .single();

    if (fetchError || !jobData) {
      return {
        success: false,
        error: `Failed to fetch job data: ${fetchError?.message || 'Job not found'}`
      };
    }

    // Get company name if available
    let companyName = 'Unknown Company';
    if (jobData.company_id) {
      const { data: companyData } = await supabase
        .from('companies')
        .select('name')
        .eq('id', jobData.company_id)
        .single();
      
      if (companyData?.name) {
        companyName = companyData.name;
      }
    }

    // Generate summary using Gemini AI
    const geminiResult = await geminiService.generateJobSummary({
      title: jobData.title,
      company: companyName,
      description: jobData.description || '',
      location: jobData.location || undefined,
      salary: jobData.salary || undefined,
      employment_type: jobData.employment_type || undefined,
      seniority_level: jobData.seniority_level || undefined
    });

    if (!geminiResult.success || !geminiResult.data) {
      return {
        success: false,
        error: geminiResult.error || 'Failed to generate summary'
      };
    }

    // Prepare data for database update
    const summaryData: JobSummaryUpdate = {
      id: jobData.id,
      summary: geminiResult.data.summary,
      key_requirements: geminiResult.data.key_requirements,
      ideal_candidate: geminiResult.data.ideal_candidate,
      urgency_level: geminiResult.data.urgency_level,
      market_demand: geminiResult.data.market_demand,
      skills_extracted: geminiResult.data.skills_extracted,
      salary_range: geminiResult.data.salary_range,
      remote_flexibility: geminiResult.data.remote_flexibility
    };

    return {
      success: true,
      data: summaryData
    };

  } catch (error) {
    console.error('Error summarizing job from Supabase:', error);
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Batch summarize multiple jobs from Supabase
 */
export async function batchSummarizeJobsFromSupabase(jobIds: string[]): Promise<{
  success: boolean;
  results: Array<{ id: string; success: boolean; data?: JobSummaryUpdate; error?: string }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    tokens_used: number;
  };
}> {
  const results: Array<{ id: string; success: boolean; data?: JobSummaryUpdate; error?: string }> = [];
  let totalTokensUsed = 0;

  // Process jobs in batches to respect rate limits
  const batchSize = 5;
  const delayMs = 2000; // 2 second delay between batches

  for (let i = 0; i < jobIds.length; i += batchSize) {
    const batch = jobIds.slice(i, i + batchSize);
    
    // Process batch in parallel
    const batchPromises = batch.map(async (jobId) => {
      const result = await summarizeJobFromSupabase(jobId);
      return {
        id: jobId,
        success: result.success,
        data: result.data,
        error: result.error
      };
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < jobIds.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    success: failed === 0,
    results,
    summary: {
      total: jobIds.length,
      successful,
      failed,
      tokens_used: totalTokensUsed
    }
  };
}

/**
 * Update job summary in Supabase database
 */
export async function updateJobSummaryInSupabase(summaryData: JobSummaryUpdate): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({
        summary: summaryData.summary,
        updated_at: new Date().toISOString()
      })
      .eq('id', summaryData.id);

    if (error) {
      return {
        success: false,
        error: `Failed to update job summary: ${error.message}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating job summary:', error);
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get jobs that need summarization (jobs without summaries or with old summaries)
 */
export async function getJobsNeedingSummarization(limit: number = 50): Promise<{
  success: boolean;
  data?: SupabaseJobData[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        company_id,
        description,
        summary,
        location,
        salary,
        employment_type,
        seniority_level,
        created_at,
        updated_at
      `)
      .or('summary.is.null,updated_at.lt.' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // No summary or older than 7 days
      .not('description', 'is', null)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: `Failed to fetch jobs: ${error.message}`
      };
    }

    return {
      success: true,
      data: data || []
    };

  } catch (error) {
    console.error('Error fetching jobs needing summarization:', error);
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Complete workflow: Get jobs needing summarization, summarize them, and update database
 */
export async function processJobSummarizationWorkflow(limit: number = 10): Promise<{
  success: boolean;
  processed: number;
  updated: number;
  errors: string[];
  summary: {
    total_jobs: number;
    processed_jobs: number;
    updated_jobs: number;
    failed_jobs: number;
    total_tokens_used: number;
  };
}> {
  const errors: string[] = [];
  let processed = 0;
  let updated = 0;
  let totalTokensUsed = 0;

  try {
    // Get jobs needing summarization
    const jobsResult = await getJobsNeedingSummarization(limit);
    if (!jobsResult.success || !jobsResult.data) {
      return {
        success: false,
        processed: 0,
        updated: 0,
        errors: [jobsResult.error || 'Failed to fetch jobs'],
        summary: {
          total_jobs: 0,
          processed_jobs: 0,
          updated_jobs: 0,
          failed_jobs: 0,
          total_tokens_used: 0
        }
      };
    }

    const jobs = jobsResult.data;
    const jobIds = jobs.map(job => job.id);

    // Batch summarize jobs
    const batchResult = await batchSummarizeJobsFromSupabase(jobIds);
    
    processed = batchResult.summary.successful;
    totalTokensUsed = batchResult.summary.tokens_used;

    // Update successful summaries in database
    for (const result of batchResult.results) {
      if (result.success && result.data) {
        const updateResult = await updateJobSummaryInSupabase(result.data);
        if (updateResult.success) {
          updated++;
        } else {
          errors.push(`Failed to update job ${result.id}: ${updateResult.error}`);
        }
      } else {
        errors.push(`Failed to summarize job ${result.id}: ${result.error}`);
      }
    }

    return {
      success: errors.length === 0,
      processed,
      updated,
      errors,
      summary: {
        total_jobs: jobs.length,
        processed_jobs: processed,
        updated_jobs: updated,
        failed_jobs: jobs.length - updated,
        total_tokens_used: totalTokensUsed
      }
    };

  } catch (error) {
    console.error('Error in job summarization workflow:', error);
    return {
      success: false,
      processed,
      updated,
      errors: [...errors, `Workflow error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      summary: {
        total_jobs: 0,
        processed_jobs: processed,
        updated_jobs: updated,
        failed_jobs: 0,
        total_tokens_used: totalTokensUsed
      }
    };
  }
}

/**
 * Get Gemini service status and capabilities
 */
export function getGeminiServiceStatus() {
  return geminiService.getStatus();
}
