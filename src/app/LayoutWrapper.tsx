'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { initMobileViewport } from '@/utils/mobileViewport';
import {
  useImageOptimization,
  usePreventDoubleTapZoom,
  useSmoothScroll,
  useServiceWorker,
} from '@/hooks/useMobileOptimizations';

/**
 * LayoutWrapper - Updated for Route Groups
 * 
 * Route groups handle their own layouts:
 * - (mobile)/layout.tsx - Full viewport mobile layouts
 * - (app)/layout.tsx - Desktop sidebar layouts
 * 
 * This wrapper only handles root-level exclusions and mobile optimizations
 */
export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 2025: Initialize mobile optimizations
  useEffect(() => {
    initMobileViewport();
  }, []);

  // 2025: Apply mobile performance optimizations
  useImageOptimization();
  usePreventDoubleTapZoom();
  useSmoothScroll();
  useServiceWorker();

  // Routes that should NOT have any layout wrapper
  // These are full-page routes like auth flows and OAuth callbacks
  const noLayoutRoutes = ['/auth', '/integrations/callback'];

  const shouldExcludeLayout = noLayoutRoutes.some(route =>
    pathname?.startsWith(route)
  );

  // Route groups handle their own layouts, so just pass through
  // unless it's an excluded route
  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  // Route groups will apply their own layouts
  return <>{children}</>;
}
