import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'table' | 'text' | 'custom';
  count?: number;
  className?: string;
  children?: React.ReactNode;
}

const SkeletonCard = () => (
  <div className="rounded-lg border border-border bg-white p-6 space-y-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonTable = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-2">
    <div className="flex gap-4 pb-2 border-b border-border">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-28" />
    </div>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    ))}
  </div>
);

const SkeletonText = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4',
          i === count - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

export const SkeletonLoader = React.forwardRef<
  HTMLDivElement,
  SkeletonLoaderProps
>(({ variant = 'text', count = 3, className, children }, ref) => {
  if (children) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        );
      case 'list':
        return <SkeletonList count={count} />;
      case 'table':
        return <SkeletonTable count={count} />;
      case 'text':
        return <SkeletonText count={count} />;
      case 'custom':
        return null;
      default:
        return <SkeletonText count={count} />;
    }
  };

  return (
    <div ref={ref} className={cn('animate-pulse', className)}>
      {renderSkeleton()}
    </div>
  );
});
SkeletonLoader.displayName = 'SkeletonLoader';




