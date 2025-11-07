import { NotesSection } from '@/components/NotesSection';
import { StatusBadge } from '@/components/StatusBadge';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { Badge } from '@/components/ui/badge';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCompanyLogoUrlSync } from '@/services/logoService';
import { useStatusAutomation } from '@/services/statusAutomationService';
import { Company, Interaction, Job, Person } from '@/types/database';
import { bulkAddToCampaign } from '@/services/bulk/bulkPeopleService';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Building2,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Link2,
  ListPlus,
  Mail,
  MapPin,
  Sparkles,
  StickyNote,
  Target,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { GridItem, SlideOutGrid } from './SlideOutGrid';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutSection } from './SlideOutSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmailComposer } from '@/components/crm/communications/EmailComposer';
import { Tables } from '@/integrations/supabase/types';

interface PersonDetailsSlideOutProps {
  personId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  initialTab?: 'overview' | 'company' | 'jobs' | 'notes' | 'ai' | 'activity';
}

interface InteractionWithPerson extends Interaction {
  people?: Person | null;
  companies?: Company | null;
}

const PersonDetailsSlideOutComponent: React.FC<PersonDetailsSlideOutProps> =
  memo(({ personId, isOpen, onClose, onUpdate, initialTab }) => {
    const router = useRouter();
    const [person, setPerson] = useState<Person | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [otherPeople, setOtherPeople] = useState<Person[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [interactions, setInteractions] = useState<InteractionWithPerson[]>(
      []
    );
    const [campaigns, setCampaigns] = useState<
      Array<{ id: string; name: string }>
    >([]);
    const [enrolledCampaigns, setEnrolledCampaigns] = useState<
      Array<{ id: string; name: string; status: string }>
    >([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(initialTab ?? 'overview');
    const [notesCount, setNotesCount] = useState<number>(0);
    const [showCampaignSelect, setShowCampaignSelect] = useState(false);
    const { toast } = useToast();
    const statusAutomation = useStatusAutomation();

    // When panel opens or person changes, optionally jump to requested initial tab
    useEffect(() => {
      if (isOpen && initialTab) {
        // Map deprecated tabs to overview
        const mapped = initialTab === 'company' || initialTab === 'jobs' ? 'overview' : initialTab;
        setActiveTab(mapped);
      }
    }, [isOpen, initialTab]);

    const fetchPersonDetails = useCallback(async () => {
      if (!personId || !isOpen) return;

      setLoading(true);
      try {
        // Fetch person details
        const { data: personData, error: personError } = await supabase
          .from('people')
          .select('*')
          .eq('id', personId)
          .single();

        if (personError) throw personError;
        setPerson(personData as Person);

        // Fetch company if person has company_id
        if (personData.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', personData.company_id)
            .single();

          if (!companyError && companyData) {
            setCompany(companyData as Company);

            // Fetch other people at same company
            const { data: otherPeopleData, error: otherPeopleError } =
              await supabase
                .from('people')
                .select('*')
                .eq('company_id', personData.company_id)
                .neq('id', personId)
                .limit(5);

            if (!otherPeopleError && otherPeopleData) {
              setOtherPeople(otherPeopleData as Person[]);
            }

            // Fetch jobs at this company
            const { data: jobsData, error: jobsError } = await supabase
              .from('jobs')
              .select(
                'id, title, location, qualification_status, job_url, posted_date, function, created_at'
              )
              .eq('company_id', personData.company_id)
              .order('created_at', { ascending: false })
              .limit(10);

            if (!jobsError && jobsData) {
              setJobs(jobsData as Job[]);
            }
          }
        }

        // Fetch interactions for this person
        const { data: interactionsData, error: interactionsError } =
          await supabase
            .from('interactions')
            .select(
              `
              id,
              interaction_type,
              occurred_at,
              subject,
              content,
              person_id,
              people!inner(id, name, company_role, company_id)
            `
            )
            .eq('person_id', personId)
            .order('occurred_at', { ascending: false })
            .limit(20);

        if (interactionsError) throw interactionsError;

        setInteractions((interactionsData as InteractionWithPerson[]) || []);

        // Fetch notes count
        if (personData?.id) {
          const { count: notesCount, error: notesError } = await supabase
            .from('notes')
            .select('id', { count: 'exact', head: true })
            .eq('entity_id', personData.id)
            .eq('entity_type', 'person');

          if (!notesError && notesCount !== null) {
            setNotesCount(notesCount);
          }

          // Fetch enrolled campaigns
          const { data: enrolledData, error: enrolledError } = await supabase
            .from('campaign_sequence_leads')
            .select(
              `
              id,
              status,
              campaign_sequences(id, name)
            `
            )
            .eq('lead_id', personData.id)
            .in('status', ['active', 'paused', 'completed']);

          if (!enrolledError && enrolledData) {
            setEnrolledCampaigns(
              enrolledData
                .filter(
                  item =>
                    item.campaign_sequences &&
                    typeof item.campaign_sequences === 'object' &&
                    !Array.isArray(item.campaign_sequences)
                )
                .map(item => ({
                  id:
                    (item.campaign_sequences as { id: string; name: string })
                      .id || '',
                  name:
                    (item.campaign_sequences as { id: string; name: string })
                      .name || '',
                  status: item.status,
                }))
            );
          }
        }
      } catch (error) {
        console.error('Error fetching person details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load person details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, [personId, isOpen, toast]);

    useEffect(() => {
      if (personId && isOpen) {
        fetchPersonDetails();
      }
    }, [personId, isOpen, fetchPersonDetails]);

    // Fetch campaigns
    useEffect(() => {
      const fetchCampaigns = async () => {
        try {
          const { data, error } = await supabase
            .from('campaign_sequences')
            .select('id, name')
            .eq('status', 'active')
            .order('name', { ascending: true });

          if (error) throw error;
          setCampaigns(data || []);
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
      };

      fetchCampaigns();
    }, []);

    const handleStageChange = async (
      newStage:
        | 'new_lead'
        | 'message_sent'
        | 'replied'
        | 'interested'
        | 'meeting_scheduled'
        | 'meeting_completed'
        | 'follow_up'
        | 'not_interested'
    ) => {
      if (!person) return;

      try {
        const { error } = await supabase
          .from('people')
          .update({ people_stage: newStage })
          .eq('id', person.id);

        if (error) throw error;

        // Automatically update statuses if meeting scheduled
        if (newStage === 'meeting_scheduled' && person.company_id) {
          try {
            const meetingDate = new Date().toISOString();
            await statusAutomation.onMeetingScheduled(
              person.company_id,
              meetingDate,
              { skipNotification: true }
            );
          } catch (statusError) {
            console.error('Failed to update company status:', statusError);
          }
        }

        toast({
          title: 'Success',
          description: `Person stage updated to ${getStatusDisplayText(newStage)}`,
        });

        onUpdate?.();
        fetchPersonDetails();
      } catch (error) {
        console.error('Error updating person stage:', error);
        toast({
          title: 'Error',
          description: 'Failed to update person stage',
          variant: 'destructive',
        });
      }
    };

    // removed favourite toggle

    const [showComposeEmail, setShowComposeEmail] = useState(false);

    // Close dialog when person changes
    useEffect(() => {
      setShowComposeEmail(false);
    }, [personId]);

    const handleSendMessage = useCallback(() => {
      if (!personId) return;
      if (!person?.email_address) {
        toast({
          title: 'No Email Address',
          description: 'This contact does not have an email address.',
          variant: 'destructive',
        });
        return;
      }
      setShowComposeEmail(true);
    }, [personId, person?.email_address, toast]);

    const handleAddToCampaign = useCallback(
      async (campaignId: string) => {
        if (!personId) return;
        const result = await bulkAddToCampaign([personId], campaignId);
        toast({
          title: result.success ? 'Success' : 'Error',
          description: result.message,
          variant: result.success ? 'default' : 'destructive',
        });
        if (result.success) {
          setShowCampaignSelect(false);
          fetchPersonDetails(); // Refresh to update enrolled campaigns
          onUpdate?.();
        }
      },
      [personId, toast, onUpdate, fetchPersonDetails]
    );

    const formatDate = (dateString: string | null): string => {
      if (!dateString) return '-';
      return format(new Date(dateString), 'MMM d, yyyy');
    };

    const getInteractionTypeDisplay = (
      type: string | null
    ): string => {
      if (!type) return 'Activity';
      return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const handleCompanyClick = (companyId: string) => {
      onClose();
      router.push(`/companies?id=${companyId}`);
    };

    const handlePersonClick = (clickedPersonId: string) => {
      if (clickedPersonId === personId) return;
      onClose();
      router.push(`/people?id=${clickedPersonId}`);
    };

    const handleJobClick = (jobId: string) => {
      onClose();
      router.push(`/jobs?id=${jobId}`);
    };

    // All hooks must be called before any early returns
    const tabOptions: TabOption[] = useMemo(
      () => [
        { id: 'overview', label: 'Overview', count: 0, icon: FileText },
        {
          id: 'activity' as const,
          label: 'Activity',
          count: interactions.length,
          icon: Mail,
        },
        {
          id: 'ai' as const,
          label: 'Messages',
          count: 0,
          icon: Sparkles,
        },
        {
          id: 'notes' as const,
          label: 'Notes',
          count: notesCount,
          icon: StickyNote,
        },
      ],
      [notesCount, interactions.length]
    );

    const personDetailsItems: GridItem[] = useMemo(
      () => [
        {
          label: 'Name',
          value: person?.name || '-',
        },
        {
          label: 'Company',
          value: company?.name || '-',
        },
        {
          label: 'Email',
          value: person?.email_address ? (
            <a
              href={`mailto:${person.email_address}`}
              className='text-primary hover:text-primary flex items-center gap-1'
            >
              <Mail className='h-3 w-3' />
              {person.email_address}
            </a>
          ) : (
            '-'
          ),
        },
        {
          label: 'Location',
          value: person?.employee_location
            ? person.employee_location
                .replace(/,?\s*Australia\s*,?/gi, '')
                .replace(/^,\s*|,\s*$/g, '')
                .trim() || '-'
            : '-',
        },
        {
          label: 'LinkedIn',
          value: person?.linkedin_url ? (
            <a
              href={person.linkedin_url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:text-primary flex items-center gap-1'
            >
              Profile <ExternalLink className='h-3 w-3' />
            </a>
          ) : (
            '-'
          ),
        },
        {
          label: (
            <span className='flex items-center gap-1.5'>
              <Sparkles className='h-3.5 w-3.5' />
              Match Score
            </span>
          ),
          value: person?.lead_score ? (
            <ScoreBadge score={person.lead_score} variant='compact' />
          ) : (
            '-'
          ),
        },
        {
          label: 'Last Interaction',
          value: person?.last_interaction_at
            ? formatDistanceToNow(new Date(person.last_interaction_at), {
                addSuffix: true,
              })
            : '-',
        },
        {
          label: 'Added',
          value: person?.created_at
            ? formatDistanceToNow(new Date(person.created_at), {
                addSuffix: true,
              })
            : '-',
        },
      ],
      [person, company]
    );

    const companyDetailsItems: GridItem[] = useMemo(
      () =>
        company
          ? [
              {
                label: 'Company Name',
                value: (
                  <div className='flex items-center gap-2'>
                    <img
                      src={
                        getCompanyLogoUrlSync(
                          company.name,
                          company.website || undefined
                        ) || ''
                      }
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
                    className='text-primary hover:text-primary flex items-center gap-1'
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
                    className='text-primary hover:text-primary flex items-center gap-1'
                  >
                    Company Page <ExternalLink className='h-3 w-3' />
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
                  <Badge
                    variant='outline'
                    className={`rounded-md font-medium whitespace-nowrap border px-2 py-0.5 text-xs ${getUnifiedStatusClass(company.pipeline_stage)}`}
                  >
                    {getStatusDisplayText(company.pipeline_stage)}
                  </Badge>
                ) : (
                  '-'
                ),
              },
              {
                label: (
                  <span className='flex items-center gap-1.5'>
                    <Sparkles className='h-3.5 w-3.5' />
                    AI Score
                  </span>
                ),
                value: company.lead_score ? (
                  <ScoreBadge score={company.lead_score} variant='compact' />
                ) : (
                  '-'
                ),
              },
            ]
          : [],
      [company]
    );

    // Early return after all hooks are called
    if (!person) return null;

    return (
      <SlideOutPanel
        isOpen={isOpen}
        onClose={onClose}
        title=''
        subtitle=''
        width='wide'
        className='pb-0'
        customHeader={
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-border'>
                <User className='h-5 w-5 text-muted-foreground' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-3'>
                  <h2 className='text-lg font-semibold text-foreground truncate'>
                    {person.name}
                  </h2>
                  {person.linkedin_url && (
                    <a
                      href={person.linkedin_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-muted-foreground hover:text-primary transition-colors'
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
                <p className='text-sm text-muted-foreground truncate'>
                  {person.company_role || 'Contact Information'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0 ml-4'>
              {/* Favourite button removed */}
              <Button
                size='sm'
                variant='ghost'
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSendMessage();
                }}
                className='h-8 w-8 p-0 border border-border rounded-md hover:border-border/60 text-muted-foreground hover:text-foreground bg-white'
                title='Send message'
              >
                <Mail className='h-4 w-4' />
              </Button>
              {campaigns.length > 0 && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCampaignSelect(true);
                  }}
                  className='h-8 w-8 p-0 border border-border rounded-md hover:border-border/60 text-muted-foreground hover:text-foreground bg-white'
                  title='Add to campaign'
                >
                  <ListPlus className='h-4 w-4' />
                </Button>
              )}
              <IconOnlyAssignmentCell
                ownerId={person.owner_id}
                entityId={person.id}
                entityType='people'
                onAssignmentChange={() => {
                  onUpdate?.();
                  fetchPersonDetails();
                }}
              />
              <UnifiedStatusDropdown
                entityId={person.id}
                entityType='people'
                currentStatus={person.people_stage || 'new_lead'}
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
                onStatusChange={() => {
                  onUpdate?.();
                  fetchPersonDetails();
                }}
              />
            </div>
          </div>
        }
      >
        <div className='flex gap-0 h-full -mx-6'>
          {/* Left Column - Tabs and Content */}
          <section className='flex-1 min-w-0 flex flex-col overflow-hidden m-0 p-0'>
            {/* Tabs for Organization */}
            <div className='pt-3 pb-3 pl-6 pr-0 flex-shrink-0 overflow-visible'>
              <TabNavigation
                tabs={tabOptions}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
                variant='pill'
                size='sm'
                className='w-full mr-0 pr-0'
              />
            </div>

            {/* Tab Content - Scrollable */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden select-text m-0 p-0'>
              {activeTab === 'overview' && (
              <div className='space-y-4 px-6 pb-8'>
                  {/* Divider */}
                  <div className='w-full border-t border-border'></div>

                {/* Person Details moved to sidebar */}

                  {/* Campaign Enrollment Section */}
                  {enrolledCampaigns.length > 0 && (
                    <div className='mt-8 mb-24'>
                      <SlideOutSection title='Campaigns'>
                        <div className='space-y-2'>
                          {enrolledCampaigns.map(campaign => (
                            <div
                              key={campaign.id}
                              className='flex items-center gap-2 p-2 bg-muted rounded-md border border-border'
                            >
                              <ListPlus className='h-4 w-4 text-muted-foreground' />
                              <span className='text-sm text-foreground flex-1'>
                                {campaign.name}
                              </span>
                              <StatusBadge
                                status={
                                  campaign.status === 'active'
                                    ? 'active'
                                    : campaign.status === 'completed'
                                      ? 'completed'
                                      : 'paused'
                                }
                                size='sm'
                              />
                            </div>
                          ))}
                        </div>
                      </SlideOutSection>
                    </div>
                  )}

                  {/* Source Tracking Section */}
                  {(person?.lead_source || person?.source_details) && (
                    <div className='mt-8 mb-24'>
                      <div className='p-4 bg-primary/10 rounded-lg border border-primary/20'>
                        <div className='flex items-start gap-2'>
                          <Target className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                          <div className='flex-1'>
                            <div className='text-xs font-semibold text-primary mb-1 flex items-center gap-1'>
                              {person?.lead_source
                                ?.replace(/_/g, ' ')
                                .replace(/\b\w/g, l => l.toUpperCase()) ||
                                'Unknown Source'}
                              {person?.source_date && (
                                <span className='font-medium'>
                                  •{' '}
                                  {format(
                                    new Date(person.source_date),
                                    'MMM d, yyyy'
                                  )}
                                </span>
                              )}
                            </div>
                            {person?.source_details && (
                              <p className='text-sm text-primary'>
                                {person.source_details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Company Details (moved from Company tab) */}
                  {company && (
                    <div className='mt-12 mb-24'>
                      <SlideOutSection title='Company'>
                        <div className='mt-2'>
                          <SlideOutGrid items={companyDetailsItems} />
                        </div>
                        {company.score_reason && (
                          <div className='mt-6'>
                            <div className='p-4 bg-primary/10 rounded-lg border border-primary/20'>
                              <h5 className='text-sm font-semibold text-blue-900 mb-2'>
                                Company Analysis
                              </h5>
                              <p className='text-sm text-primary leading-relaxed'>
                                {company.score_reason}
                              </p>
                            </div>
                          </div>
                        )}
                        {otherPeople.length > 0 && (
                          <div className='mt-8'>
                            <SlideOutSection title={`Other Company Contacts (${otherPeople.length})`}>
                              <div className='space-y-3'>
                                {otherPeople.map(otherPerson => (
                                  <div
                                    key={otherPerson.id}
                                    onClick={() => handlePersonClick(otherPerson.id)}
                                    className='flex items-center gap-3 p-3 bg-muted rounded-lg border border-border hover:bg-gray-100 transition-colors cursor-pointer'
                                  >
                                    <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
                                      <User className='h-5 w-5 text-muted-foreground' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <div className='font-medium text-sm text-foreground truncate'>
                                        {otherPerson.name}
                                      </div>
                                      <div className='text-xs text-muted-foreground truncate'>
                                        {otherPerson.company_role || 'No role specified'}
                                      </div>
                                      {otherPerson.employee_location && (
                                        <div className='text-xs text-muted-foreground truncate mt-0.5'>
                                          {otherPerson.employee_location}
                                        </div>
                                      )}
                                    </div>
                                    {otherPerson.people_stage && (
                                      <StatusBadge
                                        status={otherPerson.people_stage}
                                        size='sm'
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </SlideOutSection>
                          </div>
                        )}
                      </SlideOutSection>
                    </div>
                  )}

                  {/* Jobs (moved from Jobs tab) */}
                  <div className='mt-12 mb-24' id='jobs-section'>
                    <SlideOutSection title='Jobs'>
                      {jobs.length > 0 ? (
                        <div className='space-y-3'>
                          {jobs.map(job => {
                            const currentJobStatus = job.qualification_status || 'new';
                            return (
                              <div
                                key={job.id}
                                onClick={() => handleJobClick(job.id)}
                                className='flex items-center gap-3 p-3 bg-muted rounded-lg border border-border hover:bg-gray-100 transition-colors cursor-pointer'
                              >
                                <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
                                  <Calendar className='h-5 w-5 text-muted-foreground' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                  <div className='font-medium text-sm text-foreground truncate'>
                                    {job.title || 'Untitled Job'}
                                  </div>
                                  <div className='text-xs text-muted-foreground truncate'>
                                    {job.function || 'No function specified'}
                                  </div>
                                  {job.location && (
                                    <div className='text-xs text-muted-foreground truncate mt-0.5'>
                                      {job.location}
                                    </div>
                                  )}
                                </div>
                                <StatusBadge status={currentJobStatus} size='sm' />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className='text-center py-6 text-muted-foreground'>
                          <Calendar className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                          <p className='text-sm'>No jobs available</p>
                        </div>
                      )}
                    </SlideOutSection>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className='flex flex-col px-6'>
                  <div className='mt-6 mb-8'>
                    <SlideOutSection title='Activity'>
                      <div className='space-y-2 select-text overflow-x-hidden'>
                        {interactions.length > 0 ? (
                          interactions.map(interaction => {
                            const interactionType = getInteractionTypeDisplay(
                              interaction.interaction_type
                            );
                            let dotColor = 'bg-primary/100';
                            if (
                              interaction.interaction_type?.includes('reply') ||
                              interaction.interaction_type?.includes('positive')
                            ) {
                              dotColor = 'bg-emerald-500';
                            } else if (
                              interaction.interaction_type?.includes('decline') ||
                              interaction.interaction_type?.includes('negative')
                            ) {
                              dotColor = 'bg-destructive/100';
                            }

                            return (
                              <div
                                key={interaction.id}
                                className='flex gap-3 p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border select-text'
                              >
                                <div
                                  className={`flex-shrink-0 w-2 h-2 rounded-full ${dotColor} mt-1.5`}
                                />
                                <div className='flex-1 min-w-0'>
                                  <div className='text-xs font-medium text-foreground'>
                                    {interactionType}
                                  </div>
                                  {interaction.subject && (
                                    <div className='text-xs text-muted-foreground mt-0.5'>
                                      {interaction.subject}
                                    </div>
                                  )}
                                  <div className='text-xs text-muted-foreground mt-1'>
                                    {formatDate(interaction.occurred_at)}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className='text-center py-8 text-muted-foreground text-sm'>
                            No activity yet
                          </div>
                        )}
                      </div>
                    </SlideOutSection>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className='flex flex-col px-6'>
                  <NotesSection
                    entityId={personId || ''}
                    entityType='person'
                    entityName={person?.name || 'Person'}
                    className='px-0'
                  />
                </div>
              )}

              {activeTab === 'ai' && (
                <div className='flex flex-col px-6'>
                  <div className='mt-6 mb-8'>
                    <SlideOutSection
                      title={
                        <span className='flex items-center gap-1.5'>
                          <Sparkles className='h-4 w-4' /> Email AI Message
                        </span>
                      }
                    >
                      {person?.email_ai_message ? (
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {person.email_ai_message}
                        </div>
                      ) : (
                        <div className='text-sm text-muted-foreground'>No email AI message</div>
                      )}
                    </SlideOutSection>
                  </div>

                  <div className='mt-6 mb-8'>
                    <SlideOutSection
                      title={
                        <span className='flex items-center gap-1.5'>
                          <Sparkles className='h-4 w-4' /> LinkedIn AI Message
                        </span>
                      }
                    >
                      {person?.linkedin_ai_message ? (
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {person.linkedin_ai_message}
                        </div>
                      ) : (
                        <div className='text-sm text-muted-foreground'>No LinkedIn AI message</div>
                      )}
                    </SlideOutSection>
                  </div>

                  <div className='mt-6 mb-12'>
                    <SlideOutSection
                      title={
                        <span className='flex items-center gap-1.5'>
                          <Sparkles className='h-4 w-4' /> User AI Message
                        </span>
                      }
                    >
                      {person?.ai_user_message ? (
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {person.ai_user_message}
                        </div>
                      ) : (
                        <div className='text-sm text-muted-foreground'>No user AI message</div>
                      )}
                    </SlideOutSection>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column - Sidebar */}
          <div className='w-80 flex-shrink-0 border-l border-border flex flex-col h-full overflow-hidden ml-0'>
            <div className='flex-1 flex flex-col overflow-y-auto'>
              {/* Contact Details Section */}
              <div className='px-6 pt-6'>
                <div className='mb-4'>
                  <button className='flex items-center gap-2 w-full text-left'>
                    <ChevronDown className='h-4 w-4 text-muted-foreground' />
                    <h3 className='text-base font-semibold text-foreground'>
                      Record Details
                    </h3>
                  </button>
                </div>
                <div className='space-y-3'>
                  {/* Name */}
                  <div className='flex items-center gap-3'>
                    <User className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Name</span>
                      <span className='text-sm text-foreground font-medium text-right'>
                        {person?.name || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Company */}
                  <div className='flex items-center gap-3'>
                    <Building2 className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Company</span>
                      <button
                        onClick={() => company?.id && handleCompanyClick(company.id)}
                        className='flex items-center gap-2 text-right hover:underline'
                        title='View company'
                      >
                        {company ? (
                          <img
                            src={
                              getCompanyLogoUrlSync(
                                company.name,
                                company.website || undefined
                              ) || ''
                            }
                            alt={company.name}
                            className='w-4 h-4 rounded-sm border border-border'
                          />
                        ) : (
                          <Building2 className='h-4 w-4 text-muted-foreground' />
                        )}
                        <span className='text-sm text-foreground'>
                          {company?.name || '-'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Email</span>
                      {person?.email_address ? (
                        <a
                          href={`mailto:${person.email_address}`}
                          className='text-sm text-primary hover:text-primary underline text-right'
                        >
                          {person.email_address}
                        </a>
                      ) : (
                        <span className='text-sm text-muted-foreground text-right'>-</span>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Location</span>
                      <span className='text-sm text-foreground text-right'>
                        {person?.employee_location
                          ? person.employee_location
                              .replace(/,?\s*Australia\s*,?/gi, '')
                              .replace(/^,\s*|,\s*$/g, '')
                              .trim() || '-'
                          : '-'}
                      </span>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className='flex items-center gap-3'>
                    <Link2 className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>LinkedIn</span>
                      {person?.linkedin_url ? (
                        <a
                          href={person.linkedin_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-primary hover:text-primary underline text-right'
                        >
                          Profile
                        </a>
                      ) : (
                        <span className='text-sm text-muted-foreground text-right'>-</span>
                      )}
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className='flex items-center gap-3'>
                    <Sparkles className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Match Score</span>
                      <div className='text-right'>
                        {person?.lead_score ? (
                          <ScoreBadge score={person.lead_score} variant='compact' />
                        ) : (
                          <span className='text-sm text-muted-foreground'>-</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Last Interaction */}
                  <div className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Last Interaction
                      </span>
                      <span className='text-sm text-foreground text-right'>
                        {person?.last_interaction_at
                          ? formatDistanceToNow(
                              new Date(person.last_interaction_at),
                              {
                                addSuffix: true,
                              }
                            )
                          : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Added */}
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Added</span>
                      <span className='text-sm text-foreground text-right'>
                        {person?.created_at
                          ? formatDistanceToNow(new Date(person.created_at), {
                              addSuffix: true,
                            })
                          : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Jobs */}
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>Jobs</span>
                      <button
                        onClick={() => {
                          setActiveTab('overview');
                          const el = document.getElementById('jobs-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className='text-sm text-primary hover:text-primary underline text-right'
                      >
                        {jobs.length}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Selection Dialog */}
        <AlertDialog
          open={showCampaignSelect}
          onOpenChange={setShowCampaignSelect}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add to Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Select a campaign to enroll this contact.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='py-4'>
              <Select onValueChange={handleAddToCampaign} defaultValue=''>
                <SelectTrigger>
                  <SelectValue placeholder='Select a campaign' />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Compose Email Dialog */}
        <Dialog open={showComposeEmail} onOpenChange={setShowComposeEmail}>
          <DialogContent className='sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Compose email</DialogTitle>
            </DialogHeader>
            <div className='mt-2'>
              <EmailComposer
                selectedPerson={person as Tables<'people'>}
                variant='compact'
                onSent={() => {
                  setShowComposeEmail(false);
                  onUpdate?.();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </SlideOutPanel>
    );
  }
);

PersonDetailsSlideOutComponent.displayName = 'PersonDetailsSlideOutComponent';

export const PersonDetailsSlideOut = memo(PersonDetailsSlideOutComponent);
