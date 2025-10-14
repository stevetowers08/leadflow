/**
 * Enhanced Mobile Sidebar Component
 * Implements mobile sidebar best practices based on 2024 research
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    Bell,
    Bot,
    Briefcase,
    Building2,
    Home,
    Menu,
    MessageSquare,
    Search,
    Settings,
    Star,
    Target,
    User,
    Users,
    X
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isPrimary?: boolean;
  permission?: string;
  category?: 'main' | 'secondary' | 'tools';
}

interface MobileSidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const sidebarItems: SidebarItem[] = [
  // Main Navigation
  { to: "/", label: "Dashboard", icon: <Home className="h-5 w-5" />, isPrimary: true, category: 'main' },
  { to: "/people", label: "People", icon: <Users className="h-5 w-5" />, isPrimary: true, permission: "people", category: 'main' },
  { to: "/companies", label: "Companies", icon: <Building2 className="h-5 w-5" />, isPrimary: true, permission: "companies", category: 'main' },
  { to: "/jobs", label: "Jobs", icon: <Briefcase className="h-5 w-5" />, isPrimary: true, permission: "jobs", category: 'main' },
  { to: "/pipeline", label: "Pipeline", icon: <Target className="h-5 w-5" />, permission: "leads", category: 'main' },
  
  // Secondary Navigation
  { to: "/conversations", label: "Messages", icon: <MessageSquare className="h-5 w-5" />, category: 'secondary' },
  { to: "/automations", label: "Automations", icon: <Bot className="h-5 w-5" />, permission: "workflows", category: 'secondary' },
  { to: "/reporting", label: "Reports", icon: <BarChart3 className="h-5 w-5" />, permission: "reports", category: 'secondary' },
  
  // Tools
  { to: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" />, permission: "settings", category: 'tools' },
];

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  className,
  isOpen = false,
  onToggle
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { lightHaptic, mediumHaptic } = useHapticFeedback();
  const { canView } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  // Filter items based on permissions and search
  const filteredItems = sidebarItems.filter(item => {
    const hasPermission = !item.permission || canView(item.permission);
    const matchesSearch = !searchTerm || item.label.toLowerCase().includes(searchTerm.toLowerCase());
    return hasPermission && matchesSearch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  const handleItemClick = useCallback(() => {
    lightHaptic();
    if (isMobile && onToggle) {
      onToggle();
    }
  }, [lightHaptic, isMobile, onToggle]);

  const handleToggle = useCallback(() => {
    mediumHaptic();
    onToggle?.();
  }, [mediumHaptic, onToggle]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('[data-mobile-sidebar]');
      const toggleButton = document.querySelector('[data-sidebar-toggle]');
      
      if (sidebar && !sidebar.contains(event.target as Node) &&
          toggleButton && !toggleButton.contains(event.target as Node)) {
        onToggle?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onToggle]);

  if (!isMobile) return null;

  return (
    <>
      {/* Sidebar Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "fixed top-4 left-4 z-50 mobile-touch-target-sm",
          "bg-background/95 backdrop-blur-sm border border-border/50",
          "shadow-lg hover:shadow-xl transition-all duration-200",
          "lg:hidden"
        )}
        data-sidebar-toggle
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        data-mobile-sidebar
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-sm",
          "border-r border-border/50 shadow-2xl z-40 lg:hidden",
          "transform transition-transform duration-300 ease-in-out",
          "mobile-smooth-scroll",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="mobile-h2 mobile-text-enhanced">Navigation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="mobile-touch-target-sm"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mobile-form-input w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/50 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                className={cn(
                  "flex-1 mobile-touch-target-sm",
                  showFavorites && "bg-primary/10 text-primary border-primary/20"
                )}
              >
                <Star className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="mobile-touch-target-sm"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto mobile-smooth-scroll p-4">
            {/* Main Navigation */}
            {groupedItems.main && (
              <div className="mb-6">
                <h3 className="mobile-supporting-sm font-semibold uppercase tracking-wide mb-3">
                  Main
                </h3>
                <nav className="space-y-1">
                  {groupedItems.main.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={handleItemClick}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                        "mobile-touch-target mobile-text-enhanced",
                        "hover:bg-accent/50 active:bg-accent active:scale-98",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "border border-transparent hover:border-accent/20",
                        isActive 
                          ? "bg-primary/10 text-primary border-primary/20 shadow-sm" 
                          : "text-foreground"
                      )}
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="mobile-body-sm font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="mobile-badge">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* Secondary Navigation */}
            {groupedItems.secondary && (
              <div className="mb-6">
                <h3 className="mobile-supporting-sm font-semibold uppercase tracking-wide mb-3">
                  Tools
                </h3>
                <nav className="space-y-1">
                  {groupedItems.secondary.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={handleItemClick}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                        "mobile-touch-target mobile-text-enhanced",
                        "hover:bg-accent/50 active:bg-accent active:scale-98",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "border border-transparent hover:border-accent/20",
                        isActive 
                          ? "bg-primary/10 text-primary border-primary/20 shadow-sm" 
                          : "text-foreground"
                      )}
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="mobile-body-sm font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="mobile-badge">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* Tools Navigation */}
            {groupedItems.tools && (
              <div className="mb-6">
                <h3 className="mobile-supporting-sm font-semibold uppercase tracking-wide mb-3">
                  Settings
                </h3>
                <nav className="space-y-1">
                  {groupedItems.tools.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={handleItemClick}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                        "mobile-touch-target mobile-text-enhanced",
                        "hover:bg-accent/50 active:bg-accent active:scale-98",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "border border-transparent hover:border-accent/20",
                        isActive 
                          ? "bg-primary/10 text-primary border-primary/20 shadow-sm" 
                          : "text-foreground"
                      )}
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="mobile-body-sm font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="mobile-badge">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* Empty State */}
            {Object.keys(groupedItems).length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mobile-h3 mb-2">No results found</h3>
                <p className="mobile-supporting">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="mobile-body-sm font-medium truncate">User Account</p>
                <p className="mobile-supporting-sm truncate">CRM Access</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
