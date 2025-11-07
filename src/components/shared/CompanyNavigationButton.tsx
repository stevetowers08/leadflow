import React from 'react';
import {
  Building2,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyNavigationButtonProps {
  companyName: string;
  companyId: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'minimal' | 'ghost' | 'link' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  showArrow?: boolean;
}

export const CompanyNavigationButton: React.FC<
  CompanyNavigationButtonProps
> = ({
  companyName,
  companyId,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  showArrow = true,
}) => {
  const baseClasses =
    'inline-flex items-center gap-2 font-medium transition-all duration-200';

  const variantClasses = {
    primary:
      'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm hover:shadow-md',
    secondary:
      'bg-muted text-muted-foreground hover:bg-muted/80 border border-border',
    minimal:
      'text-sidebar-primary hover:text-sidebar-primary/80 hover:bg-sidebar-primary/10',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
    link: 'text-sidebar-primary hover:text-sidebar-primary/80 underline-offset-4 hover:underline',
    subtle: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-2.5 text-base rounded-xl',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      title={`View ${companyName} details`}
    >
      {showIcon && (
        <Building2 className={cn(iconSizes[size], 'flex-shrink-0')} />
      )}
      <span className='truncate'>{companyName}</span>
      {showArrow && (
        <ChevronRight className={cn(iconSizes[size], 'flex-shrink-0')} />
      )}
    </button>
  );
};

// Subtle inline link version
export const CompanyNavigationLink: React.FC<
  Omit<CompanyNavigationButtonProps, 'size' | 'showArrow' | 'showIcon'>
> = ({ companyName, companyId, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-sidebar-primary hover:text-sidebar-primary/80 underline-offset-4 hover:underline transition-colors duration-200 text-sm font-medium',
        className
      )}
      title={`View ${companyName} details`}
    >
      {companyName}
    </button>
  );
};

// Ghost button version - very subtle
export const CompanyNavigationGhost: React.FC<
  Omit<CompanyNavigationButtonProps, 'size' | 'showArrow'>
> = ({ companyName, companyId, onClick, className = '', showIcon = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200',
        className
      )}
      title={`View ${companyName} details`}
    >
      {showIcon && <Building2 className='h-3 w-3 flex-shrink-0' />}
      <span className='truncate'>{companyName}</span>
    </button>
  );
};

// Minimalist text-only version
export const CompanyNavigationText: React.FC<
  Omit<CompanyNavigationButtonProps, 'size' | 'showArrow' | 'showIcon'>
> = ({ companyName, companyId, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium',
        className
      )}
      title={`View ${companyName} details`}
    >
      {companyName}
    </button>
  );
};

// Pill-style version for inline text (updated to be more subtle)
export const CompanyNavigationPill: React.FC<
  Omit<CompanyNavigationButtonProps, 'size' | 'showArrow'>
> = ({ companyName, companyId, onClick, className = '', showIcon = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-muted-foreground bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200',
        className
      )}
      title={`View ${companyName} details`}
    >
      {showIcon && <Building2 className='h-3 w-3 flex-shrink-0' />}
      <span className='truncate'>{companyName}</span>
    </button>
  );
};
