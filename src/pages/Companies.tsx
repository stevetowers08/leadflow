'use client';

/**
 * Companies - Unified System Implementation
 *
 * Features:
 * - UnifiedTable with compound components
 * - FilterControls from design system
 * - PaginationControls for data pagination
 * - SearchModal with debounced search
 * - Performance optimizations (useCallback, useMemo, useDebounce)
 * - Proper TypeScript interfaces
 * - Centralized design tokens
 */

import { ClearbitLogoSync } from '@/components/ClearbitLogo';
import { StatusDropdown } from '@/components/people/StatusDropdown';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { IndustryBadges } from '@/components/shared/IndustryBadge';
import { PeopleAvatars } from '@/components/shared/PeopleAvatars';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { FloatingActionBar } from '@/components/people/FloatingActionBar';
import { PersonDetailsSlideOut } from '@/components/slide-out/PersonDetailsSlideOut';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Company, Person, UserProfile } from '@/types/database';
import { formatLastActivity } from '@/utils/relativeTime';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Building2, CheckCircle, Sparkles, Target, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define status arrays as constants to prevent recreation on every render
const COMPANY_STATUS_OPTIONS: string[] = [
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
];

// Client-side mount guard wrapper
const Companies: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading companies...</p>
        </div>
      </div>
    );
  }

  return <CompaniesContent />;
};

const CompaniesContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  // State management
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Slide-out state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);

  // Selected person for slider
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isPersonSlideOutOpen, setIsPersonSlideOutOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Bulk selection
  const bulkSelection = useBulkSelection();

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter options - memoized to prevent re-renders
  const statusOptions = useMemo(
    () => [
      { label: 'All Stages', value: 'all' },
      { label: getStatusDisplayText('new_lead'), value: 'new_lead' },
      { label: getStatusDisplayText('message_sent'), value: 'message_sent' },
      { label: getStatusDisplayText('replied'), value: 'replied' },
      {
        label: getStatusDisplayText('meeting_scheduled'),
        value: 'meeting_scheduled',
      },
      { label: getStatusDisplayText('proposal_sent'), value: 'proposal_sent' },
      { label: getStatusDisplayText('negotiation'), value: 'negotiation' },
      { label: getStatusDisplayText('closed_won'), value: 'closed_won' },
      { label: getStatusDisplayText('closed_lost'), value: 'closed_lost' },
      { label: getStatusDisplayText('on_hold'), value: 'on_hold' },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { label: 'Newest First', value: 'created_at' },
      { label: 'Oldest First', value: 'created_at_asc' },
      { label: 'Company Name A-Z', value: 'name' },
      { label: 'Company Name Z-A', value: 'name_desc' },
      { label: 'Industry A-Z', value: 'industry' },
      { label: 'Head Office A-Z', value: 'head_office' },
      { label: 'Score High-Low', value: 'lead_score' },
      { label: 'Score Low-High', value: 'lead_score_asc' },
    ],
    []
  );

  // Fetch current client ID
  useEffect(() => {
    const fetchClientId = async () => {
      if (!user?.id) return;

      try {
        const { data: clientUser, error } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
            console.error('Error fetching client ID:', error);
          }
          return;
        }

        setCurrentClientId(clientUser?.client_id || null);
      } catch (err) {
        console.error('Error fetching client ID:', err);
      }
    };

    fetchClientId();
  }, [user?.id]);

  // Get client ID for dev mode fallback
  useEffect(() => {
    if (
      !currentClientId &&
      (process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true')
    ) {
      const devClientId = '720ab0e4-0c24-4b71-b906-f1928e44712f';
      // Development mode: using known client_id
      setCurrentClientId(devClientId);
    }
  }, [currentClientId]);

  // Fetch data with React Query for caching and better loading states
  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery({
    queryKey: ['companies-page', currentClientId],
    queryFn: async () => {
      // If we don't have a client ID, return empty data
      if (!currentClientId) {
        return {
          companies: [],
          people: [],
          users: [],
        };
      }

      // Fetch only companies this client has qualified
      // IMPORTANT: Due to RLS, we need to query client_companies first, then get company details
      const [clientCompaniesResult, peopleResult, usersResult] =
        await Promise.all([
          supabase
            .from('client_companies')
            .select(
              `
              *,
              companies!inner(*)
            `
            )
            .eq('client_id', currentClientId)
            .limit(1000), // Limit to prevent loading all records
          supabase
            .from('people')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(500), // Limit people for context
          supabase
            .from('user_profiles')
            .select('id, full_name')
            .order('full_name'),
        ]);

      if (clientCompaniesResult.error) throw clientCompaniesResult.error;
      if (peopleResult.error) throw peopleResult.error;
      if (usersResult.error) throw usersResult.error;

      // Transform the data: client_companies has nested companies object
      const transformedCompanies =
        clientCompaniesResult.data?.map(item => {
          return {
            ...item.companies, // The nested company data
            qualification_status: item.qualification_status,
            qualified_at: item.qualified_at,
            qualified_by: item.qualified_by,
            client_priority: item.priority,
            // Keep the actual pipeline_stage from the company
          };
        }) || [];

        // Debug: Companies fetched and transformed
        if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
          console.log('🔍 Companies Debug:', {
            rawData: clientCompaniesResult.data,
            transformedCount: transformedCompanies.length,
            transformedCompanies,
            currentClientId,
          });
        }

      return {
        companies: transformedCompanies as Company[],
        people: (peopleResult.data as unknown as Person[]) || [],
        users: usersResult.data || [],
      };
    },
    enabled: shouldBypassAuth() || (!authLoading && !!user && !!currentClientId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });

  // Extract data from query result
  const companies = companiesData?.companies || [];
  const people = companiesData?.people || [];
  const loading = companiesLoading;
  const error = companiesError
    ? (companiesError instanceof Error ? companiesError.message : 'Failed to fetch data')
    : null;

  // Update users state when data changes
  useEffect(() => {
    if (companiesData?.users) {
      setUsers(companiesData.users);
    }
  }, [companiesData?.users]);

  // Show error toast if query fails
  useEffect(() => {
    if (companiesError) {
      toast({
        title: 'Error',
        description: 'Failed to load companies data',
        variant: 'destructive',
      });
    }
  }, [companiesError, toast]);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let filtered = companies;

    // Status filter - multi-select
    if (statusFilter.length > 0) {
      filtered = filtered.filter(company =>
        statusFilter.includes(company.pipeline_stage || 'qualified')
      );
    }

    // User filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(company => company.owner_id === selectedUser);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(company => company.is_favourite);
    }

    // Search filter using debounced term
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        company =>
          company.name?.toLowerCase().includes(term) ||
          company.industry?.toLowerCase().includes(term) ||
          company.head_office?.toLowerCase().includes(term)
      );
    }

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let aValue: unknown;
      let bValue: unknown;

      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        case 'created_at_asc':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          return (aValue as number) - (bValue as number);
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'name_desc':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          return (bValue as string).localeCompare(aValue as string);
        case 'industry':
          aValue = a.industry?.toLowerCase() || '';
          bValue = b.industry?.toLowerCase() || '';
          break;
        case 'head_office':
          aValue = a.head_office?.toLowerCase() || '';
          bValue = b.head_office?.toLowerCase() || '';
          break;
        case 'lead_score':
          aValue = parseInt(a.lead_score || '0');
          bValue = parseInt(b.lead_score || '0');
          break;
        case 'lead_score_asc':
          aValue = parseInt(a.lead_score || '0');
          bValue = parseInt(b.lead_score || '0');
          return (aValue as number) - (bValue as number);
        default:
          return 0;
      }

      return (aValue as number) > (bValue as number)
        ? 1
        : (aValue as number) < (bValue as number)
          ? -1
          : 0;
    });
  }, [
    companies,
    statusFilter,
    selectedUser,
    showFavoritesOnly,
    debouncedSearchTerm,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Keyboard shortcuts (Cmd/Ctrl+A to select all on page, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const allIds = paginatedCompanies.map(c => c.id);
        if (bulkSelection.getSelectedIds(allIds).length === allIds.length) {
          bulkSelection.deselectAll();
        } else {
          bulkSelection.selectAll(allIds);
        }
      }
      if (e.key === 'Escape') {
        bulkSelection.deselectAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bulkSelection, paginatedCompanies]);

  // Actual selected count across all filtered rows
  const actualSelectedCount = bulkSelection.getSelectedIds(
    filteredCompanies.map(c => c.id)
  ).length;

  // Placeholder bulk handlers for Companies (UI presence)
  const handleCompaniesExport = useCallback(async () => {
    toast({
      title: 'Export coming soon',
      description: 'Companies export is not implemented yet.',
    });
  }, [toast]);

  const handleCompaniesWorkflow = useCallback(async () => {
    const ids = bulkSelection.getSelectedIds(filteredCompanies.map(c => c.id));
    if (ids.length === 0) return;
    const { error } = await supabase
      .from('companies')
      .update({
        updated_at: new Date().toISOString(),
        pipeline_stage: 'qualified',
      })
      .in('id', ids);
    if (error) {
      toast({
        title: 'Workflow failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Workflow ran',
        description: `Updated ${ids.length} compan${ids.length === 1 ? 'y' : 'ies'}.`,
      });
      // Reflect locally
      setCompanies(prev =>
        prev.map(c =>
          ids.includes(c.id)
            ? {
                ...c,
                pipeline_stage: 'qualified',
                updated_at: new Date().toISOString() as string,
              }
            : c
        )
      );
    }
  }, [toast]);

  const handleCompaniesDelete = useCallback(async () => {
    const ids = bulkSelection.getSelectedIds(filteredCompanies.map(c => c.id));
    if (ids.length === 0) return;
    const { error } = await supabase.from('companies').delete().in('id', ids);
    if (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Deleted',
        description: `Removed ${ids.length} compan${ids.length === 1 ? 'y' : 'ies'}.`,
      });
      setCompanies(prev => prev.filter(c => !ids.includes(c.id)));
      bulkSelection.deselectAll();
    }
  }, [toast, bulkSelection, filteredCompanies]);

  const handleCompaniesSendEmail = useCallback(async () => {
    // Collect people under selected companies and route to Conversations compose
    const companyIds = bulkSelection.getSelectedIds(
      filteredCompanies.map(c => c.id)
    );
    const targetPeople = people
      .filter(p => p.company_id && companyIds.includes(p.company_id))
      .filter(p => !!p.email_address);
    const toIds = targetPeople.map(p => p.id);
    if (toIds.length === 0) {
      toast({
        title: 'No contact emails found',
        description: 'Selected companies have no contacts with emails.',
      });
      return;
    }
    const toIdsParam = encodeURIComponent(toIds.join(','));
    router.push(`/conversations?compose=1&toIds=${toIdsParam}`);
  }, [bulkSelection, filteredCompanies, people, router, toast]);

  // User options for filter
  const userOptions = useMemo(
    () => [
      { label: 'All Users', value: 'all' },
      ...users.map(userItem => ({
        label:
          userItem.id === user?.id
            ? `${userItem.full_name} (me)`
            : userItem.full_name,
        value: userItem.id,
      })),
    ],
    [users, user]
  );

  // Handle row click - open slide-out panel
  const handleRowClick = useCallback((company: Company) => {
    setSelectedCompanyId(company.id);
    setIsSlideOutOpen(true);
  }, []);

  // Handle person click - open person slider
  const handlePersonClick = useCallback((personId: string) => {
    setSelectedPersonId(personId);
    setIsPersonSlideOutOpen(true);
  }, []);

  // Handle company update
  const handleCompanyUpdate = useCallback(() => {
    // Refresh the companies data
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setCompanies((data as unknown as Company[]) || []);
      } catch (err) {
        console.error('Error refreshing companies:', err);
        toast({
          title: 'Error',
          description: 'Failed to refresh companies data',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [toast]);

  // Handle search - memoized for performance
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle favorites toggle - memoized for performance
  const handleFavoritesToggle = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  // Handle search toggle - memoized for performance
  const handleSearchToggle = useCallback(() => {
    setIsSearchActive(prev => !prev);
  }, []);

  // Handle search change - memoized for performance
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle search modal toggle - memoized for performance
  const handleSearchModalToggle = useCallback(() => {
    setIsSearchModalOpen(prev => !prev);
  }, []);

  // Table columns configuration
  const columns: ColumnConfig<Company>[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <div className='flex items-center justify-center' data-bulk-checkbox>
            <Checkbox
              checked={
                paginatedCompanies.length > 0 &&
                paginatedCompanies.every(c => bulkSelection.isSelected(c.id))
              }
              onCheckedChange={checked => {
                if (checked) {
                  bulkSelection.selectAll(paginatedCompanies.map(c => c.id));
                } else {
                  bulkSelection.deselectAll();
                }
              }}
              aria-label='Select all companies'
            />
          </div>
        ),
        width: '50px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => (
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
      },
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        minWidth: '120px',
        cellType: 'status',
        align: 'center',
        getStatusValue: company => company.pipeline_stage || 'new_lead',
        render: (_, company) => {
          return (
            <StatusDropdown
              entityId={company.id}
              entityType='companies'
              currentStatus={company.pipeline_stage || 'new_lead'}
              availableStatuses={COMPANY_STATUS_OPTIONS}
              variant='cell'
              onStatusChange={() => {
                // Trigger refetch of companies data
                const fetchData = async () => {
                  try {
                    const { data, error } = await supabase
                      .from('companies')
                      .select(
                        'id, name, website, linkedin_url, head_office, industry_id, confidence_level, lead_score, score_reason, automation_active, automation_started_at, is_favourite, ai_info, key_info_raw, pipeline_stage, source, logo_url, company_size, normalized_company_size, industry, priority, owner_id, created_at, updated_at, funding_raised, estimated_arr'
                      )
                      .order('created_at', { ascending: false });

                    if (error) throw error;
                    setCompanies((data as unknown as Company[]) || []);
                  } catch (err) {
                    console.error('Error refreshing companies:', err);
                  }
                };
                fetchData();
              }}
            />
          );
        },
      },
      {
        key: 'name',
        label: 'Company',
        width: '300px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='flex items-center gap-2 min-w-0'>
            <ClearbitLogoSync
              companyName={company.name}
              website={company.website}
              size='sm'
            />
            <div className='font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis min-w-0'>
              {company.name || '-'}
            </div>
          </div>
        ),
      },
      {
        key: 'assigned_icon',
        label: 'Owner',
        width: '80px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => (
          <div
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className='flex items-center justify-center w-full overflow-hidden'
          >
            <IconOnlyAssignmentCell
              ownerId={company.owner_id}
              entityId={company.id}
              entityType='companies'
              onAssignmentChange={() => {
                // Refresh the companies data
                const fetchData = async () => {
                  try {
                    const { data, error } = await supabase
                      .from('companies')
                      .select('*')
                      .order('created_at', { ascending: false });

                    if (error) throw error;
                    setCompanies((data as unknown as Company[]) || []);
                  } catch (err) {
                    console.error('Error refreshing companies:', err);
                  }
                };
                fetchData();
              }}
            />
          </div>
        ),
      },
      {
        key: 'head_office',
        label: 'Head Office',
        width: '200px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {company.head_office || '-'}
          </div>
        ),
      },
      {
        key: 'industry',
        label: 'Industry',
        width: '280px',
        cellType: 'regular',
        render: (_, company) => (
          <IndustryBadges
            industries={company.industry}
            badgeVariant='compact'
            maxVisible={3}
            noWrap
            showOverflowIndicator={false}
          />
        ),
      },
      {
        key: 'website',
        label: 'Website',
        width: '220px',
        cellType: 'regular',
        render: (_, company) => {
          const raw = company.website || '';
          const pretty = raw
            ? raw.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            : '';
          const href = raw
            ? /^https?:\/\//.test(raw)
              ? raw
              : `https://${raw}`
            : '';
          return (
            <div className='truncate'>
              {pretty ? (
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                  onClick={e => e.stopPropagation()}
                >
                  {pretty}
                </a>
              ) : (
                '-'
              )}
            </div>
          );
        },
      },
      {
        key: 'linkedin_url',
        label: 'LinkedIn',
        width: '220px',
        cellType: 'regular',
        render: (_, company) => {
          const raw = company.linkedin_url || '';
          const pretty = raw
            ? raw.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            : '';
          const href = raw
            ? /^https?:\/\//.test(raw)
              ? raw
              : `https://${raw}`
            : '';
          return (
            <div className='truncate'>
              {pretty ? (
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                  onClick={e => e.stopPropagation()}
                >
                  {pretty}
                </a>
              ) : (
                '-'
              )}
            </div>
          );
        },
      },
      {
        key: 'company_size',
        label: 'Size',
        width: '120px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {company.company_size || '-'}
          </div>
        ),
      },
      {
        key: 'lead_score',
        label: (
          <span className='flex items-center gap-1'>
            <Sparkles className='h-3 w-3' /> Score
          </span>
        ),
        width: '100px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => (
          <ScoreBadge score={company.lead_score} variant='compact' />
        ),
      },
      {
        key: 'funding_raised',
        label: 'Funding',
        width: '140px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {company.funding_raised != null
              ? `$${Number(company.funding_raised).toLocaleString()}`
              : '-'}
          </div>
        ),
      },
      {
        key: 'estimated_arr',
        label: 'ARR',
        width: '140px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {company.estimated_arr != null
              ? `$${Number(company.estimated_arr).toLocaleString()}`
              : '-'}
          </div>
        ),
      },
      {
        key: 'people_count',
        label: 'People',
        width: '120px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => {
          const companyPeople = people.filter(p => p.company_id === company.id);
          return (
            <div className='flex justify-center items-center overflow-hidden w-full'>
              <PeopleAvatars
                people={companyPeople}
                onPersonClick={handlePersonClick}
                maxVisible={3}
              />
            </div>
          );
        },
      },
      {
        key: 'jobs_count',
        label: 'Jobs',
        width: '80px',
        cellType: 'lead-score',
        align: 'center',
        render: (_, company) => {
          // Calculate jobs count from the jobs array we fetch separately
          const jobsCount = 0; // We'll need to fetch this separately or calculate it differently
          return <span>{jobsCount}</span>;
        },
      },
      {
        key: 'last_activity',
        label: 'Last Activity',
        width: '140px',
        cellType: 'regular',
        render: (_, company) => {
          const activityText = company.last_activity
            ? formatLastActivity(company.last_activity)
            : 'No contact';
          const isNoContact =
            !company.last_activity || activityText === 'No contact';

          return (
            <div
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                isNoContact ? 'text-gray-400' : 'text-foreground'
              }`}
            >
              {activityText}
            </div>
          );
        },
      },
      {
        key: 'created_at',
        label: 'Created',
        width: '120px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {company.created_at
              ? new Date(company.created_at).toLocaleDateString()
              : '-'}
          </div>
        ),
      },
    ],
    [people, paginatedCompanies, bulkSelection]
  );

  // Stats for Companies page
  const stats = useMemo(
    () => [
      {
        icon: Building2,
        value: companies.length,
        label: 'companies',
      },
      {
        icon: Zap,
        value: companies.filter(c => c.pipeline_stage === 'automated').length,
        label: 'automated',
      },
      {
        icon: Target,
        value: companies.filter(c => c.pipeline_stage === 'qualified').length,
        label: 'qualified',
      },
      {
        icon: CheckCircle,
        value: companies.filter(c => c.pipeline_stage === 'meeting_scheduled')
          .length,
        label: 'meetings scheduled',
      },
    ],
    [companies]
  );

  // Error state
  if (error) {
    return (
      <Page stats={stats} title='Companies' hideHeader>
        <div className='flex items-center justify-center h-64'>
          <div className='text-destructive'>Error: {error}</div>
        </div>
      </Page>
    );
  }

  return (
    <Page stats={stats} title='Companies' hideHeader>
      <div className='flex-1 flex flex-col min-h-0 space-y-4'>
        {/* Filter Controls - Left Aligned */}
        <div className='flex items-center justify-start gap-4 min-w-0 flex-wrap'>
          <FilterControls
            statusOptions={statusOptions}
            userOptions={userOptions}
            sortOptions={sortOptions}
            statusFilter={statusFilter}
            selectedUser={selectedUser}
            sortBy={sortBy}
            showFavoritesOnly={showFavoritesOnly}
            searchTerm={searchTerm}
            isSearchActive={isSearchActive}
            onStatusChange={() => {}}
            onMultiSelectStatusChange={setStatusFilter}
            onUserChange={setSelectedUser}
            onSortChange={setSortBy}
            onFavoritesToggle={handleFavoritesToggle}
            onSearchChange={handleSearchChange}
            onSearchToggle={handleSearchToggle}
            useMultiSelectStatus={true}
            className='[&_select]:max-w-[160px] [&_button]:max-w-[160px] [&>div>select]:max-w-[160px] [&>div>button]:max-w-[160px]'
          />
        </div>

        {/* Unified Table - Scrollable area */}
        <div className='flex-1 min-h-0'>
          {!loading && filteredCompanies.length === 0 ? (
            <div className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
              <div className='flex flex-col items-center justify-center py-16 px-4'>
                <Building2 className='h-16 w-16 text-muted-foreground mb-4' />
                <h3 className='text-xl font-semibold mb-2 text-gray-900'>
                  No companies found
                </h3>
                <p className='text-muted-foreground text-center max-w-md mb-6'>
                  {searchTerm
                    ? 'No companies match your search criteria.'
                    : 'Start qualifying jobs to add companies to your list. When you qualify a job, the company automatically appears here.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/jobs')}
                    className='inline-flex items-center gap-2'
                  >
                    <Target className='h-4 w-4' />
                    Go to Jobs Feed
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <UnifiedTable
              data={paginatedCompanies}
              columns={columns}
              tableId='companies'
              pagination={false} // We handle pagination externally
              stickyHeaders={true}
              scrollable={true}
              onRowClick={handleRowClick}
              loading={loading}
              emptyMessage='No companies found'
            />
          )}
        </div>

        {/* Pagination - Compact */}
        <div className='flex-shrink-0 pt-1'>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredCompanies.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            className='mt-0'
          />
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalToggle}
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />

      {/* Company Details Slide-Out */}
      <CompanyDetailsSlideOut
        companyId={selectedCompanyId}
        isOpen={isSlideOutOpen}
        onClose={() => {
          setIsSlideOutOpen(false);
          setSelectedCompanyId(null);
        }}
        onUpdate={handleCompanyUpdate}
        onPersonClick={personId => {
          setSelectedPersonId(personId);
          setIsPersonSlideOutOpen(true);
        }}
      />

      {/* Person Details Slide-Out */}
      <PersonDetailsSlideOut
        personId={selectedPersonId}
        isOpen={isPersonSlideOutOpen}
        onClose={() => {
          setIsPersonSlideOutOpen(false);
          setSelectedPersonId(null);
        }}
        onUpdate={() => {
          // Refresh people data
          const fetchPeople = async () => {
            const { data } = await supabase
              .from('people')
              .select('*')
              .order('created_at', { ascending: false });
            if (data) {
              setPeople(data as Person[]);
            }
          };
          fetchPeople();
        }}
      />

      {/* Floating Action Bar for Bulk Operations (Companies) */}
      <FloatingActionBar
        selectedCount={actualSelectedCount}
        isAllSelected={bulkSelection.isAllSelected}
        onDelete={handleCompaniesDelete}
        onFavourite={async () => {}}
        onExport={handleCompaniesExport}
        onSyncCRM={handleCompaniesWorkflow}
        onSendEmail={handleCompaniesSendEmail}
        onAddToCampaign={async () => {}}
        onClear={bulkSelection.deselectAll}
        campaigns={[]}
      />
    </Page>
  );
};

export default Companies;
