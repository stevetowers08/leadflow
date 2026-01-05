'use client';

/**
 * Enhanced Mobile Sidebar Component
 * Implements mobile sidebar best practices based on 2024 research
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  Star,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

/**
 * Sidebar items following PDR structure:
 * LeadFlow MVP Navigation:
 * - Overview (/) - Dashboard
 * - Leads (/leads) - Lead list
 * - Campaigns (/workflows) - Campaign builder
 * - Analytics (/analytics) - Analytics dashboard
 * - Settings (/settings) - Settings
 */
const sidebarItems: SidebarItem[] = [
  {
    to: '/',
    label: 'Overview',
    icon: <Home className='h-4 w-4' />,
    isPrimary: true,
    category: 'main',
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: <Users className='h-4 w-4' />,
    isPrimary: true,
    category: 'main',
  },
  {
    to: '/workflows',
    label: 'Campaigns',
    icon: <Megaphone className='h-4 w-4' />,
    category: 'secondary',
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 className='h-4 w-4' />,
    category: 'secondary',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: <Settings className='h-4 w-4' />,
    category: 'tools',
  },
];

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  className,
  isOpen = false,
  onToggle,
}) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { lightHaptic, mediumHaptic } = useHapticFeedback();
  const { canView } = usePermissions();
  const { user, userProfile, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Filter items based on permissions and search
  const filteredItems = sidebarItems.filter(item => {
    const hasPermission = !item.permission || canView(item.permission);
    const matchesSearch =
      !searchTerm ||
      item.label.toLowerCase().includes(searchTerm.toLowerCase());
    return hasPermission && matchesSearch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || 'main';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, SidebarItem[]>
  );

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

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
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
        variant='ghost'
        size='sm'
        onClick={handleToggle}
        className={cn(
          'fixed top-4 left-4 z-50 mobile-touch-target-sm',
          'bg-background/95 backdrop-blur-sm border border-border/50',
          'shadow-lg hover:shadow-xl transition-all duration-200',
          'lg:hidden'
        )}
        data-sidebar-toggle
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={handleToggle}
          aria-hidden='true'
        />
      )}

      {/* Sidebar */}
      <aside
        data-mobile-sidebar
        className={cn(
          'fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-sm',
          'border-r border-border/50 shadow-2xl z-40 lg:hidden',
          'transform transition-transform duration-300 ease-in-out',
          'mobile-smooth-scroll',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='flex flex-col h-full'>
          {/* Sidebar Header */}
          <div className='p-4 border-b border-border/50'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='mobile-h2 mobile-text-enhanced'>Navigation</h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleToggle}
                className='mobile-touch-target-sm'
                aria-label='Close sidebar'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            {/* Search */}
            <div className='relative mb-4'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none' />
              <Input
                type='text'
                placeholder='Search navigation...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='mobile-form-input w-full pl-10'
              />
            </div>

            {/* Quick Actions */}
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFavorites(!showFavorites)}
                className={cn(
                  'flex-1 mobile-touch-target-sm',
                  showFavorites &&
                    'bg-primary/10 text-primary border-primary/20'
                )}
              >
                <Star className='h-4 w-4 mr-2' />
                Favorites
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='mobile-touch-target-sm'
              >
                <Bell className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Navigation Content */}
          <div className='flex-1 overflow-y-auto mobile-smooth-scroll p-4'>
            {/* Main Navigation */}
            {groupedItems.main && (
              <div className='mb-6'>
                <h3 className='mobile-supporting-sm font-semibold uppercase tracking-wide mb-3'>
                  Main
                </h3>
                <nav className='space-y-1'>
                  {groupedItems.main.map(item => {
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={handleItemClick}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                          'mobile-touch-target mobile-text-enhanced',
                          'hover:bg-accent/50 active:bg-accent',
                          'focus:outline-none focus:ring-2 focus:ring-primary/20',
                          'border border-transparent hover:border-accent/20',
                          isActive
                            ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                            : 'text-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className='flex-shrink-0'>{item.icon}</div>
                        <span className='mobile-body-sm font-medium flex-1'>
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge variant='secondary' className='mobile-badge'>
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Advanced Features */}
            {groupedItems.secondary && (
              <div className='mb-6'>
                <h3 className='mobile-supporting-sm font-semibold uppercase tracking-wide mb-3'>
                  Advanced Features
                </h3>
                <nav className='space-y-1'>
                  {groupedItems.secondary.map(item => {
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={handleItemClick}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                          'mobile-touch-target mobile-text-enhanced',
                          'hover:bg-accent/50 active:bg-accent',
                          'focus:outline-none focus:ring-2 focus:ring-primary/20',
                          'border border-transparent hover:border-accent/20',
                          isActive
                            ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                            : 'text-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className='flex-shrink-0'>{item.icon}</div>
                        <span className='mobile-body-sm font-medium flex-1'>
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge variant='secondary' className='mobile-badge'>
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Settings */}
            {groupedItems.tools && (
              <div className='mb-6'>
                <h3 className='mobile-supporting-sm font-semibold uppercase tracking-wide mb-3'>
                  Settings
                </h3>
                <nav className='space-y-1'>
                  {groupedItems.tools.map(item => {
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={handleItemClick}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                          'mobile-touch-target mobile-text-enhanced',
                          'hover:bg-accent/50 active:bg-accent',
                          'focus:outline-none focus:ring-2 focus:ring-primary/20',
                          'border border-transparent hover:border-accent/20',
                          isActive
                            ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                            : 'text-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className='flex-shrink-0'>{item.icon}</div>
                        <span className='mobile-body-sm font-medium flex-1'>
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge variant='secondary' className='mobile-badge'>
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Empty State */}
            {Object.keys(groupedItems).length === 0 && (
              <div className='text-center py-8'>
                <Search className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='mobile-h3 mb-2'>No results found</h3>
                <p className='mobile-supporting'>
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div ref={menuRef} className='p-4 border-t border-border/50 relative'>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className='w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all'
            >
              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='h-4 w-4 text-primary' />
              </div>
              <div className='flex-1 min-w-0 text-left'>
                <p className='mobile-body-sm font-medium truncate'>
                  {userProfile?.full_name || user?.email || 'User'}
                </p>
                <p className='mobile-supporting-sm truncate'>
                  {user?.email || 'Account'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className='absolute bottom-full left-4 right-4 mb-2 bg-background rounded-lg shadow-lg border border-border overflow-hidden'>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsUserMenuOpen(false);
                  }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors'
                >
                  <LogOut className='h-4 w-4' />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
