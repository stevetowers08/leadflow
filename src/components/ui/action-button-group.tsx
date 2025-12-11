import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { designTokens } from '@/design-system/tokens';
import { LucideIcon } from 'lucide-react';

export interface ActionButton {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export interface ActionButtonGroupProps {
  actions: ActionButton[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export const ActionButtonGroup = React.forwardRef<
  HTMLDivElement,
  ActionButtonGroupProps
>(
  (
    {
      actions,
      orientation = 'horizontal',
      size = 'default',
      className,
      align = 'end',
    },
    ref
  ) => {
    const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-2',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          alignClasses[align],
          className
        )}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size={size}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={cn(
                designTokens.transitions.fast,
                action.loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {action.loading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                Icon && <Icon className="h-4 w-4" />
              )}
              {action.label}
            </Button>
          );
        })}
      </div>
    );
  }
);
ActionButtonGroup.displayName = 'ActionButtonGroup';




