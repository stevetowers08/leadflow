import React from 'react';
import { InfoCard } from '../shared/InfoCard';
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
      {/* Basic Information */}
      <div className="grid grid-cols-3 gap-4">
        <InfoField icon={<Briefcase className="h-4 w-4" />} value={job.title} />
        <InfoField icon={<MapPin className="h-4 w-4" />} value={job.location} />
        <InfoField 
          icon={<Calendar className="h-4 w-4" />} 
          value={
            job.created_at ? formatDateForSydney(job.created_at, 'date') : "Not specified"
          } 
        />
      </div>

      {/* Employment Details */}
      <div className="grid grid-cols-3 gap-4">
        <InfoField icon={<Clock className="h-4 w-4" />} value={formatEmploymentType()} />
        <InfoField icon={<Building className="h-4 w-4" />} value={formatRemoteStatus()} />
        <InfoField icon={<Target className="h-4 w-4" />} value={job.status || "Not specified"} />
      </div>

      {/* Financial & Priority */}
      <div className="grid grid-cols-3 gap-4">
        <InfoField icon={<DollarSign className="h-4 w-4" />} value={formatSalary()} />
        <InfoField icon={<Zap className="h-4 w-4" />} value={job.priority || "Not specified"} />
        <InfoField 
          icon={<Activity className="h-4 w-4" />} 
          value={job.lead_score_job ? `Score: ${job.lead_score_job}` : "No score"} 
        />
      </div>

      {/* Function/Department */}
      <div className="grid grid-cols-1 gap-4">
        <InfoField icon={<Building className="h-4 w-4" />} value={job.function || "Not specified"} />
      </div>
    </InfoCard>
  );
};

interface InfoFieldProps {
  icon: React.ReactNode;
  value: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ icon, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-muted-foreground flex-shrink-0">{icon}</div>
    <span className="text-sm text-foreground">
      {value || "Not specified"}
    </span>
  </div>
);
