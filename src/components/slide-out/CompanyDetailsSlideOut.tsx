import { NotesSection } from '@/components/NotesSection';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  bulkExportPeople,
  bulkFavouritePeople,
  bulkSyncToCRM,
} from '@/services/bulk/bulkPeopleService';
import { getClearbitLogo } from '@/services/logoService';
import { Company, Job, Person } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import {
  Building2,
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquarePlus,
  RefreshCw,
  Star,
  Trash2,
  User,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GridItem, SlideOutGrid } from './SlideOutGrid';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutSection } from './SlideOutSection';

interface CompanyDetailsSlideOutProps {
  companyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onPersonClick?: (personId: string) => void;
}

interface Interaction {
  id: string;
  interaction_type: string;
  occurred_at: string;
  subject: string | null;
  content: string | null;
  person_id: string;
  people: {
    name: string;
    company_role: string | null;
  };
}

export const CompanyDetailsSlideOut: React.FC<CompanyDetailsSlideOutProps> = ({
  companyId,
  isOpen,
  onClose,
  onUpdate,
  onPersonClick,
}) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const { toast } = useToast();

  // Tab options with counts
  const tabOptions = useMemo<TabOption[]>(
    () => [
      {
        id: 'overview',
        label: 'Overview',
        count: 0,
        icon: FileText,
        showCount: false,
      },
      { id: 'people', label: 'People', count: people.length, icon: User },
      { id: 'jobs', label: 'Jobs', count: jobs.length, icon: Calendar },
      {
        id: 'activity',
        label: 'Activity',
        count: interactions.length,
        icon: Mail,
      },
      {
        id: 'notes',
        label: 'Notes',
        count: 0,
        icon: MessageSquarePlus,
        showCount: false,
      },
    ],
    [people.length, jobs.length, interactions.length]
  );

  // Action handlers
  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    },
    [toast]
  );

  const handleFavouritePeople = useCallback(async () => {
    if (selectedPeople.length === 0) return;
    const result = await bulkFavouritePeople(selectedPeople, true);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
    });
    if (result.success) {
      setSelectedPeople([]);
      onUpdate?.();
    }
  }, [selectedPeople, toast, onUpdate]);

  const handleExportPeople = useCallback(async () => {
    if (selectedPeople.length === 0) return;
    const result = await bulkExportPeople(selectedPeople);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
    });
    if (result.success) {
      setSelectedPeople([]);
    }
  }, [selectedPeople, toast]);

  const handleSyncCRM = useCallback(async () => {
    if (selectedPeople.length === 0) return;
    const result = await bulkSyncToCRM(selectedPeople);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
    });
    if (result.success) {
      setSelectedPeople([]);
    }
  }, [selectedPeople, toast]);

  const handleAddToCampaign = useCallback(async () => {
    if (selectedPeople.length === 0) return;
    toast({
      title: 'Add to Campaign',
      description: 'This feature will add selected people to a campaign',
    });
    // TODO: Implement campaign addition
  }, [selectedPeople.length, toast]);

  const handleToggleFavourite = useCallback(async () => {
    if (!company) return;

    const newFavouriteStatus = !company.is_favourite;

    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_favourite: newFavouriteStatus })
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: newFavouriteStatus
          ? 'Added to favourites'
          : 'Removed from favourites',
        description: `${company.name} ${newFavouriteStatus ? 'is now' : 'removed from'} your favourites`,
      });

      onUpdate?.();
    } catch (error) {
      console.error('Error toggling favourite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favourite status',
        variant: 'destructive',
      });
    }
  }, [company, toast, onUpdate]);

  const handleDeletePeople = useCallback(async () => {
    if (selectedPeople.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedPeople.length} people?`
      )
    ) {
      return;
    }

    try {
      // Delete people from database
      const { error } = await supabase
        .from('people')
        .delete()
        .in('id', selectedPeople);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: `Deleted ${selectedPeople.length} people`,
      });

      setSelectedPeople([]);
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting people:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete people',
        variant: 'destructive',
      });
    }
  }, [selectedPeople, toast, onUpdate]);

  const togglePersonSelection = useCallback((personId: string) => {
    setSelectedPeople(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  }, []);

  const toggleAllPeople = useCallback(() => {
    if (selectedPeople.length === people.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(people.map(p => p.id));
    }
  }, [people, selectedPeople.length]);

  const handlePersonClick = useCallback(
    (personId: string) => {
      if (onPersonClick) {
        onPersonClick(personId);
      }
    },
    [onPersonClick]
  );

  const renderPersonCard = useCallback(
    (person: Person) => (
      <div
        key={person.id}
        onClick={() => handlePersonClick(person.id)}
        className='group'
      >
        <div className='flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer'>
          {/* Checkbox */}
          <div onClick={e => e.stopPropagation()}>
            <Checkbox
              checked={selectedPeople.includes(person.id)}
              onCheckedChange={() => togglePersonSelection(person.id)}
              className='flex-shrink-0'
            />
          </div>

          {/* Name & Role (larger, split into 2 lines) */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-3 mb-1'>
              <h3 className='text-base font-semibold text-gray-700'>
                {person.name || '-'}
              </h3>
              {person.lead_score && (
                <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200'>
                  {person.lead_score}
                </span>
              )}
              {person.people_stage && (
                <span className='inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200'>
                  {getStatusDisplayText(person.people_stage)}
                </span>
              )}
            </div>
            {person.company_role && (
              <div className='text-sm text-gray-600 font-medium mb-1'>
                {person.company_role}
              </div>
            )}
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              {person.email_address && (
                <div className='flex items-center gap-1.5'>
                  <Mail className='h-4 w-4 text-gray-400' />
                  <span>{person.email_address}</span>
                </div>
              )}
              {person.employee_location && (
                <div className='flex items-center gap-1.5'>
                  <MapPin className='h-4 w-4 text-gray-400' />
                  <span>{person.employee_location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0'>
            {person.linkedin_url && (
              <a
                href={person.linkedin_url}
                target='_blank'
                rel='noopener noreferrer'
                onClick={e => e.stopPropagation()}
                className='p-2 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors'
                title='Open LinkedIn'
              >
                <ExternalLink className='h-5 w-5' />
              </a>
            )}
            {person.email_address && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  copyToClipboard(person.email_address!, 'Email');
                }}
                className='p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors'
                title='Copy Email'
              >
                <Copy className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
      </div>
    ),
    [handlePersonClick, selectedPeople, togglePersonSelection, copyToClipboard]
  );

  useEffect(() => {
    if (!companyId || !isOpen) return;

    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);

        // Fetch company details directly from companies table
        // RLS is disabled in dev, so this should work
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .maybeSingle();

        if (companyError) throw companyError;

        if (!companyData) {
          throw new Error(`Company not found in database. ID: ${companyId}`);
        }

        // Fetch people at this company (no limit) with ALL available details
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select(
            'id, name, company_role, people_stage, email_address, linkedin_url, employee_location, lead_score, last_interaction_at, created_at, last_reply_at, last_reply_channel, last_reply_message, confidence_level, reply_type, email_sent'
          )
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (peopleError) throw peopleError;

        // Fetch jobs at this company (no limit) with ALL available details
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(
            'id, title, location, qualification_status, job_url, posted_date, valid_through, employment_type, seniority_level, function, salary, summary, description, qualified_at, qualified_by, qualification_notes, created_at'
          )
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;

        // Fetch interactions for people at this company
        // First get people IDs for this company
        const { data: companyPeopleData } = await supabase
          .from('people')
          .select('id')
          .eq('company_id', companyId);

        const personIds = companyPeopleData?.map(p => p.id) || [];

        // Then fetch interactions for these people
        const { data: interactionsData, error: interactionsError } =
          personIds.length > 0
            ? await supabase
                .from('interactions')
                .select(
                  `
                id,
                interaction_type,
                occurred_at,
                subject,
                content,
                person_id,
                people!inner(id, name, company_role)
              `
                )
                .in('person_id', personIds)
                .order('occurred_at', { ascending: false })
                .limit(20)
            : { data: [], error: null };

        if (interactionsError) throw interactionsError;

        setCompany(companyData as unknown as Company);
        setPeople((peopleData as unknown as Person[]) || []);
        setJobs((jobsData as Job[]) || []);
        setInteractions((interactionsData as Interaction[]) || []);
      } catch (error) {
        console.error('Error fetching company details:', error);
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to load company details',
          variant: 'destructive',
        });
        setCompany(null);
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

  // Add source job if exists
  const sourceJobId = company.source_job_id;

  if (sourceJobId) {
    companyDetailsItems.push({
      label: 'Source Job',
      value: (
        <a
          href={`/jobs/${sourceJobId}`}
          className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
        >
          <FileText className='h-3 w-3' />
          View Source Job
        </a>
      ),
    });
  }

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title=''
      subtitle=''
      width='default'
      customHeader={
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200'>
              {company.website ? (
                <img
                  src={getClearbitLogo(company.name, company.website)}
                  alt={`${company.name} logo`}
                  className='w-12 h-12 rounded-lg object-cover'
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                    const nextElement = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <Building2 className='h-6 w-6 text-gray-400' />
            </div>
            <div className='flex-1 min-w-0'>
              <h2 className='text-lg font-semibold text-gray-700 truncate'>
                {company.name}
              </h2>
              <p className='text-sm text-gray-500 truncate'>
                {company.head_office || 'Company Information'}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 flex-shrink-0 ml-4'>
            <Button
              size='sm'
              variant='ghost'
              onClick={handleToggleFavourite}
              className={
                company.is_favourite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-500'
              }
              title={
                company.is_favourite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <Star
                className={`h-4 w-4 ${company.is_favourite ? 'fill-current' : ''}`}
              />
            </Button>
            <IconOnlyAssignmentCell
              ownerId={company.owner_id}
              entityId={company.id}
              entityType='companies'
              onAssignmentChange={() => {
                onUpdate?.();
              }}
            />
            <UnifiedStatusDropdown
              entityId={company.id}
              entityType='companies'
              currentStatus={company.pipeline_stage || 'new_lead'}
              availableStatuses={[
                'new_lead',
                'qualified',
                'message_sent',
                'replied',
                'meeting_scheduled',
                'proposal_sent',
                'negotiation',
                'closed_won',
                'closed_lost',
                'on_hold',
              ]}
              onStatusChange={() => onUpdate?.()}
            />
          </div>
        </div>
      }
      footer={
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>
              {people.length} people • {jobs.length} jobs
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {/* Actions can be added here if needed */}
          </div>
        </div>
      }
    >
      {/* Tabs for Organization */}
      <TabNavigation
        tabs={tabOptions}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className='mb-6'
      />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className='space-y-4'>
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
        </div>
      )}

      {activeTab === 'people' && (
        <div className='relative pb-20'>
          {people.length > 0 ? (
            <div className='space-y-1'>
              {people.map(person => renderPersonCard(person))}
            </div>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <User className='h-12 w-12 text-gray-300 mx-auto mb-3' />
              <p className='text-sm'>No people at this company</p>
            </div>
          )}

          {/* Fixed Action Bar at Bottom */}
          <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {selectedPeople.length > 0 ? (
                  <>
                    <CheckCircle className='h-5 w-5 text-blue-600' />
                    <span className='text-sm font-medium text-gray-700'>
                      {selectedPeople.length} selected
                    </span>
                    <button
                      onClick={() => setSelectedPeople([])}
                      className='text-xs text-gray-500 hover:text-gray-700 transition-colors'
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <>
                    <User className='h-4 w-4 text-gray-400' />
                    <span className='text-sm text-gray-500'>
                      Select people to perform actions
                    </span>
                  </>
                )}
              </div>
              {selectedPeople.length > 0 && (
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleFavouritePeople}
                  >
                    <User className='h-4 w-4 mr-2' />
                    Favourite
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleExportPeople}
                  >
                    <Globe className='h-4 w-4 mr-2' />
                    Export
                  </Button>
                  <Button size='sm' variant='outline' onClick={handleSyncCRM}>
                    <RefreshCw className='h-4 w-4 mr-2' />
                    Sync CRM
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleAddToCampaign}
                  >
                    <Mail className='h-4 w-4 mr-2' />
                    Campaign
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='text-red-600 hover:text-red-700'
                    onClick={handleDeletePeople}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className='space-y-1'>
          {jobs.length > 0 ? (
            <>
              {jobs.slice(0, 10).map(job => (
                <div
                  key={job.id}
                  className='group flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors relative'
                >
                  <div className='flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center'>
                    <Calendar className='h-4 w-4 text-gray-600' />
                  </div>

                  <div className='flex-1 min-w-0 flex items-center justify-between gap-3'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <div className='text-sm font-medium text-gray-700'>
                          {job.title || '-'}
                        </div>
                        {job.qualification_status && (
                          <span className='text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-md flex-shrink-0'>
                            {getStatusDisplayText(job.qualification_status)}
                          </span>
                        )}
                      </div>
                      <div className='text-xs text-gray-500 truncate mt-0.5'>
                        {job.function && <span>{job.function}</span>}
                        {job.location && job.function && <span> • </span>}
                        {job.location && <span>{job.location}</span>}
                        {job.posted_date && (
                          <span>
                            {' '}
                            •{' '}
                            {new Date(job.posted_date).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      {job.job_url && (
                        <a
                          href={job.job_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-1.5 hover:bg-blue-50 rounded-md text-gray-600 hover:text-blue-600 transition-colors'
                          title='View Job'
                        >
                          <ExternalLink className='h-4 w-4' />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {jobs.length > 10 && (
                <div className='text-center pt-2'>
                  <a
                    href={`/jobs?company=${companyId}`}
                    className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                  >
                    View all {jobs.length} jobs →
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <Calendar className='h-12 w-12 text-gray-300 mx-auto mb-3' />
              <p className='text-sm'>No jobs at this company</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className='space-y-3'>
          {interactions.length > 0 ? (
            <div className='space-y-3'>
              {interactions.map(interaction => (
                <div
                  key={interaction.id}
                  className='flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div className='flex-shrink-0 w-1 bg-blue-500 rounded-full' />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-xs font-medium text-blue-600'>
                        {getInteractionTypeDisplay(
                          interaction.interaction_type
                        )}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {formatDate(interaction.occurred_at)}
                      </span>
                    </div>
                    <div className='text-sm font-medium text-gray-700'>
                      {interaction.people?.name || 'Unknown Person'}
                    </div>
                    {interaction.subject && (
                      <div className='text-xs text-gray-600 mt-1 truncate'>
                        {interaction.subject}
                      </div>
                    )}
                    {interaction.content && (
                      <div className='text-xs text-gray-500 mt-1 line-clamp-2'>
                        {interaction.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              No activity yet
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <NotesSection
          entityId={company.id}
          entityType='company'
          entityName={company.name}
          className='-mx-6 -my-6'
        />
      )}
    </SlideOutPanel>
  );
};

// Helper functions
const getInteractionTypeDisplay = (type: string): string => {
  const displayMap: Record<string, string> = {
    email_sent: 'Email Sent',
    email_reply: 'Email Reply',
    meeting_booked: 'Meeting Booked',
    meeting_held: 'Meeting Held',
    disqualified: 'Disqualified',
    note: 'Note',
  };
  return displayMap[type] || type;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};
