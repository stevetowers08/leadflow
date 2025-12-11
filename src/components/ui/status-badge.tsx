import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge, badgeVariants } from '@/components/ui/badge';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground border-transparent',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        error: 'bg-destructive/10 text-destructive border border-destructive/20',
        info: 'bg-info/10 text-info border border-info/20',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        qualified: 'bg-success/10 text-success border border-success/20',
        proceed: 'bg-primary/10 text-primary border border-primary/20',
        skip: 'bg-muted text-muted-foreground border-transparent',
        new: 'bg-warning/10 text-warning border border-warning/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      pulse: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, pulse, children, icon: Icon, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size, pulse }), className)}
        {...props}
      >
        {Icon && <Icon className="h-3 w-3" />}
        <span>{children}</span>
      </Badge>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };

