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
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Briefcase,
  Building2,
  Filter,
  Home,
  LogOut,
  Megaphone,
  MessageSquare,
  Rocket,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
// Primary workflow: Jobs → Companies → People → Conversations
const navigationSections = [
  {
    // Core Workflow (most common items displayed prominently)
    items: [
      { name: 'Jobs Feed', href: '/jobs', icon: Briefcase },
      { name: 'Companies', href: '/companies', icon: Building2 },
      { name: 'Contacts', href: '/people', icon: Users },
      { name: 'Conversations', href: '/conversations', icon: MessageSquare },
    ],
  },
  {
    // Advanced Features (Phase 2)
    items: [
      { name: 'Pipeline', href: '/pipeline', icon: Filter },
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
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, userProfile, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
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

          {/* Dashboard - Below Getting Started */}
          {(() => {
            const isActive = location.pathname === dashboardItem.href;
            const Icon = dashboardItem.icon;
            return (
              <Link
                to={dashboardItem.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium mb-3',
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
                <span>{dashboardItem.name}</span>
              </Link>
            );
          })()}

          {/* Divider Line - Below Dashboard */}
          <div className='-mt-3 border-t border-sidebar-border/30' />

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

      {/* User Info Footer */}
      <div ref={menuRef} className='px-3 py-3 flex-shrink-0 relative'>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200'
        >
          <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
            <User className='h-4 w-4 text-white' />
          </div>
          <div className='flex-1 min-w-0 text-left'>
            <p className='text-sm font-medium text-gray-200 truncate'>
              {userProfile?.full_name || user?.email || 'User'}
            </p>
            <p className='text-xs text-gray-400 truncate'>
              {user?.email || 'Account'}
            </p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className='absolute bottom-full left-0 right-0 mb-2 mx-3 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden'>
            <button
              onClick={() => {
                handleSignOut();
                setIsUserMenuOpen(false);
              }}
              className='w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-all duration-200'
            >
              <LogOut className='h-4 w-4' />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
