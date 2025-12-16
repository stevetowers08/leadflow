/**
 * Design Tokens for LeadFlow
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

  // Shadows - Professional elevation system with variety (2025 Best Practices)
  shadows: {
    // Base shadow levels
    sm: 'shadow-sm', // 0 1px 2px 0 rgb(0 0 0 / 0.05) - Very subtle
    md: 'shadow-md', // 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
    lg: 'shadow-lg', // 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
    xl: 'shadow-xl', // 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
    '2xl': 'shadow-2xl', // 0 25px 50px -12px rgb(0 0 0 / 0.25)
    // Colored shadows for depth
    primary: 'shadow-lg shadow-primary/10',
    success: 'shadow-lg shadow-success/10',
    warning: 'shadow-lg shadow-warning/10',
    error: 'shadow-lg shadow-destructive/10',
    // Soft shadows (subtle)
    soft: 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
    softer: 'shadow-[0_1px_4px_rgba(0,0,0,0.02)]',
    // Inner shadows
    inner: 'shadow-inner',
    // Card-specific shadow patterns
    card: 'shadow-sm hover:shadow-md transition-all duration-200',
    cardStatic: 'shadow-sm',
    cardHover: 'hover:bg-gray-100 hover:shadow-md transition-all duration-200',
    cardElevated: 'shadow-md hover:shadow-lg transition-all duration-200',
    cardFloating: 'shadow-lg hover:shadow-xl transition-all duration-200',
    cardGlow:
      'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30',
    // Mobile-optimized
    mobile: 'shadow-sm',
    // Button shadows
    button: 'shadow-sm hover:shadow-md',
    buttonPrimary:
      'shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30',
    // Interactive card shadows
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

  // Transitions - Professional timing system (2025 Best Practices)
  transitions: {
    fast: 'transition-colors duration-150 ease-out',
    normal: 'transition-colors duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    transform: 'transition-transform duration-200 ease-out',
    // Hover effects - Color and shadow transitions only (NO scale effects)
    // Following HubSpot design patterns - subtle color changes and shadow elevation
    hoverInteractive:
      'cursor-pointer transition-all duration-200 ease-out hover:shadow-md',
    // Card hover effects - ONLY for clickable cards
    cardInteractive:
      'cursor-pointer transition-all duration-200 ease-out hover:shadow-md',
    cardStatic: 'transition-shadow duration-200 ease-out hover:shadow-md',
    // 2025 Microinteractions - Subtle feedback patterns
    microinteraction: 'transition-all duration-200 ease-out',
    focusRing:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    // Smooth animations for state changes
    smooth: 'transition-all duration-300 ease-in-out',
  },

  // Animations - Enhanced variety (2025 Best Practices)
  animations: {
    // Fade animations
    fadeIn: 'animate-in fade-in duration-200',
    fadeOut: 'animate-out fade-out duration-200',
    fadeInSlow: 'animate-in fade-in duration-500',
    // Slide animations
    slideUp: 'animate-in slide-in-from-bottom-4 duration-200',
    slideDown: 'animate-in slide-in-from-top-4 duration-200',
    slideLeft: 'animate-in slide-in-from-right-4 duration-200',
    slideRight: 'animate-in slide-in-from-left-4 duration-200',
    slideUpSlow: 'animate-in slide-in-from-bottom-4 duration-500',
    // Scale animations
    scaleIn: 'animate-in zoom-in-95 duration-200',
    scaleOut: 'animate-out zoom-out-95 duration-200',
    scaleInSlow: 'animate-in zoom-in-95 duration-500',
    // Pulse animations
    pulse: 'animate-pulse',
    pulseSlow: 'animate-pulse duration-3000',
    // Spin for loading
    spin: 'animate-spin',
    spinSlow: 'animate-spin duration-3000',
    // Bounce (subtle)
    bounce: 'animate-bounce',
    // Shimmer effect
    shimmer: 'animate-enriched-shimmer',
    // Custom entrance animations
    enter: 'animate-in fade-in slide-in-from-bottom-2 duration-300',
    enterFast: 'animate-in fade-in slide-in-from-bottom-2 duration-150',
    // Hover animations
    hoverLift: 'transition-transform duration-200 hover:-translate-y-1',
    hoverScale: 'transition-transform duration-200 hover:scale-105',
    hoverGlow:
      'transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/20',
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
