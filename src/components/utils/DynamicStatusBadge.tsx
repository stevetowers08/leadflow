import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  getStatusInfo,
  JobStatus,
  CompanyStatus,
} from '@/utils/statusCalculator';
import { Loader2 } from 'lucide-react';

interface DynamicStatusBadgeProps {
  status: JobStatus | CompanyStatus;
  leadCount?: number;
  isLoading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLeadCount?: boolean;
}

const sizeStyles = {
  sm: 'text-xs px-2 py-1 font-medium min-w-24 text-center',
  md: 'text-sm px-2.5 py-1 font-medium min-w-28 text-center',
  lg: 'text-sm px-3 py-1.5 font-medium min-w-32 text-center',
};

export const DynamicStatusBadge: React.FC<DynamicStatusBadgeProps> = ({
  status,
  leadCount = 0,
  isLoading = false,
  className,
  size = 'md',
  showLeadCount = false,
}) => {
  const statusInfo = getStatusInfo(status);

  if (isLoading) {
    return (
      <Badge
        variant='outline'
        className={cn(
          'border transition-colors duration-200 font-medium justify-center',
          'bg-slate-50 text-slate-700 border-slate-200',
          sizeStyles[size],
          className
        )}
      >
        <Loader2 className='h-3 w-3 animate-spin mr-1' />
        Loading...
      </Badge>
    );
  }

  return (
    <div className='flex flex-col items-center gap-1'>
      <Badge
        variant='outline'
        className={cn(
          'border transition-colors duration-200 font-medium justify-center',
          statusInfo.color,
          sizeStyles[size],
          className
        )}
        title={statusInfo.description}
      >
        {statusInfo.label}
      </Badge>
      {showLeadCount && (
        <span className='text-[10px] text-muted-foreground'>
          {leadCount} lead{leadCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

interface StatusWithLeadCountProps {
  status: JobStatus | CompanyStatus;
  leadCount: number;
  isLoading?: boolean;
  className?: string;
}

export const StatusWithLeadCount: React.FC<StatusWithLeadCountProps> = ({
  status,
  leadCount,
  isLoading = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <DynamicStatusBadge
        status={status}
        leadCount={leadCount}
        isLoading={isLoading}
        size='sm'
      />
      <span className='text-[10px] text-muted-foreground'>
        {leadCount} lead{leadCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};
