import React, { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { FloatingChatWidget } from "./FloatingChatWidget";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMobile } from "./MobileComponents";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  return (
    <div className="flex min-h-screen w-full">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }` 
          : 'relative'
        }
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className={`
        flex-1 overflow-auto
        ${isMobile ? 'ml-0' : 'ml-52'}
      `}>
        {/* Mobile header */}
        {isMobile && (
          <div className="sticky top-0 z-30 flex items-center justify-between bg-background border-b px-4 py-3 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-3 min-h-[44px] min-w-[44px] touch-manipulation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-normal text-white">Empowr CRM</h1>
            <div className="w-11" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Content */}
        <div className={`
          ${isMobile ? 'p-4' : 'p-8'}
          min-h-screen
        `}>
          {children}
        </div>
      </main>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
};