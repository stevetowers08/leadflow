import * as React from 'react';
import { cn } from '@/lib/utils';

// Lightweight fallback tooltip to avoid Radix optimize errors during dev
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;

export const Tooltip: React.FC<
  { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
> = ({ children }) => <>{children}</>;

export const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    hidden?: boolean;
  }
>(({ className, hidden, children, ...props }, ref) =>
  hidden ? null : (
    <div
      ref={ref}
      role='tooltip'
      className={cn(
        'z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TooltipContent.displayName = 'TooltipContent';
