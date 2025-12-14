// AI System Exports - Easy imports for AI functionality
export * from '../services/aiService';
export * from '../services/geminiService';
export * from '../hooks/useAI';
export * from '../contexts/AIContext';

// Re-export commonly used types
export type {
  AIScore,
  LeadOptimization,
  AIServiceConfig,
} from '../services/aiService';

export type { GeminiAnalysisResult } from '../services/geminiService';
