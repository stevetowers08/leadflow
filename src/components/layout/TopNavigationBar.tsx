/**
 * Ultra-Modern Top Navigation Bar - 2025 Minimal Design
 *
 * Features:
 * - Glassmorphism background with subtle border
 * - Minimal, clean design following 2025 best practices
 * - Proper visual separation from page content
 * - Responsive design with modern styling
 */

import { GlobalSearchDropdown } from '@/components/search/GlobalSearchDropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Bell, LogIn, LogOut, Menu, Search } from 'lucide-react';

interface TopNavigationBarProps {
  pageTitle: string;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
  className?: string;
}

export const TopNavigationBar = ({
  pageTitle,
  onSearch,
  onMenuClick,
  className,
}: TopNavigationBarProps) => {
  const isMobile = useIsMobile();
  const { user, signOut, signInWithGoogle } = useAuth();

  return (
    <header
      className={cn(
        'fixed top-0 z-30',
        'bg-[#2d3e50] border-b border-gray-600',
        'shadow-sm',
        isMobile ? 'w-full px-4 py-2 left-0' : 'left-56 right-0 px-6 py-2',
        className
      )}
    >
      {isMobile ? (
        // Mobile Layout - Simple flex with justify-between
        <div className='flex items-center justify-between w-full'>
          {/* Left Section - Mobile Menu + Page Title */}
          <div className='flex items-center'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onMenuClick}
              className='h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md mr-2'
            >
              <Menu className='h-4 w-4' />
            </Button>
            <h1 className='font-semibold text-white tracking-tight text-sm'>
              {pageTitle}
            </h1>
          </div>

          {/* Right Section - Actions */}
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
            >
              <Search className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
            >
              <Bell className='h-4 w-4' />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
                  >
                    <Avatar className='h-7 w-7'>
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || ''}
                        alt={user.user_metadata?.full_name || 'User'}
                      />
                      <AvatarFallback className='bg-gray-100 text-gray-600 text-xs'>
                        {user.user_metadata?.full_name
                          ?.charAt(0)
                          .toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 bg-white text-gray-900 border border-gray-200 shadow-lg shadow-gray-300/10 rounded-xl p-1'>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className='flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-lg cursor-pointer'
                  >
                    <LogOut className='h-4 w-4 mr-2' />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => signInWithGoogle()}
                variant='ghost'
                size='sm'
                className='h-8 px-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
              >
                <LogIn className='h-4 w-4 mr-2' />
                Sign In
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Desktop Layout - Grid with proper centering
        <div className='grid grid-cols-[1fr_auto_1fr] items-center w-full gap-4'>
          {/* Left Section - Page Title */}
          <div className='flex items-center justify-start'>
            <h1 className='font-semibold text-white tracking-tight text-base'>
              {pageTitle}
            </h1>
          </div>

          {/* Center Section - Search Bar */}
          <div className='flex justify-center'>
            <div className='w-80'>
              <GlobalSearchDropdown />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className='flex items-center gap-1 justify-end'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
            >
              <Bell className='h-4 w-4' />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
                  >
                    <Avatar className='h-7 w-7'>
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || ''}
                        alt={user.user_metadata?.full_name || 'User'}
                      />
                      <AvatarFallback className='bg-gray-100 text-gray-600 text-xs'>
                        {user.user_metadata?.full_name
                          ?.charAt(0)
                          .toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 bg-white text-gray-900 border border-gray-200 shadow-lg shadow-gray-300/10 rounded-xl p-1'>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className='flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-lg cursor-pointer'
                  >
                    <LogOut className='h-4 w-4 mr-2' />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => signInWithGoogle()}
                variant='ghost'
                size='sm'
                className='h-8 px-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
              >
                <LogIn className='h-4 w-4 mr-2' />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
