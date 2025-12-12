/**
 * Typography Design Tokens
 * Font system with weights, sizes, and line heights
 * All typography MUST use these tokens, never hardcoded values
 */

export const typographyTokens = {
  // Font weights (from CSS variables)
  weights: {
    body: 'var(--font-weight-body)', // 500 - Medium
    small: 'var(--font-weight-small)', // 500 - Medium
    heading: 'var(--font-weight-heading)', // 600 - Semibold
    button: 'var(--font-weight-button)', // 500 - Medium
    label: 'var(--font-weight-label)', // 500 - Medium
    data: 'var(--font-weight-data)', // 500 - Medium
    status: 'var(--font-weight-status)', // 500 - Medium
  },

  // Font sizes (rem units)
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '0.875rem', // 14px (base)
    lg: '1rem', // 16px
    xl: '1.125rem', // 18px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },

  // Line heights
  lineHeights: {
    xs: '1rem', // 16px
    sm: '1.25rem', // 20px
    base: '1.25rem', // 20px
    lg: '1.5rem', // 24px
    xl: '1.75rem', // 28px
    '2xl': '2rem', // 32px
    '3xl': '2.25rem', // 36px
  },

  // Semantic typography tokens
  semantic: {
    // Headings
    heading: {
      h1: {
        size: '1.5rem', // 24px
        lineHeight: '2rem', // 32px
        weight: 'var(--font-weight-heading)', // 600
        tracking: 'tight',
      },
      h2: {
        size: '1.125rem', // 18px
        lineHeight: '1.75rem', // 28px
        weight: 'var(--font-weight-heading)', // 600
        tracking: 'tight',
      },
      h3: {
        size: '1rem', // 16px
        lineHeight: '1.5rem', // 24px
        weight: 'var(--font-weight-heading)', // 600
        tracking: 'tight',
      },
      h4: {
        size: '0.875rem', // 14px
        lineHeight: '1.25rem', // 20px
        weight: 'var(--font-weight-heading)', // 600
        tracking: 'tight',
      },
    },

    // Body text
    body: {
      default: {
        size: '0.875rem', // 14px
        lineHeight: '1.25rem', // 20px
        weight: 'var(--font-weight-body)', // 500
      },
      muted: {
        size: '0.875rem', // 14px
        lineHeight: '1.25rem', // 20px
        weight: 'var(--font-weight-body)', // 500
      },
      small: {
        size: '0.75rem', // 12px
        lineHeight: '1rem', // 16px
        weight: 'var(--font-weight-small)', // 500
      },
      large: {
        size: '1rem', // 16px
        lineHeight: '1.5rem', // 24px
        weight: 'var(--font-weight-body)', // 500
      },
    },

    // Mobile typography (smaller sizes)
    mobile: {
      h1: {
        size: '1rem', // 16px
        lineHeight: '1.5rem', // 24px
        weight: 'var(--font-weight-heading)', // 600
        tracking: 'tight',
      },
      h2: {
        size: '0.875rem', // 14px
        lineHeight: '1.25rem', // 20px
        weight: 'var(--font-weight-heading)', // 600
        tracking: 'tight',
      },
      body: {
        size: '0.875rem', // 14px
        lineHeight: '1.25rem', // 20px
        weight: 'var(--font-weight-body)', // 500
      },
      muted: {
        size: '0.75rem', // 12px
        lineHeight: '1rem', // 16px
        weight: 'var(--font-weight-small)', // 500
      },
    },
  },
} as const;

// Type exports
export type FontWeight = keyof typeof typographyTokens.weights;
export type FontSize = keyof typeof typographyTokens.sizes;
export type HeadingLevel = keyof typeof typographyTokens.semantic.heading;
