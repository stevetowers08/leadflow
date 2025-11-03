// AI Hooks for React integration
import { useCallback, useEffect, useState } from 'react';
import {
  aiService,
  type AIScore,
  type JobSummary,
  type LeadOptimization,
} from '../services/aiService';
import { geminiService } from '../services/geminiService';
import {
  batchSummarizeJobsFromSupabase,
  getJobsNeedingSummarization as getJobsNeedingSummarizationUtil,
  processJobSummarizationCampaigns,
  summarizeJobFromSupabase,
  type JobSummaryUpdate,
} from '../utils/jobSummarization';
import { useAsyncOperation } from './useAsyncOperation';

export interface UseAIJobSummaryOptions {
  enableAutoRetry?: boolean;
  enableCaching?: boolean;
  cacheTimeout?: number;
}

export interface UseAIJobSummaryResult {
  generateSummary: (jobData: {
    id: string;
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
  }) => Promise<JobSummary>;
  isLoading: boolean;
  error: string | null;
  lastResult: JobSummary | null;
  retry: () => void;
}

/**
 * Hook for generating AI job summaries
 */
export function useAIJobSummary(
  options: UseAIJobSummaryOptions = {}
): UseAIJobSummaryResult {
  const [lastResult, setLastResult] = useState<JobSummary | null>(null);
  const [cache, setCache] = useState<Map<string, JobSummary>>(new Map());

  const {
    execute: executeSummary,
    isLoading,
    error,
    retry,
  } = useAsyncOperation<JobSummary>(
    async (jobData: {
      id: string;
      title: string;
      company: string;
      description: string;
      location?: string;
      salary?: string;
    }) => {
      return await aiService.generateJobSummary({
        id: jobData.id,
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        location: jobData.location || '',
        salary: jobData.salary,
      });
    }
  );

  const generateSummary = useCallback(
    async (jobData: {
      id: string;
      title: string;
      company: string;
      description: string;
      location?: string;
      salary?: string;
    }) => {
      // Check cache if enabled
      if (options.enableCaching) {
        const cacheKey = `${jobData.title}-${jobData.company}-${jobData.description.slice(0, 100)}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          setLastResult(cached);
          return cached;
        }
      }

      const result = await executeSummary(jobData);

      if (result) {
        setLastResult(result);

        // Cache result if enabled
        if (options.enableCaching) {
          const cacheKey = `${jobData.title}-${jobData.company}-${jobData.description.slice(0, 100)}`;
          setCache(prev => {
            const newCache = new Map(prev);
            newCache.set(cacheKey, result);
            return newCache;
          });
        }
      }

      return result;
    },
    [executeSummary, options.enableCaching, cache]
  );

  return {
    generateSummary,
    isLoading,
    error,
    lastResult,
    retry,
  };
}

export interface UseAISupabaseJobSummaryOptions {
  batchSize?: number;
  enableProgress?: boolean;
}

export interface UseAISupabaseJobSummaryResult {
  summarizeJob: (jobId: string) => Promise<JobSummaryUpdate | null>;
  batchSummarizeJobs: (jobIds: string[]) => Promise<JobSummaryUpdate[]>;
  processCampaigns: (limit?: number) => Promise<{
    processed: number;
    updated: number;
    errors: string[];
  }>;
  getJobsNeedingSummarization: (
    limit?: number
  ) => Promise<Array<Record<string, unknown>>>;
  isLoading: boolean;
  error: string | null;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
}

/**
 * Hook for AI-powered Supabase job summarization
 */
export function useAISupabaseJobSummary(
  options: UseAISupabaseJobSummaryOptions = {}
): UseAISupabaseJobSummaryResult {
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percentage: 0,
  });

  const {
    execute: executeSummarizeJob,
    isLoading: isLoadingJob,
    error: jobError,
  } = useAsyncOperation<JobSummaryUpdate>();

  const {
    execute: executeBatchSummarize,
    isLoading: isLoadingBatch,
    error: batchError,
  } = useAsyncOperation<JobSummaryUpdate[]>();

  const {
    execute: executeCampaigns,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
  } = useAsyncOperation<{
    processed: number;
    updated: number;
    errors: string[];
  }>();

  const {
    execute: executeGetJobs,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useAsyncOperation<Array<Record<string, unknown>>>();

  const summarizeJob = useCallback(
    async (jobId: string) => {
      return await executeSummarizeJob(async () => {
        const result = await summarizeJobFromSupabase(jobId);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data || null;
      });
    },
    [executeSummarizeJob]
  );

  const batchSummarizeJobs = useCallback(
    async (jobIds: string[]) => {
      setProgress({ current: 0, total: jobIds.length, percentage: 0 });

      return await executeBatchSummarize(async () => {
        const result = await batchSummarizeJobsFromSupabase(jobIds);

        // Update progress
        const successful = result.results.filter(
          resultItem => resultItem.success
        ).length;
        setProgress({
          current: successful,
          total: jobIds.length,
          percentage: Math.round((successful / jobIds.length) * 100),
        });

        return result.results
          .filter(resultItem => resultItem.success && resultItem.data)
          .map(resultItem => resultItem.data!);
      });
    },
    [executeBatchSummarize]
  );

  const processCampaigns = useCallback(
    async (limit: number = 10) => {
      return await executeCampaigns(async () => {
        const result = await processJobSummarizationCampaigns(limit);
        return {
          processed: result.processed,
          updated: result.updated,
          errors: result.errors,
        };
      });
    },
    [executeCampaigns]
  );

  const getJobsNeedingSummarization = useCallback(
    async (limit: number = 50) => {
      return await executeGetJobs(async () => {
        const result = await getJobsNeedingSummarizationUtil(limit);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data || [];
      });
    },
    [executeGetJobs]
  );

  const isLoading =
    isLoadingJob || isLoadingBatch || isLoadingCampaigns || isLoadingJobs;
  const error = jobError || batchError || campaignsError || jobsError;

  return {
    summarizeJob,
    batchSummarizeJobs,
    processCampaigns,
    getJobsNeedingSummarization,
    isLoading,
    error,
    progress,
  };
}

export interface UseAILeadScoringOptions {
  enableCaching?: boolean;
  cacheTimeout?: number;
}

export interface UseAILeadScoringResult {
  calculateScore: (leadData: {
    name: string;
    company: string;
    role: string;
    location: string;
    experience?: string;
    industry?: string;
    company_size?: string;
  }) => Promise<AIScore>;
  isLoading: boolean;
  error: string | null;
  lastScore: AIScore | null;
  retry: () => void;
}

/**
 * Hook for AI-powered lead scoring
 */
export function useAILeadScoring(
  options: UseAILeadScoringOptions = {}
): UseAILeadScoringResult {
  const [lastScore, setLastScore] = useState<AIScore | null>(null);

  const {
    execute: executeScoring,
    isLoading,
    error,
    retry,
  } = useAsyncOperation<AIScore>();

  const calculateScore = useCallback(
    async (leadData: {
      name: string;
      company: string;
      role: string;
      location: string;
      experience?: string;
      industry?: string;
      company_size?: string;
    }) => {
      const result = await executeScoring(async () => {
        return await aiService.calculateLeadScore(leadData);
      });

      if (result) {
        setLastScore(result);
      }

      return result;
    },
    [executeScoring]
  );

  return {
    calculateScore,
    isLoading,
    error,
    lastScore,
    retry,
  };
}

export interface UseAILeadOptimizationOptions {
  enableCaching?: boolean;
}

export interface UseAILeadOptimizationResult {
  optimizeOutreach: (leadData: {
    name: string;
    company: string;
    role: string;
    industry?: string;
    previous_interactions?: string[];
  }) => Promise<LeadOptimization>;
  isLoading: boolean;
  error: string | null;
  lastOptimization: LeadOptimization | null;
  retry: () => void;
}

/**
 * Hook for AI-powered lead outreach optimization
 */
export function useAILeadOptimization(
  options: UseAILeadOptimizationOptions = {}
): UseAILeadOptimizationResult {
  const [lastOptimization, setLastOptimization] =
    useState<LeadOptimization | null>(null);

  const {
    execute: executeOptimization,
    isLoading,
    error,
    retry,
  } = useAsyncOperation<LeadOptimization>();

  const optimizeOutreach = useCallback(
    async (leadData: {
      name: string;
      company: string;
      role: string;
      industry?: string;
      previous_interactions?: string[];
    }) => {
      const result = await executeOptimization(async () => {
        return await aiService.optimizeLeadOutreach(leadData);
      });

      if (result) {
        setLastOptimization(result);
      }

      return result;
    },
    [executeOptimization]
  );

  return {
    optimizeOutreach,
    isLoading,
    error,
    lastOptimization,
    retry,
  };
}

export interface UseAIServiceStatusResult {
  status: {
    available: boolean;
    providers: {
      openai: { available: boolean; model: string };
      gemini: { available: boolean; model: string };
    };
    activeProvider: string;
    features: string[];
  };
  geminiStatus: {
    available: boolean;
    model: string;
    features: string[];
    rateLimit: string;
    cost: string;
  };
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook for AI service status and capabilities
 */
export function useAIServiceStatus(): UseAIServiceStatusResult {
  const [status, setStatus] = useState(aiService.getStatus());
  const [geminiStatus, setGeminiStatus] = useState(geminiService.getStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setStatus(aiService.getStatus());
      setGeminiStatus(geminiService.getStatus());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get AI service status'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    status,
    geminiStatus,
    isLoading,
    error,
    refresh,
  };
}
