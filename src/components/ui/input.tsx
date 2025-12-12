import * as React from 'react';

import { designTokens } from '@/design-system/tokens';
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
          'flex h-8 w-full rounded-md',
          'border border-input',
          designTokens.colors.background.primary,
          designTokens.spacing.padding.sm,
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          designTokens.transitions.focusRing,
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'touch-manipulation',
          designTokens.typography.body.default,
          'min-h-[48px] sm:min-h-8',
          variant === 'mobile' &&
            cn(designTokens.typography.body.large, 'min-h-[48px]'),
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
