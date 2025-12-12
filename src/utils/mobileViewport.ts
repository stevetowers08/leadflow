/**
 * 2025 Mobile Viewport Utilities
 * Modern viewport handling with dynamic viewport height support
 */

/**
 * Initialize dynamic viewport height for mobile browsers
 * Fixes iOS Safari and Android Chrome address bar issues
 */
export function initMobileViewport(): void {
  if (typeof window === 'undefined') return;

  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // 2025: Support for dynamic viewport units (dvh)
    if (CSS.supports('height', '100dvh')) {
      document.documentElement.style.setProperty('--dvh', '1dvh');
    } else {
      // Fallback for browsers without dvh support
      document.documentElement.style.setProperty('--dvh', `${vh}px`);
    }
  };

  // Set initial value
  setViewportHeight();

  // Update on resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);
  
  // 2025: Visual viewport API for better mobile handling
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight);
  }
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
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0', 10),
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0', 10),
  };
}

/**
 * Check if device supports safe area insets (notched devices)
 */
export function supportsSafeArea(): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) {
    return false;
  }
  
  return CSS.supports('padding-top', 'env(safe-area-inset-top)');
}

/**
 * Get device pixel ratio for high-DPI displays
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') {
    return 1;
  }
  
  return window.devicePixelRatio || 1;
}

/**
 * Check if device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device supports touch
 */
export function supportsTouch(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}


