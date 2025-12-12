/**
 * Color Design Tokens
 * Semantic color tokens that reference CSS variables defined in globals.css
 * All colors MUST use CSS variables, never hardcoded values
 */

export const colorTokens = {
  // Semantic tokens reference primitive tokens from CSS variables
  semantic: {
    primary: 'var(--primary)',
    'primary-foreground': 'var(--primary-foreground)',
    'primary-hover': 'var(--primary-hover)',
    'primary-light': 'var(--primary-light)',
    'primary-medium': 'var(--primary-medium)',

    secondary: 'var(--secondary)',
    'secondary-foreground': 'var(--secondary-foreground)',
    'secondary-hover': 'var(--secondary-hover)',
    'secondary-light': 'var(--secondary-light)',
    'secondary-medium': 'var(--secondary-medium)',

    accent: 'var(--accent)',
    'accent-foreground': 'var(--accent-foreground)',
    'accent-hover': 'var(--accent-hover)',
    'accent-light': 'var(--accent-light)',
    'accent-medium': 'var(--accent-medium)',

    destructive: 'var(--destructive)',
    'destructive-foreground': 'var(--destructive-foreground)',
    'destructive-hover': 'var(--destructive-hover)',
    'destructive-light': 'var(--destructive-light)',
    'destructive-medium': 'var(--destructive-medium)',

    success: 'var(--success)',
    'success-foreground': 'var(--success-foreground)',
    'success-hover': 'var(--success-hover)',
    'success-light': 'var(--success-light)',
    'success-medium': 'var(--success-medium)',

    warning: 'var(--warning)',
    'warning-foreground': 'var(--warning-foreground)',
    'warning-hover': 'var(--warning-hover)',
    'warning-light': 'var(--warning-light)',
    'warning-medium': 'var(--warning-medium)',

    info: 'var(--info)',
    'info-foreground': 'var(--info-foreground)',
    'info-hover': 'var(--info-hover)',
    'info-light': 'var(--info-light)',
    'info-medium': 'var(--info-medium)',

    muted: 'var(--muted)',
    'muted-foreground': 'var(--muted-foreground)',
    'muted-hover': 'var(--muted-hover)',
    'muted-light': 'var(--muted-light)',
    'muted-medium': 'var(--muted-medium)',

    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    'card-foreground': 'var(--card-foreground)',
    popover: 'var(--popover)',
    'popover-foreground': 'var(--popover-foreground)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
  },

  // Sidebar-specific colors
  sidebar: {
    background: 'var(--sidebar-background)',
    foreground: 'var(--sidebar-foreground)',
    primary: 'var(--sidebar-primary)',
    'primary-foreground': 'var(--sidebar-primary-foreground)',
    'primary-hover': 'var(--sidebar-primary-hover)',
    'primary-light': 'var(--sidebar-primary-light)',
    'primary-medium': 'var(--sidebar-primary-medium)',
    accent: 'var(--sidebar-accent)',
    'accent-foreground': 'var(--sidebar-accent-foreground)',
    border: 'var(--sidebar-border)',
    ring: 'var(--sidebar-ring)',
  },

  // Gradient tokens
  gradients: {
    primary: 'var(--gradient-primary)',
    'primary-subtle': 'var(--gradient-primary-subtle)',
    success: 'var(--gradient-success)',
    'success-subtle': 'var(--gradient-success-subtle)',
    warning: 'var(--gradient-warning)',
    'warning-subtle': 'var(--gradient-warning-subtle)',
    info: 'var(--gradient-info)',
    'info-subtle': 'var(--gradient-info-subtle)',
  },
} as const;

// Type exports for type-safe usage
export type ColorToken =
  (typeof colorTokens.semantic)[keyof typeof colorTokens.semantic];
export type SidebarColorToken =
  (typeof colorTokens.sidebar)[keyof typeof colorTokens.sidebar];
export type GradientToken =
  (typeof colorTokens.gradients)[keyof typeof colorTokens.gradients];
