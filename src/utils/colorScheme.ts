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

  // Campaigns Steps
  campaignsSteps: Record<string, ColorScheme>;
}

/**
 * Unified color scheme - all status indicators use these exact colors
 * Colors are chosen for semantic meaning and accessibility
 */
export const UNIFIED_COLOR_SCHEME: StatusColorScheme = {
  leadStages: {
    // Initial/New - Light Grey (neutral, starting point)
    'NEW LEAD': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    new: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'new lead': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    new_lead: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    contacted: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },

    // Proceed (next actionable step) - Modern Blue (in progress/next)
    proceed: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    PROCEED: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },

    // Active/In Progress - Modern Dark Amber/Orange (work in progress) - Better contrast
    'IN QUEUE': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'in queue': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'CONNECT SENT': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'connect sent': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    connection_requested: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'MSG SENT': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'msg sent': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'message sent': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    message_sent: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    messaged: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },

    // Positive/Successful - Modern Dark Green (achieved goals) - Better contrast
    CONNECTED: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    connected: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    REPLIED: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    replied: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    qualified: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    skip: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    interview: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    offer: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    hired: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    meeting_booked: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    meeting_held: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },

    // Negative/Lost - Red (failed, lost)
    'LEAD LOST': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    'lead lost': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    lead_lost: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    lost: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    disqualified: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
  },

  companyStatuses: {
    active: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    inactive: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    prospect: {
      background: 'bg-gray-100',
      text: 'text-foreground',
      border: 'border-border',
    },
    // Company pipeline stages - Modern Dark Colors
    new_lead: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    automated: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    replied: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    meeting_scheduled: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    closed_lost: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
  },

  // Company Pipeline Stages - Modern Dark Colors (2024-2025 Standards)
  companyPipelineStages: {
    // Initial stages - Dark Info (modern informative)
    new_lead: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    NEW_LEAD: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'new lead': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },

    // Qualified - Modern Dark Green (system working)
    qualified: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    QUALIFIED: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },

    // Automated/Processed - Modern Dark Green (system working)
    automated: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    AUTOMATED: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },

    // Engagement - Modern Dark Amber/Orange (active communication)
    replied: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    REPLIED: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    // Distinguish message sent from replied: use info (blue) for sent, amber for replied
    message_sent: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'message sent': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'MSG SENT': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    meeting_scheduled: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    'meeting scheduled': {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    MEETING_SCHEDULED: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },

    // Business stages - Modern Dark Purple/Amber (serious business)
    proposal_sent: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'proposal sent': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    PROPOSAL_SENT: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    negotiation: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    NEGOTIATION: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },

    // Final outcomes - Modern Dark Green/Red (success/failure)
    closed_won: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    'closed won': {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    CLOSED_WON: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    closed_lost: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    'closed lost': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    CLOSED_LOST: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },

    // Hold status - Modern Dark Gray (paused)
    on_hold: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    'on hold': {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    ON_HOLD: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
  },

  // Reply Types - Modern Dark Colors
  replyTypes: {
    interested: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    INTERESTED: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    not_interested: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    'not interested': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    NOT_INTERESTED: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    maybe: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    MAYBE: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
  },

  // Campaign Status - Modern Dark Colors
  campaignStatus: {
    draft: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    DRAFT: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    active: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    ACTIVE: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    paused: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    PAUSED: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
  },

  priorities: {
    low: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    LOW: {
      background: 'bg-neutral-solid',
      text: 'text-white',
      border: 'border-neutral-solid',
    },
    medium: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    MEDIUM: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    high: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    HIGH: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    urgent: {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    'very high': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    'VERY HIGH': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
    'very-high': {
      background: 'bg-error-solid',
      text: 'text-white',
      border: 'border-error-solid',
    },
  },

  employmentTypes: {
    'full-time': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'part-time': {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    contract: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    internship: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    freelance: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
  },

  automationStatuses: {
    queued: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    running: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    'automation-completed': {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    automated: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    Automated: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    pending: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    Pending: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
  },

  leadScores: {
    'very high': {
      background: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/20',
    },
    'VERY HIGH': {
      background: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/20',
    },
    high: {
      background: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
    },
    High: {
      background: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
    },
    medium: {
      background: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    Medium: {
      background: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    low: {
      background: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    Low: {
      background: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    // Numeric score ranges for AI scores
    'score-high': {
      background: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
    },
    'score-medium-high': {
      background: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
    },
    'score-medium': {
      background: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    'score-low': {
      background: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    'score-empty': {
      background: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
    },
  },

  campaignsSteps: {
    trigger: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
    },
    condition: {
      background: 'bg-warning-solid',
      text: 'text-white',
      border: 'border-warning-solid',
    },
    action: {
      background: 'bg-success-solid',
      text: 'text-white',
      border: 'border-success-solid',
    },
    delay: {
      background: 'bg-info-solid',
      text: 'text-white',
      border: 'border-info-solid',
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
      background: 'bg-muted',
      text: 'text-foreground',
      border: 'border-border',
    };
  }

  const normalizedStatus = status.toLowerCase().trim();

  // Search in all categories with early returns
  const categories = [
    // Prioritize context-specific mappings first to avoid cross-entity collisions
    UNIFIED_COLOR_SCHEME.companyStatuses,
    UNIFIED_COLOR_SCHEME.companyPipelineStages,
    // Then generic/people mappings
    UNIFIED_COLOR_SCHEME.leadStages,
    UNIFIED_COLOR_SCHEME.replyTypes,
    UNIFIED_COLOR_SCHEME.campaignStatus,
    UNIFIED_COLOR_SCHEME.priorities,
    UNIFIED_COLOR_SCHEME.employmentTypes,
    UNIFIED_COLOR_SCHEME.automationStatuses,
    UNIFIED_COLOR_SCHEME.leadScores,
    UNIFIED_COLOR_SCHEME.campaignsSteps,
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
    background: 'bg-muted',
    text: 'text-foreground',
    border: 'border-border',
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
