'use client';

/**
 * Mobile Navigation Component
 * Implements mobile CRM navigation best practices
 */

import { Card } from '@/components/ui/card';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import {
  Home,
  GitMerge,
  Settings,
  Users,
  MoreHorizontal,
  Camera,
  Calendar,
  Building2,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isPrimary?: boolean;
  permission?: string; // Resource name for permission checking
}

// All possible navigation items
// Updated for LeadFlow PDR - PDR Section 5.1
const allNavItems: NavItem[] = [
  {
    to: '/capture',
    label: 'Capture',
    icon: <Camera className='h-5 w-5' />,
    isPrimary: true,
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: <Users className='h-5 w-5' />,
    isPrimary: true,
  },
  {
    to: '/companies',
    label: 'Companies',
    icon: <Building2 className='h-5 w-5' />,
    isPrimary: true,
  },
  {
    to: '/shows',
    label: 'Shows',
    icon: <Calendar className='h-5 w-5' />,
  },
  {
    to: '/workflows',
    label: 'Campaigns',
    icon: <GitMerge className='h-5 w-5' />,
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 className='h-5 w-5' />,
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
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ bottom: 0, left: 0 });
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const { lightHaptic, mediumHaptic } = useHapticFeedback();
  const { canView } = usePermissions();

  // Filter navigation items based on user permissions (memoize for performance)
  const { primaryItems, secondaryItems } = useMemo(() => {
    const filteredNavItems = allNavItems.filter(
      item => !item.permission || canView(item.permission)
    );

    const primary = filteredNavItems.filter(item => item.isPrimary);
    const secondary = filteredNavItems.filter(item => !item.isPrimary);

    return { primaryItems: primary, secondaryItems: secondary };
  }, [canView]);

  // Calculate menu position when opening
  useEffect(() => {
    if (showMoreMenu && moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [showMoreMenu]);

  // Close more menu when clicking outside
  useEffect(() => {
    if (!showMoreMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop overlay for More menu */}
      {showMoreMenu && (
        <div
          className='fixed inset-0 bg-black/20 z-[90] lg:hidden'
          onClick={() => setShowMoreMenu(false)}
          aria-hidden='true'
        />
      )}

      {/* Bottom Navigation Bar - 2025 Enhanced */}
      <nav
        className={cn(
          'fixed bottom-0 inset-x-0 z-[95] bg-background',
          'border-t border-border lg:hidden',
          'shadow-[0_-4px_20px_rgba(0,0,0,0.08)]',
          'safe-area-pb', // Safe area padding for devices with home indicators
          'backdrop-blur-lg bg-background/95', // 2025: Modern backdrop blur
          className
        )}
        role='navigation'
        aria-label='Main navigation'
        aria-orientation='horizontal'
      >
        <div className='flex items-center justify-around px-3 py-2.5 max-w-screen-sm mx-auto gap-1'>
          {primaryItems.map(item => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1',
                  'py-2 px-1 min-h-[56px]',
                  'transition-all duration-200 select-none touch-manipulation',
                  'rounded-xl relative group',
                  'active:scale-[0.95] active:bg-accent/30',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground active:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
              >
                <div className='relative'>
                  <div
                    className={cn(
                      'h-5 w-5 flex items-center justify-center',
                      'transition-all duration-200',
                      isActive && 'scale-110'
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm'>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] leading-tight text-center px-0.5',
                    'transition-all duration-200',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}
                >
                  {item.label}
                </span>
                {/* Active indicator line */}
                {isActive && (
                  <div className='absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full shadow-sm' />
                )}
              </Link>
            );
          })}

          {/* More Menu Button */}
          <div className='relative flex-1'>
            <button
              ref={moreButtonRef}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                mediumHaptic();
                setShowMoreMenu(!showMoreMenu);
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full',
                'py-2 px-1 min-h-[56px]',
                'transition-all duration-200 select-none touch-manipulation',
                'rounded-xl relative group',
                'active:scale-[0.95] active:bg-accent/30',
                showMoreMenu
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground active:text-foreground'
              )}
              data-more-button
              aria-label='More options'
              aria-expanded={showMoreMenu}
              aria-haspopup='true'
            >
              <div
                className={cn(
                  'h-5 w-5 flex items-center justify-center',
                  'transition-all duration-200',
                  showMoreMenu && 'scale-110'
                )}
              >
                <MoreHorizontal className='h-5 w-5' />
              </div>
              <span
                className={cn(
                  'text-[10px] leading-tight text-center',
                  'transition-all duration-200',
                  showMoreMenu ? 'font-semibold' : 'font-medium'
                )}
              >
                More
              </span>
              {showMoreMenu && (
                <div className='absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full shadow-sm' />
              )}
            </button>

            {/* More Menu Dropdown - Portal for reliable positioning */}
            {showMoreMenu &&
              typeof window !== 'undefined' &&
              createPortal(
                <div
                  className='fixed w-72 bg-background border border-border rounded-2xl shadow-xl z-[100] overflow-hidden'
                  data-more-menu
                  role='menu'
                  aria-label='Additional navigation options'
                  onClick={e => e.stopPropagation()}
                  style={{
                    bottom: `${menuPosition.bottom}px`,
                    left: `${menuPosition.left}px`,
                    transform: 'translateX(-50%)',
                    maxHeight: 'calc(100vh - 200px)',
                  }}
                >
                  <div className='py-2 max-h-[60vh] overflow-y-auto'>
                    {secondaryItems.length > 0 ? (
                      <>
                        <div className='px-4 py-2.5 border-b border-border'>
                          <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                            More Options
                          </h3>
                        </div>
                        <div className='py-1'>
                          {secondaryItems.map(item => {
                            const isActive = pathname === item.to;
                            return (
                              <Link
                                key={item.to}
                                href={item.to}
                                onClick={() => {
                                  lightHaptic();
                                  setShowMoreMenu(false);
                                }}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-3 min-h-[48px]',
                                  'transition-colors duration-150',
                                  'touch-manipulation',
                                  isActive
                                    ? 'text-primary bg-primary/5'
                                    : 'text-foreground hover:bg-accent'
                                )}
                                role='menuitem'
                              >
                                <div className='flex-shrink-0 h-5 w-5'>
                                  {item.icon}
                                </div>
                                <span className='text-sm font-medium'>
                                  {item.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className='px-4 py-3 text-sm text-muted-foreground text-center'>
                        No additional options
                      </div>
                    )}
                  </div>
                </div>,
                document.body
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
              trend.isPositive ? 'text-success' : 'text-destructive'
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
