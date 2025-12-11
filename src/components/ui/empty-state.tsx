import * as React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/design-system/tokens';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, action, className, size = 'default' }, ref) => {
    const sizeClasses = {
      sm: 'py-8',
      default: 'py-12',
      lg: 'py-16',
    };

    const iconSizes = {
      sm: 'h-8 w-8',
      default: 'h-12 w-12',
      lg: 'h-16 w-16',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizeClasses[size],
          className
        )}
      >
        {Icon && (
          <div
            className={cn(
              'rounded-full bg-muted p-3 mb-4',
              designTokens.transitions.normal
            )}
          >
            <Icon className={cn(iconSizes[size], 'text-muted-foreground')} />
          </div>
        )}
        <h3
          className={cn(
            designTokens.typography.heading.h3,
            'mb-2 text-foreground'
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              designTokens.typography.body.muted,
              'max-w-sm mb-6'
            )}
          >
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} size="default" variant="default">
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';




