import React from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { StatusBadge } from '@/components/StatusBadge';
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
    return "-";
  };

  // Format employment type
  const formatEmploymentType = () => {
    if (!job.employment_type) return "-";
    return job.employment_type.charAt(0).toUpperCase() + job.employment_type.slice(1).replace('_', ' ');
  };

  // Format seniority level
  const formatSeniorityLevel = () => {
    if (!job.seniority_level) return "-";
    return job.seniority_level;
  };

  return (
    <InfoCard title="Job Information" contentSpacing="space-y-6 pt-1.5">
      {/* Job Info Section */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">
            Salary Range
          </div>
          <div className="text-sm text-gray-900 font-medium">
            {formatSalary()}
          </div>
        </div>
        <InfoField label="Location" value={job.location} />
        <InfoField label="Function/Department" value={job.function} />
        <InfoField label="Employment Type" value={formatEmploymentType()} />
        <InfoField label="Seniority Level" value={formatSeniorityLevel()} />
        <InfoField label="Posted Date" value={job.created_at ? formatDateForSydney(job.created_at, 'date') : "-"} />
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
    <div className="text-xs font-medium text-gray-400">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium">
      {value || "-"}
    </div>
  </div>
);
