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
  totalJobs: number;
  newJobsToday: number;
  expiringJobs?: number;
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
      icon: <Building2 className='h-4 w-4 text-green-600' />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Jobs',
      value: stats.totalJobs,
      icon: <Briefcase className='h-4 w-4 text-secondary' />,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'New Today',
      value: stats.newJobsToday,
      icon: <Calendar className='h-4 w-4 text-orange-600' />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mobile: 2x2 Grid */}
      <div className='grid grid-cols-2 gap-3 md:hidden'>
        {statsItems.map((item, index) => (
          <Card
            key={index}
            variant='glass'
            className={designTokens.shadows.cardStatic}
          >
            <CardContent className={designTokens.spacing.cardPadding.compact}>
              <div className='flex items-center gap-2'>
                <div className={cn('p-1.5 rounded-md', item.bgColor)}>
                  {item.icon}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='text-lg font-bold text-foreground truncate'>
                    {item.value}
                  </div>
                  <div className='text-xs text-muted-foreground truncate'>
                    {item.title}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className='hidden md:grid md:grid-cols-4 gap-4 lg:gap-6'>
        {statsItems.map((item, index) => (
          <Card
            key={index}
            variant='glass'
            className={designTokens.shadows.card}
          >
            <CardContent
              className={designTokens.spacing.cardPadding.responsive}
            >
              <div className='flex items-center gap-3 lg:gap-4'>
                <div className={cn('p-2 rounded-lg', item.bgColor)}>
                  {item.icon}
                </div>
                <div className='min-w-0'>
                  <div className='text-xl lg:text-2xl font-bold text-foreground'>
                    {item.value}
                  </div>
                  <div className='text-sm text-muted-foreground font-medium'>
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
      <div className='text-center p-2 bg-green-50 rounded-lg'>
        <div className='text-lg font-bold text-green-600'>
          {stats.totalCompanies}
        </div>
        <div className='text-xs text-green-600'>Companies</div>
      </div>
      <div className='text-center p-2 bg-secondary/10 rounded-lg'>
        <div className='text-lg font-bold text-secondary'>
          {stats.totalJobs}
        </div>
        <div className='text-xs text-secondary'>Jobs</div>
      </div>
      <div className='text-center p-2 bg-orange-50 rounded-lg'>
        <div className='text-lg font-bold text-orange-600'>
          {stats.newJobsToday}
        </div>
        <div className='text-xs text-orange-600'>New</div>
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
    jobs: { value: number; isPositive: boolean };
    newJobs: { value: number; isPositive: boolean };
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
    {
      title: 'Jobs',
      value: stats.totalJobs,
      icon: <Briefcase className='h-4 w-4' />,
      trend: trends?.jobs,
      color: 'purple',
    },
    {
      title: 'New Today',
      value: stats.newJobsToday,
      icon: <Calendar className='h-4 w-4' />,
      trend: trends?.newJobs,
      color: 'orange',
    },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6',
        className
      )}
    >
      {statsItems.map((item, index) => (
        <Card key={index} variant='glass' className={designTokens.shadows.card}>
          <CardContent className={designTokens.spacing.cardPadding.responsive}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 lg:gap-3'>
                <div
                  className={cn(
                    'p-1.5 lg:p-2 rounded-md lg:rounded-lg',
                    item.color === 'blue' && 'bg-accent/20 text-accent',
                    item.color === 'green' && 'bg-green-50 text-green-600',
                    item.color === 'purple' && 'bg-secondary/10 text-secondary',
                    item.color === 'orange' && 'bg-orange-50 text-orange-600'
                  )}
                >
                  {item.icon}
                </div>
                <div className='min-w-0'>
                  <div className='text-lg lg:text-xl font-bold text-foreground'>
                    {item.value}
                  </div>
                  <div className='text-xs lg:text-sm text-muted-foreground truncate'>
                    {item.title}
                  </div>
                </div>
              </div>
              {item.trend && (
                <div className='flex items-center gap-1 text-xs'>
                  {item.trend.isPositive ? (
                    <TrendingUp className='h-3 w-3 text-green-600' />
                  ) : (
                    <TrendingDown className='h-3 w-3 text-red-600' />
                  )}
                  <span
                    className={cn(
                      'font-medium',
                      item.trend.isPositive ? 'text-green-600' : 'text-red-600'
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
