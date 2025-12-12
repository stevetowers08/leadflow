import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { designTokens } from '@/design-system/tokens';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation',
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary text-primary-foreground hover:bg-primary-hover',
          designTokens.shadows.button
        ),
        destructive: cn(
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
          designTokens.shadows.button
        ),
        outline: cn(
          designTokens.borders.default,
          'bg-background hover:bg-accent hover:text-accent-foreground'
        ),
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        actionbar: cn(
          designTokens.borders.default,
          'bg-background hover:bg-accent hover:text-accent-foreground'
        ),
        danger: cn(
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
          designTokens.shadows.button
        ),
        success: cn(
          'bg-success text-success-foreground hover:bg-success-hover',
          designTokens.shadows.button
        ),
        warning: cn(
          'bg-warning text-warning-foreground hover:bg-warning-hover',
          designTokens.shadows.button
        ),
      },
      size: {
        default:
          'h-8 px-3 py-1.5 text-sm min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0', // Mobile: 48px min, Desktop: 32px
        sm: 'h-8 px-2.5 py-1 text-xs min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0', // Mobile: 48px min, Desktop: 32px
        xs: 'h-8 px-2 py-1 text-xs min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0', // Mobile: 48px min, Desktop: 32px
        lg: 'h-11 px-8 text-base min-h-[52px]', // Large button for CTAs - 52px on mobile
        icon: 'h-8 w-8 min-h-[48px] min-w-[48px] sm:min-h-8 sm:min-w-8', // Icon button - 48px on mobile, 32px on desktop
        mobile: 'h-12 px-4 py-3 text-base min-h-[48px]', // Mobile-optimized size for touch
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
