/**
 * Centralized Label System
 * ALL labels used throughout the application - single source of truth
 */

export const LABELS = {
  // Core Labels - Title Case
  AI_SCORE: 'AI Score',
  PRIORITY: 'Priority',
  STATUS: 'Status',
  AI_SCORE_REASON: 'AI Score Reason',
  
  // Popup Labels
  POPUP: {
    AI_SCORE: 'AI Score',
    PRIORITY: 'Priority',
    STATUS: 'Status',
  },
  
  // Table Headers
  TABLE: {
    AI_SCORE: 'AI Score',
    PRIORITY: 'Priority', 
    STATUS: 'Status',
    STAGE: 'Status', // Maps to Status
  },
  
  // Sort Options
  SORT: {
    AI_SCORE: 'AI Score',
    PRIORITY: 'Priority',
    STATUS: 'Status',
    STAGE: 'Status', // Maps to Status
  },
  
  // Workflow Builder
  WORKFLOW: {
    AI_SCORE: 'AI Score',
    STATUS: 'Status',
  }
} as const;

/**
 * Get standardized label for any context
 */
export const getLabel = (context: 'popup' | 'table' | 'sort' | 'workflow', type: 'ai_score' | 'priority' | 'status' | 'stage'): string => {
  switch (context) {
    case 'popup':
      switch (type) {
        case 'ai_score': return LABELS.POPUP.AI_SCORE;
        case 'priority': return LABELS.POPUP.PRIORITY;
        case 'status':
        case 'stage': return LABELS.POPUP.STATUS;
        default: return LABELS.POPUP.AI_SCORE;
      }
    case 'table':
      switch (type) {
        case 'ai_score': return LABELS.TABLE.AI_SCORE;
        case 'priority': return LABELS.TABLE.PRIORITY;
        case 'status':
        case 'stage': return LABELS.TABLE.STATUS;
        default: return LABELS.TABLE.AI_SCORE;
      }
    case 'sort':
      switch (type) {
        case 'ai_score': return LABELS.SORT.AI_SCORE;
        case 'priority': return LABELS.SORT.PRIORITY;
        case 'status':
        case 'stage': return LABELS.SORT.STATUS;
        default: return LABELS.SORT.AI_SCORE;
      }
    case 'workflow':
      switch (type) {
        case 'ai_score': return LABELS.WORKFLOW.AI_SCORE;
        case 'status':
        case 'stage': return LABELS.WORKFLOW.STATUS;
        default: return LABELS.WORKFLOW.AI_SCORE;
      }
    default:
      return LABELS.AI_SCORE;
  }
};

/**
 * Legacy function for backward compatibility
 */
export const getStandardLabel = (type: 'ai_score' | 'priority' | 'status' | 'stage'): string => {
  return getLabel('popup', type);
};
