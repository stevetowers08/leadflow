import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Users, Briefcase, Target, MessageSquare, Megaphone, Bot, BarChart3, Settings, BookOpen, LogIn, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { FourTwentyLogo } from "../FourTwentyLogo";

// HubSpot-inspired navigation structure
const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "People", href: "/people", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Pipeline", href: "/pipeline", icon: Target },
  { name: "Conversations", href: "/conversations", icon: MessageSquare },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Automations", href: "/automations", icon: Bot },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut, signInWithGoogle } = useAuth();
  const { hasRole } = usePermissions();
  const isMobile = useIsMobile();

  return (
    <aside className="flex flex-col fixed left-0 top-0 h-screen z-40 w-56" style={{ backgroundColor: '#2d3e50', borderRight: '1px solid #34495e' }}>
      {/* Header */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #34495e' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FourTwentyLogo size={20} />
            <h1 className="text-lg font-semibold text-white">Empowr CRM</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Sign In Button */}
            {!user && (
              <Button
                onClick={() => signInWithGoogle()}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
            {/* Close Button */}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
                  isMobile ? "min-h-[44px]" : "",
                  isActive
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* User Menu */}
      {user && (
        <div className="px-3 py-4" style={{ borderTop: '1px solid #34495e' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full h-auto justify-start p-3 text-gray-300 hover:text-white"
              >
                <div className="flex items-center w-full gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="text-white text-xs font-semibold" style={{ backgroundColor: '#34495e' }}>
                      {user.user_metadata?.full_name
                        ? user.user_metadata.full_name.split(' ').map(namePart => namePart[0]).join('').toUpperCase().slice(0, 2)
                        : user.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
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
        </div>
      )}
    </aside>
  );
};