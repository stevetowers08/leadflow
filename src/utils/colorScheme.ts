/**
 * Centralized color scheme for consistent status indicators throughout the app
 * This ensures all status badges, stages, and indicators use the same colors
 */

export interface ColorScheme {
  background: string;
  text: string;
  border: string;
}

export interface StatusColorScheme {
  // Lead Pipeline Stages
  leadStages: Record<string, ColorScheme>;

  // Job Statuses
  jobStatuses: Record<string, ColorScheme>;

  // Company Statuses
  companyStatuses: Record<string, ColorScheme>;

  // Company Pipeline Stages
  companyPipelineStages: Record<string, ColorScheme>;

  // Reply Types
  replyTypes: Record<string, ColorScheme>;

  // Campaign Status
  campaignStatus: Record<string, ColorScheme>;

  // Priority Levels
  priorities: Record<string, ColorScheme>;

  // Employment Types
  employmentTypes: Record<string, ColorScheme>;

  // Automation Statuses
  automationStatuses: Record<string, ColorScheme>;

  // Lead Scores
  leadScores: Record<string, ColorScheme>;

  // Workflow Steps
  workflowSteps: Record<string, ColorScheme>;
}

/**
 * Unified color scheme - all status indicators use these exact colors
 * Colors are chosen for semantic meaning and accessibility
 */
