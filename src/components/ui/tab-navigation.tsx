import { cn } from '@/lib/utils';
import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count: number;
  icon?: React.ComponentType<{ className?: string }> | null;
  showCount?: boolean;
}

export interface TabNavigationProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pill';
  size?: 'sm' | 'md';
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = 'default',
  size = 'md',
}) => {
  const isPill = variant === 'pill';
  const isSmall = size === 'sm';

  return (
    <div className={cn('flex-shrink-0 w-full', className)}>
      <nav
        className={cn(
          'flex',
          isPill
            ? cn(isSmall ? 'gap-1.5' : 'gap-3', 'w-auto')
            : 'gap-0 border-b border-border w-full'
        )}
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type='button'
              role='tab'
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onTabChange(tab.id);
              }}
              className={cn(
                'cursor-pointer',
                cn(
                  'relative flex items-center justify-center font-medium transition-all duration-200',
                  isSmall
                    ? 'gap-1 px-2 py-1 text-sm'
                    : 'gap-1.5 px-3 py-1.5 text-sm'
                ),
                // For compact pills, size to content (no flex grow / min-width)
                isPill && (isSmall ? '' : 'min-w-[80px] max-w-[120px] flex-1'),
                isPill
                  ? cn(
                      'rounded-md',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted-hover dark:bg-muted dark:hover:bg-muted-hover'
                    )
                  : cn(
                      'border-b-2 -mb-[1px]',
                      isActive
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/60'
                    )
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    isSmall ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5',
                    isPill
                      ? isActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                      : isActive
                        ? 'text-primary'
                        : 'text-muted-foreground'
                  )}
                />
              )}
              <span>{tab.label}</span>
              {!isPill && tab.showCount !== false && (
                <span
                  className={cn(
                    cn(
                      'inline-flex items-center justify-center rounded-full',
                      isSmall
                        ? 'min-w-[18px] px-1.5 py-0.5 text-[10px]'
                        : 'min-w-[20px] px-1.5 py-0.5 text-[10px]'
                    ),
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground'
                  )}
                >
                  {tab.count ?? 0}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
