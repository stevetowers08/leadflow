'use client';

/**
 * Daily Dashboard - Morning View
 * Shows actionable items: new jobs to review, email replies, pipeline overview
 */

import { ClearbitLogoSync } from '@/components/ClearbitLogo';
import { ScrollToTopButton } from '@/components/shared/ScrollToTopButton';
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
import { Card } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import { useClientId } from '@/hooks/useClientId';
import {
  useDashboardChartData,
  useDashboardData,
} from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';
import type {
  DashboardActivityData,
  DashboardJobsData,
} from '@/services/dashboardDataService';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Mail,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Use types from service
type Job = DashboardJobsData;
type ActivityItem = DashboardActivityData;

// Removed pipeline snapshot UI per request

// Client-side mount guard wrapper
const Dashboard: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-muted'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
};

function DashboardContent() {
  const router = useRouter();
  const { data: clientId } = useClientId();

  // Use React Query hooks for data fetching (long-term solution)
  const {
    data: dashboardData,
    isLoading: loading,
    error: dashboardError,
  } = useDashboardData();

  const { data: chartData = [], isLoading: chartLoading } =
    useDashboardChartData(true); // Load chart data in background

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobSlideOutOpen, setIsJobSlideOutOpen] = useState(false);

  // Extract data with defaults
  const jobsToReview = dashboardData?.jobsToReview || [];
  const activities = dashboardData?.activities || [];
  const newLeadsToday = dashboardData?.newLeadsToday || 0;
  const newCompaniesToday = dashboardData?.newCompaniesToday || 0;
  const error = dashboardError
    ? dashboardError instanceof Error
      ? dashboardError.message
      : 'Failed to load dashboard data'
    : null;

  const handleJobClick = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobSlideOutOpen(true);
  }, []);

  const handleActivityClick = useCallback(
    (activity: ActivityItem) => {
      if (activity.type === 'email_reply' || activity.type === 'email') {
        // For email activities, navigate to conversations
        router.push(
          `/conversations${activity.person_id ? `?person=${activity.person_id}` : ''}`
        );
      } else if (activity.person_id) {
        router.push(`/people/${activity.person_id}`);
      } else {
        router.push('/conversations');
      }
    },
    [router]
  );

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Render job card
  const renderJobCard = (job: Job) => {
    const createdDate = new Date(job.created_at);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
    );
    const timeDisplay =
      diffInHours < 24
        ? `${diffInHours}h ago`
        : `${Math.floor(diffInHours / 24)}d ago`;

    return (
      <div
        key={job.id}
        className={cn(
          'px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group hover:shadow-md',
          'border border-border bg-card hover:bg-muted/50'
        )}
        onClick={() => handleJobClick(job.id)}
      >
        <div className='flex items-center gap-3'>
          {/* Company Logo */}
          <div className='flex-shrink-0 w-10 h-10 rounded-md border border-border bg-white flex items-center justify-center overflow-hidden'>
            <ClearbitLogoSync
              companyName={job.companies?.name || ''}
              website={job.companies?.website}
              size='sm'
            />
          </div>

          {/* Job Info */}
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-foreground truncate'>
              {job.title}
            </p>
            <div className='flex items-center gap-2 mt-0.5'>
              <p className='text-xs text-muted-foreground truncate'>
                {job.companies?.name || 'Unknown'}
              </p>
              {job.companies?.industry && (
                <>
                  <span className='text-xs text-muted-foreground'>•</span>
                  <p className='text-xs text-muted-foreground truncate'>
                    {job.companies.industry}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Time Badge */}
          <div className='flex-shrink-0'>
            <span className='text-xs text-muted-foreground whitespace-nowrap'>
              {timeDisplay}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render activity card
  const renderActivityCard = (activity: ActivityItem) => {
    const activityDate = new Date(activity.timestamp);
    const timeDisplay = formatDistanceToNow(activityDate, { addSuffix: true });

    const getActivityIcon = () => {
      switch (activity.type) {
        case 'email':
        case 'email_reply':
          return Mail;
        case 'meeting':
          return Calendar;
        case 'note':
          return FileText;
        default:
          return Activity;
      }
    };

    const getActivityColor = () => {
      switch (activity.type) {
        case 'email':
        case 'email_reply':
          return 'bg-primary/10 text-primary';
        case 'meeting':
          return 'bg-purple-100 text-purple-600';
        case 'note':
          return 'bg-amber-100 text-amber-600';
        default:
          return 'bg-muted text-muted-foreground';
      }
    };

    const Icon = getActivityIcon();

    return (
      <div
        key={activity.id}
        className={cn(
          'px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group hover:shadow-md',
          'border border-border bg-card hover:bg-muted/50'
        )}
        onClick={() => handleActivityClick(activity)}
      >
        <div className='flex items-center gap-3'>
          {/* Activity Icon */}
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-md border border-border flex items-center justify-center',
              getActivityColor()
            )}
          >
            <Icon className='h-5 w-5' />
          </div>

          {/* Activity Info */}
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-foreground line-clamp-1'>
              {activity.title}
            </p>
            <div className='flex items-center gap-2 mt-0.5'>
              {activity.person_name && (
                <p className='text-xs text-muted-foreground truncate'>
                  {activity.person_name}
                </p>
              )}
              {activity.company_name && (
                <>
                  {activity.person_name && (
                    <span className='text-xs text-muted-foreground'>•</span>
                  )}
                  <p className='text-xs text-muted-foreground truncate'>
                    {activity.company_name}
                  </p>
                </>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {timeDisplay}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Page title='Dashboard' hideHeader padding='large'>
      <div className='space-y-6 pb-8'>
        <div className='mb-2'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground mb-1'>
            {getGreeting()}!
          </h1>
          <p className='text-sm text-muted-foreground'>
            Here&apos;s an overview of your recruitment activity.
          </p>
          {error && (
            <div className='mt-4 p-3 bg-destructive/10 border border-red-200 rounded-lg'>
              <p className='text-sm text-destructive'>{error}</p>
            </div>
          )}
        </div>

        {/* Key Metrics - Reduced to 4 cards */}
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='p-5 hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                Jobs to Review
              </p>
              <Briefcase className='h-4 w-4 text-primary' />
            </div>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : jobsToReview.length}
            </p>
          </Card>
          <Card className='p-5 hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                Recent Activities
              </p>
              <Activity className='h-4 w-4 text-primary' />
            </div>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : activities.length}
            </p>
          </Card>
          <Card className='p-5 hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                New Leads Today
              </p>
              <Users className='h-4 w-4 text-primary' />
            </div>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : newLeadsToday}
            </p>
          </Card>
          <Card className='p-5 hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                New Companies Today
              </p>
              <Building2 className='h-4 w-4 text-primary' />
            </div>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : newCompaniesToday}
            </p>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className='p-5'>
          <div className='mb-4'>
            <h3 className='text-base font-semibold tracking-tight text-foreground mb-1'>
              Activity Overview
            </h3>
            <p className='text-xs text-muted-foreground'>
              Last 7 days activity trends
            </p>
          </div>
          {loading || chartLoading ? (
            <div className='h-[300px] flex items-center justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          ) : chartData && chartData.length > 0 ? (
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='hsl(var(--border))'
                  />
                  <XAxis
                    dataKey='date'
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType='line'
                  />
                  <Line
                    type='monotone'
                    dataKey='jobs'
                    stroke='hsl(var(--primary))'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name='Jobs'
                  />
                  <Line
                    type='monotone'
                    dataKey='people'
                    stroke='#10B981'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name='People'
                  />
                  <Line
                    type='monotone'
                    dataKey='companies'
                    stroke='#8B5CF6'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name='Companies'
                  />
                  <Line
                    type='monotone'
                    dataKey='replies'
                    stroke='#F59E0B'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name='Replies'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className='h-[300px] flex items-center justify-center text-muted-foreground'>
              <p className='text-sm'>No chart data available</p>
            </div>
          )}
        </Card>

        {/* Tables Section */}
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
          <Card className='p-0 overflow-hidden'>
            <div className='flex items-center justify-between p-5 border-b border-border'>
              <div className='flex items-center gap-2'>
                <h3 className='text-base font-semibold tracking-tight text-foreground'>
                  Jobs to Review
                </h3>
                {jobsToReview.length > 0 && (
                  <span className='inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary'>
                    {jobsToReview.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => router.push('/jobs')}
                className='text-xs text-primary hover:text-primary/80 transition-colors font-medium'
              >
                View All
              </button>
            </div>
            <div className='p-5'>
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='p-4 bg-muted rounded-lg animate-pulse'
                    >
                      <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              ) : jobsToReview.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <Briefcase className='h-8 w-8 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>No jobs to review</p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {jobsToReview.slice(0, 5).map(renderJobCard)}
                </div>
              )}
            </div>
          </Card>

          <Card className='p-0 overflow-hidden'>
            <div className='flex items-center justify-between p-5 border-b border-border'>
              <div className='flex items-center gap-2'>
                <h3 className='text-base font-semibold tracking-tight text-foreground'>
                  Recent Activities
                </h3>
                {activities.length > 0 && (
                  <span className='inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary'>
                    {activities.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => router.push('/conversations')}
                className='text-xs text-primary hover:text-primary/80 transition-colors font-medium'
              >
                View All
              </button>
            </div>
            <div className='p-5'>
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='p-4 bg-muted rounded-lg animate-pulse'
                    >
                      <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <Activity className='h-8 w-8 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>No recent activities</p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {activities.slice(0, 5).map(renderActivityCard)}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <JobDetailsSlideOut
        jobId={selectedJobId}
        isOpen={isJobSlideOutOpen}
        onClose={() => {
          setIsJobSlideOutOpen(false);
          setSelectedJobId(null);
        }}
      />
      <ScrollToTopButton />
    </Page>
  );
}

export default Dashboard;
