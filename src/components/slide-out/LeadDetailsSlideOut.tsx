'use client';

import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
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
import { API_URLS } from '@/constants/urls';
import { Company, Lead } from '@/types/database';
import { bulkAddToCampaign } from '@/services/bulk/bulkPeopleService';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { getErrorMessage } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ShowSelector } from '@/components/shared/ShowSelector';
import { updateLead } from '@/services/leadsService';
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
import { logger } from '@/utils/productionLogger';

// Helper to get company initials
const getCompanyInitials = (name: string): string => {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Helper to get consistent color based on company name
const getCompanyColor = (name: string): { bg: string; text: string } => {
  const COMPANY_COLORS = [
    { bg: '4f46e5', text: 'ffffff' }, // Indigo
    { bg: '059669', text: 'ffffff' }, // Emerald
    { bg: 'dc2626', text: 'ffffff' }, // Red
    { bg: 'ea580c', text: 'ffffff' }, // Orange
    { bg: '7c3aed', text: 'ffffff' }, // Purple
    { bg: '0891b2', text: 'ffffff' }, // Cyan
    { bg: 'be185d', text: 'ffffff' }, // Pink
    { bg: 'b45309', text: 'ffffff' }, // Amber
  ] as const;
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COMPANY_COLORS[hash % COMPANY_COLORS.length];
};

// Company logo image component with proper error handling
const CompanyLogoImage: React.FC<{ company: Company; size?: number }> = memo(
  ({ company, size = 16 }) => {
    const [imageError, setImageError] = useState(false);

    // Use cached logo_url if available, otherwise generate sync URL
    const logoUrl =
      company.logo_url?.trim() ||
      getCompanyLogoUrlSync(company.name, company.website || undefined);

    // Generate fallback avatar URL with initials and consistent colors
    const initials = getCompanyInitials(company.name);
    const colors = getCompanyColor(company.name);
    const fallbackUrl = API_URLS.UI_AVATARS(
      initials,
      size,
      colors.bg,
      colors.text
    );

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    if (!logoUrl || imageError) {
      return (
        <img
          src={fallbackUrl}
          alt={company.name}
          className='w-4 h-4 rounded-sm flex-shrink-0'
        />
      );
    }

    return (
      <img
        src={logoUrl}
        alt={company.name}
        className='w-4 h-4 rounded-sm flex-shrink-0 object-contain'
        onError={handleImageError}
      />
    );
  }
);

CompanyLogoImage.displayName = 'CompanyLogoImage';

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
    const { toast } = useToast();

    // Sync tab when initialTab changes
    useEffect(() => {
      if (isOpen && initialTab) {
        setActiveTab(initialTab);
      }
    }, [isOpen, initialTab]);

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
        // Use case-insensitive matching to handle name variations
        if (leadData?.company) {
          try {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .ilike('name', `%${leadData.company.trim()}%`)
              .maybeSingle();

            if (!companyError && companyData) {
              logger.debug('[LeadDetailsSlideOut] Company data fetched:', {
                name: companyData.name,
                head_office: companyData.head_office,
                company_size: companyData.company_size,
                industry: companyData.industry,
                linkedin_url: companyData.linkedin_url,
                website: companyData.website,
              });
              setCompany(companyData as unknown as Company);

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
            logger.debug('Could not fetch company:', err);
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
                logger.debug(
                  '[LeadDetailsSlideOut] campaign_sequence_leads query failed (expected in some environments):',
                  errorMessage
                );
                setEnrolledCampaigns([]);
              } else {
                // Log unexpected errors
                logger.warn(
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
            logger.debug(
              '[LeadDetailsSlideOut] Error in enrolled campaigns query (handled gracefully):',
              errorMessage
            );
            setEnrolledCampaigns([]);
          }
        }
      } catch (error) {
        logger.error('Error fetching lead details:', error);
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
              logger.error(
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
              logger.debug(
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
            logger.error(
              '[LeadDetailsSlideOut] Error fetching campaigns:',
              errorMessage
            );
          }
          setCampaigns([]);
        }
      };

      fetchCampaigns();
    }, [user]);

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
          value: (
            <ShowSelector
              value={lead?.show_id || null}
              onValueChange={async showId => {
                if (!leadId) return;
                try {
                  await updateLead(leadId, { show_id: showId });
                  await fetchLeadDetails();
                  onUpdate?.();
                  toast({
                    title: 'Success',
                    description: 'Show updated successfully',
                  });
                } catch (error) {
                  toast({
                    title: 'Error',
                    description:
                      error instanceof Error
                        ? error.message
                        : 'Failed to update show',
                    variant: 'destructive',
                  });
                }
              }}
              className='w-full'
            />
          ),
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
                    {(() => {
                      const logoUrl =
                        company.logo_url?.trim() ||
                        getCompanyLogoUrlSync(
                          company.name,
                          company.website || undefined
                        );
                      return logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={company.name}
                          className='w-6 h-6 rounded'
                        />
                      ) : (
                        <div className='w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium'>
                          {getCompanyInitials(company.name)}
                        </div>
                      );
                    })()}
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
                    href={
                      company.website.startsWith('http')
                        ? company.website
                        : `https://${company.website}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:text-primary flex items-center gap-1'
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className='h-3 w-3' />
                  </a>
                ) : (
                  '-'
                ),
              },
              {
                label: 'LinkedIn',
                value: company.linkedin_url ? (
                  <a
                    href={
                      company.linkedin_url.startsWith('http')
                        ? company.linkedin_url
                        : `https://${company.linkedin_url}`
                    }
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
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 sm:gap-4'>
            {/* Lead info - stacks on mobile */}
            <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
              <div className='w-10 h-10 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border'>
                <User className='h-5 w-5 text-muted-foreground' />
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-base sm:text-lg font-semibold text-foreground truncate'>
                  {leadFullName}
                </h2>
                <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                  {lead.job_title || lead.company || 'Lead Information'}
                </p>
              </div>
            </div>
            {/* Actions - horizontal scroll on mobile with proper touch targets */}
            <div className='flex items-center gap-2 flex-shrink-0 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 scrollbar-hide'>
              {campaigns.length > 0 && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCampaignSelect(true);
                  }}
                  className='h-10 w-10 sm:h-8 sm:w-8 p-0 border border-border dark:border-border/70 rounded-md hover:border-border/80 dark:hover:border-border text-muted-foreground dark:text-foreground/70 hover:text-foreground dark:hover:text-foreground hover:bg-muted dark:hover:bg-muted/80 active:bg-muted/80 dark:active:bg-muted/90 touch-manipulation flex-shrink-0 transition-colors'
                  title='Add to workflow'
                >
                  <ListPlus className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Main container - single column on mobile, two columns on lg+ */}
        <div className='flex flex-col lg:flex-row gap-0 h-full -mx-4 md:-mx-6'>
          {/* Main Content Column - full width on mobile, flex on desktop */}
          <section className='flex-1 min-w-0 flex flex-col overflow-hidden m-0 p-0 order-2 lg:order-1'>
            {/* Tabs - horizontal scroll on mobile for touch */}
            <div className='pt-3 pb-3 px-4 md:pl-6 md:pr-0 flex-shrink-0 overflow-x-auto overflow-y-visible scrollbar-hide'>
              <TabNavigation
                tabs={tabOptions}
                activeTab={activeTab}
                onTabChange={tabId => setActiveTab(tabId as typeof activeTab)}
                variant='pill'
                size='sm'
                className='w-full min-w-max md:min-w-0 mr-0 pr-0'
              />
            </div>

            {/* Tab Content - responsive padding */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden select-text m-0 p-0 overscroll-behavior-y-contain'>
              {activeTab === 'overview' && (
                <div className='space-y-4 px-4 md:px-6 pb-8'>
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
                                    className='flex items-center gap-3 p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 dark:hover:bg-muted/60 transition-colors cursor-pointer'
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
                <div className='flex flex-col px-4 md:px-6'>
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
                <div className='flex flex-col px-4 md:px-6'>
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

          {/* Right Column - Sidebar (shows as collapsible card on mobile, sidebar on desktop) */}
          <div className='w-full lg:w-80 flex-shrink-0 lg:border-l border-border flex flex-col lg:h-full overflow-hidden order-1 lg:order-2 border-b lg:border-b-0'>
            <div className='flex-1 flex flex-col lg:overflow-y-auto'>
              <div className='px-4 md:px-6 py-4 lg:pt-6'>
                <div className='mb-3 lg:mb-4'>
                  <button className='flex items-center gap-2 w-full text-left touch-manipulation'>
                    <ChevronDown className='h-4 w-4 text-muted-foreground' />
                    <h3 className='text-sm lg:text-base font-semibold text-foreground'>
                      Lead Details
                    </h3>
                  </button>
                </div>
                {/* Details grid - compact on mobile, spacious on desktop */}
                <div className='space-y-2 lg:space-y-3'>
                  {/* Name */}
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <User className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
                        Name
                      </span>
                      <span className='text-sm text-foreground font-medium text-right truncate'>
                        {leadFullName}
                      </span>
                    </div>
                  </div>

                  {/* Company */}
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <Building2 className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
                        Company
                      </span>
                      <button
                        onClick={() =>
                          company?.id && handleCompanyClick(company.id)
                        }
                        className='flex items-center gap-2 text-right hover:underline active:opacity-70 touch-manipulation min-w-0'
                        title='View company'
                      >
                        {company ? (
                          <CompanyLogoImage company={company} size={16} />
                        ) : (
                          <Building2 className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                        )}
                        <span className='text-sm text-foreground truncate'>
                          {lead?.company || company?.name || '-'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Email - larger touch target on mobile */}
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <Mail className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
                        Email
                      </span>
                      {lead?.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className='text-sm text-primary hover:text-primary active:opacity-70 underline text-right truncate touch-manipulation py-1'
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

                  {/* Phone - larger touch target on mobile */}
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <Phone className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
                        Phone
                      </span>
                      {lead?.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className='text-sm text-primary hover:text-primary active:opacity-70 underline text-right touch-manipulation py-1'
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
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <User className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
                        Job Title
                      </span>
                      <span className='text-sm text-foreground text-right truncate'>
                        {lead?.job_title || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Quality Rank */}
                  {lead?.quality_rank && (
                    <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                      <Zap className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                      <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                        <span className='text-xs text-muted-foreground flex-shrink-0'>
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
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <Target className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
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
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
                        Show
                      </span>
                      <div className='text-right flex-1 max-w-[200px]'>
                        <ShowSelector
                          value={lead?.show_id || null}
                          onValueChange={async showId => {
                            if (!leadId) return;
                            try {
                              await updateLead(leadId, { show_id: showId });
                              await fetchLeadDetails();
                              onUpdate?.();
                              toast({
                                title: 'Success',
                                description: 'Show updated successfully',
                              });
                            } catch (error) {
                              toast({
                                title: 'Error',
                                description:
                                  error instanceof Error
                                    ? error.message
                                    : 'Failed to update show',
                                variant: 'destructive',
                              });
                            }
                          }}
                          className='w-full'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Created */}
                  <div className='flex items-center gap-2 lg:gap-3 py-1 lg:py-0'>
                    <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    <div className='flex-1 flex items-center justify-between gap-2 lg:gap-4 min-w-0'>
                      <span className='text-xs text-muted-foreground flex-shrink-0'>
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

        {/* Campaign Selection Dialog - mobile optimized */}
        <AlertDialog
          open={showCampaignSelect}
          onOpenChange={setShowCampaignSelect}
        >
          <AlertDialogContent className='w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl sm:rounded-lg'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-base sm:text-lg'>
                Add to Campaign
              </AlertDialogTitle>
              <AlertDialogDescription className='text-sm'>
                Select a campaign to enroll this lead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='py-4'>
              <Select onValueChange={handleAddToCampaign} defaultValue=''>
                <SelectTrigger className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation'>
                  <SelectValue placeholder='Select a campaign' />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem
                      key={campaign.id}
                      value={campaign.id}
                      className='py-3 sm:py-2 text-base sm:text-sm touch-manipulation'
                    >
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2 sm:gap-0'>
              <AlertDialogCancel className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation w-full sm:w-auto'>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SlideOutPanel>
    );
  }
);

LeadDetailsSlideOutComponent.displayName = 'LeadDetailsSlideOutComponent';

export const LeadDetailsSlideOut = memo(LeadDetailsSlideOutComponent);
