'use client';

import {
  UnifiedTable,
  ColumnConfig,
  TableSummary,
} from '@/components/ui/unified-table';
import { Page } from '@/design-system/components';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { getLeads, getLeadStats } from '@/services/leadsService';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Flame,
  Zap,
  Snowflake,
  Download,
  Calendar,
  Upload,
  Bolt,
  Building2,
} from 'lucide-react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Lead } from '@/types/database';
import { Button } from '@/components/ui/button';
import { exportLeadsToCSV, downloadExport } from '@/services/exportService';
import { toast } from 'sonner';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { FloatingActionBar } from '@/components/people/FloatingActionBar';
import { useAllCampaigns } from '@/hooks/useAllCampaigns';
import { bulkAddLeadsToCampaign } from '@/services/bulk/bulkLeadsService';
import { bulkDeletePeople } from '@/services/bulk/bulkPeopleService';
import { CSVImportDialog } from '@/components/people/CSVImportDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteConfirmation } from '@/contexts/ConfirmationContext';
import { cn } from '@/lib/utils';
import { CompanyChip } from '@/components/shared/CompanyChip';
import { ShowChip } from '@/components/shared/ShowChip';
import { getShows } from '@/services/showsService';
import type { Company, Show } from '@/types/database';
import { LeadDetailsSlideOut } from '@/components/slide-out/LeadDetailsSlideOut';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { TableFilterBar } from '@/components/tables/TableFilterBar';
import { useTableViewPreferences } from '@/hooks/useTableViewPreferences';
import type { SortOption, FilterConfig } from '@/types/tableFilters';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Type for Lead with joined relations from getLeads query
type LeadWithRelations = Lead & {
  companies?: Pick<Company, 'id' | 'name' | 'logo_url' | 'website'> | null;
  shows?: Pick<
    Show,
    'id' | 'name' | 'start_date' | 'end_date' | 'city' | 'venue'
  > | null;
};

// Sort options for leads
const LEAD_SORT_OPTIONS: SortOption[] = [
  {
    value: 'created_at_desc',
    label: 'Newest First',
    field: 'created_at',
    direction: 'desc',
  },
  {
    value: 'created_at_asc',
    label: 'Oldest First',
    field: 'created_at',
    direction: 'asc',
  },
  {
    value: 'name_asc',
    label: 'Name (A-Z)',
    field: 'first_name',
    direction: 'asc',
  },
  {
    value: 'name_desc',
    label: 'Name (Z-A)',
    field: 'first_name',
    direction: 'desc',
  },
  {
    value: 'quality_desc',
    label: 'Quality (Hot → Cold)',
    field: 'quality_rank',
    direction: 'desc',
  },
  {
    value: 'quality_asc',
    label: 'Quality (Cold → Hot)',
    field: 'quality_rank',
    direction: 'asc',
  },
];

