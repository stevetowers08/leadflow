import { InfoCard } from '@/components/shared/InfoCard';
import { InfoField } from '@/components/shared/InfoField';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import React from 'react';
import { AIJobSummary } from './AIJobSummary';

interface JobInfoCardProps {
  job: {
    id: string;
    title: string;
    location?: string;
    function?: string;
    employment_type?: string;
    seniority_level?: string;
    salary_min?: number;
    salary_max?: number;
    salary?: string;
    created_at?: string;
    description?: string;
    company_name?: string;
  };
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
    return '-';
  };

  // Format employment type
  const formatEmploymentType = () => {
    if (!job.employment_type) return '-';
    return (
      job.employment_type.charAt(0).toUpperCase() +
      job.employment_type.slice(1).replace('_', ' ')
    );
  };

  return (
    <InfoCard
      title='Job Information'
      contentSpacing='space-y-4 pt-4'
      showDivider={true}
    >
      {/* Section 1: Job Header - Prominent Title and Key Details */}
      <div className='space-y-4'>
        {/* Job Title - Large and Prominent */}
        <div>
          <h2 className='text-sm font-semibold text-gray-900 leading-tight'>
            {job.title}
          </h2>
          {job.company_name && (
            <p className='text-sm text-gray-600 mt-1'>{job.company_name}</p>
          )}
        </div>

        {/* Key Details Row - Same size as other info fields */}
        <div className='grid grid-cols-3 gap-3'>
          {/* Salary */}
          <div className='space-y-1'>
            <div className='text-xs font-medium text-gray-400'>
              Salary Range
            </div>
            <div className='text-sm text-gray-900 font-medium'>
              <span>{formatSalary()}</span>
            </div>
          </div>

          {/* Location */}
          <div className='space-y-1'>
            <div className='text-xs font-medium text-gray-400'>Location</div>
            <div className='text-sm text-gray-900 font-medium'>
              {job.location ? (
                <span>{job.location}</span>
              ) : (
                <span className='text-gray-400'>-</span>
              )}
            </div>
          </div>

          {/* Employment Type */}
          <div className='space-y-1'>
            <div className='text-xs font-medium text-gray-400'>
              Employment Type
            </div>
            <div className='text-sm text-gray-900 font-medium'>
              <span>{formatEmploymentType()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Additional Job Details - Smaller text */}
      <div className='grid grid-cols-3 gap-3'>
        <InfoField label='Function/Department' value={job.function} />
        <InfoField label='Seniority Level' value={job.seniority_level} />
        <InfoField
          label='Posted Date'
          value={
            job.created_at ? formatDateForSydney(job.created_at, 'date') : '-'
          }
        />
      </div>

      {/* Section 3: AI Job Summary - Moved to bottom like company card */}
      {job.description && job.title ? (
        <AIJobSummary job={job} />
      ) : (
        <div className='text-center py-4 text-gray-500 text-sm'>
          AI Job Summary not available - missing job description or title
        </div>
      )}
    </InfoCard>
  );
};
