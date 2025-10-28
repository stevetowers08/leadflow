/**
 * Utility functions for handling status values consistently across the application
 * Uses the new conversation-based people stages and business pipeline company stages
 */

/**
 * Normalizes a people stage value to a consistent format
 * Maps to the conversation-based workflow: new_lead | message_sent | replied | interested | meeting_scheduled | meeting_completed | follow_up | not_interested
 */
export function normalizePeopleStage(stage: string | null): string {
  if (!stage) {
    return 'new_lead'; // Default fallback
  }

  // Map old statuses to new conversation-based workflow
  const statusMapping: Record<string, string> = {
    // New conversation-based stages
    new_lead: 'new_lead',
    message_sent: 'message_sent',
    replied: 'replied',
    interested: 'interested',
    meeting_scheduled: 'meeting_scheduled',
    meeting_completed: 'meeting_completed',
    follow_up: 'follow_up',
    not_interested: 'not_interested',

    // Map old statuses to new workflow
    new: 'new_lead',
    NEW: 'new_lead',
    'NEW LEAD': 'new_lead',
    'new lead': 'new_lead',
    qualified: 'interested',
    QUALIFIED: 'interested',
    proceed: 'meeting_scheduled',
    PROCEED: 'meeting_scheduled',
    skip: 'not_interested',
    SKIP: 'not_interested',
    'IN QUEUE': 'message_sent',
    'in queue': 'message_sent',
    in_queue: 'message_sent',
    'CONNECT SENT': 'message_sent',
    connection_requested: 'message_sent',
    connect_sent: 'message_sent',
    'connect sent': 'message_sent',
    'MSG SENT': 'message_sent',
    messaged: 'message_sent',
    'message sent': 'message_sent',
    CONNECTED: 'replied',
    connected: 'replied',
    REPLIED: 'replied',
    meeting_booked: 'meeting_scheduled',
    'meeting booked': 'meeting_scheduled',
    meeting_held: 'meeting_completed',
    'meeting held': 'meeting_completed',
    'LEAD LOST': 'not_interested',
    lead_lost: 'not_interested',
    'lead lost': 'not_interested',
    disqualified: 'not_interested',
    contacted: 'message_sent',
  };

  return statusMapping[stage] || 'new_lead';
}

/**
 * Normalizes a company pipeline stage value to a consistent format
 * Maps to the business pipeline workflow: new_lead | message_sent | replied | meeting_scheduled | proposal_sent | negotiation | closed_won | closed_lost | on_hold
 */
export function normalizeCompanyStage(stage: string | null): string {
  if (!stage) {
    return 'new_lead'; // Default fallback
  }

  // Map old statuses to new business pipeline workflow
  const statusMapping: Record<string, string> = {
    // New business pipeline stages
    new_lead: 'new_lead',
    qualified: 'qualified',
    message_sent: 'message_sent',
    replied: 'replied',
    meeting_scheduled: 'meeting_scheduled',
    proposal_sent: 'proposal_sent',
    negotiation: 'negotiation',
    closed_won: 'closed_won',
    closed_lost: 'closed_lost',
    on_hold: 'on_hold',

    // Map old statuses to new workflow
    new: 'new_lead',
    NEW: 'new_lead',
    'NEW LEAD': 'new_lead',
    'new lead': 'new_lead',
    proceed: 'meeting_scheduled',
    PROCEED: 'meeting_scheduled',
    skip: 'closed_lost',
    SKIP: 'closed_lost',
    'IN QUEUE': 'message_sent',
    'in queue': 'message_sent',
    in_queue: 'message_sent',
    'CONNECT SENT': 'message_sent',
    connection_requested: 'message_sent',
    connect_sent: 'message_sent',
    'connect sent': 'message_sent',
    'MSG SENT': 'message_sent',
    messaged: 'message_sent',
    'message sent': 'message_sent',
    CONNECTED: 'replied',
    connected: 'replied',
    REPLIED: 'replied',
    meeting_booked: 'meeting_scheduled',
    'meeting booked': 'meeting_scheduled',
    meeting_held: 'proposal_sent',
    'meeting held': 'proposal_sent',
    'LEAD LOST': 'closed_lost',
    lead_lost: 'closed_lost',
    'lead lost': 'closed_lost',
    disqualified: 'closed_lost',
    contacted: 'message_sent',
  };

  return statusMapping[stage] || 'new_lead';
}