export default function LeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);

  // Open slide-out if id is in URL
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl && idFromUrl !== selectedLeadId) {
      setSelectedLeadId(idFromUrl);
      setIsSlideOutOpen(true);
    }
  }, [searchParams, selectedLeadId]);
  const bulkSelection = useBulkSelection();
  const { data: campaigns = [] } = useAllCampaigns();
  const queryClient = useQueryClient();
  const showDeleteConfirmation = useDeleteConfirmation();

  // Table view preferences (filters + sorting)
  const { preferences, updatePreferences } = useTableViewPreferences('leads', {
    sortBy: 'created_at_desc',
    filters: {
      show: 'all',
      quality: 'all',
      status: 'all',
    },
  });

  const { data: shows = [] } = useQuery({
    queryKey: ['shows'],
    queryFn: () => getShows(),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['leads', preferences],
    queryFn: async () => {
      const showFilter = preferences.filters.show;
      const showId =
        showFilter !== 'all' && typeof showFilter === 'string'
          ? showFilter
          : undefined;

      const fetchedLeads = await getLeads({
        limit: 50,
        show_id: showId,
        quality_rank:
          preferences.filters.quality !== 'all'
            ? (preferences.filters.quality as 'hot' | 'warm' | 'cold')
            : undefined,
        status:
          preferences.filters.status !== 'all'
            ? (preferences.filters.status as
                | 'processing'
                | 'active'
                | 'replied_manual')
            : undefined,
        sortBy: preferences.sortBy,
      });

      // Fetch company data for unique company names to get logos
      const uniqueCompanyNames = [
        ...new Set(
          fetchedLeads
            .map(lead => lead.company?.trim())
            .filter((name): name is string => !!name)
        ),
      ];

      if (uniqueCompanyNames.length > 0) {
        // Use case-insensitive matching with ilike for better matching
        // Since Supabase doesn't support case-insensitive .in(), we'll fetch all and match manually
        const { data: companies } = await supabase
          .from('companies')
          .select('id, name, logo_url, website');

        // Create a case-insensitive map of company name to company data
        const companyMap = new Map<
          string,
          {
            id: string;
            name: string;
            logo_url: string | null;
            website: string | null;
          }
        >();

        (companies || []).forEach(company => {
          const normalizedName = company.name.toLowerCase().trim();
          companyMap.set(normalizedName, {
            id: company.id,
            name: company.name,
            logo_url: company.logo_url,
            website: company.website,
          });
        });

        // Enrich leads with company data using case-insensitive matching
        return fetchedLeads.map(lead => {
          const leadCompanyName = lead.company?.trim();
          const normalizedLeadCompanyName = leadCompanyName?.toLowerCase();
          const matchedCompany = normalizedLeadCompanyName
            ? companyMap.get(normalizedLeadCompanyName)
            : null;

          return {
            ...lead,
            companies:
              matchedCompany ||
              (leadCompanyName
                ? {
                    name: leadCompanyName,
                    logo_url: null,
                    website: null,
                    id: undefined, // No ID if company not in database
                  }
                : null),
          };
        }) as LeadWithRelations[];
      }

      // If no company names, still return leads with company data structure
      return fetchedLeads.map(lead => ({
        ...lead,
        companies: lead.company
          ? {
              name: lead.company,
              logo_url: null,
              website: null,
            }
          : null,
      })) as LeadWithRelations[];
    },
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 30 * 1000, // Reduced to 30 seconds for better real-time updates
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const { data: stats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => getLeadStats(),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 5 * 60 * 1000, // Cache stats for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Build filter configurations
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'show',
        label: 'Show',
        placeholder: 'All Shows',
        options: [
          { value: 'all', label: 'All Shows' },
          ...shows.map(show => ({ value: show.id, label: show.name })),
        ],
      },
      {
        key: 'quality',
        label: 'Quality',
        placeholder: 'All Qualities',
        options: [
          { value: 'all', label: 'All Qualities' },
          { value: 'hot', label: 'Hot', icon: Flame },
          { value: 'warm', label: 'Warm', icon: Zap },
          { value: 'cold', label: 'Cold', icon: Snowflake },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        placeholder: 'All Statuses',
        options: [
          { value: 'all', label: 'All Statuses' },
          { value: 'processing', label: 'Processing' },
          { value: 'active', label: 'Active' },
          { value: 'replied_manual', label: 'Replied' },
        ],
      },
    ],
    [shows]
  );

  // Keyboard shortcuts (Cmd/Ctrl+A for select all, Escape to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+A to select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const allIds = leads.map(l => l.id);
        if (bulkSelection.selectedCount === allIds.length) {
          bulkSelection.deselectAll();
        } else {
          bulkSelection.selectAll(allIds);
        }
      }
      // Escape to clear selection
      if (e.key === 'Escape' && bulkSelection.selectedCount > 0) {
        bulkSelection.deselectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bulkSelection, leads]);

  // Calculate actual selected count (resolves select-all against all leads)
  const actualSelectedCount = bulkSelection.getSelectedIds(
    leads.map(l => l.id)
  ).length;

  // Memoized checkbox render to prevent re-renders
  const renderCheckbox = useCallback(
    (lead: Lead) => (
      <div
        className='flex items-center justify-center'
        data-bulk-checkbox
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={bulkSelection.isSelected(lead.id)}
          onCheckedChange={() => bulkSelection.toggleItem(lead.id)}
          aria-label={`Select ${lead.first_name} ${lead.last_name}`}
        />
      </div>
    ),
    [bulkSelection]
  );

  const columns: ColumnConfig<Lead>[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <div className='flex items-center justify-center' data-bulk-checkbox>
            <Checkbox
              checked={
                leads.length > 0 &&
                leads.every(l => bulkSelection.isSelected(l.id))
              }
              onCheckedChange={checked => {
                if (checked) {
                  bulkSelection.selectAll(leads.map(l => l.id));
                } else {
                  bulkSelection.deselectAll();
                }
              }}
              aria-label='Select all leads'
            />
          </div>
        ),
        width: '44px',
        cellType: 'regular',
        align: 'center',
        className: 'px-0',
        render: (_, lead) => renderCheckbox(lead),
      },
      {
        key: 'name',
        label: 'Name',
        width: '200px',
        render: (_, lead) => {
          const name =
            [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
            'Unknown';
          return <div className='font-medium'>{name}</div>;
        },
      },
      {
        key: 'email',
        label: 'Email',
        width: '250px',
        render: (_, lead) => {
          return (
            <span className='text-muted-foreground'>{lead.email || '-'}</span>
          );
        },
      },
      {
        key: 'phone',
        label: 'Phone',
        width: '150px',
        render: (_, lead) => {
          return (
            <span className='text-muted-foreground'>{lead.phone || '-'}</span>
          );
        },
      },
      {
        key: 'company',
        label: 'Company',
        width: '200px',
        render: (_, lead) => {
          return (
            <CompanyChip
              company={
                (lead as LeadWithRelations).companies || {
                  name: lead.company || 'Unknown',
                  logo_url: null,
                }
              }
            />
          );
        },
      },
      {
        key: 'show',
        label: 'Show',
        width: '180px',
        render: (_, lead) => {
          return (
            <ShowChip
              show={
                (lead as LeadWithRelations).shows || {
                  name: lead.show_name || 'Unknown',
                  start_date: lead.show_date,
                }
              }
            />
          );
        },
      },
      {
        key: 'job_title',
        label: 'Position',
        width: '200px',
        render: (_, lead) => {
          return (
            <span className='text-muted-foreground'>
              {lead.job_title || '-'}
            </span>
          );
        },
      },
      {
        key: 'quality_rank',
        label: 'Quality',
        width: '120px',
        cellType: 'status',
        render: (_, lead) => {
          const quality = lead.quality_rank || 'warm';
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
        },
      },
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        cellType: 'status',
        render: (_, lead) => {
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
        },
      },
      {
        key: 'created_at',
        label: 'Created',
        width: '120px',
        render: (_, lead) => (
          <div className='text-sm text-muted-foreground'>
            {lead.created_at
              ? new Date(lead.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : '-'}
          </div>
        ),
      },
    ],
    [bulkSelection, leads, renderCheckbox]
  );

  const pageStats = useMemo(
    () => [
      {
        icon: Users,
        value: stats?.total || leads.length,
        label: 'Total Leads',
      },
      {
        icon: Flame,
        value: stats?.hot || 0,
        label: 'Hot',
      },
      {
        icon: Zap,
        value: stats?.warm || 0,
        label: 'Warm',
      },
      {
        icon: Snowflake,
        value: stats?.cold || 0,
        label: 'Cold',
      },
    ],
    [stats, leads.length]
  );

  // Attio-style table summary
  const tableSummary: TableSummary = useMemo(() => {
    const hotCount = leads.filter(l => l.quality_rank === 'hot').length;
    const warmCount = leads.filter(l => l.quality_rank === 'warm').length;
    const coldCount = leads.filter(l => l.quality_rank === 'cold').length;
    const withEmail = leads.filter(l => l.email).length;
    const withPhone = leads.filter(l => l.phone).length;
    const withCompany = leads.filter(l => l.company).length;

    return {
      cells: [
        { key: 'checkbox', value: '' },
        {
          key: 'name',
          value: `${leads.length} leads`,
          type: 'count',
          className: 'text-muted-foreground',
        },
        {
          key: 'email',
          value: `${withEmail} with email`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        {
          key: 'phone',
          value: `${withPhone} with phone`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        {
          key: 'company',
          value: `${withCompany} with company`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        { key: 'show', value: '', type: 'label' },
        { key: 'job_title', value: '', type: 'label' },
        {
          key: 'quality_rank',
          value: (
            <div className='flex items-center gap-1.5 text-xs'>
              <span className='text-destructive'>{hotCount} hot</span>
              <span className='text-muted-foreground'>·</span>
              <span className='text-warning'>{warmCount} warm</span>
              <span className='text-muted-foreground'>·</span>
              <span className='text-muted-foreground'>{coldCount} cold</span>
            </div>
          ),
          type: 'custom',
        },
        { key: 'status', value: '', type: 'label' },
        { key: 'created_at', value: '', type: 'label' },
      ],
    };
  }, [leads]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `leads-export-${timestamp}.csv`;

      const csvData = await exportLeadsToCSV({ format: 'csv' });
      downloadExport(csvData, filename, 'text/csv');

      toast.success('Export successful', {
        description: `Downloaded ${filename}`,
      });
    } catch (error) {
      logger.error('Export error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Please try again';
      toast.error('Export failed', {
        description: errorMessage,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddToCampaign = useCallback(
    async (campaignId: string, campaignType: 'email' | 'lemlist') => {
      if (!user) {
        toast.error('Error', { description: 'User not authenticated' });
        return;
      }

      const selectedLeadIds = bulkSelection.getSelectedIds(
        leads.map(l => l.id)
      );

      if (selectedLeadIds.length === 0) {
        toast.error('Error', { description: 'No leads selected' });
        return;
      }

      try {
        const result = await bulkAddLeadsToCampaign(
          selectedLeadIds,
          campaignId,
          user.id
        );

        if (result.success > 0) {
          toast.success('Success', {
            description: `Added ${result.success} lead(s) to ${campaignType === 'lemlist' ? 'Lemlist' : 'email'} campaign${result.failed > 0 ? ` (${result.failed} failed)` : ''}`,
          });
          bulkSelection.deselectAll();
        } else {
          toast.error('Error', {
            description:
              result.errors[0]?.error || 'Failed to add leads to campaign',
          });
        }
      } catch (error) {
        logger.error('Error adding leads to campaign:', error);
        toast.error('Error', {
          description:
            error instanceof Error
              ? error.message
              : 'Failed to add leads to campaign',
        });
      }
    },
    [user, bulkSelection, leads]
  );

  const handleDelete = useCallback(async () => {
    const selectedLeadIds = bulkSelection.getSelectedIds(leads.map(l => l.id));

    if (selectedLeadIds.length === 0) {
      toast.error('Error', { description: 'No leads selected' });
      return;
    }

    showDeleteConfirmation(
      async () => {
        logger.debug(
          '🗑️ [handleDelete] Confirmed, starting delete for',
          selectedLeadIds.length,
          'leads'
        );
        try {
          const result = await bulkDeletePeople(selectedLeadIds);
          logger.debug('🗑️ [handleDelete] Delete result:', result);

          if (result.successCount > 0) {
            toast.success('Success', {
              description: `Deleted ${result.successCount} lead${result.successCount === 1 ? '' : 's'}${
                result.errorCount > 0 ? ` (${result.errorCount} failed)` : ''
              }`,
            });

            // Invalidate queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['lead-stats'] });

            // Clear selection
            bulkSelection.deselectAll();
          } else {
            const errorMsg =
              result.errors[0]?.error || 'Failed to delete leads';
            logger.error(
              '🗑️ [handleDelete] Delete failed:',
              errorMsg,
              result.errors
            );
            toast.error('Error', {
              description: errorMsg,
            });
          }
        } catch (error) {
          logger.error('🗑️ [handleDelete] Exception during delete:', error);
          toast.error('Error', {
            description:
              error instanceof Error ? error.message : 'Failed to delete leads',
          });
        }
      },
      {
        customTitle: 'Delete Leads',
        customDescription: `Are you sure you want to delete ${selectedLeadIds.length} lead${selectedLeadIds.length === 1 ? '' : 's'}? This action cannot be undone.`,
      }
    );
  }, [bulkSelection, leads, showDeleteConfirmation, queryClient]);

  const handleFavourite = useCallback(async () => {
    // Placeholder - implement favourite functionality if needed
    toast.info('Favourite functionality not yet implemented');
  }, []);

  const handleSyncCRM = useCallback(async () => {
    // This is handled by FloatingActionBar's lemlist workflow selection dialog
    // If onAddToLemlistWorkflow is not provided, show fallback message
    toast.info('Please select a lemlist workflow from the dialog');
  }, []);

  const handleAddToLemlistWorkflow = useCallback(
    async (workflowId: string) => {
      if (!user) {
        toast.error('You must be logged in to sync leads');
        return;
      }

      const selectedLeadIds = bulkSelection.getSelectedIds(
        leads.map(l => l.id)
      );

      if (selectedLeadIds.length === 0) {
        toast.error('No leads selected');
        return;
      }

      try {
        const { bulkAddPeopleToLemlistCampaign } =
          await import('@/services/bulkLemlistService');

        const result = await bulkAddPeopleToLemlistCampaign(
          user.id,
          workflowId,
          selectedLeadIds
        );

        if (result.success > 0) {
          toast.success(
            `Added ${result.success} lead${result.success === 1 ? '' : 's'} to lemlist workflow${result.failed > 0 ? ` (${result.failed} failed)` : ''}`
          );

          // Clear selection after successful sync
          bulkSelection.deselectAll();

          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
        } else {
          toast.error(
            `Failed to add leads to workflow: ${result.errors[0]?.error || 'Unknown error'}`
          );
        }
      } catch (error) {
        logger.error('Error adding leads to lemlist workflow:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to add leads to lemlist workflow'
        );
      }
    },
    [user, bulkSelection, leads, queryClient]
  );

  const handleSendEmail = useCallback(async () => {
    // Placeholder - implement send email functionality if needed
    toast.info('Send email functionality not yet implemented');
  }, []);

  const handleImportComplete = useCallback(() => {
    // Invalidate and refetch leads queries after import
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    queryClient.invalidateQueries({ queryKey: ['leads-all-for-filter'] });
    setShowImportDialog(false);
  }, [queryClient]);

  if (error) {
    return (
      <Page stats={pageStats} title='Leads'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-destructive'>Error loading leads</div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      stats={pageStats}
      title='Leads'
      loading={isLoading}
      padding='none'
      hideHeader
    >
      {/* Filter bar and actions - responsive layout */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border bg-background'>
        <div className='flex-1 min-w-0'>
          <TableFilterBar
            entityLabel='Leads'
            entityCount={leads.length}
            sortOptions={LEAD_SORT_OPTIONS}
            filterConfigs={filterConfigs}
            preferences={preferences}
            onPreferencesChange={updatePreferences}
            className='!border-0'
          />
        </div>
        {/* Action buttons - hidden on mobile, shown on sm+ */}
        <div className='hidden sm:flex gap-2 px-4 flex-shrink-0'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowImportDialog(true)}
            className='touch-manipulation'
          >
            <Upload className='h-4 w-4 mr-2' />
            Import CSV
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExport}
            disabled={isExporting || leads.length === 0}
            className='touch-manipulation'
          >
            <Download className='h-4 w-4 mr-2' />
            Export CSV
          </Button>
        </div>
        {/* Mobile action buttons - icon only */}
        <div className='flex sm:hidden gap-2 px-3 pb-2 flex-shrink-0'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowImportDialog(true)}
            className='h-10 w-10 p-0 touch-manipulation'
            title='Import CSV'
          >
            <Upload className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExport}
            disabled={isExporting || leads.length === 0}
            className='h-10 w-10 p-0 touch-manipulation'
            title='Export CSV'
          >
            <Download className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Selection indicator - responsive */}
      {actualSelectedCount > 0 && (
        <div className='flex items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-border bg-background'>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Badge variant='secondary' className='text-xs sm:text-sm'>
              {actualSelectedCount}{' '}
              <span className='hidden xs:inline'>
                {actualSelectedCount === 1 ? 'lead' : 'leads'}
              </span>{' '}
              selected
            </Badge>
          </div>
        </div>
      )}

      <div
        className='w-full min-w-0 flex-1'
        style={{ minHeight: '400px', maxHeight: 'calc(100vh - 200px)' }}
      >
        <UnifiedTable
          data={leads}
          columns={columns}
          loading={isLoading}
          emptyMessage='No leads captured yet. Start by capturing your first business card!'
          scrollable
          stickyHeaders
          summary={tableSummary}
          onRowClick={lead => {
            setSelectedLeadId(lead.id);
            setIsSlideOutOpen(true);
          }}
        />
      </div>

      {/* Floating Action Bar for bulk operations */}
      <FloatingActionBar
        selectedCount={actualSelectedCount}
        onDelete={handleDelete}
        onFavourite={handleFavourite}
        onExport={handleExport}
        onSyncCRM={handleSyncCRM}
        onSendEmail={handleSendEmail}
        onAddToCampaign={handleAddToCampaign}
        onAddToLemlistWorkflow={handleAddToLemlistWorkflow}
        onClear={() => bulkSelection.deselectAll()}
        campaigns={campaigns}
        userId={user?.id}
      />

      {/* CSV Import Dialog */}
      <CSVImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />

      {/* Lead Details Slide-Out */}
      <LeadDetailsSlideOut
        leadId={selectedLeadId}
        isOpen={isSlideOutOpen}
        onClose={() => {
          setIsSlideOutOpen(false);
          setSelectedLeadId(null);
        }}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
        }}
      />
    </Page>
  );
}
