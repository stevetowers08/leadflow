/**
 * Secondary Navigation Panel - HubSpot Style
 * Clean white sidebar for sub-navigation
 */

import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface SecondaryNavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SecondaryNavigationProps {
  title: string;
  items: SecondaryNavItem[];
  className?: string;
}

export const SecondaryNavigation = ({
  title,
  items,
  className,
}: SecondaryNavigationProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-gray-200 h-screen fixed left-56 z-20',
        'flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className='px-4 py-4 border-b border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-2 py-4 overflow-y-auto scrollbar-modern'>
        <div className='space-y-1'>
          {items.map(item => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                  'transition-all duration-150 ease-in-out',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  'group'
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-all duration-150',
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
