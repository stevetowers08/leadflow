// AI System Exports - Easy imports for AI functionality
export * from './services/aiService';
export * from './services/geminiService';
export * from './hooks/useAI';
export * from './contexts/AIContext';
export * from './components/ai/AIComponents';
export * from './utils/jobSummarization';

// Re-export commonly used types
export type {
  AIScore,
  JobSummary,
  LeadOptimization,
  AIServiceConfig,
} from './services/aiService';

export type {
  GeminiJobSummary,
  GeminiAnalysisResult,
} from './services/geminiService';

export type { JobSummaryUpdate } from './utils/jobSummarization';
