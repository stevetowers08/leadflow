'use client';

/**
 * Table Filter Bar Component
 * Attio-style filtering and sorting bar for table pages
 */

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown } from 'lucide-react';
import { TableFilterBarProps } from '@/types/tableFilters';

export function TableFilterBar({
  entityLabel,
  entityCount,
  viewOptions,
  sortOptions,
  filterConfigs,
  preferences,
  onPreferencesChange,
  onViewChange,
  className,
}: TableFilterBarProps) {
  const activeFilterCount = Object.entries(preferences.filters).filter(
    ([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0 && value.some(v => v !== 'all');
      }
      return value !== 'all' && value !== '';
    }
  ).length;

  const handleClearFilters = () => {
    const clearedFilters: Record<string, string> = {};
    Object.keys(preferences.filters).forEach(key => {
      clearedFilters[key] = 'all';
    });
    onPreferencesChange({ filters: clearedFilters });
  };

  return (
    <div
      className={cn(
        'w-full border-b border-border bg-background',
        'px-4 py-2',
        className
      )}
    >
      {/* Sort + Filters */}
      <div className='flex items-center gap-2 flex-wrap'>
        {/* Sort Dropdown */}
        <Select
          value={preferences.sortBy}
          onValueChange={sortBy => onPreferencesChange({ sortBy })}
        >
          <SelectTrigger className='h-8 w-auto min-w-[140px] text-sm border-border'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Dropdowns */}
        {filterConfigs.map(filter => {
          const currentValue = preferences.filters[filter.key];
          const isActive =
            currentValue !== 'all' &&
            currentValue !== '' &&
            (Array.isArray(currentValue) ? currentValue.length > 0 : true);

          return (
            <Select
              key={filter.key}
              value={
                Array.isArray(currentValue) ? currentValue[0] : currentValue
              }
              onValueChange={value => {
                onPreferencesChange({
                  filters: {
                    ...preferences.filters,
                    [filter.key]: value,
                  },
                });
              }}
            >
              <SelectTrigger
                className={cn(
                  'h-8 w-auto min-w-[120px] text-sm border-border',
                  isActive && 'border-primary bg-primary/5'
                )}
              >
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className='flex items-center gap-2'>
                      {option.icon && <option.icon className='h-4 w-4' />}
                      {option.label}
                      {option.count !== undefined && (
                        <span className='text-muted-foreground text-xs ml-auto'>
                          ({option.count})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}

        {/* Active Filters Badge + Clear */}
        {activeFilterCount > 0 && (
          <div className='flex items-center gap-2 ml-2'>
            <Badge variant='secondary' className='h-6 text-xs'>
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </Badge>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearFilters}
              className='h-6 px-2 text-xs'
            >
              <X className='h-3 w-3 mr-1' />
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
