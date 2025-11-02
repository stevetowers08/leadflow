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
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { cn } from '@/lib/utils';
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
import { Sidebar } from './Sidebar';
import { TopNavigationBar } from './TopNavigationBar';

const MobileTestPanel = lazy(() => import('../mobile/MobileTestPanel'));
const MobileNav = lazy(() => import('../mobile/MobileNav'));

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  onSearch?: (query: string) => void;
}

export const Layout = ({ children, pageTitle, onSearch }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);
  const { mediumHaptic } = useHapticFeedback();
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
        title: 'Dashboard',
        subheading: 'View your recruitment pipeline overview and key metrics',
      },
      '/getting-started': {
        title: 'Getting Started',
        subheading:
          'Learn how to use Empowr CRM and get started with recruitment',
      },
      '/jobs': {
        title: 'Jobs Feed',
        subheading:
          'Qualify jobs to get more company info and decision makers using AI',
      },
      '/people': {
        title: 'Contacts',
        subheading:
          'Manage your people and track your outreach to decision makers',
      },
      '/companies': {
        title: 'Companies',
        subheading: 'Manage your qualified companies and find decision makers',
      },
      '/pipeline': {
        title: 'Deals',
        subheading: 'Manage your sales pipeline and track deals through stages',
      },
      '/conversations': {
        title: 'Conversations',
        subheading:
          'View and manage all email conversations with your contacts',
      },
      '/crm/communications': {
        title: 'Communications',
        subheading: 'Manage email campaigns and communication history',
      },
      '/campaigns': {
        title: 'Campaigns',
        subheading: 'Create and manage email campaigns for outreach',
      },
      '/reporting': {
        title: 'Reporting',
        subheading: 'View analytics and reports on your recruitment activities',
      },
      '/settings': {
        title: 'Settings',
        subheading: 'Configure your account settings and preferences',
      },
      '/tab-designs': {
        title: 'Tab Designs',
        subheading: 'Customize the design and layout of your tabs',
      },
    };

    const data = routeData[pathname] || { title: 'Dashboard' };
    return {
      currentPageTitle: data.title,
      currentPageSubheading: data.subheading,
    };
  }, [pageTitle, pathname]);

  const { attachListeners } = useSwipeGestures({
    onSwipeRight: () => {
      if (isMobile && !sidebarOpen) {
        mediumHaptic();
        setSidebarOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (isMobile && sidebarOpen) {
        mediumHaptic();
        setSidebarOpen(false);
      }
    },
    threshold: 50,
    velocityThreshold: 0.3,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.sidebar');
        const menuButton = document.querySelector('[data-menu-button]');

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          menuButton &&
          !menuButton.contains(event.target as Node)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
        const menuButton = document.querySelector(
          '[data-menu-button]'
        ) as HTMLElement;
        menuButton?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  useEffect(() => {
    if (isMobile && mainContentRef.current) {
      const cleanup = attachListeners(mainContentRef.current);
      return cleanup;
    }
  }, [isMobile, attachListeners]);

  // Route detection - MUST be before useEffect hooks that use these variables
  const isConversationsRoute = pathname === '/conversations';
  const isSettingsRoute = pathname === '/settings';
  // Constants for fixed positioning
  const topNavHeight = 49;
  const sidebarWidth = 224;
  const mobileBottomNavHeight = 80;

  if (!isMounted) {
    return (
      <div className='h-screen bg-background'>
        <main className='h-full w-full'>{children}</main>
      </div>
    );
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Fixed position */}
      {!isMobile && (
        <aside
          className='fixed top-0 left-0 bottom-0 z-30 bg-sidebar border-r border-border overflow-y-auto'
          style={{ width: `${sidebarWidth}px` }}
        >
          <Sidebar onClose={() => {}} />
        </aside>
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <aside className='fixed top-0 left-0 bottom-0 z-50 w-56 bg-sidebar border-r border-border overflow-y-auto'>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>
      )}

      {/* Top Navigation - Fixed position */}
      <header
        className='fixed top-0 right-0 z-40 bg-sidebar'
        style={{
          height: `${topNavHeight}px`,
          left: isMobile ? 0 : `${sidebarWidth}px`,
        }}
      >
        <TopNavigationBar
          pageTitle={currentPageTitle}
          pageSubheading={currentPageSubheading}
          onSearch={onSearch}
          onMenuClick={() => isMobile && setSidebarOpen(true)}
        />
      </header>

      {/* Main Content - Fixed positioning with explicit height */}
      <main
        ref={mainContentRef}
        className='fixed bg-background z-10 flex flex-col overflow-hidden'
        style={{
          top: `${topNavHeight}px`,
          left: isMobile ? 0 : `${sidebarWidth}px`,
          right: 0,
          bottom: isMobile ? `${mobileBottomNavHeight}px` : 0,
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

      {/* Mobile Test Panel (Development Only) */}
      <Suspense fallback={null}>
        <MobileTestPanel />
      </Suspense>
    </>
  );
};
