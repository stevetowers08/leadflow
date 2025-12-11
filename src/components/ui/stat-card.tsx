import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { designTokens } from '@/design-system/tokens';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  formatValue?: (value: string | number) => string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      change,
      changeLabel,
      icon: Icon,
      trend,
      loading = false,
      onClick,
      className,
      formatValue,
    },
    ref
  ) => {
    const getTrendIcon = () => {
      if (trend === 'up' || (change !== undefined && change > 0)) {
        return <TrendingUp className="h-4 w-4 text-success" />;
      }
      if (trend === 'down' || (change !== undefined && change < 0)) {
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      }
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    };

    const getTrendColor = () => {
      if (trend === 'up' || (change !== undefined && change > 0)) {
        return 'text-success';
      }
      if (trend === 'down' || (change !== undefined && change < 0)) {
        return 'text-destructive';
      }
      return 'text-muted-foreground';
    };

    const displayValue = formatValue ? formatValue(value) : value;

    return (
      <Card
        ref={ref}
        variant="minimal"
        interactive={!!onClick}
        onClick={onClick}
        className={cn(
          designTokens.shadows.card,
          onClick && designTokens.shadows.cardHover,
          className
        )}
      >
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p
                  className={cn(
                    designTokens.typography.body.muted,
                    'text-sm font-medium'
                  )}
                >
                  {title}
                </p>
                {Icon && (
                  <div
                    className={cn(
                      'rounded-lg p-2',
                      designTokens.colors.background.accent
                    )}
                  >
                    <Icon
                      className={cn(
                        designTokens.icons.size,
                        designTokens.colors.text.accent
                      )}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <p
                  className={cn(
                    designTokens.typography.heading.h2,
                    'text-2xl font-bold'
                  )}
                >
                  {displayValue}
                </p>
                {(change !== undefined || trend) && (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-sm font-medium',
                      getTrendColor()
                    )}
                  >
                    {getTrendIcon()}
                    {change !== undefined && (
                      <span>{Math.abs(change)}%</span>
                    )}
                    {changeLabel && (
                      <span className="text-muted-foreground">
                        {changeLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);
StatCard.displayName = 'StatCard';




