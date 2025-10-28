/**
 * Daily Dashboard - Morning View
 * Shows actionable items: new jobs to review, email replies, pipeline overview
 */

import { ClearbitLogoSync } from '@/components/ClearbitLogo';
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
import { Card } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface PipelineSnapshot {
  new: number;
  qualified: number;
  proceed: number;
  total: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobsToReview, setJobsToReview] = useState<Job[]>([]);
  const [emailReplies, setEmailReplies] = useState<EmailThread[]>([]);
  const [newLeadsToday, setNewLeadsToday] = useState<number>(0);
  const [newCompaniesToday, setNewCompaniesToday] = useState<number>(0);
  const [pipeline, setPipeline] = useState<PipelineSnapshot>({
    new: 0,
    qualified: 0,
    proceed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobSlideOutOpen, setIsJobSlideOutOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const twoDaysAgo = new Date(
          Date.now() - 48 * 60 * 60 * 1000
        ).toISOString();

        const [
          jobsRes,
          threadsRes,
          leadsTodayRes,
          companiesTodayRes,
          peopleRes,
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
          supabase.from('people').select('id, people_stage'),
        ]);

        console.log('Dashboard data:', {
          jobsError: jobsRes.error,
          threadsError: threadsRes.error,
          jobsCount: jobsRes.data?.length,
          threadsCount: threadsRes.data?.length,
        });

        if (
          jobsRes.error ||
          threadsRes.error ||
          leadsTodayRes.error ||
          companiesTodayRes.error ||
          peopleRes.error
        ) {
          console.error('Dashboard errors:', {
            jobs: jobsRes.error,
            threads: threadsRes.error,
            leads: leadsTodayRes.error,
            companies: companiesTodayRes.error,
            people: peopleRes.error,
          });
          throw new Error('Failed to load dashboard data');
        }

        // Transform the jobs data to flatten the companies array if present
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
        setJobsToReview((transformedJobs as Job[]) || []);
        setEmailReplies((threadsRes.data as EmailThread[]) || []);
        setNewLeadsToday(leadsTodayRes.data?.length || 0);
        setNewCompaniesToday(companiesTodayRes.data?.length || 0);

        const people =
          (peopleRes.data as Array<{ id: string; people_stage: string }>) || [];
        setPipeline({
          new: people.filter(
            p => p.people_stage === 'new' || p.people_stage === 'new_lead'
          ).length,
          qualified: people.filter(p => p.people_stage === 'qualified').length,
          proceed: people.filter(p => p.people_stage === 'proceed').length,
          total: people.length,
        });
      } catch (e) {
        console.error('Dashboard load error:', e);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleJobClick = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobSlideOutOpen(true);
  }, []);

  const handleEmailClick = useCallback(
    (threadId: string) => {
      navigate(`/crm/communications?thread=${threadId}`);
    },
    [navigate]
  );

  // Dynamic greeting based on time of day
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Page title='Dashboard' hideHeader allowScroll>
      <div className='space-y-6 pb-8'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            {greeting()}
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Here's what's happening with your pipeline today
          </p>
          {error && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
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

        {/* Lists */}
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
          <Card className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold tracking-tight text-foreground'>
                Jobs to Review
              </h3>
              <button
                onClick={() => navigate('/jobs')}
                className='text-xs text-primary hover:text-primary/80 transition-colors'
              >
                See all
              </button>
            </div>
            {jobsToReview.length > 0 && (
              <div className='overflow-x-auto'>
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
                onClick={() => navigate('/crm/communications')}
                className='text-xs text-muted-foreground hover:text-foreground transition-colors'
              >
                Open inbox
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

        {/* Pipeline snapshot */}
        <div>
          <h3 className='text-base font-semibold tracking-tight text-foreground mb-4'>
            Pipeline Overview
          </h3>
          <div className='grid gap-3 grid-cols-2 lg:grid-cols-4'>
            <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/5 via-blue-50/30 to-blue-500/10 p-4 backdrop-blur-sm shadow-sm'>
              <p className='text-xs font-medium text-muted-foreground mb-1.5'>
                New
              </p>
              <p className='text-2xl font-bold tracking-tight text-foreground'>
                {pipeline.new}
              </p>
            </div>
            <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4 backdrop-blur-sm shadow-sm'>
              <p className='text-xs font-medium text-muted-foreground mb-1.5'>
                Qualified
              </p>
              <p className='text-2xl font-bold tracking-tight text-foreground'>
                {pipeline.qualified}
              </p>
            </div>
            <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/5 via-emerald-50/30 to-emerald-500/10 p-4 backdrop-blur-sm shadow-sm'>
              <p className='text-xs font-medium text-muted-foreground mb-1.5'>
                Proceed
              </p>
              <p className='text-2xl font-bold tracking-tight text-foreground'>
                {pipeline.proceed}
              </p>
            </div>
            <div className='relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-gray-500/5 via-gray-50/30 to-gray-500/10 p-4 backdrop-blur-sm shadow-sm'>
              <p className='text-xs font-medium text-muted-foreground mb-1.5'>
                Total
              </p>
              <p className='text-2xl font-bold tracking-tight text-foreground'>
                {pipeline.total}
              </p>
            </div>
          </div>
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
    </Page>
  );
}
