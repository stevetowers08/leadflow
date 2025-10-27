/**
 * Enterprise CRM Card Components - 2025 Edition
 *
 * Features:
 * - Modern glassmorphism and neumorphism designs
 * - Interactive hover states and microanimations
 * - Enterprise-grade accessibility
 * - Responsive layouts optimized for data visualization
 * - Consistent with modern CRM design patterns
 */

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

// Enhanced Metric Card Component
const metricCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out group',
  {
    variants: {
      variant: {
        glass: 'bg-white border border-gray-200',
        neumorphism: 'bg-white border border-gray-200',
        elevated: 'bg-white border border-gray-200',
        gradient:
          'bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/15',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
      interactive: true,
    },
  }
);

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  loading?: boolean;
}

const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      title,
      value,
      change,
      icon: Icon,
      trend,
      loading = false,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            metricCardVariants({ variant, size, interactive }),
            className
          )}
          {...props}
        >
          <div className='animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-8 bg-gray-200 rounded w-1/2 mb-2'></div>
            <div className='h-3 bg-gray-200 rounded w-1/3'></div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          metricCardVariants({ variant, size, interactive }),
          className
        )}
        {...props}
      >
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-muted-foreground mb-1'>
              {title}
            </p>
            <p className='text-2xl font-bold text-foreground mb-2'>{value}</p>
            {change && (
              <div className='flex items-center gap-1'>
                <span
                  className={cn(
                    'text-sm font-medium',
                    change.type === 'positive' && 'text-success',
                    change.type === 'negative' && 'text-destructive',
                    change.type === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change.value}
                </span>
                {trend && (
                  <span
                    className={cn(
                      'text-xs',
                      trend === 'up' && 'text-success',
                      trend === 'down' && 'text-destructive',
                      trend === 'stable' && 'text-muted-foreground'
                    )}
                  >
                    {trend === 'up' && '↗'}
                    {trend === 'down' && '↘'}
                    {trend === 'stable' && '→'}
                  </span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className='p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors'>
              <Icon className='h-6 w-6 text-primary' />
            </div>
          )}
        </div>
      </div>
    );
  }
);
MetricCard.displayName = 'MetricCard';

// Enhanced Activity Card Component
const activityCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        glass:
          'bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/50',
        neumorphism: 'bg-[#f0f0f3] border border-gray-200',
        elevated: 'bg-white border border-gray-200',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
    },
  }
);

export interface ActivityCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof activityCardVariants> {
  title: string;
  description?: string;
  activities: Array<{
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    time: string;
    status?: 'new' | 'success' | 'warning' | 'info';
  }>;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const ActivityCard = forwardRef<HTMLDivElement, ActivityCardProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      activities,
      showViewAll = true,
      onViewAll,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(activityCardVariants({ variant, size }), className)}
        {...props}
      >
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
            {description && (
              <p className='text-sm text-muted-foreground'>{description}</p>
            )}
          </div>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
            >
              View All
            </button>
          )}
        </div>

        <div className='space-y-2'>
          {activities.map(activity => (
            <div
              key={activity.id}
              className='flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer'
            >
              <div
                className={cn(
                  'p-1.5 rounded-lg flex-shrink-0',
                  activity.status === 'new' && 'bg-primary/10',
                  activity.status === 'success' && 'bg-success/10',
                  activity.status === 'warning' && 'bg-warning/10',
                  activity.status === 'info' && 'bg-blue-100',
                  !activity.status && 'bg-gray-100'
                )}
              >
                <activity.icon
                  className={cn(
                    'h-3.5 w-3.5',
                    activity.status === 'new' && 'text-primary',
                    activity.status === 'success' && 'text-success',
                    activity.status === 'warning' && 'text-warning',
                    activity.status === 'info' && 'text-blue-600',
                    !activity.status && 'text-gray-600'
                  )}
                />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-foreground'>
                  {activity.title}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {activity.description}
                </p>
                <div className='flex items-center gap-2 mt-0.5'>
                  <span className='text-xs text-muted-foreground'>
                    {activity.time}
                  </span>
                  {activity.status && (
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        activity.status === 'new' &&
                          'bg-primary/10 text-primary',
                        activity.status === 'success' &&
                          'bg-success/10 text-success',
                        activity.status === 'warning' &&
                          'bg-warning/10 text-warning',
                        activity.status === 'info' &&
                          'bg-blue-100 text-blue-600'
                      )}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
ActivityCard.displayName = 'ActivityCard';

// Enhanced Chart Card Component
const chartCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        glass:
          'bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/50',
        neumorphism: 'bg-[#f0f0f3] border border-gray-200',
        elevated: 'bg-white border border-gray-200',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
    },
  }
);

