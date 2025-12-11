/**
 * Color Constants
 * Centralized color definitions for charts, UI elements, and status indicators
 * Uses design tokens where possible, provides fallbacks for chart libraries
 */

// Chart color palette - consistent across all charts
export const CHART_COLORS = {
  primary: '#8884d8',
  success: '#82ca9d',
  warning: '#ffc658',
  error: '#ff7c7c',
  info: '#8dd1e1',
  // Extended palette
  secondary: '#8884d8',
  tertiary: '#82ca9d',
  quaternary: '#ffc658',
  quinary: '#ff7c7c',
} as const;

// Chart color array for easy iteration
export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.error,
  CHART_COLORS.info,
] as const;

// Status-specific chart colors
export const STATUS_CHART_COLORS = {
  new: CHART_COLORS.primary,
  qualified: CHART_COLORS.success,
  proceed: CHART_COLORS.info,
  skip: CHART_COLORS.warning,
  qualify: CHART_COLORS.success,
} as const;

// Priority colors for scoring
export const PRIORITY_COLORS = {
  'VERY HIGH': {
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-red-200',
  },
  HIGH: {
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-red-200',
  },
  MEDIUM: {
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-yellow-200',
  },
  LOW: {
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-green-200',
  },
} as const;

// Score range colors (0-100 scale)
export const SCORE_RANGE_COLORS_100 = {
  hot: {
    min: 80,
    max: 100,
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-red-200',
  },
  warm: {
    min: 60,
    max: 79,
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-orange-200',
  },
  cool: {
    min: 40,
    max: 59,
    text: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  cold: {
    min: 0,
    max: 39,
    text: 'text-foreground',
    bg: 'bg-muted',
    border: 'border-border',
  },
} as const;

// Score range colors (1-10 scale)
export const SCORE_RANGE_COLORS_10 = {
  high: {
    min: 8,
    max: 10,
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-red-200',
  },
  medium: {
    min: 5,
    max: 7,
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-yellow-200',
  },
  low: {
    min: 2,
    max: 4,
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-green-200',
  },
  veryLow: {
    min: 1,
    max: 1,
    text: 'text-foreground',
    bg: 'bg-muted',
    border: 'border-border',
  },
} as const;







