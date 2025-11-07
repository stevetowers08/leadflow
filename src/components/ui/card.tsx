import * as React from 'react';

import { designTokens } from '@/design-system/tokens';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'minimal';
    interactive?: boolean; // Only apply scale effects when explicitly interactive
  }
>(({ className, variant = 'minimal', interactive, ...props }, ref) => {
  // Check if card has click handler or is explicitly marked as interactive
  const hasClickHandler = props.onClick !== undefined;
  const isInteractive =
    interactive !== undefined ? interactive : hasClickHandler;

  const baseStyles =
    'rounded-lg border border-border transition-all duration-200 ease-out';
  const interactiveStyles = isInteractive
    ? 'cursor-pointer hover:shadow-md'
    : 'hover:shadow-md';

  const variants = {
    default: `${baseStyles} bg-white shadow-sm ${interactiveStyles}`,
    elevated: `${baseStyles} bg-white shadow-lg shadow-gray-300/20 hover:shadow-xl ${interactiveStyles}`,
    outlined: `${baseStyles} bg-white shadow-sm ${interactiveStyles}`,
    glass: `${baseStyles} bg-white shadow-xl shadow-gray-400/10 hover:shadow-2xl ${interactiveStyles}`,
    minimal: `${baseStyles} bg-white shadow-sm ${interactiveStyles}`,
  };

  return (
    <div ref={ref} className={cn(variants[variant], className)} {...props} />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(designTokens.typography.body.muted, className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(designTokens.spacing.cardPadding.default, 'pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center',
      designTokens.spacing.cardPadding.default,
      'pt-0',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
