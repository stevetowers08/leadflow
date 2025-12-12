/**
 * Spacing Design Tokens
 * Consistent spacing scale using rem units
 * All spacing MUST use these tokens, never hardcoded values
 */

export const spacingTokens = {
  // Base spacing scale (rem units)
  scale: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
    '4xl': '4rem', // 64px
  },

  // Semantic spacing tokens
  semantic: {
    // Component internal spacing
    component: {
      xs: '0.5rem', // 8px - tight spacing
      sm: '0.75rem', // 12px - compact spacing
      md: '1rem', // 16px - default spacing
      lg: '1.5rem', // 24px - comfortable spacing
      xl: '2rem', // 32px - generous spacing
    },

    // Layout spacing
    layout: {
      section: '1.5rem', // 24px - between major sections
      container: '1.5rem', // 24px - container padding
      page: {
        mobile: '1rem', // 16px - mobile page padding
        desktop: '1.5rem', // 24px - desktop page padding
      },
    },

    // Card spacing
    card: {
      default: '1.5rem', // 24px - default card padding
      compact: '0.75rem', // 12px - compact card padding
      mobile: '1rem', // 16px - mobile card padding
    },

    // Sidebar spacing
    sidebar: {
      section: '1.5rem', // 24px - between major sections
      item: '0.25rem', // 4px - between navigation items
      header: {
        horizontal: '1.5rem', // 24px - header horizontal padding
        height: '4rem', // 64px - header height
      },
      nav: {
        horizontal: '1rem', // 16px - nav horizontal padding
        vertical: '1.5rem', // 24px - nav vertical padding
      },
      footer: {
        horizontal: '1rem', // 16px - footer horizontal padding
        vertical: '1rem', // 16px - footer vertical padding
      },
      label: {
        horizontal: '0.75rem', // 12px - section label padding
        bottom: '0.75rem', // 12px - section label bottom margin
      },
    },

    // Table spacing
    table: {
      cell: {
        horizontal: '1rem', // 16px - cell horizontal padding
        vertical: '0.5rem', // 8px - cell vertical padding
      },
      row: {
        height: '2.5rem', // 40px - unified row height
      },
    },
  },
} as const;

// Type exports
export type SpacingScale = keyof typeof spacingTokens.scale;
export type ComponentSpacing = keyof typeof spacingTokens.semantic.component;
