/**
 * Ultra-Modern Top Navigation Bar - 2025 Minimal Design
 *
 * Features:
 * - Glassmorphism background with subtle border
 * - Minimal, clean design following 2025 best practices
 * - Proper visual separation from page content
 * - Responsive design with modern styling
 */

import { AllCompanyNotesButton } from '@/components/companies/AllCompanyNotesButton';
import { GlobalSearchDropdown } from '@/components/search/GlobalSearchDropdown';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { RecentActivityButton } from '@/components/shared/RecentActivityButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Info, LogIn, LogOut, Menu } from 'lucide-react';

interface TopNavigationBarProps {
  pageTitle: string;
  pageSubheading?: string;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
  className?: string;
}

export const TopNavigationBar = ({
  pageTitle,
  pageSubheading,
  onSearch,
  onMenuClick,
  className,
}: TopNavigationBarProps) => {
  const isMobile = useIsMobile();
  const { user, signOut, signInWithGoogle } = useAuth();

  return (
    <header
      className={cn(
        'fixed top-0 z-30 h-12',
        'bg-gray-50 border-b border-gray-200',
        isMobile ? 'w-full px-4 left-0' : 'left-56 right-0 px-6',
        'flex items-center',
        className
      )}
    >
      {isMobile ? (
        // Mobile Layout - Simple flex with justify-between
        <div className='flex items-center justify-between w-full'>
          {/* Left Section - Mobile Menu */}
          <div className='flex items-center'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onMenuClick}
              className='h-8 w-8 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md'
            >
              <Menu className='h-4 w-4' />
            </Button>
          </div>

          {/* Center Section - Search Bar */}
          <div className='flex-1 mx-4'>
            <GlobalSearchDropdown />
          </div>

          {/* Right Section - Actions */}
          <div className='flex items-center gap-1'>
            <NotificationCenter />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md'
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
        // Desktop Layout - Relative positioning for true centering
        <div className='relative flex items-center w-full'>
          {/* Left Section - Page Title with Info Icon */}
          <div className='flex items-center gap-2'>
            <h1 className='text-lg font-semibold tracking-tight text-foreground'>
              {pageTitle}
            </h1>
            {pageSubheading && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='rounded-full hover:bg-gray-100 transition-colors p-0.5'
                      aria-label='More information'
                    >
                      <Info className='h-4 w-4 text-gray-400' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    align='start'
                    className='bg-white text-gray-900 border border-gray-200 shadow-lg'
                  >
                    <p className='text-sm max-w-xs'>{pageSubheading}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Center Section - Search Bar */}
          <div className='absolute left-1/2 -translate-x-1/2'>
            <div className='w-full max-w-6xl'>
              <GlobalSearchDropdown className='w-full max-w-6xl' />
            </div>
          </div>

          {/* Right Section - Actions + User Profile */}
          <div className='flex items-center gap-2 ml-auto'>
            <NotificationCenter />
            <RecentActivityButton />
            <AllCompanyNotesButton />
            <div className='mx-1 h-6 w-px bg-gray-300' aria-hidden='true' />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='h-7 w-7 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md'
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
