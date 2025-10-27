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
          'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover shadow-sm hover:shadow-md',
        outline:
          'border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm hover:shadow-md',
        ghost: 'text-primary hover:bg-primary-light',
        link: 'text-primary underline-offset-4 hover:underline',
        danger:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover shadow-sm hover:shadow-md', // Alias for destructive
        success:
          'bg-success text-success-foreground hover:bg-success-hover shadow-sm hover:shadow-md',
        warning:
          'bg-warning text-warning-foreground hover:bg-warning-hover shadow-sm hover:shadow-md',
      },
      size: {
        default: 'h-10 px-4 py-2', // Standard button height
        sm: 'h-9 rounded-md px-3', // Small button height
        xs: 'h-8 px-2 text-xs', // Extra small - matches our action element standard
        lg: 'h-11 rounded-md px-8', // Large button height
        icon: 'h-8 w-8', // Icon button - matches our action element standard
        mobile: 'h-12 px-4 py-3 text-base', // Mobile-optimized size
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
