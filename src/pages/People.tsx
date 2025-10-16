/**
 * DEPRECATED: People Page (v1) - Legacy Implementation
 * 
 * ⚠️  WARNING: This page uses the old EnhancedTable system and should NOT be used.
 * 
 * Please use PeopleV2.tsx instead, which implements the unified design system:
 * - UnifiedTable component
 * - Consistent styling and behavior
 * - Better performance and maintainability
 * 
 * This file will be removed in a future update.
 * 
 * Legacy Features (DO NOT USE):
 * - EnhancedTable component (removed)
 * - Inconsistent styling
 * - Old pagination system
 */
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { OwnerDisplay } from '@/components/OwnerDisplay';
import { Button } from '@/components/ui/button';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import {
  EnhancedTable,
  EnhancedTableBody,
  EnhancedTableCell,
  EnhancedTableHead,
  EnhancedTableHeader,
  EnhancedTableRow,
} from '@/components/ui/enhanced-table';
import { SearchIconButton, SearchModal } from '@/components/ui/search-modal';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { Page, type StatItemProps } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { CheckCircle, Star, Target, Users, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Lead = Tables<'people'> & {
  company_name?: string | null;
};

// Normalize various truthy values that might be stored as string/boolean
const toBoolean = (val: unknown): boolean => {
  return (
    val === true ||
    val === 'true' ||
    val === 't' ||
    val === 1 ||
    val === '1' ||
    val === 'yes'
  );
};

const People = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<
    { id: string; full_name: string; role: string }[]
  >([]);
  const [selectedLeadForAssignment, setSelectedLeadForAssignment] =
    useState<Lead | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();

  // Sort options
  const sortOptions = [
    { label: 'Created Date', value: 'created_at' },
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Email', value: 'email' },
    { label: 'Company', value: 'company_name' },
    { label: 'Status', value: 'stage' },
    { label: 'Priority', value: 'priority' },
  ];

  // Status filter options - based on actual database enum values
  const statusOptions = [
    { label: 'All Stages', value: 'all' },
    { label: getStatusDisplayText('new'), value: 'new' },
    {
      label: getStatusDisplayText('connection_requested'),
      value: 'connection_requested',
    },
    { label: getStatusDisplayText('connected'), value: 'connected' },
    { label: getStatusDisplayText('messaged'), value: 'messaged' },
    { label: getStatusDisplayText('replied'), value: 'replied' },
    { label: getStatusDisplayText('meeting_booked'), value: 'meeting_booked' },
    { label: getStatusDisplayText('meeting_held'), value: 'meeting_held' },
    { label: getStatusDisplayText('disqualified'), value: 'disqualified' },
    { label: getStatusDisplayText('in queue'), value: 'in queue' },
    { label: getStatusDisplayText('lead_lost'), value: 'lead_lost' },
  ];

  // Calculate stats for stats cards (match current enum values)
  const peopleStats = useMemo(() => {
    let newLeads = 0;
    let contactedLeads = 0; // aggregate of connected/messaged/replied
    let meetingScheduledLeads = 0; // meeting_booked
    let closedWonLeads = 0; // use meeting_held as "won"
    let closedLostLeads = 0; // lead_lost

    leads.forEach(lead => {
      switch (lead.stage) {
        case 'new':
          newLeads++;
          break;
        case 'connected':
        case 'messaged':
        case 'replied':
          contactedLeads++;
          break;
        case 'meeting_booked':
          meetingScheduledLeads++;
          break;
        case 'meeting_held':
          closedWonLeads++;
          break;
        case 'lead_lost':
        case 'disqualified':
          closedLostLeads++;
          break;
        default:
          break;
      }
    });

    return {
      totalPeople: leads.length,
      newLeads,
      contactedLeads,
      meetingScheduledLeads,
      closedWonLeads,
      closedLostLeads,
    };
  }, [leads]);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    // Filter by search term, status, favorites, and tab/user selection
    const filtered = leads.filter(lead => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        (() => {
          const searchLower = searchTerm.toLowerCase();
          return (
            lead.name?.toLowerCase().includes(searchLower) ||
            lead.email_address?.toLowerCase().includes(searchLower) ||
            lead.company_name?.toLowerCase().includes(searchLower)
          );
        })();

      // Status filter
      const matchesStatus =
        statusFilter === 'all' || lead.stage === statusFilter;

      // Favorites filter
      const isFavorite =
        toBoolean(lead.favourite) || toBoolean(lead.is_favourite);
      const matchesFavorites = !showFavoritesOnly || isFavorite;

      // User filter
      const matchesUser =
        selectedUser === 'all' || lead.owner_id === selectedUser;

      return matchesSearch && matchesStatus && matchesFavorites && matchesUser;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        case 'first_name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'last_name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email_address?.toLowerCase() || '';
          bValue = b.email_address?.toLowerCase() || '';
          break;
        case 'company_name':
          aValue = a.company_name?.toLowerCase() || '';
          bValue = b.company_name?.toLowerCase() || '';
          break;
        case 'stage':
          aValue = a.stage?.toLowerCase() || '';
          bValue = b.stage?.toLowerCase() || '';
          break;
        // no priority on people; fall back to lead_score
        case 'priority':
          aValue = parseFloat(a.lead_score || '0');
          bValue = parseFloat(b.lead_score || '0');
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [
    leads,
    searchTerm,
    sortBy,
    sortOrder,
    statusFilter,
    showFavoritesOnly,
    selectedUser,
  ]);

  const fetchLeads = async (forceRefresh = false) => {
    // Debounce rapid calls - only fetch if it's been more than 2 seconds since last fetch
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 2000) {
      return;
    }

    const startTime = performance.now();
    try {
      setLoading(true);
      setLastFetchTime(now);

      // Fetch all people with company information - optimized selection
      const { data: allLeads, error: allError } = await supabase
        .from('people')
        .select(
          `
          id, name, email_address, company_id, company_role, lead_score, stage, 
          connected_at, last_reply_at, last_interaction_at, owner_id, created_at, 
          confidence_level, is_favourite, favourite, lead_source, linkedin_url, 
          employee_location,
          company_name:companies(name)
        `
        )
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('Error fetching leads:', allError);
        throw allError;
      }

      // Normalize nested objects returned by Supabase (aliases like company_name:companies(name))
      const normalizedLeads = (allLeads || []).map((lead: any) => {
        const companyName =
          typeof lead.company_name === 'object' && lead.company_name !== null
            ? lead.company_name.name
            : lead.company_name;
        return {
          ...lead,
          company_name: companyName ?? null,
        } as Lead;
      });

      setLeads(normalizedLeads);

      const endTime = performance.now();
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Fetch both leads and users in parallel for faster loading
    Promise.all([fetchLeads(true), fetchUsers()]); // Force initial fetch
  }, []);

  // UnifiedTable columns expect (value, row)
  const columns = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      minWidth: '120px',
      align: 'center' as const,
      render: (v: any) => (
        <div className='border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]'>
          {getStatusDisplayText(v || 'new')}
        </div>
      ),
    },
    {
      key: 'favorite',
      label: '',
      render: (_: any, row: any) => (
        <div onClick={e => e.stopPropagation()}>
          <FavoriteToggle
            entityId={row.id}
            entityType='lead'
            isFavorite={toBoolean(row.favourite) || toBoolean(row.is_favourite)}
            onToggle={isFavorite => {
              setLeads(prev =>
                prev.map(l =>
                  l.id === row.id
                    ? {
                        ...l,
                        favourite: isFavorite,
                        is_favourite: isFavorite ? 'true' : 'false',
                      }
                    : l
                )
              );
            }}
            size='sm'
          />
        </div>
      ),
    },
    {
      key: 'person',
      label: 'Person',
      width: '300px',
      minWidth: '300px',
      align: 'left' as const,
      render: (_: any, row: any) => (
        <div className='min-w-0'>
          <div className='text-sm font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
            {row.name || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'company_name',
      label: 'Company',
      width: '250px',
      minWidth: '250px',
      align: 'left' as const,
      render: (v: any, row: any) => (
        <div className='min-w-0 cursor-pointer hover:bg-muted/50 rounded-md p-1 -m-1 transition-colors duration-150'>
          <div className='flex items-center gap-2'>
            <div className='flex flex-col min-w-0 flex-1'>
              <div className='text-sm leading-tight hover:text-blue-600 transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis'>
                {row.company_name || '-'}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'company_role',
      label: 'Role',
      width: '200px',
      minWidth: '200px',
      align: 'left' as const,
      render: (v: any) => (
        <div className='min-w-0'>
          <div className='text-sm text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
            {v || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'owner_display',
      label: 'Assigned To',
      render: (_: any, row: any) => (
        <div
          className='cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors duration-150'
          onClick={e => {
            e.stopPropagation();
            setSelectedLeadForAssignment(row as Lead);
            setIsAssignmentModalOpen(true);
          }}
        >
          <OwnerDisplay
            key={`${row.id}-${row.owner_id}`}
            ownerId={row.owner_id}
            size='sm'
            showName={true}
            showRole={false}
          />
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '120px',
      minWidth: '120px',
      align: 'center' as const,
      render: (v: any) => (
        <div className='border justify-center items-center flex mx-auto bg-orange-50 text-orange-700 border-orange-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]'>
          {v || 'Medium'}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      width: '120px',
      minWidth: '120px',
      align: 'center' as const,
      render: (v: any) => (
        <span className='text-sm text-gray-500'>
          {v ? new Date(v).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      minWidth: '120px',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <div className='flex items-center justify-center gap-1'>
          <FavoriteToggle
            entityId={row.id}
            entityType='lead'
            isFavorite={toBoolean(row.favourite) || toBoolean(row.is_favourite)}
            onToggle={isFavorite => {
              setLeads(prev =>
                prev.map(l =>
                  l.id === row.id
                    ? {
                        ...l,
                        favourite: isFavorite,
                        is_favourite: isFavorite ? 'true' : 'false',
                      }
                    : l
                )
              );
            }}
            size='sm'
          />
          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              setSelectedLeadForAssignment(row as Lead);
              setIsAssignmentModalOpen(true);
            }}
            className='h-8 w-8 p-0'
          >
            <Users className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  const tableData = useMemo(
    () =>
      filteredAndSortedLeads.map(lead => ({
        id: lead.id,
        person: lead.name,
        name: lead.name,
        email_address: lead.email_address,
        company_name: lead.company_name || '-',
        company_role: lead.company_role || '-',
        employee_location: lead.employee_location || '-',
        owner_id: lead.owner_id,
        confidence_level: lead.confidence_level || 'medium',
        priority: lead.confidence_level || 'medium',
        created_at: lead.created_at,
        favourite: lead.favourite,
        is_favourite: lead.is_favourite,
        linkedin_url: lead.linkedin_url,
        stage: lead.stage,
        status: lead.stage,
      })),
    [filteredAndSortedLeads]
  );

  const handleRowClick = (lead: Lead) => {
    openPopup('lead', lead.id, lead.name || 'Unknown');
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${leadName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from('people').delete().eq('id', leadId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `"${leadName}" has been deleted.`,
      });

      // Refresh the leads list
      fetchLeads();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to delete lead: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Stats for People page
  const stats: StatItemProps[] = [
    {
      icon: Users,
      value: peopleStats.totalPeople,
      label: 'people',
    },
    {
      icon: Zap,
      value: peopleStats.contactedLeads,
      label: 'contacted',
    },
    {
      icon: Target,
      value: peopleStats.newLeads,
      label: getStatusDisplayText('new') + ' leads',
    },
    {
      icon: CheckCircle,
      value: peopleStats.meetingScheduledLeads,
      label: 'meetings scheduled',
    },
  ];

  return (
    <Page stats={stats} hideHeader>
      {/* Search, Filter and Sort Controls - Full Width */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 w-full'>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {/* Status Filter */}
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onValueChange={value => setStatusFilter(value)}
            placeholder='All Statuses'
            className='min-w-28 sm:min-w-32 bg-white h-8 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50'
          />

          {/* Assignment Filter */}
          <DropdownSelect
            options={[
              { label: 'All Users', value: 'all' },
              ...users.map(userItem => ({
                label:
                  userItem.id === user?.id
                    ? `${userItem.full_name} (me)`
                    : userItem.full_name,
                value: userItem.id,
              })),
            ]}
            value={selectedUser}
            onValueChange={value => setSelectedUser(value)}
            placeholder='Filter by user'
            className='min-w-32 sm:min-w-40 bg-white h-8 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50'
          />

          {/* Favorites Icon Button */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              'h-8 w-8 rounded-md border flex items-center justify-center transition-colors',
              showFavoritesOnly
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            )}
            title={
              showFavoritesOnly ? 'Show all people' : 'Show favorites only'
            }
          >
            <Star
              className={cn('h-4 w-4', showFavoritesOnly && 'fill-current')}
            />
          </button>
        </div>

        {/* Sort Controls - Far Right */}
        <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
          <span className='text-sm text-muted-foreground'>Sort:</span>
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={value => setSortBy(value)}
            placeholder='Sort by'
            className='min-w-28 sm:min-w-32 bg-white h-8 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50'
          />
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className='px-2 h-8 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center transition-colors'
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          {/* Search Icon Button - Far Right */}
          <SearchIconButton
            onClick={() => setIsSearchModalOpen(true)}
            className='ml-2'
          />
        </div>
      </div>

      {/* Data Table - Full Width */}
      <div className='bg-white rounded-lg border border-gray-300 w-full'>
        <EnhancedTable
          dualScrollbars={false}
          stickyHeader={true}
          maxHeight='auto'
        >
          <EnhancedTableHeader>
            <EnhancedTableRow className='transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-300 bg-gray-50/50'>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]'
                scope='col'
                style={{ width: '120px', minWidth: '120px' }}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <span>Status</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]'
                scope='col'
                style={{ width: '300px', minWidth: '300px' }}
              >
                <div className='flex items-center gap-2 justify-start'>
                  <span>Name</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]'
                scope='col'
                style={{ width: '200px', minWidth: '200px' }}
              >
                <div className='flex items-center gap-2 justify-start'>
                  <span>Company</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]'
                scope='col'
                style={{ width: '150px', minWidth: '150px' }}
              >
                <div className='flex items-center gap-2 justify-start'>
                  <span>Role</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]'
                scope='col'
                style={{ width: '150px', minWidth: '150px' }}
              >
                <div className='flex items-center gap-2 justify-start'>
                  <span>Location</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]'
                scope='col'
                style={{ width: '150px', minWidth: '150px' }}
              >
                <div className='flex items-center gap-2 justify-start'>
                  <span>Assigned To</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]'
                scope='col'
                style={{ width: '100px', minWidth: '100px' }}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <span>AI Score</span>
                </div>
              </EnhancedTableHead>
              <EnhancedTableHead
                className='h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]'
                scope='col'
                style={{ width: '120px', minWidth: '120px' }}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <span>Created</span>
                </div>
              </EnhancedTableHead>
            </EnhancedTableRow>
          </EnhancedTableHeader>
          <EnhancedTableBody>
            {tableData.map((lead, index) => (
              <EnhancedTableRow
                key={lead.id}
                className='data-[state=selected]:bg-muted border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200 group cursor-pointer relative min-h-[56px]'
                role='row'
                tabIndex={0}
                aria-label={`Row ${index + 1}`}
                onClick={() => handleRowClick(lead as Lead)}
              >
                {/* Status */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center'
                  style={{ width: '120px', minWidth: '120px' }}
                >
                  <div className='border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3'>
                    {getStatusDisplayText(lead.stage || 'new')}
                  </div>
                </EnhancedTableCell>

                {/* Name */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]'
                  style={{ width: '300px', minWidth: '300px' }}
                >
                  <div
                    className='min-w-0 cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors duration-150'
                    onClick={e => {
                      e.stopPropagation();
                      handleRowClick(lead as Lead);
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <div onClick={e => e.stopPropagation()}>
                        <FavoriteToggle
                          entityId={lead.id}
                          entityType='lead'
                          isFavorite={lead.is_favourite || false}
                          onToggle={isFavorite => {
                            setLeads(prev =>
                              prev.map(l =>
                                l.id === lead.id
                                  ? { ...l, is_favourite: isFavorite }
                                  : l
                              )
                            );
                          }}
                          size='sm'
                        />
                      </div>
                      <div className='flex flex-col min-w-0 flex-1'>
                        <div className='text-sm font-medium break-words leading-tight hover:text-sidebar-primary transition-colors duration-150'>
                          {lead.name || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </EnhancedTableCell>

                {/* Company */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]'
                  style={{ width: '200px', minWidth: '200px' }}
                >
                  <div className='min-w-0'>
                    <div className='text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                      {lead.company_name || '-'}
                    </div>
                  </div>
                </EnhancedTableCell>

                {/* Role */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]'
                  style={{ width: '150px', minWidth: '150px' }}
                >
                  <div className='min-w-0'>
                    <div className='text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                      {lead.company_role || '-'}
                    </div>
                  </div>
                </EnhancedTableCell>

                {/* Location */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]'
                  style={{ width: '150px', minWidth: '150px' }}
                >
                  <div className='min-w-0'>
                    <div className='text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                      {lead.employee_location || '-'}
                    </div>
                  </div>
                </EnhancedTableCell>

                {/* Assigned To */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]'
                  style={{ width: '150px', minWidth: '150px' }}
                >
                  <div className='min-w-0'>
                    <OwnerDisplay
                      ownerId={lead.owner_id}
                      entityId={lead.id}
                      entityType='lead'
                      onAssignmentChange={() => {
                        // Assignment changed - could trigger refetch if needed
                      }}
                      className='text-sm'
                    />
                  </div>
                </EnhancedTableCell>

                {/* AI Score */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center'
                  style={{ width: '100px', minWidth: '100px' }}
                >
                  <div className='flex items-center justify-center'>
                    <div className='text-sm font-medium text-muted-foreground'>
                      {lead.lead_score ? `${lead.lead_score}/100` : '-'}
                    </div>
                  </div>
                </EnhancedTableCell>

                {/* Created */}
                <EnhancedTableCell
                  className='align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center'
                  style={{ width: '120px', minWidth: '120px' }}
                >
                  <div className='min-w-0'>
                    <div className='text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                </EnhancedTableCell>
              </EnhancedTableRow>
            ))}
          </EnhancedTableBody>
        </EnhancedTable>
      </div>

      {/* Person Detail Modal - Now handled by UnifiedPopup */}

      {/* Assignment Modal */}
      {selectedLeadForAssignment && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96 max-w-[90vw]'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              Assign Person
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Assign "{selectedLeadForAssignment.name}" to a user
            </p>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Select User
                </label>
                <DropdownSelect
                  disabled={isSavingAssignment}
                  options={[
                    { label: 'Unassigned', value: null },
                    ...users.map(user => ({
                      label: user.full_name,
                      value: user.id,
                    })),
                  ]}
                  value={selectedLeadForAssignment.owner_id}
                  onValueChange={value => {
                    setSelectedLeadForAssignment(prev =>
                      prev ? { ...prev, owner_id: value } : null
                    );
                  }}
                  placeholder='Select a user...'
                />
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <Button
                  variant='outline'
                  disabled={isSavingAssignment}
                  onClick={() => {
                    setIsAssignmentModalOpen(false);
                    setSelectedLeadForAssignment(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSavingAssignment}
                  onClick={async () => {
                    if (!selectedLeadForAssignment) return;

                    setIsSavingAssignment(true);
                    try {
                      const { data, error } = await supabase
                        .from('people')
                        .update({
                          owner_id: selectedLeadForAssignment.owner_id,
                        })
                        .eq('id', selectedLeadForAssignment.id)
                        .select();

                      if (error) throw error;

                      // Update local state
                      setLeads(prev =>
                        prev.map(lead =>
                          lead.id === selectedLeadForAssignment.id
                            ? {
                                ...lead,
                                owner_id: selectedLeadForAssignment.owner_id,
                              }
                            : lead
                        )
                      );

                      toast({
                        title: 'Success',
                        description: `Person assigned successfully`,
                      });

                      setIsAssignmentModalOpen(false);
                      setSelectedLeadForAssignment(null);
                    } catch (error) {
                      console.error('Error assigning person:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to assign person',
                        variant: 'destructive',
                      });
                    } finally {
                      setIsSavingAssignment(false);
                    }
                  }}
                >
                  {isSavingAssignment ? 'Saving...' : 'Save Assignment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        placeholder='Search people...'
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={value => {
          setSearchTerm(value);
          setIsSearchModalOpen(false);
        }}
      />
    </Page>
  );
};

export default People;
