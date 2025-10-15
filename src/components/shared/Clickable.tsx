import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Enhanced clickable component following best practices:
 * - Accessibility compliance (ARIA attributes, keyboard navigation)
 * - Performance optimization (memoization, event handling)
 * - Consistent styling and behavior
 * - Type safety
 */

export interface ClickableProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'subtle' | 'card';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Clickable = forwardRef<HTMLDivElement, ClickableProps>(
  (
    {
      onClick,
      onKeyDown,
      disabled = false,
      loading = false,
      variant = 'default',
      size = 'md',
      children,
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || loading) return;
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || loading) return;

      // Handle Enter and Space keys for accessibility
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(event as any);
      }

      onKeyDown?.(event);
    };

    const baseClasses =
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

    const variantClasses = {
      default: 'cursor-pointer hover:bg-gray-50 transition-colors duration-200',
      subtle: 'cursor-pointer hover:bg-gray-25 transition-colors duration-200',
      card: 'cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200 rounded-lg border border-gray-200 hover:border-gray-300',
    };

    const sizeClasses = {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    };

    const disabledClasses =
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <div
        ref={ref}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || loading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          disabledClasses,
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Clickable.displayName = 'Clickable';

export { Clickable };
