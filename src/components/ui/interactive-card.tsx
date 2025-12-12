import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { designTokens } from '@/design-system/tokens';
import { LucideIcon } from 'lucide-react';

export interface InteractiveCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  InteractiveCardProps
>(
  (
    {
      title,
      description,
      icon: Icon,
      onClick,
      hover = true,
      selected = false,
      loading = false,
      children,
      footer,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const isInteractive = !!onClick;

    const variantClasses = {
      default: designTokens.shadows.card,
      elevated: designTokens.shadows.lg,
      outlined: 'shadow-none border-2',
    };

    return (
      <Card
        ref={ref}
        variant={variant}
        interactive={isInteractive}
        onClick={onClick}
        className={cn(
          variantClasses[variant],
          isInteractive && 'cursor-pointer',
          hover && isInteractive && designTokens.shadows.cardHover,
          selected && 'ring-2 ring-primary ring-offset-2',
          loading && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        {(title || description || Icon) && (
          <Card.Header>
            <div className='flex items-start gap-3'>
              {Icon && (
                <div
                  className={cn(
                    'rounded-lg p-2 flex-shrink-0',
                    designTokens.colors.background.accent
                  )}
                >
                  <Icon
                    className={cn(
                      designTokens.icons.sizeLg,
                      designTokens.colors.text.accent
                    )}
                    aria-hidden='true'
                  />
                </div>
              )}
              <div className='flex-1 min-w-0'>
                {title && (
                  <Card.Title className='text-base font-semibold'>
                    {title}
                  </Card.Title>
                )}
                {description && (
                  <Card.Description className='mt-1'>
                    {description}
                  </Card.Description>
                )}
              </div>
            </div>
          </Card.Header>
        )}
        {children && <Card.Content>{children}</Card.Content>}
        {footer && <div className={cn('px-6 pb-6 pt-0')}>{footer}</div>}
      </Card>
    );
  }
);
InteractiveCard.displayName = 'InteractiveCard';
