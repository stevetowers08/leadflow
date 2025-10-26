import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/database';
import { CheckCircle2, X, AlertCircle, Clock } from 'lucide-react';
import React from 'react';

interface JobQualificationBadgeProps {
  job: Job;
  showIcon?: boolean;
}

export const JobQualificationBadge: React.FC<JobQualificationBadgeProps> = ({
  job,
  showIcon = true,
}) => {
  const getQualificationDisplay = () => {
    switch (job.qualification_status) {
      case 'qualify':
        return {
          label: 'Qualify',
          variant: 'success' as const,
          icon: CheckCircle2,
          className: 'bg-green-50 text-green-700 border-green-200',
        };
      case 'skip':
        return {
          label: 'Skip',
          variant: 'destructive' as const,
          icon: X,
          className: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'new':
      default:
        return {
          label: 'New',
          variant: 'secondary' as const,
          icon: Clock,
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
    }
  };

  const display = getQualificationDisplay();
  const Icon = display.icon;

  return (
    <Badge
      variant={display.variant}
      className={`${display.className} font-medium`}
    >
      {showIcon && <Icon className='mr-1 h-3 w-3' />}
      {display.label}
    </Badge>
  );
};
