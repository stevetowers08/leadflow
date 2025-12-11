/**
 * Unified Color System for LeadFlow PDR Theme
 *
 * This file provides a centralized way to manage all colors in the application.
 * All colors should use CSS variables defined in globals.css for consistency.
 * 
 * PDR Color System:
 * - Deep Navy (#0A1628) - Dark mode background
 * - Accent Blue (#2563EB) - Primary actions
 * - Success Green (#10B981) - Positive states
 * - Warning Amber (#F59E0B) - Medium priority
 * - Alert Red (#EF4444) - Hot leads/urgent
 */

export const colorSystem = {
  // Primary Attio Blue Colors
  primary: {
    main: 'bg-primary text-primary-foreground',
    hover: 'hover:bg-primary-hover',
    light: 'bg-primary-light text-primary',
    medium: 'bg-primary-medium text-primary-foreground',
    border: 'border-primary',
    borderLight: 'border-primary-light',
    borderMedium: 'border-primary-medium',
    text: 'text-primary',
    textLight: 'text-primary-light',
    textMedium: 'text-primary-medium',
    focus: 'focus:ring-primary focus:border-primary',
  },

  // Secondary Colors
  secondary: {
    main: 'bg-secondary text-secondary-foreground',
    hover: 'hover:bg-secondary-hover',
    light: 'bg-secondary-light text-secondary',
    medium: 'bg-secondary-medium text-secondary-foreground',
    border: 'border-secondary',
    borderLight: 'border-secondary-light',
    borderMedium: 'border-secondary-medium',
    text: 'text-secondary',
    textLight: 'text-secondary-light',
    textMedium: 'text-secondary-medium',
  },

  // Accent Colors
  accent: {
    main: 'bg-accent text-accent-foreground',
    hover: 'hover:bg-accent-hover',
    light: 'bg-accent-light text-accent',
    medium: 'bg-accent-medium text-accent-foreground',
    border: 'border-accent',
    borderLight: 'border-accent-light',
    borderMedium: 'border-accent-medium',
    text: 'text-accent',
    textLight: 'text-accent-light',
    textMedium: 'text-accent-medium',
  },

  // Sidebar Colors
  sidebar: {
    primary: 'bg-sidebar-primary text-sidebar-primary-foreground',
    primaryHover: 'hover:bg-sidebar-primary-hover',
    primaryLight: 'bg-sidebar-primary-light text-sidebar-primary',
    primaryMedium: 'bg-sidebar-primary-medium text-sidebar-primary-foreground',
    primaryBorder: 'border-sidebar-primary',
    primaryBorderLight: 'border-sidebar-primary-light',
    primaryBorderMedium: 'border-sidebar-primary-medium',
    primaryText: 'text-sidebar-primary',
    primaryTextLight: 'text-sidebar-primary-light',
    primaryTextMedium: 'text-sidebar-primary-medium',
  },

  // Semantic Colors
  success: {
    main: 'bg-success text-success-foreground',
    hover: 'hover:bg-success-hover',
    light: 'bg-success-light text-success',
    medium: 'bg-success-medium text-success-foreground',
    border: 'border-success',
    text: 'text-success',
  },

  warning: {
    main: 'bg-warning text-warning-foreground',
    hover: 'hover:bg-warning-hover',
    light: 'bg-warning-light text-warning',
    medium: 'bg-warning-medium text-warning-foreground',
    border: 'border-warning',
    text: 'text-warning',
  },

  destructive: {
    main: 'bg-destructive text-destructive-foreground',
    hover: 'hover:bg-destructive-hover',
    light: 'bg-destructive-light text-destructive',
    medium: 'bg-destructive-medium text-destructive-foreground',
    border: 'border-destructive',
    text: 'text-destructive',
  },

  // Button Variants
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
    outline:
      'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'text-primary hover:bg-primary-light',
    link: 'text-primary underline-offset-4 hover:underline',
    success: 'bg-success text-success-foreground hover:bg-success-hover',
    warning: 'bg-warning text-warning-foreground hover:bg-warning-hover',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
  },

  // Status Colors
  status: {
    active: 'bg-success-light text-success border-success',
    pending: 'bg-warning-light text-warning border-warning',
    inactive: 'bg-muted text-muted-foreground border-border',
    error: 'bg-destructive-light text-destructive border-destructive',
    info: 'bg-primary-light text-primary border-primary',
  },

  // Focus States
  focus: {
    primary: 'focus:ring-primary focus:border-primary',
    secondary: 'focus:ring-secondary focus:border-secondary',
    accent: 'focus:ring-accent focus:border-accent',
  },
} as const;

/**
 * Get button classes for a specific variant
 */
export const getButtonClasses = (
  variant: keyof typeof colorSystem.button
): string => {
  return colorSystem.button[variant];
};

/**
 * Get status classes for a specific status
 */
export const getStatusClasses = (
  status: keyof typeof colorSystem.status
): string => {
  return colorSystem.status[status];
};

/**
 * Get focus classes for a specific color
 */
export const getFocusClasses = (
  color: keyof typeof colorSystem.focus
): string => {
  return colorSystem.focus[color];
};

/**
 * Common color combinations for consistent usage
 */
export const commonColors = {
  // Primary button with all states
  primaryButton: `${colorSystem.button.primary} ${colorSystem.focus.primary} shadow-sm hover:shadow-md transition-all duration-200`,

  // Primary text with hover
  primaryText: `${colorSystem.primary.text} hover:${colorSystem.primary.textMedium} transition-colors duration-200`,

  // Primary background with text
  primaryBackground: `${colorSystem.primary.light} ${colorSystem.primary.borderLight}`,

  // Sidebar navigation item
  sidebarNavItem: `${colorSystem.sidebar.primaryText} hover:${colorSystem.sidebar.primaryLight} transition-colors duration-200`,

  // Input with primary focus
  primaryInput: `border-input bg-background ${colorSystem.focus.primary} transition-colors duration-200`,

  // Card with primary accent
  primaryCard: `${colorSystem.primary.borderLight} ${colorSystem.primary.light}`,
} as const;

export default colorSystem;
