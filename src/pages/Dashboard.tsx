/**
 * Modern Dashboard Page - Lead Generation CRM Morning View
 *
 * Features:
 * - Personalized welcome message with time-based greeting
 * - Today-focused metrics (new jobs, automated jobs, lead activity)
 * - Quick action cards for daily tasks
 * - Recent leads and companies added today
 * - Clean, actionable morning view design
 */

import { ListCard, MetricCard, ModernCard } from '@/components/ui/modern-cards';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { useReportingData } from '@/hooks/useReportingData';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define proper TypeScript interfaces
interface TodaysData {
  newJobsToday: number;
  newLeadsToday: number;
  newCompaniesToday: number;
  automatedJobs: number;
  pendingFollowUps: number;
}

interface Job {
  id: string;
  title: string;
  automation_active: boolean;
  created_at: string;
  logo?: string;
  companies?: {
    id: string;
    name: string;
    industry: string;
    profile_image_url?: string;
  };
}

interface Company {
  id: string;
  name: string;
  industry: string;
  created_at: string;
  profile_image_url?: string;
}

export default function Dashboard() {
  const { data, isLoading } = useReportingData();
  const navigate = useNavigate();
  const { openPopup } = usePopupNavigation();
  const [todaysData, setTodaysData] = useState<TodaysData>({
    newJobsToday: 0,
    newLeadsToday: 0,
    newCompaniesToday: 0,
    automatedJobs: 0,
    pendingFollowUps: 0,
  });
  const [todaysJobs, setTodaysJobs] = useState<Job[]>([]);
  const [todaysCompanies, setTodaysCompanies] = useState<Company[]>([]);
  const [isLoadingTodaysData, setIsLoadingTodaysData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Memoized click handler
  const handleItemClick = useCallback(
    (item: Job | Company, type: 'job' | 'company' | 'person') => {
      if (type === 'job') {
        openPopup('job', item.id, (item as Job).title);
      } else if (type === 'company') {
        openPopup('company', item.id, (item as Company).name);
      } else if (type === 'person') {
        openPopup('lead', item.id, (item as Company).name);
      }
    },
    [openPopup]
  );

  // Optimized data fetching with single query
  useEffect(() => {
    const fetchTodaysData = async () => {
      try {
        setIsLoadingTodaysData(true);
        setError(null);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const todayEnd = `${today}T23:59:59.999Z`;

        // Single optimized query using RPC function for better performance
        const { data: dashboardData, error: dashboardError } =
          await supabase.rpc('get_dashboard_data', {
            start_date: today,
            end_date: todayEnd,
          });

        if (dashboardError) {
          console.error('Dashboard RPC error:', dashboardError);
          // Fallback to individual queries if RPC fails
          await fetchIndividualQueries(today, todayEnd);
        } else if (dashboardData && dashboardData[0]) {
          // Process the combined data
          const processedData = dashboardData[0];
          setTodaysData({
            newJobsToday: processedData.new_jobs_today || 0,
            newLeadsToday: processedData.new_leads_today || 0,
            newCompaniesToday: processedData.new_companies_today || 0,
            automatedJobs: processedData.automated_jobs || 0,
            pendingFollowUps: processedData.pending_follow_ups || 0,
          });
          setTodaysJobs(processedData.todays_jobs || []);
          setTodaysCompanies(processedData.todays_companies || []);
        } else {
          // If no data for today, fetch recent data instead
          await fetchRecentData();
        }
      } catch (error) {
        console.error("Error fetching today's data:", error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoadingTodaysData(false);
      }
    };

    // Fallback function for individual queries
    const fetchIndividualQueries = async (today: string, todayEnd: string) => {
      const [jobsResult, peopleResult, companiesResult, interactionsResult] =
        await Promise.all([
          supabase
            .from('jobs')
            .select(
              `
            id, 
            title,
            automation_active, 
            created_at,
            logo,
            companies!left(
              id,
              name,
              industry,
              profile_image_url
            )
          `
            )
            .gte('created_at', today)
            .lt('created_at', todayEnd),

          supabase
            .from('people')
            .select('id, automation_started_at, created_at')
            .gte('created_at', today)
            .lt('created_at', todayEnd),

          supabase
            .from('companies')
            .select(
              `
            id, 
            name,
            industry,
            created_at,
            profile_image_url
          `
            )
            .gte('created_at', today)
            .lt('created_at', todayEnd),

          supabase
            .from('interactions')
            .select('id, interaction_type, created_at')
            .gte('created_at', today)
            .lt('created_at', todayEnd),
        ]);

      if (
        jobsResult.error ||
        peopleResult.error ||
        companiesResult.error ||
        interactionsResult.error
      ) {
        throw new Error('Failed to fetch individual queries');
      }

      setTodaysData({
        newJobsToday: jobsResult.data?.length || 0,
        newLeadsToday: peopleResult.data?.length || 0,
        newCompaniesToday: companiesResult.data?.length || 0,
        automatedJobs:
          jobsResult.data?.filter(job => job.automation_active).length || 0,
        pendingFollowUps:
          interactionsResult.data?.filter(
            i => i.interaction_type === 'linkedin_connection_request_sent'
          ).length || 0,
      });

      setTodaysJobs(jobsResult.data || []);
      setTodaysCompanies(companiesResult.data || []);
    };

    // Function to fetch recent data when no today's data exists
    const fetchRecentData = async () => {
      try {
        // Get recent jobs (last 7 days)
        const { data: recentJobs } = await supabase
          .from('jobs')
          .select(
            `
            id, 
            title,
            automation_active, 
            created_at,
            logo,
            companies!left(
              id,
              name,
              industry,
              profile_image_url
            )
          `
          )
          .order('created_at', { ascending: false })
          .limit(10);

        // Get recent companies (last 7 days)
        const { data: recentCompanies } = await supabase
          .from('companies')
          .select('id, name, industry, created_at, profile_image_url')
          .order('created_at', { ascending: false })
          .limit(10);

        // Get recent people (last 7 days)
        const { data: recentPeople } = await supabase
          .from('people')
          .select('id, created_at')
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        // Get automated jobs count
        const { data: automatedJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('automation_active', true)
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        // Get pending follow-ups
        const { data: followUps } = await supabase
          .from('interactions')
          .select('id')
          .eq('interaction_type', 'linkedin_connection_request_sent')
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        setTodaysData({
          newJobsToday: recentJobs?.length || 0,
          newLeadsToday: recentPeople?.length || 0,
          newCompaniesToday: recentCompanies?.length || 0,
          automatedJobs: automatedJobs?.length || 0,
          pendingFollowUps: followUps?.length || 0,
        });

        setTodaysJobs(recentJobs || []);
        setTodaysCompanies(recentCompanies || []);
      } catch (error) {
        console.error('Error fetching recent data:', error);
        setError('Failed to load recent data');
      }
    };

    fetchTodaysData();
  }, []);

  return (
    <>
      {/* Full-screen background */}
      <div className='fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10' />

      {/* Content with negative margins to break out of Layout padding - FULL WIDTH */}
      <div className='relative min-h-screen -mx-4 -my-4 lg:-mx-6 lg:-my-6'>
        <div className='space-y-6 w-full px-4 py-6 lg:px-6'>
          {/* Welcome Header */}
          <div className='mb-8'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground mb-2'>
              {greeting}, Welcome Back!
            </h1>
            <p className='text-gray-600'>
              Here's what's happening with your leads today
            </p>
            {error && (
              <div className='mt-2 p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}
          </div>

          {/* Key Metrics - Ultra-Modern Minimal Design */}
          <div className='grid gap-6 grid-cols-2 lg:grid-cols-4'>
            <MetricCard
              title='Recent Jobs'
              value={isLoadingTodaysData ? '...' : todaysData.newJobsToday}
              icon={Target}
              variant='minimal'
            />

            <MetricCard
              title='Automated Jobs'
              value={isLoadingTodaysData ? '...' : todaysData.automatedJobs}
              icon={Zap}
              variant='minimal'
            />

            <MetricCard
              title='Recent Leads'
              value={isLoadingTodaysData ? '...' : todaysData.newLeadsToday}
              icon={Users}
              variant='minimal'
            />

            <MetricCard
              title='Pending Follow-ups'
              value={isLoadingTodaysData ? '...' : todaysData.pendingFollowUps}
              icon={MessageSquare}
              variant='minimal'
            />
          </div>

          {/* Quick Actions - Clean Minimal Design */}
          <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
            {/* Recent Jobs - small cards list */}
            <ModernCard variant='minimal' className='p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold text-gray-900'>
                  Recent Jobs
                </h3>
                <button
                  onClick={() => navigate('/jobs')}
                  className='text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200'
                >
                  View all
                </button>
              </div>
              <div className='space-y-2.5'>
                {todaysJobs.slice(0, 4).map((job, index) => (
                  <ListCard
                    key={job.id || index}
                    title={job.title || 'Untitled Job'}
                    subtitle={`${job.companies?.name || 'Unknown Company'}${job.companies?.industry ? ` • ${job.companies.industry}` : ''}`}
                    logo={job.logo || job.companies?.profile_image_url}
                    onClick={() => handleItemClick(job, 'job')}
                    variant='minimal'
                    badge={
                      <span className='px-2 py-0.5 rounded-md text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200'>
                        New
                      </span>
                    }
                  />
                ))}
                {todaysJobs.length === 0 && (
                  <div className='text-xs text-gray-500'>
                    No recent jobs found.
                  </div>
                )}
              </div>
            </ModernCard>

            {/* Recent Companies - matching recent jobs layout */}
            <ModernCard variant='minimal' className='p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold text-gray-900'>
                  Recent Companies
                </h3>
                <button
                  onClick={() => navigate('/companies')}
                  className='text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200'
                >
                  View all
                </button>
              </div>
              <div className='space-y-2.5'>
                {todaysCompanies.slice(0, 4).map((company, index) => (
                  <ListCard
                    key={company.id || index}
                    title={company.name || 'Untitled Company'}
                    subtitle={company.industry || 'Unknown Industry'}
                    logo={company.profile_image_url}
                    onClick={() => handleItemClick(company, 'company')}
                    variant='minimal'
                    badge={
                      <span className='px-2 py-0.5 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200'>
                        New
                      </span>
                    }
                  />
                ))}
                {todaysCompanies.length === 0 && (
                  <div className='text-xs text-gray-500'>
                    No recent companies found.
                  </div>
                )}
              </div>
            </ModernCard>
          </div>

          {/* Activity Summary - Clean Minimal Design */}
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <MetricCard
              title='Emails Sent'
              value='0'
              icon={MessageSquare}
              variant='minimal'
            />

            <MetricCard
              title='Response Rate'
              value='0%'
              icon={TrendingUp}
              variant='minimal'
            />

            <MetricCard
              title='Meetings Booked'
              value='0'
              icon={Calendar}
              variant='minimal'
            />
          </div>
        </div>
      </div>
    </>
  );
}
