/**
 * Mobile Navigation Component
 * Implements mobile CRM navigation best practices
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Briefcase,
  Building2,
  Home,
  Megaphone,
  MessageSquare,
  MoreHorizontal,
  Rocket,
  Settings,
  Target,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isPrimary?: boolean;
  permission?: string; // Resource name for permission checking
}

// All possible navigation items
const allNavItems: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: <Home className='h-5 w-5' />,
    isPrimary: true,
  },
  {
    to: '/getting-started',
    label: 'Getting Started',
    icon: <Rocket className='h-5 w-5' />,
    isPrimary: true,
  },
  {
    to: '/people',
    label: 'Contacts',
    icon: <Users className='h-5 w-5' />,
    isPrimary: true,
    permission: 'people',
  },
  {
    to: '/companies',
    label: 'Companies',
    icon: <Building2 className='h-5 w-5' />,
    isPrimary: true,
    permission: 'companies',
  },
  {
    to: '/jobs',
    label: 'Job Intelligence',
    icon: <Briefcase className='h-5 w-5' />,
    isPrimary: true,
    permission: 'jobs',
  },
  {
    to: '/pipeline',
    label: 'Pipeline',
    icon: <Target className='h-5 w-5' />,
    permission: 'leads',
  },
  {
    to: '/conversations',
    label: 'Messages',
    icon: <MessageSquare className='h-5 w-5' />,
  },
  {
    to: '/campaigns',
    label: 'Campaigns',
    icon: <Megaphone className='h-5 w-5' />,
    permission: 'campaigns',
  },
  {
    to: '/reporting',
    label: 'Reports',
    icon: <BarChart3 className='h-5 w-5' />,
    permission: 'reports',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: <Settings className='h-5 w-5' />,
    permission: 'settings',
  },
];

interface MobileNavProps {
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const isMobile = useIsMobile();
  const { lightHaptic, mediumHaptic } = useHapticFeedback();
  const { canView } = usePermissions();

  // Filter navigation items based on user permissions
  const filteredNavItems = allNavItems.filter(
    item => !item.permission || canView(item.permission)
  );

  // Separate into primary and secondary items
  const primaryItems = filteredNavItems.filter(item => item.isPrimary);
  const secondaryItems = filteredNavItems.filter(item => !item.isPrimary);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreMenu) {
        const moreButton = document.querySelector('[data-more-button]');
        const moreMenu = document.querySelector('[data-more-menu]');

        if (
          moreButton &&
          !moreButton.contains(event.target as Node) &&
          moreMenu &&
          !moreMenu.contains(event.target as Node)
        ) {
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
          'fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur',
          'supports-[backdrop-filter]:bg-background/60 lg:hidden',
          'safe-area-pb', // Add safe area padding for devices with home indicators
          className
        )}
        role='navigation'
        aria-label='Main navigation'
      >
        {/* Visual indicator for active state */}
        <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-0 transition-opacity duration-300' />

        <div className='flex items-center justify-around px-2 py-3'>
          {primaryItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2 px-2 sm:gap-1.5 sm:py-3 sm:px-3',
                  'text-xs transition-all duration-200 select-none touch-manipulation',
                  'min-h-[48px] min-w-[48px] sm:min-h-[56px] sm:min-w-[56px] rounded-xl relative',
                  'hover:bg-accent/50 active:bg-accent',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'border border-transparent hover:border-accent/20',
                  'group relative overflow-hidden',
                  isActive
                    ? 'text-sidebar-primary bg-sidebar-primary/10 scale-105 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
              aria-current={location.pathname === item.to ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
              title={item.label}
            >
              <div className='relative'>
                <div className='h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center'>
                  {item.icon}
                </div>
                {item.badge && (
                  <span className='absolute -top-1 -right-1 bg-sidebar-primary text-sidebar-primary-foreground text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center font-medium animate-pulse'>
                    {item.badge}
                  </span>
                )}
                {/* Active state indicator */}
                {location.pathname === item.to && (
                  <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sidebar-primary rounded-full animate-pulse' />
                )}
              </div>
              <span className='mobile-nav-item leading-none font-medium text-center'>
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* More Menu Button */}
          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                mediumHaptic();
                setShowMoreMenu(!showMoreMenu);
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-2 sm:gap-1.5 sm:py-3 sm:px-3',
                'text-xs transition-all duration-200 select-none touch-manipulation',
                'min-h-[48px] min-w-[48px] sm:min-h-[56px] sm:min-w-[56px] rounded-xl',
                'hover:bg-accent/50 active:bg-accent',
                'focus:outline-none focus:ring-2 focus:ring-primary/20',
                'border border-transparent hover:border-accent/20',
                showMoreMenu
                  ? 'text-sidebar-primary bg-sidebar-primary/10 scale-105 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              data-more-button
              aria-label='More options'
              aria-expanded={showMoreMenu}
            >
              <div className='h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center'>
                <MoreHorizontal className='h-4 w-4 sm:h-5 sm:w-5' />
              </div>
              <span className='mobile-nav-item leading-none font-medium text-center'>
                More
              </span>
            </Button>

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div
                className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 bg-background/95 border border-border/50 rounded-2xl shadow-2xl z-40 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200'
                data-more-menu
                role='menu'
                aria-label='Additional navigation options'
              >
                <div className='py-2'>
                  <div className='px-3 py-2 border-b border-border/20'>
                    <h3 className='mobile-supporting-sm font-semibold uppercase tracking-wide'>
                      More Options
                    </h3>
                  </div>
                  <div className='py-2'>
                    {secondaryItems.map(item => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => {
                          lightHaptic();
                          setShowMoreMenu(false);
                        }}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200',
                            'hover:bg-accent active:bg-accent/80',
                            'touch-manipulation min-h-[48px] rounded-xl mx-2',
                            'focus:outline-none focus:ring-2 focus:ring-primary/20',
                            'border border-transparent hover:border-accent/20',
                            isActive
                              ? 'text-sidebar-primary bg-sidebar-primary/10 shadow-sm'
                              : 'text-foreground'
                          )
                        }
                        role='menuitem'
                      >
                        <div className='flex-shrink-0'>{item.icon}</div>
                        <span className='mobile-body-sm font-medium'>
                          {item.label}
                        </span>
                      </NavLink>
                    ))}
                  </div>
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
  className,
}) => {
  return (
    <Card
      variant='default'
      className={cn(
        'p-3 shadow-sm hover:shadow-md transition-shadow',
        'touch-manipulation min-h-[60px]',
        className
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 min-w-0 flex-1'>
          <div className='flex-shrink-0 text-muted-foreground'>{icon}</div>
          <div className='min-w-0 flex-1'>
            <div className='mobile-data-number truncate'>{value}</div>
            <div className='mobile-data-label truncate'>{title}</div>
          </div>
        </div>
        {trend && (
          <div
            className={cn(
              'mobile-supporting-sm font-medium flex-shrink-0',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
};

export default MobileNav;
