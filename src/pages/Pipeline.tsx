import { FavoriteToggle } from '@/components/FavoriteToggle';
import { OwnerDisplay } from '@/components/OwnerDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Page } from '@/design-system/components';
import { designTokens } from '@/design-system/tokens';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
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
import { useQuery } from '@tanstack/react-query';
import {
  Brain,
  Building2,
  CheckCircle,
  FileText,
  Filter,
  MapPin,
  RefreshCw,
  Star,
  User,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Company = Tables<'companies'> & {
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [hoveredCompanyId, setHoveredCompanyId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedOverId, setDraggedOverId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAllAssignedUsers, setShowAllAssignedUsers] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [pipelineWidth, setPipelineWidth] = useState(0);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  // Scrollbar synchronization for Pipeline
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;

    if (!topScroll || !bottomScroll) return;

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (source !== target) {
        target.scrollLeft = source.scrollLeft;
      }
    };

    const handleTopScroll = () => {
      syncScroll(topScroll, bottomScroll);
    };

    const handleBottomScroll = () => {
      syncScroll(bottomScroll, topScroll);
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    bottomScroll.addEventListener('scroll', handleBottomScroll);

    return () => {
      topScroll.removeEventListener('scroll', handleTopScroll);
      bottomScroll.removeEventListener('scroll', handleBottomScroll);
    };
  }, []);

  // Calculate pipeline width for scrollbar
  useEffect(() => {
    const calculateWidth = () => {
      const stageCount = pipelineStages.length;
      const stageWidth = 320; // Approximate width per stage
      const gapWidth = 24; // Gap between stages
      const totalWidth = stageCount * stageWidth + (stageCount - 1) * gapWidth;
      setPipelineWidth(totalWidth);
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [companies]);

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
          .select(
            `
            id, name, industry, website, head_office, lead_score, pipeline_stage, 
            automation_active, automation_started_at, confidence_level, priority,
            is_favourite, owner_id, created_at, updated_at,
            linkedin_url, company_size
          `
          )
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

      // Add counts to companies
      return (companiesData || []).map(company => ({
        ...company,
        people_count: companyPeopleCount[company.id] || 0,
        jobs_count: companyJobsCount[company.id] || 0,
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
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

  // Define company pipeline stages in order (matching database enum values)
  const pipelineStages = [
    {
      key: 'automated',
      label: 'Automated',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      key: 'replied',
      label: 'Replied',
      color: 'bg-green-50 text-green-700 border-green-200',
    },
    {
      key: 'meeting_scheduled',
      label: 'Meeting Scheduled',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      key: 'proposal_sent',
      label: 'Proposal Sent',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      key: 'negotiation',
      label: 'Negotiation',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    {
      key: 'closed_won',
      label: 'Closed Won',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      key: 'closed_lost',
      label: 'Closed Lost',
      color: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      key: 'on_hold',
      label: 'On Hold',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
    },
  ];

  // Scrollbar synchronization for Pipeline
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;

    if (!topScroll || !bottomScroll) return;

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (source !== target) {
        target.scrollLeft = source.scrollLeft;
      }
    };

    const handleTopScroll = () => {
      syncScroll(topScroll, bottomScroll);
    };

    const handleBottomScroll = () => {
      syncScroll(bottomScroll, topScroll);
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    bottomScroll.addEventListener('scroll', handleBottomScroll);

    return () => {
      topScroll.removeEventListener('scroll', handleTopScroll);
      bottomScroll.removeEventListener('scroll', handleBottomScroll);
    };
  }, []);

  // Calculate pipeline width for scrollbar
  useEffect(() => {
    const calculateWidth = () => {
      const stageCount = pipelineStages.length;
      const stageWidth = 320; // Approximate width per stage
      const gapWidth = 24; // Gap between stages
      const totalWidth = stageCount * stageWidth + (stageCount - 1) * gapWidth;
      setPipelineWidth(totalWidth);
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [companies]);

  // Valid stage transitions - moved to constant for better performance
  const VALID_TRANSITIONS: Record<string, string[]> = {
    automated: ['replied'],
    replied: [
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
  };

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
                  ...c,
                  pipeline_stage: newStage as any,
                  updated_at: new Date().toISOString(),
                }
              : c
          );
        }
      );

      try {
        const { error } = await supabase
          .from('companies')
          .update({
            pipeline_stage: newStage,
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
    [companies, toast, pipelineStages, refetchCompanies]
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
    [companies, updateCompanyStage, toast, pipelineStages]
  );

  // Memoized companies grouping for better performance
  const companiesByStage = useMemo(() => {
    const result: Record<string, Company[]> = {};

    // Initialize all stages
    pipelineStages.forEach(stage => {
      result[stage.key] = [];
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

      if (matchesFavorites && matchesUser && company.pipeline_stage) {
        const stage = company.pipeline_stage;
        if (result[stage]) {
          result[stage].push(company);
        }
      }
    });

    return result;
  }, [companies, showFavoritesOnly, selectedUserId, showAllAssignedUsers]);

  const totalCompanies = Object.values(companiesByStage).flat().length;
  const favoriteCount = companies.filter(
    company => company.is_favourite
  ).length;

  const handleCompanyClick = (company: Company) => {
    openPopup('company', company.id, company.name);
  };

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
        className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden !p-0 ${
          isDraggable
            ? 'hover:shadow-lg cursor-grab active:cursor-grabbing'
            : 'cursor-pointer'
        } ${isDragging ? 'shadow-xl scale-[1.02] z-50 border-blue-300' : ''} ${
          isCurrentlyUpdating ? 'opacity-60 pointer-events-none' : ''
        } ${designTokens.borders.card} ${designTokens.borders.cardHover}`}
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
        <div className='p-4 pb-3'>
          {/* Company Logo and Name */}
          <div className='flex items-start gap-3'>
            {/* Company Logo */}
            <div className='flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ring-1 ring-gray-200/50'>
              {company.website ? (
                <img
                  src={`https://logo.clearbit.com/${
                    company.website
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '')
                      .split('/')[0]
                  }`}
                  alt={company.name}
                  className='w-10 h-10 rounded-xl object-cover'
                  loading='lazy'
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
                className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center'
                style={{ display: company.website ? 'none' : 'flex' }}
              >
                <Building2 className='h-5 w-5' />
              </div>
            </div>

            {/* Company Name and Location */}
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-foreground text-base truncate leading-tight'>
                {company.name}
              </h3>
              {/* Head Office - Below company name, smaller */}
              {company.head_office && (
                <div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
                  <MapPin className='h-3 w-3' />
                  <span className='truncate'>{company.head_office}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className='px-4 pb-4'>
          {/* Industry - On its own line */}
          {company.industry && (
            <div className='mb-4'>
              <span className='inline-block bg-gray-50 px-2 py-1 rounded-md text-sm text-gray-600'>
                {company.industry}
              </span>
            </div>
          )}

          {/* Bottom Section */}
          <div className='flex items-center gap-4'>
            {/* Badges with Icons */}
            <div className='flex items-center gap-2'>
              {company.lead_score && (
                <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200'>
                  <Brain className='h-3 w-3 mr-1' />
                  {company.lead_score}
                </span>
              )}
              {company.automation_active && (
                <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200'>
                  <Zap className='h-3 w-3 mr-1' />
                  Auto
                </span>
              )}
              {isCurrentlyUpdating && (
                <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200'>
                  <div className='animate-spin rounded-full h-3 w-3 border border-yellow-300 border-t-yellow-600 mr-1' />
                  Moving
                </span>
              )}
            </div>

            {/* People Count */}
            <div className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200'>
              <Users className='h-3 w-3 mr-1' />
              <span className='font-medium'>{company.people_count || 0}</span>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2'>
              {/* Notes Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  openPopup('company', company.id, company.name);
                }}
                className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200'
                title='View notes'
              >
                <FileText className='h-4 w-4' />
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

          {/* Assignment */}
          <div className='mt-3 pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-500 font-medium'>
                Assigned to:
              </span>
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
      stage: any;
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

      const activeCompany = useMemo(
        () =>
          activeId ? companies.find(company => company.id === activeId) : null,
        [activeId, companies]
      );

      const canAcceptDrop = useMemo(
        () =>
          activeCompany &&
          VALID_TRANSITIONS[activeCompany.pipeline_stage]?.includes(stage.key),
        [activeCompany, stage.key]
      );

      const isActiveDropTarget = isOver && isDropTarget && activeId;

      return (
        <div key={stage.key} className='flex-shrink-0 w-80'>
          {/* Stage Header */}
          <div className='mb-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='font-medium text-foreground text-sm'>
                {stage.label}
              </h3>
              <Badge variant='outline' className='text-xs'>
                {stageCompanies.length}
              </Badge>
            </div>

            {/* User Filter Indicator */}
            {(selectedUserId || showAllAssignedUsers) && (
              <div className='mb-3'>
                <div className='flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                  <User className='h-3 w-3' />
                  <span>
                    {showAllAssignedUsers
                      ? 'Filtered by: All Assigned Users'
                      : `Filtered by: ${users.find(user => user.id === selectedUserId)?.full_name}`}
                  </span>
                </div>
              </div>
            )}

            <div className='h-px bg-gray-200'></div>
          </div>

          {/* Companies Column */}
          <div
            ref={setNodeRef}
            className={`space-y-4 min-h-[200px] transition-all duration-200 ${
              isActiveDropTarget
                ? canAcceptDrop
                  ? 'border-green-400 bg-green-50'
                  : 'border-red-400 bg-red-50'
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
              <DraggableCompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      );
    }
  );

  // Add display name for better debugging
  DroppableStage.displayName = 'DroppableStage';

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <Page title='Company Pipeline'>
        <div className='flex gap-3 mb-6 w-full'>
          <Button
            variant='outline'
            size='xs'
            onClick={() => refetchCompanies()}
            className={designTokens.shadows.button}
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>

          {/* Favorites Icon Button */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              'h-8 w-8 rounded-md border flex items-center justify-center transition-colors action-bar-icon',
              showFavoritesOnly
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            )}
            title={
              showFavoritesOnly ? 'Show all companies' : 'Show favorites only'
            }
          >
            <Star
              className={cn('h-4 w-4', showFavoritesOnly && 'fill-current')}
            />
          </button>

          {/* Global User Filter */}
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4 text-gray-500' />
            <DropdownSelect
              options={[
                { label: 'All Companies', value: 'all' },
                { label: 'All Assigned Users', value: 'assigned' },
                ...users.map(user => ({
                  label: user.full_name,
                  value: user.id,
                })),
              ]}
              value={
                showAllAssignedUsers ? 'assigned' : selectedUserId || 'all'
              }
              onValueChange={value => {
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
              placeholder='Filter by user...'
              className='w-48 h-8'
            />
            {(selectedUserId || showAllAssignedUsers) && (
              <Button
                variant='ghost'
                size='xs'
                onClick={() => {
                  setSelectedUserId(null);
                  setShowAllAssignedUsers(false);
                }}
                className='text-gray-500 hover:text-gray-700 h-8 px-2'
              >
                Clear
              </Button>
            )}
          </div>

          <Button
            variant='outline'
            size='sm'
            className={designTokens.shadows.button}
          >
            <Filter className='h-4 w-4 mr-2' />
            Filter
          </Button>
        </div>

        {/* Enhanced Drag and Drop Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Enhanced Horizontal Scrolling Pipeline Board */}
          <div className='relative table-scroll-container'>
            {/* Top scrollbar for better desktop UX */}
            <div
              className='overflow-x-auto overflow-y-hidden h-3 mb-2 scrollbar-thin'
              ref={topScrollRef}
            >
              <div
                className='h-1 bg-transparent'
                style={{ width: `${pipelineWidth}px` }}
              />
            </div>

            <div
              ref={bottomScrollRef}
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
                {pipelineStages.map(stage => {
                  const stageCompanies = companiesByStage[stage.key] || [];
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
                                    stage.key === activeCompany.pipeline_stage
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

        {/* Company Detail Modal - Now handled by UnifiedPopup */}
      </Page>
    </div>
  );
};

export default Pipeline;
