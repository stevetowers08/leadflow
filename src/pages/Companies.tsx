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

import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { TableAssignmentCell } from '@/components/shared/TableAssignmentCell';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { Company, Person, UserProfile } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Building2, CheckCircle, Target, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Companies: React.FC = () => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const { toast } = useToast();

  // State management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter options - memoized to prevent re-renders
  const statusOptions = useMemo(
    () => [
      { label: 'All Stages', value: 'all' },
      { label: getStatusDisplayText('new_lead'), value: 'new_lead' },
      { label: getStatusDisplayText('automated'), value: 'automated' },
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

  // Fetch data with parallel requests for better performance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallel data fetching for better performance
        const [companiesResult, peopleResult, usersResult] = await Promise.all([
          supabase
            .from('companies')
            .select(
              `
              *,
              people(count),
              jobs(count)
            `
            )
            .order('created_at', { ascending: false }),
          supabase
            .from('people')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('user_profiles')
            .select('id, full_name')
            .order('full_name'),
        ]);

        if (companiesResult.error) throw companiesResult.error;
        if (peopleResult.error) throw peopleResult.error;
        if (usersResult.error) throw usersResult.error;

        setCompanies((companiesResult.data as unknown as Company[]) || []);
        setPeople((peopleResult.data as unknown as Person[]) || []);
        setUsers((usersResult.data as unknown as UserProfile[]) || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast({
          title: 'Error',
          description: 'Failed to load companies data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let filtered = companies;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        company => company.pipeline_stage === statusFilter
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

      return (aValue as number) > (bValue as number) ? 1 : (aValue as number) < (bValue as number) ? -1 : 0;
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

  // Handle row click - memoized for performance
  const handleRowClick = useCallback(
    (company: Company) => {
      openPopup('company', company.id, company.name);
    },
    [openPopup]
  );

  // Handle search - memoized for performance
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle favorites toggle - memoized for performance
  const handleFavoritesToggle = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  // Handle search modal toggle - memoized for performance
  const handleSearchModalToggle = useCallback(() => {
    setIsSearchModalOpen(prev => !prev);
  }, []);

  // Handle company click - memoized for performance
  const handleCompanyClick = useCallback(
    (company: Company) => {
      openPopup('company', company.id, company.name);
    },
    [openPopup]
  );

  // Table columns configuration
  const columns: ColumnConfig<Company>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        cellType: 'status',
        align: 'center',
        getStatusValue: (company) => company.pipeline_stage || 'new_lead',
        render: (_, company) => {
          const status = company.pipeline_stage || 'new_lead';
          const displayText = getStatusDisplayText(status);
          return <span className="text-xs font-medium">{displayText}</span>;
        },
      },
      {
        key: 'name',
        label: 'Company',
        width: '300px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='flex items-center gap-3'>
            <div className='w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
              {company.website ? (
                <img
                  src={`https://logo.clearbit.com/${
                    company.website
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '')
                      .split('/')[0]
                  }`}
                  alt={company.name}
                  className='w-6 h-6 rounded-lg object-cover'
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
              <div
                className='w-6 h-6 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center'
                style={{ display: company.website ? 'none' : 'flex' }}
              >
                <Building2 className='h-3 w-3' />
              </div>
            </div>
            <div className='flex flex-col min-w-0 flex-1'>
              <div className='text-sm font-medium text-gray-900'>
                {company.name || '-'}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'head_office',
        label: 'Head Office',
        width: '200px',
        cellType: 'regular',
        render: value => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {(value as string) || '-'}
          </div>
        ),
      },
      {
        key: 'industry',
        label: 'Industry',
        width: '150px',
        cellType: 'regular',
        render: value => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {(value as string) || '-'}
          </div>
        ),
      },
      {
        key: 'company_size',
        label: 'Size',
        width: '120px',
        cellType: 'regular',
        render: value => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {(value as string) || '-'}
          </div>
        ),
      },
      {
        key: 'owner_id',
        label: 'Person',
        width: '150px',
        cellType: 'regular',
        render: (_, company) => (
          <TableAssignmentCell
            ownerId={company.owner_id}
            entityId={company.id}
            entityType="companies"
            onAssignmentChange={() => {
              // Refresh the companies data
              const fetchData = async () => {
                try {
                  const { data, error } = await supabase
                    .from('companies')
                    .select(`
                      *,
                      people(count),
                      jobs(count)
                    `)
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
        ),
      },
      {
        key: 'lead_score',
        label: 'AI Score',
        width: '100px',
        cellType: 'ai-score',
        align: 'center',
        render: score => <span>{(score as string) ?? '-'}</span>,
      },
      {
        key: 'people_count',
        label: 'People',
        width: '80px',
        cellType: 'lead-score',
        align: 'center',
        render: (_, company) => {
          const count = people.filter(p => p.company_id === company.id).length;
          return <span>{count}</span>;
        },
      },
      {
        key: 'jobs_count',
        label: 'Jobs',
        width: '80px',
        cellType: 'lead-score',
        align: 'center',
        render: (_, company) => {
          const count = ((company as unknown as Record<string, unknown>).jobs as unknown[])?.length || 0;
          return <span>{count}</span>;
        },
      },
      {
        key: 'created_at',
        label: 'Created',
        width: '120px',
        cellType: 'regular',
        render: date => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {date ? new Date(date as string).toLocaleDateString() : '-'}
          </div>
        ),
      },
    ],
    [people, users]
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
        value: companies.filter(c => c.pipeline_stage === 'new_lead').length,
        label: 'new prospects',
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

  if (loading) {
    return (
      <Page stats={stats} title="Companies" hideHeader>
        <div className='flex items-center justify-center h-64'>
          <div className='text-muted-foreground'>Loading companies...</div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page stats={stats} title="Companies" hideHeader>
        <div className='flex items-center justify-center h-64'>
          <div className='text-destructive'>Error: {error}</div>
        </div>
      </Page>
    );
  }

  return (
    <Page stats={stats} title="Companies" hideHeader>
      {/* Filter Controls */}
      <FilterControls
        statusOptions={statusOptions}
        userOptions={userOptions}
        sortOptions={sortOptions}
        statusFilter={statusFilter}
        selectedUser={selectedUser}
        sortBy={sortBy}
        showFavoritesOnly={showFavoritesOnly}
        onStatusChange={setStatusFilter}
        onUserChange={setSelectedUser}
        onSortChange={setSortBy}
        onFavoritesToggle={handleFavoritesToggle}
        onSearchClick={handleSearchModalToggle}
      />

      {/* Unified Table */}
      <UnifiedTable
        data={paginatedCompanies}
        columns={columns}
        onRowClick={handleCompanyClick}
        loading={loading}
        emptyMessage='No companies found'
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredCompanies.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50, 100]}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalToggle}
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />
    </Page>
  );
};

export default Companies;
