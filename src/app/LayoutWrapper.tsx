'use client';

import { Layout } from '@/components/layout/Layout';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/**
 * Conditionally wraps children with Layout component
 * Only applies Layout to dashboard routes (not auth routes)
 */
export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Routes that should NOT have the Layout (sidebar/nav)
  const noLayoutRoutes = ['/auth', '/integrations/callback'];

  const shouldUseLayout = !noLayoutRoutes.some(route =>
    pathname?.startsWith(route)
  );

  if (shouldUseLayout) {
    return <Layout>{children}</Layout>;
  }

  return <>{children}</>;
}
