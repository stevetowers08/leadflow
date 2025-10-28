/**
 * Modern Dashboard Page - Lead Generation CRM Morning View
 *
 * Features:
 * - Personalised welcome message with time-based greeting
 * - Today-focused metrics (new jobs, automated jobs, lead activity)
 * - Quick action cards for daily tasks
 * - Recent leads and companies added today
 * - Clean, actionable morning view design
 */

import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
import { Page } from '@/design-system/components';
import { supabase } from '@/integrations/supabase/client';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  PieChart,
  Sparkles,
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
  created_at: string;
  logo_url?: string;
  companies?: {
    id: string;
    name: string;
    industry: string;
    logo_url?: string;
  };
}

interface Company {
  id: string;
  name: string;
  industry: string;
  created_at: string;
  logo_url?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
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

  // Slide-out state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isJobSlideOutOpen, setIsJobSlideOutOpen] = useState(false);
  const [isCompanySlideOutOpen, setIsCompanySlideOutOpen] = useState(false);

  // Memoized greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Memoized click handler - open slide-outs
  const handleItemClick = useCallback(
    (item: Job | Company, type: 'job' | 'company' | 'person') => {
      if (type === 'job') {
        setSelectedJobId(item.id);
        setIsJobSlideOutOpen(true);
      } else if (type === 'company') {
        setSelectedCompanyId(item.id);
        setIsCompanySlideOutOpen(true);
      } else if (type === 'person') {
        // Future: add person slide-out
        navigate(`/people/${item.id}`);
      }
    },
    [navigate]
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

        // Skip RPC call (function doesn't exist) and use individual queries
        await fetchIndividualQueries(today, todayEnd);
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
            created_at,
            logo_url,
            companies!jobs_company_id_fkey(
              id,
              name,
              industry,
              logo_url
            )
          `
            )
            .gte('created_at', today)
            .lt('created_at', todayEnd),

          supabase
            .from('people')
            .select('id, created_at')
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
            logo_url
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
        automatedJobs: 0, // LinkedIn automation removed
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
            created_at,
            logo_url,
            companies!jobs_company_id_fkey(
              id,
              name,
              industry,
              logo_url
            )
          `
          )
          .order('created_at', { ascending: false })
          .limit(10);

        // Get recent companies (last 7 days)
        const { data: recentCompanies } = await supabase
          .from('companies')
          .select('id, name, industry, created_at, logo_url')
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

