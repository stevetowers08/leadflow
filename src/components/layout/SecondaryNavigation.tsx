'use client';

/**
 * Secondary Navigation Panel - HubSpot Style
 * Clean white sidebar for sub-navigation
 */

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-56 z-20',
        'flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className='px-4 py-4 border-b border-border'>
        <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-2 py-4 overflow-y-auto scrollbar-modern'>
        <div className='space-y-1'>
          {items.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                  'transition-all duration-150 ease-in-out',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted hover:text-foreground',
                  'group'
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-all duration-150',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground'
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