/**
 * Normalizes a status value to a consistent format (legacy function for backward compatibility)
 * Maps to the simplified workflow: new | qualified | proceed | skip
 */
export function normalizeStatus(stage: string | null): string {
  if (!stage) {
    return 'new'; // Default fallback
  }

  // Map old statuses to new simplified workflow
  const statusMapping: Record<string, string> = {
    // New statuses (no change needed)
    new: 'new',
    qualified: 'qualified',
    proceed: 'proceed',
    skip: 'skip',

    // Map old statuses to new workflow
    'NEW LEAD': 'new',
    'new lead': 'new',
    NEW: 'new',
    'IN QUEUE': 'qualified',
    'in queue': 'qualified',
    in_queue: 'qualified',
    'CONNECT SENT': 'qualified',
    connection_requested: 'qualified',
    connect_sent: 'qualified',
    'connect sent': 'qualified',
    'MSG SENT': 'qualified',
    messaged: 'qualified',
    message_sent: 'qualified',
    'message sent': 'qualified',
    CONNECTED: 'qualified',
    connected: 'qualified',
    REPLIED: 'proceed',
    replied: 'proceed',
    meeting_booked: 'proceed',
    'meeting booked': 'proceed',
    meeting_held: 'proceed',
    'meeting held': 'meeting held',
    'LEAD LOST': 'skip',
    lead_lost: 'skip',
    'lead lost': 'skip',
    disqualified: 'skip',
    contacted: 'qualified',
  };

  return statusMapping[stage] || 'new';
}

/**
 * Gets the display text for a status value
 * Uses the simplified workflow display names
 */
