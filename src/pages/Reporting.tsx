/**
 * Modern Reporting Page - Real Data Integration
 *
 * Features:
 * - Tabbed interface for Jobs Discovery, Leads, and Emails
 * - Real data from database tables
 * - Dynamic metrics and analytics with charts
 * - Modern design aligned with app patterns
 * - Focus on actual metrics that matter
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Page } from '@/design-system/components';
import { useReportingData } from '@/hooks/useReportingData';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Mail,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Client-side mount guard wrapper
const Reporting: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading reporting...</p>
        </div>
      </div>
    );
  }

  return <ReportingContent />;
};

function ReportingContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>(
    '30d'
  );
  const [activeTab, setActiveTab] = useState('jobs');

  const {
    data: reportingData,
    isLoading,
    error,
    refetch,
  } = useReportingData({
    filters: { period: selectedPeriod },
    refetchInterval: 5 * 60 * 1000,
  });

  // Email analytics data
  const { data: emailData, isLoading: emailLoading } = useQuery({
    queryKey: ['email-analytics', selectedPeriod],
    queryFn: async () => {
      const daysBack =
        selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const { data } = await supabase
        .from('email_sends')
        .select('status, sent_at')
        .gte('sent_at', startDate.toISOString());

      const statusCounts = { sent: 0, delivered: 0, failed: 0, bounced: 0 };
      data?.forEach(email => {
        statusCounts[email.status as keyof typeof statusCounts] =
          (statusCounts[email.status as keyof typeof statusCounts] || 0) + 1;
      });

      return {
        totalSent: data?.length || 0,
        statusCounts,
        deliveryRate: data?.length
          ? ((statusCounts.delivered / data.length) * 100).toFixed(1)
          : '0',
      };
    },
  });

  // Jobs data breakdown
  const jobsData = useMemo(() => {
    if (!reportingData) return null;

    const qualificationData = [
      {
        name: 'New',
        value: reportingData.jobQualification.new,
        color: '#8884d8',
      },
      {
        name: 'Qualify',
        value: reportingData.jobQualification.qualify,
        color: '#82ca9d',
      },
      {
        name: 'Skip',
        value: reportingData.jobQualification.skip,
        color: '#ffc658',
      },
    ];

    const seniorityData = reportingData.topJobFunctions.map((item, index) => ({
      name: item.function,
      count: item.count,
      color: index % 2 === 0 ? '#8884d8' : '#82ca9d',
    }));

    return { qualificationData, seniorityData };
  }, [reportingData]);

  // Leads data breakdown (companies + people)
  const leadsData = useMemo(() => {
    if (!reportingData) return null;

    const peopleData = [
      {
        name: 'New',
        value: reportingData.peoplePipeline.new,
        color: '#8884d8',
      },
      {
        name: 'Qualified',
        value: reportingData.peoplePipeline.qualified,
        color: '#82ca9d',
      },
      {
        name: 'Proceed',
        value: reportingData.peoplePipeline.proceed,
        color: '#8dd1e1',
      },
      {
        name: 'Skip',
        value: reportingData.peoplePipeline.skip,
        color: '#ffc658',
      },
    ];

    const pipelineData = [
      { stage: 'People', count: reportingData.totalPeople },
      { stage: 'Companies', count: reportingData.totalCompanies },
    ];

    return { peopleData, pipelineData };
  }, [reportingData]);

  const handleRefresh = () => {
    refetch();
  };

  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  if (error) {
    return (
      <Page title='Reporting' hideHeader>
        <div className='flex items-center justify-center min-h-[400px]'>
          <Card className='max-w-md'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <AlertCircle className='h-12 w-12 text-destructive mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Failed to Load Reporting Data
              </h3>
              <p className='text-gray-600 text-center mb-4'>
                There was an error loading the reporting data. Please try again.
              </p>
              <Button onClick={handleRefresh} variant='outline'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  const periodOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <Page title='Reporting' hideHeader>
      <div className='space-y-6'>
        {/* Period Selector */}
        <div className='flex items-center justify-end'>
          <div className='flex items-center gap-3'>
            <select
              value={selectedPeriod}
              onChange={e =>
                setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')
              }
              className='px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='flex space-x-8'>
            <TabsTrigger value='jobs' className='flex items-center gap-2'>
              <Briefcase className='h-4 w-4' />
              Jobs Discovery
            </TabsTrigger>
            <TabsTrigger value='leads' className='flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Leads
            </TabsTrigger>
            <TabsTrigger value='emails' className='flex items-center gap-2'>
              <Mail className='h-4 w-4' />
              Emails
            </TabsTrigger>
          </TabsList>

          {/* Jobs Discovery Tab */}
          <TabsContent value='jobs' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Jobs
                  </CardTitle>
                  <Briefcase className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.totalJobs.toLocaleString() || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {reportingData?.growthMetrics.jobsGrowth !== undefined
                      ? `${formatGrowthRate(reportingData.growthMetrics.jobsGrowth)} from last period`
                      : 'Loading...'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Qualified Jobs
                  </CardTitle>
                  <Target className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.qualifiedJobs.toLocaleString() || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {reportingData?.growthMetrics.qualificationRate !==
                    undefined
                      ? `${reportingData.growthMetrics.qualificationRate.toFixed(1)}% qualification rate`
                      : 'Loading...'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    New Jobs
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.jobQualification.new || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Awaiting qualification
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Skipped Jobs
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.jobQualification.skip || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Not pursuing
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Job Qualification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='h-80 flex items-center justify-center'>
                      <div className='animate-pulse text-muted-foreground'>
                        Loading chart...
                      </div>
                    </div>
                  ) : jobsData ? (
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={jobsData.qualificationData}
                          cx='50%'
                          cy='50%'
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill='#8884d8'
                          dataKey='value'
                        >
                          {jobsData.qualificationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='h-80 flex items-center justify-center text-muted-foreground'>
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Briefcase className='h-5 w-5' />
                    Top Job Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='h-80 flex items-center justify-center'>
                      <div className='animate-pulse text-muted-foreground'>
                        Loading chart...
                      </div>
                    </div>
                  ) : jobsData?.seniorityData.length ? (
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={jobsData.seniorityData.slice(0, 8)}>
                        <XAxis
                          dataKey='name'
                          angle={-45}
                          textAnchor='end'
                          height={100}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey='count' fill='#8884d8' />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='h-80 flex items-center justify-center text-muted-foreground'>
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Building2 className='h-5 w-5' />
                  Top Companies by Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {isLoading ? (
                    <div className='space-y-2'>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className='flex items-center justify-between'
                        >
                          <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                          <div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    reportingData?.topCompaniesByJobs
                      .slice(0, 10)
                      .map((item, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-2 hover:bg-gray-50 rounded'
                        >
                          <span className='text-sm font-medium'>
                            {item.companyName}
                          </span>
                          <Badge variant='secondary'>
                            {item.jobCount} jobs
                          </Badge>
                        </div>
                      )) || (
                      <div className='text-center py-4 text-gray-500'>
                        No company data available
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value='leads' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total People
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.totalPeople.toLocaleString() || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {reportingData?.growthMetrics.peopleGrowth !== undefined
                      ? `${formatGrowthRate(reportingData.growthMetrics.peopleGrowth)} from last period`
                      : 'Loading...'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Companies
                  </CardTitle>
                  <Building2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.totalCompanies.toLocaleString() || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {reportingData?.growthMetrics.companiesGrowth !== undefined
                      ? `${formatGrowthRate(reportingData.growthMetrics.companiesGrowth)} from last period`
                      : 'Loading...'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Qualified Leads
                  </CardTitle>
                  <Target className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.peoplePipeline.qualified || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Ready to proceed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    In Progress
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading
                      ? '...'
                      : reportingData?.peoplePipeline.proceed || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Actively pursuing
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5' />
                    People Pipeline Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='h-80 flex items-center justify-center'>
                      <div className='animate-pulse text-muted-foreground'>
                        Loading chart...
                      </div>
                    </div>
                  ) : leadsData ? (
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={leadsData.peopleData}
                          cx='50%'
                          cy='50%'
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill='#8884d8'
                          dataKey='value'
                        >
                          {leadsData.peopleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='h-80 flex items-center justify-center text-muted-foreground'>
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Building2 className='h-5 w-5' />
                    Leads Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='h-80 flex items-center justify-center'>
                      <div className='animate-pulse text-muted-foreground'>
                        Loading chart...
                      </div>
                    </div>
                  ) : leadsData?.pipelineData.length ? (
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={leadsData.pipelineData}>
                        <XAxis dataKey='stage' />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey='count' fill='#8884d8' />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='h-80 flex items-center justify-center text-muted-foreground'>
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Target className='h-5 w-5' />
                  Detailed Pipeline Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <h3 className='font-semibold'>People</h3>
                    {['new', 'qualified', 'proceed', 'skip'].map(stage => (
                      <div
                        key={stage}
                        className='flex items-center justify-between'
                      >
                        <span className='text-sm font-medium capitalize'>
                          {stage === 'qualified' ? 'Qualified' : stage}
                        </span>
                        <Badge variant='secondary'>
                          {isLoading
                            ? '...'
                            : reportingData?.peoplePipeline[
                                stage as keyof typeof reportingData.peoplePipeline
                              ] || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className='space-y-4'>
                    <h3 className='font-semibold'>Job Qualification</h3>
                    {['new', 'qualify', 'skip'].map(status => (
                      <div
                        key={status}
                        className='flex items-center justify-between'
                      >
                        <span className='text-sm font-medium capitalize'>
                          {status}
                        </span>
                        <Badge variant='secondary'>
                          {isLoading
                            ? '...'
                            : reportingData?.jobQualification[
                                status as keyof typeof reportingData.jobQualification
                              ] || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value='emails' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Sent
                  </CardTitle>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {emailLoading
                      ? '...'
                      : emailData?.totalSent.toLocaleString() || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Emails sent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Delivered
                  </CardTitle>
                  <Mail className='h-4 w-4 text-green-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-green-600'>
                    {emailLoading
                      ? '...'
                      : emailData?.statusCounts.delivered || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Successfully delivered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Delivery Rate
                  </CardTitle>
                  <Target className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {emailLoading ? '...' : emailData?.deliveryRate || 0}%
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Success rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Failed</CardTitle>
                  <AlertCircle className='h-4 w-4 text-red-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-red-600'>
                    {emailLoading ? '...' : emailData?.statusCounts.failed || 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Failed to send
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Email Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emailLoading ? (
                  <div className='h-80 flex items-center justify-center'>
                    <div className='animate-pulse text-muted-foreground'>
                      Loading chart...
                    </div>
                  </div>
                ) : emailData ? (
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart
                      data={[
                        {
                          name: 'Sent',
                          value: emailData.statusCounts.sent,
                          fill: '#8884d8',
                        },
                        {
                          name: 'Delivered',
                          value: emailData.statusCounts.delivered,
                          fill: '#82ca9d',
                        },
                        {
                          name: 'Failed',
                          value: emailData.statusCounts.failed,
                          fill: '#ff7c7c',
                        },
                        {
                          name: 'Bounced',
                          value: emailData.statusCounts.bounced,
                          fill: '#ffc658',
                        },
                      ]}
                    >
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='value' />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='h-80 flex items-center justify-center text-muted-foreground'>
                    No email data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className='border-dashed'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <TrendingUp className='h-12 w-12 text-gray-400 mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Advanced Email Analytics Coming Soon
                </h3>
                <p className='text-gray-600 text-center max-w-md'>
                  We&apos;re working on advanced email metrics including open
                  rates, click-through rates, reply tracking, and detailed
                  performance analytics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}

export default Reporting;
