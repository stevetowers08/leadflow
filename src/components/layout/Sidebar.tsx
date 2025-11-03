'use client';

/**
 * Clean Sidebar - Minimal Design Matching Screenshots
 *
 * Features:
 * - Clean, minimal navigation
 * - No subheadings or descriptions
 * - Consistent spacing and heights
 * - Modern glassmorphism effects
 */

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Briefcase,
  Building2,
  Home,
  Megaphone,
  MessageSquare,
  Rocket,
  Settings,
  Target,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RecruitEdgeLogo } from '../RecruitEdgeLogo';

// Getting Started & Dashboard (always at top)
const gettingStartedItem = {
  name: 'Getting Started',
  href: '/getting-started',
  icon: Rocket,
};

const dashboardItem = {
  name: 'Dashboard',
  href: '/',
  icon: Home,
};

// Navigation following user flow documentation
// Primary campaigns: Jobs → Companies → Contacts → Conversations
const navigationSections = [
  {
    // Core Campaigns (most common items displayed prominently)
    items: [
      { name: 'Jobs Feed', href: '/jobs', icon: Briefcase },
      { name: 'Companies', href: '/companies', icon: Building2 },
      { name: 'Contacts', href: '/contacts', icon: Users },
      { name: 'Conversations', href: '/conversations', icon: MessageSquare },
    ],
  },
  {
    // Advanced Features (Phase 2)
    items: [
      { name: 'Deals', href: '/pipeline', icon: Target },
      { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
      { name: 'Analytics', href: '/reporting', icon: BarChart3 },
    ],
  },
  {
    // Settings
    items: [{ name: 'Settings', href: '/settings', icon: Settings }],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-blue-500/5 via-blue-50/30 to-blue-500/10 backdrop-blur-sm'>
      {/* Clean Header - Above border line */}
      <div className='px-4 py-2 flex-shrink-0 flex items-center h-[48px]'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <RecruitEdgeLogo size={20} />
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse' />
          </div>
          <h1 className='text-base font-bold text-foreground'>RECRUITEDGE</h1>
        </div>
        {onClose && (
          <div className='ml-auto'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='lg:hidden h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-gray-200 rounded-lg'
            >
              <X className='h-5 w-5' />
            </Button>
          </div>
        )}
      </div>

      {/* Border line matching header */}
      <div className='h-px bg-gray-200 flex-shrink-0' />

      {/* Navigation with Section Dividers */}
      <nav className='flex-1 px-3 py-5 overflow-y-auto custom-scrollbar scrollbar-modern pb-4'>
        <div className='space-y-2'>
          {/* Getting Started - Always at top */}
          {(() => {
            const isActive = pathname === gettingStartedItem.href;
            const Icon = gettingStartedItem.icon;
            return (
              <Link
                href={gettingStartedItem.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-200 ease-in-out',
                  isActive
                    ? 'bg-gray-200 text-foreground'
                    : 'text-foreground hover:bg-gray-200 hover:text-foreground',
                  'group'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-all duration-200',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{gettingStartedItem.name}</span>
              </Link>
            );
          })()}

          {/* Dashboard - Below Getting Started */}
          {(() => {
            const isActive = pathname === dashboardItem.href;
            const Icon = dashboardItem.icon;
            return (
              <Link
                href={dashboardItem.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-200 ease-in-out',
                  isActive
                    ? 'bg-gray-200 text-foreground'
                    : 'text-foreground hover:bg-gray-200 hover:text-foreground',
                  'group'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-all duration-200',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{dashboardItem.name}</span>
              </Link>
            );
          })()}

          {/* Divider Line - Below Dashboard */}
          <div className='border-t border-sidebar-border/30' />

          {/* Rest of navigation sections */}
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Items - Consistent spacing */}
              <ul className='space-y-1'>
                {section.items.map(item => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={isMobile ? onClose : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                          'transition-all duration-200 ease-in-out',
                          isActive
                            ? 'bg-gray-200 text-foreground'
                            : 'text-foreground hover:bg-gray-200 hover:text-foreground',
                          'group'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 transition-all duration-200',
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Thin Divider Line - Only between sections, not after the last */}
              {sectionIndex < navigationSections.length - 1 && (
                <div className='border-t border-sidebar-border/30 my-2' />
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};
