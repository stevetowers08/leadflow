import { NotesSection } from '@/components/NotesSection';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { IndustryBadges } from '@/components/shared/IndustryBadge';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  bulkAddToCampaign,
  bulkExportPeople,
  bulkFavouritePeople,
  bulkSyncToCRM,
} from '@/services/bulk/bulkPeopleService';
import { getCompanyLogoUrlSync } from '@/services/logoService';
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
  RefreshCw,
  Send,
  Sparkles,
  Star,
  StickyNote,
  Trash2,
  User,
  ListPlus,
  Workflow,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { GridItem, SlideOutGrid } from './SlideOutGrid';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutSection } from './SlideOutSection';

interface CompanyDetailsSlideOutProps {
  companyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onPersonClick?: (personId: string) => void;
  initialTab?: 'overview' | 'people' | 'jobs' | 'activity' | 'notes';
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

const CompanyDetailsSlideOutComponent: React.FC<
  CompanyDetailsSlideOutProps
> = ({ companyId, isOpen, onClose, onUpdate, onPersonClick, initialTab }) => {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab ?? 'overview');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [notesCount, setNotesCount] = useState<number>(0);
  const { toast } = useToast();
  // When panel opens or company changes, optionally jump to requested initial tab
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab, companyId]);

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
        icon: StickyNote,
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
      description: 'Please select a campaign from the dropdown',
    });
    // TODO: Implement campaign selection dialog
  }, [selectedPeople.length, toast]);

  // Individual person action handlers
  const handlePersonSendMessage = useCallback(
    (personId: string) => {
      router.push(`/conversations?compose=1&toIds=${personId}`);
    },
    [router]
  );

  const handlePersonSyncCRM = useCallback(
    async (personId: string) => {
      const result = await bulkSyncToCRM([personId]);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        onUpdate?.();
      }
    },
    [toast, onUpdate]
  );

  const handlePersonAddToCampaign = useCallback(
    async (personId: string, campaignId: string) => {
      const result = await bulkAddToCampaign([personId], campaignId);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        onUpdate?.();
      }
    },
    [toast, onUpdate]
  );

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
                <span className='inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20'>
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
                className='p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors'
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

        // Fetch notes count
        if (companyData?.id) {
          const { count } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('entity_id', companyData.id)
            .eq('entity_type', 'company');
          setNotesCount(count || 0);
        }
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
      value: company.industry ? (
        <IndustryBadges industries={company.industry} />
      ) : (
        '-'
      ),
    },
    {
      label: 'Company Size',
      value: company.company_size || '-',
    },
    {
      label: 'Last Updated',
      value: company.updated_at
        ? new Date(company.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '-',
    },
    {
      label: 'Source',
      value: company.source || '-',
    },
    {
      label: (
        <span className='flex items-center gap-1.5'>
          <Sparkles className='h-3.5 w-3.5' />
          AI Score
        </span>
      ),
      value: <ScoreBadge score={company.lead_score} variant='compact' />,
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
      width='wide'
      customHeader={
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200'>
              {company.website ? (
                <img
                  src={
                    getCompanyLogoUrlSync(company.name, company.website) || ''
                  }
                  alt={`${company.name} logo`}
                  className='w-10 h-10 rounded-lg object-cover'
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
              <Building2 className='h-5 w-5 text-gray-400' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3'>
                <h2 className='text-lg font-semibold text-gray-700 truncate'>
                  {company.name}
                </h2>
                {company.website && (
                  <a
                    href={
                      company.website.startsWith('http')
                        ? company.website
                        : `https://${company.website}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                    title='Visit Website'
                  >
                    <Globe className='h-4 w-4' />
                  </a>
                )}
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-gray-400 hover:text-blue-600 transition-colors'
                    title='View LinkedIn Profile'
                  >
                    <svg
                      className='h-4 w-4'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                    </svg>
                  </a>
                )}
              </div>
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
              className={`h-8 w-8 p-0 border border-gray-200 rounded-md hover:border-gray-300 ${
                company.is_favourite
                  ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50'
                  : 'text-gray-500 hover:text-gray-700 bg-white'
              }`}
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
    >
      <div className='flex gap-0 h-full -mx-6'>
        {/* Left Column - Tabs and Content */}
        <section className='flex-1 min-w-0 flex flex-col overflow-hidden m-0 p-0'>
          {/* Tabs for Organization */}
          <div className='pt-6 pb-6 pl-6 pr-0 flex-shrink-0 overflow-visible'>
            <TabNavigation
              tabs={tabOptions.filter(tab =>
                ['overview', 'people', 'jobs'].includes(tab.id)
              )}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant='pill'
              className='w-full mr-0 pr-0'
            />
          </div>

          {/* Tab Content - Scrollable */}
          <div className='flex-1 overflow-y-auto overflow-x-hidden select-text m-0 p-0'>
            {activeTab === 'overview' && (
              <div className='space-y-4 px-6 pb-4'>
                {/* Divider */}
                <div className='w-full border-t border-gray-200'></div>

                {/* Company Details Section */}
                <div className='mb-6'>
                  <SlideOutGrid items={companyDetailsItems} />
                </div>

                {/* Financial Information Section */}
                {(company.funding_raised || company.estimated_arr) && (
                  <SlideOutSection title='Financial Information'>
                    <SlideOutGrid
                      items={[
                        ...(company.funding_raised
                          ? [
                              {
                                label: 'Funding Raised',
                                value: `$${Number(company.funding_raised).toLocaleString()}`,
                              },
                            ]
                          : []),
                        ...(company.estimated_arr
                          ? [
                              {
                                label: 'Estimated ARR',
                                value: `$${Number(company.estimated_arr).toLocaleString()}`,
                              },
                            ]
                          : []),
                      ]}
                    />
                  </SlideOutSection>
                )}

                {/* Divider */}
                {company.score_reason && (
                  <div className='w-full border-t border-gray-200 my-8'></div>
                )}

                {/* AI Analysis Section */}
                {company.score_reason && (
                  <div className='mb-4 last:mb-0'>
                    <div className='flex items-center gap-1.5 mb-3'>
                      <Sparkles className='h-4 w-4 text-gray-500' />
                      <h4 className='text-sm font-semibold text-gray-900'>
                        AI Analysis
                      </h4>
                    </div>
                    <div className='p-4 bg-primary/5 border border-primary/10 rounded-lg'>
                      <p className='text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
                        {company.score_reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'people' && (
              <div className='flex flex-col px-6 pb-4'>
                {people.length > 0 ? (
                  <div className='grid grid-cols-1 gap-3'>
                    {people.map(person => (
                      <div key={person.id} className='group cursor-pointer'>
                        <div
                          onClick={() => handlePersonClick(person.id)}
                          className='bg-white border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors overflow-hidden relative'
                        >
                          <div className='px-4 py-3'>
                            {/* Top Row: Role/Title (Prominent) */}
                            <div className='mb-1'>
                              {person.company_role && (
                                <h3 className='text-base font-semibold text-gray-900 mb-1.5'>
                                  {person.company_role}
                                </h3>
                              )}
                              <div className='flex items-center gap-2 flex-wrap'>
                                <h4 className='text-sm font-medium text-gray-700'>
                                  {person.name || 'Unknown'}
                                </h4>
                                {person.employee_location && (
                                  <>
                                    <span className='text-gray-400'>•</span>
                                    <span className='text-sm text-gray-500'>
                                      {person.employee_location}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Compact Info Row */}
                            <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2'>
                              {person.email_address && (
                                <div className='flex items-center gap-1.5'>
                                  <Mail className='h-4 w-4 text-gray-400' />
                                  <span className='truncate max-w-[200px]'>
                                    {person.email_address}
                                  </span>
                                </div>
                              )}
                              {person.linkedin_url && (
                                <a
                                  href={person.linkedin_url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  onClick={e => e.stopPropagation()}
                                  className='flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors'
                                >
                                  <ExternalLink className='h-4 w-4' />
                                  <span>LinkedIn</span>
                                </a>
                              )}
                            </div>

                            {/* Status Dropdown and Actions at Bottom */}
                            <div className='pt-3 mt-3 border-t border-gray-200'>
                              <div className='flex items-center gap-2 justify-between'>
                                <UnifiedStatusDropdown
                                  entityId={person.id}
                                  entityType='people'
                                  currentStatus={
                                    person.people_stage || 'new_lead'
                                  }
                                  availableStatuses={[
                                    'new_lead',
                                    'message_sent',
                                    'replied',
                                    'interested',
                                    'meeting_scheduled',
                                    'meeting_completed',
                                    'follow_up',
                                    'not_interested',
                                  ]}
                                  onStatusChange={() => onUpdate?.()}
                                  variant='button'
                                />
                                <div
                                  className='flex items-center gap-1'
                                  onClick={e => e.stopPropagation()}
                                >
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0 border border-gray-200 rounded-md bg-white hover:border-gray-300 hover:bg-gray-50'
                                    onClick={() =>
                                      handlePersonSendMessage(person.id)
                                    }
                                    title='Send Message'
                                  >
                                    <Send className='h-4 w-4 text-gray-600' />
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0 border border-gray-200 rounded-md bg-white hover:border-gray-300 hover:bg-gray-50'
                                    onClick={() =>
                                      handlePersonSyncCRM(person.id)
                                    }
                                    title='Sync to CRM'
                                  >
                                    <Workflow className='h-4 w-4 text-gray-600' />
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0 border border-gray-200 rounded-md bg-white hover:border-gray-300 hover:bg-gray-50'
                                    onClick={() => {
                                      // TODO: Open campaign selection dialog
                                      toast({
                                        title: 'Add to Campaign',
                                        description:
                                          'Campaign selection coming soon',
                                      });
                                    }}
                                    title='Add to Campaign'
                                  >
                                    <ListPlus className='h-4 w-4 text-gray-600' />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12 text-gray-500'>
                    <User className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm'>No people at this company</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className='flex flex-col px-6 pb-4'>
                {jobs.length > 0 ? (
                  <div className='grid grid-cols-1 gap-3'>
                    {jobs.slice(0, 10).map(job => {
                      const currentJobStatus =
                        job.client_jobs?.[0]?.status || 'new';
                      return (
                        <div
                          key={job.id}
                          className='bg-white border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors overflow-hidden relative'
                        >
                          <div className='px-4 py-3'>
                            {/* Top Row: Title (Prominent) */}
                            <div className='mb-2'>
                              <div className='flex items-center gap-2 flex-wrap'>
                                <h3 className='text-base font-semibold text-gray-900'>
                                  {job.title || 'Untitled Job'}
                                </h3>
                                {job.location && (
                                  <>
                                    <span className='text-gray-400'>•</span>
                                    <span className='text-sm text-gray-500'>
                                      {job.location}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Compact Info Row */}
                            <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2'>
                              {job.function && (
                                <div className='flex items-center gap-1.5'>
                                  <FileText className='h-4 w-4 text-gray-400' />
                                  <span>{job.function}</span>
                                </div>
                              )}
                              {job.posted_date && (
                                <div className='flex items-center gap-1.5'>
                                  <Calendar className='h-4 w-4 text-gray-400' />
                                  <span>
                                    {new Date(
                                      job.posted_date
                                    ).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                              )}
                              {job.job_url && (
                                <a
                                  href={job.job_url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  onClick={e => e.stopPropagation()}
                                  className='flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors'
                                >
                                  <ExternalLink className='h-4 w-4' />
                                  <span>View Job</span>
                                </a>
                              )}
                            </div>

                            {/* Status Dropdown and Actions at Bottom */}
                            <div className='pt-3 mt-3 border-t border-gray-200'>
                              <div className='flex items-center gap-2 justify-between'>
                                <UnifiedStatusDropdown
                                  entityId={job.id}
                                  entityType='jobs'
                                  currentStatus={currentJobStatus}
                                  availableStatuses={['new', 'qualify', 'skip']}
                                  onStatusChange={() => onUpdate?.()}
                                  variant='button'
                                />
                                <div className='flex items-center gap-1'>
                                  {job.job_url && (
                                    <Button
                                      variant='ghost'
                                      size='sm'
                                      className='h-8 w-8 p-0 border border-gray-200 rounded-md bg-white hover:border-gray-300 hover:bg-gray-50'
                                      onClick={e => {
                                        e.stopPropagation();
                                        window.open(job.job_url, '_blank');
                                      }}
                                      title='View Job'
                                    >
                                      <ExternalLink className='h-4 w-4 text-gray-600' />
                                    </Button>
                                  )}
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0 border border-gray-200 rounded-md bg-white hover:border-gray-300 hover:bg-gray-50'
                                    onClick={e => {
                                      e.stopPropagation();
                                      toast({
                                        title: 'Sync to CRM',
                                        description: 'Job sync coming soon',
                                      });
                                    }}
                                    title='Sync to CRM'
                                  >
                                    <Workflow className='h-4 w-4 text-gray-600' />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {jobs.length > 10 && (
                      <div className='text-center pt-4'>
                        <a
                          href={`/jobs?company=${companyId}`}
                          className='text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5'
                        >
                          View all {jobs.length} jobs
                          <ExternalLink className='h-3.5 w-3.5' />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-center py-12 text-gray-500'>
                    <Calendar className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm'>No jobs at this company</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className='space-y-4 px-6 pb-4'>
                {/* Recent Alerts Card - Notification Style */}
                {interactions.length > 0 && (
                  <div className='bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'>
                    <div className='p-6'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-semibold text-foreground'>
                          Recent Alerts
                        </h3>
                        <div className='flex items-center gap-2'>
                          <span className='relative flex h-3 w-3'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75' />
                            <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500' />
                          </span>
                          <span className='text-xs font-medium text-muted-foreground'>
                            {interactions.length} New
                          </span>
                        </div>
                      </div>

                      <div className='space-y-3'>
                        {interactions.slice(0, 3).map((interaction, idx) => {
                          const interactionType = getInteractionTypeDisplay(
                            interaction.interaction_type
                          );
                          // Determine color based on interaction type
                          let bgColor = 'bg-blue-50';
                          let borderColor = 'border-blue-100';
                          let dotColor = 'bg-blue-500';
                          let textColor = 'text-blue-600';
                          let hoverColor = 'hover:bg-blue-100';

                          if (interaction.interaction_type?.includes('email')) {
                            bgColor = 'bg-blue-50';
                            borderColor = 'border-blue-100';
                            dotColor = 'bg-blue-500';
                            textColor = 'text-blue-600';
                            hoverColor = 'hover:bg-blue-100';
                          } else if (
                            interaction.interaction_type?.includes('reply') ||
                            interaction.interaction_type?.includes('positive')
                          ) {
                            bgColor = 'bg-emerald-50';
                            borderColor = 'border-emerald-100';
                            dotColor = 'bg-emerald-500';
                            textColor = 'text-emerald-600';
                            hoverColor = 'hover:bg-emerald-100';
                          } else if (
                            interaction.interaction_type?.includes('decline') ||
                            interaction.interaction_type?.includes('negative')
                          ) {
                            bgColor = 'bg-red-50';
                            borderColor = 'border-red-100';
                            dotColor = 'bg-red-500';
                            textColor = 'text-red-600';
                            hoverColor = 'hover:bg-red-100';
                          }

                          return (
                            <div
                              key={interaction.id}
                              className={`flex items-start gap-3 p-3 ${bgColor} border ${borderColor} rounded-lg group ${hoverColor} transition-colors cursor-pointer`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 flex-shrink-0`}
                              />
                              <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-foreground'>
                                  {interactionType}
                                </p>
                                <p className='text-xs text-muted-foreground mt-0.5'>
                                  {interaction.people?.name || 'Unknown Person'}
                                </p>
                                {interaction.subject && (
                                  <p className='text-xs text-muted-foreground mt-0.5 truncate'>
                                    {interaction.subject}
                                  </p>
                                )}
                                <span
                                  className={`text-xs ${textColor} mt-1 inline-block`}
                                >
                                  {formatDate(interaction.occurred_at)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {interactions.length > 3 && (
                        <button className='mt-4 w-full text-xs font-medium text-center text-blue-600 hover:text-blue-700 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors'>
                          View All Alerts ({interactions.length})
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity Timeline */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold text-foreground px-1'>
                    All Activity
                  </h3>
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
              </div>
            )}
          </div>
        </section>

        {/* Right Column - Sidebar */}
        <div className='w-80 flex-shrink-0 border-l border-gray-200 flex flex-col h-full overflow-hidden ml-0'>
          <div className='flex-1 flex flex-col overflow-y-auto'>
            {/* Activity Section */}
            <div className='px-6 pt-6 pb-4'>
              <h3 className='text-base font-semibold text-gray-900 mb-4'>
                <div className='flex items-center gap-1.5'>
                  <Mail className='h-4 w-4 text-gray-500' />
                  <span>Activity</span>
                  {interactions.length > 0 && (
                    <span className='ml-1.5 text-gray-500 font-normal'>
                      ({interactions.length})
                    </span>
                  )}
                </div>
              </h3>
              <div className='space-y-2 select-text overflow-x-hidden'>
                {interactions.length > 0 ? (
                  interactions.slice(0, 5).map(interaction => {
                    const interactionType = getInteractionTypeDisplay(
                      interaction.interaction_type
                    );
                    let dotColor = 'bg-blue-500';
                    if (
                      interaction.interaction_type?.includes('reply') ||
                      interaction.interaction_type?.includes('positive')
                    ) {
                      dotColor = 'bg-emerald-500';
                    } else if (
                      interaction.interaction_type?.includes('decline') ||
                      interaction.interaction_type?.includes('negative')
                    ) {
                      dotColor = 'bg-red-500';
                    }

                    return (
                      <div
                        key={interaction.id}
                        className='flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 select-text'
                      >
                        <div
                          className={`flex-shrink-0 w-2 h-2 rounded-full ${dotColor} mt-1.5`}
                        />
                        <div className='flex-1 min-w-0'>
                          <div className='text-xs font-medium text-gray-900'>
                            {interactionType}
                          </div>
                          <div className='text-xs text-gray-500 mt-0.5'>
                            {interaction.people?.name || 'Unknown'}
                          </div>
                          <div className='text-xs text-gray-400 mt-1'>
                            {formatDate(interaction.occurred_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className='text-sm text-gray-400 py-2'>No activity</p>
                )}
                {interactions.length > 5 && (
                  <button
                    onClick={() => setActiveTab('activity')}
                    className='text-xs text-blue-600 hover:text-blue-700 w-full text-left py-2 font-medium'
                  >
                    View all {interactions.length} activities →
                  </button>
                )}
              </div>
            </div>

            {/* Divider - Full Width */}
            <div className='w-full border-t border-gray-200'></div>

            {/* Notes Section */}
            <div className='flex-1 flex flex-col min-h-0 pt-4 pb-6 select-text'>
              <div className='px-6'>
                <h3 className='text-base font-semibold text-gray-900 mb-4'>
                  <div className='flex items-center gap-1.5'>
                    <StickyNote className='h-4 w-4 text-gray-500' />
                    <span>Notes</span>
                    {notesCount > 0 && (
                      <span className='ml-1.5 text-gray-500 font-normal'>
                        ({notesCount})
                      </span>
                    )}
                  </div>
                </h3>
              </div>
              <div className='flex-1 min-h-0 w-full' style={{ minWidth: 0 }}>
                <NotesSection
                  entityId={company.id}
                  entityType='company'
                  entityName={company.name}
                  className='px-6'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
};

// Memoized export for performance
export const CompanyDetailsSlideOut = memo(CompanyDetailsSlideOutComponent);

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
