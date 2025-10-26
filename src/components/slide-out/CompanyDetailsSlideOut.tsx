import { UnifiedActionComponent } from '@/components/shared/UnifiedActionComponent';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/services/logoService';
import { Company, Job, Person } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Building2, ExternalLink, Globe, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { GridItem, SlideOutGrid } from './SlideOutGrid';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutSection } from './SlideOutSection';

interface CompanyDetailsSlideOutProps {
  companyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export const CompanyDetailsSlideOut: React.FC<CompanyDetailsSlideOutProps> = ({
  companyId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!companyId || !isOpen) return;

    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);

        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) throw companyError;

        // Fetch people at this company (limit to 5)
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('id, name, company_role, people_stage')
          .eq('company_id', companyId)
          .limit(5);

        if (peopleError) throw peopleError;

        // Fetch jobs at this company (limit to 5)
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('id, title, location, qualification_status')
          .eq('company_id', companyId)
          .limit(5);

        if (jobsError) throw jobsError;

        setCompany(companyData as Company);
        setPeople((peopleData as Person[]) || []);
        setJobs((jobsData as Job[]) || []);
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId, isOpen]);

  if (!company) {
    return (
      <SlideOutPanel isOpen={isOpen} onClose={onClose} title='Company Details'>
        <div className='flex items-center justify-center py-6'>
          {loading ? (
            <div className='text-gray-500'>Loading...</div>
          ) : (
            <div className='text-gray-500'>Company not found</div>
          )}
        </div>
      </SlideOutPanel>
    );
  }

  // Company details grid items
  const companyDetailsItems: GridItem[] = [
    {
      label: 'Company Name',
      value: company.name || '-',
    },
    {
      label: 'Industry',
      value: company.industry || '-',
    },
    {
      label: 'Head Office',
      value: company.head_office || '-',
    },
    {
      label: 'Company Size',
      value: company.company_size || '-',
    },
    {
      label: 'Pipeline Stage',
      value: company.pipeline_stage
        ? getStatusDisplayText(company.pipeline_stage)
        : '-',
    },
    {
      label: 'AI Score',
      value: (
        <div
          className={`inline-flex h-6 px-2 rounded-md border text-xs font-semibold items-center justify-center ${
            company.lead_score === 'High'
              ? 'bg-green-50 border-green-200 text-green-700'
              : company.lead_score === 'Medium'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : company.lead_score === 'Low'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          {company.lead_score || '-'}
        </div>
      ),
    },
    {
      label: 'Website',
      value: company.website ? (
        <a
          href={
            company.website.startsWith('http')
              ? company.website
              : `https://${company.website}`
          }
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
        >
          <Globe className='h-3 w-3' />
          Visit Website
        </a>
      ) : (
        '-'
      ),
    },
    {
      label: 'LinkedIn',
      value: company.linkedin_url ? (
        <a
          href={company.linkedin_url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
        >
          <ExternalLink className='h-3 w-3' />
          View Profile
        </a>
      ) : (
        '-'
      ),
    },
    {
      label: 'Created Date',
      value: company.created_at
        ? new Date(company.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '-',
    },
    {
      label: 'Lead Source',
      value: company.lead_source || '-',
    },
  ];

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={company.name}
      subtitle='Company Information'
      footer={
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>
              {people.length} people • {jobs.length} jobs
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <UnifiedActionComponent
              entityType='company'
              entityIds={companyId ? [companyId] : []}
              entityNames={company ? [company.name] : []}
              onActionComplete={onUpdate}
            />
          </div>
        </div>
      }
    >
      {/* Company Logo and Name */}
      <div className='flex items-center gap-4 mb-6 pb-6 border-b border-gray-200'>
        <div className='w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
          {company.website ? (
            <img
              src={getClearbitLogo(company.name, company.website)}
              alt={`${company.name} logo`}
              className='w-16 h-16 rounded-lg object-cover'
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const nextElement = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <Building2 className='h-8 w-8 text-gray-400' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-gray-900 truncate'>
            {company.name}
          </h3>
          {company.head_office && (
            <p className='text-sm text-gray-500'>{company.head_office}</p>
          )}
        </div>
      </div>

      {/* Company Details Section */}
      <SlideOutSection title='Company Details'>
        <SlideOutGrid items={companyDetailsItems} />
      </SlideOutSection>

      {/* AI Analysis Section */}
      {company.score_reason && (
        <SlideOutSection title='AI Analysis'>
          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-900 leading-relaxed whitespace-pre-wrap'>
              {company.score_reason}
            </p>
          </div>
        </SlideOutSection>
      )}

      {/* People at Company */}
      {people.length > 0 && (
        <SlideOutSection title={`People (${people.length})`}>
          <div className='space-y-2'>
            {people.map(person => (
              <div
                key={person.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'>
                    <User className='h-4 w-4 text-gray-500' />
                  </div>
                  <div className='min-w-0'>
                    <div className='text-sm font-medium text-gray-900 truncate'>
                      {person.name || '-'}
                    </div>
                    <div className='text-xs text-gray-500 truncate'>
                      {person.company_role || '-'}
                    </div>
                  </div>
                </div>
                {person.people_stage && (
                  <span className='text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 flex-shrink-0'>
                    {getStatusDisplayText(person.people_stage)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </SlideOutSection>
      )}

      {/* Jobs at Company */}
      {jobs.length > 0 && (
        <SlideOutSection title={`Open Positions (${jobs.length})`}>
          <div className='space-y-2'>
            {jobs.map(job => (
              <div
                key={job.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <div className='min-w-0 flex-1'>
                  <div className='text-sm font-medium text-gray-900 truncate'>
                    {job.title || '-'}
                  </div>
                  <div className='text-xs text-gray-500 truncate'>
                    {job.location || '-'}
                  </div>
                </div>
                {job.qualification_status && (
                  <span className='text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 flex-shrink-0 ml-2'>
                    {getStatusDisplayText(job.qualification_status)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </SlideOutSection>
      )}
    </SlideOutPanel>
  );
};
