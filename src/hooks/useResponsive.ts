import { useState, useEffect } from 'react';

export interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = (breakpoints: BreakpointConfig = defaultBreakpoints) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.md;
  const isTablet = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;
  const isLargeDesktop = windowSize.width >= breakpoints.xl;

  const isBreakpoint = (breakpoint: keyof BreakpointConfig) => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  const isBreakpointDown = (breakpoint: keyof BreakpointConfig) => {
    return windowSize.width < breakpoints[breakpoint];
  };

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isBreakpoint,
    isBreakpointDown,
  };
};

// Hook for responsive values
export const useResponsiveValue = <T>(
  values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    default: T;
  }
): T => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && values.mobile !== undefined) {
    return values.mobile;
  }
  
  if (isTablet && values.tablet !== undefined) {
    return values.tablet;
  }
  
  if (isDesktop && values.desktop !== undefined) {
    return values.desktop;
  }

  return values.default;
};

// Hook for responsive grid columns
export const useResponsiveColumns = (config: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  default: number;
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && config.mobile !== undefined) {
    return config.mobile;
  }
  
  if (isTablet && config.tablet !== undefined) {
    return config.tablet;
  }
  
  if (isDesktop && config.desktop !== undefined) {
    return config.desktop;
  }

  return config.default;
};

