/**
 * Border Design Tokens
 * Border radius, widths, and styles
 * All borders MUST use these tokens, never hardcoded values
 */

export const borderTokens = {
  // Border radius (from CSS variables)
  radius: {
    default: 'var(--radius)', // 0.75rem (12px) - PDR requirement
    sm: 'calc(var(--radius) - 4px)', // 8px
    md: 'calc(var(--radius) - 2px)', // 10px
    lg: 'var(--radius)', // 12px
    full: '9999px', // Full circle
    none: '0',
  },

  // Border widths
  width: {
    none: '0',
    thin: '1px',
    default: '1px',
    medium: '2px',
    thick: '3px',
  },

  // Border styles
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    none: 'none',
  },

  // Semantic border tokens
  semantic: {
    // Default borders
    default: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
    },
    subtle: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
      opacity: '0.6',
    },
    strong: {
      width: '2px',
      style: 'solid',
      color: 'var(--border)',
    },

    // Color-specific borders
    accent: {
      width: '1px',
      style: 'solid',
      color: 'var(--primary)',
      opacity: '0.2',
    },
    success: {
      width: '1px',
      style: 'solid',
      color: 'var(--success)',
      opacity: '0.2',
    },
    warning: {
      width: '1px',
      style: 'solid',
      color: 'var(--warning)',
      opacity: '0.2',
    },
    error: {
      width: '1px',
      style: 'solid',
      color: 'var(--destructive)',
      opacity: '0.2',
    },
    info: {
      width: '1px',
      style: 'solid',
      color: 'var(--info)',
      opacity: '0.2',
    },

    // Card borders
    card: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
    },
    cardHover: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
    },
    cardFocus: {
      width: '1px',
      style: 'solid',
      color: 'var(--primary)',
    },

    // Table borders
    table: {
      width: '0px', // No outer borders - modern clean look
      style: 'solid',
      color: 'var(--table-border-color)',
    },
    tableHeader: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
    },
    tableCell: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
    },
    tableRow: {
      width: '1px',
      style: 'solid',
      color: 'var(--border)',
    },
  },
} as const;

// Type exports
export type BorderRadius = keyof typeof borderTokens.radius;
export type BorderWidth = keyof typeof borderTokens.width;
export type BorderStyle = keyof typeof borderTokens.style;
