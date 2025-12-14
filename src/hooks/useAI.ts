// AI Hooks for React integration
import { useCallback, useEffect, useState } from 'react';
import {
  aiService,
  type AIScore,
  type LeadOptimization,
} from '../services/aiService';
import { geminiService } from '../services/geminiService';
import { useAsyncOperation } from './useAsyncOperation';

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
  } = useAsyncOperation<AIScore>(async (...args: unknown[]) => {
    const fn = args[0] as () => Promise<AIScore>;
    if (typeof fn !== 'function') {
      throw new Error('Function is required');
    }
    return await fn();
  });

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
  } = useAsyncOperation<LeadOptimization>(async (...args: unknown[]) => {
    const fn = args[0] as () => Promise<LeadOptimization>;
    if (typeof fn !== 'function') {
      throw new Error('Function is required');
    }
    return await fn();
  });

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
