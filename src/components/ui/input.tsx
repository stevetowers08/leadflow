import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'default' | 'mobile';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'touch-manipulation', // Better touch handling
          // 2025: 16px font-size on mobile to prevent iOS zoom, responsive sizing
          'text-sm sm:text-sm',
          // Mobile: min-height 48px for better touch targets
          'min-h-[48px] sm:min-h-8',
          // Mobile variant: explicit 16px font-size
          variant === 'mobile' && 'text-base min-h-[48px]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
