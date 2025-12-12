import * as React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/design-system/tokens';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-2xl',
  default: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'default', padding = true, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full mx-auto',
          sizeClasses[size],
          padding && designTokens.spacing.pagePadding.responsive,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

const spacingClasses = {
  none: '',
  sm: 'py-4',
  default: 'py-8',
  lg: 'py-12',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ spacing = 'default', children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = 'Section';





