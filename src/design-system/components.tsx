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

// Page wrapper component - Simplified for fixed positioning layout
interface PageProps {
  title: string;
  stats?: StatItemProps[];
  children: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  hideHeader?: boolean;
  padding?: 'default' | 'large'; // Padding size: default (p-4 lg:p-6) or large (p-8 lg:p-10)
}

export const Page: React.FC<PageProps> = ({
  title,
  stats,
  children,
  loading = false,
  loadingMessage,
  hideHeader = false,
  padding = 'default',
}) => {
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>
            {loadingMessage || 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Uses design tokens for consistent, responsive padding
  // Container has no right padding (pr-0) so horizontal scrollbar extends to edge
  // Vertical padding moved inside scroll container so content isn't cut off when scrolling
  // Content areas (header, scroll container) add right padding back via design tokens

  // Padding sizes: default (1rem mobile, 1.5rem desktop) or large (3rem mobile, 4rem desktop)
  const isLargePadding = padding === 'large';
  const containerPadding = isLargePadding
    ? 'pl-12 lg:pl-16 pr-0' // Large: 3rem mobile, 4rem desktop
    : 'pl-4 lg:pl-6 pr-0'; // Default: 1rem mobile, 1.5rem desktop
  const contentRightPadding = isLargePadding
    ? 'pr-12 lg:pr-16' // Large: 3rem mobile, 4rem desktop
    : 'pr-4 lg:pr-6'; // Default: 1rem mobile, 1.5rem desktop
  const verticalPadding = isLargePadding
    ? 'pt-12 pb-6' // Large: top 3rem (48px), bottom 1.5rem (24px)
    : 'pt-6 pb-3'; // Default: top 1.5rem (24px), bottom 0.75rem (12px)
  const scrollPadding = isLargePadding
    ? '3rem' // 48px
    : '1.5rem'; // 24px

  return (
    <div
      className={cn('w-full flex flex-col overflow-hidden', containerPadding)}
      style={{ height: '100%', minHeight: 0, maxHeight: '100%' }}
    >
      {!hideHeader && (
        <div
          className={cn(
            'mb-6 flex-shrink-0',
            contentRightPadding,
            isLargePadding ? 'pt-12' : 'pt-6'
          )}
        >
          <h1 className='text-2xl font-bold tracking-tight text-gray-700'>
            {title}
          </h1>
          {stats && (
            <div className='flex items-center gap-4 mt-2 text-sm'>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className='flex items-center gap-1 text-muted-foreground'
                  >
                    <IconComponent className='h-3 w-3' />
                    <span className='font-semibold'>{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          'flex-1 min-h-0 overflow-y-auto overflow-x-auto',
          contentRightPadding
        )}
        style={{
          scrollPaddingTop: scrollPadding,
          scrollPaddingBottom: scrollPadding,
        }}
      >
        {/* Content wrapper with padding for visual spacing */}
        <div
          className={cn(
            hideHeader ? verticalPadding : isLargePadding ? 'pb-6' : 'pb-3',
            'h-full flex flex-col'
          )}
          style={{ minHeight: 0 }}
        >
          {children}
        </div>
      </div>
    </div>
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
                showFavoritesOnly
                  ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                  : tokens.buttonDefault
              )}
              aria-label={
                showFavoritesOnly ? 'Show all items' : 'Show favorites only'
              }
            >
              <Star
                className={cn(
                  tokens.icon,
                  showFavoritesOnly && 'fill-current text-amber-600'
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
