/**
 * PeopleV2 - Unified System Implementation
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
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/services/logoService';
import { Person, UserProfile } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Building2, CheckCircle, Target, Users, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const PeopleV2: React.FC = () => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const { toast } = useToast();

  // State management
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
      { label: getStatusDisplayText('new'), value: 'new' },
      {
        label: getStatusDisplayText('connection_requested'),
        value: 'connection_requested',
      },
      { label: getStatusDisplayText('connected'), value: 'connected' },
      { label: getStatusDisplayText('messaged'), value: 'messaged' },
      { label: getStatusDisplayText('replied'), value: 'replied' },
      {
        label: getStatusDisplayText('meeting_booked'),
        value: 'meeting_booked',
      },
      { label: getStatusDisplayText('meeting_held'), value: 'meeting_held' },
      { label: getStatusDisplayText('disqualified'), value: 'disqualified' },
      { label: getStatusDisplayText('in queue'), value: 'in queue' },
      { label: getStatusDisplayText('lead_lost'), value: 'lead_lost' },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { label: 'Newest First', value: 'created_at' },
      { label: 'Oldest First', value: 'created_at_asc' },
      { label: 'Name A-Z', value: 'name' },
      { label: 'Name Z-A', value: 'name_desc' },
      { label: 'Email A-Z', value: 'email_address' },
      { label: 'Company A-Z', value: 'company_name' },
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
        const [peopleResult, usersResult] = await Promise.all([
          supabase
            .from('people')
            .select(
              `
              *,
              companies!left(name, website)
            `
            )
            .order('created_at', { ascending: false }),
          supabase
            .from('user_profiles')
            .select('id, full_name')
            .order('full_name'),
        ]);

        if (peopleResult.error) throw peopleResult.error;
        if (usersResult.error) throw usersResult.error;

        // Normalize the data to match our Person interface
        const normalizedPeople = (peopleResult.data || []).map(
          (person: Record<string, unknown>) => ({
            ...person,
            company_name: (person.companies as Record<string, unknown>)?.name || null,
            company_website: (person.companies as Record<string, unknown>)?.website || null,
          })
        );

        setPeople(normalizedPeople as Person[]);
        setUsers(usersResult.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast({
          title: 'Error',
          description: 'Failed to load people data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter and sort people
  const filteredPeople = useMemo(() => {
    let filtered = people;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(person => person.stage === statusFilter);
    }

    // User filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(person => person.owner_id === selectedUser);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(person => person.is_favourite);
    }

    // Search filter using debounced term
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        person =>
          person.name?.toLowerCase().includes(term) ||
          person.email_address?.toLowerCase().includes(term) ||
          person.company_name?.toLowerCase().includes(term)
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
          return aValue - bValue;
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'name_desc':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          return (bValue as string).localeCompare(aValue as string);
        case 'email_address':
          aValue = a.email_address?.toLowerCase() || '';
          bValue = b.email_address?.toLowerCase() || '';
          break;
        case 'company_name':
          aValue = a.company_name?.toLowerCase() || '';
          bValue = b.company_name?.toLowerCase() || '';
          break;
        case 'lead_score':
          aValue = parseFloat(a.lead_score || '0');
          bValue = parseFloat(b.lead_score || '0');
          break;
        case 'lead_score_asc':
          aValue = parseFloat(a.lead_score || '0');
          bValue = parseFloat(b.lead_score || '0');
          return (aValue as number) - (bValue as number);
        default:
          return 0;
      }

      return (aValue as number) > (bValue as number) ? 1 : (aValue as number) < (bValue as number) ? -1 : 0;
    });
  }, [
    people,
    statusFilter,
    selectedUser,
    showFavoritesOnly,
    debouncedSearchTerm,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredPeople.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPeople = filteredPeople.slice(startIndex, endIndex);

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
    (person: Person) => {
      openPopup('lead', person.id, person.name || 'Unknown');
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

  // Table columns configuration
  const columns: ColumnConfig<Person>[] = useMemo(
    () => [
      {
        key: 'stage',
        label: 'Status',
        width: '120px',
        cellType: 'status',
        align: 'center',
        getStatusValue: person => person.stage || 'new',
        render: (_, person) => {
          const status = person.stage || 'new';
          const displayText = getStatusDisplayText(status);
          return <span className='text-xs font-medium'>{displayText}</span>;
        },
      },
      {
        key: 'name',
        label: 'Person',
        width: '300px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {person.name || '-'}
          </div>
        ),
      },
      {
        key: 'company_name',
        label: 'Company',
        width: '250px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='flex items-center gap-3'>
            <div className='w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
              {person.company_website ? (
                <img
                  src={getClearbitLogo(
                    person.company_name || '',
                    person.company_website
                  )}
                  alt={person.company_name || ''}
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
                style={{ display: person.company_website ? 'none' : 'flex' }}
              >
                <Building2 className='h-3 w-3' />
              </div>
            </div>
            <div className='min-w-0 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors duration-150'>
              <div className='text-sm font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis'>
                {person.company_name || '-'}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'company_role',
        label: 'Role',
        width: '200px',
        cellType: 'regular',
        render: role => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {role || '-'}
          </div>
        ),
      },
      {
        key: 'employee_location',
        label: 'Location',
        width: '150px',
        cellType: 'regular',
        render: location => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {location || '-'}
          </div>
        ),
      },
      {
        key: 'owner_id',
        label: 'Assigned To',
        width: '150px',
        cellType: 'regular',
        render: (_, person) => {
          const assignedUser = users.find(u => u.id === person.owner_id);
          return (
            <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
              {assignedUser?.full_name || 'Unassigned'}
            </div>
          );
        },
      },
      {
        key: 'lead_score',
        label: 'AI Score',
        width: '100px',
        cellType: 'ai-score',
        align: 'center',
        render: score => <span>{score ?? '-'}</span>,
      },
      {
        key: 'created_at',
        label: 'Created',
        width: '120px',
        cellType: 'regular',
        render: date => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {date ? new Date(date).toLocaleDateString() : '-'}
          </div>
        ),
      },
    ],
    [users]
  );

  // Stats for People page
  const stats = useMemo(
    () => [
      {
        icon: Users,
        value: people.length,
        label: 'people',
      },
      {
        icon: Zap,
        value: people.filter(p =>
          ['connected', 'messaged', 'replied'].includes(p.stage || '')
        ).length,
        label: 'contacted',
      },
      {
        icon: Target,
        value: people.filter(p => p.stage === 'new').length,
        label: getStatusDisplayText('new') + ' leads',
      },
      {
        icon: CheckCircle,
        value: people.filter(p => p.stage === 'meeting_booked').length,
        label: 'meetings scheduled',
      },
    ],
    [people]
  );

  if (loading) {
    return (
      <Page stats={stats} title="People" hideHeader>
        <div className='flex items-center justify-center h-64'>
          <div className='text-muted-foreground'>Loading people...</div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page stats={stats} title="People" hideHeader>
        <div className='flex items-center justify-center h-64'>
          <div className='text-destructive'>Error: {error}</div>
        </div>
      </Page>
    );
  }

  return (
    <Page stats={stats} hideHeader>
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
        data={paginatedPeople}
        columns={columns}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage='No people found'
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredPeople.length}
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

export default PeopleV2;
