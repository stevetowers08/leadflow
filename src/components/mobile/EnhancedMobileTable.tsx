/**
 * Enhanced Mobile Table Component - 2025 Best Practices
 *
 * Features:
 * - Progressive disclosure (show key info, expand for more)
 * - Swipe actions (swipe left for actions)
 * - Card-based layout optimized for touch
 * - Improved touch targets (48px minimum)
 * - Loading states with skeletons
 * - Empty states with helpful messaging
 * - Accessibility support (ARIA labels, keyboard nav)
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  Edit,
  Star,
} from 'lucide-react';
import React, { useCallback, useState, useRef, useEffect } from 'react';

export interface MobileTableColumn<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  primary?: boolean; // Primary columns shown by default
  sortable?: boolean;
  width?: string;
}

interface SwipeAction<T> {
  label: string;
  icon?: React.ReactNode;
  action: (item: T) => void;
  variant?: 'default' | 'destructive' | 'secondary';
  className?: string;
}

interface EnhancedMobileTableProps<T> {
  data: T[];
  columns: MobileTableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  swipeActions?: SwipeAction<T>[];
  showExpandable?: boolean; // Enable expandable rows
  maxPrimaryColumns?: number; // Max primary columns to show (default: 2)
}

function EnhancedMobileTableComponent<
  T extends Record<string, unknown> & { id: string },
>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  className,
  swipeActions = [],
  showExpandable = true,
  maxPrimaryColumns = 2,
}: EnhancedMobileTableProps<T>) {
  const isMobile = useIsMobile();
  const { lightHaptic, mediumHaptic } = useHapticFeedback();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [swipedRowId, setSwipedRowId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<Record<string, number>>({});

  // Cleanup swipe offsets for unmounted rows to prevent memory leaks
  useEffect(() => {
    const currentIds = new Set(
      data.map(item => item.id || String(data.indexOf(item)))
    );
    setSwipeOffset(prev => {
      const cleaned: Record<string, number> = {};
      Object.keys(prev).forEach(id => {
        if (currentIds.has(id)) {
          cleaned[id] = prev[id];
        }
      });
      return cleaned;
    });
  }, [data]);

  const touchStartRef = useRef<{ x: number; id: string } | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement>>({});

  // Separate columns into primary and secondary
  const primaryColumns = columns
    .filter(col => col.primary)
    .slice(0, maxPrimaryColumns);
  const secondaryColumns = columns.filter(
    col => !col.primary || (col.primary && !primaryColumns.includes(col))
  );

  // Handle row expansion
  const toggleRow = useCallback(
    (id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      lightHaptic();
      setExpandedRows(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [lightHaptic]
  );

  // Handle swipe gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, id: string) => {
      if (!swipeActions.length) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, id };
    },
    [swipeActions.length]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent, id: string) => {
      if (!touchStartRef.current || touchStartRef.current.id !== id) return;
      if (!swipeActions.length) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;

      // Only allow left swipe (negative deltaX)
      if (deltaX < 0) {
        const offset = Math.max(deltaX, -120); // Max swipe distance
        setSwipeOffset(prev => ({ ...prev, [id]: offset }));
        setSwipedRowId(id);
      }
    },
    [swipeActions.length]
  );

  const handleTouchEnd = useCallback(
    (id: string) => {
      if (!touchStartRef.current || touchStartRef.current.id !== id) return;
      if (!swipeActions.length) return;

      const offset = swipeOffset[id] || 0;

      // If swiped more than 50%, reveal actions, otherwise snap back
      if (offset < -60) {
        setSwipeOffset(prev => ({ ...prev, [id]: -120 }));
        mediumHaptic();
      } else {
        setSwipeOffset(prev => ({ ...prev, [id]: 0 }));
        setSwipedRowId(null);
      }

      touchStartRef.current = null;
    },
    [swipeActions.length, swipeOffset, mediumHaptic]
  );

  // Reset swipe on click outside or scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (swipedRowId) {
        const rowElement = rowRefs.current[swipedRowId];
        let target: Node | null = null;

        if (event instanceof MouseEvent) {
          target = event.target as Node;
        } else if (
          event instanceof TouchEvent &&
          event.touches &&
          event.touches.length > 0
        ) {
          target = event.touches[0].target as Node;
        }

        if (rowElement && target && !rowElement.contains(target)) {
          setSwipeOffset(prev => ({ ...prev, [swipedRowId]: 0 }));
          setSwipedRowId(null);
        }
      }
    };

    const handleScroll = () => {
      if (swipedRowId) {
        setSwipeOffset(prev => ({ ...prev, [swipedRowId]: 0 }));
        setSwipedRowId(null);
      }
    };

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [swipedRowId]);

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-4'>
              <div className='h-5 bg-gray-200 rounded w-3/4 mb-3'></div>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-4 bg-gray-200 rounded w-2/3'></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardContent className='p-12 text-center'>
          {emptyIcon && (
            <div className='flex justify-center mb-4 text-muted-foreground'>
              {emptyIcon}
            </div>
          )}
          <p className='text-muted-foreground text-base font-medium'>
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {data.map((item, index) => {
        const id = item.id || String(index);
        const isExpanded = expandedRows.has(id);
        const isSwiped = swipedRowId === id;
        const offset = swipeOffset[id] || 0;

        return (
          <div
            key={id}
            ref={el => {
              if (el) rowRefs.current[id] = el;
            }}
            className='relative overflow-hidden'
            style={{ touchAction: 'pan-y pan-x' }} // Allow both vertical scroll and horizontal swipe
          >
            {/* Swipe Actions Background */}
            {swipeActions.length > 0 && (
              <div
                className={cn(
                  'absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 z-10',
                  'transition-transform duration-200 ease-out',
                  isSwiped ? 'translate-x-0' : 'translate-x-full'
                )}
                style={{
                  transform: `translateX(${Math.abs(offset)}px)`,
                }}
              >
                {swipeActions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'default'}
                    size='sm'
                    onClick={e => {
                      e.stopPropagation();
                      action.action(item);
                      setSwipeOffset(prev => ({ ...prev, [id]: 0 }));
                      setSwipedRowId(null);
                    }}
                    className={cn(
                      'min-h-[44px] min-w-[44px] rounded-lg',
                      action.className
                    )}
                    aria-label={action.label}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        action.action(item);
                        setSwipeOffset(prev => ({ ...prev, [id]: 0 }));
                        setSwipedRowId(null);
                      }
                    }}
                  >
                    {action.icon || <MoreVertical className='h-4 w-4' />}
                  </Button>
                ))}
              </div>
            )}

            {/* Card Content */}
            <Card
              className={cn(
                'cursor-pointer transition-all',
                'touch-manipulation min-h-[56px]',
                isSwiped && 'shadow-lg'
              )}
              style={{
                transform: offset < 0 ? `translateX(${offset}px)` : 'none',
              }}
              onTouchStart={e => handleTouchStart(e, id)}
              onTouchMove={e => handleTouchMove(e, id)}
              onTouchEnd={() => handleTouchEnd(id)}
              onClick={() => {
                if (!isSwiped && onRowClick) {
                  onRowClick(item);
                }
              }}
            >
              <CardContent className='p-4'>
                <div className='flex items-start justify-between gap-3'>
                  {/* Main Content */}
                  <div className='flex-1 min-w-0'>
                    {/* Primary Columns */}
                    <div className='space-y-2'>
                      {primaryColumns.map((column, colIndex) => (
                        <div
                          key={column.key}
                          className={cn(
                            colIndex === 0
                              ? 'font-semibold text-foreground text-base'
                              : 'text-sm text-muted-foreground'
                          )}
                        >
                          {column.render(item)}
                        </div>
                      ))}
                    </div>

                    {/* Secondary Columns (expandable) */}
                    {showExpandable && secondaryColumns.length > 0 && (
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-200',
                          isExpanded ? 'max-h-[500px] mt-2' : 'max-h-0'
                        )}
                      >
                        <div className='space-y-1.5 pt-2 border-t border-border/50'>
                          {secondaryColumns.map(column => (
                            <div
                              key={column.key}
                              className='flex items-center justify-between text-sm'
                            >
                              <span className='text-muted-foreground font-medium'>
                                {column.label}:
                              </span>
                              <span className='text-foreground ml-2 text-right flex-1'>
                                {column.render(item)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-start gap-2 flex-shrink-0'>
                    {showExpandable &&
                      secondaryColumns.length > 0 &&
                      (isExpanded ? (
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground'
                          onClick={e => toggleRow(id, e)}
                          aria-label='Collapse row'
                        >
                          <ChevronRight className='h-4 w-4 rotate-90' />
                        </Button>
                      ) : (
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground'
                          onClick={e => toggleRow(id, e)}
                          aria-label='Expand row'
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      ))}
                    {!showExpandable && (
                      <ChevronRight className='h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5' />
                    )}
                  </div>
                </div>

                {/* More columns indicator */}
                {secondaryColumns.length > 0 && !isExpanded && (
                  <div className='mt-2 pt-2 border-t border-border/30'>
                    <Badge variant='secondary' className='text-xs font-normal'>
                      +{secondaryColumns.length} more
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

// Memoize EnhancedMobileTable to prevent unnecessary re-renders
export const EnhancedMobileTable = React.memo(
  EnhancedMobileTableComponent
) as typeof EnhancedMobileTableComponent;

// Default swipe actions for common use cases
const defaultSwipeActions = {
  edit: <T extends { id: string }>(
    onEdit: (item: T) => void
  ): SwipeAction<T> => ({
    label: 'Edit',
    icon: <Edit className='h-4 w-4' />,
    action: onEdit,
    variant: 'secondary',
  }),
  delete: <T extends { id: string }>(
    onDelete: (item: T) => void
  ): SwipeAction<T> => ({
    label: 'Delete',
    icon: <Trash2 className='h-4 w-4' />,
    action: onDelete,
    variant: 'destructive',
  }),
  favorite: <T extends { id: string }>(
    onFavorite: (item: T) => void
  ): SwipeAction<T> => ({
    label: 'Favorite',
    icon: <Star className='h-4 w-4' />,
    action: onFavorite,
    variant: 'default',
  }),
};

// Export default swipe actions separately to avoid react-refresh warning
export { defaultSwipeActions };
