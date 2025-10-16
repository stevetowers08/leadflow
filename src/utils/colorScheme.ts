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
    // Initial/New - Modern Blue (fresh, starting point) - WCAG compliant
    'NEW LEAD': {
      background: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    new: {
      background: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    'new lead': {
      background: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    contacted: {
      background: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },

    // Active/In Progress - Modern Amber/Orange (work in progress) - Better contrast
    'IN QUEUE': {
      background: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    'in queue': {
      background: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    'CONNECT SENT': {
      background: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
    },
    'connect sent': {
      background: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
    },
    connection_requested: {
      background: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
    },
    'MSG SENT': {
      background: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },
    'msg sent': {
      background: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },
    messaged: {
      background: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },

    // Positive/Successful - Modern Green (achieved goals) - Better contrast
    CONNECTED: {
      background: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    connected: {
      background: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    REPLIED: {
      background: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
    replied: {
      background: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
    qualified: {
      background: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    interview: {
      background: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    offer: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    hired: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    meeting_booked: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    meeting_held: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },

    // Negative/Lost - Red (failed, lost)
    'LEAD LOST': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'lead lost': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    lead_lost: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    lost: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    disqualified: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
  },

  jobStatuses: {
    'job-new': {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    new: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'new job': {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'job-active': {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    active: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    automated: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    paused: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    'job-completed': {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    completed: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    'job-failed': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    failed: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    '-': {
      background: 'bg-slate-50',
      text: 'text-slate-500',
      border: 'border-slate-200',
    },
  },

  companyStatuses: {
    active: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    inactive: {
      background: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
    },
    prospect: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    // Company pipeline stages
    new_lead: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    automated: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    replied: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    meeting_scheduled: {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    closed_lost: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
  },

  // Company Pipeline Stages - Professional sales pipeline colors
  companyPipelineStages: {
    // Initial stages - Blue (fresh, starting)
    new_lead: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    NEW_LEAD: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'new lead': {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },

    // Automated/Processed - Green (system working)
    automated: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    AUTOMATED: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },

    // Engagement - Yellow/Orange (active communication)
    replied: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    REPLIED: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    meeting_scheduled: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    'meeting scheduled': {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    MEETING_SCHEDULED: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },

    // Business stages - Purple/Amber (serious business)
    proposal_sent: {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    'proposal sent': {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    PROPOSAL_SENT: {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    negotiation: {
      background: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    NEGOTIATION: {
      background: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },

    // Final outcomes - Green/Red (success/failure)
    closed_won: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    'closed won': {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    CLOSED_WON: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    closed_lost: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'closed lost': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    CLOSED_LOST: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },

    // Hold status - Gray (paused)
    on_hold: {
      background: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    'on hold': {
      background: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    ON_HOLD: {
      background: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
  },

  // Reply Types - Sentiment-based colors
  replyTypes: {
    interested: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    INTERESTED: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    not_interested: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'not interested': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    NOT_INTERESTED: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    maybe: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    MAYBE: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
  },

  // Campaign Status - Action-based colors
  campaignStatus: {
    draft: {
      background: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    DRAFT: {
      background: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
    active: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    ACTIVE: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    paused: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    PAUSED: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
  },

  priorities: {
    low: {
      background: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
    },
    LOW: {
      background: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
    },
    medium: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    MEDIUM: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    high: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    HIGH: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    urgent: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'very high': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'VERY HIGH': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'very-high': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
  },

  employmentTypes: {
    'full-time': {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'part-time': {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    contract: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    internship: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    freelance: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
  },

  automationStatuses: {
    queued: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    running: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'automation-completed': {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    automated: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    Automated: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    pending: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    Pending: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
  },

  leadScores: {
    'very high': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'VERY HIGH': {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    high: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    High: {
      background: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    medium: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    Medium: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    low: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    Low: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
  },

  workflowSteps: {
    trigger: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    condition: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    action: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    delay: {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
  },
};

/**
 * Get the unified color scheme for any status
 * Searches across all categories to find the appropriate colors
 */
export function getUnifiedStatusColors(status: string): ColorScheme {
  const normalizedStatus = status.toLowerCase().trim();

  // Search in all categories
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
    // Check exact match first
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
 * Get the CSS class string for a status
 */
export function getUnifiedStatusClass(status: string): string {
  const colors = getUnifiedStatusColors(status);
  return `${colors.background} ${colors.text} ${colors.border}`;
}

/**
 * Get gradient version for special cases (like Pipeline page)
 */
export function getUnifiedStatusGradient(status: string): string {
  const colors = getUnifiedStatusColors(status);
  const baseColor = colors.background.replace('bg-', '').replace('-50', '');
  return `bg-gradient-to-br from-${baseColor}-50 to-${baseColor}-100 ${colors.border}`;
}
