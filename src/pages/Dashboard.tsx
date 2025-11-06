'use client';

/**
 * Daily Dashboard - Morning View
 * Shows actionable items: new jobs to review, email replies, pipeline overview
 */

import { ClearbitLogoSync } from '@/components/ClearbitLogo';
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
import { Card } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useJobDiscoveryMetrics } from '@/hooks/useSupabaseData';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React from 'react';
import { ScrollToTopButton } from '@/components/shared/ScrollToTopButton';

interface Job {
  id: string;
  title: string;
  qualification_status: string;
  created_at: string;
  companies?: {
    id: string;
    name: string;
    website?: string;
    head_office?: string;
    industry?: string;
    logo_url?: string;
  };
}

interface EmailThread {
  id: string;
  gmail_thread_id: string;
  subject: string | null;
  last_message_at: string | null;
  is_read: boolean | null;
  person_id: string | null;
  participants: unknown;
}

// Removed pipeline snapshot UI per request

// Client-side mount guard wrapper
const Dashboard: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
};

function DashboardContent() {
  const router = useRouter();
  const { data: clientId, isLoading: clientIdLoading } = useClientId();
  const [jobsToReview, setJobsToReview] = useState<Job[]>([]);
  const [emailReplies, setEmailReplies] = useState<EmailThread[]>([]);
  const [newLeadsToday, setNewLeadsToday] = useState<number>(0);
  const [newCompaniesToday, setNewCompaniesToday] = useState<number>(0);
  // Past week metrics
  const [newJobsPastWeek, setNewJobsPastWeek] = useState<number>(0);
  const [qualifiedCompaniesPastWeek, setQualifiedCompaniesPastWeek] =
    useState<number>(0);
  const [peopleAddedPastWeek, setPeopleAddedPastWeek] = useState<number>(0);
  // Last week for trend comparison
  const [newJobsLastWeek, setNewJobsLastWeek] = useState<number>(0);
  const [qualifiedCompaniesLastWeek, setQualifiedCompaniesLastWeek] =
    useState<number>(0);
  const [peopleAddedLastWeek, setPeopleAddedLastWeek] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobSlideOutOpen, setIsJobSlideOutOpen] = useState(false);

  // Job discovery KPIs for Today and Week
  const { data: jobKpis, isLoading: jobKpisLoading } = useJobDiscoveryMetrics();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Don't load if clientId is still loading or not available
        if (clientIdLoading || !clientId) {
          setLoading(false);
          return;
        }

        const twoDaysAgo = new Date(
          Date.now() - 48 * 60 * 60 * 1000
        ).toISOString();

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        const [
          jobsRes,
          threadsRes,
          leadsTodayRes,
          companiesTodayRes,
          jobsWeekRes,
          repliesWeekRes,
          progressedWeekRes,
          jobsLastWeekRes,
          repliesLastWeekRes,
          progressedLastWeekRes,
        ] = await Promise.all([
          supabase
            .from('jobs')
            .select(
              'id, title, qualification_status, created_at, companies!jobs_company_id_fkey(id, name, website, head_office, industry, logo_url)'
            )
            .eq('qualification_status', 'new')
            .gte('created_at', twoDaysAgo)
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('email_threads')
            .select(
              'id, gmail_thread_id, subject, last_message_at, is_read, person_id, participants'
            )
            .eq('is_read', false)
            .order('last_message_at', { ascending: false })
            .limit(10),
          supabase
            .from('people')
            .select('id, created_at')
            .gte('created_at', new Date().toISOString().split('T')[0]),
          supabase
            .from('companies')
            .select('id, created_at')
            .gte('created_at', new Date().toISOString().split('T')[0]),
          // Past week metrics
          supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', oneWeekAgo.toISOString()),
          supabase
            .from('client_companies')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', clientId)
            .eq('qualification_status', 'qualify')
            .gte('qualified_at', oneWeekAgo.toISOString()),
          supabase
            .from('people')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', oneWeekAgo.toISOString()),
          // Last week metrics for trend calculation
          supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', twoWeeksAgo.toISOString())
            .lt('created_at', oneWeekAgo.toISOString()),
          supabase
            .from('client_companies')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', clientId)
            .eq('qualification_status', 'qualify')
            .gte('qualified_at', twoWeeksAgo.toISOString())
            .lt('qualified_at', oneWeekAgo.toISOString()),
          supabase
            .from('people')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', twoWeeksAgo.toISOString())
            .lt('created_at', oneWeekAgo.toISOString()),
        ]);

        // Check for errors and log them, but continue with partial data
        const errors: string[] = [];
        if (jobsRes.error) {
          console.error('Jobs query error:', jobsRes.error);
          errors.push(
            `Jobs: ${jobsRes.error.message || jobsRes.error.code || 'Unknown error'}`
          );
        }
        if (threadsRes.error) {
          console.error('Threads query error:', threadsRes.error);
          errors.push(
            `Email threads: ${threadsRes.error.message || threadsRes.error.code || 'Unknown error'}`
          );
        }
        if (leadsTodayRes.error) {
          console.error('Leads today query error:', leadsTodayRes.error);
          errors.push(
            `Leads: ${leadsTodayRes.error.message || leadsTodayRes.error.code || 'Unknown error'}`
          );
        }
        if (companiesTodayRes.error) {
          console.error(
            'Companies today query error:',
            companiesTodayRes.error
          );
          errors.push(
            `Companies: ${companiesTodayRes.error.message || companiesTodayRes.error.code || 'Unknown error'}`
          );
        }

        // Log all errors for debugging
        if (errors.length > 0) {
          console.error('Dashboard load errors:', {
            jobs: jobsRes.error,
            threads: threadsRes.error,
            leads: leadsTodayRes.error,
            companies: companiesTodayRes.error,
          });
          // Set error message but don't throw - allow partial data to display
          setError(`Some data failed to load: ${errors.join('; ')}`);
        }

        // Transform the jobs data to flatten the companies array if present
        // Handle case where jobs query failed - use empty array
        const transformedJobs = (jobsRes.data || []).map(
          (job: {
            companies?:
              | Array<unknown>
              | {
                  id: string;
                  name: string;
                  website?: string;
                  head_office?: string;
                  industry?: string;
                  logo_url?: string;
                };
            [key: string]: unknown;
          }) => ({
            ...job,
            companies: Array.isArray(job.companies)
              ? job.companies[0] || null
              : job.companies,
          })
        );
        // Set data, using empty arrays/0 if queries failed
        setJobsToReview(transformedJobs as Job[]);
        setEmailReplies((threadsRes.data || []) as EmailThread[]);
        setNewLeadsToday(
          leadsTodayRes.error ? 0 : leadsTodayRes.data?.length || 0
        );
        setNewCompaniesToday(
          companiesTodayRes.error ? 0 : companiesTodayRes.data?.length || 0
        );

        // Past week metrics are optional; default to 0 on error
        setNewJobsPastWeek(jobsWeekRes.error ? 0 : jobsWeekRes.count || 0);
        setQualifiedCompaniesPastWeek(
          repliesWeekRes.error ? 0 : repliesWeekRes.count || 0
        );
        setPeopleAddedPastWeek(
          progressedWeekRes.error ? 0 : progressedWeekRes.count || 0
        );

        // Last week metrics for trends
        setNewJobsLastWeek(
          jobsLastWeekRes.error ? 0 : jobsLastWeekRes.count || 0
        );
        setQualifiedCompaniesLastWeek(
          repliesLastWeekRes.error ? 0 : repliesLastWeekRes.count || 0
        );
        setPeopleAddedLastWeek(
          progressedLastWeekRes.error ? 0 : progressedLastWeekRes.count || 0
        );
      } catch (e) {
        console.error('Dashboard load error:', e);
        const errorMessage =
          e instanceof Error ? e.message : 'Failed to load dashboard data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    if (!clientIdLoading) {
      load();
    }
  }, [clientId, clientIdLoading]);

  const handleJobClick = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobSlideOutOpen(true);
  }, []);

  const handleEmailClick = useCallback(
    (threadId: string) => {
      router.push(`/crm/communications?thread=${threadId}`);
    },
    [router]
  );

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number): string => {
    if (previous === 0) {
      return current > 0 ? 'New' : '0%';
    }
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 0.5) return '0%';
    return `${change > 0 ? '+' : ''}${Math.round(change)}%`;
  };

  const handleWeeklyCardClick = useCallback(
    (type: 'jobs' | 'companies' | 'people') => {
      if (type === 'jobs') {
        router.push('/jobs?tab=new');
      } else if (type === 'companies') {
        router.push('/companies');
      } else if (type === 'people') {
        router.push('/people');
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

  return (
    <Page title='Dashboard' hideHeader padding='large'>
      <div className='space-y-5 pb-8'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground mb-4'>
            {getGreeting()}
          </h1>
          {error && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
        </div>

        {/* Current Actions */}
        <div className='grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/5 via-blue-50/30 to-blue-500/10 p-4 backdrop-blur-sm shadow-sm'>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              Jobs to Review
            </p>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : jobsToReview.length}
            </p>
          </div>
          <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-purple-500/5 via-purple-50/30 to-purple-500/10 p-4 backdrop-blur-sm shadow-sm'>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              Unread Replies
            </p>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : emailReplies.length}
            </p>
          </div>
          <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/5 via-emerald-50/30 to-emerald-500/10 p-4 backdrop-blur-sm shadow-sm'>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              New Leads Today
            </p>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : newLeadsToday}
            </p>
          </div>
          <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-amber-500/5 via-amber-50/30 to-amber-500/10 p-4 backdrop-blur-sm shadow-sm'>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              New Companies Today
            </p>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {loading ? '…' : newCompaniesToday}
            </p>
          </div>
        </div>

        {/* Past Week Summary Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold tracking-tight text-foreground mt-0 mb-2'>
              Past Week Summary
            </h2>
          </div>
          <div className='grid gap-3 grid-cols-1 md:grid-cols-3'>
            <Card
              onClick={() => handleWeeklyCardClick('jobs')}
              className='cursor-pointer hover:shadow-md transition-all relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-blue-500/5 via-blue-50/30 to-blue-500/10 backdrop-blur-sm shadow-sm'
            >
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    New Jobs
                  </p>
                </div>
                <p className='text-2xl font-bold tracking-tight text-foreground mb-1'>
                  {loading ? '…' : newJobsPastWeek}
                </p>
              </div>
            </Card>
            <Card
              onClick={() => handleWeeklyCardClick('companies')}
              className='cursor-pointer hover:shadow-md transition-all relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-purple-500/5 via-purple-50/30 to-purple-500/10 backdrop-blur-sm shadow-sm'
            >
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Qualified Companies
                  </p>
                </div>
                <p className='text-2xl font-bold tracking-tight text-foreground mb-1'>
                  {loading ? '…' : qualifiedCompaniesPastWeek}
                </p>
              </div>
            </Card>
            <Card
              onClick={() => handleWeeklyCardClick('people')}
              className='cursor-pointer hover:shadow-md transition-all relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-emerald-500/5 via-emerald-50/30 to-emerald-500/10 backdrop-blur-sm shadow-sm'
            >
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    People Added
                  </p>
                </div>
                <p className='text-2xl font-bold tracking-tight text-foreground mb-1'>
                  {loading ? '…' : peopleAddedPastWeek}
                </p>
              </div>
            </Card>
          </div>
          {/* Weekly Job Discovery KPI add-on */}
          <div className='grid gap-3 grid-cols-1 md:grid-cols-3 mt-2'>
            <Card className='cursor-default hover:shadow-md transition-all relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-blue-500/5 via-blue-50/30 to-blue-500/10 backdrop-blur-sm shadow-sm'>
              <div className='p-4'>
                <p className='text-sm font-medium text-muted-foreground mb-1'>
                  Jobs Analyzed
                </p>
                <p className='text-2xl font-bold tracking-tight text-foreground'>
                  {jobKpisLoading ? '…' : jobKpis?.week.analyzed || 0}
                </p>
              </div>
            </Card>
            <Card className='cursor-default hover:shadow-md transition-all relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-green-500/5 via-green-50/30 to-green-500/10 backdrop-blur-sm shadow-sm'>
              <div className='p-4'>
                <p className='text-sm font-medium text-muted-foreground mb-1'>
                  Qualification Rate
                </p>
                <p className='text-2xl font-bold tracking-tight text-foreground'>
                  {jobKpisLoading
                    ? '…'
                    : `${jobKpis?.week.qualificationRatePercent || 0}%`}
                </p>
              </div>
            </Card>
            <Card className='cursor-default hover:shadow-md transition-all relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-purple-500/5 via-purple-50/30 to-purple-500/10 backdrop-blur-sm shadow-sm'>
              <div className='p-4'>
                <p className='text-sm font-medium text-muted-foreground mb-1'>
                  Non-Executive Filtered
                </p>
                <p className='text-2xl font-bold tracking-tight text-foreground'>
                  {jobKpisLoading
                    ? '…'
                    : jobKpis?.week.nonExecutiveFiltered || 0}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Lists */}
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
          <Card className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold tracking-tight text-foreground'>
                Jobs to Review
              </h3>
              <button
                onClick={() => router.push('/jobs')}
                className='text-xs text-primary hover:text-primary/80 transition-colors font-medium'
              >
                View Pipeline
              </button>
            </div>
            {jobsToReview.length > 0 && (
              <div className='overflow-x-auto scrollbar-modern'>
                <table className='w-full table-fixed'>
                  <thead>
                    <tr className='border-b border-border/50'>
                      <th className='text-left py-2 w-1/2 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Job
                      </th>
                      <th className='text-left py-2 w-1/3 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Company
                      </th>
                      <th className='text-right py-2 w-1/6 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Posted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsToReview.map(job => {
                      const createdDate = new Date(job.created_at);
                      const now = new Date();
                      const diffInHours = Math.floor(
                        (now.getTime() - createdDate.getTime()) /
                          (1000 * 60 * 60)
                      );

                      let timeDisplay = '';
                      if (diffInHours < 24) {
                        timeDisplay = `${diffInHours}h ago`;
                      } else {
                        const diffInDays = Math.floor(diffInHours / 24);
                        timeDisplay = `${diffInDays}d ago`;
                      }

                      return (
                        <tr
                          key={job.id}
                          onClick={() => handleJobClick(job.id)}
                          className='border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors'
                        >
                          <td className='py-3 overflow-hidden'>
                            <div className='flex items-center gap-3 min-w-0'>
                              <ClearbitLogoSync
                                companyName={job.companies?.name || ''}
                                website={job.companies?.website}
                                size='sm'
                              />
                              <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-foreground truncate'>
                                  {job.title}
                                </p>
                                <p className='text-xs text-muted-foreground truncate'>
                                  {job.companies?.industry || 'No industry'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='py-3 overflow-hidden'>
                            <span className='text-sm text-foreground truncate block'>
                              {job.companies?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className='py-3 text-right overflow-hidden'>
                            <span className='text-xs text-muted-foreground whitespace-nowrap'>
                              {timeDisplay}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {jobsToReview.length === 0 && !loading && (
              <p className='text-sm text-muted-foreground py-6 text-center'>
                No jobs to review
              </p>
            )}
          </Card>

          <Card className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold tracking-tight text-foreground'>
                Unread Replies
              </h3>
              <button
                onClick={() => router.push('/crm/communications')}
                className='text-xs text-primary hover:text-primary/80 transition-colors font-medium'
              >
                Open Conversation
              </button>
            </div>
            <div className='space-y-1'>
              {emailReplies.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleEmailClick(t.gmail_thread_id)}
                  className='w-full text-left p-2.5 rounded-lg hover:bg-muted/50 transition-colors'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <p className='text-sm font-medium text-foreground line-clamp-2'>
                      {t.subject || 'No subject'}
                    </p>
                    <span className='text-xs text-muted-foreground whitespace-nowrap'>
                      {t.last_message_at
                        ? formatDistanceToNow(new Date(t.last_message_at), {
                            addSuffix: true,
                          })
                        : ''}
                    </span>
                  </div>
                </button>
              ))}
              {emailReplies.length === 0 && !loading && (
                <p className='text-sm text-muted-foreground py-6 text-center'>
                  No new replies
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Pipeline Overview removed per request */}
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
