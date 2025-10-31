/**
 * Layout Component with Glassmorphism Design
 *
 * Features:
 * - Glassmorphism background with dynamic gradients
 * - Modern sidebar with smooth animations
 * - Responsive design optimized for all devices
 * - Dark mode support with theme switching
 * - Enhanced accessibility and keyboard navigation
 */

import { designTokens } from '@/design-system/tokens';
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
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavigationBar } from './TopNavigationBar';

// Lazy load heavy components for better performance
// const FloatingChatWidget = lazy(() => import('../ai/FloatingChatWidget'));
const MobileTestPanel = lazy(() => import('../mobile/MobileTestPanel'));
const MobileNav = lazy(() => import('../mobile/MobileNav'));

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  onSearch?: (query: string) => void;
}

export const Layout = ({ children, pageTitle, onSearch }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);
  const { mediumHaptic } = useHapticFeedback();
  const location = useLocation();

  // Dynamic page title and subheading based on current route (memoized for performance)
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

    const data = routeData[location.pathname] || { title: 'Dashboard' };
    return {
      currentPageTitle: data.title,
      currentPageSubheading: data.subheading,
    };
  }, [pageTitle, location.pathname]);

  // Enhanced swipe gestures with better touch handling
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

  // Close sidebar when clicking outside on mobile
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

  // Handle escape key and focus management
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

  // Attach swipe gestures to main content
  useEffect(() => {
    if (isMobile && mainContentRef.current) {
      const cleanup = attachListeners(mainContentRef.current);
      return cleanup;
    }
  }, [isMobile, attachListeners]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Route-specific layout tweaks
  const isConversationsRoute = location.pathname === '/conversations';
  const isSettingsRoute = location.pathname === '/settings';

  return (
    <>
      {/* Mobile sidebar overlay with glassmorphism */}
      {isMobile && sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setSidebarOpen(false);
            }
          }}
          aria-hidden='true'
          role='button'
          tabIndex={-1}
        />
      )}

      {/* Desktop Sidebar - Always visible on desktop */}
      {!isMobile &&
        createPortal(
          <aside
            className='desktop-sidebar fixed top-0 left-0 h-screen w-56 bg-sidebar z-50 border-r'
            role='navigation'
            aria-label='Main navigation'
            style={{ borderRight: '1px solid hsl(var(--border))' }}
          >
            <Sidebar />
          </aside>,
          document.body
        )}

      {/* Mobile Sidebar - Only when menu is open */}
      {isMobile &&
        sidebarOpen &&
        createPortal(
          <aside
            style={{
              position: 'fixed',
              top: '0px',
              left: '0px',
              height: '100vh',
              width: '224px',
              zIndex: 9999,
              backgroundColor: 'hsl(var(--sidebar-background))',
              color: 'hsl(var(--sidebar-foreground))',
              transform: 'translateX(0)',
              transition: 'transform 0.3s ease-in-out',
              borderRight: '1px solid hsl(var(--border))',
            }}
            role='navigation'
            aria-label='Main navigation'
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>,
          document.body
        )}

      {/* Top Navigation Bar rendered via portal */}
      {createPortal(
        <TopNavigationBar
          pageTitle={currentPageTitle}
          pageSubheading={currentPageSubheading}
          onSearch={onSearch}
          onMenuClick={() => {
            if (isMobile) {
              mediumHaptic();
              setSidebarOpen(true);
            }
          }}
        />,
        document.body
      )}

      {/* Main content container - Fixed viewport height */}
      <div
        className={cn(
          'h-screen w-full', // Fixed viewport height
          'bg-background text-foreground' // No overflow hidden here - let content handle it
        )}
      >
        {/* Main content with glassmorphism container */}
        <main
          ref={mainContentRef}
          className={cn(
            'relative z-10 transition-all duration-300 w-full h-full bg-background flex flex-col', // Full height with flex layout
            // Desktop: Add left padding for fixed sidebar (14rem = 224px)
            !isMobile && 'pl-56',
            // Add top padding for fixed header (h-12 = 48px) + extra spacing
            // Conversations and Settings only get minimal padding for header (48px)
            isConversationsRoute || isSettingsRoute ? 'pt-12' : 'pt-[72px]',
            // Mobile: Add bottom padding for mobile nav (nav height + safe area ≈ 80px)
            isMobile && 'pb-20'
          )}
          role='main'
        >
          {/* Content Container - Each page handles its own overflow */}
          <div
            className={cn(
              'flex-1 w-full overflow-hidden',
              // Apply standard page padding everywhere except Conversations and Settings
              !isConversationsRoute &&
                !isSettingsRoute &&
                designTokens.spacing.pagePadding.responsive
            )}
          >
            <div
              className={cn(
                'h-full w-full',
                // Prevent outer scroll on Conversations and Settings; let page handle its own overflow
                !isConversationsRoute && !isSettingsRoute && 'overflow-y-auto'
              )}
            >
              {children}
            </div>
          </div>
        </main>

        {/* Floating Chat Widget - Temporarily disabled */}
        {/* <Suspense fallback={null}>
        <FloatingChatWidget />
      </Suspense> */}

        {/* Enhanced Mobile Navigation */}
        {isMobile && (
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        )}

        {/* Mobile Test Panel (Development Only) */}
        <Suspense fallback={null}>
          <MobileTestPanel />
        </Suspense>
      </div>
    </>
  );
};
