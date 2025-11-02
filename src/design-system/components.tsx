/**
 * Reusable Page Components
 * Consistent page structure components
 */

import { DropdownSelect } from '@/components/ui/dropdown-select';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { cn } from '@/lib/utils';
import { Search, Star } from 'lucide-react';
import React from 'react';
import { designTokens } from './tokens';

interface PageHeaderProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  count,
  children,
}) => (
  <div className='mb-3'>
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-gray-700'>
          {title}
        </h1>
        {count !== undefined && (
          <p className='text-xs text-muted-foreground mt-0.5'>
            {count.toLocaleString()} total
          </p>
        )}
      </div>
      {children}
    </div>
  </div>
);

export interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
  trend?: number | null;
}

interface StatsBarProps {
  stats: StatItemProps[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => (
  <div className={designTokens.layout.statsContainer}>
    {stats.map((stat, index) => {
      const IconComponent = stat.icon;
      return (
        <div key={index} className={designTokens.layout.statsItem}>
          <div className={designTokens.icons.container}>
            <IconComponent className='h-4 w-4' />
          </div>
          <span className='font-medium'>
            {stat.value} {stat.label}
          </span>
        </div>
      );
    })}
  </div>
);

interface LoadingStateProps {
  title: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title,
  message = 'Loading...',
}) => (
  <div className='space-y-4'>
    <PageHeader title={title} />
    <div className={designTokens.loading.container}>
      <div className={designTokens.loading.spinner}></div>
      <p className={designTokens.loading.text}>{message}</p>
    </div>
  </div>
);

// Page wrapper component
interface PageProps {
  title: string;
  stats?: StatItemProps[];
  children: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  hideHeader?: boolean;
  allowScroll?: boolean; // Allow page to scroll (for informational pages like Getting Started)
}

export const Page: React.FC<PageProps> = ({
  title,
  stats,
  children,
  loading = false,
  loadingMessage,
  hideHeader = false,
  allowScroll = false, // false = fit viewport (tables scroll), true = page scrolls
}) => {
  if (loading) {
    return (
      <>
        <div className='fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10' />
        <div className='relative h-full w-full'>
          <div className='space-y-6 w-full h-full flex flex-col'>
            <LoadingState title={title} message={loadingMessage} />
          </div>
        </div>
      </>
    );
  }

  // Shared header component
  const header = !hideHeader && (
    <div className='flex-shrink-0 mb-2'>
      <div className='flex items-center justify-between w-full'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-700'>{title}</h1>
          {stats && (
            <div className='flex items-center gap-4 mt-1 text-sm'>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className='flex items-center gap-1 text-muted-foreground'>
                    <IconComponent className='h-3 w-3' />
                    <span className='font-semibold'>{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className='fixed inset-0 bg-background -z-10' />
      <div
        className={cn(
          'relative w-full flex flex-col flex-1 min-h-0',
          allowScroll ? 'overflow-auto scrollbar-modern' : 'overflow-hidden'
        )}
      >
        <div
          className={cn(
            'w-full flex flex-col',
            allowScroll ? '' : 'flex-1 min-h-0'
          )}
        >
          {!hideHeader && (
            <div className={cn('flex-shrink-0 mb-2', allowScroll && 'sticky top-0 bg-background z-10 px-4 lg:px-6 pt-6 pb-4')}>
              <div className='flex items-center justify-between w-full'>
                <div>
                  <h1 className='text-2xl font-bold tracking-tight text-gray-700'>{title}</h1>
                  {stats && (
                    <div className='flex items-center gap-4 mt-1 text-sm'>
                      {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                          <div key={index} className='flex items-center gap-1 text-muted-foreground'>
                            <IconComponent className='h-3 w-3' />
                            <span className='font-semibold'>{stat.value}</span>
                            <span>{stat.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={cn(allowScroll ? 'px-4 lg:px-6 pb-6' : 'flex-1 flex flex-col min-h-0')}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Filter Controls Component - Unified Design System Implementation
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterControlsProps {
  statusOptions: FilterOption[];
  userOptions: FilterOption[];
  sortOptions: FilterOption[];
  statusFilter: string | string[];
  selectedUser: string;
  sortBy: string;
  showFavoritesOnly?: boolean;
  searchTerm: string;
  isSearchActive: boolean;
  onStatusChange: (value: string) => void;
  onMultiSelectStatusChange?: (values: string[]) => void;
  onUserChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onFavoritesToggle?: () => void;
  onSearchChange: (value: string) => void;
  onSearchToggle: () => void;
  useMultiSelectStatus?: boolean;
  className?: string;
}

export const FilterControls: React.FC<FilterControlsProps> = React.memo(
  ({
    statusOptions,
    userOptions,
    sortOptions,
    statusFilter,
    selectedUser,
    sortBy,
    showFavoritesOnly,
    searchTerm,
    isSearchActive,
    onStatusChange,
    onMultiSelectStatusChange,
    onUserChange,
    onSortChange,
    onFavoritesToggle,
    onSearchChange,
    onSearchToggle,
    useMultiSelectStatus = false,
    className,
  }) => {
    const tokens = designTokens.filterControls;
    const statusFilterArray = Array.isArray(statusFilter) ? statusFilter : [];

    return (
      <div
        className={cn(
          'flex items-center gap-2 justify-between w-full',
          className
        )}
      >
        <div className='flex items-center gap-3'>
          {/* Status Multi-Select - if enabled */}
          {useMultiSelectStatus && onMultiSelectStatusChange ? (
            <MultiSelectDropdown
              options={statusOptions.filter(o => o.value !== 'all')}
              value={statusFilterArray}
              onValueChange={onMultiSelectStatusChange}
              placeholder='All Stages'
              className={cn(tokens.dropdown, tokens.dropdownMedium)}
            />
          ) : (
            <DropdownSelect
              options={statusOptions}
              value={Array.isArray(statusFilter) ? '' : statusFilter}
              onValueChange={onStatusChange}
              placeholder='All Stages'
              className={cn(tokens.dropdown, tokens.dropdownMedium)}
            />
          )}

          {/* Assignment Filter */}
          <DropdownSelect
            options={userOptions}
            value={selectedUser}
            onValueChange={onUserChange}
            placeholder={userOptions.length > 0 ? userOptions[0].label : 'All'}
            className={cn(tokens.dropdown, tokens.dropdownMedium)}
          />

          {/* Favorites Icon Button - Only show if props provided */}
          {onFavoritesToggle && (
            <button
              onClick={onFavoritesToggle}
              className={cn(
                tokens.button,
                showFavoritesOnly ? tokens.buttonActive : tokens.buttonDefault
              )}
              aria-label={
                showFavoritesOnly ? 'Show all items' : 'Show favorites only'
              }
            >
              <Star
                className={cn(
                  tokens.icon,
                  showFavoritesOnly && tokens.iconActive
                )}
              />
            </button>
          )}

          {/* Sort By Dropdown */}
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={onSortChange}
            placeholder='Sort by'
            className={cn(tokens.dropdown, tokens.dropdownLarge)}
          />
        </div>

        {/* Inline Search - Completely Far Right */}
        <div className='flex items-center'>
          {isSearchActive ? (
            <input
              type='text'
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder='Search...'
              className='h-8 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-w-48'
              autoFocus
            />
          ) : (
            <button
              onClick={onSearchToggle}
              className={cn(tokens.button, tokens.buttonDefault)}
              aria-label='Search'
            >
              <Search className={tokens.icon} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

FilterControls.displayName = 'FilterControls';
