import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { designTokens } from '@/design-system/tokens';
import { cn } from '@/lib/utils';
import type { RecentJob } from '@/services/dashboardService';
import {
  Briefcase,
  StickyNote,
  User,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface RecentJobsTabsProps {
  jobs: RecentJob[];
  loading: boolean;
}

export const RecentJobsTabs: React.FC<RecentJobsTabsProps> = ({
  jobs,
  loading,
}) => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const [activeTab, setActiveTab] = useState('unassigned');

  // Get company logo using Clearbit
  const getCompanyLogo = (job: RecentJob) => {
    if (job.company_logo_url) return job.company_logo_url;
    if (!job.company_name) return null;

    // If we have a company website, use it for Clearbit
    if (job.company_website) {
      const cleanWebsite = job.company_website
        .replace(/^https?:\/\/(www\.)?/, '')
        .split('/')[0];
      return `https://logo.clearbit.com/${cleanWebsite}`;
    }

    // Fallback: try to generate from company name
    const cleanCompanyName = job.company_name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');

    return `https://logo.clearbit.com/${cleanCompanyName}.com`;
  };

  // Filter jobs by assignment status and sort by date created
  const filteredJobs = useMemo(() => {
    const sortByDate = (a: RecentJob, b: RecentJob) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

    const unassigned = jobs.filter(job => !job.assigned_to).sort(sortByDate);
    const assignedToMe = jobs
      .filter(job => job.assigned_to === user?.id)
      .sort(sortByDate);
    const recentlyAssigned = jobs
      .filter(job => job.assigned_to && job.assigned_to !== user?.id)
      .sort(sortByDate);

    return {
      unassigned,
      assignedToMe,
      recentlyAssigned,
    };
  }, [jobs, user?.id]);

  const getPriorityColor = (priority?: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderJobCard = (job: RecentJob) => (
    <div
      key={job.id}
      className={cn(
        'px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer group',
        designTokens.borders.card,
        designTokens.borders.cardHover
      )}
      onClick={() => openPopup('job', job.id, job.title)}
    >
      <div className='flex items-center gap-3'>
        {/* Company Logo Only */}
        <div className='flex-shrink-0 w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center'>
          {getCompanyLogo(job) && (
            <img
              src={getCompanyLogo(job)!}
              alt={job.company_name || 'Company'}
              className='w-full h-full rounded-md object-contain'
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Job Info */}
        <div className='flex-1 min-w-0'>
          <div className='font-semibold text-sm truncate'>{job.title}</div>
          <div className='text-xs text-gray-500 truncate'>
            {job.company_name && job.location
              ? `${job.company_name} • ${job.location}`
              : job.company_name || job.location || 'No company'}
          </div>
        </div>

        {/* People Count, Priority and Notes */}
        <div className='flex items-center gap-2 flex-shrink-0'>
          {job.people_count && job.people_count > 0 && (
            <div className='flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>
              <Users className='h-3 w-3' />
              <span>{job.people_count}</span>
            </div>
          )}
          {job.priority && (
            <Badge
              variant='outline'
              className={`text-xs ${getPriorityColor(job.priority)}`}
            >
              {job.priority}
            </Badge>
          )}
          {job.notes_count > 0 && (
            <div className='flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
              <StickyNote className='h-3 w-3' />
              <span>{job.notes_count}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderJobsList = (jobsList: RecentJob[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='p-4 bg-gray-50 rounded-lg animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2 mb-1'></div>
              <div className='h-3 bg-gray-200 rounded w-2/3'></div>
            </div>
          ))}
        </div>
      );
    }

    if (jobsList.length === 0) {
      return (
        <div className='text-center py-8 text-gray-500'>
          <Briefcase className='h-8 w-8 mx-auto mb-2 opacity-50' />
          <p className='text-sm'>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className='space-y-3 max-h-[400px] overflow-y-auto'>
        {jobsList.slice(0, 5).map(renderJobCard)}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        'bg-white',
        designTokens.shadows.cardStatic,
        designTokens.shadows.cardHover,
        designTokens.borders.card
      )}
    >
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-base font-medium text-gray-900'>
          <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10'>
            <Briefcase className='h-4 w-4 text-secondary' />
          </div>
          Recent Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='unassigned' className='flex items-center gap-1'>
              <UserX className='h-3 w-3' />
              Unassigned
              {filteredJobs.unassigned.length > 0 && (
                <Badge variant='secondary' className='ml-1 text-xs'>
                  {filteredJobs.unassigned.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value='assignedToMe'
              className='flex items-center gap-1'
            >
              <User className='h-3 w-3' />
              Mine
              {filteredJobs.assignedToMe.length > 0 && (
                <Badge variant='secondary' className='ml-1 text-xs'>
                  {filteredJobs.assignedToMe.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value='recentlyAssigned'
              className='flex items-center gap-1'
            >
              <UserCheck className='h-3 w-3' />
              Assigned
              {filteredJobs.recentlyAssigned.length > 0 && (
                <Badge variant='secondary' className='ml-1 text-xs'>
                  {filteredJobs.recentlyAssigned.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='unassigned' className='mt-4'>
            {renderJobsList(
              filteredJobs.unassigned,
              'No unassigned jobs found'
            )}
          </TabsContent>

          <TabsContent value='assignedToMe' className='mt-4'>
            {renderJobsList(
              filteredJobs.assignedToMe,
              'No jobs assigned to you'
            )}
          </TabsContent>

          <TabsContent value='recentlyAssigned' className='mt-4'>
            {renderJobsList(
              filteredJobs.recentlyAssigned,
              'No recently assigned jobs'
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
