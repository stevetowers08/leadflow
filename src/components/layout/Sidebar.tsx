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
  Bot,
  Briefcase,
  Building2,
  Home,
  MessageSquare,
  Settings,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FourTwentyLogo } from '../FourTwentyLogo';

// Navigation grouped by sections with dividers
const navigationSections = [
  {
    items: [{ name: 'Dashboard', href: '/', icon: Home }],
  },
  {
    items: [
      { name: 'Jobs', href: '/jobs', icon: Briefcase },
      { name: 'People', href: '/people', icon: Users },
      { name: 'Companies', href: '/companies', icon: Building2 },
    ],
  },
  {
    items: [
      { name: 'Pipeline', href: '/pipeline', icon: Target },
      { name: 'Conversations', href: '/conversations', icon: MessageSquare },
    ],
  },
  {
    items: [
      { name: 'Automations', href: '/automations', icon: Bot },
      { name: 'Reporting', href: '/reporting', icon: BarChart3 },
    ],
  },
  {
    items: [{ name: 'Settings', href: '/settings', icon: Settings }],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        'flex flex-col h-full w-full',
        'bg-sidebar text-sidebar-foreground border-r border-sidebar-border',
        'transition-all duration-300 ease-out'
      )}
    >
      {/* Clean Header */}
      <div className='px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <FourTwentyLogo size={20} />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse' />
            </div>
            <h1 className='text-base font-bold text-sidebar-foreground'>
              Empowr CRM
            </h1>
          </div>
          <div className='flex items-center gap-2'>
            {onClose && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='lg:hidden h-9 w-9 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg'
              >
                <X className='h-5 w-5' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation with Section Dividers */}
      <nav className='flex-1 px-3 py-5 overflow-y-auto custom-scrollbar'>
        <div className='space-y-1'>
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Items - Close together */}
              <ul className='space-y-1'>
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
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground',
                          'group'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-all duration-200',
                            isActive
                              ? 'text-sidebar-primary-foreground'
                              : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
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
                <div className='my-3 border-t border-sidebar-border/30' />
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};
