import * as React from 'react';

import { designTokens } from '@/design-system/tokens';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?:
      | 'default'
      | 'elevated'
      | 'outlined'
      | 'glass'
      | 'minimal'
      | 'floating'
      | 'glow'
      | 'soft';
    interactive?: boolean;
    animation?: 'none' | 'fade' | 'slide' | 'scale' | 'lift';
  }
>(
  (
    {
      className,
      variant = 'minimal',
      interactive,
      animation = 'fade',
      ...props
    },
    ref
  ) => {
    const hasClickHandler = props.onClick !== undefined;
    const isInteractive =
      interactive !== undefined ? interactive : hasClickHandler;

    const baseStyles = cn(
      'rounded-lg',
      designTokens.borders.card,
      designTokens.transitions.normal
    );

    const interactiveStyles = isInteractive
      ? cn(
          'cursor-pointer',
          designTokens.shadows.cardHover,
          'hover:border-border',
          animation === 'lift' && designTokens.animations.hoverLift,
          animation === 'scale' && designTokens.animations.hoverScale,
          animation === 'fade' && 'hover:opacity-90'
        )
      : designTokens.shadows.cardStatic;

    const animationStyles = {
      none: '',
      fade: designTokens.animations.fadeIn,
      slide: designTokens.animations.slideUp,
      scale: designTokens.animations.scaleIn,
      lift: '',
    };

    const variants = {
      default: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.sm,
        interactiveStyles,
        animationStyles[animation]
      ),
      elevated: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.cardElevated,
        interactiveStyles,
        animationStyles[animation]
      ),
      outlined: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.sm,
        'border-2',
        interactiveStyles,
        animationStyles[animation]
      ),
      glass: cn(
        baseStyles,
        designTokens.colors.background.primary,
        'backdrop-blur-sm bg-white/80',
        designTokens.shadows.xl,
        'hover:shadow-2xl',
        interactiveStyles,
        animationStyles[animation]
      ),
      minimal: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.sm,
        interactiveStyles,
        animationStyles[animation]
      ),
      floating: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.cardFloating,
        interactiveStyles,
        animationStyles[animation]
      ),
      glow: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.cardGlow,
        interactiveStyles,
        animationStyles[animation]
      ),
      soft: cn(
        baseStyles,
        designTokens.colors.background.primary,
        designTokens.shadows.soft,
        'hover:shadow-md',
        interactiveStyles,
        animationStyles[animation]
      ),
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5',
      designTokens.spacing.cardPadding.default,
      className
    )}
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
    className={cn(designTokens.typography.heading.h3, className)}
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

// Compound component pattern (2025 best practice)
const CardRoot = Card as typeof Card & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};
CardRoot.Header = CardHeader;
CardRoot.Title = CardTitle;
CardRoot.Description = CardDescription;
CardRoot.Content = CardContent;
CardRoot.Footer = CardFooter;

// Export compound component as default, individual components for backward compatibility
export {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
