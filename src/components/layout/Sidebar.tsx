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
  HelpCircle,
  Home,
  Megaphone,
  MessageSquare,
  Rocket,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { RecruitEdgeLogo } from '../RecruitEdgeLogo';

// Getting Started (always at top)
const gettingStartedItem = {
  name: 'Getting Started',
  href: '/getting-started',
  icon: Rocket,
};

// Navigation following user flow documentation
// Primary workflow: Jobs → Companies → People → Conversations
const navigationSections = [
  {
    // Core Workflow (most common items displayed prominently)
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Jobs Feed', href: '/jobs', icon: Briefcase },
      { name: 'Companies', href: '/companies', icon: Building2 },
      { name: 'Contacts', href: '/people', icon: Users },
      { name: 'Conversations', href: '/conversations', icon: MessageSquare },
    ],
  },
  {
    // Advanced Features (Phase 2)
    items: [
      { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
      { name: 'Analytics', href: '/reporting', icon: BarChart3 },
    ],
  },
  {
    // Settings & Support
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
      { name: 'Help', href: '/about', icon: HelpCircle },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col h-full w-full'>
      {/* Clean Header */}
      <div className='px-4 py-4 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <RecruitEdgeLogo size={20} />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse' />
            </div>
            <h1 className='text-base font-bold text-gray-200'>RECRUITEDGE</h1>
          </div>
          <div className='flex items-center gap-2'>
            {onClose && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='lg:hidden h-9 w-9 p-0 text-gray-200 hover:text-gray-100 hover:bg-white/10 rounded-lg'
              >
                <X className='h-5 w-5' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation with Section Dividers */}
      <nav className='flex-1 px-3 py-5 overflow-y-auto custom-scrollbar pb-4'>
        <div className='space-y-0.5'>
          {/* Getting Started - Always at top */}
          {(() => {
            const isActive = location.pathname === gettingStartedItem.href;
            const Icon = gettingStartedItem.icon;
            return (
              <Link
                to={gettingStartedItem.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-200 ease-in-out',
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-all duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-white'
                  )}
                />
                <span>{gettingStartedItem.name}</span>
              </Link>
            );
          })()}

          {/* Divider Line - Below Getting Started */}
          <div className='my-2 border-t border-sidebar-border/30' />

          {/* Rest of navigation sections */}
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Items - Close together */}
              <ul className='space-y-0.5'>
                {section.items.map(item => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={isMobile ? onClose : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                          'transition-all duration-200 ease-in-out',
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'group'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 transition-all duration-200',
                            isActive
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-white'
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
                <div className='my-2 border-t border-sidebar-border/30' />
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};
