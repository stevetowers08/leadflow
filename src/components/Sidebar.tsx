import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Users, Briefcase, BarChart3, Target, Settings, LogOut, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/GlobalSearch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";

const mainNavigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "People", href: "/leads", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Opportunities", href: "/opportunities", icon: Target },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
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
  const adminItems = React.useMemo(() => adminNavigation, []);

  return (
    <aside className="w-52 bg-sidebar backdrop-blur border-r border-sidebar-border flex flex-col fixed left-0 top-0 h-screen z-40">
      <div className="px-4 py-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-sidebar-foreground">4Twenty CRM</h1>
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
        {/* Global Search */}
        <GlobalSearch 
          placeholder="Search..."
          className="w-full"
        />
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
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        
        {/* Admin Section - Only visible to administrators and owners */}
        {(hasRole('Administrator') || hasRole('Owner')) && (
          <>
            <div className="border-t border-sidebar-border my-4"></div>
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
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </>
        )}
        
        {/* Settings Section */}
        <div className="border-t border-sidebar-border my-4"></div>
        <div className="space-y-2">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer",
              location.pathname === "/settings"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </nav>
      
      {/* User Menu or Sign In */}
      <div className="p-3 border-t border-sidebar-border">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto hover:bg-transparent">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {user.user_metadata?.full_name
                        ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        : user.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-normal truncate text-white">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-white/70 truncate">
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
            className="w-full justify-start text-white hover:text-white hover:bg-transparent"
          >
            <LogIn className="mr-2 h-4 w-4 text-white" />
            <span className="text-white">Sign in with Google</span>
          </Button>
        )}
      </div>
    </aside>
  );
};