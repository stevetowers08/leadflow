'use client';

/**
 * Layout Component - Simplified 3-Layer Architecture
 *
 * Industry-standard approach (Salesforce, HubSpot, Linear):
 * - Layer 1: Root + Fixed Header + Fixed Sidebar
 * - Layer 2: Main Content (fixed positioning, padding integrated)
 * - Layer 3: Page Component (direct child of main)
 *
 * This eliminates nested divs and simplifies the height chain.
 */

import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';

// Lazy load heavy components for better initial load performance
// Using Next.js dynamic import instead of React.lazy for better Next.js 16/Turbopack compatibility
const AppSidebar = dynamic(
  () =>
    import('@/components/app-sidebar').then(mod => ({
      default: mod.AppSidebar,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const TopNavigationBar = dynamic(
  () =>
    import('./TopNavigationBar').then(mod => ({
      default: mod.TopNavigationBar,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const MobileNav = dynamic(() => import('../mobile/MobileNav'), {
  ssr: false,
  loading: () => null,
});

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  onSearch?: (query: string) => void;
}

export const Layout = ({ children, pageTitle, onSearch }: LayoutProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { currentPageTitle, currentPageSubheading } = useMemo(() => {
    if (pageTitle) {
      return { currentPageTitle: pageTitle, currentPageSubheading: undefined };
    }

    const routeData: Record<string, { title: string; subheading?: string }> = {
      '/': {
        title: 'Overview',
        subheading: 'Pipeline value, speed to lead, and active conversations',
      },
      '/leads': {
        title: 'Leads',
        subheading: 'Manage your leads and track your outreach',
      },
      '/workflows': {
        title: 'Campaigns',
        subheading: 'Create and manage email campaigns and automation',
      },
      '/analytics': {
        title: 'Analytics',
        subheading: 'View detailed reports and performance metrics',
      },
      '/settings': {
        title: 'Settings',
        subheading: 'Configure your LeadFlow settings and integrations',
      },
      '/shows': {
        title: 'Shows',
        subheading: 'Manage your exhibition shows',
      },
      // Legacy routes (for redirects)
      '/contacts': {
        title: 'Leads',
        subheading: 'Manage your leads and track your outreach',
      },
    };

    // Check for route patterns (e.g., /workflows/sequence/[id])
    let data = pathname ? routeData[pathname] : undefined;
    if (!data && pathname) {
      if (pathname.startsWith('/workflows')) {
        data = routeData['/workflows'];
      } else if (pathname.startsWith('/leads')) {
        data = routeData['/leads'];
      } else if (pathname.startsWith('/analytics')) {
        data = routeData['/analytics'];
      } else if (pathname.startsWith('/settings')) {
        data = routeData['/settings'];
      } else if (pathname.startsWith('/shows')) {
        data = routeData['/shows'];
      }
    }

    const finalData = data || { title: 'Dashboard' };
    return {
      currentPageTitle: finalData.title,
      currentPageSubheading: finalData.subheading,
    };
  }, [pageTitle, pathname]);

  const topNavHeight = 48;
  const mobileBottomNavHeight = 80;

  if (!isMounted) {
    return (
      <div className='h-dvh bg-background'>
        <main className='h-full w-full'>{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant='sidebar' />
      <SidebarInset className='min-w-0'>
        {/* Top Navigation - Fixed position with glassmorphism */}
        <TopNavigationBar
          pageTitle={currentPageTitle}
          pageSubheading={currentPageSubheading}
          onSearch={onSearch}
          className='sticky top-0 z-40 safe-area-inset-top'
          style={{
            height: `${topNavHeight}px`,
            paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : 0,
          }}
        />

        {/* Main Content */}
        <main
          ref={mainContentRef}
          className='flex flex-col overflow-hidden bg-background min-w-0'
          style={{
            height: isMobile
              ? `calc(100dvh - ${topNavHeight}px - ${mobileBottomNavHeight}px)`
              : `calc(100dvh - ${topNavHeight}px)`,
          }}
          role='main'
        >
          {children}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && <MobileNav />}
      </SidebarInset>
    </SidebarProvider>
  );
};
