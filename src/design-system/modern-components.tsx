/**
 * Modern UI Components
 * Professional dashboard components with modern design
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Modern Data Table
interface ModernDataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
  }>;
  loading?: boolean;
}

export const ModernDataTable: React.FC<ModernDataTableProps> = ({
  data,
  columns,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className={cn(designTokens.borders.card, designTokens.shadows.cardStatic, "bg-white")}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(designTokens.borders.card, designTokens.shadows.cardStatic, "bg-white")}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className={cn("w-full", designTokens.borders.table)}>
            <thead className={cn("bg-gray-50", designTokens.borders.tableHeader)}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", designTokens.borders.tableCell)}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", designTokens.borders.tableCell)}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
