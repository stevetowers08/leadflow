/**
 * Modern UI Components
 * Professional dashboard components with modern design
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTable, EnhancedTableBody, EnhancedTableCell, EnhancedTableHead, EnhancedTableHeader, EnhancedTableRow } from '@/components/ui/enhanced-table';
import { cn } from '@/lib/utils';
import { Loader2, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { designTokens } from './tokens';

// Modern Chart Container
interface ModernChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  actions?: React.ReactNode;
}

export const ModernChartContainer: React.FC<ModernChartContainerProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  actions
}) => {
  return (
    <Card className={cn(designTokens.borders.card, designTokens.shadows.cardStatic, "bg-white")}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

// Modern Loading State
interface ModernLoadingStateProps {
  title: string;
  message?: string;
}

export const ModernLoadingState: React.FC<ModernLoadingStateProps> = ({
  title,
  message = "Loading..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
      <div className="flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

// Modern Metric Card
interface ModernMetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const ModernMetricCard: React.FC<ModernMetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  loading = false,
  onClick
}) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card 
      className={cn(
        designTokens.borders.card,
        designTokens.shadows.cardStatic,
        designTokens.shadows.cardHover,
        "bg-white",
        onClick ? 'cursor-pointer' : ''
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {change !== undefined && (
                <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="font-medium">{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Modern Section Header
interface ModernSectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const ModernSectionHeader: React.FC<ModernSectionHeaderProps> = ({
  title,
  subtitle,
  actions
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};

// Modern Data Table - Matches Jobs page styling exactly
interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: unknown, row: T) => React.ReactNode;
  }>;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  onRowClick
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <EnhancedTable dualScrollbars={false} stickyHeader={true}>
        <EnhancedTableHeader>
          <EnhancedTableRow className="transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-200 bg-gray-50/50">
            {columns.map((column) => (
              <EnhancedTableHead 
                key={column.key}
                className={cn(
                  "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                  column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                )}
                scope="col" 
                style={{
                  width: column.width || 'auto',
                  minWidth: column.minWidth || 'auto'
                }}
              >
                <div className={cn(
                  "flex items-center gap-2",
                  column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'
                )}>
                  <span>{column.label}</span>
                </div>
              </EnhancedTableHead>
            ))}
          </EnhancedTableRow>
        </EnhancedTableHeader>
        <EnhancedTableBody>
          {data.map((row, index) => (
            <EnhancedTableRow 
              key={index} 
              className={cn(
                "data-[state=selected]:bg-muted border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200 group",
                onRowClick ? "cursor-pointer relative" : ""
              )}
              role="row" 
              tabIndex={onRowClick ? 0 : undefined}
              aria-label={`Row ${index + 1}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <EnhancedTableCell 
                  key={column.key} 
                  className={cn(
                    "align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0",
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  )}
                  style={{
                    width: column.width || 'auto',
                    minWidth: column.minWidth || 'auto'
                  }}
                >
                  {column.render ? column.render(row[column.key], row) : (
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {row[column.key] || "-"}
                      </div>
                    </div>
                  )}
                </EnhancedTableCell>
              ))}
            </EnhancedTableRow>
          ))}
        </EnhancedTableBody>
      </EnhancedTable>
    </div>
  );
};
