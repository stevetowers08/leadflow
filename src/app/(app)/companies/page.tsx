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
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  ExternalLink,
  MapPin,
  Download,
  Linkedin,
  Clock,
  FileText,
  Signal,
  Zap,
  Calendar,
  X,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import type { Company } from '@/types/database';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { CompanyChip } from '@/components/shared/CompanyChip';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { formatDistanceToNow } from 'date-fns';
import { TableFilterBar } from '@/components/tables/TableFilterBar';
import { useTableViewPreferences } from '@/hooks/useTableViewPreferences';
import type { SortOption, FilterConfig } from '@/types/tableFilters';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { useCompanyEnrichmentRealtime } from '@/hooks/useCompanyEnrichmentRealtime';
import {
  getShowsForCompany,
  linkCompanyToShow,
  unlinkCompanyFromShow,
} from '@/services/showCompaniesService';
import { getShows } from '@/services/showsService';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShowChip } from '@/components/shared/ShowChip';
import { FloatingActionBar } from '@/components/people/FloatingActionBar';
import { useAllCampaigns } from '@/hooks/useAllCampaigns';
import { useDeleteConfirmation } from '@/contexts/ConfirmationContext';
import { logger } from '@/utils/logger';

// Sort options for companies
const COMPANY_SORT_OPTIONS: SortOption[] = [
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
  { value: 'name_asc', label: 'Name (A-Z)', field: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Name (Z-A)', field: 'name', direction: 'desc' },
];

// Inline Company Shows Editor Component
function InlineCompanyShowsEditor({
  company,
  shows,
  companyShows,
  onShowsUpdate,
}: {
  company: Company;
  shows: Array<{ id: string; name: string; start_date: string | null }>;
  companyShows: Array<{ id: string; name: string; start_date: string | null }>;
  onShowsUpdate: (
    shows: Array<{ id: string; name: string; start_date: string | null }>
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [localShows, setLocalShows] = useState(companyShows);
  const queryClient = useQueryClient();

  // Fetch shows when popover opens
  useEffect(() => {
    if (open && localShows.length === 0) {
      getShowsForCompany(company.id)
        .then(shows => {
          setLocalShows(shows);
          onShowsUpdate(shows);
        })
        .catch(() => {
          // Silently fail
        });
    }
  }, [open, company.id]);

  // Update local shows when prop changes
  useEffect(() => {
    setLocalShows(companyShows);
  }, [companyShows]);

  const availableShows = shows.filter(
    s => !localShows.some(cs => cs.id === s.id)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='h-auto p-1.5 justify-start bg-transparent hover:bg-muted dark:hover:bg-[rgb(37,37,37)] text-foreground dark:text-foreground'
          onClick={e => e.stopPropagation()}
        >
          {localShows.length > 0 ? (
            <div className='flex items-center gap-1 flex-wrap'>
              {localShows.slice(0, 2).map(show => (
                <Badge
                  key={show.id}
                  variant='secondary'
                  className='text-xs dark:bg-secondary dark:text-secondary-foreground'
                >
                  {show.name}
                </Badge>
              ))}
              {localShows.length > 2 && (
                <Badge
                  variant='secondary'
                  className='text-xs dark:bg-secondary dark:text-secondary-foreground'
                >
                  +{localShows.length - 2}
                </Badge>
              )}
            </div>
          ) : (
            <span className='text-xs text-muted-foreground dark:text-muted-foreground flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              Add shows
            </span>
          )}
          <ChevronDown className='h-3 w-3 ml-1 opacity-50 dark:opacity-70' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-72 p-3'
        align='start'
        onClick={e => e.stopPropagation()}
      >
        <div className='space-y-3'>
          <div className='text-sm font-medium'>Manage Shows</div>

          {/* Current Shows */}
          {localShows.length > 0 && (
            <div className='space-y-2'>
              <div className='text-xs text-muted-foreground'>Linked Shows</div>
              <div className='flex flex-wrap gap-1.5'>
                {localShows.map(show => (
                  <Badge
                    key={show.id}
                    variant='secondary'
                    className='text-xs flex items-center gap-1 pr-1'
                  >
                    <ShowChip show={show} className='text-xs' />
                    <button
                      onClick={async e => {
                        e.stopPropagation();
                        try {
                          await unlinkCompanyFromShow(show.id, company.id);
                          const updatedShows = await getShowsForCompany(
                            company.id
                          );
                          setLocalShows(updatedShows);
                          onShowsUpdate(updatedShows);
                          queryClient.invalidateQueries({
                            queryKey: ['companies'],
                          });
                          toast.success('Show removed');
                        } catch (error) {
                          toast.error('Failed to remove show');
                        }
                      }}
                      className='ml-1 hover:text-destructive'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add Show */}
          {availableShows.length > 0 ? (
            <div className='space-y-2'>
              <div className='text-xs text-muted-foreground'>Add Show</div>
              <div className='flex gap-1'>
                <Select
                  value={selectedShowId || undefined}
                  onValueChange={setSelectedShowId}
                >
                  <SelectTrigger className='h-8 text-xs flex-1'>
                    <SelectValue placeholder='Select show' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableShows.map(show => {
                      let dateStr: string | null = null;
                      if (show.start_date) {
                        try {
                          const date = new Date(show.start_date);
                          if (!isNaN(date.getTime())) {
                            dateStr = date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            });
                          }
                        } catch {
                          // Invalid date, ignore
                        }
                      }
                      return (
                        <SelectItem key={show.id} value={show.id}>
                          <div className='flex items-center gap-2'>
                            <span>{show.name}</span>
                            {dateStr && (
                              <span className='text-xs text-muted-foreground'>
                                {dateStr}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Button
                  size='sm'
                  onClick={async e => {
                    e.stopPropagation();
                    if (!selectedShowId) return;
                    try {
                      await linkCompanyToShow(selectedShowId, company.id);
                      const updatedShows = await getShowsForCompany(company.id);
                      setLocalShows(updatedShows);
                      onShowsUpdate(updatedShows);
                      setSelectedShowId(null);
                      queryClient.invalidateQueries({
                        queryKey: ['companies'],
                      });
                      toast.success('Show added');
                    } catch (error) {
                      toast.error('Failed to add show');
                    }
                  }}
                  disabled={!selectedShowId}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>
            </div>
          ) : shows.length === 0 ? (
            <div className='space-y-2'>
              <div className='text-xs text-muted-foreground'>
                No shows available
              </div>
              <a href='/shows'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full h-8 text-xs'
                >
                  <Plus className='h-3 w-3 mr-1' />
                  Create Show
                </Button>
              </a>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CompaniesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const bulkSelection = useBulkSelection();
  const queryClient = useQueryClient();
  const { data: campaigns = [] } = useAllCampaigns();
  const showDeleteConfirmation = useDeleteConfirmation();
  const [companyShowsMap, setCompanyShowsMap] = useState<
    Record<
      string,
      Array<{ id: string; name: string; start_date: string | null }>
    >
  >({});

  // Enable real-time enrichment updates
  useCompanyEnrichmentRealtime();

  // Table view preferences (filters + sorting)
  const { preferences, updatePreferences } = useTableViewPreferences(
    'companies',
    {
      sortBy: 'created_at_desc',
      filters: {},
    }
  );

  // Get company ID from URL params
  useEffect(() => {
    const companyId = searchParams.get('id');
    if (companyId) {
      setSelectedCompanyId(companyId);
      setIsSlideOutOpen(true);
    }
  }, [searchParams]);

  const { data: shows = [] } = useQuery({
    queryKey: ['shows'],
    queryFn: () => getShows(),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companies', preferences],
    queryFn: async () => {
      // Parse sorting
      const sortOption =
        COMPANY_SORT_OPTIONS.find(opt => opt.value === preferences.sortBy) ||
        COMPANY_SORT_OPTIONS[0];

      let query = supabase
        .from('companies')
        .select(
          'id, name, website, industry, created_at, linkedin_url, description, head_office, company_size, last_activity, logo_url, estimated_arr'
        );

      // Apply filters

      // Apply sorting
      query = query.order(sortOption.field, {
        ascending: sortOption.direction === 'asc',
      });

      const { data, error } = await query;

      if (error) {
        logger.error('[CompaniesPage] Query error:', error);
        throw error;
      }

      // Cast to Company[] - the select includes columns that may not be in generated types
      const companies = (data || []) as unknown as Company[];

      logger.debug(
        '[CompaniesPage] Fetched companies:',
        companies.length,
        'companies'
      );
      if (companies.length > 0) {
        const sample = companies[0];
        logger.debug(
          '[CompaniesPage] Sample company enrichment data:',
          JSON.stringify(
            {
              name: sample.name,
              industry: sample.industry,
              website: sample.website,
              linkedin_url: sample.linkedin_url,
              company_size: sample.company_size,
              head_office: sample.head_office,
              description: sample.description,
            },
            null,
            2
          )
        );
      }

      return companies;
    },
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 2 * 60 * 1000,
  });

  // Build filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => [], []);

  // Calculate actual selected count (resolves select-all against all companies)
  const actualSelectedCount = bulkSelection.getSelectedIds(
    companies.map(c => c.id)
  ).length;

  // Debug logging
  logger.debug('[CompaniesPage] Selection state:', {
    actualSelectedCount,
    companiesCount: companies.length,
    bulkSelectionSelectedCount: bulkSelection.selectedCount,
    bulkSelectionIsAllSelected: bulkSelection.isAllSelected,
    selectedIds: bulkSelection.getSelectedIds(companies.map(c => c.id)),
  });

  // Memoized checkbox render to prevent re-renders
  const renderCheckbox = useCallback(
    (company: Company) => (
      <div
        className='flex items-center justify-center'
        data-bulk-checkbox
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={bulkSelection.isSelected(company.id)}
          onCheckedChange={() => bulkSelection.toggleItem(company.id)}
          aria-label={`Select ${company.name}`}
        />
      </div>
    ),
    [bulkSelection]
  );

  const columns: ColumnConfig<Company>[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <div className='flex items-center justify-center' data-bulk-checkbox>
            <Checkbox
              checked={
                companies.length > 0 &&
                companies.every(c => bulkSelection.isSelected(c.id))
              }
              onCheckedChange={checked => {
                if (checked) {
                  bulkSelection.selectAll(companies.map(c => c.id));
                } else {
                  bulkSelection.deselectAll();
                }
              }}
              aria-label='Select all companies'
            />
          </div>
        ),
        width: '44px',
        cellType: 'regular',
        align: 'center',
        className: 'px-0',
        render: (_, company) => renderCheckbox(company),
      },
      {
        key: 'name',
        label: 'Company',
        width: '250px',
        render: (value, row) => {
          return (
            <div className='flex items-center gap-2'>
              <CompanyChip company={row} />
            </div>
          );
        },
      },
      {
        key: 'shows',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Shows</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (value, row) => {
          const companyShows = companyShowsMap[row.id] || [];

          return (
            <InlineCompanyShowsEditor
              company={row}
              shows={shows}
              companyShows={companyShows}
              onShowsUpdate={updatedShows => {
                setCompanyShowsMap(prev => ({
                  ...prev,
                  [row.id]: updatedShows,
                }));
              }}
            />
          );
        },
      },
      {
        key: 'industry',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Industry</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '180px',
        render: (value, row) => {
          const industry = (value || row.industry) as string | null | undefined;
          if (
            !industry ||
            (typeof industry === 'string' && industry.trim() === '')
          )
            return <span className='text-muted-foreground'>-</span>;
          return <span className='text-sm'>{industry}</span>;
        },
      },
      {
        key: 'website',
        label: 'Website',
        width: '200px',
        render: (value, row) => {
          const website = (value || row.website) as string | null | undefined;
          if (!website) return <span className='text-muted-foreground'>-</span>;

          const displayText = website.replace(/^https?:\/\//, '');
          const href = website.startsWith('http')
            ? website
            : `https://${website}`;

          return (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-1 text-sm'
              onClick={e => e.stopPropagation()}
            >
              {displayText}
              <ExternalLink className='h-3 w-3' />
            </a>
          );
        },
      },
      {
        key: 'linkedin_url',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>LinkedIn</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '180px',
        render: (value, row) => {
          // Use row property directly - UnifiedTable may not extract value correctly for all columns
          const linkedinUrl = row.linkedin_url as string | null | undefined;
          if (!linkedinUrl) {
            return <span className='text-muted-foreground'>-</span>;
          }

          const href = linkedinUrl.startsWith('http')
            ? linkedinUrl
            : `https://${linkedinUrl}`;

          return (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-1 text-sm'
              onClick={e => e.stopPropagation()}
            >
              <Linkedin className='h-4 w-4' />
              <span className='truncate'>LinkedIn</span>
              <ExternalLink className='h-3 w-3' />
            </a>
          );
        },
      },
      {
        key: 'description',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Description</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '300px',
        render: (value, row) => {
          const description = (value || row.description) as
            | string
            | null
            | undefined;
          if (!description)
            return <span className='text-muted-foreground'>-</span>;
          return (
            <div className='flex items-start gap-1.5 text-sm'>
              <FileText className='h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0' />
              <span
                className='text-muted-foreground line-clamp-2'
                title={description}
              >
                {description}
              </span>
            </div>
          );
        },
      },
      {
        key: 'head_office',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Location</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (value, row) => {
          // Use row property directly - UnifiedTable may not extract value correctly for all columns
          const location = row.head_office as string | null | undefined;
          if (!location)
            return <span className='text-muted-foreground'>-</span>;
          return <span className='text-sm truncate'>{location}</span>;
        },
      },
      {
        key: 'company_size',
        label: (
          <div className='flex items-center gap-1.5'>
            <span>Size</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '120px',
        render: (value, row) => {
          // Use row property directly - UnifiedTable may not extract value correctly for all columns
          // Try multiple ways to access the value
          const size = (row.company_size ?? value ?? null) as
            | string
            | null
            | undefined;

          // Debug logging
          if (!size && row.name) {
            logger.debug('[CompanySize] Missing size for:', row.name, {
              row_company_size: row.company_size,
              value: value,
              row_keys: Object.keys(row),
            });
          }

          if (!size || size.trim() === '') {
            return <span className='text-muted-foreground'>-</span>;
          }
          return <span className='text-sm'>{size}</span>;
        },
      },
      {
        key: 'estimated_arr',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Estimated Annual Recurring Revenue'
          >
            <span>ARR</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '140px',
        render: (value, row) => {
          const arr = (row.estimated_arr ?? value ?? null) as
            | number
            | null
            | undefined;

          if (arr === null || arr === undefined) {
            return <span className='text-muted-foreground'>-</span>;
          }

          // Format as currency (USD)
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(arr);

          return <span className='text-sm font-medium'>{formatted}</span>;
        },
      },
      {
        key: 'last_activity',
        label: 'Last Interaction',
        width: '180px',
        render: (value, row) => {
          const lastActivity = row.last_activity;
          if (!lastActivity)
            return <span className='text-muted-foreground'>-</span>;
          return (
            <div className='flex items-center gap-1.5 text-sm'>
              <Clock className='h-3.5 w-3.5 text-muted-foreground' />
              <span className='text-muted-foreground'>
                {formatDistanceToNow(new Date(lastActivity), {
                  addSuffix: true,
                })}
              </span>
            </div>
          );
        },
      },
    ],
    [companies, bulkSelection, renderCheckbox]
  );

  // Attio-style table summary for companies
  const tableSummary: TableSummary = useMemo(() => {
    const withWebsite = companies.filter(c => c.website).length;
    const withLinkedIn = companies.filter(c => c.linkedin_url).length;
    const withIndustry = companies.filter(c => c.industry).length;
    const withSize = companies.filter(c => c.company_size).length;
    const withARR = companies.filter(c => c.estimated_arr).length;
    const totalARR = companies.reduce(
      (sum, c) => sum + (c.estimated_arr || 0),
      0
    );

    return {
      cells: [
        { key: 'checkbox', value: '' },
        {
          key: 'name',
          value: `${companies.length} companies`,
          type: 'count',
          className: 'text-muted-foreground',
        },
        { key: 'categories', value: '', type: 'label' },
        { key: 'shows', value: '', type: 'label' },
        {
          key: 'industry',
          value: `${withIndustry} enriched`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        {
          key: 'website',
          value: `${withWebsite} with website`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        {
          key: 'linkedin_url',
          value: `${withLinkedIn} with LinkedIn`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        { key: 'description', value: '', type: 'label' },
        { key: 'head_office', value: '', type: 'label' },
        {
          key: 'company_size',
          value: `${withSize} with size`,
          type: 'count',
          className: 'text-muted-foreground text-xs',
        },
        {
          key: 'estimated_arr',
          value:
            withARR > 0 ? (
              <span className='text-xs text-muted-foreground'>
                {withARR} with ARR · Total:{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  notation: 'compact',
                }).format(totalARR)}
              </span>
            ) : (
              ''
            ),
          type: 'custom',
        },
        { key: 'last_activity', value: '', type: 'label' },
      ],
    };
  }, [companies]);

  // Handler functions for bulk operations
  const handleDelete = useCallback(async () => {
    const selectedCompanyIds = bulkSelection.getSelectedIds(
      companies.map(c => c.id)
    );

    if (selectedCompanyIds.length === 0) {
      toast.error('Error', { description: 'No companies selected' });
      return;
    }

    showDeleteConfirmation(
      async () => {
        try {
          const { error: deleteError } = await supabase
            .from('companies')
            .delete()
            .in('id', selectedCompanyIds);

          if (deleteError) {
            throw deleteError;
          }

          toast.success('Success', {
            description: `Deleted ${selectedCompanyIds.length} compan${selectedCompanyIds.length === 1 ? 'y' : 'ies'}`,
          });

          queryClient.invalidateQueries({ queryKey: ['companies'] });
          bulkSelection.deselectAll();
        } catch (error) {
          console.error('Error deleting companies:', error);
          toast.error('Error', {
            description:
              error instanceof Error
                ? error.message
                : 'Failed to delete companies',
          });
        }
      },
      {
        customTitle: 'Delete Companies',
        customDescription: `Are you sure you want to delete ${selectedCompanyIds.length} compan${selectedCompanyIds.length === 1 ? 'y' : 'ies'}? This action cannot be undone.`,
      }
    );
  }, [bulkSelection, companies, showDeleteConfirmation, queryClient]);

  const handleExport = useCallback(async () => {
    const selectedCompanyIds = bulkSelection.getSelectedIds(
      companies.map(c => c.id)
    );

    if (selectedCompanyIds.length === 0) {
      toast.error('Error', { description: 'No companies selected' });
      return;
    }

    try {
      const { data: rawCompanies, error: fetchError } = await supabase
        .from('companies')
        .select(
          'name, website, industry, linkedin_url, description, head_office, company_size, created_at, estimated_arr'
        )
        .in('id', selectedCompanyIds);

      if (fetchError) throw fetchError;

      // Cast to proper type - columns may not be in generated Supabase types
      const selectedCompanies = (rawCompanies || []) as unknown as Array<{
        name: string | null;
        website: string | null;
        industry: string | null;
        linkedin_url: string | null;
        description: string | null;
        head_office: string | null;
        company_size: string | null;
        created_at: string | null;
        estimated_arr: number | null;
      }>;

      const headers = [
        'Name',
        'Website',
        'Industry',
        'LinkedIn',
        'Description',
        'Location',
        'Company Size',
        'Estimated ARR',
        'Created Date',
      ];

      const csvRows = [
        headers.join(','),
        ...selectedCompanies.map(
          (company: (typeof selectedCompanies)[number]) =>
            [
              `"${company.name || ''}"`,
              `"${company.website || ''}"`,
              `"${company.industry || ''}"`,
              `"${company.linkedin_url || ''}"`,
              `"${(company.description || '').replace(/"/g, '""')}"`,
              `"${company.head_office || ''}"`,
              `"${company.company_size || ''}"`,
              `"${company.estimated_arr ? `$${company.estimated_arr.toLocaleString()}` : ''}"`,
              `"${company.created_at ? new Date(company.created_at).toLocaleDateString() : ''}"`,
            ].join(',')
        ),
      ];

      const BOM = '\uFEFF';
      const csvContent = BOM + csvRows.join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `companies_export_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Export successful', {
        description: `Downloaded companies_export_${new Date().toISOString().split('T')[0]}.csv`,
      });
    } catch (error) {
      logger.error('Export error:', error);
      toast.error('Export failed', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    }
  }, [bulkSelection, companies]);

  const handleFavourite = useCallback(async () => {
    toast.info('Favourite functionality not yet implemented for companies');
  }, []);

  const handleSyncCRM = useCallback(async () => {
    toast.info('CRM sync functionality not yet implemented for companies');
  }, []);

  const handleSendEmail = useCallback(async () => {
    toast.info('Send email functionality not yet implemented for companies');
  }, []);

  const handleAddToCampaign = useCallback(
    async (campaignId: string, campaignType: 'email' | 'lemlist') => {
      toast.info(
        'Add to campaign functionality not yet implemented for companies'
      );
    },
    []
  );

  if (error) {
    return (
      <Page title='Companies'>
        <div className='p-6 text-center'>
          <p className='text-destructive'>
            Error loading companies: {error.message}
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page title='Companies' padding='none' hideHeader>
      <TableFilterBar
        entityLabel='Companies'
        entityCount={companies.length}
        sortOptions={COMPANY_SORT_OPTIONS}
        filterConfigs={filterConfigs}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
      />

      {/* Selection indicator - responsive */}
      {actualSelectedCount > 0 && (
        <div className='flex items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-border bg-background'>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Badge variant='secondary' className='text-xs sm:text-sm'>
              {actualSelectedCount}{' '}
              <span className='hidden xs:inline'>
                {actualSelectedCount === 1 ? 'company' : 'companies'}
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
          data={companies}
          columns={columns}
          loading={isLoading}
          emptyMessage='No companies found.'
          scrollable
          stickyHeaders
          summary={tableSummary}
          onRowClick={company => {
            setSelectedCompanyId(company.id);
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
        onClear={() => bulkSelection.deselectAll()}
        campaigns={campaigns}
        userId={user?.id}
      />

      {/* Company Details Slide Out */}
      {selectedCompanyId && (
        <CompanyDetailsSlideOut
          companyId={selectedCompanyId}
          isOpen={isSlideOutOpen}
          onClose={() => {
            setIsSlideOutOpen(false);
            setSelectedCompanyId(null);
            // Remove ID from URL
            router.replace('/companies');
          }}
        />
      )}
    </Page>
  );
}
