import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Users, Briefcase, BarChart3, Target, Settings, LogOut, X, LogIn, Bot, MessageSquare, CreditCard, Mic, Tag, Webhook, Plug, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { FourTwentyLogo } from "./FourTwentyLogo";

const mainNavigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Pipeline", href: "/pipeline", icon: Target },
  { name: "Conversations", href: "/conversations", icon: MessageSquare },
];

const secondaryNavigation = [
  { name: "Automations", href: "/automations", icon: Bot },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Users },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut, signInWithGoogle } = useAuth();
  const { hasRole } = usePermissions();
  
  // Memoize the navigation to prevent re-renders
  const navigationItems = React.useMemo(() => mainNavigation, []);
  const secondaryItems = React.useMemo(() => secondaryNavigation, []);
  const adminItems = React.useMemo(() => adminNavigation, []);

  return (
    <aside className="bg-sidebar border-r border-sidebar-border border-t-0 flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300 w-52">
      <div className="px-4 h-20 border-b border-sidebar-border bg-sidebar flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <FourTwentyLogo size={24} />
            <h1 className="text-lg font-semibold text-sidebar-foreground">Empowr CRM</h1>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden p-2 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {/* Main Navigation */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        
        {/* Secondary Navigation - Automations, Reporting & Settings */}
        <div className="border-t border-sidebar-border my-4"></div>
        <div className="space-y-2">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
        
      </nav>
      
      {/* Admin Section - Only visible to administrators and owners - Bottom */}
      {(hasRole('Administrator') || hasRole('Owner')) && (
        <div className="px-3 py-2 border-t border-sidebar-border">
          <div className="space-y-2">
            <div className="px-3 py-1">
              <h3 className="text-xs font-normal text-sidebar-foreground/60 uppercase tracking-wider">
                Admin
              </h3>
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      {/* User Menu or Sign In */}
      <div className="p-3 border-t border-sidebar-border">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full p-2 h-auto hover:bg-transparent justify-start">
                <div className="flex items-center w-full gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {user.user_metadata?.full_name
                        ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        : user.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-normal truncate text-sidebar-foreground">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={() => signInWithGoogle()} 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent text-sm"
          >
            <LogIn className="mr-2 h-4 w-4 text-sidebar-foreground" />
            <span className="text-sidebar-foreground">Google Sign In</span>
          </Button>
        )}
      </div>
    </aside>
  );
};