/**
 * Browser Compatibility Configuration
 * Ensures the application works across different browsers and devices
 */

// Browser support configuration
export const browserSupport = {
  // Modern browsers (ES2020+)
  modern: {
    chrome: '>=88',
    firefox: '>=85',
    safari: '>=14',
    edge: '>=88',
  },

  // Legacy browsers (ES2015+)
  legacy: {
    chrome: '>=60',
    firefox: '>=60',
    safari: '>=12',
    edge: '>=79',
    ie: '>=11',
  },
};

// Feature detection utilities
export const featureDetection = {
  // Check if CSS Grid is supported
  cssGrid: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.display = 'grid';
    return test.style.display === 'grid';
  },

  // Check if Flexbox is supported
  flexbox: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.display = 'flex';
    return test.style.display === 'flex';
  },

  // Check if CSS Custom Properties are supported
  customProperties: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.setProperty('--test', 'value');
    return test.style.getPropertyValue('--test') === 'value';
  },

  // Check if Intersection Observer is supported
  intersectionObserver: (): boolean => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  },

  // Check if ResizeObserver is supported
  resizeObserver: (): boolean => {
    return typeof window !== 'undefined' && 'ResizeObserver' in window;
  },

  // Check if Web Animations API is supported
  webAnimations: (): boolean => {
    return typeof window !== 'undefined' && 'animate' in Element.prototype;
  },

  // Check if CSS Containment is supported
  cssContainment: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.contain = 'layout';
    return test.style.contain === 'layout';
  },

  // Check if CSS Logical Properties are supported
  logicalProperties: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.marginInlineStart = '1px';
    return test.style.marginInlineStart === '1px';
  },
};

// Browser-specific fixes and polyfills
export const browserFixes = {
  // Fix for iOS Safari viewport height issue
  fixIOSViewport: () => {
    if (typeof window === 'undefined') return;

    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  },

  // Fix for Android Chrome address bar
  fixAndroidViewport: () => {
    if (typeof window === 'undefined') return;

    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
  },

  // Fix for Firefox scrollbar width
  fixFirefoxScrollbar: () => {
    if (typeof window === 'undefined') return;

    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    if (isFirefox) {
      document.documentElement.style.setProperty('--scrollbar-width', '17px');
    }
  },

  // Fix for Safari flexbox bugs
  fixSafariFlexbox: () => {
    if (typeof window === 'undefined') return;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // Add Safari-specific CSS fixes
      const style = document.createElement('style');
      style.textContent = `
        .safari-flex-fix {
          -webkit-flex-shrink: 0;
          flex-shrink: 0;
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Fix for IE11 specific issues
  fixIE11: () => {
    if (typeof window === 'undefined') return;

    const isIE11 = /Trident\/7\./.test(navigator.userAgent);
    if (isIE11) {
      // Add IE11-specific fixes
      const style = document.createElement('style');
      style.textContent = `
        .ie11-fix {
          display: -ms-flexbox;
          display: flex;
        }
      `;
      document.head.appendChild(style);
    }
  },
};

// Responsive breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Device detection
export const deviceDetection = {
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  },

  isTablet: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  isDesktop: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024;
  },

  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  isHighDPI: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.devicePixelRatio > 1;
  },

  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    if (deviceDetection.isMobile()) return 'mobile';
    if (deviceDetection.isTablet()) return 'tablet';
    return 'desktop';
  },
};

// Performance monitoring
export const performanceMonitoring = {
  // Monitor Core Web Vitals
  monitorCoreWebVitals: () => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Monitor memory usage
  monitorMemory: () => {
    if (typeof window === 'undefined') return;

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
      });
    }
  },
};

// Initialize browser compatibility fixes
export const initializeBrowserCompatibility = () => {
  if (typeof window === 'undefined') return;

  // Apply browser-specific fixes
  browserFixes.fixIOSViewport();
  browserFixes.fixAndroidViewport();
  browserFixes.fixFirefoxScrollbar();
  browserFixes.fixSafariFlexbox();
  browserFixes.fixIE11();

  // Monitor performance
  performanceMonitoring.monitorCoreWebVitals();
  performanceMonitoring.monitorMemory();

  // Log browser information
  console.log('Browser Info:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    deviceType: deviceDetection.getDeviceType(),
    isTouchDevice: deviceDetection.isTouchDevice(),
    isHighDPI: deviceDetection.isHighDPI(),
    features: {
      cssGrid: featureDetection.cssGrid(),
      flexbox: featureDetection.flexbox(),
      customProperties: featureDetection.customProperties(),
      intersectionObserver: featureDetection.intersectionObserver(),
      resizeObserver: featureDetection.resizeObserver(),
      webAnimations: featureDetection.webAnimations(),
      cssContainment: featureDetection.cssContainment(),
      logicalProperties: featureDetection.logicalProperties(),
    },
  });
};

// CSS fallbacks for unsupported features
export const cssFallbacks = `
/* CSS Grid fallback */
@supports not (display: grid) {
  .grid-fallback {
    display: flex;
    flex-wrap: wrap;
  }
  
  .grid-fallback > * {
    flex: 1 1 300px;
    margin: 0.5rem;
  }
}

/* CSS Custom Properties fallback */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --background-color: #ffffff;
  --text-color: #1e293b;
}

/* Flexbox fallback */
@supports not (display: flex) {
  .flex-fallback {
    display: table;
    width: 100%;
  }
  
  .flex-fallback > * {
    display: table-cell;
    vertical-align: middle;
  }
}

/* Modern CSS features with fallbacks */
.modern-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

@supports not (display: grid) {
  .modern-layout {
    display: flex;
    flex-wrap: wrap;
  }
  
  .modern-layout > * {
    flex: 1 1 300px;
    margin: 0.5rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .touch-friendly {
    min-height: 44px;
    min-width: 44px;
  }
  
  .touch-friendly:hover {
    background-color: transparent;
  }
  
  .touch-friendly:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .high-contrast {
    border: 2px solid currentColor;
    background-color: ButtonFace;
    color: ButtonText;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .reduced-motion {
    animation: none !important;
    transition: none !important;
  }
  
  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #60a5fa;
    --secondary-color: #94a3b8;
    --background-color: #0f172a;
    --text-color: #f1f5f9;
  }
}
`;

export default {
  browserSupport,
  featureDetection,
  browserFixes,
  breakpoints,
  deviceDetection,
  performanceMonitoring,
  initializeBrowserCompatibility,
  cssFallbacks,
};
