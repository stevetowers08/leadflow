/**
 * Reusable Page Components
 * Consistent page structure components
 */

import React from 'react';
import { designTokens } from './tokens';

interface PageHeaderProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  count,
  children 
}) => (
  <div className="mb-3">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {count !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {count.toLocaleString()} total
          </p>
        )}
      </div>
      {children}
    </div>
  </div>
);

interface StatItemProps {
  icon: React.ComponentType<any>;
  value: number | string;
  label: string;
  trend?: number | null;
}

interface StatsBarProps {
  stats: StatItemProps[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => (
  <div className={designTokens.layout.statsContainer}>
    {stats.map((stat, index) => {
      const IconComponent = stat.icon;
      return (
        <div key={index} className={designTokens.layout.statsItem}>
          <div className={designTokens.icons.container}>
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="font-medium">{stat.value} {stat.label}</span>
        </div>
      );
    })}
  </div>
);

interface LoadingStateProps {
  title: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  title, 
  message = "Loading..." 
}) => (
  <div className="space-y-4">
    <PageHeader title={title} />
    <div className={designTokens.loading.container}>
      <div className={designTokens.loading.spinner}></div>
      <p className={designTokens.loading.text}>{message}</p>
    </div>
  </div>
);

// Page wrapper component
interface PageProps {
  title: string;
  stats?: StatItemProps[];
  children: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
}

export const Page: React.FC<PageProps> = ({ 
  title, 
  stats, 
  children, 
  loading = false,
  loadingMessage 
}) => {
  if (loading) {
    return (
      <LoadingState 
        title={title} 
        message={loadingMessage} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {stats && (
              <div className="flex items-center gap-4 mt-1 text-sm">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-1 text-muted-foreground">
                      <IconComponent className="h-3 w-3" />
                      <span className="font-semibold">{stat.value}</span>
                      <span>{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
