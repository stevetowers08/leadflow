import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/services/logoService';
import { Company, Job, Person } from '@/types/database';
import {
  summarizeJobFromSupabase,
  updateJobSummaryInSupabase,
} from '@/utils/jobSummarization';
import { format } from 'date-fns';
import { ExternalLink, Sparkles, User } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { GridItem, SlideOutGrid } from './SlideOutGrid';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutSection } from './SlideOutSection';

interface JobDetailsSlideOutProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export const JobDetailsSlideOut: React.FC<JobDetailsSlideOutProps> = ({
  jobId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchJobDetails = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      // Fetch job with company details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(
          `
          *,
          companies:company_id (*)
        `
        )
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData as Job);

      // Set company
      if (jobData.companies) {
        setCompany(jobData.companies as unknown as Company);

        // Fetch people at the company
        if (jobData.company_id) {
          const { data: peopleData, error: peopleError } = await supabase
            .from('people')
            .select('*')
            .eq('company_id', jobData.company_id)
            .limit(5);

          if (!peopleError && peopleData) {
            setPeople(peopleData as Person[]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [jobId, toast]);

  useEffect(() => {
    if (jobId && isOpen) {
      fetchJobDetails();
    }
  }, [jobId, isOpen, fetchJobDetails]);

  const handleQualify = async (status: 'qualify' | 'skip') => {
    if (!job || !user) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          qualification_status: status,
          qualified: status === 'qualify',
          qualified_at: new Date().toISOString(),
          qualified_by: user.id,
        })
        .eq('id', job.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Job ${status === 'qualify' ? 'qualified' : 'skipped'}`,
      });

      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateSummary = async () => {
    if (!job || !jobId) return;

    setGeneratingSummary(true);
    try {
      // Generate AI summary
      const result = await summarizeJobFromSupabase(jobId);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate summary');
      }

      // Update the job with the new summary
      const updateResult = await updateJobSummaryInSupabase(result.data);

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Failed to update job summary');
      }

      // Update local state
      setJob({ ...job, summary: result.data.summary });

      toast({
        title: 'Success',
        description: 'AI summary generated successfully',
      });

      onUpdate?.();
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to generate summary',
        variant: 'destructive',
      });
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (!job) return null;

  const jobDetailsItems: GridItem[] = [
    {
      label: 'Job Title',
      value: job.title || '-',
    },
    {
      label: 'Location',
      value: job.location || '-',
    },
    {
      label: 'Employment Type',
      value: job.employment_type || '-',
    },
    {
      label: 'Seniority Level',
      value: job.seniority_level || '-',
    },
    {
      label: 'Function',
      value: job.function || '-',
    },
    {
      label: 'Salary',
      value: job.salary || '-',
    },
    {
      label: 'Posted Date',
      value: job.posted_date
        ? format(new Date(job.posted_date), 'MMM d, yyyy')
        : '-',
    },
    {
      label: 'Valid Through',
      value: job.valid_through
        ? format(new Date(job.valid_through), 'MMM d, yyyy')
        : '-',
    },
  ];

  const companyDetailsItems: GridItem[] = company
    ? [
        {
          label: 'Company Name',
          value: (
            <div className='flex items-center gap-2'>
              <img
                src={getClearbitLogo(company.name, company.website || '')}
                alt={company.name}
                className='w-6 h-6 rounded'
              />
              <span>{company.name}</span>
            </div>
          ),
        },
        {
          label: 'Industry',
          value: company.industry || '-',
        },
        {
          label: 'Website',
          value: company.website ? (
            <a
              href={company.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
            >
              Visit <ExternalLink className='h-3 w-3' />
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
              Profile <ExternalLink className='h-3 w-3' />
            </a>
          ) : (
            '-'
          ),
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
          value: company.pipeline_stage ? (
            <StatusBadge status={company.pipeline_stage} size='sm' />
          ) : (
            '-'
          ),
        },
        {
          label: 'Lead Score',
          value: company.lead_score || '-',
        },
      ]
    : [];

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={job.title || 'Job Details'}
      subtitle={company?.name || ''}
      footer={
        <div className='flex items-center justify-end gap-3 w-full'>
          <Button
            variant='outline'
            onClick={() => handleQualify('skip')}
            disabled={loading}
          >
            Skip
          </Button>
          <Button
            onClick={() => handleQualify('qualify')}
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            Qualify
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className='text-center py-6 text-gray-500'>Loading...</div>
      ) : (
        <>
          {/* Job Details Section */}
          <SlideOutSection title='Job Details'>
            <SlideOutGrid items={jobDetailsItems} />
          </SlideOutSection>

          {/* Company Information Section */}
          {company && (
            <SlideOutSection title='Company Information'>
              <SlideOutGrid items={companyDetailsItems} />

              {/* AI Analysis if available */}
              {company.score_reason && (
                <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <h5 className='text-sm font-semibold text-blue-900 mb-2'>
                    AI Analysis
                  </h5>
                  <p className='text-sm text-blue-800 leading-relaxed'>
                    {company.score_reason}
                  </p>
                </div>
              )}
            </SlideOutSection>
          )}

          {/* Job Summary Section */}
          {(job.summary || job.description) && (
            <SlideOutSection title='Summary'>
              {job.summary ? (
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    {job.summary}
                  </p>
                </div>
              ) : job.description ? (
                <div className='flex flex-col gap-3'>
                  <div className='text-sm text-gray-400 italic'>
                    No AI summary available. Generate one to get a concise
                    overview of this job.
                  </div>
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    variant='outline'
                    className='self-start'
                  >
                    <Sparkles className='h-4 w-4 mr-2' />
                    {generatingSummary
                      ? 'Generating...'
                      : 'Generate AI Summary'}
                  </Button>
                </div>
              ) : null}
            </SlideOutSection>
          )}

          {/* Related People Section */}
          {people.length > 0 && (
            <SlideOutSection title={`Related People (${people.length})`}>
              <div className='space-y-3'>
                {people.map(person => (
                  <div
                    key={person.id}
                    className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                  >
                    <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
                      <User className='h-5 w-5 text-gray-500' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-sm text-gray-900 truncate'>
                        {person.name}
                      </div>
                      <div className='text-xs text-gray-500 truncate'>
                        {person.company_role || 'No role specified'}
                      </div>
                    </div>
                    {person.people_stage && (
                      <StatusBadge status={person.people_stage} size='sm' />
                    )}
                  </div>
                ))}
              </div>
            </SlideOutSection>
          )}

          {/* Job URL Link */}
          {job.job_url && (
            <SlideOutSection title='External Link'>
              <a
                href={job.job_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2'
              >
                View Original Job Posting <ExternalLink className='h-4 w-4' />
              </a>
            </SlideOutSection>
          )}
        </>
      )}
    </SlideOutPanel>
  );
};
