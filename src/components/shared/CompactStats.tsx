/**
 * Compact Stats Component for Mobile Dashboard
 * Optimized for mobile screens with essential metrics only
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Building2,
  Briefcase,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/design-system/tokens';

interface StatsData {
  totalLeads: number;
  totalCompanies: number;
}

interface CompactStatsProps {
  stats: StatsData;
  className?: string;
}

export const CompactStats: React.FC<CompactStatsProps> = ({
  stats,
  className,
}) => {
  const statsItems = [
    {
      title: 'Leads',
      value: stats.totalLeads,
      icon: <Users className='h-4 w-4 text-primary' />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Companies',
      value: stats.totalCompanies,
      icon: <Building2 className='h-4 w-4 text-success' />,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className={cn(designTokens.spacing.section, className)}>
      {/* Mobile: 2x2 Grid */}
      <div
        className={cn('grid grid-cols-2 md:hidden', designTokens.spacing.md)}
      >
        {statsItems.map((item, index) => (
          <Card key={index} className={designTokens.shadows.cardStatic}>
            <CardContent className={designTokens.spacing.cardPadding.compact}>
              <div className={cn('flex items-center', designTokens.spacing.sm)}>
                <div
                  className={cn(
                    designTokens.spacing.padding.xs,
                    'rounded-md',
                    item.bgColor
                  )}
                >
                  {item.icon}
                </div>
                <div className='min-w-0 flex-1'>
                  <div
                    className={cn(
                      designTokens.typography.heading.h4,
                      'font-bold text-foreground truncate'
                    )}
                  >
                    {item.value}
                  </div>
                  <div
                    className={cn(
                      designTokens.typography.body.small,
                      'truncate'
                    )}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div
        className={cn(
          'hidden md:grid md:grid-cols-4',
          designTokens.spacing.lg,
          `lg:${designTokens.spacing.xl}`
        )}
      >
        {statsItems.map((item, index) => (
          <Card key={index} className={designTokens.shadows.card}>
            <CardContent
              className={designTokens.spacing.cardPadding.responsive}
            >
              <div
                className={cn(
                  'flex items-center',
                  designTokens.spacing.md,
                  `lg:${designTokens.spacing.lg}`
                )}
              >
                <div
                  className={cn(
                    designTokens.spacing.padding.sm,
                    'rounded-lg',
                    item.bgColor
                  )}
                >
                  {item.icon}
                </div>
                <div className='min-w-0'>
                  <div
                    className={cn(
                      designTokens.typography.heading.h2,
                      'lg:text-2xl font-bold text-foreground'
                    )}
                  >
                    {item.value}
                  </div>
                  <div
                    className={cn(
                      designTokens.typography.body.default,
                      'font-medium'
                    )}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Ultra-compact stats for very small screens
interface UltraCompactStatsProps {
  stats: StatsData;
  className?: string;
}

export const UltraCompactStats: React.FC<UltraCompactStatsProps> = ({
  stats,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      <div className='text-center p-2 bg-primary/10 rounded-lg'>
        <div className='text-lg font-bold text-primary'>{stats.totalLeads}</div>
        <div className='text-xs text-primary'>Leads</div>
      </div>
      <div
        className={cn(
          'text-center',
          designTokens.spacing.padding.sm,
          designTokens.colors.background.success,
          'rounded-lg'
        )}
      >
        <div className='text-lg font-bold text-success'>
          {stats.totalCompanies}
        </div>
        <div className='text-xs text-success'>Companies</div>
      </div>
    </div>
  );
};

// Stats with trends
interface StatsWithTrendsProps {
  stats: StatsData;
  trends?: {
    leads: { value: number; isPositive: boolean };
    companies: { value: number; isPositive: boolean };
  };
  className?: string;
}

export const StatsWithTrends: React.FC<StatsWithTrendsProps> = ({
  stats,
  trends,
  className,
}) => {
  const statsItems = [
    {
      title: 'Leads',
      value: stats.totalLeads,
      icon: <Users className='h-4 w-4' />,
      trend: trends?.leads,
      color: 'blue',
    },
    {
      title: 'Companies',
      value: stats.totalCompanies,
      icon: <Building2 className='h-4 w-4' />,
      trend: trends?.companies,
      color: 'green',
    },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-2 lg:grid-cols-4',
        designTokens.spacing.md,
        `lg:${designTokens.spacing.xl}`,
        className
      )}
    >
      {statsItems.map((item, index) => (
        <Card key={index} className={designTokens.shadows.card}>
          <CardContent className={designTokens.spacing.cardPadding.responsive}>
            <div className='flex items-center justify-between'>
              <div
                className={cn(
                  'flex items-center',
                  designTokens.spacing.sm,
                  `lg:${designTokens.spacing.md}`
                )}
              >
                <div
                  className={cn(
                    designTokens.spacing.padding.xs,
                    `lg:${designTokens.spacing.padding.sm}`,
                    'rounded-md lg:rounded-lg',
                    item.color === 'blue' &&
                      designTokens.colors.combinations.primary,
                    item.color === 'green' &&
                      designTokens.colors.combinations.success,
                    item.color === 'purple' &&
                      designTokens.colors.combinations.primary,
                    item.color === 'orange' &&
                      designTokens.colors.combinations.warning
                  )}
                >
                  {item.icon}
                </div>
                <div className='min-w-0'>
                  <div
                    className={cn(
                      designTokens.typography.heading.h4,
                      'lg:text-xl font-bold text-foreground'
                    )}
                  >
                    {item.value}
                  </div>
                  <div
                    className={cn(
                      designTokens.typography.body.small,
                      'lg:text-sm truncate'
                    )}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
              {item.trend && (
                <div
                  className={cn(
                    'flex items-center',
                    designTokens.spacing.xs,
                    designTokens.typography.body.small
                  )}
                >
                  {item.trend.isPositive ? (
                    <TrendingUp
                      className={cn(
                        designTokens.icons.sizeSm,
                        designTokens.colors.text.success
                      )}
                    />
                  ) : (
                    <TrendingDown
                      className={cn(
                        designTokens.icons.sizeSm,
                        designTokens.colors.text.error
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'font-medium',
                      item.trend.isPositive
                        ? designTokens.colors.text.success
                        : designTokens.colors.text.error
                    )}
                  >
                    {Math.abs(item.trend.value)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompactStats;
