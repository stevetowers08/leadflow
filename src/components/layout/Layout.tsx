import React, { ReactNode, useState, useEffect, Suspense, lazy, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSwipeGestures } from "@/hooks/useSwipeGestures";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { cn } from "@/lib/utils";
import { FourTwentyLogo } from "../FourTwentyLogo";

// Lazy load heavy components
const FloatingChatWidget = lazy(() => import("../ai/FloatingChatWidget").then(module => ({ default: module.FloatingChatWidget })));
const MobileTestPanel = lazy(() => import("../mobile/MobileTestPanel").then(module => ({ default: module.MobileTestPanel })));
const EnhancedMobileNav = lazy(() => import("../mobile/EnhancedMobileNav").then(module => ({ default: module.EnhancedMobileNav })));

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);
  const { mediumHaptic } = useHapticFeedback();

  // Swipe gestures for mobile sidebar
  const { attachListeners } = useSwipeGestures({
    onSwipeRight: () => {
      if (isMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (isMobile && sidebarOpen) {
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
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

  return (
    <div className="flex min-h-screen w-full">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }` 
          : 'relative',
        'sidebar'
      )}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main 
        ref={mainContentRef}
        className={cn(
          "flex-1 overflow-auto transition-all duration-200",
          !isMobile && "ml-56"
        )}
      >
        {/* Mobile header */}
        {isMobile && (
          <div className="sticky top-0 z-30 flex items-center justify-between bg-background/95 backdrop-blur border-b px-6 py-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                mediumHaptic();
                setSidebarOpen(true);
              }}
              data-menu-button
              aria-label="Open navigation menu"
              className="min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <FourTwentyLogo size={20} />
              </div>
              <h1 className="text-lg font-semibold text-foreground">Empowr CRM</h1>
            </div>
            <div className="w-11" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "min-h-screen bg-gray-50",
          isMobile ? 'p-6 pb-20' : 'p-10' // Increased padding more
        )}>
          {children}
        </div>
      </main>

      {/* Floating Chat Widget */}
      <Suspense fallback={null}>
        <FloatingChatWidget />
      </Suspense>

      {/* Unified Popup moved to App.tsx */}

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