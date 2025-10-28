import { FavoriteToggle } from '@/components/FavoriteToggle';
import { OwnerDisplay } from '@/components/OwnerDisplay';
import { IconOnlyAssignmentCell } from '@/components/shared/IconOnlyAssignmentCell';
import { PeopleAvatars } from '@/components/shared/PeopleAvatars';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { Badge } from '@/components/ui/badge';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { TabNavigation } from '@/components/ui/tab-navigation';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { getClearbitLogo } from '@/services/logoService';
import type { Company as CompanyType, Person } from '@/types/database';
import {
  ReplyIntentIndicator,
  type ReplyIntent,
} from '@/utils/replyIntentUtils.tsx';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Brain,
  Building2,
  CheckCircle,
  FileText,
  Grid3x3,
  MapPin,
  User,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Company = CompanyType & {
  people_count?: number;
  jobs_count?: number;
  reply_stats?: {
    interested: number;
    not_interested: number;
    maybe: number;
    total: number;
  };
};

const Pipeline = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [hoveredCompanyId, setHoveredCompanyId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedOverId, setDraggedOverId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAllAssignedUsers, setShowAllAssignedUsers] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [groupByStage, setGroupByStage] = useState(true);

  // Pipeline scroll control
  const pipelineScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  // Stage filter state
  const [stageFilter, setStageFilter] = useState<string[]>([]);

  // Slide-out state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);

  // Grouping state - start with all groups expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set([
      'Replied',
      'Interested',
      'Meeting Scheduled',
      'Proposal Sent',
      'Negotiation',
      'On Hold',
      'Closed Won',
      'Closed Lost',
    ])
  );

  // Toggle group expansion
  const handleToggleGroup = useCallback((groupLabel: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupLabel)) {
        newSet.delete(groupLabel);
      } else {
        newSet.add(groupLabel);
      }
      return newSet;
    });
  }, []);

  // Use React Query for data fetching with caching
  const {
    data: companies = [],
    isLoading: companiesLoading,
    refetch: refetchCompanies,
  } = useQuery<Company[]>({
    queryKey: ['pipeline-companies'],
    queryFn: async () => {
      // Use Promise.all to fetch all data in parallel
      const [
        { data: companiesData, error: companiesError },
        { data: peopleCounts, error: peopleError },
        { data: jobsCounts, error: jobsError },
      ] = await Promise.all([
        supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('people')
          .select('company_id')
          .not('company_id', 'is', null),
        supabase
          .from('jobs')
          .select('company_id')
          .not('company_id', 'is', null),
      ]);

      // Check for errors
      if (companiesError) throw companiesError;
      if (peopleError) throw peopleError;
      if (jobsError) throw jobsError;

      // Count people per company
      const companyPeopleCount: Record<string, number> = {};
      peopleCounts?.forEach(person => {
        if (person.company_id) {
          companyPeopleCount[person.company_id] =
            (companyPeopleCount[person.company_id] || 0) + 1;
        }
      });

      // Count jobs per company
      const companyJobsCount: Record<string, number> = {};
      jobsCounts?.forEach(job => {
        if (job.company_id) {
          companyJobsCount[job.company_id] =
            (companyJobsCount[job.company_id] || 0) + 1;
        }
      });

      // Fetch reply statistics for companies
      const { data: peopleWithReplies } = await supabase
        .from('people')
        .select('company_id, reply_type')
        .not('company_id', 'is', null)
        .not('reply_type', 'is', null);

      // Calculate reply statistics per company
      const companyReplyStats: Record<
        string,
        {
          interested: number;
          not_interested: number;
          maybe: number;
          total: number;
        }
      > = {};
      peopleWithReplies?.forEach(person => {
        if (person.company_id) {
          if (!companyReplyStats[person.company_id]) {
            companyReplyStats[person.company_id] = {
              interested: 0,
              not_interested: 0,
              maybe: 0,
              total: 0,
            };
          }
          companyReplyStats[person.company_id].total++;
          if (person.reply_type === 'interested') {
            companyReplyStats[person.company_id].interested++;
          } else if (person.reply_type === 'not_interested') {
            companyReplyStats[person.company_id].not_interested++;
          } else if (person.reply_type === 'maybe') {
            companyReplyStats[person.company_id].maybe++;
          }
        }
      });

      // Add counts to companies
      return (companiesData || []).map(company => ({
        ...company,
        people_count: companyPeopleCount[company.id] || 0,
        jobs_count: companyJobsCount[company.id] || 0,
        reply_stats: companyReplyStats[company.id] || {
          interested: 0,
          not_interested: 0,
          maybe: 0,
          total: 0,
        },
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch people data for avatars
  const { data: people = [] } = useQuery<Person[]>({
    queryKey: ['pipeline-people'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .not('company_id', 'is', null);

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<
    { id: string; full_name: string; role: string }[]
  >({
    queryKey: ['pipeline-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create user data cache for quick lookups
  const userDataCache = useMemo(() => {
    const cache: Record<
      string,
      { id: string; full_name: string; role: string }
    > = {};
    users.forEach(user => {
      cache[user.id] = user;
    });
    return cache;
  }, [users]);

  const loading = companiesLoading || usersLoading;

  // Define company pipeline stages in order (matching database enum values)
  const pipelineStages = useMemo(
    () => [
      {
        key: 'qualified',
        label: 'Qualified',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
      },
      {
        key: 'message_sent',
        label: 'Message Sent',
        color: 'bg-green-600 text-white border-green-700',
      },
      {
        key: 'replied',
        label: 'Replied',
        color: 'bg-amber-600 text-white border-amber-700',
      },
      {
        key: 'interested',
        label: 'Interested',
        color: 'bg-blue-600 text-white border-blue-700',
      },
      {
        key: 'meeting_scheduled',
        label: 'Meeting Scheduled',
        color: 'bg-orange-600 text-white border-orange-700',
      },
      {
        key: 'proposal_sent',
        label: 'Proposal Sent',
        color: 'bg-purple-600 text-white border-purple-700',
      },
      {
        key: 'negotiation',
        label: 'Negotiation',
        color: 'bg-amber-600 text-white border-amber-700',
      },
      {
        key: 'closed_won',
        label: 'Closed Won',
        color: 'bg-emerald-600 text-white border-emerald-700',
      },
      {
        key: 'closed_lost',
        label: 'Closed Lost',
        color: 'bg-red-600 text-white border-red-700',
      },
      {
        key: 'on_hold',
        label: 'On Hold',
        color: 'bg-gray-600 text-white border-gray-700',
      },
    ],
    []
  );

  // Optimized drag and drop sensors for maximum performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Increased distance to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Increased delay for better touch handling
        tolerance: 8, // Increased tolerance for more stable touch handling
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Valid stage transitions - moved to constant for better performance
  const VALID_TRANSITIONS = useMemo(
    () => ({
      qualified: ['message_sent'],
      message_sent: ['replied'],
      replied: [
        'interested',
        'meeting_scheduled',
        'proposal_sent',
        'negotiation',
        'closed_won',
        'closed_lost',
        'on_hold',
      ],
      interested: [
        'meeting_scheduled',
        'proposal_sent',
        'negotiation',
        'closed_won',
        'closed_lost',
        'on_hold',
      ],
      meeting_scheduled: [
        'proposal_sent',
        'negotiation',
        'closed_won',
        'closed_lost',
        'on_hold',
      ],
      proposal_sent: ['negotiation', 'closed_won', 'closed_lost', 'on_hold'],
      negotiation: ['closed_won', 'closed_lost', 'on_hold'],
      on_hold: [
        'meeting_scheduled',
        'proposal_sent',
        'negotiation',
        'closed_won',
        'closed_lost',
      ],
    }),
    []
  );

  // Enhanced company stage update with optimistic updates and error handling
  const updateCompanyStage = useCallback(
    async (companyId: string, newStage: string) => {
      const company = companies.find(company => company.id === companyId);
      if (!company) return;

      setIsUpdating(companyId);

      // Optimistic update using React Query
      queryClient.setQueryData(
        ['pipeline-companies'],
        (oldData: Company[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(company =>
            company.id === companyId
              ? {
                  ...company,
                  pipeline_stage: newStage as Company['pipeline_stage'],
                  updated_at: new Date().toISOString(),
                }
              : company
          );
        }
      );

      try {
        const { error } = await supabase
          .from('companies')
          .update({
            pipeline_stage: newStage as Company['pipeline_stage'],
            updated_at: new Date().toISOString(),
          })
          .eq('id', companyId);

        if (error) throw error;

        toast({
          title: 'Success',
          description: `Company moved to ${pipelineStages.find(stage => stage.key === newStage)?.label}`,
        });
      } catch (error) {
        console.error('Error updating company stage:', error);

        // Revert optimistic update on error
        refetchCompanies();

        toast({
          title: 'Error',
          description: 'Failed to update company stage. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsUpdating(null);
      }
    },
    [companies, toast, pipelineStages, refetchCompanies, queryClient]
  );

  // Enhanced drag and drop event handlers with better validation and feedback
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const companyId = event.active.id as string;
      const company = companies.find(company => company.id === companyId);

      if (!company) return;

      setActiveId(companyId);

      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    },
    [companies]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setDraggedOverId((over?.id as string) || null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setDraggedOverId(null);

      if (!over || !active) return;

      const companyId = active.id as string;
      const targetStage = over.id as string;
      const sourceCompany = companies.find(company => company.id === companyId);

      if (!sourceCompany) return;

      const allowedStages =
        VALID_TRANSITIONS[sourceCompany.pipeline_stage] || [];

      if (!allowedStages.includes(targetStage)) {
        toast({
          title: 'Invalid Move',
          description: `Cannot move from ${pipelineStages.find(stage => stage.key === sourceCompany.pipeline_stage)?.label} to ${pipelineStages.find(stage => stage.key === targetStage)?.label}`,
          variant: 'destructive',
        });
        return;
      }

      // Prevent moving to the same stage
      if (sourceCompany.pipeline_stage === targetStage) {
        return;
      }

      updateCompanyStage(companyId, targetStage);
    },
    [companies, updateCompanyStage, toast, pipelineStages, VALID_TRANSITIONS]
  );

  // Memoized companies grouping for better performance
  const companiesByStage = useMemo(() => {
    const result: Record<string, Company[]> = {};

    // Initialize all stages for the Kanban view (including early stages, excluding new_lead)
    const allStageKeys = [
      'qualified',
      'message_sent',
      'replied',
      'interested',
      'meeting_scheduled',
      'proposal_sent',
      'negotiation',
      'closed_won',
      'closed_lost',
      'on_hold',
    ];
    pipelineStages.forEach(stage => {
      if (allStageKeys.includes(stage.key)) {
        result[stage.key] = [];
      }
    });

    // Group companies by stage
    companies.forEach(company => {
      const matchesFavorites = !showFavoritesOnly || company.is_favourite;

      // Handle user filtering logic
      let matchesUser = true;
      if (selectedUserId) {
        matchesUser = company.owner_id === selectedUserId;
      } else if (showAllAssignedUsers) {
        matchesUser = company.owner_id !== null; // Show only assigned companies
      }

      // Include all active stages (excluding new_lead which shouldn't show on frontend)
      const activeStages = [
        'qualified',
        'message_sent',
        'replied',
        'interested',
        'meeting_scheduled',
        'proposal_sent',
        'negotiation',
        'closed_won',
        'closed_lost',
        'on_hold',
      ];
      if (
        matchesFavorites &&
        matchesUser &&
        company.pipeline_stage &&
        activeStages.includes(company.pipeline_stage)
      ) {
        const stage = company.pipeline_stage;
        if (result[stage]) {
          result[stage].push(company);
        }
      }
    });

    return result;
  }, [
    companies,
    showFavoritesOnly,
    selectedUserId,
    showAllAssignedUsers,
    pipelineStages,
  ]);

  const totalCompanies = Object.values(companiesByStage).flat().length;
  const favoriteCount = companies.filter(
    company => company.is_favourite
  ).length;

  const handleCompanyClick = useCallback((company: Company) => {
    setSelectedCompanyId(company.id);
    setIsSlideOutOpen(true);
  }, []);

  const handleCompanyUpdate = useCallback(() => {
    refetchCompanies();
  }, [refetchCompanies]);

  // Check scroll position and update fade indicators
  const handlePipelineScroll = useCallback(() => {
    if (pipelineScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        pipelineScrollRef.current;
      const isAtLeft = scrollLeft <= 0;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth - 5; // 5px tolerance for rounding

      setShowLeftFade(!isAtLeft);
      setShowRightFade(!isAtRight);
    }
  }, []);

  // Setup scroll listener
  useEffect(() => {
    const scrollElement = pipelineScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handlePipelineScroll);
      // Initial check
      handlePipelineScroll();

      return () => {
        scrollElement.removeEventListener('scroll', handlePipelineScroll);
      };
    }
  }, [handlePipelineScroll]);

  // Stage filter options (all active stages)
  const stageFilterOptions = useMemo(
    () => [
      { label: 'All Stages', value: 'all' },
      ...pipelineStages
        .filter(s =>
          [
            'qualified',
            'message_sent',
            'replied',
            'interested',
            'meeting_scheduled',
            'proposal_sent',
            'negotiation',
            'closed_won',
            'closed_lost',
            'on_hold',
          ].includes(s.key)
        )
        .map(stage => ({
          label: stage.label,
          value: stage.key,
        })),
    ],
    [pipelineStages]
  );

  // Filter companies for table view - show all active stages (including qualified and message_sent)
  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    // Show companies in all active stages (including early engagement)
    const engagedStages = [
      'qualified',
      'message_sent',
      'replied',
      'interested',
      'meeting_scheduled',
      'proposal_sent',
      'negotiation',
      'closed_won',
      'closed_lost',
      'on_hold',
    ];
    filtered = filtered.filter(
      c => c.pipeline_stage && engagedStages.includes(c.pipeline_stage)
    );

    // Stage filter (only for engaged stages)
    if (stageFilter.length > 0 && !stageFilter.includes('all')) {
      filtered = filtered.filter(company =>
        stageFilter.includes(company.pipeline_stage || 'replied')
      );
    }

    if (showFavoritesOnly) filtered = filtered.filter(c => c.is_favourite);
    if (selectedUserId)
      filtered = filtered.filter(c => c.owner_id === selectedUserId);
    else if (showAllAssignedUsers)
      filtered = filtered.filter(c => c.owner_id !== null);
    return filtered;
  }, [
    companies,
    showFavoritesOnly,
    selectedUserId,
    showAllAssignedUsers,
    stageFilter,
  ]);

  // Group companies by stage - create grouped structure
  const groupedData = useMemo(() => {
    if (!groupByStage) return null;

    // Define group labels based on stages
    const stageGroups: Record<string, string> = {
      qualified: 'Qualified',
      message_sent: 'Message Sent',
      replied: 'Replied',
      interested: 'Interested',
      meeting_scheduled: 'Meeting Scheduled',
      proposal_sent: 'Proposal Sent',
      negotiation: 'Negotiation',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost',
      on_hold: 'On Hold',
    };

    // Organize companies into groups
    const groupsMap: Record<string, Company[]> = {};

    filteredCompanies.forEach(company => {
      const stage = company.pipeline_stage || 'replied';
      const groupLabel = stageGroups[stage] || 'Other';

      if (!groupsMap[groupLabel]) {
        groupsMap[groupLabel] = [];
      }
      groupsMap[groupLabel].push(company);
    });

    // Convert to groups array with proper ordering
    const groupOrder = [
      'Negotiation',
      'Proposal Sent',
      'Meeting Scheduled',
      'Interested',
      'Replied',
      'Message Sent',
      'Qualified',
      'On Hold',
      'Closed Won',
      'Closed Lost',
    ];

    return groupOrder
      .filter(label => groupsMap[label] && groupsMap[label].length > 0)
      .map(label => ({
        label,
        count: groupsMap[label].length,
        data: groupsMap[label],
      }));
  }, [filteredCompanies, groupByStage]);

  // For ungrouped view, use flat list
  const ungroupedData = useMemo(() => {
    if (groupByStage) return [];
    return filteredCompanies;
  }, [filteredCompanies, groupByStage]);

  // For grouped view, don't paginate - show all groups
  // For ungrouped view, paginate normally
  const displayData = groupByStage ? filteredCompanies : ungroupedData;

  const totalPages = Math.ceil(displayData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = groupByStage
    ? displayData // Show all when grouped
    : displayData.slice(startIndex, endIndex); // Paginate when ungrouped

  // Tab options
  const tabOptions = useMemo(
    () => [
      { id: 'table', label: 'Main Table', count: filteredCompanies.length },
      { id: 'pipeline', label: 'Pipeline', count: companies.length },
    ],
    [companies.length, filteredCompanies.length]
  );

  // Table columns
  const tableColumns: ColumnConfig<Company>[] = useMemo(
    () => [
      {
        key: 'company',
        label: 'Deal Name',
        width: '280px',
        minWidth: '280px',
        render: (_, company) => (
          <div className='min-w-0 cursor-pointer hover:bg-muted rounded-md p-1 -m-1 transition-colors duration-150'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0'>
                {company.website ? (
                  <img
                    src={getClearbitLogo(company.name || '', company.website)}
                    alt={company.name}
                    className='w-7 h-7 rounded-lg object-cover'
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Building2 className='h-3 w-3 text-muted-foreground' />
              </div>
              <div className='text-sm font-medium text-foreground truncate'>
                {company.name}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'owner',
        label: 'Owner',
        width: '80px',
        minWidth: '80px',
        align: 'center',
        render: (_, company) => (
          <div
            onClick={e => e.stopPropagation()}
            className='flex items-center justify-center'
          >
            <IconOnlyAssignmentCell
              ownerId={company.owner_id}
              entityId={company.id}
              entityType='companies'
              onAssignmentChange={() => {
                refetchCompanies();
              }}
            />
          </div>
        ),
      },
      {
        key: 'contact',
        label: 'Contact',
        width: '180px',
        minWidth: '180px',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis text-sm'>
            {company.head_office || '-'}
          </div>
        ),
      },
      {
        key: 'account',
        label: 'Account',
        width: '200px',
        minWidth: '200px',
        render: (_, company) => (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis text-sm'>
            {company.name}
          </div>
        ),
      },
      {
        key: 'people',
        label: 'People',
        width: '120px',
        minWidth: '120px',
        cellType: 'regular',
        align: 'center',
        render: (_, company) => {
          const companyPeople = people.filter(p => p.company_id === company.id);
          return (
            <div onClick={e => e.stopPropagation()}>
              <PeopleAvatars
                people={companyPeople}
                onPersonClick={personId => navigate(`/people/${personId}`)}
                maxVisible={3}
              />
            </div>
          );
        },
      },
      {
        key: 'stage',
        label: 'Stage',
        width: '150px',
        minWidth: '150px',
        cellType: 'status',
        align: 'center',
        getStatusValue: company => company.pipeline_stage || 'qualified',
        render: (_, company) => {
          const availableStages = [
            'qualified',
            'message_sent',
            'replied',
            'interested',
            'meeting_scheduled',
            'proposal_sent',
            'negotiation',
            'closed_won',
            'closed_lost',
            'on_hold',
          ];
          return (
            <div onClick={e => e.stopPropagation()}>
              <UnifiedStatusDropdown
                entityId={company.id}
                entityType='companies'
                currentStatus={company.pipeline_stage || 'qualified'}
                availableStatuses={availableStages}
                variant='cell'
                onStatusChange={() => {
                  refetchCompanies();
                }}
              />
            </div>
          );
        },
      },
      {
        key: 'reply_intent',
        label: 'Intent',
        width: '120px',
        minWidth: '120px',
        align: 'center',
        render: (_, company) => {
          if (!company.reply_stats || company.reply_stats.total === 0) {
            return <span className='text-xs text-gray-400'>—</span>;
          }
          const dominantIntent: ReplyIntent =
            company.reply_stats.interested > company.reply_stats.not_interested
              ? 'interested'
              : company.reply_stats.not_interested > 0
                ? 'not_interested'
                : 'maybe';
          return (
            <div className='flex flex-col items-center gap-1'>
              <ReplyIntentIndicator intent={dominantIntent} size='sm' />
              <span className='text-xs text-gray-500'>
                {company.reply_stats.total} replies
              </span>
            </div>
          );
        },
      },
      {
        key: 'value',
        label: 'Deal Value',
        width: '120px',
        minWidth: '120px',
        align: 'right',
        render: (_, company) => (
          <div className='text-sm font-medium text-foreground'>
            {company.lead_score || '-'}
          </div>
        ),
      },
    ],
    [people, navigate, refetchCompanies]
  );

  // Enhanced Draggable Company Card Component with better accessibility and visual feedback
  const DraggableCompanyCard = memo(({ company }: { company: Company }) => {
    const isDraggable = VALID_TRANSITIONS[company.pipeline_stage]?.length > 0;
    const isCurrentlyUpdating = isUpdating === company.id;

    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: company.id,
        disabled: !isDraggable || isCurrentlyUpdating,
        data: {
          company,
          allowedStages: VALID_TRANSITIONS[company.pipeline_stage] || [],
        },
      });

    const style = {
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.5 : isCurrentlyUpdating ? 0.7 : 1,
      // Enhanced hardware acceleration for smooth dragging
      willChange: isDragging ? 'transform, opacity' : 'auto',
      // Force GPU acceleration
      transformStyle: 'preserve-3d' as const,
      backfaceVisibility: 'hidden' as const,
      // Optimize for smooth animations
      transition: isDragging ? 'none' : 'all 0.2s ease-out',
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`w-full relative bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group ${
          isDraggable
            ? 'hover:shadow-lg cursor-grab active:cursor-grabbing'
            : 'cursor-pointer'
        } ${isDragging ? 'shadow-xl scale-[1.02] z-50 border-primary border-primary-medium' : ''} ${
          isCurrentlyUpdating ? 'opacity-60 pointer-events-none' : ''
        }`}
        onClick={e => {
          e.stopPropagation();
          if (!isDragging) handleCompanyClick(company);
        }}
        role='button'
        tabIndex={0}
        aria-label={`Company: ${company.name}. Current stage: ${pipelineStages.find(stage => stage.key === company.pipeline_stage)?.label}. ${
          isDraggable
            ? 'Drag to move to another stage.'
            : 'Click to view details.'
        }`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isDragging) handleCompanyClick(company);
          }
        }}
      >
        {/* Card Header */}
        <div className='p-3 pb-2.5'>
          {/* Company Logo and Name */}
          <div className='flex items-start gap-2'>
            {/* Company Logo */}
            <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden'>
              {company.website ? (
                <img
                  src={`https://logo.clearbit.com/${
                    company.website
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '')
                      .split('/')[0]
                  }`}
                  alt={company.name}
                  className='w-10 h-10 rounded-lg object-cover'
                  loading='lazy'
                  decoding='async'
                  onError={e => {
                    // Silently handle error and show fallback
                    const img = e.currentTarget;
                    img.style.display = 'none';
                    const fallback = img.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                  onLoad={e => {
                    // Hide fallback when image loads successfully
                    const img = e.currentTarget;
                    const fallback = img.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'none';
                    }
                  }}
                />
              ) : null}
              <div
                className='w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover text-primary-foreground flex items-center justify-center'
                style={{ display: company.website ? 'none' : 'flex' }}
              >
                <Building2 className='h-5 w-5' />
              </div>
            </div>

            {/* Company Name and Location */}
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-foreground text-sm truncate leading-tight'>
                {company.name}
              </h3>
              {/* Head Office - Below company name, smaller */}
              {company.head_office && (
                <div className='flex items-center gap-1 text-xs text-gray-500 mt-0.5'>
                  <MapPin className='h-3 w-3' />
                  <span className='truncate'>{company.head_office}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className='px-3 pt-2 pb-3'>
          {/* Industry - On its own line */}
          {company.industry && (
            <div className='mb-2'>
              <span className='inline-block bg-gray-50 px-2 py-0.5 rounded-md text-xs text-gray-600'>
                {company.industry}
              </span>
            </div>
          )}

          {/* Bottom Section */}
          <div className='flex items-center gap-2 flex-wrap'>
            {/* Badges with Icons */}
            <div className='flex items-center gap-1.5 flex-wrap'>
              {company.lead_score && (
                <span className='inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-primary-light text-primary'>
                  <Brain className='h-3 w-3 mr-0.5' />
                  {company.lead_score}
                </span>
              )}
              {/* Reply Intent Indicator */}
              {company.reply_stats && company.reply_stats.total > 0 && (
                <span className='inline-flex items-center'>
                  <ReplyIntentIndicator
                    intent={
                      company.reply_stats.interested >
                      company.reply_stats.not_interested
                        ? 'interested'
                        : company.reply_stats.not_interested > 0
                          ? 'not_interested'
                          : 'maybe'
                    }
                    size='sm'
                  />
                </span>
              )}
              {company.automation_active && (
                <span className='inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700'>
                  <Zap className='h-3 w-3 mr-0.5' />
                  Auto
                </span>
              )}
              {isCurrentlyUpdating && (
                <span className='inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700'>
                  <div className='animate-spin rounded-full h-3 w-3 border border-yellow-300 border-t-yellow-600 mr-0.5' />
                  Moving
                </span>
              )}

              {/* People Count */}
              <div className='inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-700'>
                <Users className='h-3 w-3 mr-0.5' />
                <span className='font-medium'>{company.people_count || 0}</span>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-0.5 ml-auto'>
                {/* Notes Button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    console.log('View notes for:', company.name);
                  }}
                  className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200'
                  title='View notes'
                >
                  <FileText className='h-3.5 w-3.5' />
                </button>

                {/* Favorite Toggle */}
                <FavoriteToggle
                  entityId={company.id}
                  entityType='company'
                  isFavorite={company.is_favourite}
                  size='sm'
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className='mt-2 pt-2 border-t border-gray-100'>
            <div className='flex items-center gap-1.5'>
              <span className='text-xs text-gray-500'>Assigned to:</span>
              <OwnerDisplay
                ownerId={company.owner_id}
                size='sm'
                showName={true}
                showRole={false}
                userData={userDataCache[company.owner_id] || null}
                isLoading={usersLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Add display name for better debugging
  DraggableCompanyCard.displayName = 'DraggableCompanyCard';

  // Enhanced Droppable Stage Component with better visual feedback and accessibility
  const DroppableStage = memo(
    ({
      stage,
      companies: stageCompanies,
    }: {
      stage: { key: string; label: string; color: string };
      companies: Company[];
    }) => {
      const { isOver, setNodeRef } = useDroppable({
        id: stage.key,
      });

      // Memoize expensive calculations
      const isDropTarget = useMemo(
        () =>
          Object.values(VALID_TRANSITIONS).some(stages =>
            stages.includes(stage.key)
          ),
        [stage.key]
      );

      const activeCompany = activeId
        ? companies.find(company => company.id === activeId)
        : null;

      const canAcceptDrop = useMemo(
        () =>
          activeCompany &&
          VALID_TRANSITIONS[activeCompany.pipeline_stage]?.includes(stage.key),
        [activeCompany, stage.key]
      );

      const isActiveDropTarget = isOver && isDropTarget && activeId;

      return (
        <div key={stage.key} className='flex-shrink-0 w-72'>
          {/* Stage Header Card */}
          <div className='mb-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
            {/* Colored Top Bar */}
            <div className={cn('h-1.5', stage.color)} />

            <div className='p-3 pb-2'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-foreground text-sm'>
                  {stage.label}
                </h3>
                <Badge
                  variant='secondary'
                  className='bg-gray-100 text-gray-700 border-none text-xs h-5'
                >
                  {stageCompanies.length}
                </Badge>
              </div>

              {/* User Filter Indicator */}
              {(selectedUserId || showAllAssignedUsers) && (
                <div className='mt-2'>
                  <div className='flex items-center gap-2 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md'>
                    <User className='h-3 w-3' />
                    <span>
                      {showAllAssignedUsers
                        ? 'Filtered by: All Assigned Users'
                        : `Filtered by: ${users.find(user => user.id === selectedUserId)?.full_name}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Companies Column */}
          <div
            ref={setNodeRef}
            className={`space-y-2 min-h-[200px] rounded-lg transition-all duration-200 border-2 border-transparent ${
              isActiveDropTarget
                ? canAcceptDrop
                  ? 'border-green-400 bg-green-50/50'
                  : 'border-red-400 bg-red-50/50'
                : ''
            }`}
            style={{
              // Optimize for smooth transitions and hardware acceleration
              willChange: isOver ? 'background-color, border-color' : 'auto',
              transform: 'translateZ(0)', // Force hardware acceleration
              backfaceVisibility: 'hidden',
            }}
            data-stage={stage.key}
            role='region'
            aria-label={`${stage.label} stage. ${stageCompanies.length} companies. ${
              isDropTarget ? 'Drop zone for moving companies.' : ''
            }`}
          >
            {/* Drop zone feedback */}
            {isActiveDropTarget && (
              <div
                className={`text-center text-sm py-2 rounded mb-2 ${
                  canAcceptDrop
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                }`}
              >
                {canAcceptDrop ? (
                  <div className='flex items-center justify-center gap-2'>
                    <CheckCircle className='h-4 w-4' />
                    Drop here to move company
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2'>
                    <XCircle className='h-4 w-4' />
                    Cannot move to this stage
                  </div>
                )}
              </div>
            )}

            {stageCompanies.map(company => (
              <div key={company.id}>
                <DraggableCompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
      );
    }
  );

  // Add display name for better debugging
  DroppableStage.displayName = 'DroppableStage';

  return (
    <Page title='Deals' hideHeader allowScroll>
      <div className='space-y-3 h-full flex flex-col'>
        {/* Page Header */}
        <div className='mb-1'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Deals
          </h1>
          <p className='text-sm text-muted-foreground'>
            {activeTab === 'pipeline'
              ? 'Drag and drop companies between stages'
              : 'Deals that have expressed interest and are actively engaged'}
          </p>
        </div>

        {/* Tab Navigation and Filters */}
        <div className='flex items-center justify-end gap-4 py-1 mb-2 flex-nowrap overflow-hidden'>
          {/* Tab Navigation */}
          <div className='flex-shrink-0 mr-auto'>
            <TabNavigation
              tabs={tabOptions}
              activeTab={activeTab}
              onTabChange={tabId => {
                setActiveTab(tabId as 'pipeline' | 'table');
                setCurrentPage(1);
              }}
              className='border-b-0'
            />
          </div>

          {/* Filter Controls */}
          <div className='flex items-center gap-2 flex-shrink-0'>
            <FilterControls
              statusOptions={stageFilterOptions}
              userOptions={[
                { label: 'All Users', value: 'all' },
                { label: 'My Assignments', value: 'assigned' },
                ...users.map(user => ({
                  label: user.full_name,
                  value: user.id,
                })),
              ]}
              sortOptions={[]}
              statusFilter={
                stageFilter.length === 0 || stageFilter.includes('all')
                  ? 'all'
                  : stageFilter[0]
              }
              selectedUser={
                showAllAssignedUsers ? 'assigned' : selectedUserId || 'all'
              }
              sortBy=''
              showFavoritesOnly={showFavoritesOnly}
              searchTerm=''
              isSearchActive={false}
              onStatusChange={value => {
                if (value === 'all') {
                  setStageFilter([]);
                } else {
                  setStageFilter([value]);
                }
                setCurrentPage(1);
              }}
              onUserChange={value => {
                if (value === 'all') {
                  setSelectedUserId(null);
                  setShowAllAssignedUsers(false);
                } else if (value === 'assigned') {
                  setSelectedUserId(null);
                  setShowAllAssignedUsers(true);
                } else {
                  setSelectedUserId(value);
                  setShowAllAssignedUsers(false);
                }
              }}
              onSortChange={() => {}}
              onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
              onSearchChange={() => {}}
              onSearchToggle={() => {}}
            />

            {/* Group Toggle - Only for table view */}
            {activeTab === 'table' && (
              <button
                onClick={() => setGroupByStage(!groupByStage)}
                className={cn(
                  'h-8 px-3 rounded-md border flex items-center gap-2 transition-colors',
                  groupByStage
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                )}
                title={groupByStage ? 'Ungroup' : 'Group by stage'}
              >
                <Grid3x3 className='h-4 w-4' />
                <span className='text-sm font-medium'>Group</span>
              </button>
            )}
          </div>
        </div>

        {/* Conditional Render: Table or Pipeline */}
        {activeTab === 'table' ? (
          <>
            <div className='flex-1 min-h-0'>
              <UnifiedTable
                data={paginatedData}
                columns={tableColumns}
                pagination={false}
                stickyHeaders={true}
                scrollable={true}
                onRowClick={handleCompanyClick}
                loading={loading}
                emptyMessage='No deals found'
                grouped={groupByStage}
                groups={groupedData}
                expandedGroups={expandedGroups}
                onToggleGroup={handleToggleGroup}
              />
            </div>
            {!groupByStage && (
              <div className='flex-shrink-0 pt-1'>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={displayData.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={size => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className='mt-0'
                />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Pipeline View - Kanban Board */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {/* Modern Single-Scroll Pipeline Board */}
              <div className='relative'>
                {/* Gradient Fade Overlays - clickable scroll areas */}
                {showLeftFade && (
                  <button
                    onClick={() => {
                      pipelineScrollRef.current?.scrollBy({
                        left: -400,
                        behavior: 'smooth',
                      });
                    }}
                    className='absolute left-0 top-0 bottom-8 w-32 bg-gradient-to-r from-white to-transparent hover:from-gray-50 transition-colors cursor-pointer z-20'
                    aria-label='Scroll left'
                  />
                )}
                {showRightFade && (
                  <button
                    onClick={() => {
                      pipelineScrollRef.current?.scrollBy({
                        left: 400,
                        behavior: 'smooth',
                      });
                    }}
                    className='absolute right-0 top-0 bottom-8 w-32 bg-gradient-to-l from-white to-transparent hover:from-gray-50 transition-colors cursor-pointer z-20'
                    aria-label='Scroll right'
                  />
                )}

                <div
                  ref={pipelineScrollRef}
                  className='overflow-x-auto pb-4 scrollbar-thin w-full'
                  style={{
                    // Optimize scrolling performance
                    willChange: 'scroll-position',
                    transform: 'translateZ(0)', // Force hardware acceleration
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    className='flex gap-6 min-w-max'
                    style={{
                      // Optimize for smooth drag and drop
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {loading
                      ? // Loading skeleton
                        pipelineStages.map(stage => (
                          <div key={stage.key} className='w-72 space-y-3'>
                            <div className='h-8 bg-gray-200 animate-pulse rounded' />
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className='h-24 bg-gray-100 animate-pulse rounded-md'
                              />
                            ))}
                          </div>
                        ))
                      : pipelineStages.map(stage => {
                          const stageCompanies =
                            companiesByStage[stage.key] || [];
                          return (
                            <DroppableStage
                              key={stage.key}
                              stage={stage}
                              companies={stageCompanies}
                            />
                          );
                        })}
                  </div>
                </div>
              </div>

              {/* Optimized Drag Overlay */}
              <DragOverlay>
                {activeId
                  ? (() => {
                      const activeCompany = companies.find(
                        company => company.id === activeId
                      );
                      if (!activeCompany) return null;

                      return (
                        <div className='opacity-90 transform rotate-2 scale-105 shadow-2xl border-2 border-blue-400 rounded-xl'>
                          <div className='bg-white rounded-xl p-4 shadow-lg'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center'>
                                <Building2 className='h-5 w-5' />
                              </div>
                              <div>
                                <h3 className='font-semibold text-foreground text-base'>
                                  {activeCompany.name}
                                </h3>
                                <p className='text-xs text-gray-500'>
                                  {
                                    pipelineStages.find(
                                      stage =>
                                        stage.key ===
                                        activeCompany.pipeline_stage
                                    )?.label
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>

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
    </Page>
  );
};

export default Pipeline;
