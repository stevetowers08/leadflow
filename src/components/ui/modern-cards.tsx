import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

// Ultra-Modern Card Design System - 2025 Minimal & Sleek
// Based on: Subtle gradients, glassmorphism, soft shadows, 60-30-10 color rule

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
  hover?: boolean;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className,
  variant = 'minimal',
  hover = true,
  onClick,
}) => {
  const baseClasses = 'rounded-lg transition-all duration-300 ease-out';

  const variantClasses = {
    default: 'bg-white border border-border shadow-sm',
    elevated: 'bg-white border border-border shadow-lg shadow-gray-300/20',
    glass: 'bg-white border border-border shadow-xl shadow-gray-400/10',
    minimal: 'bg-white border border-border shadow-sm hover:shadow-md',
  };

  const hoverClasses = hover
    ? 'hover:shadow-md transition-all duration-200'
    : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
  variant = 'minimal',
}) => {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50/60',
    down: 'text-destructive bg-destructive/10/60',
    neutral: 'text-muted-foreground bg-muted/60',
  };

  return (
    <ModernCard variant={variant} className={cn('p-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* Ultra-minimal Icon Container */}
          <div className='p-2 rounded-lg bg-muted/80 border border-border'>
            <Icon className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {title}
            </p>
            <p className='text-xl font-semibold text-foreground mt-0.5'>
              {value}
            </p>
          </div>
        </div>

        {trend && trendValue && (
          <div
            className={cn(
              'px-2 py-1 rounded-md text-xs font-medium',
              trendColors[trend]
            )}
          >
            {trendValue}
          </div>
        )}
      </div>
    </ModernCard>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className,
  variant = 'minimal',
}) => {
  return (
    <ModernCard
      variant={variant}
      className={cn('p-5 cursor-pointer group', className)}
      onClick={onClick}
    >
      <div className='flex items-start gap-3'>
        {/* Minimal Icon with subtle background */}
        <div className='p-2.5 rounded-lg bg-muted border border-border group-hover:bg-gray-100 transition-all duration-200'>
          <Icon className='h-4 w-4 text-muted-foreground' />
        </div>

        <div className='flex-1'>
          <h3 className='font-medium text-foreground mb-1'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>

        {/* Subtle Arrow */}
        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <svg
            className='h-4 w-4 text-muted-foreground'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </div>
      </div>
    </ModernCard>
  );
};

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    logo?: string;
    industry?: string;
    employee_count?: number;
    lead_score?: string;
  };
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
}

export const ModernCompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onClick,
  className,
  variant = 'minimal',
}) => {
  const getScoreColor = (score?: string) => {
    switch (score?.toLowerCase()) {
      case 'high':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-muted-foreground border-border';
    }
  };

  return (
    <ModernCard
      variant={variant}
      className={cn('p-4 cursor-pointer group', className)}
      onClick={onClick}
    >
      <div className='flex items-center gap-3'>
        {/* Minimal Logo Container */}
        <div className='flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted/80 border border-border flex items-center justify-center'>
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className='w-full h-full object-contain'
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className='hidden w-6 h-6 text-muted-foreground'>
            <svg fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
            </svg>
          </div>
        </div>

        {/* Company Info */}
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-foreground truncate'>
            {company.name}
          </h3>
          <p className='text-sm text-muted-foreground truncate'>
            {company.industry}
          </p>

          {/* Minimal Badges */}
          <div className='flex items-center gap-1.5 mt-1.5'>
            {company.lead_score && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-md text-xs font-medium border',
                  getScoreColor(company.lead_score)
                )}
              >
                {company.lead_score}
              </span>
            )}
          </div>
        </div>

        {/* Contact Count */}
        {company.employee_count && (
          <div className='text-right'>
            <div className='text-sm font-medium text-foreground'>
              {company.employee_count < 1000
                ? company.employee_count.toString()
                : `${(company.employee_count / 1000).toFixed(1)}K`}
            </div>
            <div className='text-xs text-muted-foreground'>contacts</div>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

interface ListCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  logo?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
}

export const ListCard: React.FC<ListCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  logo,
  badge,
  onClick,
  className,
  variant = 'minimal',
}) => {
  return (
    <ModernCard
      variant={variant}
      className={cn(
        'p-3',
        onClick &&
          'cursor-pointer group hover:bg-gray-100 transition-colors duration-200',
        className
      )}
      onClick={onClick}
    >
      <div className='flex items-center gap-3'>
        {/* Logo or Icon */}
        {logo ? (
          <div className='flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center'>
            <img
              src={logo}
              alt={title}
              className='w-full h-full object-contain'
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className='hidden w-4 h-4 text-muted-foreground'>
              <svg fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
          </div>
        ) : Icon ? (
          <div className='p-1.5 rounded-lg bg-muted border border-border'>
            <Icon className='h-3.5 w-3.5 text-muted-foreground' />
          </div>
        ) : null}

        <div className='flex-1 min-w-0'>
          <h4 className='font-medium text-foreground truncate text-sm'>
            {title}
          </h4>
          {subtitle && (
            <p className='text-xs text-muted-foreground truncate'>{subtitle}</p>
          )}
        </div>

        {badge && <div className='flex-shrink-0'>{badge}</div>}
      </div>
    </ModernCard>
  );
};
