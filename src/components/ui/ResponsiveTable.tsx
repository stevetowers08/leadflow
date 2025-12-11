/**
 * Responsive Table Wrapper - 2025 Best Practices
 *
 * Automatically switches between desktop table and mobile card layout
 * Features:
 * - Auto-detection of mobile devices
 * - Seamless switching between table/card views
 * - Consistent API with UnifiedTable
 * - Preserves table functionality on desktop
 */

'use client';

import { ColumnConfig } from './unified-table';
import {
  EnhancedMobileTable,
  MobileTableColumn,
} from '../mobile/EnhancedMobileTable';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

interface ResponsiveTableProps<T = unknown> {
  data: T[];
  columns: ColumnConfig<T>[];
  pagination?: boolean;
  stickyHeaders?: boolean;
  maxHeight?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  scrollable?: boolean;
  grouped?: boolean;
  groups?: Array<{ label: string; count: number; data: T[] }>;
  expandedGroups?: Set<string>;
  onToggleGroup?: (groupLabel: string) => void;
  tableId?: string;
  // Mobile-specific props
  mobilePrimaryColumns?: string[]; // Column keys to show as primary on mobile
  mobileShowExpandable?: boolean;
  mobileSwipeActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    action: (item: T) => void;
    variant?: 'default' | 'destructive' | 'secondary';
    className?: string;
  }>;
}

export function ResponsiveTable<T = unknown>({
  data,
  columns,
  mobilePrimaryColumns,
  mobileShowExpandable = true,
  mobileSwipeActions,
  ...props
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  // Convert UnifiedTable columns to MobileTable columns
  const mobileColumns: MobileTableColumn<T>[] = React.useMemo(() => {
    return columns.map((col, index) => ({
      key: col.key,
      label: typeof col.label === 'string' ? col.label : `Column ${index + 1}`,
      render:
        col.render ||
        ((item: T) => {
          const value = (item as Record<string, unknown>)[col.key];
          return value ? String(value) : '-';
        }),
      primary: mobilePrimaryColumns
        ? mobilePrimaryColumns.includes(col.key)
        : index < 2, // Default: first 2 columns are primary
    }));
  }, [columns, mobilePrimaryColumns]);

  // Ensure data items have id property - memoized outside conditional
  const dataWithIds = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      id: ((item as Record<string, unknown>).id as string) || String(index),
    })) as Array<T & { id: string }>;
  }, [data]);

  // On mobile, use EnhancedMobileTable
  if (isMobile) {
    return (
      <EnhancedMobileTable
        data={dataWithIds}
        columns={mobileColumns}
        onRowClick={item => {
          const originalIndex = data.findIndex(
            d =>
              (d as Record<string, unknown>).id === item.id ||
              (d as Record<string, unknown>) === item
          );
          props.onRowClick?.(item as T, originalIndex >= 0 ? originalIndex : 0);
        }}
        loading={props.loading}
        emptyMessage={props.emptyMessage}
        className={props.className}
        showExpandable={mobileShowExpandable}
        swipeActions={mobileSwipeActions}
        maxPrimaryColumns={mobilePrimaryColumns?.length || 2}
      />
    );
  }

  // On desktop, table removed
  return <div className="flex items-center justify-center h-full text-muted-foreground">Table removed</div>;
}

// Re-export for convenience
export { ResponsiveTable as Table };
