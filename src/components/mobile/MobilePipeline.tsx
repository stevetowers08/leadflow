/**
 * Mobile-Optimized Pipeline Component
 * Implements CRM mobile best practices for pipeline management
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import {
  Building2,
  Calendar,
  ChevronRight,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Users,
  Zap,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

interface Company {
  id: string;
  name: string;
  industry?: string;
  head_office?: string;
  pipeline_stage: string;
  lead_score?: string;
  priority?: string;
  automation_active?: boolean;
  people_count?: number;
  jobs_count?: number;
  is_favourite?: boolean;
  owner_id?: string;
}

interface MobilePipelineProps {
  companies: Company[];
  onCompanyClick: (company: Company) => void;
  onStageUpdate: (companyId: string, newStage: string) => void;
  loading?: boolean;
}

const pipelineStages = [
  {
    key: 'new_lead',
    label: 'New Lead',
    color: 'bg-gray-100 text-foreground border-border',
    shortLabel: 'New',
  },
  {
    key: 'automated',
    label: 'Automated',
    color: 'bg-green-600 text-white border-green-700',
    shortLabel: 'Auto',
  },
  {
    key: 'replied',
    label: 'Replied',
    color: 'bg-amber-600 text-white border-amber-700',
    shortLabel: 'Reply',
  },
  {
    key: 'meeting_scheduled',
    label: 'Meeting Scheduled',
    color: 'bg-orange-600 text-white border-orange-700',
    shortLabel: 'Meeting',
  },
  {
    key: 'proposal_sent',
    label: 'Proposal Sent',
    color: 'bg-purple-600 text-white border-purple-700',
    shortLabel: 'Proposal',
  },
  {
    key: 'negotiation',
    label: 'Negotiation',
    color: 'bg-amber-600 text-white border-amber-700',
    shortLabel: 'Negotiate',
  },
  {
    key: 'closed_won',
    label: 'Closed Won',
    color: 'bg-emerald-600 text-white border-emerald-700',
    shortLabel: 'Won',
  },
  {
    key: 'closed_lost',
    label: 'Closed Lost',
    color: 'bg-red-600 text-white border-red-700',
    shortLabel: 'Lost',
  },
  {
    key: 'on_hold',
    label: 'On Hold',
    color: 'bg-gray-600 text-white border-gray-700',
    shortLabel: 'Hold',
  },
];

export const MobilePipeline: React.FC<MobilePipelineProps> = ({
  companies,
  onCompanyClick,
  onStageUpdate,
  loading = false,
}) => {
  const isMobile = useIsMobile();
  const { lightHaptic, mediumHaptic } = useHapticFeedback();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Group companies by stage
  const companiesByStage = useMemo(() => {
    const result: Record<string, Company[]> = {};

    // Initialize all stages
    pipelineStages.forEach(stage => {
      result[stage.key] = [];
    });

    // Filter and group companies
    companies.forEach(company => {
      const matchesSearch =
        !searchTerm ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase());

      if (
        matchesSearch &&
        company.pipeline_stage &&
        result[company.pipeline_stage]
      ) {
        result[company.pipeline_stage].push(company);
      }
    });

    return result;
  }, [companies, searchTerm]);

  const handleStageSelect = useCallback(
    (stageKey: string) => {
      mediumHaptic();
      setSelectedStage(selectedStage === stageKey ? null : stageKey);
    },
    [selectedStage, mediumHaptic]
  );

  const handleQuickAction = useCallback(
    (action: string, company: Company) => {
      lightHaptic();
      // Handle quick actions like call, email, schedule
      console.log(`${action} action for ${company.name}`);
    },
    [lightHaptic]
  );

  const getStageStats = useCallback(() => {
    return pipelineStages.map(stage => ({
      ...stage,
      count: companiesByStage[stage.key]?.length || 0,
    }));
  }, [companiesByStage]);

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

  const stageStats = getStageStats();

  return (
    <div className='space-y-4'>
      {/* Mobile Pipeline Header */}
      <div className='sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 pb-4'>
        {/* Search and Filters */}
        <div className='flex items-center gap-2 mb-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search companies...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-border/60 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm'
            />
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowFilters(!showFilters)}
            className='px-3'
          >
            <Filter className='h-4 w-4' />
          </Button>
        </div>

        {/* Stage Overview */}
        <div className='grid grid-cols-4 gap-2'>
          {stageStats.map(stage => (
            <button
              key={stage.key}
              onClick={() => handleStageSelect(stage.key)}
              className={cn(
                'p-2 rounded-lg text-xs font-medium transition-all duration-200',
                'border-2 min-h-[48px] flex flex-col items-center justify-center gap-1',
                selectedStage === stage.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : stage.color,
                stage.count > 0 && 'ring-1 ring-offset-1 ring-gray-200'
              )}
            >
              <span className='font-semibold'>{stage.shortLabel}</span>
              <Badge variant='secondary' className='text-xs px-1.5 py-0.5'>
                {stage.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Companies List */}
      <div className='space-y-3'>
        {selectedStage
          ? // Show companies for selected stage
            companiesByStage[selectedStage]?.map(company => (
              <MobileCompanyCard
                key={company.id}
                company={company}
                onCompanyClick={onCompanyClick}
                onQuickAction={handleQuickAction}
                onStageUpdate={onStageUpdate}
              />
            ))
          : // Show all companies grouped by stage
            pipelineStages.map(stage => {
              const stageCompanies = companiesByStage[stage.key] || [];
              if (stageCompanies.length === 0) return null;

              return (
                <div key={stage.key} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-sm text-foreground flex items-center gap-2'>
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          stage.color.split(' ')[0]
                        )}
                      ></span>
                      {stage.label}
                    </h3>
                    <Badge variant='outline' className='text-xs'>
                      {stageCompanies.length}
                    </Badge>
                  </div>
                  <div className='space-y-2'>
                    {stageCompanies.slice(0, 3).map(company => (
                      <MobileCompanyCard
                        key={company.id}
                        company={company}
                        onCompanyClick={onCompanyClick}
                        onQuickAction={handleQuickAction}
                        onStageUpdate={onStageUpdate}
                        compact={true}
                      />
                    ))}
                    {stageCompanies.length > 3 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleStageSelect(stage.key)}
                        className='w-full text-xs text-muted-foreground'
                      >
                        View {stageCompanies.length - 3} more companies
                        <ChevronRight className='h-3 w-3 ml-1' />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Empty State */}
      {Object.values(companiesByStage).flat().length === 0 && (
        <div className='text-center py-12'>
          <Building2 className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-medium text-foreground mb-2'>
            No companies found
          </h3>
          <p className='text-muted-foreground text-sm'>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No companies in pipeline'}
          </p>
        </div>
      )}
    </div>
  );
};

interface MobileCompanyCardProps {
  company: Company;
  onCompanyClick: (company: Company) => void;
  onQuickAction: (action: string, company: Company) => void;
  onStageUpdate: (companyId: string, newStage: string) => void;
  compact?: boolean;
}

const MobileCompanyCard: React.FC<MobileCompanyCardProps> = ({
  company,
  onCompanyClick,
  onQuickAction,
  onStageUpdate,
  compact = false,
}) => {
  const { lightHaptic } = useHapticFeedback();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const currentStage = pipelineStages.find(
    stage => stage.key === company.pipeline_stage
  );
  const nextStages = pipelineStages.slice(
    pipelineStages.findIndex(stage => stage.key === company.pipeline_stage) + 1,
    pipelineStages.findIndex(stage => stage.key === company.pipeline_stage) + 3
  );

  const handleCardClick = useCallback(() => {
    lightHaptic();
    onCompanyClick(company);
  }, [company, onCompanyClick, lightHaptic]);

  const handleQuickActionClick = useCallback(
    (e: React.MouseEvent, action: string) => {
      e.stopPropagation();
      onQuickAction(action, company);
    },
    [company, onQuickAction]
  );

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
          {/* Company Logo */}
          <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ring-1 ring-gray-200/50'>
            <Building2 className='h-5 w-5 text-muted-foreground' />
          </div>

          {/* Company Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between'>
              <div className='min-w-0 flex-1'>
                <h3 className='font-semibold text-foreground text-sm truncate'>
                  {company.name}
                </h3>
                {company.industry && (
                  <p className='text-xs text-muted-foreground mt-1 truncate'>
                    {company.industry}
                  </p>
                )}
              </div>

              {/* Quick Actions Toggle */}
              <Button
                variant='ghost'
                size='sm'
                onClick={e => {
                  e.stopPropagation();
                  setShowQuickActions(!showQuickActions);
                }}
                className='p-1 h-8 w-8'
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>

            {/* Stage and Stats */}
            <div className='flex items-center gap-2 mt-2'>
              {currentStage && (
                <Badge className={cn('text-xs', currentStage.color)}>
                  {currentStage.shortLabel}
                </Badge>
              )}

              {company.lead_score && (
                <Badge variant='outline' className='text-xs'>
                  Score: {company.lead_score}
                </Badge>
              )}

              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <Users className='h-3 w-3' />
                <span>{company.people_count || 0}</span>
              </div>

              {company.automation_active && (
                <Badge variant='secondary' className='text-xs'>
                  <Zap className='h-3 w-3 mr-1' />
                  Auto
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className='flex items-center gap-2 mt-3 pt-3 border-t border-gray-100'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={e => handleQuickActionClick(e, 'call')}
                  className='flex-1 text-xs'
                >
                  <Phone className='h-3 w-3 mr-1' />
                  Call
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={e => handleQuickActionClick(e, 'email')}
                  className='flex-1 text-xs'
                >
                  <Mail className='h-3 w-3 mr-1' />
                  Email
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={e => handleQuickActionClick(e, 'schedule')}
                  className='flex-1 text-xs'
                >
                  <Calendar className='h-3 w-3 mr-1' />
                  Meeting
                </Button>
              </div>
            )}

            {/* Next Stage Options */}
            {nextStages.length > 0 && (
              <div className='mt-3 pt-3 border-t border-gray-100'>
                <p className='text-xs text-muted-foreground mb-2'>Move to:</p>
                <div className='flex gap-1'>
                  {nextStages.map(stage => (
                    <Button
                      key={stage.key}
                      variant='ghost'
                      size='sm'
                      onClick={e => {
                        e.stopPropagation();
                        onStageUpdate(company.id, stage.key);
                      }}
                      className={cn('text-xs px-2 py-1 h-6', stage.color)}
                    >
                      {stage.shortLabel}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobilePipeline;
