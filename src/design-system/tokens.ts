/**
 * Design Tokens for RECRUITEDGE
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

  // Spacing - Complete scale with modern best practices
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    section: 'mb-4',
    container: 'gap-6',
    item: 'gap-2',
    // Modern padding scale using rem units
    padding: {
      xs: 'p-2', // 0.5rem
      sm: 'p-3', // 0.75rem
      md: 'p-4', // 1rem
      lg: 'p-6', // 1.5rem
      xl: 'p-8', // 2rem
    },
    // Page-level padding following modern best practices - aligned with header
    pagePadding: {
      mobile: 'px-4', // Mobile: 1rem horizontal only
      desktop: 'px-6', // Desktop: 1.5rem horizontal only - matches header px-6
      responsive: 'px-4 lg:px-6', // Responsive scaling - aligned with header, horizontal only
      // Full padding (horizontal + vertical) for Page component
      full: 'p-4 lg:p-6', // Responsive: 1rem mobile, 1.5rem desktop (all sides)
      // Horizontal padding only (for scrollbar edge cases)
      horizontal: 'px-4 lg:px-6', // Horizontal only, responsive
      // Vertical padding only
      vertical: 'py-6', // Vertical only, 1.5rem
      // Split padding for scrollbar edge handling
      content: 'px-4 lg:px-6 py-6', // Content padding (all sides)
      container: 'pt-6 pl-4 pb-6 lg:pl-6 pr-0', // Container padding (no right for scrollbar edge)
    },
    // Card-specific padding patterns
    cardPadding: {
      default: 'p-6',
      compact: 'p-3',
      mobile: 'p-4',
      desktop: 'p-6',
      responsive: 'p-4 lg:p-6',
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
    container:
      'rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0', // Slightly rounded squares
    fallback:
      'bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-semibold',
  },

  // Colors - Simplified 6-color palette + neutrals
  colors: {
    text: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      accent: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-destructive',
      info: 'text-info',
    },
    background: {
      primary: 'bg-background',
      secondary: 'bg-muted',
      accent: 'bg-primary/10',
      success: 'bg-success/10',
      warning: 'bg-warning/10',
      error: 'bg-destructive/10',
      info: 'bg-info/10',
    },
    // Simplified color combinations for common patterns
    combinations: {
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10',
      error: 'text-destructive bg-destructive/10',
      info: 'text-info bg-info/10',
      primary: 'text-primary bg-primary/10',
      muted: 'text-muted-foreground bg-muted',
      // Status combinations
      qualified: 'text-success bg-success/10',
      proceed: 'text-primary bg-primary/10',
      skip: 'text-muted-foreground bg-muted',
      new: 'text-warning bg-warning/10',
    },
    // Extended palette for specialized components (IndustryBadge, etc.)
    // Uses semantic mapping where possible, falls back to muted for neutral industries
    extended: {
      // Technology/IT - Use primary/info
      tech: 'bg-primary/10 text-primary border-primary/20',
      // Healthcare - Use success
      healthcare: 'bg-success/10 text-success border-success/20',
      // Finance - Use warning
      finance: 'bg-warning/10 text-warning border-warning/20',
      // Neutral/Industrial - Use muted
      neutral: 'bg-muted text-foreground border-border',
    },
  },

  // Shadows - Professional elevation system (2025 Best Practices)
  shadows: {
    sm: 'shadow-sm', // 0 1px 2px 0 rgb(0 0 0 / 0.05) - Very subtle (static state)
    md: 'shadow-md', // 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) - Medium elevation (hover state)
    lg: 'shadow-lg', // Large elevation (for special cases only)
    xl: 'shadow-xl', // Extra large elevation (for special cases only)
    // Professional card-specific shadow patterns (2025 Best Practices)
    card: 'shadow-sm hover:shadow-md transition-all duration-200', // Updated for 2025 standards
    cardStatic: 'shadow-sm', // Static cards with no hover
    cardHover: 'hover:bg-gray-100 hover:shadow-md transition-all duration-200', // Updated: includes background + shadow
    mobile: 'shadow-sm', // Mobile-optimized minimal shadows
    // Professional button shadows
    button: 'shadow-sm hover:shadow-md',
    // Clickable card hover (Dashboard, Getting Started, etc.)
    cardInteractive:
      'hover:bg-gray-100 hover:shadow-md transition-all duration-200',
  },

  // Borders - Unified border system using CSS variables
  borders: {
    default: 'border border-border',
    subtle: 'border border-border/60',
    strong: 'border-2 border-border',
    accent: 'border border-primary/20',
    success: 'border border-success/20',
    warning: 'border border-warning/20',
    error: 'border border-destructive/20',
    info: 'border border-info/20',
    // Card-specific borders
    card: 'border border-border',
    cardHover: 'hover:border-border',
    cardFocus: 'focus:border-primary',
    // Table-specific borders
    table: 'border border-border',
    tableHeader: 'border-b border-border',
    tableCell: 'border-r border-border last:border-r-0',
    tableRow: 'border-b border-border last:border-b-0',
  },

  // Transitions - Professional timing system
  transitions: {
    fast: 'transition-colors duration-150',
    normal: 'transition-colors duration-200',
    slow: 'transition-all duration-300',
    transform: 'transition-transform duration-200',
    // Hover effects - Color and shadow transitions only (NO scale effects)
    // Following HubSpot design patterns - subtle color changes and shadow elevation
    hoverInteractive:
      'cursor-pointer transition-all duration-200 hover:shadow-md',
    // Card hover effects - ONLY for clickable cards
    cardInteractive:
      'cursor-pointer transition-all duration-200 hover:shadow-md',
    cardStatic: 'transition-shadow duration-200 hover:shadow-md',
  },

  // Loading States
  loading: {
    spinner:
      'animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary mx-auto mb-4',
    text: 'text-sm text-muted-foreground mt-2',
    container: 'text-center py-12',
  },

  // Touch targets - Accessibility
  touch: {
    minSize: 'min-h-[44px] min-w-[44px]',
    manipulation: 'touch-manipulation',
    target: 'touch-target',
  },

  // Filter Controls - Unified styling for all table pages
  filterControls: {
    // Container styling - cleaner spacing
    container:
      'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full flex-shrink-0',

    // Group styling - tighter gaps
    leftGroup: 'flex flex-col sm:flex-row items-stretch sm:items-center gap-2',
    rightGroup: 'flex items-center gap-2',

    // Dropdown styling - cleaner borders and larger sizes
    dropdown:
      'bg-white h-8 px-3 text-sm border border-border rounded-md hover:border-border hover:bg-muted transition-colors',
    dropdownSmall: 'min-w-28',
    dropdownMedium: 'min-w-32',
    dropdownLarge: 'min-w-40',

    // Button styling - cleaner borders, larger size
    button:
      'h-8 w-8 rounded-md border flex items-center justify-center transition-colors flex-shrink-0',
    buttonDefault:
      'bg-white text-muted-foreground border-border hover:border-border hover:bg-muted',
    buttonActive:
      'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',

    // Icon styling
    icon: 'h-4 w-4',
    iconActive: 'fill-current',
  },
} as const;

// Type-safe design token access
export type TypographyToken = keyof typeof designTokens.typography.heading;
export type SpacingToken = keyof typeof designTokens.spacing;
export type LayoutToken = keyof typeof designTokens.layout;