export interface ChartCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartCardVariants> {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
}

const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      children,
      actions,
      loading = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(chartCardVariants({ variant, size }), className)}
        {...props}
      >
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
            {description && (
              <p className='text-sm text-muted-foreground'>{description}</p>
            )}
          </div>
          {actions && <div className='flex items-center gap-2'>{actions}</div>}
        </div>

        <div className='relative'>
          {loading ? (
            <div className='animate-pulse'>
              <div className='h-64 bg-gray-200 rounded-lg'></div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }
);
ChartCard.displayName = 'ChartCard';

// Enhanced Quick Actions Card Component
const quickActionsCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        glass: 'glass-light hover:bg-white/20',
        neumorphism: 'neumorphism-light hover:shadow-lg',
        elevated: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'neumorphism',
      size: 'md',
    },
  }
);

export interface QuickActionsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof quickActionsCardVariants> {
  title: string;
  actions: Array<{
    id: string;
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'secondary';
  }>;
}

const QuickActionsCard = forwardRef<HTMLDivElement, QuickActionsCardProps>(
  ({ className, variant, size, title, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(quickActionsCardVariants({ variant, size }), className)}
        {...props}
      >
        <h3 className='text-lg font-semibold text-foreground mb-4'>{title}</h3>
        <div className='space-y-3'>
          {actions.map(action => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                action.variant === 'primary' &&
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                action.variant === 'secondary' &&
                  'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                !action.variant && 'bg-white/50 hover:bg-white/70 text-gray-700'
              )}
            >
              <action.icon className='h-4 w-4' />
              <span className='text-sm font-medium'>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);
QuickActionsCard.displayName = 'QuickActionsCard';

// Enhanced Performance Card Component
const performanceCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        glass: 'glass-light hover:bg-white/20',
        neumorphism: 'neumorphism-light hover:shadow-lg',
        elevated: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'neumorphism',
      size: 'md',
    },
  }
);

export interface PerformanceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof performanceCardVariants> {
  title: string;
  metrics: Array<{
    id: string;
    label: string;
    value: number;
    max?: number;
    color?: 'primary' | 'success' | 'warning' | 'info';
  }>;
}

const PerformanceCard = forwardRef<HTMLDivElement, PerformanceCardProps>(
  ({ className, variant, size, title, metrics, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(performanceCardVariants({ variant, size }), className)}
        {...props}
      >
        <h3 className='text-lg font-semibold text-foreground mb-4'>{title}</h3>
        <div className='space-y-4'>
          {metrics.map(metric => {
            const percentage = metric.max
              ? (metric.value / metric.max) * 100
              : metric.value;
            return (
              <div key={metric.id} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    {metric.label}
                  </span>
                  <span className='text-sm font-medium text-foreground'>
                    {metric.value}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-500',
                      metric.color === 'primary' &&
                        'bg-gradient-to-r from-primary to-primary/80',
                      metric.color === 'success' &&
                        'bg-gradient-to-r from-success to-success/80',
                      metric.color === 'warning' &&
                        'bg-gradient-to-r from-warning to-warning/80',
                      metric.color === 'info' &&
                        'bg-gradient-to-r from-blue-500 to-blue-400',
                      !metric.color &&
                        'bg-gradient-to-r from-primary to-secondary'
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
PerformanceCard.displayName = 'PerformanceCard';

export {
  ActivityCard,
  activityCardVariants,
  ChartCard,
  chartCardVariants,
  MetricCard,
  metricCardVariants,
  PerformanceCard,
  performanceCardVariants,
  QuickActionsCard,
  quickActionsCardVariants,
};
