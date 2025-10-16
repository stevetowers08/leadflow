/**
 * Reusable Page Components
 * Consistent page structure components
 */

import { DropdownSelect } from '@/components/ui/dropdown-select';
import { SearchIconButton } from '@/components/ui/search-modal';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
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
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
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
}

export const Page: React.FC<PageProps> = ({
  title,
  stats,
  children,
  loading = false,
  loadingMessage,
  hideHeader = false,
}) => {
  if (loading) {
    return (
      <>
        {/* Full-screen background */}
        <div className='fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10' />

        {/* Full-width content with proper overflow handling for hover elements */}
        <div className='relative h-screen w-full'>
          <div className='space-y-6 w-full px-4 py-6 lg:px-6 h-full flex flex-col pb-8'>
            <LoadingState title={title} message={loadingMessage} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Full-screen background */}
      <div className='fixed inset-0 bg-white -z-10' />

      {/* Full-width content with proper overflow handling for hover elements */}
      <div className='relative h-screen w-full'>
        <div
          className={cn('space-y-6 w-full h-full flex flex-col px-4 lg:px-6')}
        >
          {!hideHeader && (
            <div className='mb-4 w-full flex-shrink-0'>
              <div className='flex items-center justify-between w-full'>
                <div>
                  <h1 className='text-2xl font-bold tracking-tight text-foreground'>
                    {title}
                  </h1>
                  {stats && (
                    <div className='flex items-center gap-4 mt-1 text-sm'>
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
              </div>
            </div>
          )}
          <div className='flex-1 flex flex-col pb-8'>{children}</div>
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
  statusFilter: string;
  selectedUser: string;
  sortBy: string;
  showFavoritesOnly: boolean;
  onStatusChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onFavoritesToggle: () => void;
  onSearchClick: () => void;
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
    onStatusChange,
    onUserChange,
    onSortChange,
    onFavoritesToggle,
    onSearchClick,
    className,
  }) => {
    const tokens = designTokens.filterControls;

    return (
      <div className={cn(tokens.container, className)}>
        <div className={tokens.leftGroup}>
          {/* Status Filter */}
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onValueChange={onStatusChange}
            placeholder='All Statuses'
            className={cn(tokens.dropdown, tokens.dropdownSmall)}
          />

          {/* Assignment Filter */}
          <DropdownSelect
            options={userOptions}
            value={selectedUser}
            onValueChange={onUserChange}
            placeholder='Filter by user'
            className={cn(tokens.dropdown, tokens.dropdownMedium)}
          />

          {/* Favorites Icon Button */}
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
        </div>

        <div className={tokens.rightGroup}>
          {/* Sort By Dropdown */}
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={onSortChange}
            placeholder='Sort by'
            className={cn(tokens.dropdown, tokens.dropdownLarge)}
          />

          {/* Search Button */}
          <SearchIconButton onClick={onSearchClick} className='h-8 w-8' />
        </div>
      </div>
    );
  }
);

FilterControls.displayName = 'FilterControls';
