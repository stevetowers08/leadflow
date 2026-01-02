'use client';

import { UnifiedTable, ColumnConfig } from '@/components/ui/unified-table';
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
import type { Lead } from '@/types/database';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  exportLeadsToCSV,
  exportLeadsToJSON,
  downloadExport,
} from '@/services/exportService';
import { toast } from 'sonner';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { FloatingActionBar } from '@/components/people/FloatingActionBar';
import { useAllCampaigns } from '@/hooks/useAllCampaigns';
import { bulkAddLeadsToCampaign } from '@/services/bulk/bulkLeadsService';
import { CSVImportDialog } from '@/components/people/CSVImportDialog';
import { useQueryClient } from '@tanstack/react-query';
import { CellLoadingSpinner } from '@/components/ui/cell-loading-spinner';
import { cn } from '@/lib/utils';
import { CompanyChip } from '@/components/shared/CompanyChip';
import { ShowChip } from '@/components/shared/ShowChip';
import { getShows } from '@/services/showsService';
import type { Company, Show } from '@/types/database';
import { LeadDetailsSlideOut } from '@/components/slide-out/LeadDetailsSlideOut';
import { getStatusDisplayText } from '@/utils/statusUtils';

// Type for Lead with joined relations from getLeads query
type LeadWithRelations = Lead & {
  companies?: Pick<Company, 'id' | 'name' | 'logo_url'> | null;
  shows?: Pick<
    Show,
    'id' | 'name' | 'start_date' | 'end_date' | 'city' | 'venue'
  > | null;
};

export default function LeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [showFilter, setShowFilter] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const bulkSelection = useBulkSelection();
  const { data: campaigns = [] } = useAllCampaigns();
  const queryClient = useQueryClient();

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
    queryKey: ['leads', showFilter],
    queryFn: () =>
      getLeads({
        limit: 50,
        show_id: showFilter !== 'all' ? showFilter : undefined,
      }),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 2 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => getLeadStats(),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 5 * 60 * 1000, // Cache stats for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

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
        width: '50px',
        cellType: 'regular',
        align: 'center',
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
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Company</span>
            <Bolt className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (_, lead) => {
          const isEnriching =
            lead.enrichment_status === 'enriching' ||
            lead.enrichment_status === 'pending';

          return (
            <div className='flex items-center gap-2'>
              {isEnriching ? (
                <CellLoadingSpinner size='sm' />
              ) : (
                <CompanyChip
                  company={
                    (lead as LeadWithRelations).companies || {
                      name: lead.company,
                      logo_url: null,
                    }
                  }
                />
              )}
            </div>
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
                  name: lead.show_name,
                  start_date: lead.show_date,
                }
              }
            />
          );
        },
      },
      {
        key: 'job_title',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Position</span>
            <Bolt className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (_, lead) => {
          const isEnriching =
            lead.enrichment_status === 'enriching' ||
            lead.enrichment_status === 'pending';
          const isEnriched = lead.enrichment_status === 'completed';

          return (
            <div className='flex items-center gap-2'>
              {isEnriching ? (
                <CellLoadingSpinner size='sm' />
              ) : (
                <span
                  className={cn(
                    'text-muted-foreground',
                    isEnriched &&
                      lead.job_title &&
                      'text-foreground font-medium'
                  )}
                >
                  {lead.job_title || '-'}
                </span>
              )}
            </div>
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
        key: 'show',
        label: 'Show',
        width: '180px',
        render: (_, lead) => {
          return (
            <ShowChip
              show={
                (lead as LeadWithRelations).shows || {
                  name: lead.show_name,
                  start_date: lead.show_date,
                }
              }
            />
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

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `leads-export-${timestamp}.${format}`;

      if (format === 'csv') {
        const csvData = await exportLeadsToCSV({ format: 'csv' });
        downloadExport(csvData, filename, 'text/csv');
      } else {
        const jsonData = await exportLeadsToJSON({ format: 'json' });
        downloadExport(jsonData, filename, 'application/json');
      }

      toast.success('Export successful', {
        description: `Downloaded ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
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
        console.error('Error adding leads to campaign:', error);
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
    // Placeholder - implement delete functionality if needed
    toast.info('Delete functionality not yet implemented');
  }, []);

  const handleFavourite = useCallback(async () => {
    // Placeholder - implement favourite functionality if needed
    toast.info('Favourite functionality not yet implemented');
  }, []);

  const handleSyncCRM = useCallback(async () => {
    // Placeholder - implement CRM sync functionality if needed
    toast.info('CRM sync functionality not yet implemented');
  }, []);

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
    <Page stats={pageStats} title='Leads' loading={isLoading}>
      <div className='flex flex-col min-w-0 w-full'>
        <div className='flex items-center justify-between gap-2 mb-4 flex-shrink-0 w-full'>
          <div className='flex items-center gap-2 flex-shrink-0'>
            {actualSelectedCount > 0 && (
              <>
                <Badge variant='secondary'>
                  {actualSelectedCount}{' '}
                  {actualSelectedCount === 1 ? 'lead' : 'leads'} selected
                </Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => bulkSelection.deselectAll()}
                >
                  Clear selection
                </Button>
              </>
            )}
            {shows.length > 0 && (
              <Select value={showFilter} onValueChange={setShowFilter}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Filter by show' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Shows</SelectItem>
                  {shows.map(show => (
                    <SelectItem key={show.id} value={show.id}>
                      {show.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className='flex gap-2 ml-auto flex-shrink-0'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className='h-4 w-4 mr-2' />
              Import CSV
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleExport('csv')}
              disabled={isExporting || leads.length === 0}
            >
              <Download className='h-4 w-4 mr-2' />
              Export CSV
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleExport('json')}
              disabled={isExporting || leads.length === 0}
            >
              <Download className='h-4 w-4 mr-2' />
              Export JSON
            </Button>
          </div>
        </div>
        <div
          className='w-full min-w-0 flex-1'
          style={{ minHeight: '400px', maxHeight: 'calc(100vh - 280px)' }}
        >
          <UnifiedTable
            data={leads}
            columns={columns}
            loading={isLoading}
            emptyMessage='No leads captured yet. Start by capturing your first business card!'
            scrollable
            stickyHeaders
            onRowClick={lead => {
              setSelectedLeadId(lead.id);
              setIsSlideOutOpen(true);
            }}
          />
        </div>
      </div>

      {/* Floating Action Bar for bulk operations */}
      <FloatingActionBar
        selectedCount={actualSelectedCount}
        onDelete={handleDelete}
        onFavourite={handleFavourite}
        onExport={async () => {
          await handleExport('csv');
        }}
        onSyncCRM={handleSyncCRM}
        onSendEmail={handleSendEmail}
        onAddToCampaign={handleAddToCampaign}
        onClear={() => bulkSelection.deselectAll()}
        campaigns={campaigns}
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
