/**
 * Design Tokens for Empowr CRM
 * Centralized design decisions for consistency
 */

export const designTokens = {
  // Typography - Complete hierarchy
  typography: {
    heading: {
      h1: 'text-2xl font-semibold tracking-tight',
      h2: 'text-xl font-semibold tracking-tight',
      h3: 'text-lg font-semibold tracking-tight',
      h4: 'text-base font-semibold tracking-tight',
    },
    body: {
      default: 'text-sm text-foreground',
      muted: 'text-sm text-muted-foreground',
      small: 'text-xs text-muted-foreground',
      large: 'text-base text-foreground',
    },
    mobile: {
      h1: 'text-lg font-semibold tracking-tight',
      h2: 'text-base font-semibold tracking-tight',
      body: 'text-sm text-foreground',
      muted: 'text-xs text-muted-foreground',
    },
  },

  // Spacing - Complete scale
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    section: 'mb-4',
    container: 'gap-6',
    item: 'gap-2',
    // Padding scale
    padding: {
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    // Card-specific padding patterns
    cardPadding: {
      default: 'p-6',
      compact: 'p-3',
      mobile: 'p-3',
      desktop: 'p-6',
      responsive: 'p-3 lg:p-6',
    },
    // Margin scale
    margin: {
      xs: 'mb-1',
      sm: 'mb-2',
      md: 'mb-3',
      lg: 'mb-4',
      xl: 'mb-6',
    },
    // Sidebar-specific spacing patterns
    sidebar: {
      section: 'space-y-6', // Between major sections
      item: 'space-y-1', // Between navigation items
      header: 'px-6 h-16', // Header padding and height
      nav: 'px-4 py-6', // Main navigation padding
      footer: 'px-4 py-4', // User menu padding
      label: 'px-3 mb-3', // Section label padding
    },
  },

  // Layout - Consistent patterns
  layout: {
    pageHeader: 'mb-3',
    pageContent: 'space-y-4',
    statsContainer: 'flex items-center gap-6 mb-4 text-sm',
    statsItem: 'flex items-center gap-2 text-muted-foreground',
    cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    mobileCardGrid: 'grid grid-cols-2 gap-3',
  },

  // Icons - Consistent sizing
  icons: {
    size: 'h-4 w-4',
    sizeSm: 'h-3 w-3',
    sizeLg: 'h-5 w-5',
    sizeXl: 'h-6 w-6',
    container: 'text-muted-foreground',
  },

  // Logos - Consistent sizing across all pages
  logos: {
    size: 'w-8 h-8', // Standard logo size for tables and lists
    sizeSm: 'w-6 h-6', // Small logos for compact views
    sizeLg: 'w-10 h-10', // Large logos for detail views
    sizeXl: 'w-12 h-12', // Extra large logos for headers
    container: 'rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0', // Slightly rounded squares
    fallback: 'bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-semibold',
  },

  // Colors - Professional LinkedIn-inspired semantic color tokens
  colors: {
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      accent: 'text-sidebar-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-destructive',
    },
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      accent: 'bg-sidebar-primary/10',
      success: 'bg-success/10',
      warning: 'bg-warning/10',
      error: 'bg-destructive/10',
    },
    // Professional color combinations for common patterns
    combinations: {
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10',
      error: 'text-destructive bg-destructive/10',
      info: 'text-sidebar-primary bg-sidebar-primary/10',
      primary: 'text-sidebar-primary bg-sidebar-primary/10',
    },
  },

  // Shadows - Professional elevation system
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    // Professional card-specific shadow patterns
    card: 'shadow-sm hover:shadow-md transition-shadow duration-300',
    cardStatic: 'shadow-sm',
    cardHover: 'hover:shadow-md transition-shadow duration-300',
    mobile: 'shadow-sm',
    // Professional button shadows
    button: 'shadow-sm hover:shadow-md',
  },

  // Transitions - Professional timing system
  transitions: {
    fast: 'transition-colors duration-150',
    normal: 'transition-colors duration-200',
    slow: 'transition-all duration-300',
    transform: 'transition-transform duration-200',
    hover: 'transition-all duration-300 hover:scale-[1.02] active:scale-98',
  },

  // Loading States
  loading: {
    spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary mx-auto mb-4',
    text: 'text-sm text-muted-foreground mt-2',
    container: 'text-center py-12',
  },

  // Touch targets - Accessibility
  touch: {
    minSize: 'min-h-[44px] min-w-[44px]',
    manipulation: 'touch-manipulation',
    target: 'touch-target',
  },
} as const;

// Type-safe design token access
export type TypographyToken = keyof typeof designTokens.typography.heading;
export type SpacingToken = keyof typeof designTokens.spacing;
export type LayoutToken = keyof typeof designTokens.layout;
