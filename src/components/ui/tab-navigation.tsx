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
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = 'default',
}) => {
  const isPill = variant === 'pill';

  return (
    <div className={cn('flex-shrink-0 w-full', className)}>
      <nav
        className={cn(
          'flex',
          isPill ? 'gap-3 w-auto' : 'gap-0 border-b border-gray-200 w-full'
        )}
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-200',
                isPill && 'min-w-[80px] max-w-[120px] flex-1',
                isPill
                  ? cn(
                      'rounded-md',
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )
                  : cn(
                      'border-b-2 -mb-[1px]',
                      isActive
                        ? 'text-gray-900 border-gray-900'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    )
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'h-3.5 w-3.5',
                    isPill
                      ? isActive
                        ? 'text-white'
                        : 'text-gray-600'
                      : isActive
                        ? 'text-gray-900'
                        : 'text-gray-400'
                  )}
                />
              )}
              <span>{tab.label}</span>
              {!isPill && tab.showCount !== false && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-[10px] font-medium rounded-full',
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-500'
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
