import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { BarChart3, Bot, Briefcase, Building2, Home, LogIn, LogOut, Megaphone, MessageSquare, Settings, Target, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
    <aside className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FourTwentyLogo size={20} />
            <h1 className="text-lg font-semibold">Empowr CRM</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Sign In Button */}
            {!user && (
              <Button
                onClick={() => signInWithGoogle()}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]/20"
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
                className="lg:hidden h-8 w-8 p-0 text-muted-foreground hover:text-card-foreground hover:bg-muted"
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
                  "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2",
                  isMobile ? "min-h-[44px]" : "",
                  isActive
                    ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                    : "text-[hsl(var(--sidebar-foreground))]/75 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]/25"
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
        <div className="px-3 py-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full h-auto justify-start p-3 text-muted-foreground hover:text-card-foreground"
              >
                <div className="flex items-center w-full gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="text-primary-foreground text-xs font-semibold bg-primary">
                      {user.user_metadata?.full_name
                        ? user.user_metadata.full_name.split(' ').map(namePart => namePart[0]).join('').toUpperCase().slice(0, 2)
                        : user.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
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