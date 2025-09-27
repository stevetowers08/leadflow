import React, { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { FloatingChatWidget } from "./FloatingChatWidget";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/contexts/SidebarContext";
import { EnhancedMobileNav, EnhancedMobileSidebar } from "./EnhancedMobileNav";
import { cn } from "@/lib/utils";
import { FourTwentyLogo } from "./FourTwentyLogo";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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
          ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }` 
          : 'relative',
        'sidebar'
      )}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        !isMobile && "ml-52"
      )}>
        {/* Mobile header */}
        {isMobile && (
          <div className="sticky top-0 z-30 flex items-center justify-between bg-background border-b px-4 py-3 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              data-menu-button
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FourTwentyLogo size={20} />
              <h1 className="text-lg font-semibold text-foreground">Empowr CRM</h1>
            </div>
            <div className="w-11" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "min-h-screen",
          isMobile ? 'p-4 pb-20' : 'p-8' // Add bottom padding for mobile nav
        )}>
          {children}
        </div>
      </main>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />

      {/* Enhanced Mobile Navigation */}
      {isMobile && <EnhancedMobileNav />}
      
      {/* Enhanced Mobile Sidebar */}
      {isMobile && (
        <EnhancedMobileSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};