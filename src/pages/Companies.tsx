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

import { StatusDropdown } from '@/components/people/StatusDropdown';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { PersonDetailsSlideOut } from '@/components/slide-out/PersonDetailsSlideOut';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { useAuth } from '@/contexts/AuthContext';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { Company, Person, UserProfile } from '@/types/database';
import { convertNumericScoreToStatus } from '@/utils/colorScheme';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Building2, CheckCircle, Target, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Companies: React.FC = () => {
  const { user } = useAuth();
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
            .select('*')
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
        key: 'status',
        label: 'Status',
        width: '150px',
        cellType: 'status',
        align: 'center',
        getStatusValue: company => company.pipeline_stage || 'new_lead',
        render: (_, company) => {
          const availableStatuses = [
            'new_lead',
            'automated',
            'replied',
            'meeting_scheduled',
            'proposal_sent',
            'negotiation',
            'closed_won',
            'closed_lost',
            'on_hold',
          ];

          return (
            <StatusDropdown
              entityId={company.id}
              entityType='companies'
              currentStatus={company.pipeline_stage || 'new_lead'}
              availableStatuses={availableStatuses}
              onStatusChange={() => {
                // Refresh companies data
                const fetchData = async () => {
                  const { data } = await supabase
                    .from('companies')
                    .select('*')
                    .order('created_at', { ascending: false });
                  if (data) setCompanies(data as Company[]);
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
            <div className='w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
              {company.website ? (
                <img
                  src={`https://logo.clearbit.com/${
                    company.website
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '')
                      .split('/')[0]
                  }`}
                  alt={company.name}
                  className='w-7 h-7 rounded-lg object-cover'
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
              <Building2 className='h-3 w-3 text-gray-400' />
            </div>
            <div className='text-sm font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis min-w-0'>
              {company.name || '-'}
            </div>
          </div>
        ),
      },
      {
        key: 'assigned_icon',
        label: '', // No header
        width: '60px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => (
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
        width: '150px',
        cellType: 'regular',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {company.industry || '-'}
          </div>
        ),
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
        label: 'AI Score',
        width: '100px',
        cellType: 'ai-score',
        align: 'center',
        getStatusValue: company =>
          convertNumericScoreToStatus(company.lead_score),
        render: (_, company) => <span>{company.lead_score ?? '-'}</span>,
      },
      {
        key: 'people_count',
        label: 'People',
        width: '100px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => {
          const count = people.filter(p => p.company_id === company.id).length;
          return (
            <span className='text-sm font-medium text-gray-900'>{count}</span>
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
    [people]
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
      <div className='flex-1 flex flex-col min-h-0 space-y-3'>
        {/* Filter Controls */}
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
          onStatusChange={setStatusFilter}
          onUserChange={setSelectedUser}
          onSortChange={setSortBy}
          onFavoritesToggle={handleFavoritesToggle}
          onSearchChange={handleSearchChange}
          onSearchToggle={handleSearchToggle}
        />

        {/* Unified Table - Scrollable area */}
        <div className='flex-1 min-h-0'>
          <UnifiedTable
            data={paginatedCompanies}
            columns={columns}
            pagination={false} // We handle pagination externally
            stickyHeaders={true}
            scrollable={true}
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage='No companies found'
          />
        </div>

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
    </Page>
  );
};

export default Companies;
