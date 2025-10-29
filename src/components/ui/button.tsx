import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md', // Darker blue hover for primary actions only
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover shadow-sm hover:shadow-md',
        outline:
          'border border-border bg-background hover:bg-gray-100 transition-colors', // Unified gray-100 hover
        secondary:
          'bg-gray-100 text-foreground hover:bg-gray-200 transition-colors', // Medium gray hover
        ghost: 'text-foreground hover:bg-gray-100 transition-colors', // Unified gray-100 hover for subtle actions
        link: 'text-primary underline-offset-4 hover:underline',
        actionbar:
          'border border-border bg-background hover:bg-gray-100 transition-colors', // Unified gray-100 hover to match dropdowns
        danger:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover shadow-sm hover:shadow-md', // Alias for destructive
        success:
          'bg-success text-success-foreground hover:bg-success-hover shadow-sm hover:shadow-md',
        warning:
          'bg-warning text-warning-foreground hover:bg-warning-hover shadow-sm hover:shadow-md',
      },
      size: {
        default: 'h-8 px-3 py-1.5 text-sm', // h-8 (32px) - standard height for all action elements
        sm: 'h-8 px-2.5 py-1 text-xs', // h-8 with reduced padding
        xs: 'h-8 px-2 py-1 text-xs', // h-8 minimal padding
        lg: 'h-11 px-8 text-base', // Large button for CTAs
        icon: 'h-8 w-8', // Icon button - h-8 to match action bar height
        mobile: 'h-12 px-4 py-3 text-base', // Mobile-optimized size for touch
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
