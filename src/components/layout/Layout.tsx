'use client';

/**
 * Layout Component - Grid + Fixed Positioning Architecture
 *
 * Industry-standard approach (Salesforce, HubSpot, Linear):
 * - Grid for structure
 * - Fixed positioning for sidebar/header/main
 * - Simple height chain (3 levels max)
 * - No h-full in flex contexts
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

// Debug component to avoid hook issues
const DebugHeightIndicator = ({
  mainRef,
}: {
  mainRef: React.RefObject<HTMLElement>;
}) => {
  const [height, setHeight] = useState<string>('...');

  useEffect(() => {
    const updateHeight = () => {
      if (mainRef.current) {
        const computed = window.getComputedStyle(mainRef.current);
        setHeight(computed.height);
      }
    };

    updateHeight();
    const interval = setInterval(updateHeight, 500);
    return () => clearInterval(interval);
  }, [mainRef]);

  return (
    <div className='fixed top-16 right-4 z-[100] bg-blue-500 text-white px-2 py-1 text-xs rounded shadow-lg'>
      Main H: {height}
    </div>
  );
};

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

  // Debug: Log heights on mount - MUST be before any conditional returns
  useEffect(() => {
    if (!isMounted || !mainContentRef.current) return;

    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mainContentRef.current) {
        const main = mainContentRef.current;
        const computed = window.getComputedStyle(main);
        console.log(
          '🔍 DEBUG Layout Main:',
          `top: ${computed.top}, bottom: ${computed.bottom}, height: ${computed.height}, overflow: ${computed.overflow}, position: ${computed.position}`
        );

        const innerDiv = main.querySelector('div');
        if (innerDiv) {
          const innerComputed = window.getComputedStyle(innerDiv);
          console.log(
            '🔍 DEBUG Inner Div:',
            `height: ${innerComputed.height}, minHeight: ${innerComputed.minHeight}, overflow: ${innerComputed.overflow}`
          );
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  const isConversationsRoute = pathname === '/conversations';
  const isSettingsRoute = pathname === '/settings';
  const isTablePage = ['/jobs', '/people', '/companies'].includes(pathname);

  // Constants for fixed positioning
  const topNavHeight = 48;
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
      {/* DEBUG: Height Indicator */}
      <DebugHeightIndicator mainRef={mainContentRef} />

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
        className='fixed top-0 right-0 z-40 bg-sidebar border-b border-border'
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

      {/* Main Content - Fixed position with proper offsets */}
      <main
        ref={mainContentRef}
        className={cn(
          'fixed bg-background',
          isTablePage || isConversationsRoute || isSettingsRoute
            ? 'overflow-hidden'
            : 'overflow-y-auto'
        )}
        style={{
          top: `${topNavHeight}px`,
          left: isMobile ? 0 : `${sidebarWidth}px`,
          right: 0,
          bottom: isMobile ? `${mobileBottomNavHeight}px` : 0,
        }}
      >
        <div
          className={cn(
            'h-full',
            isTablePage || isConversationsRoute || isSettingsRoute
              ? 'flex flex-col overflow-hidden'
              : 'overflow-y-auto'
          )}
          style={{
            padding: isMobile ? '1rem' : '1.5rem',
            paddingLeft: isMobile ? '1rem' : '1.5rem',
            paddingRight: isMobile ? '1rem' : '1.5rem',
            boxSizing: 'border-box',
          }}
          ref={el => {
            if (
              el &&
              (isTablePage || isConversationsRoute || isSettingsRoute)
            ) {
              const computed = window.getComputedStyle(el);
              const child = el.firstElementChild;
              const childComputed = child
                ? window.getComputedStyle(child)
                : null;
              console.log(
                '🔍 DEBUG Padding Container:',
                `height: ${computed.height}, maxHeight: ${computed.maxHeight}, firstChild height: ${childComputed?.height || 'N/A'}, overflow: ${computed.overflow}`
              );
            }
          }}
        >
          {children}
        </div>
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
