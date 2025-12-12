/**
 * Card Component - Compound Pattern Example
 * Demonstrates compound component pattern for complex components
 *
 * Usage:
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description</Card.Description>
 *   </Card.Header>
 *   <Card.Content>Content</Card.Content>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { borderTokens, shadowTokens, spacingTokens } from '@/lib/design-tokens';

// Base Card component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-lg border bg-card text-card-foreground',
          // Variant styles
          variant === 'outlined' && 'border-2',
          variant === 'elevated' && shadowTokens.semantic.elevation.level2,
          // Interactive styles
          interactive &&
            'cursor-pointer transition-all duration-200 hover:shadow-md',
          // Design tokens
          borderTokens.radius.lg,
          className
        )}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// Card Header subcomponent
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

// Card Title subcomponent
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

// Card Description subcomponent
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

// Card Content subcomponent
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  }
);
CardContent.displayName = 'CardContent';

// Card Footer subcomponent
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

// Compound component export
export const CardCompound = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

// Default export (maintains compatibility)
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
