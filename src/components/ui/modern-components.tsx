/**
 * Modern UI Components with Glassmorphism and Neumorphism Effects
 *
 * Implements 2025 design trends:
 * - Glassmorphism with backdrop blur and transparency
 * - Neumorphism with soft shadows and highlights
 * - Smooth microinteractions and animations
 * - Modern accessibility standards
 * - Compatible with existing CSS variable system
 */

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

// Glassmorphism Card Component
const glassCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        light: 'glass-light',
        dark: 'glass-dark',
        primary: 'glass-primary',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
      shadow: {
        none: '',
        sm: 'shadow-glass-light',
        md: 'shadow-glass-dark',
        lg: 'shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'md',
      shadow: 'md',
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, variant, size, shadow, hover = true, glow = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, size, shadow }),
          hover && 'hover:shadow-xl',
          glow &&
            'before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = 'GlassCard';

// Neumorphism Card Component
const neumorphismCardVariants = cva(
  'relative transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        light: 'neumorphism-light',
        dark: 'neumorphism-dark',
        pressed: 'neumorphism-pressed',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-lg',
        lg: 'p-8 rounded-lg',
      },
      interactive: {
        true: 'hover:shadow-lg active:shadow-neumorphism-pressed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'md',
      interactive: true,
    },
  }
);

export interface NeumorphismCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neumorphismCardVariants> {}

const NeumorphismCard = forwardRef<HTMLDivElement, NeumorphismCardProps>(
  ({ className, variant, size, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          neumorphismCardVariants({ variant, size, interactive }),
          className
        )}
        {...props}
      />
    );
  }
);
NeumorphismCard.displayName = 'NeumorphismCard';

// Modern Button Component with Glassmorphism
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-xl',
        glass: 'glass-light text-white hover:bg-white/20 hover:border-white/30',
        neumorphism:
          'neumorphism-light text-gray-700 hover:shadow-lg active:shadow-neumorphism-pressed',
        ghost: 'text-primary hover:bg-primary-light',
        outline:
          'border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-8 w-8',
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// Modern Input Component
const inputVariants = cva(
  'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-primary focus:ring-primary',
        glass:
          'glass-light text-white placeholder:text-white/70 focus:border-white/40 focus:ring-white/20',
        neumorphism: 'neumorphism-light focus:shadow-lg focus:bg-white',
      },
      size: {
        default: 'h-10',
        sm: 'h-9 px-2 text-xs',
        lg: 'h-11 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Modern Card Components
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 hover:shadow-md',
        glass: 'glass-light hover:bg-white/20',
        neumorphism: 'neumorphism-light hover:shadow-lg',
        elevated: 'bg-white border-gray-200 shadow-lg hover:shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<
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

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Modern Badge Component
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        glass: 'glass-light text-white',
        neumorphism: 'neumorphism-light text-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

// Modern Avatar Component
const avatarVariants = cva(
  'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
      variant: {
        default: 'bg-gray-100',
        glass: 'glass-light',
        neumorphism: 'neumorphism-light',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, className }))}
        {...props}
      />
    );
  }
);
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  avatarVariants,
  Badge,
  badgeVariants,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
  GlassCard,
  Input,
  inputVariants,
  NeumorphismCard,
};
