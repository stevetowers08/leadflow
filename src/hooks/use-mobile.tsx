import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize with false to ensure consistent hook count during SSR/hydration
  // This prevents React error #310 (hooks count mismatch)
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Guard against SSR and ensure window is available
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Set initial value immediately
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      const onChange = () => {
        if (typeof window !== 'undefined') {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        }
      };
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    } catch (error) {
      // Fallback to false if matchMedia fails (shouldn't happen, but be defensive)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in useIsMobile:', error);
      }
      setIsMobile(false);
    }
  }, []);

  return isMobile;
}
