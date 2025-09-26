/**
 * Reusable Page Components
 * Consistent page structure components
 */

import React from 'react';
import { designTokens } from './tokens';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  children 
}) => (
  <div className={designTokens.layout.pageHeader}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={designTokens.typography.heading.h2}>{title}</h1>
        {subtitle && (
          <p className={`${designTokens.typography.body.muted} ${designTokens.spacing.margin.sm}`}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  </div>
);

interface StatItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

interface StatsBarProps {
  stats: StatItemProps[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => (
  <div className={designTokens.layout.statsContainer}>
    {stats.map((stat, index) => (
      <div key={index} className={designTokens.layout.statsItem}>
        <div className={designTokens.icons.container}>
          {stat.icon}
        </div>
        <span className="font-medium">{stat.value} {stat.label}</span>
      </div>
    ))}
  </div>
);

interface LoadingStateProps {
  title: string;
  subtitle?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  title, 
  subtitle, 
  message = "Loading..." 
}) => (
  <div className="space-y-4">
    <PageHeader title={title} subtitle={subtitle} />
    <div className={designTokens.loading.container}>
      <div className={designTokens.loading.spinner}></div>
      <p className={designTokens.loading.text}>{message}</p>
    </div>
  </div>
);

// Page wrapper component
interface PageProps {
  title: string;
  subtitle?: string;
  stats?: StatItemProps[];
  children: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
}

export const Page: React.FC<PageProps> = ({ 
  title, 
  subtitle, 
  stats, 
  children, 
  loading = false,
  loadingMessage 
}) => {
  if (loading) {
    return (
      <LoadingState 
        title={title} 
        subtitle={subtitle} 
        message={loadingMessage} 
      />
    );
  }

  return (
    <div className={designTokens.layout.pageContent}>
      <PageHeader title={title} subtitle={subtitle} />
      {stats && <StatsBar stats={stats} />}
      {children}
    </div>
  );
};
