/**
 * Unified Scoring System Documentation
 *
 * COMPLETE DATABASE STRUCTURE:
 *
 * 1. PEOPLE TABLE (Leads):
 *    - lead_score: 'High' | 'Medium' | 'Low' (text)
 *    - Display: "AI SCORE" with colored badges
 *
 * 2. COMPANIES TABLE:
 *    - lead_score: '0' | '36' | '50' | '82' | '100' etc. (text, 0-100 scale)
 *    - priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' (text)
 *    - Display: "AI SCORE" with numeric badges (0-100)
 *
 * 3. JOBS TABLE:
 *    - priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' (text)
 *    - lead_score_job: 0 | 36 | 44 | 50 | 82 | 100 etc. (integer, 0-100)
 *    - Display: "PRIORITY" with colored priority badges
 *
 * SCORING SYSTEM RULES:
 * - AI Score is ALWAYS for companies (0-100 numeric)
 * - AI Score for people is High/Medium/Low (text levels)
 * - Priority is for jobs and companies (VERY HIGH/HIGH/MEDIUM/LOW)
 * - Job scores are separate numeric values (0-100)
 */

export type ScoringType =
  | 'priority'
  | 'lead_score'
  | 'company_score'
  | 'job_score';

export type PriorityLevel = 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
export type LeadScoreLevel = 'High' | 'Medium' | 'Low'; // Actual DB values
export type CompanyScoreLevel = string; // "50", "60", "82" etc.
export type JobScoreLevel = number; // 0-100

export interface ScoringInfo {
  label: string;
  badge: string;
  color: string;
  value: string | number;
}

/**
 * Priority levels (for jobs)
 */
export const PRIORITY_LEVELS: Record<PriorityLevel, ScoringInfo> = {
  'VERY HIGH': {
    label: 'Very High',
    badge: 'Very High',
    color: 'bg-red-100 text-red-800 border-red-200',
    value: 'VERY HIGH',
  },
  HIGH: {
    label: 'High',
    badge: 'High',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    value: 'HIGH',
  },
  MEDIUM: {
    label: 'Medium',
    badge: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    value: 'MEDIUM',
  },
  LOW: {
    label: 'Low',
    badge: 'Low',
    color: 'bg-green-100 text-green-800 border-green-200',
    value: 'LOW',
  },
};

/**
 * Lead Score levels (for people) - Actual DB values
 */
export const LEAD_SCORE_LEVELS: Record<LeadScoreLevel, ScoringInfo> = {
  High: {
    label: 'High',
    badge: 'High',
    color: 'bg-red-100 text-red-800 border-red-200',
    value: 'High',
  },
  Medium: {
    label: 'Medium',
    badge: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    value: 'Medium',
  },
  Low: {
    label: 'Low',
    badge: 'Low',
    color: 'bg-green-100 text-green-800 border-green-200',
    value: 'Low',
  },
};

/**
 * Company Score levels (0-100 scale) - DB stores as text
 */
export const getCompanyScoreInfo = (score: string | number): ScoringInfo => {
  const numScore = typeof score === 'string' ? parseInt(score) : score;

  return {
    label: 'AI SCORE',
    badge: `${numScore}`,
    color: 'text-gray-900 font-bold', // Simple numeric styling - no badge colors
    value: numScore,
  };
};

/**
 * Job Score levels (0-100 scale) - DB stores as integer
 * NUMERIC DESIGN: Simple number display without badge styling
 */
export const getJobScoreInfo = (score: number): ScoringInfo => {
  return {
    label: 'AI SCORE',
    badge: `${score}`,
    color: 'text-gray-900 font-bold', // Simple numeric styling - no badge colors
    value: score,
  };
};

/**
 * Get scoring info based on type and value
 */
export const getScoringInfo = (
  type: ScoringType,
  value: string | number
): ScoringInfo => {
  switch (type) {
    case 'priority':
      return (
        PRIORITY_LEVELS[value as PriorityLevel] || PRIORITY_LEVELS['MEDIUM']
      );

    case 'lead_score':
      return (
        LEAD_SCORE_LEVELS[value as LeadScoreLevel] ||
        LEAD_SCORE_LEVELS['Medium']
      );

    case 'company_score':
      return getCompanyScoreInfo(value);

    case 'job_score':
      return getJobScoreInfo(
        typeof value === 'number' ? value : parseInt(value.toString()) || 0
      );

    default:
      return PRIORITY_LEVELS['MEDIUM'];
  }
};

/**
 * Get the display label for scoring types
 */
export const getScoringLabel = (type: ScoringType): string => {
  switch (type) {
    case 'priority':
      return 'Priority';
    case 'lead_score':
      return 'AI Score';
    case 'company_score':
      return 'AI Score';
    case 'job_score':
      return 'AI Score';
    default:
      return 'AI Score';
  }
};

/**
 * Convert level to numeric score (for sorting)
 */
export const convertLevelToScore = (
  level: PriorityLevel | LeadScoreLevel
): number => {
  switch (level) {
    case 'VERY HIGH':
      return 4;
    case 'HIGH':
      return 3;
    case 'High':
      return 3;
    case 'MEDIUM':
      return 2;
    case 'Medium':
      return 2;
    case 'LOW':
      return 1;
    case 'Low':
      return 1;
    default:
      return 2;
  }
};