        // LinkedIn automation removed - set to 0
        const automatedJobs = { data: [] };

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
    <Page title='Dashboard' hideHeader allowScroll>
      <div className='space-y-6 overflow-y-auto pb-8'>
        {/* Welcome Header */}
        <div className='mb-4'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            {greeting}, Welcome Back!
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Here's what's happening with your leads today
          </p>
          {error && (
            <div className='mt-2 p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <Target className='h-5 w-5 text-blue-600' />
              <span className='text-2xl font-bold text-gray-900'>
                {isLoadingTodaysData ? '...' : todaysData.newJobsToday}
              </span>
            </div>
            <p className='text-sm text-gray-600'>Recent Jobs</p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <Zap className='h-5 w-5 text-purple-600' />
              <span className='text-2xl font-bold text-gray-900'>
                {isLoadingTodaysData ? '...' : todaysData.automatedJobs}
              </span>
            </div>
            <p className='text-sm text-gray-600'>Automated Jobs</p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <Users className='h-5 w-5 text-green-600' />
              <span className='text-2xl font-bold text-gray-900'>
                {isLoadingTodaysData ? '...' : todaysData.newLeadsToday}
              </span>
            </div>
            <p className='text-sm text-gray-600'>Recent Leads</p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <MessageSquare className='h-5 w-5 text-orange-600' />
              <span className='text-2xl font-bold text-gray-900'>
                {isLoadingTodaysData ? '...' : todaysData.pendingFollowUps}
              </span>
            </div>
            <p className='text-sm text-gray-600'>Pending Follow-ups</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
          {/* Recent Jobs */}
          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-foreground'>
                Recent Jobs
              </h3>
              <button
                onClick={() => navigate('/jobs')}
                className='text-sm font-medium text-primary hover:underline'
              >
                View all
              </button>
            </div>
            <div className='space-y-3'>
              {todaysJobs.slice(0, 4).map((job, index) => (
                <div
                  key={job.id || index}
                  onClick={() => handleItemClick(job, 'job')}
                  className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer'
                >
                  <div className='flex-shrink-0'>
                    {job.logo_url || job.companies?.logo_url ? (
                      <img
                        src={job.logo_url || job.companies?.logo_url}
                        alt=''
                        className='w-10 h-10 rounded-lg object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center'>
                        <Target className='h-5 w-5 text-gray-400' />
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-medium text-sm text-gray-900 line-clamp-1'>
                      {job.title || 'Untitled Job'}
                    </h4>
                    <p className='text-xs text-gray-600 line-clamp-1'>
                      {job.companies?.name || 'Unknown Company'}
                      {job.companies?.industry
                        ? ` • ${job.companies.industry}`
                        : ''}
                    </p>
                  </div>
                  <span className='px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200'>
                    New
                  </span>
                </div>
              ))}
              {todaysJobs.length === 0 && (
                <div className='text-xs text-gray-500'>
                  No recent jobs found.
                </div>
              )}
            </div>
          </div>

          {/* Recent Companies */}
          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-foreground'>
                Recent Companies
              </h3>
              <button
                onClick={() => navigate('/companies')}
                className='text-sm font-medium text-primary hover:underline'
              >
                View all
              </button>
            </div>
            <div className='space-y-3'>
              {todaysCompanies.slice(0, 4).map((company, index) => (
                <div
                  key={company.id || index}
                  onClick={() => handleItemClick(company, 'company')}
                  className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer'
                >
                  <div className='flex-shrink-0'>
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt=''
                        className='w-10 h-10 rounded-lg object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center'>
                        <Users className='h-5 w-5 text-gray-400' />
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-medium text-sm text-gray-900 line-clamp-1'>
                      {company.name || 'Untitled Company'}
                    </h4>
                    <p className='text-xs text-gray-600 line-clamp-1'>
                      {company.industry || 'Unknown Industry'}
                    </p>
                  </div>
                  <span className='px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200'>
                    New
                  </span>
                </div>
              ))}
              {todaysCompanies.length === 0 && (
                <div className='text-xs text-gray-500'>
                  No recent companies found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <MessageSquare className='h-5 w-5 text-blue-600' />
              <span className='text-2xl font-bold text-gray-900'>0</span>
            </div>
            <p className='text-sm text-gray-600'>Emails Sent</p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <TrendingUp className='h-5 w-5 text-green-600' />
              <span className='text-2xl font-bold text-gray-900'>0%</span>
            </div>
            <p className='text-sm text-gray-600'>Response Rate</p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <Calendar className='h-5 w-5 text-purple-600' />
              <span className='text-2xl font-bold text-gray-900'>0</span>
            </div>
            <p className='text-sm text-gray-600'>Meetings Booked</p>
          </div>
        </div>

        {/* Modern CRM Cards - 2025 Design Collection */}
        <div className='space-y-6 mt-8'>
          <h2 className='text-xl font-bold tracking-tight text-foreground'>
            Insights & Analytics
          </h2>

          {/* Row 1: Salesforce-Inspired Metric Cards */}
          <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
            {/* Salesforce Card: Classic Dashboard Tile */}
            <div className='group relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-colors' />
              <div className='relative'>
                <div className='flex items-center justify-between mb-2'>
                  <Target className='h-5 w-5 text-blue-600' />
                  <span className='text-xs font-medium text-emerald-600'>
                    +12%
                  </span>
                </div>
                <p className='text-3xl font-bold text-gray-900 mb-1'>$245K</p>
                <p className='text-xs text-gray-500'>Pipeline Value</p>
                <div className='mt-3 h-1 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-blue-500 to-blue-600'
                    style={{ width: '68%' }}
                  />
                </div>
              </div>
            </div>

            {/* HubSpot Card: Modern Minimalist */}
            <div className='group relative bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 overflow-hidden'>
              <div className='absolute top-0 right-0 w-20 h-20 bg-purple-100/30 rounded-full blur-2xl' />
              <div className='relative'>
                <div className='flex items-center justify-between mb-2'>
                  <Users className='h-5 w-5 text-purple-600' />
                  <CheckCircle className='h-4 w-4 text-emerald-500' />
                </div>
                <p className='text-3xl font-bold text-gray-900 mb-1'>2.4K</p>
                <p className='text-xs text-gray-500'>Total Leads</p>
                <div className='mt-3 flex items-center gap-1 text-xs'>
                  <TrendingUp className='h-3 w-3 text-emerald-600' />
                  <span className='text-emerald-600 font-medium'>
                    +234 this month
                  </span>
                </div>
              </div>
            </div>

            {/* Pipedrive Card: Interactive Stat */}
            <div className='group relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-200 overflow-hidden'>
              <div className='relative'>
                <div className='flex items-center justify-between mb-2'>
                  <TrendingUp className='h-5 w-5 text-purple-600' />
                  <span className='text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium'>
                    Hot
                  </span>
                </div>
                <p className='text-3xl font-bold text-gray-900 mb-1'>68%</p>
                <p className='text-xs text-gray-500'>Conversion Rate</p>
                <div className='mt-3 flex gap-1'>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-purple-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Zoho Card: Data Rich */}
            <div className='group relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 overflow-hidden'>
              <div className='relative'>
                <div className='flex items-center justify-between mb-2'>
                  <BarChart3 className='h-5 w-5 text-orange-600' />
                  <Clock className='h-4 w-4 text-gray-400' />
                </div>
                <p className='text-3xl font-bold text-gray-900 mb-1'>1.2K</p>
                <p className='text-xs text-gray-500'>Activities Today</p>
                <div className='mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-orange-400 to-pink-400'
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Advanced Analytics Cards */}
          <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
            {/* Card: AI-Powered Insights (Freshsales Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl' />
              <div className='relative'>
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                      AI Insights
                      <span className='text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium'>
                        Beta
                      </span>
                    </h3>
                    <p className='text-xs text-gray-500'>
                      Predictive lead scoring
                    </p>
                  </div>
                  <div className='p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl'>
                    <Sparkles className='h-6 w-6 text-blue-600' />
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-red-500' />
                      <span className='text-sm font-medium text-gray-900'>
                        High Priority
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>
                      24 leads
                    </span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-orange-50/50 border border-orange-100 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-orange-500' />
                      <span className='text-sm font-medium text-gray-900'>
                        Medium Priority
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>
                      156 leads
                    </span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-blue-500' />
                      <span className='text-sm font-medium text-gray-900'>
                        Low Priority
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>
                      342 leads
                    </span>
                  </div>
                </div>

                <button className='mt-4 w-full text-xs font-medium text-center text-blue-600 hover:text-blue-700 py-2.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors'>
                  View AI Dashboard →
                </button>
              </div>
            </div>

            {/* Card: Lead Sources Visualization (Geckoboard Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Lead Sources
                  </h3>
                  <p className='text-xs text-gray-500'>
                    This month's distribution
                  </p>
                </div>
                <Activity className='h-5 w-5 text-purple-600' />
              </div>

              <div className='space-y-3'>
                {[
                  { name: 'LinkedIn', value: 78, color: 'bg-blue-500' },
                  { name: 'Email', value: 65, color: 'bg-purple-500' },
                  { name: 'Website', value: 45, color: 'bg-pink-500' },
                  { name: 'Referrals', value: 32, color: 'bg-emerald-500' },
                  { name: 'Events', value: 18, color: 'bg-orange-500' },
                ].map(source => (
                  <div key={source.name} className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-700'>{source.name}</span>
                      <span className='font-semibold text-gray-900'>
                        {source.value}%
                      </span>
                    </div>
                    <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                      <div
                        className={`h-full ${source.color} rounded-full transition-all duration-500`}
                        style={{ width: `${source.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className='mt-4 w-full text-xs font-medium text-center text-purple-600 hover:text-purple-700 py-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors'>
                View Analytics →
              </button>
            </div>
          </div>

          {/* Row 3: Team & Performance Cards */}
          <div className='grid gap-6 grid-cols-1 lg:grid-cols-3'>
            {/* Card: Team Performance (Insightly Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center'>
                  <Users className='h-5 w-5 text-blue-600' />
                </div>
                <h3 className='font-semibold text-gray-900'>Team Activity</h3>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between py-2'>
                  <span className='text-sm text-gray-600'>Active Members</span>
                  <span className='text-sm font-bold text-gray-900'>12</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span className='text-sm text-gray-600'>Tasks Completed</span>
                  <span className='text-sm font-bold text-gray-900'>89</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span className='text-sm text-gray-600'>Response Rate</span>
                  <span className='text-sm font-bold text-emerald-600'>
                    95%
                  </span>
                </div>
              </div>

              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <CheckCircle className='h-4 w-4 text-emerald-500' />
                  <span>All systems operational</span>
                </div>
              </div>
            </div>

            {/* Card: Quick Actions (Notion Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-10 w-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center'>
                  <Zap className='h-5 w-5 text-purple-600' />
                </div>
                <h3 className='font-semibold text-gray-900'>Quick Actions</h3>
              </div>

              <div className='space-y-2'>
                <button className='w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-2 group'>
                  <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                  <span className='group-hover:font-medium'>
                    Review new jobs
                  </span>
                </button>
                <button className='w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-2 group'>
                  <span className='w-1.5 h-1.5 bg-blue-500 rounded-full' />
                  <span className='group-hover:font-medium'>
                    Contact hot leads
                  </span>
                </button>
                <button className='w-full text-left px-3 py-2.5 hover:bg-emerald-50 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-2 group'>
                  <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full' />
                  <span className='group-hover:font-medium'>
                    Update pipeline
                  </span>
                </button>
              </div>
            </div>

            {/* Card: Status Tags (Copper Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-10 w-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center'>
                  <Award className='h-5 w-5 text-emerald-600' />
                </div>
                <h3 className='font-semibold text-gray-900'>Top Statuses</h3>
              </div>

              <div className='flex flex-wrap gap-2'>
                <span className='px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100'>
                  Qualified
                </span>
                <span className='px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100'>
                  Proceed
                </span>
                <span className='px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100'>
                  Hot Lead
                </span>
                <span className='px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium border border-orange-100'>
                  New
                </span>
                <span className='px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium border border-pink-100'>
                  Follow-up
                </span>
                <span className='px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100'>
                  Proposal
                </span>
              </div>

              <div className='mt-4 flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Total Statuses</span>
                <span className='font-semibold text-gray-900'>6 Active</span>
              </div>
            </div>
          </div>

          {/* Row 4: Detailed Analytics Cards */}
          <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
            {/* Card: Communications Timeline (OnePageCRM Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Activity Timeline
                </h3>
                <MessageSquare className='h-5 w-5 text-blue-600' />
              </div>

              <div className='space-y-4'>
                {[
                  {
                    icon: <FileText className='h-4 w-4 text-blue-600' />,
                    action: 'Created job listing',
                    entity: 'Senior Developer at TechCorp',
                    time: '5m ago',
                    color: 'bg-blue-500',
                  },
                  {
                    icon: <Users className='h-4 w-4 text-purple-600' />,
                    action: 'Added new lead',
                    entity: 'Sarah Johnson',
                    time: '1h ago',
                    color: 'bg-purple-500',
                  },
                  {
                    icon: <DollarSign className='h-4 w-4 text-emerald-600' />,
                    action: 'Qualified deal',
                    entity: 'TechStart Consulting',
                    time: '3h ago',
                    color: 'bg-emerald-500',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className='relative flex items-start gap-3 pb-4 last:pb-0'
                  >
                    {idx < 2 && (
                      <div className='absolute left-[18px] top-6 bottom-0 w-0.5 bg-gray-100' />
                    )}
                    <div
                      className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full ${item.color} shadow-sm`}
                    >
                      <div className='text-white'>{item.icon}</div>
                    </div>
                    <div className='flex-1 min-w-0 pt-0.5'>
                      <p className='text-sm font-medium text-gray-900'>
                        {item.action}
                      </p>
                      <p className='text-xs text-gray-500 mt-0.5'>
                        {item.entity}
                      </p>
                      <span className='text-xs text-gray-500 mt-1 inline-block'>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className='mt-4 w-full text-xs font-medium text-center text-blue-600 hover:text-blue-700 py-2.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors'>
                View Full Timeline →
              </button>
            </div>

            {/* Card: Sales Forecast (Pipedrive Pipeline Style) */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Sales Forecast
                  </h3>
                  <p className='text-xs text-gray-500'>Next 30 days</p>
                </div>
                <PieChart className='h-5 w-5 text-purple-600' />
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-lg'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Qualified Leads
                    </p>
                    <p className='text-xs text-gray-500'>
                      High conversion potential
                    </p>
                  </div>
                  <span className='text-xl font-bold text-blue-600'>142</span>
                </div>
                <div className='flex items-center justify-between p-3 bg-purple-50/50 border border-purple-100 rounded-lg'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      In Progress
                    </p>
                    <p className='text-xs text-gray-500'>
                      Active conversations
                    </p>
                  </div>
                  <span className='text-xl font-bold text-purple-600'>89</span>
                </div>
                <div className='flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Closed This Month
                    </p>
                    <p className='text-xs text-gray-500'>Successful deals</p>
                  </div>
                  <span className='text-xl font-bold text-emerald-600'>34</span>
                </div>
              </div>

              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Projected Revenue
                  </span>
                  <span className='text-lg font-bold text-gray-900'>
                    $89.2K
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Additional Modern Cards */}
          <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
            {/* Card: Minimalist Metric 1 */}
            <div className='bg-white border border-gray-100 rounded-lg p-5 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer'>
              <div className='flex items-center gap-2 mb-3'>
                <Target className='h-4 w-4 text-purple-600' />
                <span className='text-xs text-gray-500'>Active Jobs</span>
              </div>
              <p className='text-3xl font-bold text-gray-900'>142</p>
              <div className='mt-3 h-1 bg-gray-100 rounded-full'>
                <div
                  className='h-full bg-purple-500'
                  style={{ width: '71%' }}
                />
              </div>
            </div>

            {/* Card: Minimalist Metric 2 */}
            <div className='bg-white border border-gray-100 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer'>
              <div className='flex items-center gap-2 mb-3'>
                <Clock className='h-4 w-4 text-blue-600' />
                <span className='text-xs text-gray-500'>Avg. Response</span>
              </div>
              <p className='text-3xl font-bold text-gray-900'>2.4h</p>
              <div className='mt-3 flex items-center gap-1 text-xs text-emerald-600'>
                <TrendingUp className='h-3 w-3' />
                <span>Fastest this month</span>
              </div>
            </div>

            {/* Card: Minimalist Metric 3 */}
            <div className='bg-white border border-gray-100 rounded-lg p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer'>
              <div className='flex items-center gap-2 mb-3'>
                <Calendar className='h-4 w-4 text-emerald-600' />
                <span className='text-xs text-gray-500'>Meetings</span>
              </div>
              <p className='text-3xl font-bold text-gray-900'>24</p>
              <div className='mt-3 text-xs text-gray-600'>
                <span>8 scheduled today</span>
              </div>
            </div>

            {/* Card: Minimalist Metric 4 */}
            <div className='bg-white border border-gray-100 rounded-lg p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer'>
              <div className='flex items-center gap-2 mb-3'>
                <Bell className='h-4 w-4 text-orange-600' />
                <span className='text-xs text-gray-500'>Notifications</span>
              </div>
              <p className='text-3xl font-bold text-gray-900'>12</p>
              <div className='mt-3 flex items-center gap-2'>
                <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
                <span className='text-xs text-gray-600'>3 unread</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-outs */}
      <JobDetailsSlideOut
        jobId={selectedJobId}
        isOpen={isJobSlideOutOpen}
        onClose={() => {
          setIsJobSlideOutOpen(false);
          setSelectedJobId(null);
        }}
      />

      <CompanyDetailsSlideOut
        companyId={selectedCompanyId}
        isOpen={isCompanySlideOutOpen}
        onClose={() => {
          setIsCompanySlideOutOpen(false);
          setSelectedCompanyId(null);
        }}
      />
    </Page>
  );
}
