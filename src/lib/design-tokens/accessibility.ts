/**
 * Accessibility Design Tokens
 * ARIA patterns, keyboard navigation, and screen reader utilities
 * All accessibility features MUST follow these patterns
 */

export const accessibilityTokens = {
  // ARIA roles
  roles: {
    button: 'button',
    link: 'link',
    navigation: 'navigation',
    main: 'main',
    region: 'region',
    dialog: 'dialog',
    alert: 'alert',
    alertdialog: 'alertdialog',
    status: 'status',
    progressbar: 'progressbar',
    tablist: 'tablist',
    tab: 'tab',
    tabpanel: 'tabpanel',
  },

  // ARIA states
  states: {
    expanded: {
      true: 'aria-expanded="true"',
      false: 'aria-expanded="false"',
    },
    disabled: {
      true: 'aria-disabled="true"',
      false: 'aria-disabled="false"',
    },
    hidden: {
      true: 'aria-hidden="true"',
      false: 'aria-hidden="false"',
    },
    selected: {
      true: 'aria-selected="true"',
      false: 'aria-selected="false"',
    },
    checked: {
      true: 'aria-checked="true"',
      false: 'aria-checked="false"',
      mixed: 'aria-checked="mixed"',
    },
  },

  // Keyboard navigation
  keyboard: {
    // Standard key codes
    keys: {
      enter: 'Enter',
      space: ' ',
      escape: 'Escape',
      arrowUp: 'ArrowUp',
      arrowDown: 'ArrowDown',
      arrowLeft: 'ArrowLeft',
      arrowRight: 'ArrowRight',
      home: 'Home',
      end: 'End',
      tab: 'Tab',
      shiftTab: 'Shift+Tab',
    },

    // Keyboard event handlers
    handlers: {
      activate: ['Enter', ' '], // Keys that activate buttons/links
      close: ['Escape'], // Keys that close modals/dialogs
      navigate: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], // Navigation keys
    },
  },

  // Focus management
  focus: {
    // Focus ring styles (from globals.css)
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    // Focus trap for modals
    trap: 'data-focus-trap', // Custom attribute for focus trap
  },

  // Screen reader utilities
  screenReader: {
    // Visually hidden but accessible to screen readers
    only: 'sr-only', // Class from globals.css
    // Live regions
    liveRegions: {
      polite: 'aria-live="polite"',
      assertive: 'aria-live="assertive"',
      off: 'aria-live="off"',
    },
    // Announcements
    announcements: {
      status: 'role="status" aria-live="polite"',
      alert: 'role="alert" aria-live="assertive"',
    },
  },

  // Touch targets (WCAG 2.5.5 Level AAA)
  touch: {
    minSize: '44px', // Minimum touch target size
    minSizeClass: 'min-h-[44px] min-w-[44px]', // Tailwind classes
    manipulation: 'touch-manipulation', // Prevent double-tap zoom
  },

  // Color contrast requirements (WCAG AA)
  contrast: {
    // Minimum contrast ratios
    normalText: 4.5, // Normal text (WCAG AA)
    largeText: 3.0, // Large text (18pt+ or 14pt+ bold) (WCAG AA)
    enhanced: 7.0, // Enhanced contrast (WCAG AAA)
  },

  // Semantic HTML patterns
  semantic: {
    // Button patterns
    button: {
      element: '<button>',
      role: 'button',
      keyboard: ['Enter', ' '],
      aria: {
        label: 'aria-label', // For icon-only buttons
        describedby: 'aria-describedby', // For additional context
      },
    },
    // Link patterns
    link: {
      element: '<a>',
      role: 'link',
      keyboard: ['Enter'],
      aria: {
        label: 'aria-label', // For icon-only links
        current: 'aria-current', // For current page
      },
    },
    // Form patterns
    form: {
      label: {
        required: 'aria-required="true"',
        describedby: 'aria-describedby', // For error messages
      },
      input: {
        required: 'aria-required="true"',
        invalid: 'aria-invalid="true"',
        describedby: 'aria-describedby', // For error messages
      },
    },
  },
} as const;

// Type exports
export type AriaRole =
  (typeof accessibilityTokens.roles)[keyof typeof accessibilityTokens.roles];
export type KeyboardKey =
  (typeof accessibilityTokens.keyboard.keys)[keyof typeof accessibilityTokens.keyboard.keys];
