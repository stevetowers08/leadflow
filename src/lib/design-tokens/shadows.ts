/**
 * Shadow Design Tokens
 * Elevation system for depth and hierarchy
 * All shadows MUST use these tokens, never hardcoded values
 */

export const shadowTokens = {
  // Base shadow tokens (from CSS variables)
  base: {
    sm: 'var(--shadow-sm)', // 0 1px 2px 0 rgb(0 0 0 / 0.05) - Very subtle
    md: 'var(--shadow-md)', // 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) - Medium
    lg: 'var(--shadow-lg)', // 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) - Large
    xl: 'var(--shadow-xl)', // 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) - Extra large
    none: 'none',
  },

  // Semantic shadow tokens
  semantic: {
    // Card shadows
    card: {
      static: 'var(--shadow-sm)', // Static cards
      hover: 'var(--shadow-md)', // Hover state
      interactive: 'var(--shadow-sm) hover:var(--shadow-md)', // Clickable cards
    },

    // Button shadows
    button: {
      default: 'var(--shadow-sm)',
      hover: 'var(--shadow-md)',
    },

    // Mobile-optimized shadows
    mobile: {
      default: 'var(--shadow-sm)', // Minimal shadows for mobile
    },

    // Elevation levels (for layering)
    elevation: {
      level0: 'none', // No elevation
      level1: 'var(--shadow-sm)', // Subtle elevation (cards at rest)
      level2: 'var(--shadow-md)', // Medium elevation (hover states, modals)
      level3: 'var(--shadow-lg)', // High elevation (dropdowns, popovers)
      level4: 'var(--shadow-xl)', // Highest elevation (tooltips, floating elements)
    },
  },
} as const;

// Type exports
export type ShadowSize = keyof typeof shadowTokens.base;
export type ElevationLevel = keyof typeof shadowTokens.semantic.elevation;
