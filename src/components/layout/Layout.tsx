/**
 * Improved Mobile Layout Component
 * 
 * Fixes mobile layout inconsistencies and improves accessibility
 * Uses CSS media queries instead of manual mobile detection where possible
 */

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useSwipeGestures } from "@/hooks/useSwipeGestures";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { ReactNode, Suspense, lazy, useEffect, useRef, useState } from "react";
import { FourTwentyLogo } from "../FourTwentyLogo";
import { Sidebar } from "./Sidebar";

// Lazy load heavy components - optimized for better performance
const FloatingChatWidget = lazy(() => import("../ai/FloatingChatWidget"));
const MobileTestPanel = lazy(() => import("../mobile/MobileTestPanel"));
const EnhancedMobileNav = lazy(() => import("../mobile/EnhancedMobileNav"));

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);
  const { mediumHaptic } = useHapticFeedback();

  // Improved swipe gestures with better touch handling
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
    velocityThreshold: 0.3
  });

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.sidebar');
        const menuButton = document.querySelector('[data-menu-button]');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
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
        // Return focus to menu button
        const menuButton = document.querySelector('[data-menu-button]') as HTMLElement;
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

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile sidebar overlay with improved accessibility */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSidebarOpen(false);
            }
          }}
          aria-hidden="true"
          role="button"
          tabIndex={-1}
        />
      )}
      
      {/* Sidebar with improved responsive design */}
      <aside 
        className={cn(
          "sidebar",
          // Mobile: Fixed overlay with proper z-index and transitions
          isMobile && [
            "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]",
            "transform transition-transform duration-300 ease-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            // Sidebar theming uses CSS variables
            "bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))] shadow-lg"
          ],
          // Desktop: Fixed sidebar that doesn't scroll
          !isMobile && "fixed left-0 top-0 h-screen w-56 z-30 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))]"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content with improved responsive layout */}
      <main 
        ref={mainContentRef}
        className={cn(
          "flex-1 transition-all duration-300",
          // Desktop: Add left padding for fixed sidebar
          !isMobile && "pl-56",
          // Mobile: Full width
          isMobile && "w-full"
        )}
        role="main"
      >
        {/* Mobile header with improved accessibility */}
        {isMobile && (
          <header className="sticky top-0 z-30 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                mediumHaptic();
                setSidebarOpen(true);
              }}
              data-menu-button
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              aria-controls="sidebar"
              className={cn(
                "min-h-[44px] min-w-[44px] touch-manipulation",
                "active:scale-95 transition-transform",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <FourTwentyLogo size={20} />
              </div>
              <h1 className="text-lg font-semibold text-foreground">Empowr CRM</h1>
            </div>
            
            {/* Spacer for centering - using aria-hidden for screen readers */}
            <div className="w-11" aria-hidden="true" />
          </header>
        )}

        {/* Content with improved responsive padding and centering */}
        <div className={cn(
          "min-h-screen",
          // Mobile: Responsive padding with safe areas
          isMobile && [
            "p-4 pb-20",
            "safe-area-inset-left safe-area-inset-right"
          ],
          // Desktop: Standard padding with proper centering
          !isMobile && "p-6 max-w-7xl mx-auto"
        )}>
          <div className="w-full max-w-none">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Chat Widget */}
      <Suspense fallback={null}>
        <FloatingChatWidget />
      </Suspense>

      {/* Enhanced Mobile Navigation */}
      {isMobile && (
        <Suspense fallback={null}>
          <EnhancedMobileNav />
        </Suspense>
      )}

      {/* Mobile Test Panel (Development Only) */}
      <Suspense fallback={null}>
        <MobileTestPanel />
      </Suspense>
    </div>
  );
};