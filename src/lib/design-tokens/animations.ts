/**
 * Animation Design Tokens
 * Motion and transition timing system
 * All animations MUST use these tokens, never hardcoded values
 */

export const animationTokens = {
  // Transition durations (ms)
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    default: 'ease-out', // Default easing for most transitions
  },

  // Semantic transition tokens
  transitions: {
    // Color transitions
    colors: {
      fast: 'transition-colors duration-150 ease-out',
      normal: 'transition-colors duration-200 ease-out',
      slow: 'transition-colors duration-300 ease-out',
    },

    // Transform transitions
    transform: {
      default: 'transition-transform duration-200 ease-out',
      fast: 'transition-transform duration-150 ease-out',
      slow: 'transition-transform duration-300 ease-out',
    },

    // All properties transitions
    all: {
      fast: 'transition-all duration-150 ease-out',
      normal: 'transition-all duration-200 ease-out',
      slow: 'transition-all duration-300 ease-out',
      smooth: 'transition-all duration-300 ease-in-out',
    },

    // Hover effects
    hoverInteractive:
      'cursor-pointer transition-all duration-200 ease-out hover:shadow-md',
    cardInteractive:
      'cursor-pointer transition-all duration-200 ease-out hover:shadow-md',
    cardStatic: 'transition-shadow duration-200 ease-out hover:shadow-md',

    // Focus ring
    focusRing:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',

    // Microinteractions
    microinteraction: 'transition-all duration-200 ease-out',
  },

  // Animation keyframes (from Tailwind config)
  keyframes: {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    fadeIn: 'animate-in fade-in duration-200',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-200',
    slideDown: 'animate-in slide-in-from-top-4 duration-200',
    slideLeft: 'animate-in slide-in-from-right-4 duration-200',
    slideRight: 'animate-in slide-in-from-left-4 duration-200',
    scaleIn: 'animate-in zoom-in-95 duration-200',
    shimmer: 'animate-enriched-shimmer',
    shimmerBg: 'animate-enriched-shimmer-bg',
    indicatorPulse: 'animate-indicator-pulse',
  },

  // Respect user motion preferences
  respectMotion: {
    // Use this class to respect prefers-reduced-motion
    // Applied globally in globals.css
    reduced: '@media (prefers-reduced-motion: reduce)',
  },
} as const;

// Type exports
export type AnimationDuration = keyof typeof animationTokens.duration;
export type EasingFunction = keyof typeof animationTokens.easing;
export type TransitionType = keyof typeof animationTokens.transitions;
