'use client';

import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { EnrichmentDataDisplay } from '@/components/leads/EnrichmentDataDisplay';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getCompanyLogoUrlSync } from '@/services/logoService';
import { Company, Lead } from '@/types/database';
import { bulkAddToCampaign } from '@/services/bulk/bulkPeopleService';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { getErrorMessage } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Building2,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Flame,
  Image as ImageIcon,
  ListPlus,
  Mail,
  Phone,
  Snowflake,
  Sparkles,
  Target,
  User,
  Zap,
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

interface LeadDetailsSlideOutProps {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  initialTab?: 'overview' | 'ai' | 'activity';
}

/**
 * Computes full name from first_name and last_name
 */
const getLeadFullName = (lead: Lead | null): string => {
  if (!lead) return 'Unknown';
  const parts = [lead.first_name, lead.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'Unknown';
};

/**
 * Lead Details Slide-Out Component
 *
 * Displays comprehensive lead information in a slide-out panel.
 * Uses only actual leads table fields per database schema.
 */
const LeadDetailsSlideOutComponent: React.FC<LeadDetailsSlideOutProps> = memo(
  ({ leadId, isOpen, onClose, onUpdate, initialTab }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [lead, setLead] = useState<Lead | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [otherLeads, setOtherLeads] = useState<Lead[]>([]);
    const [campaigns, setCampaigns] = useState<
      Array<{ id: string; name: string }>
    >([]);
    const [enrolledCampaigns, setEnrolledCampaigns] = useState<
      Array<{ id: string; name: string; status: string }>
    >([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(initialTab ?? 'overview');
    const [showCampaignSelect, setShowCampaignSelect] = useState(false);
    const [showComposeEmail, setShowComposeEmail] = useState(false);
    const { toast } = useToast();

    // Sync tab when initialTab changes
    useEffect(() => {
      if (isOpen && initialTab) {
        setActiveTab(initialTab);
      }
    }, [isOpen, initialTab]);

    // Close email dialog when lead changes
    useEffect(() => {
      setShowComposeEmail(false);
    }, [leadId]);

    // Fetch lead details
    const fetchLeadDetails = useCallback(async () => {
      if (!leadId || !isOpen) return;

      setLoading(true);
      try {
        // Fetch lead with all fields
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .single();

        if (leadError) throw leadError;
        setLead(leadData as Lead);

        // Fetch company by name if lead has company name
        // Note: leads table doesn't have company_id, only company (text field)
        if (leadData?.company) {
          try {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .eq('name', leadData.company)
              .maybeSingle();

            if (!companyError && companyData) {
              setCompany(companyData as Company);

              // Fetch other leads at same company (by name)
              const { data: otherLeadsData, error: otherLeadsError } =
                await supabase
                  .from('leads')
                  .select(
                    'id, first_name, last_name, job_title, status, company'
                  )
                  .eq('company', leadData.company)
                  .neq('id', leadId)
                  .limit(5);

              if (!otherLeadsError && otherLeadsData) {
                setOtherLeads(otherLeadsData as Lead[]);
              }
            }
          } catch (err) {
            // Silently fail - company lookup is optional
            console.debug('Could not fetch company:', err);
          }
        }

        // Fetch enrolled campaigns
        if (leadData?.id) {
          try {
            const { data: enrolledData, error: enrolledError } = await supabase
              .from('campaign_sequence_leads' as never)
              .select(
                `
                id,
                status,
                campaign_sequences(id, name)
              `
              )
              .eq('lead_id', leadData.id)
              .in('status', ['active', 'paused', 'completed']);

            if (enrolledError) {
              // Handle various error cases gracefully
              const errorMessage = getErrorMessage(enrolledError);
              const errorCode = (enrolledError as { code?: string })?.code;
              const statusCode = (enrolledError as { status?: number })?.status;

              // Check for table not found, schema cache, RLS, or HTTP errors
              if (
                errorMessage?.includes('schema cache') ||
                errorMessage?.includes('does not exist') ||
                errorMessage?.includes('permission denied') ||
                errorMessage?.includes('row-level security') ||
                errorCode === 'PGRST116' || // Table not found
                errorCode === '42501' || // Insufficient privilege
                statusCode === 400 ||
                statusCode === 404
              ) {
                // Silently handle - table may not exist or RLS may block in bypass auth mode
                console.debug(
                  '[LeadDetailsSlideOut] campaign_sequence_leads query failed (expected in some environments):',
                  errorMessage
                );
                setEnrolledCampaigns([]);
              } else {
                // Log unexpected errors
                console.warn(
                  '[LeadDetailsSlideOut] Error fetching enrolled campaigns:',
                  errorMessage
                );
                setEnrolledCampaigns([]);
              }
            } else if (enrolledData) {
              setEnrolledCampaigns(
                enrolledData
                  .filter(
                    (item: { campaign_sequences?: unknown }) =>
                      item.campaign_sequences &&
                      typeof item.campaign_sequences === 'object' &&
                      !Array.isArray(item.campaign_sequences)
                  )
                  .map(
                    (item: {
                      campaign_sequences?: { id?: string; name?: string };
                      status?: string;
                    }) => ({
                      id:
                        (
                          item.campaign_sequences as {
                            id: string;
                            name: string;
                          }
                        ).id || '',
                      name:
                        (
                          item.campaign_sequences as {
                            id: string;
                            name: string;
                          }
                        ).name || '',
                      status: item.status || 'active',
                    })
                  )
              );
            } else {
              setEnrolledCampaigns([]);
            }
          } catch (err) {
            // Catch any unexpected errors and handle gracefully
            const errorMessage = getErrorMessage(err);
            console.debug(
              '[LeadDetailsSlideOut] Error in enrolled campaigns query (handled gracefully):',
              errorMessage
            );
            setEnrolledCampaigns([]);
          }
        }
      } catch (error) {
        console.error('Error fetching lead details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load lead details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, [leadId, isOpen, toast]);

    useEffect(() => {
      if (leadId && isOpen) {
        fetchLeadDetails();
      }
    }, [leadId, isOpen, fetchLeadDetails]);

    // Fetch available campaigns
    useEffect(() => {
      const fetchCampaigns = async () => {
        try {
          const allCampaigns: Array<{
            id: string;
            name: string;
            type?: 'email' | 'lemlist';
          }> = [];

          // Fetch email campaigns from workflows
          try {
            const { data: workflows, error: workflowError } = await supabase
              .from('workflows')
              .select('id, name, pause_rules')
              .order('name', { ascending: true });

            if (!workflowError && workflows) {
              // Filter active workflows
              const activeWorkflows = workflows.filter(w => {
                const status =
                  (w.pause_rules as { status?: string })?.status || 'active';
                return status === 'active';
              });

              allCampaigns.push(
                ...activeWorkflows.map(c => ({
                  id: c.id,
                  name: c.name,
                  type: 'email' as const,
                }))
              );
            }
          } catch (emailErr) {
            const errorMsg = getErrorMessage(emailErr);
            if (
              !errorMsg.includes('schema cache') &&
              !errorMsg.includes('does not exist')
            ) {
              console.error(
                '[LeadDetailsSlideOut] Error fetching email campaigns:',
                emailErr
              );
            }
          }

          // Fetch Lemlist campaigns
          if (user) {
            try {
              const { getLemlistCampaigns } =
                await import('@/services/lemlistWorkflowService');
              const lemlistCampaigns = await getLemlistCampaigns(user.id);
              allCampaigns.push(
                ...lemlistCampaigns.map(c => ({
                  id: c.id,
                  name: `[Lemlist] ${c.name}`,
                  type: 'lemlist' as const,
                }))
              );
            } catch (lemlistErr) {
              console.debug(
                '[LeadDetailsSlideOut] Could not fetch Lemlist campaigns:',
                lemlistErr
              );
            }
          }

          setCampaigns(allCampaigns);
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          if (
            !errorMessage.includes('schema cache') &&
            !errorMessage.includes('does not exist')
          ) {
            console.error(
              '[LeadDetailsSlideOut] Error fetching campaigns:',
              errorMessage
            );
          }
          setCampaigns([]);
        }
      };

      fetchCampaigns();
    }, [user]);

    const handleSendMessage = useCallback(() => {
      if (!leadId) return;
      if (!lead?.email) {
        toast({
          title: 'No Email Address',
          description: 'This lead does not have an email address.',
          variant: 'destructive',
        });
        return;
      }
      setShowComposeEmail(true);
    }, [leadId, lead, toast]);

    const handleAddToCampaign = useCallback(
      async (campaignId: string) => {
        if (!leadId || !user) return;

        const isLemlistCampaign = campaignId.startsWith('cam_');

        if (isLemlistCampaign) {
          try {
            const { bulkAddPeopleToLemlistCampaign } =
              await import('@/services/bulkLemlistService');
            const result = await bulkAddPeopleToLemlistCampaign(
              user.id,
              campaignId,
              [leadId]
            );

            toast({
              title: result.success > 0 ? 'Success' : 'Error',
              description:
                result.success > 0
                  ? `Added ${result.success} lead(s) to Lemlist campaign`
                  : result.errors[0]?.error || 'Failed to add lead to campaign',
              variant: result.success > 0 ? 'default' : 'destructive',
            });

            if (result.success > 0) {
              setShowCampaignSelect(false);
              fetchLeadDetails();
              onUpdate?.();
            }
          } catch (error) {
            toast({
              title: 'Error',
              description:
                error instanceof Error
                  ? error.message
                  : 'Failed to add lead to Lemlist campaign',
              variant: 'destructive',
            });
          }
        } else {
          const result = await bulkAddToCampaign([leadId], campaignId);
          toast({
            title: result.success ? 'Success' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
          });
          if (result.success) {
            setShowCampaignSelect(false);
            fetchLeadDetails();
            onUpdate?.();
          }
        }
      },
      [leadId, user, toast, onUpdate, fetchLeadDetails]
    );

    const handleCompanyClick = (companyId: string) => {
      onClose();
      router.push(`/companies?id=${companyId}`);
    };

    const handleLeadClick = (clickedLeadId: string) => {
      if (clickedLeadId === leadId) return;
      onClose();
      router.push(`/leads?id=${clickedLeadId}`);
    };

    // Computed values
    const leadFullName = useMemo(() => getLeadFullName(lead), [lead]);

    const tabOptions: TabOption[] = useMemo(
      () => [
        { id: 'overview', label: 'Overview', count: 0, icon: FileText },
        {
          id: 'activity' as const,
          label: 'Activity',
          count: 0,
          icon: Mail,
        },
        {
          id: 'ai' as const,
          label: 'AI Messages',
          count: 0,
          icon: Sparkles,
        },
      ],
      []
    );

    // Lead details grid items
    const leadDetailsItems: GridItem[] = useMemo(
      () => [
        {
          label: 'Name',
          value: leadFullName,
        },
        {
          label: 'Email',
          value: lead?.email ? (
            <a
              href={`mailto:${lead.email}`}
              className='text-primary hover:text-primary flex items-center gap-1'
            >
              <Mail className='h-3 w-3' />
              {lead.email}
            </a>
          ) : (
            '-'
          ),
        },
        {
          label: 'Phone',
          value: lead?.phone ? (
            <a
              href={`tel:${lead.phone}`}
              className='text-primary hover:text-primary flex items-center gap-1'
            >
              <Phone className='h-3 w-3' />
              {lead.phone}
            </a>
          ) : (
            '-'
          ),
        },
        {
          label: 'Company',
          value: lead?.company || company?.name || '-',
        },
        {
          label: 'Job Title',
          value: lead?.job_title || '-',
        },
        {
          label: 'Quality Rank',
          value: lead?.quality_rank
            ? (() => {
                const quality = lead.quality_rank;
                const variants = {
                  hot: {
                    icon: Flame,
                    className:
                      'bg-destructive/10 text-destructive border-destructive/20',
                  },
                  warm: {
                    icon: Zap,
                    className: 'bg-warning/10 text-warning border-warning/20',
                  },
                  cold: {
                    icon: Snowflake,
                    className: 'bg-muted text-muted-foreground border-border',
                  },
                };
                const variant = variants[quality] || variants.warm;
                const Icon = variant.icon;

                return (
                  <Badge variant='outline' className={variant.className}>
                    <Icon className='h-3 w-3 mr-1' />
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </Badge>
                );
              })()
            : '-',
        },
        {
          label: 'Status',
          value: lead?.status
            ? (() => {
                const status = lead.status || 'processing';
                const statusColors = {
                  processing: 'bg-muted text-muted-foreground',
                  active: 'bg-success/10 text-success',
                  replied_manual: 'bg-primary/10 text-primary',
                };
                return (
                  <Badge
                    variant='outline'
                    className={
                      statusColors[status as keyof typeof statusColors] ||
                      statusColors.processing
                    }
                  >
                    {getStatusDisplayText(status)}
                  </Badge>
                );
              })()
            : '-',
        },
        {
          label: 'Show',
          value:
            lead?.show_name || lead?.show_date
              ? (() => {
                  let dateStr = '';
                  if (lead.show_date) {
                    try {
                      const date = new Date(lead.show_date);
                      if (!isNaN(date.getTime())) {
                        dateStr = ` (${format(date, 'MMM d, yyyy')})`;
                      }
                    } catch {
                      // Invalid date, ignore
                    }
                  }
                  return `${lead.show_name || ''}${dateStr}`.trim() || '-';
                })()
              : '-',
        },
        {
          label: 'Created',
          value: lead?.created_at
            ? formatDistanceToNow(new Date(lead.created_at), {
                addSuffix: true,
              })
            : '-',
        },
      ],
      [lead, company, leadFullName]
    );

    // Company details grid items
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
                  <Badge variant='outline' className='rounded-md font-medium'>
                    {company.lead_score}
                  </Badge>
                ) : (
                  '-'
                ),
              },
            ]
          : [],
      [company]
    );

    // Show loading state
    if (loading) {
      return (
        <SlideOutPanel
          isOpen={isOpen}
          onClose={onClose}
          title='Loading...'
          subtitle=''
          width='wide'
        >
          <div className='flex items-center justify-center py-12'>
            <div className='flex flex-col items-center gap-2'>
              <div className='h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
              <p className='text-sm text-muted-foreground'>
                Loading lead details...
              </p>
            </div>
          </div>
        </SlideOutPanel>
      );
    }

    // Early return if no lead
    if (!lead) return null;

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
              <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border'>
                <User className='h-5 w-5 text-muted-foreground' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-3'>
                  <h2 className='text-lg font-semibold text-foreground truncate'>
                    {leadFullName}
                  </h2>
                </div>
                <p className='text-sm text-muted-foreground truncate'>
                  {lead.job_title || lead.company || 'Lead Information'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0 ml-4'>
              <Button
                size='sm'
                variant='ghost'
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSendMessage();
                }}
                className='h-8 w-8 p-0 border border-border rounded-md hover:border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                title='Send message'
                disabled={!lead.email}
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
                  className='h-8 w-8 p-0 border border-border rounded-md hover:border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  title='Add to campaign'
                >
                  <ListPlus className='h-4 w-4' />
                </Button>
              )}
              <IconOnlyAssignmentCell
                ownerId={null}
                entityId={lead.id}
                entityType='leads'
                onAssignmentChange={() => {
                  onUpdate?.();
                  fetchLeadDetails();
                }}
              />
              <UnifiedStatusDropdown
                entityId={lead.id}
                entityType='leads'
                currentStatus={lead.status || 'processing'}
                availableStatuses={['processing', 'active', 'replied_manual']}
                onStatusChange={() => {
                  onUpdate?.();
                  fetchLeadDetails();
                }}
              />
            </div>
          </div>
        }
      >
        <div className='flex gap-0 h-full -mx-6'>
          {/* Left Column - Tabs and Content */}
          <section className='flex-1 min-w-0 flex flex-col overflow-hidden m-0 p-0'>
            {/* Tabs */}
            <div className='pt-3 pb-3 pl-6 pr-0 flex-shrink-0 overflow-visible'>
              <TabNavigation
                tabs={tabOptions}
                activeTab={activeTab}
                onTabChange={tabId => setActiveTab(tabId as typeof activeTab)}
                variant='pill'
                size='sm'
                className='w-full mr-0 pr-0'
              />
            </div>

            {/* Tab Content */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden select-text m-0 p-0'>
              {activeTab === 'overview' && (
                <div className='space-y-4 px-6 pb-8'>
                  <div className='w-full border-t border-border'></div>

                  {/* Campaign Enrollment */}
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

                  {/* AI Summary */}
                  {lead.ai_summary && (
                    <div className='mt-8 mb-24'>
                      <SlideOutSection title='AI Summary'>
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {lead.ai_summary}
                        </div>
                      </SlideOutSection>
                    </div>
                  )}

                  {/* Enrichment Data */}
                  <div className='mt-8 mb-24'>
                    <EnrichmentDataDisplay lead={lead} />
                  </div>

                  {/* Notes */}
                  {lead.notes && (
                    <div className='mt-8 mb-24'>
                      <SlideOutSection title='Notes'>
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {lead.notes}
                        </div>
                      </SlideOutSection>
                    </div>
                  )}

                  {/* Scan Image */}
                  {lead.scan_image_url && (
                    <div className='mt-8 mb-24'>
                      <SlideOutSection title='Business Card Scan'>
                        <div className='flex items-center gap-2'>
                          <ImageIcon className='h-4 w-4 text-muted-foreground' />
                          <a
                            href={lead.scan_image_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-sm text-primary hover:text-primary underline'
                          >
                            View scan image
                          </a>
                        </div>
                      </SlideOutSection>
                    </div>
                  )}

                  {/* Company Details */}
                  {company && (
                    <div className='mt-12 mb-24'>
                      <SlideOutSection title='Company'>
                        <div className='mt-2'>
                          <SlideOutGrid items={companyDetailsItems} />
                        </div>
                        {company.score_reason && (
                          <div className='mt-6'>
                            <div className='p-4 bg-primary/10 rounded-lg border border-primary/20'>
                              <h5 className='text-sm font-semibold text-foreground mb-2'>
                                Company Analysis
                              </h5>
                              <p className='text-sm text-primary leading-relaxed'>
                                {company.score_reason}
                              </p>
                            </div>
                          </div>
                        )}
                        {otherLeads.length > 0 && (
                          <div className='mt-8'>
                            <SlideOutSection
                              title={`Other Company Leads (${otherLeads.length})`}
                            >
                              <div className='space-y-3'>
                                {otherLeads.map(otherLead => (
                                  <div
                                    key={otherLead.id}
                                    onClick={() =>
                                      handleLeadClick(otherLead.id)
                                    }
                                    className='flex items-center gap-3 p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors cursor-pointer'
                                  >
                                    <div className='w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 border border-border'>
                                      <User className='h-5 w-5 text-muted-foreground' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <div className='font-medium text-sm text-foreground truncate'>
                                        {getLeadFullName(otherLead)}
                                      </div>
                                      <div className='text-xs text-muted-foreground truncate'>
                                        {otherLead.job_title || 'No title'}
                                      </div>
                                    </div>
                                    {otherLead.status && (
                                      <StatusBadge
                                        status={otherLead.status}
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
                </div>
              )}

              {activeTab === 'activity' && (
                <div className='flex flex-col px-6'>
                  <div className='mt-6 mb-8'>
                    <SlideOutSection title='Activity'>
                      <div className='space-y-2 select-text overflow-x-hidden'>
                        <div className='text-center py-8 text-muted-foreground text-sm'>
                          No activity yet
                        </div>
                      </div>
                    </SlideOutSection>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className='flex flex-col px-6'>
                  {lead.ai_icebreaker && (
                    <div className='mt-6 mb-8'>
                      <SlideOutSection title='AI Icebreaker'>
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {lead.ai_icebreaker}
                        </div>
                      </SlideOutSection>
                    </div>
                  )}

                  {lead.ai_summary && (
                    <div className='mt-6 mb-8'>
                      <SlideOutSection title='AI Summary'>
                        <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted border border-border rounded-md p-3'>
                          {lead.ai_summary}
                        </div>
                      </SlideOutSection>
                    </div>
                  )}

                  {!lead.ai_icebreaker && !lead.ai_summary && (
                    <div className='mt-6 mb-12'>
                      <SlideOutSection title='AI Messages'>
                        <div className='text-sm text-muted-foreground'>
                          No AI messages available
                        </div>
                      </SlideOutSection>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Right Column - Sidebar */}
          <div className='w-80 flex-shrink-0 border-l border-border flex flex-col h-full overflow-hidden ml-0'>
            <div className='flex-1 flex flex-col overflow-y-auto'>
              <div className='px-6 pt-6'>
                <div className='mb-4'>
                  <button className='flex items-center gap-2 w-full text-left'>
                    <ChevronDown className='h-4 w-4 text-muted-foreground' />
                    <h3 className='text-base font-semibold text-foreground'>
                      Lead Details
                    </h3>
                  </button>
                </div>
                <div className='space-y-3'>
                  {/* Name */}
                  <div className='flex items-center gap-3'>
                    <User className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Name
                      </span>
                      <span className='text-sm text-foreground font-medium text-right'>
                        {leadFullName}
                      </span>
                    </div>
                  </div>

                  {/* Company */}
                  <div className='flex items-center gap-3'>
                    <Building2 className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Company
                      </span>
                      <button
                        onClick={() =>
                          company?.id && handleCompanyClick(company.id)
                        }
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
                          {lead?.company || company?.name || '-'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Email
                      </span>
                      {lead?.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className='text-sm text-primary hover:text-primary underline text-right'
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className='text-sm text-muted-foreground text-right'>
                          -
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className='flex items-center gap-3'>
                    <Phone className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Phone
                      </span>
                      {lead?.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className='text-sm text-primary hover:text-primary underline text-right'
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        <span className='text-sm text-muted-foreground text-right'>
                          -
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job Title */}
                  <div className='flex items-center gap-3'>
                    <User className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Job Title
                      </span>
                      <span className='text-sm text-foreground text-right'>
                        {lead?.job_title || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Quality Rank */}
                  {lead?.quality_rank && (
                    <div className='flex items-center gap-3'>
                      <Zap className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                      <div className='flex-1 flex items-center justify-between gap-4'>
                        <span className='text-xs text-muted-foreground'>
                          Quality
                        </span>
                        <div className='text-right'>
                          {(() => {
                            const quality = lead.quality_rank;
                            const variants = {
                              hot: {
                                icon: Flame,
                                className:
                                  'bg-destructive/10 text-destructive border-destructive/20',
                              },
                              warm: {
                                icon: Zap,
                                className:
                                  'bg-warning/10 text-warning border-warning/20',
                              },
                              cold: {
                                icon: Snowflake,
                                className:
                                  'bg-muted text-muted-foreground border-border',
                              },
                            };
                            const variant = variants[quality] || variants.warm;
                            const Icon = variant.icon;

                            return (
                              <Badge
                                variant='outline'
                                className={variant.className}
                              >
                                <Icon className='h-3 w-3 mr-1' />
                                {quality.charAt(0).toUpperCase() +
                                  quality.slice(1)}
                              </Badge>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className='flex items-center gap-3'>
                    <Target className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Status
                      </span>
                      <div className='text-right'>
                        {lead?.status ? (
                          (() => {
                            const status = lead.status || 'processing';
                            const statusColors = {
                              processing: 'bg-muted text-muted-foreground',
                              active: 'bg-success/10 text-success',
                              replied_manual: 'bg-primary/10 text-primary',
                            };
                            return (
                              <Badge
                                variant='outline'
                                className={`text-xs ${
                                  statusColors[
                                    status as keyof typeof statusColors
                                  ] || statusColors.processing
                                }`}
                              >
                                {getStatusDisplayText(status)}
                              </Badge>
                            );
                          })()
                        ) : (
                          <span className='text-sm text-muted-foreground'>
                            -
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show */}
                  {(lead?.show_name || lead?.show_date) && (
                    <div className='flex items-center gap-3'>
                      <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                      <div className='flex-1 flex items-center justify-between gap-4'>
                        <span className='text-xs text-muted-foreground'>
                          Show
                        </span>
                        <span className='text-sm text-foreground text-right'>
                          {(() => {
                            let dateStr = '';
                            if (lead.show_date) {
                              try {
                                const date = new Date(lead.show_date);
                                if (!isNaN(date.getTime())) {
                                  dateStr = ` (${format(date, 'MMM d, yyyy')})`;
                                }
                              } catch {
                                // Invalid date, ignore
                              }
                            }
                            return (
                              `${lead.show_name || ''}${dateStr}`.trim() || '-'
                            );
                          })()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Created */}
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-4'>
                      <span className='text-xs text-muted-foreground'>
                        Created
                      </span>
                      <span className='text-sm text-foreground text-right'>
                        {lead?.created_at
                          ? formatDistanceToNow(new Date(lead.created_at), {
                              addSuffix: true,
                            })
                          : '-'}
                      </span>
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
                Select a campaign to enroll this lead.
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
            <div className='mt-2 p-4 text-center text-muted-foreground'>
              <p>Email composer is currently unavailable.</p>
              {lead?.email && (
                <p className='mt-2'>
                  <a
                    href={`mailto:${lead.email}`}
                    className='text-primary hover:underline'
                  >
                    Open email client
                  </a>
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </SlideOutPanel>
    );
  }
);

LeadDetailsSlideOutComponent.displayName = 'LeadDetailsSlideOutComponent';

export const LeadDetailsSlideOut = memo(LeadDetailsSlideOutComponent);
