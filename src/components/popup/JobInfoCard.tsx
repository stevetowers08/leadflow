import React from 'react';
import { InfoCard } from '../shared/InfoCard';
import { StatusBadge } from '../StatusBadge';
import { getScoreBadgeClasses, getPriorityBadgeClasses } from '@/utils/scoreUtils';
import { cn } from '@/lib/utils';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Activity,
  Target,
  Building,
  Zap
} from 'lucide-react';
import { formatDateForSydney } from '@/utils/timezoneUtils';

interface JobInfoCardProps {
  job: any;
}

export const JobInfoCard: React.FC<JobInfoCardProps> = ({ job }) => {
  if (!job) return null;

  // Format salary range
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    } else if (job.salary) {
      return job.salary;
    } else if (job.salary_min) {
      return `$${job.salary_min.toLocaleString()}+`;
    } else if (job.salary_max) {
      return `Up to $${job.salary_max.toLocaleString()}`;
    }
    return "Not specified";
  };

  // Format employment type
  const formatEmploymentType = () => {
    if (!job.type) return "Not specified";
    return job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ');
  };

  // Format remote status
  const formatRemoteStatus = () => {
    if (job.remote === true) return "Remote";
    if (job.remote === false) return "On-site";
    return "Not specified";
  };

  return (
    <InfoCard title="Job Information" contentSpacing="space-y-4 pt-2">
      {/* Key Details Grid */}
      <div className="grid grid-cols-3 gap-4">
        <InfoField label="Location" value={job.location} />
        <InfoField label="Posted Date" value={job.created_at ? formatDateForSydney(job.created_at, 'date') : "Not specified"} />
        <InfoField label="Employment Type" value={formatEmploymentType()} />
        <InfoField label="Remote Status" value={formatRemoteStatus()} />
        <InfoField label="Status" value={job.status || "Not specified"} />
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Priority
          </div>
          <div className="flex items-center justify-start">
            <span className={cn(
              "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
              getPriorityBadgeClasses(job.priority)
            )}>
              {job.priority || "Medium"}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            AI Score
          </div>
          <div className="flex items-center justify-start">
            <span className={cn(
              "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
              getScoreBadgeClasses(job.lead_score_job)
            )}>
              {job.lead_score_job || "-"}
            </span>
          </div>
        </div>
        <InfoField label="Function/Department" value={job.function || "Not specified"} />
      </div>

      {/* Salary - Prominent */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Salary Range
        </div>
        <div className="text-sm text-gray-900 font-medium">
          {formatSalary()}
        </div>
      </div>
    </InfoCard>
  );
};

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium">
      {value || "Not specified"}
    </div>
  </div>
);
