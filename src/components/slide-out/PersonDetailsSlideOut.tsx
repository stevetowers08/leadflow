import { StatusBadge } from '@/components/StatusBadge';
import { PersonReplyAnalytics } from '@/components/analytics/PersonReplyAnalytics';
import { PersonMessagingPanel } from '@/components/people/PersonMessagingPanel';
import { UnifiedActionComponent } from '@/components/shared/UnifiedActionComponent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/services/logoService';
import { useStatusAutomation } from '@/services/statusAutomationService';
import { Company, Person } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { format, formatDistanceToNow } from 'date-fns';
import { ExternalLink, Mail, Target, User } from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { GridItem, SlideOutGrid } from './SlideOutGrid';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutSection } from './SlideOutSection';

interface PersonDetailsSlideOutProps {
  personId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export const PersonDetailsSlideOut: React.FC<PersonDetailsSlideOutProps> = memo(
  ({ personId, isOpen, onClose, onUpdate }) => {
    const [person, setPerson] = useState<Person | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [otherPeople, setOtherPeople] = useState<Person[]>([]);
    const [campaigns, setCampaigns] = useState<
      Array<{ id: string; name: string }>
    >([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const statusAutomation = useStatusAutomation();

    const fetchPersonDetails = useCallback(async () => {
      if (!personId) return;

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
    }, [personId, toast]);

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
              { skipNotification: true } // We show our own toast below
            );
          } catch (statusError) {
            console.error('Failed to update company status:', statusError);
            // Don't block - person stage already updated
          }
        }

        toast({
          title: 'Success',
          description: `Person stage updated to ${getStatusDisplayText(newStage)}`,
        });

        onUpdate?.();
        onClose();
      } catch (error) {
        console.error('Error updating person stage:', error);
        toast({
          title: 'Error',
          description: 'Failed to update person stage',
          variant: 'destructive',
        });
      }
    };

    const personDetailsItems: GridItem[] = useMemo(
      () => [
        {
          label: 'Name',
          value: person?.name || '-',
        },
        {
          label: 'Company Role',
          value: person?.company_role || '-',
        },
        {
          label: 'Email',
          value: person?.email_address ? (
            <a
              href={`mailto:${person.email_address}`}
              className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
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
              className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
            >
              Profile <ExternalLink className='h-3 w-3' />
            </a>
          ) : (
            '-'
          ),
        },
        {
          label: 'Stage',
          value: person?.people_stage ? (
            <StatusBadge status={person.people_stage} size='sm' />
          ) : (
            '-'
          ),
        },
        {
          label: 'Lead Score',
          value: person?.lead_score || '-',
        },
        {
          label: 'Confidence Level',
          value: person?.confidence_level || '-',
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
      [person]
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
          : [],
      [company]
    );

    if (!person) return null;

    return (
      <SlideOutPanel
        isOpen={isOpen}
        onClose={onClose}
        title={person?.name || 'Person Details'}
        subtitle={person?.company_role || ''}
        footer={
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <UnifiedActionComponent
                entityType='person'
                entityIds={personId ? [personId] : []}
                entityNames={person ? [person?.name || 'Unknown'] : []}
                onActionComplete={onUpdate}
              />
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => handleStageChange('not_interested')}
                disabled={loading}
              >
                Not Interested
              </Button>
              <Button
                variant='outline'
                onClick={() => handleStageChange('interested')}
                disabled={loading}
              >
                Interested
              </Button>
            </div>
          </div>
        }
      >
        {loading ? (
          <div className='text-center py-6 text-gray-500'>Loading...</div>
        ) : (
          <>
            {/* Person Details Section */}
            <SlideOutSection title='Person Details'>
              <SlideOutGrid items={personDetailsItems} />
            </SlideOutSection>

            {/* Source Tracking Section */}
            {(person?.lead_source || person?.source_details) && (
              <SlideOutSection title='Lead Source'>
                <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <div className='flex items-start gap-2'>
                    <Target className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                    <div className='flex-1'>
                      <div className='text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1'>
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
                        <p className='text-sm text-blue-800'>
                          {person.source_details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </SlideOutSection>
            )}

            {/* Company Information Section */}
            {company && (
              <SlideOutSection title='Company Information'>
                <SlideOutGrid items={companyDetailsItems} />

                {/* Company AI Analysis if available */}
                {company.score_reason && (
                  <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                    <h5 className='text-sm font-semibold text-blue-900 mb-2'>
                      Company Analysis
                    </h5>
                    <p className='text-sm text-blue-800 leading-relaxed'>
                      {company.score_reason}
                    </p>
                  </div>
                )}
              </SlideOutSection>
            )}

            {/* Other People at Company Section */}
            {otherPeople.length > 0 && (
              <SlideOutSection
                title={`Other Employees (${otherPeople.length})`}
              >
                <div className='space-y-3'>
                  {otherPeople.map(otherPerson => (
                    <div
                      key={otherPerson.id}
                      className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                    >
                      <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
                        <User className='h-5 w-5 text-gray-500' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='font-medium text-sm text-gray-900 truncate'>
                          {otherPerson.name}
                        </div>
                        <div className='text-xs text-gray-500 truncate'>
                          {otherPerson.company_role || 'No role specified'}
                        </div>
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
            )}

            {/* Reply Analytics Section */}
            {person && (
              <SlideOutSection title='Reply Analytics'>
                <PersonReplyAnalytics person={person} showDetails={true} />
              </SlideOutSection>
            )}

            {/* Communication History */}
            {person?.last_reply_at && (
              <SlideOutSection title='Recent Communication'>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <div className='text-xs text-gray-500 mb-1'>
                    Last Reply via {person?.last_reply_channel || 'Unknown'} •{' '}
                    {formatDistanceToNow(new Date(person.last_reply_at), {
                      addSuffix: true,
                    })}
                  </div>
                  {person?.last_reply_message && (
                    <p className='text-sm text-gray-700 mt-2'>
                      {person.last_reply_message}
                    </p>
                  )}
                </div>
              </SlideOutSection>
            )}

            {/* Conversations & Messaging */}
            <SlideOutSection title='Conversations'>
              {person && (
                <PersonMessagingPanel person={person} campaigns={campaigns} />
              )}
            </SlideOutSection>
          </>
        )}
      </SlideOutPanel>
    );
  }
);

PersonDetailsSlideOut.displayName = 'PersonDetailsSlideOut';
