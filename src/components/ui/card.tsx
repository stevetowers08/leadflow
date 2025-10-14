import * as React from "react";

import { designTokens } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'minimal' }>(({ className, variant = 'minimal', ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.01]",
    elevated: "bg-white border border-gray-200 shadow-lg shadow-gray-300/20 rounded-2xl transition-all duration-200 ease-out hover:shadow-xl hover:scale-[1.01]",
    outlined: "bg-white border border-gray-300 shadow-sm rounded-2xl transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.01]",
    glass: "bg-white border border-gray-200 shadow-xl shadow-gray-400/10 rounded-2xl transition-all duration-200 ease-out hover:shadow-2xl hover:scale-[1.01]",
    minimal: "bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.01]"
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
    <h3 ref={ref} className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
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

