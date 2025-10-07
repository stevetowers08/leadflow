import * as React from "react";

import { designTokens } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'elevated' | 'outlined' | 'glass' }>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: cn("rounded-lg", designTokens.borders.card, "bg-card text-card-foreground", designTokens.shadows.card),
    elevated: cn("rounded-lg", designTokens.borders.card, "bg-card text-card-foreground", designTokens.shadows.md, designTokens.shadows.cardHover),
    outlined: cn("rounded-lg", designTokens.borders.strong, "bg-card text-card-foreground", designTokens.shadows.card),
    glass: cn("rounded-lg", designTokens.borders.card, "bg-white/80 backdrop-blur-sm text-card-foreground", designTokens.shadows.card)
  };
  
  return (
    <div ref={ref} className={cn(variants[variant], className)} {...props} />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(designTokens.typography.heading.h1, className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(designTokens.typography.body.muted, className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(designTokens.spacing.cardPadding.default, "pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center", designTokens.spacing.cardPadding.default, "pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

