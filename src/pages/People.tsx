'use client';

/**
 * People - Unified System Implementation
 *
 * Features:
 * - UnifiedTable with compound components
 * - FilterControls from design system
 * - PaginationControls for data pagination
 * - SearchModal with debounced search
 * - Performance optimizations (useCallback, useMemo, useDebounce)
 * - Proper TypeScript interfaces
 * - Centralized design tokens
 * - AI Score cells with status-like styling
 */

import { ClearbitLogoSync } from '@/components/ClearbitLogo';
import { FloatingActionBar } from '@/components/people/FloatingActionBar';
import { StatusDropdown } from '@/components/people/StatusDropdown';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { PersonDetailsSlideOut } from '@/components/slide-out/PersonDetailsSlideOut';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { Page } from '@/design-system/components';
import { CollapsibleFilterControls } from '@/components/shared/CollapsibleFilterControls';
import { useToast } from '@/hooks/use-toast';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  bulkAddToCampaign,
  bulkDeletePeople,
  bulkExportPeople,
  bulkFavouritePeople,
  bulkSyncToCRM,
} from '@/services/bulk/bulkPeopleService';
import { Person, UserProfile } from '@/types/database';
import { formatLastActivity } from '@/utils/relativeTime';
import {
  ReplyIntentIndicator,
  type ReplyIntent,
} from '@/utils/replyIntentUtils.tsx';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { CheckCircle, Sparkles, Target, Users, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define status arrays as constants to prevent recreation on every render
const PEOPLE_STATUS_OPTIONS: string[] = [
  'new_lead',
  'message_sent',
  'replied',
  'interested',
  'meeting_scheduled',
  'meeting_completed',
  'follow_up',
  'not_interested',
];

// Client-side mount guard wrapper
const People: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading people...</p>
        </div>
      </div>
    );
  }

  return <PeopleContent />;
};

const PeopleContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // State management
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Slide-out state
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);

  // Bulk selection
  const bulkSelection = useBulkSelection();

  // Campaigns for bulk operations
  const [campaigns, setCampaigns] = useState<
    Array<{ id: string; name: string }>
  >([]);

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
      { label: getStatusDisplayText('message_sent'), value: 'message_sent' },
      { label: getStatusDisplayText('replied'), value: 'replied' },
      { label: getStatusDisplayText('interested'), value: 'interested' },
      {
        label: getStatusDisplayText('meeting_scheduled'),
        value: 'meeting_scheduled',
      },
      {
        label: getStatusDisplayText('meeting_completed'),
        value: 'meeting_completed',
      },
      { label: getStatusDisplayText('follow_up'), value: 'follow_up' },
      {
        label: getStatusDisplayText('not_interested'),
        value: 'not_interested',
      },
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

  // Fetch data with React Query for caching and better loading states
  const {
    data: peopleData,
    isLoading: peopleLoading,
    error: peopleError,
  } = useQuery({
    queryKey: ['people-page'],
    queryFn: async () => {
      // Parallel data fetching for better performance with limit
      const [peopleResult, usersResult] = await Promise.all([
        supabase
          .from('people')
          .select(
            `
              *,
              companies!left(name, website)
            `
          )
          .order('created_at', { ascending: false })
          .limit(1000), // Limit to prevent loading all records
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
          company_name:
            (person.companies as Record<string, unknown>)?.name || null,
          company_website:
            (person.companies as Record<string, unknown>)?.website || null,
        })
      );

      return {
        people: normalizedPeople as Person[],
        users: usersResult.data || [],
      };
    },
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });

  // Extract people from query result
  const people = peopleData?.people || [];
  const loading = peopleLoading;
  const error = peopleError
    ? peopleError instanceof Error
      ? peopleError.message
      : 'Failed to fetch data'
    : null;

  // Update users state when data changes
  useEffect(() => {
    if (peopleData?.users) {
      setUsers(peopleData.users);
    }
  }, [peopleData?.users]);

  // Fetch campaigns for bulk operations (separate query)
  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('id, name')
        .order('name');
      setCampaigns(campaignsData || []);
    };
    fetchCampaigns();
  }, []);

  // Show error toast if query fails
  useEffect(() => {
    if (peopleError) {
      toast({
        title: 'Error',
        description: 'Failed to load people data',
        variant: 'destructive',
      });
    }
  }, [peopleError, toast]);

  // Filter and sort people
  const filteredPeople = useMemo(() => {
    let filtered = people;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        person => person.people_stage === statusFilter
      );
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

      return (aValue as number) > (bValue as number)
        ? 1
        : (aValue as number) < (bValue as number)
          ? -1
          : 0;
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

  // Handle row click - open slide-out panel (only if not clicking checkbox)
  const handleRowClick = useCallback(
    (person: Person, event?: React.MouseEvent) => {
      // Don't open slide-out if clicking checkbox or status dropdown
      if (
        event?.target &&
        (event.target as HTMLElement).closest(
          '[data-bulk-checkbox], [data-radix-popper-content-wrapper]'
        )
      ) {
        return;
      }
      setSelectedPersonId(person.id);
      setIsSlideOutOpen(true);
    },
    []
  );

  // Bulk operation handlers
  const handleBulkDelete = useCallback(async () => {
    const idsToDelete = bulkSelection.getSelectedIds(
      filteredPeople.map(p => p.id)
    );
    const result = await bulkDeletePeople(idsToDelete);

    toast({
      title: result.success ? 'Success' : 'Partial Success',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    // Refresh data and clear selection
    if (result.successCount > 0) {
      bulkSelection.deselectAll();
      // Trigger refresh
      const { data, error } = await supabase
        .from('people')
        .select(`*, companies!left(name, website)`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const normalizedPeople = data.map(
          (person: Record<string, unknown>) => ({
            ...person,
            company_name:
              (person.companies as Record<string, unknown>)?.name || null,
            company_website:
              (person.companies as Record<string, unknown>)?.website || null,
          })
        );
        setPeople(normalizedPeople as Person[]);
      }
    }
  }, [bulkSelection, filteredPeople, toast]);

  const handleBulkFavourite = useCallback(async () => {
    const idsToUpdate = bulkSelection.getSelectedIds(
      filteredPeople.map(p => p.id)
    );
    const result = await bulkFavouritePeople(idsToUpdate, true);

    toast({
      title: result.success ? 'Success' : 'Partial Success',
      description: result.message,
    });

    if (result.successCount > 0) {
      bulkSelection.deselectAll();
      // Refresh data
      const { data } = await supabase
        .from('people')
        .select(`*, companies!left(name, website)`)
        .order('created_at', { ascending: false });

      if (data) {
        const normalizedPeople = data.map(
          (person: Record<string, unknown>) => ({
            ...person,
            company_name:
              (person.companies as Record<string, unknown>)?.name || null,
            company_website:
              (person.companies as Record<string, unknown>)?.website || null,
          })
        );
        setPeople(normalizedPeople as Person[]);
      }
    }
  }, [bulkSelection, filteredPeople, toast]);

  const handleBulkExport = useCallback(async () => {
    const idsToExport = bulkSelection.getSelectedIds(
      filteredPeople.map(p => p.id)
    );
    const result = await bulkExportPeople(idsToExport);

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  }, [bulkSelection, filteredPeople, toast]);

  const handleBulkSendEmail = useCallback(async () => {
    const selectedIds = bulkSelection.getSelectedIds(
      filteredPeople.map(p => p.id)
    );
    if (selectedIds.length === 0) {
      toast({ title: 'Select at least one contact' });
      return;
    }
    // Route to Conversations composer with selected person IDs
    const toIdsParam = encodeURIComponent(selectedIds.join(','));
    router.push(`/conversations?compose=1&toIds=${toIdsParam}`);
  }, [bulkSelection, filteredPeople, router, toast]);

  const handleBulkSyncCRM = useCallback(async () => {
    const idsToSync = bulkSelection.getSelectedIds(
      filteredPeople.map(p => p.id)
    );
    const result = await bulkSyncToCRM(idsToSync);

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  }, [bulkSelection, filteredPeople, toast]);

  const handleBulkAddToCampaign = useCallback(
    async (campaignId: string) => {
      const idsToAdd = bulkSelection.getSelectedIds(
        filteredPeople.map(p => p.id)
      );
      const result = await bulkAddToCampaign(idsToAdd, campaignId);

      toast({
        title: result.success ? 'Success' : 'Partial Success',
        description: result.message,
      });

      if (result.successCount > 0) {
        bulkSelection.deselectAll();
      }
    },
    [bulkSelection, filteredPeople, toast]
  );

  // Handle person stage update
  const handlePersonUpdate = useCallback(() => {
    // Refresh the people data
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('people')
          .select(
            `
            *,
            companies!left(name, website)
          `
          )
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Normalize the data to match our Person interface
        const normalizedPeople = (data || []).map(
          (person: Record<string, unknown>) => ({
            ...person,
            company_name:
              (person.companies as Record<string, unknown>)?.name || null,
            company_website:
              (person.companies as Record<string, unknown>)?.website || null,
          })
        );

        setPeople(normalizedPeople as Person[]);
      } catch (err) {
        console.error('Error refreshing people:', err);
        toast({
          title: 'Error',
          description: 'Failed to refresh people data',
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

  // Keyboard shortcuts (Cmd/Ctrl+A for select all)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+A to select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const allIds = paginatedPeople.map(p => p.id);
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
  }, [bulkSelection, paginatedPeople]);

  // Calculate actual selected count (resolves select-all against all filtered rows)
  const actualSelectedCount = bulkSelection.getSelectedIds(
    filteredPeople.map(p => p.id)
  ).length;

  // Memoized checkbox render to prevent re-renders
  const renderCheckbox = useCallback(
    (person: Person) => (
      <div
        className='flex items-center justify-center'
        data-bulk-checkbox
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={bulkSelection.isSelected(person.id)}
          onCheckedChange={() => bulkSelection.toggleItem(person.id)}
          aria-label={`Select ${person.name}`}
        />
      </div>
    ),
    [bulkSelection]
  );

  // Memoized status dropdown render to prevent re-renders
  const renderStatusDropdown = useCallback(
    (_: unknown, person: Person) => (
      <StatusDropdown
        entityId={person.id}
        entityType='people'
        currentStatus={person.people_stage || 'new_lead'}
        availableStatuses={PEOPLE_STATUS_OPTIONS}
        variant='cell'
        onStatusChange={handlePersonUpdate}
      />
    ),
    [handlePersonUpdate]
  );

  // Table columns configuration
  const columns: ColumnConfig<Person>[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <div className='flex items-center justify-center' data-bulk-checkbox>
            <Checkbox
              checked={
                paginatedPeople.length > 0 &&
                paginatedPeople.every(p => bulkSelection.isSelected(p.id))
              }
              onCheckedChange={checked => {
                if (checked) {
                  bulkSelection.selectAll(paginatedPeople.map(p => p.id));
                } else {
                  bulkSelection.deselectAll();
                }
              }}
              aria-label='Select all people'
            />
          </div>
        ),
        width: '50px',
        cellType: 'regular',
        align: 'center',
        render: (_, person) => renderCheckbox(person),
      },
      {
        key: 'stage',
        label: 'Status',
        width: '120px',
        minWidth: '120px',
        cellType: 'status',
        align: 'center',
        getStatusValue: person => person.people_stage || 'new_lead',
        render: (_, person) => (
          <StatusDropdown
            entityId={person.id}
            entityType='people'
            currentStatus={person.people_stage || 'new_lead'}
            availableStatuses={PEOPLE_STATUS_OPTIONS}
            variant='cell'
            onStatusChange={handlePersonUpdate}
          />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        width: '200px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis'>
            {person.name || '-'}
          </div>
        ),
      },
      {
        key: 'company_role',
        label: 'Position',
        width: '250px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis'>
            {person.company_role || '-'}
          </div>
        ),
      },
      {
        key: 'company_name',
        label: 'Company',
        width: '250px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='flex items-center gap-2 min-w-0'>
            <ClearbitLogoSync
              companyName={person.company_name || ''}
              website={person.company_website}
              size='sm'
            />
            <div className='font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis min-w-0'>
              {person.company_name || '-'}
            </div>
          </div>
        ),
      },
      {
        key: 'assigned_icon',
        label: 'Owner',
        width: '60px',
        cellType: 'regular',
        align: 'center',
        render: (_, person) => (
          <IconOnlyAssignmentCell
            ownerId={person.owner_id}
            entityId={person.id}
            entityType='people'
            onAssignmentChange={() => {
              // Refresh the people data
              const fetchData = async () => {
                try {
                  const { data, error } = await supabase
                    .from('people')
                    .select(
                      `
                      *,
                      companies!left(name, website)
                    `
                    )
                    .order('created_at', { ascending: false });

                  if (error) throw error;

                  // Normalize the data to match our Person interface
                  const normalizedPeople = (data || []).map(
                    (person: Record<string, unknown>) => ({
                      ...person,
                      company_name:
                        (person.companies as Record<string, unknown>)?.name ||
                        null,
                      company_website:
                        (person.companies as Record<string, unknown>)
                          ?.website || null,
                    })
                  );

                  setPeople(normalizedPeople as Person[]);
                } catch (err) {
                  console.error('Error refreshing people:', err);
                }
              };
              fetchData();
            }}
          />
        ),
      },
      {
        key: 'last_activity',
        label: 'Last Activity',
        width: '140px',
        cellType: 'regular',
        render: (_, person) => {
          const activityText = person.last_activity
            ? formatLastActivity(person.last_activity)
            : 'No contact';
          const isNoContact =
            !person.last_activity || activityText === 'No contact';

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
        key: 'reply_intent',
        label: (
          <span className='flex items-center gap-1'>
            <Sparkles className='h-3 w-3' /> Reply Intent
          </span>
        ),
        width: '120px',
        minWidth: '120px',
        cellType: 'regular',
        align: 'center',
        render: (_, person) => {
          if (!person.reply_type && !person.last_reply_at) {
            return <span className='text-xs text-gray-400'>—</span>;
          }
          return (
            <div className='flex items-center justify-center'>
              <ReplyIntentIndicator
                intent={person.reply_type as ReplyIntent}
                size='sm'
              />
            </div>
          );
        },
      },
      {
        key: 'email_address',
        label: 'Email Address',
        width: '250px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {person.email_address || '-'}
          </div>
        ),
      },
      {
        key: 'employee_location',
        label: 'Location',
        width: '150px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {person.employee_location || '-'}
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
        render: (_, person) => (
          <ScoreBadge score={person.lead_score} variant='compact' />
        ),
      },
      {
        key: 'created_at',
        label: 'Created',
        width: '120px',
        cellType: 'regular',
        render: (_, person) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {person.created_at
              ? new Date(person.created_at).toLocaleDateString()
              : '-'}
          </div>
        ),
      },
    ],
    [
      paginatedPeople,
      bulkSelection,
      handlePersonUpdate,
      renderCheckbox,
      renderStatusDropdown,
    ]
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
          ['message_sent', 'replied', 'interested'].includes(
            p.people_stage || ''
          )
        ).length,
        label: 'contacted',
      },
      {
        icon: Target,
        value: people.filter(p => p.people_stage === 'new_lead').length,
        label: getStatusDisplayText('new') + ' leads',
      },
      {
        icon: CheckCircle,
        value: people.filter(p => p.people_stage === 'meeting_scheduled')
          .length,
        label: 'meetings scheduled',
      },
    ],
    [people]
  );

  // Error state
  if (error) {
    return (
      <Page stats={stats} title='Contacts' hideHeader>
        <div className='flex items-center justify-center h-64'>
          <div className='text-destructive'>Error: {error}</div>
        </div>
      </Page>
    );
  }

  return (
    <Page stats={stats} title='Contacts' hideHeader>
      {/* Container for table layout - fills available height */}
      <div className='flex flex-col' style={{ height: '100%', minHeight: 0 }}>
        {/* Filters - Fixed at top */}
        <div className='flex-shrink-0 pb-4'>
          <CollapsibleFilterControls
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
        </div>

        {/* Table - Scrollable middle */}
        <div className='flex-1 min-h-0 flex flex-col overflow-hidden'>
          <UnifiedTable
            data={paginatedPeople}
            columns={columns}
            tableId='people'
            pagination={false}
            stickyHeaders={true}
            scrollable={true}
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage='No people found'
          />
        </div>

        {/* Pagination - Fixed at bottom */}
        <div className='flex-shrink-0 pt-4'>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredPeople.length}
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

      {/* Person Details Slide-Out */}
      <PersonDetailsSlideOut
        personId={selectedPersonId}
        isOpen={isSlideOutOpen}
        onClose={() => {
          setIsSlideOutOpen(false);
          setSelectedPersonId(null);
        }}
        onUpdate={handlePersonUpdate}
      />

      {/* Floating Action Bar for Bulk Operations */}
      <FloatingActionBar
        selectedCount={actualSelectedCount}
        isAllSelected={bulkSelection.isAllSelected}
        onDelete={handleBulkDelete}
        onFavourite={handleBulkFavourite}
        onExport={handleBulkExport}
        onSyncCRM={handleBulkSyncCRM}
        onSendEmail={handleBulkSendEmail}
        onAddToCampaign={handleBulkAddToCampaign}
        onClear={bulkSelection.deselectAll}
        campaigns={campaigns}
      />
    </Page>
  );
};

export default People;
