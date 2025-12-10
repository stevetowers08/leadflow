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
import {
  ReactNode,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TopNavigationBar } from './TopNavigationBar';

const MobileNav = lazy(() => import('../mobile/MobileNav'));

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
      '/inbox': {
        title: 'Inbox',
        subheading: 'View and manage all email conversations with your leads',
      },
      '/workflows': {
        title: 'Workflows',
        subheading: 'Create and manage visual automation workflows',
      },
      '/analytics': {
        title: 'Analytics',
        subheading: 'View detailed reports and performance metrics',
      },
      '/settings': {
        title: 'Settings',
        subheading: 'Configure your LeadFlow settings and integrations',
      },
      // Legacy routes (for redirects)
      '/contacts': {
        title: 'Leads',
        subheading: 'Manage your leads and track your outreach',
      },
      '/conversations': {
        title: 'Inbox',
        subheading: 'View and manage all email conversations with your leads',
      },
    };

    const data = routeData[pathname] || { title: 'Dashboard' };
    return {
      currentPageTitle: data.title,
      currentPageSubheading: data.subheading,
    };
  }, [pageTitle, pathname]);


  // Constants for fixed positioning
  const topNavHeight = 49;
  const mobileBottomNavHeight = 80;

  if (!isMounted) {
    return (
      <div className='h-screen bg-background'>
        <main className='h-full w-full'>{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        {/* Top Navigation - Fixed position with glassmorphism */}
        <TopNavigationBar
          pageTitle={currentPageTitle}
          pageSubheading={currentPageSubheading}
          onSearch={onSearch}
          className="sticky top-0 z-40 safe-area-inset-top"
          style={{
            height: `${topNavHeight}px`,
            paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : 0,
          }}
        />

        {/* Main Content */}
        <main
          ref={mainContentRef}
          className='flex flex-col overflow-hidden bg-background'
          style={{
            height: isMobile
              ? `calc(100vh - ${topNavHeight}px - ${mobileBottomNavHeight}px)`
              : `calc(100vh - ${topNavHeight}px)`,
          }}
          role='main'
        >
          {children}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};
