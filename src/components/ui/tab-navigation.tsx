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
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('border-b border-gray-200 flex-shrink-0', className)}>
      <nav className='flex space-x-8'>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 py-3 text-sm font-medium transition-colors duration-150',
                'border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300',
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-gray-500'
              )}
            >
              {Icon && <Icon className='h-4 w-4' />}
              <span>{tab.label}</span>
              {tab.showCount !== false && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
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