export const UNIFIED_COLOR_SCHEME: StatusColorScheme = {
  leadStages: {
    // Initial/New - Light Grey (neutral, starting point)
    'NEW LEAD': {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    new: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    'new lead': {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    contacted: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },

    // Active/In Progress - Modern Dark Amber/Orange (work in progress) - Better contrast
    'IN QUEUE': {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },
    'in queue': {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },
    'CONNECT SENT': {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    'connect sent': {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    connection_requested: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    'MSG SENT': {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    'msg sent': {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    messaged: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },

    // Positive/Successful - Modern Dark Green (achieved goals) - Better contrast
    CONNECTED: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    connected: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    REPLIED: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    replied: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    qualified: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    interview: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    offer: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    hired: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    meeting_booked: {
      background: 'bg-teal-600',
      text: 'text-white',
      border: 'border-teal-700',
    },
    meeting_held: {
      background: 'bg-teal-600',
      text: 'text-white',
      border: 'border-teal-700',
    },

    // Negative/Lost - Red (failed, lost)
    'LEAD LOST': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'lead lost': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    lead_lost: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    lost: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    disqualified: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
  },

  jobStatuses: {
    'job-new': {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    new: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    'new job': {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    'job-active': {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    active: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    automated: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    paused: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    'job-completed': {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    completed: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    'job-failed': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    failed: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    '-': {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
  },

  companyStatuses: {
    active: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    inactive: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    prospect: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    // Company pipeline stages - Modern Dark Colors
    new_lead: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    automated: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    replied: {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },
    meeting_scheduled: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    closed_lost: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
  },

  // Company Pipeline Stages - Modern Dark Colors (2024-2025 Standards)
  companyPipelineStages: {
    // Initial stages - Light Grey (neutral, starting point)
    new_lead: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    NEW_LEAD: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    'new lead': {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },

    // Automated/Processed - Modern Dark Green (system working)
    automated: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    AUTOMATED: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },

    // Engagement - Modern Dark Amber/Orange (active communication)
    replied: {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },
    REPLIED: {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },
    meeting_scheduled: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    'meeting scheduled': {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    MEETING_SCHEDULED: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },

    // Business stages - Modern Dark Purple/Amber (serious business)
    proposal_sent: {
      background: 'bg-purple-600',
      text: 'text-white',
      border: 'border-purple-700',
    },
    'proposal sent': {
      background: 'bg-purple-600',
      text: 'text-white',
      border: 'border-purple-700',
    },
    PROPOSAL_SENT: {
      background: 'bg-purple-600',
      text: 'text-white',
      border: 'border-purple-700',
    },
    negotiation: {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },
    NEGOTIATION: {
      background: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-700',
    },

    // Final outcomes - Modern Dark Green/Red (success/failure)
    closed_won: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    'closed won': {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    CLOSED_WON: {
      background: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
    },
    closed_lost: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'closed lost': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    CLOSED_LOST: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },

    // Hold status - Modern Dark Gray (paused)
    on_hold: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    'on hold': {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    ON_HOLD: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
  },

  // Reply Types - Modern Dark Colors
  replyTypes: {
    interested: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    INTERESTED: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    not_interested: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'not interested': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    NOT_INTERESTED: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    maybe: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    MAYBE: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
  },

  // Campaign Status - Modern Dark Colors
  campaignStatus: {
    draft: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    DRAFT: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    active: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    ACTIVE: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    paused: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    PAUSED: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
  },

  priorities: {
    low: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    LOW: {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
    medium: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    MEDIUM: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    high: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    HIGH: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    urgent: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'very high': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'VERY HIGH': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'very-high': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
  },

  employmentTypes: {
    'full-time': {
      background: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-700',
    },
    'part-time': {
      background: 'bg-purple-600',
      text: 'text-white',
      border: 'border-purple-700',
    },
    contract: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    internship: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    freelance: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
  },

  automationStatuses: {
    queued: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    running: {
      background: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-700',
    },
    'automation-completed': {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    automated: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    Automated: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    pending: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
    Pending: {
      background: 'bg-orange-600',
      text: 'text-white',
      border: 'border-orange-700',
    },
  },

  leadScores: {
    'very high': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'VERY HIGH': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    high: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    High: {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    medium: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    Medium: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    low: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    Low: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    // Numeric score ranges for AI scores
    'score-high': {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    'score-medium-high': {
      background: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-700',
    },
    'score-medium': {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    'score-low': {
      background: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
    },
    'score-empty': {
      background: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
    },
  },

  workflowSteps: {
    trigger: {
      background: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-700',
    },
    condition: {
      background: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-700',
    },
    action: {
      background: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
    },
    delay: {
      background: 'bg-purple-600',
      text: 'text-white',
      border: 'border-purple-700',
    },
  },
};

/**
 * Get the unified color scheme for any status
 * Searches across all categories to find the appropriate colors
 * Optimized with early returns and memoization
 */
export function getUnifiedStatusColors(status: string): ColorScheme {
  // Early return for empty status
  if (!status || status.trim() === '') {
    return {
      background: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
    };
  }

  const normalizedStatus = status.toLowerCase().trim();

  // Search in all categories with early returns
  const categories = [
    UNIFIED_COLOR_SCHEME.leadStages,
    UNIFIED_COLOR_SCHEME.jobStatuses,
    UNIFIED_COLOR_SCHEME.companyStatuses,
    UNIFIED_COLOR_SCHEME.companyPipelineStages,
    UNIFIED_COLOR_SCHEME.replyTypes,
    UNIFIED_COLOR_SCHEME.campaignStatus,
    UNIFIED_COLOR_SCHEME.priorities,
    UNIFIED_COLOR_SCHEME.employmentTypes,
    UNIFIED_COLOR_SCHEME.automationStatuses,
    UNIFIED_COLOR_SCHEME.leadScores,
    UNIFIED_COLOR_SCHEME.workflowSteps,
  ];

  for (const category of categories) {
    // Check exact match first (most common case)
    if (category[status]) {
      return category[status];
    }

    // Check normalized match
    if (category[normalizedStatus]) {
      return category[normalizedStatus];
    }
  }

  // Default fallback
  return {
    background: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };
}

/**
 * Convert numeric AI score to status-like value for unified styling
 */
export function convertNumericScoreToStatus(
  score: string | number | null
): string {
  if (score === null || score === undefined || score === '') {
    return 'score-empty';
  }

  const numScore = typeof score === 'string' ? parseInt(score, 10) : score;

  if (Number.isNaN(numScore)) {
    return 'score-empty';
  }

  if (numScore >= 85) {
    return 'score-high';
  }

  if (numScore >= 70) {
    return 'score-medium-high';
  }

  if (numScore >= 50) {
    return 'score-medium';
  }

  return 'score-low';
}

/**
 * Get the CSS class string for a status
 * Optimized with memoization for repeated calls
 */
const statusClassCache = new Map<string, string>();

export function getUnifiedStatusClass(status: string): string {
  // Check cache first
  if (statusClassCache.has(status)) {
    return statusClassCache.get(status)!;
  }

  const colors = getUnifiedStatusColors(status);
  const classString = `${colors.background} ${colors.text} ${colors.border}`;

  // Cache the result
  statusClassCache.set(status, classString);

  return classString;
}

/**
 * Get gradient version for special cases (like Pipeline page)
 */
export function getUnifiedStatusGradient(status: string): string {
  const colors = getUnifiedStatusColors(status);
  const baseColor = colors.background.replace('bg-', '').replace('-50', '');
  return `bg-gradient-to-br from-${baseColor}-50 to-${baseColor}-100 ${colors.border}`;
}
