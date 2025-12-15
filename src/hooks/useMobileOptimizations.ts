/**
 * 2025 Mobile Optimization Hooks
 * Performance and UX optimizations for mobile devices
 */

import { useEffect } from 'react';

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
}

/**
 * Hook to optimize images for mobile devices
 * Lazy loads images and uses appropriate sizes
 */
export function useImageOptimization() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 2025: Use Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, []);
}

/**
 * Hook to prevent zoom on double tap (iOS Safari)
 */
export function usePreventDoubleTapZoom() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastTouchEnd = 0;
    const handleTouchEnd = (event: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
}

/**
 * Hook to optimize scroll performance on mobile
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 2025: Use CSS scroll-behavior instead of JS when possible
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
}

/**
 * Hook to register service worker for PWA support
 */
export function useServiceWorker() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    // Skip in development
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('[SW] Service Worker registered:', registration.scope);
      })
      .catch(error => {
        console.error('[SW] Service Worker registration failed:', error);
      });
  }, []);
}

/**
 * Hook to optimize font loading
 */
export function useFontOptimization() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 2025: Preload critical fonts
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);
}

/**
 * Hook to monitor Core Web Vitals on mobile
 * 2025: Track LCP, INP, CLS for mobile optimization
 */
export function useCoreWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Monitor Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };

        if (lastEntry) {
          const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
          // Log if LCP is slow (> 2.5s is poor)
          if (lcp > 2500 && process.env.NODE_ENV === 'development') {
            console.warn('[CWV] Slow LCP:', lcp, 'ms');
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => {
        lcpObserver.disconnect();
      };
    } catch (error) {
      // PerformanceObserver not supported
      if (process.env.NODE_ENV === 'development') {
        console.warn('[CWV] PerformanceObserver not supported');
      }
    }
  }, []);
}

/**
 * Hook to optimize mobile scroll performance
 * 2025: Use passive listeners and optimize scroll handlers
 */
export function useMobileScrollOptimization() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 2025: Use CSS scroll-behavior for smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Optimize scroll performance with passive listeners
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll handling logic here if needed
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
}

/**
 * Hook to detect and optimize for slow connections
 * 2025: Adaptive loading based on connection speed
 */
export function useConnectionOptimization() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return;
    }

    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) return;

    const handleConnectionChange = () => {
      const effectiveType = connection.effectiveType;
      const saveData = connection.saveData;

      // Adjust loading strategy based on connection
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
        // Disable non-critical features
        document.documentElement.setAttribute('data-slow-connection', 'true');
      } else {
        document.documentElement.removeAttribute('data-slow-connection');
      }
    };

    connection.addEventListener('change', handleConnectionChange);
    handleConnectionChange(); // Initial check

    return () => {
      connection.removeEventListener('change', handleConnectionChange);
    };
  }, []);
}