export function getStatusDisplayText(status: string): string {
  if (!status) return '';

  // Simplified workflow display mapping
  const displayMapping: Record<string, string> = {
    // People stages - conversation-based workflow
    new_lead: 'New Lead',
    message_sent: 'Message Sent',
    replied: 'Replied',
    interested: 'Interested',
    meeting_scheduled: 'Meeting Scheduled',
    meeting_completed: 'Meeting Completed',
    follow_up: 'Follow-up',
    not_interested: 'Not Interested',

    // Legacy people stages - simplified workflow
    new: 'New',
    proceed: 'Proceed',
    skip: 'Skip',

    // Job qualification status
    qualify: 'Qualified',
    QUALIFY: 'Qualified',

    // Company pipeline stages - business pipeline workflow
    NEW_LEAD: 'New Lead',
    qualified: 'Qualified',
    QUALIFIED: 'Qualified',
    message_sent: 'Message Sent',
    MESSAGE_SENT: 'Message Sent',
    replied: 'Replied',
    REPLIED: 'Replied',
    interested: 'Interested',
    INTERESTED: 'Interested',
    'meeting scheduled': 'Meeting Scheduled',
    MEETING_SCHEDULED: 'Meeting Scheduled',
    proposal_sent: 'Proposal Sent',
    'proposal sent': 'Proposal Sent',
    PROPOSAL_SENT: 'Proposal Sent',
    negotiation: 'Negotiation',
    NEGOTIATION: 'Negotiation',
    closed_won: 'Closed Won',
    'closed won': 'Closed Won',
    CLOSED_WON: 'Closed Won',
    closed_lost: 'Closed Lost',
    'closed lost': 'Closed Lost',
    CLOSED_LOST: 'Closed Lost',
    on_hold: 'On Hold',
    'on hold': 'On Hold',
    ON_HOLD: 'On Hold',
    automated: 'Automated',
    AUTOMATED: 'Automated',
    paused: 'Paused',
    PAUSED: 'Paused',
    completed: 'Completed',
    COMPLETED: 'Completed',
    failed: 'Failed',
    FAILED: 'Failed',

    // Reply types
    INTERESTED: 'Interested',
    'not interested': 'Not Interested',
    NOT_INTERESTED: 'Not Interested',
    maybe: 'Maybe',
    MAYBE: 'Maybe',

    // Interaction types
    email_sent: 'Email Sent',
    EMAIL_SENT: 'Email Sent',
    email_reply: 'Email Reply',
    EMAIL_REPLY: 'Email Reply',
    note: 'Note',
    NOTE: 'Note',

    // User roles
    owner: 'Owner',
    OWNER: 'Owner',
    admin: 'Admin',
    ADMIN: 'Admin',
    recruiter: 'Recruiter',
    RECRUITER: 'Recruiter',
    inactive: 'Inactive',
    INACTIVE: 'Inactive',

    // Job priorities
    HIGH: 'High',
    high: 'High',
    MEDIUM: 'Medium',
    medium: 'Medium',
    LOW: 'Low',
    low: 'Low',
    'VERY HIGH': 'Very High',
    'very-high': 'Very High',
    'very high': 'Very High',
    very_high: 'Very High',
    VERY_HIGH: 'Very High',

    // Company status
    active: 'Active',
    ACTIVE: 'Active',
    company_qualified: 'Qualified',
    prospect: 'Prospect',
    PROSPECT: 'Prospect',

    // Additional status mappings
    assigned: 'Assigned',
    ASSIGNED: 'Assigned',
    sent: 'Sent',
    SENT: 'Sent',
    delivered: 'Delivered',
    DELIVERED: 'Delivered',
    pending: 'Pending',
    PENDING: 'Pending',
    linkedin: 'LinkedIn',
    LINKEDIN: 'LinkedIn',
    email: 'Email',
    EMAIL: 'Email',
    unknown: 'Unknown',
    UNKNOWN: 'Unknown',
    expired: 'Expired',
    EXPIRED: 'Expired',
    draft: 'Draft',
    DRAFT: 'Draft',
  };

  // Return mapped value or convert to title case if not found
  return displayMapping[status] || convertToTitleCase(status);
}

/**
 * Converts a string to title case (first letter of each word capitalized)
 */
function convertToTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Gets the color class for a status value
 * Now uses the unified color scheme for consistency
 */
export function getStatusColorClass(status: string): string {
  return getUnifiedStatusClass(status);
}

/**
 * Validates if a status value is valid (any non-empty string is valid)
 */
export function isValidStatus(status: string | null): boolean {
  return status !== null && status.trim() !== '';
}

/**
 * Gets unified status class for consistent styling
 */
function getUnifiedStatusClass(status: string): string {
  const statusLower = status.toLowerCase();

  // Success/Positive states
  if (
    [
      'interested',
      'qualified',
      'proceed',
      'meeting_scheduled',
      'meeting_completed',
      'closed_won',
      'completed',
    ].includes(statusLower)
  ) {
    return 'bg-green-100 text-green-800 border-green-200';
  }

  // Warning/Neutral states
  if (
    ['maybe', 'follow_up', 'negotiation', 'on_hold', 'paused'].includes(
      statusLower
    )
  ) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }

  // Error/Negative states
  if (
    ['not_interested', 'skip', 'closed_lost', 'failed'].includes(statusLower)
  ) {
    return 'bg-red-100 text-red-800 border-red-200';
  }

  // Info/Default states
  if (
    ['new_lead', 'message_sent', 'replied', 'new', 'automated'].includes(
      statusLower
    )
  ) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }

  // Default fallback
  return 'bg-gray-100 text-gray-800 border-gray-200';
}
