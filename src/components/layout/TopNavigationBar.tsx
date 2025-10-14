/**
 * Ultra-Modern Top Navigation Bar - 2025 Minimal Design
 * 
 * Features:
 * - Glassmorphism background with subtle border
 * - Minimal, clean design following 2025 best practices
 * - Proper visual separation from page content
 * - Responsive design with modern styling
 */

import { GlobalSearchDropdown } from "@/components/search/GlobalSearchDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Bell, LogIn, LogOut, Menu, Search } from "lucide-react";

interface TopNavigationBarProps {
  pageTitle: string;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
  className?: string;
}

export const TopNavigationBar = ({ 
  pageTitle, 
  onSearch, 
  onMenuClick,
  className 
}: TopNavigationBarProps) => {
  const isMobile = useIsMobile();
  const { user, signOut, signInWithGoogle } = useAuth();

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full",
      "bg-white border-b border-gray-200",
      "shadow-sm shadow-gray-200/10",
      isMobile ? "px-4 py-3" : "px-6 py-3",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg mr-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Page Title */}
        <div className="flex items-center">
          <h1 className={cn(
            "font-semibold text-gray-900 tracking-tight",
            isMobile ? "text-base" : "text-lg"
          )}>
            {pageTitle}
          </h1>
        </div>

        {/* Search Bar - Hidden on mobile if too cramped */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-8">
            <GlobalSearchDropdown />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile Search Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Profile / Sign In */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.user_metadata?.full_name || "User"} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {user.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white text-gray-900 border border-gray-200 shadow-lg shadow-gray-300/10 rounded-xl p-1">
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-lg cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => signInWithGoogle()}
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
