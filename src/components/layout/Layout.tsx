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

import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { cn } from '@/lib/utils';
import { ReactNode, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavigationBar } from './TopNavigationBar';

// Lazy load heavy components for better performance
const FloatingChatWidget = lazy(() => import('../ai/FloatingChatWidget'));
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

  // Dynamic page title based on current route
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;

    const routeTitles: Record<string, string> = {
      '/': 'Dashboard',
      '/jobs': 'Jobs',
      '/people': 'People',
      '/companies': 'Companies',
      '/pipeline': 'Pipeline',
      '/campaigns': 'Campaigns',
      '/conversations': 'Conversations',
      '/automations': 'Automations',
      '/reporting': 'Reporting',
      '/settings': 'Settings',
      '/crm-info': 'CRM Info',
      '/tab-designs': 'Tab Designs',
    };

    return routeTitles[location.pathname] || 'Dashboard';
  };

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

  return (
    <div
      className={cn(
        'min-h-screen w-full h-full relative',
        'bg-white text-foreground'
      )}
    >
      {/* Mobile sidebar overlay with glassmorphism */}
      {isMobile && sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden'
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

      {/* Modern Sidebar */}
      <aside
        className={cn(
          'sidebar',
          // Mobile: Fixed overlay with glassmorphism
          isMobile && [
            'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]',
            'transform transition-transform duration-300 ease-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl',
          ],
          // Desktop: Fixed sidebar with glassmorphism
          !isMobile && [
            'fixed left-0 top-0 h-screen w-60 z-30',
            'bg-sidebar text-sidebar-foreground border-r border-sidebar-border',
            'shadow-2xl',
          ]
        )}
        role='navigation'
        aria-label='Main navigation'
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content with glassmorphism container */}
      <main
        ref={mainContentRef}
        className={cn(
          'relative z-10 transition-all duration-300 w-full',
          // Desktop: Add left padding for fixed sidebar
          !isMobile && 'pl-60'
        )}
        role='main'
      >
        {/* Top Navigation Bar */}
        <TopNavigationBar
          pageTitle={getPageTitle()}
          onSearch={onSearch}
          onMenuClick={() => {
            if (isMobile) {
              mediumHaptic();
              setSidebarOpen(true);
            }
          }}
        />

        {/* Content Container */}
        <div
          className={cn(
            'min-h-screen w-full',
            // Mobile: Reduced padding for better space utilization
            isMobile && [
              'px-4 py-4 pb-20',
              'safe-area-inset-left safe-area-inset-right',
            ],
            // Desktop: Match top bar padding, more vertical padding
            !isMobile && 'px-6 py-6'
          )}
        >
          {children}
        </div>
      </main>

      {/* Floating Chat Widget */}
      <Suspense fallback={null}>
        <FloatingChatWidget />
      </Suspense>

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
  );
};
