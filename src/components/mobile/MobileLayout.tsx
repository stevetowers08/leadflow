/**
 * Mobile-Optimized Layout Component
 * Provides better mobile experience with improved spacing and touch targets
 */

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  padding = 'md',
  spacing = 'md',
}) => {
  const isMobile = useIsMobile();

  const paddingClasses = {
    none: '',
    sm: isMobile ? 'p-2' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-6' : 'p-8',
  };

  const spacingClasses = {
    none: '',
    sm: isMobile ? 'space-y-2' : 'space-y-3',
    md: isMobile ? 'space-y-4' : 'space-y-6',
    lg: isMobile ? 'space-y-6' : 'space-y-8',
  };

  return (
    <div
      className={cn(
        'min-h-[100dvh] bg-muted',
        paddingClasses[padding],
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className,
  maxWidth = 'full',
  centered = false,
}) => {
  const isMobile = useIsMobile();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: '',
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileGridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  className,
  cols = 1,
  gap = 'md',
  responsive = true,
}) => {
  const isMobile = useIsMobile();

  const gapClasses = {
    sm: isMobile ? 'gap-2' : 'gap-3',
    md: isMobile ? 'gap-3' : 'gap-4',
    lg: isMobile ? 'gap-4' : 'gap-6',
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    5: responsive
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-5',
    6: responsive
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      : 'grid-cols-6',
  };

  return (
    <div className={cn('grid', gridClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
};

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'sm',
  interactive = false,
  onClick,
}) => {
  const isMobile = useIsMobile();

  const paddingClasses = {
    sm: isMobile ? 'p-3' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-6' : 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-border',
        paddingClasses[padding],
        shadowClasses[shadow],
        interactive && 'cursor-pointer hover:shadow-md transition-shadow',
        onClick && 'cursor-pointer hover:bg-muted transition-colors',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface MobileButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
}) => {
  const isMobile = useIsMobile();

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-border/60 text-foreground hover:bg-muted',
    ghost: 'text-foreground hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm',
    md: isMobile ? 'px-4 py-3 text-sm' : 'px-6 py-3 text-base',
    lg: isMobile ? 'px-6 py-4 text-base' : 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'min-h-[44px] min-w-[44px]', // Minimum touch target size
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface MobileInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  disabled?: boolean;
  error?: boolean;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  type = 'text',
  disabled = false,
  error = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'w-full rounded-lg border border-border/60 px-3 py-3 text-base', // 16px font-size to prevent zoom
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
        isMobile && 'min-h-[48px]', // Minimum touch target size
        className
      )}
    />
  );
};

interface MobileTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
}

export const MobileTextarea: React.FC<MobileTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className,
  rows = 3,
  disabled = false,
  error = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={cn(
        'w-full rounded-lg border border-border/60 px-3 py-3 text-base resize-vertical',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
        isMobile && 'min-h-[48px]',
        className
      )}
    />
  );
};

interface MobileSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export const MobileSelect: React.FC<MobileSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled = false,
  error = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'w-full rounded-lg border border-border/60 px-3 py-3 text-base bg-white',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
        isMobile && 'min-h-[48px]',
        className
      )}
    >
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Components are already exported above, no need to re-export
