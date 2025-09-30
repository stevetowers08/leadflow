/**
 * Enhanced Mobile Navigation Component
 * Implements mobile CRM navigation best practices
 */

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Building2, 
  Briefcase, 
  Settings, 
  X,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isPrimary?: boolean;
}

// Primary navigation items (most important)
const primaryItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <Home className="h-5 w-5" />, isPrimary: true },
  { to: "/leads", label: "Leads", icon: <Users className="h-5 w-5" />, isPrimary: true },
  { to: "/companies", label: "Companies", icon: <Building2 className="h-5 w-5" />, isPrimary: true },
  { to: "/jobs", label: "Jobs", icon: <Briefcase className="h-5 w-5" />, isPrimary: true },
];

// Secondary navigation items (less frequently used)
const secondaryItems: NavItem[] = [
  { to: "/pipeline", label: "Pipeline", icon: <ChevronRight className="h-5 w-5" /> },
  { to: "/conversations", label: "Messages", icon: <MoreHorizontal className="h-5 w-5" /> },
  { to: "/automations", label: "Automations", icon: <MoreHorizontal className="h-5 w-5" /> },
  { to: "/reporting", label: "Reports", icon: <MoreHorizontal className="h-5 w-5" /> },
  { to: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

interface EnhancedMobileNavProps {
  className?: string;
}

export const EnhancedMobileNav: React.FC<EnhancedMobileNavProps> = ({ className }) => {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const isMobile = useIsMobile();

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreMenu) {
        const moreButton = document.querySelector('[data-more-button]');
        const moreMenu = document.querySelector('[data-more-menu]');
        
        if (moreButton && !moreButton.contains(event.target as Node) &&
            moreMenu && !moreMenu.contains(event.target as Node)) {
          setShowMoreMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  if (!isMobile) return null;

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav 
        className={cn(
          "fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur",
          "supports-[backdrop-filter]:bg-background/60 lg:hidden",
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around px-2 py-1">
          {primaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3",
                "text-xs transition-colors select-none touch-manipulation",
                "min-h-[44px] min-w-[44px] rounded-lg",
                "hover:bg-accent/50 active:bg-accent",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              {item.icon}
              <span className="leading-none font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
          
          {/* More Menu Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3",
                "text-xs transition-colors select-none touch-manipulation",
                "min-h-[44px] min-w-[44px] rounded-lg",
                "hover:bg-accent/50 active:bg-accent",
                showMoreMenu ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
              data-more-button
              aria-label="More options"
              aria-expanded={showMoreMenu}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="leading-none font-medium">More</span>
            </Button>

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-background border rounded-lg shadow-lg z-40"
                data-more-menu
                role="menu"
                aria-label="Additional navigation options"
              >
                <div className="py-2">
                  {secondaryItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowMoreMenu(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                        "hover:bg-accent active:bg-accent/80",
                        isActive ? "text-primary bg-primary/10" : "text-foreground"
                      )}
                      role="menuitem"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Header with Hamburger Menu - Removed as it's handled in Layout.tsx */}
    </>
  );
};

// Enhanced Sidebar for Mobile (Slide-out drawer)
interface EnhancedMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedMobileSidebar: React.FC<EnhancedMobileSidebarProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside 
        className="fixed inset-y-0 left-0 z-50 w-80 bg-background border-r transform transition-transform duration-300 ease-in-out lg:hidden"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px]"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {/* Primary Items */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Main
              </h3>
              {primaryItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors",
                    "touch-manipulation min-h-[44px]",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Secondary Items */}
            <div className="space-y-1 pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                More
              </h3>
              {secondaryItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors",
                    "touch-manipulation min-h-[44px]",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

// Compact Stats Cards for Mobile
interface CompactStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const CompactStatsCard: React.FC<CompactStatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className
}) => {
  return (
    <Card variant="default" className={cn(
      "p-3 shadow-sm hover:shadow-md transition-shadow",
      "touch-manipulation min-h-[60px]",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex-shrink-0 text-muted-foreground">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold text-foreground truncate">
              {value}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {title}
            </div>
          </div>
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium flex-shrink-0",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedMobileNav;
