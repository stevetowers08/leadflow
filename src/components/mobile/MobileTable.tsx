/**
 * Mobile-Optimized Table Component
 * Provides responsive table layouts for mobile devices
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface MobileTableColumn<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface MobileTableProps<T> {
  data: T[];
  columns: MobileTableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function MobileTable<
  T extends Record<string, unknown> & { id: string },
>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className,
}: MobileTableProps<T>) {
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardContent className='p-8 text-center'>
          <p className='text-muted-foreground'>{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {data.map((item, index) => (
        <Card
          key={item.id || index}
          className='cursor-pointer hover:shadow-md transition-shadow touch-manipulation'
          onClick={() => onRowClick?.(item)}
        >
          <CardContent className='p-4'>
            <div className='flex items-start justify-between'>
              <div className='flex-1 min-w-0'>
                {/* Primary content - usually name/title */}
                <div className='font-medium text-foreground truncate mb-1'>
                  {columns[0]?.render(item)}
                </div>

                {/* Secondary content */}
                <div className='space-y-1'>
                  {columns.slice(1, 3).map(column => (
                    <div
                      key={column.key}
                      className='text-sm text-muted-foreground'
                    >
                      {column.render(item)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action indicator */}
              <div className='flex items-center gap-2 ml-3'>
                {columns.length > 3 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{columns.length - 3} more
                  </Badge>
                )}
                <ChevronRight className='h-4 w-4 text-muted-foreground' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mobile-optimized card list for complex data
interface MobileCardListProps<T> {
  data: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function MobileCardList<
  T extends Record<string, unknown> & { id: string },
>({
  data,
  renderCard,
  loading = false,
  emptyMessage = 'No data available',
  className,
}: MobileCardListProps<T>) {
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardContent className='p-8 text-center'>
          <p className='text-muted-foreground'>{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {data.map((item, index) => (
        <div key={item.id || index}>{renderCard(item, index)}</div>
      ))}
    </div>
  );
}

// Mobile-optimized stats grid
interface MobileStatsGridProps {
  stats: Array<{
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }>;
  className?: string;
}

export function MobileStatsGrid({ stats, className }: MobileStatsGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {stats.map((stat, index) => (
        <Card key={index} className='p-3'>
          <CardContent className='p-0'>
            <div className='flex items-center justify-between'>
              <div className='min-w-0 flex-1'>
                <div className='text-lg font-bold text-foreground truncate'>
                  {stat.value}
                </div>
                <div className='text-xs text-muted-foreground truncate'>
                  {stat.title}
                </div>
              </div>
              {stat.icon && (
                <div className='flex-shrink-0 ml-2 text-muted-foreground'>
                  {stat.icon}
                </div>
              )}
            </div>
            {stat.trend && (
              <div
                className={cn(
                  'text-xs font-medium mt-1',
                  stat.trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {stat.trend.isPositive ? '+' : ''}
                {stat.trend.value}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
