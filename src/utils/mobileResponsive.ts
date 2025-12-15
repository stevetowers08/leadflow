/**
 * Mobile Responsive Utilities - 2025 Best Practices
 * Helper functions for responsive design and mobile optimization
 */

// Type definitions for NetworkInformation API (not fully standardized)
interface NetworkInformation {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  msMaxTouchPoints?: number;
}

/**
 * Get responsive value based on screen size
 * Returns mobile value on small screens, desktop value on larger screens
 */
export function getResponsiveValue<T>(
  mobileValue: T,
  desktopValue: T,
  breakpoint: number = 768
): T {
  if (typeof window === 'undefined') return desktopValue;
  return window.innerWidth < breakpoint ? mobileValue : desktopValue;
}

/**
 * Check if device is mobile (touch device with small screen)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const nav = navigator as NavigatorWithConnection;
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (nav.msMaxTouchPoints ?? 0) > 0;

  const isSmallScreen = window.innerWidth < 768;

  return isTouchDevice && isSmallScreen;
}

/**
 * Check if device supports modern CSS features
 */
export function supportsModernCSS(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;

  return (
    CSS.supports('height', '100dvh') &&
    CSS.supports('container-type', 'inline-size') &&
    CSS.supports('aspect-ratio', '1 / 1')
  );
}

/**
 * Get optimal image size for current viewport
 * Returns appropriate size based on device pixel ratio and screen width
 */
export function getOptimalImageSize(
  baseSize: number,
  devicePixelRatio: number = 1
): number {
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : 1920;
  const dpr =
    devicePixelRatio ||
    (typeof window !== 'undefined' ? window.devicePixelRatio : 1);

  // Mobile: 1x-2x, Tablet: 1.5x-2x, Desktop: 1x-2x
  if (viewportWidth < 768) {
    return Math.ceil(baseSize * Math.min(dpr, 2));
  } else if (viewportWidth < 1024) {
    return Math.ceil(baseSize * Math.min(dpr, 2));
  } else {
    return Math.ceil(baseSize * Math.min(dpr, 2));
  }
}

/**
 * Calculate fluid typography size
 * Returns clamp() CSS value for responsive typography
 */
export function fluidTypography(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1200
): string {
  const minSizeRem = minSize / 16;
  const maxSizeRem = maxSize / 16;
  const minViewportRem = minViewport / 16;
  const maxViewportRem = maxViewport / 16;

  return `clamp(${minSizeRem}rem, ${((maxSize - minSize) / (maxViewport - minViewport)) * 100}vw + ${minSizeRem - ((maxSize - minSize) / (maxViewport - minViewport)) * minViewportRem}rem, ${maxSizeRem}rem)`;
}

/**
 * Get safe area insets for notched devices
 */
export function getSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const getEnvValue = (property: string): number => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(property)
      .trim();
    return value ? parseInt(value, 10) : 0;
  };

  return {
    top: getEnvValue('env(safe-area-inset-top)'),
    bottom: getEnvValue('env(safe-area-inset-bottom)'),
    left: getEnvValue('env(safe-area-inset-left)'),
    right: getEnvValue('env(safe-area-inset-right)'),
  };
}

/**
 * Debounce function for mobile performance
 * Prevents excessive function calls on scroll/resize
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for mobile performance
 * Limits function execution rate
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get connection quality for adaptive loading
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const nav = navigator as NavigatorWithConnection;
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) return 'unknown';

  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink || 10; // Mbps

  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
    return 'slow';
  } else if (effectiveType === '3g' || downlink < 1.5) {
    return 'medium';
  } else {
    return 'fast';
  }
}
