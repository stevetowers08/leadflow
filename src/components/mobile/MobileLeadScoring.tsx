/**
 * Mobile-Optimized Lead Scoring Component
 * Implements CRM mobile best practices for lead scoring visualization
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  Brain,
  Info,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface LeadScoreData {
  id: string;
  name: string;
  company?: string;
  role?: string;
  location?: string;
  lead_score: string | number;
  priority?: string;
  last_activity?: string;
  automation_active?: boolean;
  reply_type?: string;
  stage?: string;
}

interface MobileLeadScoringProps {
  leads: LeadScoreData[];
  onLeadClick: (lead: LeadScoreData) => void;
  loading?: boolean;
}

interface ScoreRange {
  min: number;
  max: number;
  label: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const scoreRanges: ScoreRange[] = [
  {
    min: 80,
    max: 100,
    label: 'Hot',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    min: 60,
    max: 79,
    label: 'Warm',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    min: 40,
    max: 59,
    label: 'Cool',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    min: 0,
    max: 39,
    label: 'Cold',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
];

const priorityOrder = {
  'VERY HIGH': 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const MobileLeadScoring: React.FC<MobileLeadScoringProps> = ({
  leads,
  onLeadClick,
  loading = false,
}) => {
  const isMobile = useIsMobile();
  const [selectedScoreRange, setSelectedScoreRange] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<'score' | 'priority' | 'activity'>(
    'score'
  );
  const [showInsights, setShowInsights] = useState(false);

  // Process and categorize leads
  const processedLeads = useMemo(() => {
    return leads.map(lead => {
      const score =
        typeof lead.lead_score === 'string'
          ? parseInt(lead.lead_score)
          : lead.lead_score;
      const range =
        scoreRanges.find(r => score >= r.min && score <= r.max) ||
        scoreRanges[3];

      return {
        ...lead,
        scoreRange: range,
        numericScore: score,
        priorityValue:
          priorityOrder[lead.priority as keyof typeof priorityOrder] || 0,
      };
    });
  }, [leads]);

  // Group leads by score range
  const leadsByRange = useMemo(() => {
    const groups: Record<string, typeof processedLeads> = {};

    scoreRanges.forEach(range => {
      groups[range.label] = processedLeads.filter(
        lead => lead.scoreRange.label === range.label
      );
    });

    return groups;
  }, [processedLeads]);

  // Sort leads within each group
  const sortedLeadsByRange = useMemo(() => {
    const sorted: Record<string, typeof processedLeads> = {};

    Object.entries(leadsByRange).forEach(([range, leads]) => {
      sorted[range] = [...leads].sort((a, b) => {
        switch (sortBy) {
          case 'score':
            return b.numericScore - a.numericScore;
          case 'priority':
            return b.priorityValue - a.priorityValue;
          case 'activity':
            return (
              new Date(b.last_activity || 0).getTime() -
              new Date(a.last_activity || 0).getTime()
            );
          default:
            return 0;
        }
      });
    });

    return sorted;
  }, [leadsByRange, sortBy]);

  // Calculate insights
  const insights = useMemo(() => {
    const total = processedLeads.length;
    const hotLeads = leadsByRange['Hot']?.length || 0;
    const warmLeads = leadsByRange['Warm']?.length || 0;
    const avgScore =
      total > 0
        ? processedLeads.reduce((sum, lead) => sum + lead.numericScore, 0) /
          total
        : 0;
    const automationActive = processedLeads.filter(
      lead => lead.automation_active
    ).length;

    return {
      total,
      hotLeads,
      warmLeads,
      avgScore: Math.round(avgScore),
      automationActive,
      hotPercentage: total > 0 ? Math.round((hotLeads / total) * 100) : 0,
      warmPercentage: total > 0 ? Math.round((warmLeads / total) * 100) : 0,
    };
  }, [processedLeads, leadsByRange]);

  const handleScoreRangeSelect = (range: string) => {
    setSelectedScoreRange(selectedScoreRange === range ? null : range);
  };

  const handleLeadClick = (lead: LeadScoreData) => {
    onLeadClick(lead);
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className='animate-pulse'>
            <CardContent className='p-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Mobile Header with Insights */}
      <div className='sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 pb-4'>
        {/* Quick Stats */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <Card className='p-3'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-red-100 flex items-center justify-center'>
                <Target className='h-4 w-4 text-red-600' />
              </div>
              <div>
                <p className='text-xs text-gray-500'>Hot Leads</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {insights.hotLeads}
                </p>
              </div>
            </div>
          </Card>

          <Card className='p-3'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                <Brain className='h-4 w-4 text-blue-600' />
              </div>
              <div>
                <p className='text-xs text-gray-500'>Avg Score</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {insights.avgScore}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex gap-1'>
            {(['score', 'priority', 'activity'] as const).map(sort => (
              <Button
                key={sort}
                variant={sortBy === sort ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSortBy(sort)}
                className='text-xs px-2 py-1 h-7'
              >
                {sort === 'score'
                  ? 'Score'
                  : sort === 'priority'
                    ? 'Priority'
                    : 'Activity'}
              </Button>
            ))}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowInsights(!showInsights)}
            className='text-xs px-2 py-1 h-7'
          >
            <Info className='h-3 w-3 mr-1' />
            Insights
          </Button>
        </div>

        {/* Insights Panel */}
        {showInsights && (
          <Card className='mt-3 p-3'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Total Leads:</span>
                <span className='font-medium'>{insights.total}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Hot Lead %:</span>
                <span className='font-medium text-red-600'>
                  {insights.hotPercentage}%
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Warm Lead %:</span>
                <span className='font-medium text-orange-600'>
                  {insights.warmPercentage}%
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Automation Active:</span>
                <span className='font-medium text-green-600'>
                  {insights.automationActive}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Score Range Filters */}
      <div className='grid grid-cols-2 gap-2'>
        {scoreRanges.map(range => {
          const count = leadsByRange[range.label]?.length || 0;
          return (
            <button
              key={range.label}
              onClick={() => handleScoreRangeSelect(range.label)}
              className={cn(
                'p-3 rounded-lg text-sm font-medium transition-all duration-200',
                'border-2 min-h-[60px] flex flex-col items-center justify-center gap-1',
                selectedScoreRange === range.label
                  ? 'border-primary bg-primary/10 text-primary'
                  : `${range.bgColor} ${range.textColor} ${range.borderColor}`,
                count > 0 && 'ring-1 ring-offset-1 ring-gray-200'
              )}
            >
              <div className='flex items-center gap-2'>
                <div className={cn('w-3 h-3 rounded-full', range.color)}></div>
                <span className='font-semibold'>{range.label}</span>
              </div>
              <Badge variant='secondary' className='text-xs px-2 py-0.5'>
                {count} leads
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Leads List */}
      <div className='space-y-3'>
        {selectedScoreRange
          ? // Show leads for selected range
            sortedLeadsByRange[selectedScoreRange]?.map(lead => (
              <MobileLeadCard
                key={lead.id}
                lead={lead}
                onLeadClick={handleLeadClick}
              />
            ))
          : // Show all leads grouped by range
            scoreRanges.map(range => {
              const rangeLeads = sortedLeadsByRange[range.label] || [];
              if (rangeLeads.length === 0) return null;

              return (
                <div key={range.label} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-sm text-gray-900 flex items-center gap-2'>
                      <div
                        className={cn('w-2 h-2 rounded-full', range.color)}
                      ></div>
                      {range.label} Leads ({rangeLeads.length})
                    </h3>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleScoreRangeSelect(range.label)}
                      className='text-xs text-gray-500'
                    >
                      View All
                      <ChevronRight className='h-3 w-3 ml-1' />
                    </Button>
                  </div>
                  <div className='space-y-2'>
                    {rangeLeads.slice(0, 2).map(lead => (
                      <MobileLeadCard
                        key={lead.id}
                        lead={lead}
                        onLeadClick={handleLeadClick}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Empty State */}
      {processedLeads.length === 0 && (
        <div className='text-center py-12'>
          <Brain className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No leads found
          </h3>
          <p className='text-gray-500 text-sm'>
            No leads available for scoring
          </p>
        </div>
      )}
    </div>
  );
};

interface MobileLeadCardProps {
  lead: LeadScoreData & {
    scoreRange: ScoreRange;
    numericScore: number;
    priorityValue: number;
  };
  onLeadClick: (lead: LeadScoreData) => void;
  compact?: boolean;
}

const MobileLeadCard: React.FC<MobileLeadCardProps> = ({
  lead,
  onLeadClick,
  compact = false,
}) => {
  const handleCardClick = () => {
    onLeadClick(lead);
  };

  const [trend] = useState(() => {
    // Mock trend calculation - in real app, this would compare with historical data
    const trends = ['up', 'down', 'stable'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  });

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-all duration-200',
        compact && 'p-3'
      )}
      onClick={handleCardClick}
    >
      <CardContent className={compact ? 'p-0' : 'p-4'}>
        <div className='flex items-start gap-3'>
          {/* Score Indicator */}
          <div className='flex-shrink-0'>
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm',
                lead.scoreRange.color
              )}
            >
              {lead.numericScore}
            </div>
            {trend === 'up' && (
              <TrendingUp className='h-3 w-3 text-green-500 mt-1' />
            )}
            {trend === 'down' && (
              <TrendingDown className='h-3 w-3 text-red-500 mt-1' />
            )}
          </div>

          {/* Lead Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between'>
              <div className='min-w-0 flex-1'>
                <h3 className='font-semibold text-gray-900 text-sm truncate'>
                  {lead.name}
                </h3>
                {lead.company && (
                  <p className='text-xs text-gray-500 mt-1 truncate'>
                    {lead.company}
                  </p>
                )}
                {lead.role && (
                  <p className='text-xs text-gray-400 mt-1 truncate'>
                    {lead.role}
                  </p>
                )}
              </div>
            </div>

            {/* Badges and Stats */}
            <div className='flex items-center gap-2 mt-2 flex-wrap'>
              <Badge
                className={cn(
                  'text-xs',
                  lead.scoreRange.bgColor,
                  lead.scoreRange.textColor,
                  lead.scoreRange.borderColor
                )}
              >
                {lead.scoreRange.label}
              </Badge>

              {lead.priority && (
                <Badge variant='outline' className='text-xs'>
                  {lead.priority}
                </Badge>
              )}

              {lead.automation_active && (
                <Badge variant='secondary' className='text-xs'>
                  <Zap className='h-3 w-3 mr-1' />
                  Auto
                </Badge>
              )}

              {lead.reply_type && (
                <Badge variant='outline' className='text-xs'>
                  {lead.reply_type}
                </Badge>
              )}
            </div>

            {/* Activity Info */}
            {lead.last_activity && (
              <div className='flex items-center gap-1 mt-2 text-xs text-gray-500'>
                <span>
                  Last activity:{' '}
                  {new Date(lead.last_activity).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileLeadScoring;
