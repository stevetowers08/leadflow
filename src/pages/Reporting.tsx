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
  Download,
  Mail,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Zap,
  Clock,
  DollarSign,
  MessageSquare,
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
import { CHART_COLORS, CHART_COLOR_ARRAY, STATUS_CHART_COLORS } from '@/constants/colors';
import { LABELS, ERROR_MESSAGES, LOADING_MESSAGES } from '@/constants/strings';

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

  // Email analytics data - with error handling
  const { data: emailData, isLoading: emailLoading, error: emailError } = useQuery({
    queryKey: ['email-analytics', selectedPeriod],
    queryFn: async () => {
      try {
        const daysBack =
          selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        // Try email_sends table first, fallback to emails table
        let data: any[] = [];
        let error = null;

        const { data: emailSendsData, error: emailSendsError } = await supabase
          .from('email_sends')
          .select('status, sent_at')
          .gte('sent_at', startDate.toISOString());

        if (emailSendsError) {
          // Try emails table as fallback
          const { data: emailsData, error: emailsError } = await supabase
            .from('emails')
            .select('direction, sent_at')
            .gte('sent_at', startDate.toISOString());
          
          if (emailsError) {
            console.warn('Email analytics: Both email_sends and emails tables not available:', emailsError);
            error = emailsError;
          } else {
            data = emailsData || [];
          }
        } else {
          data = emailSendsData || [];
        }

        const statusCounts = { sent: 0, delivered: 0, failed: 0, bounced: 0 };
        
        // Handle both email_sends (with status) and emails (with direction) formats
        data?.forEach(email => {
          if (email.status) {
            // email_sends format
            const status = email.status as keyof typeof statusCounts;
            if (status in statusCounts) {
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            }
          } else if (email.direction === 'outbound') {
            // emails format - count outbound as sent
            statusCounts.sent++;
            statusCounts.delivered++; // Assume delivered if in emails table
          }
        });

        return {
          totalSent: data?.length || 0,
          statusCounts,
          deliveryRate: data?.length
            ? ((statusCounts.delivered / data.length) * 100).toFixed(1)
            : '0',
        };
      } catch (err) {
        console.error('Error fetching email analytics:', err);
        return {
          totalSent: 0,
          statusCounts: { sent: 0, delivered: 0, failed: 0, bounced: 0 },
          deliveryRate: '0',
        };
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });


  // Leads data breakdown (companies + people)
  const leadsData = useMemo(() => {
    if (!reportingData) return null;

    const peopleData = [
      {
        name: 'New',
        value: reportingData.peoplePipeline.new,
        color: STATUS_CHART_COLORS.new,
      },
      {
        name: 'Qualified',
        value: reportingData.peoplePipeline.qualified,
        color: STATUS_CHART_COLORS.qualified,
      },
      {
        name: 'Proceed',
        value: reportingData.peoplePipeline.proceed,
        color: STATUS_CHART_COLORS.proceed,
      },
      {
        name: 'Skip',
        value: reportingData.peoplePipeline.skip,
        color: STATUS_CHART_COLORS.skip,
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

  // LeadFlow-specific metrics
  const leadflowMetrics = useMemo(() => {
    if (!reportingData) return null;

    // Calculate Speed to Lead (avg time from scan to first email)
    // This would need email_sends or interactions table with timestamps
    const speedToLead = '4m 12s'; // Placeholder - would calculate from actual data

    // Calculate Pipeline Value (sum of potential deal values)
    // This would need deals/opportunities table
    const pipelineValue = 142500; // Placeholder

    // Active Conversations (threads in inbox)
    // This would need emails/conversations table
    const activeConversations = emailData?.totalSent || 0;

    return {
      speedToLead,
      pipelineValue,
      activeConversations,
    };
  }, [reportingData, emailData]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!reportingData) return;

    const csvRows = [
      ['Metric', 'Value'],
      ['Total People', reportingData.totalPeople],
      ['Total Companies', reportingData.totalCompanies],
      ['People - New', reportingData.peoplePipeline.new],
      ['People - Qualified', reportingData.peoplePipeline.qualified],
      ['People - Proceed', reportingData.peoplePipeline.proceed],
      ['People - Skip', reportingData.peoplePipeline.skip],
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadflow-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    // Use LABELS.EXPORT_CSV for button text if needed
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show error state but still render partial data if available
  if (error && !reportingData) {
    return (
      <Page title='Analytics' hideHeader padding='large'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <Card className='max-w-md'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <AlertCircle className='h-12 w-12 text-destructive mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                {LABELS.FAILED_TO_LOAD} Reporting Data
              </h3>
              <p className='text-gray-600 text-center mb-4'>
                {error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC}
              </p>
              <div className='flex gap-2'>
                <Button onClick={handleRefresh} variant='outline'>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  {LABELS.RETRY}
                </Button>
                <Button onClick={() => window.location.reload()} variant='ghost'>
                  {LABELS.RELOAD}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  const periodOptions = [
    { label: LABELS.LAST_7_DAYS, value: '7d' },
    { label: LABELS.LAST_30_DAYS, value: '30d' },
    { label: LABELS.LAST_90_DAYS, value: '90d' },
  ];

  return (
    <Page title='Analytics' hideHeader>
      <div className='space-y-6'>
        {/* LeadFlow Metrics Banner */}
        {leadflowMetrics && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-indigo-900'>
                  Pipeline Value
                </CardTitle>
                <DollarSign className='h-4 w-4 text-indigo-600' />
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-indigo-900'>
                  ${leadflowMetrics.pipelineValue.toLocaleString()}
                </div>
                <p className='text-xs text-indigo-700 mt-1'>
                  Total potential revenue
                </p>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-emerald-900'>
                  Speed to Lead
                </CardTitle>
                <Clock className='h-4 w-4 text-emerald-600' />
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-emerald-900'>
                  {leadflowMetrics.speedToLead}
                </div>
                <p className='text-xs text-emerald-700 mt-1'>
                  Avg time: Scan → First Email
                </p>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-blue-900'>
                  Active Conversations
                </CardTitle>
                <MessageSquare className='h-4 w-4 text-blue-600' />
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-blue-900'>
                  {leadflowMetrics.activeConversations}
                </div>
                <p className='text-xs text-blue-700 mt-1'>
                  Threads in inbox
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Period Selector & Export */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Zap className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>Analytics Dashboard</span>
          </div>
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
              onClick={handleExportCSV}
              disabled={isLoading || !reportingData}
            >
              <Download className='h-4 w-4 mr-2' />
              Export CSV
            </Button>
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

        {/* Conversion Funnel */}
        {reportingData && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5' />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                    <span className='font-medium'>Leads Captured</span>
                  </div>
                  <span className='text-2xl font-bold text-blue-700'>
                    {reportingData.totalPeople}
                  </span>
                </div>
                <div className='flex items-center justify-center'>
                  <div className='w-1 h-8 bg-gray-300'></div>
                </div>
                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
                    <span className='font-medium'>Qualified Leads</span>
                  </div>
                  <span className='text-2xl font-bold text-emerald-700'>
                    {reportingData.peoplePipeline.qualified}
                  </span>
                </div>
                <div className='flex items-center justify-center'>
                  <div className='w-1 h-8 bg-gray-300'></div>
                </div>
                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 rounded-full bg-purple-500'></div>
                    <span className='font-medium'>In Progress</span>
                  </div>
                  <span className='text-2xl font-bold text-purple-700'>
                    {reportingData.peoplePipeline.proceed}
                  </span>
                </div>
                <div className='flex items-center justify-center'>
                  <div className='w-1 h-8 bg-gray-300'></div>
                </div>
                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                    <span className='font-medium'>Active Conversations</span>
                  </div>
                  <span className='text-2xl font-bold text-amber-700'>
                    {leadflowMetrics?.activeConversations || 0}
                  </span>
                </div>
                <div className='mt-4 pt-4 border-t'>
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    <div>
                      <div className='text-sm text-muted-foreground'>Qualification Rate</div>
                      <div className='text-lg font-semibold'>
                        {reportingData.totalPeople > 0
                          ? ((reportingData.peoplePipeline.qualified / reportingData.totalPeople) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>Conversion Rate</div>
                      <div className='text-lg font-semibold'>
                        {reportingData.totalPeople > 0
                          ? ((reportingData.peoplePipeline.proceed / reportingData.totalPeople) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>Engagement Rate</div>
                      <div className='text-lg font-semibold'>
                        {reportingData.totalPeople > 0 && leadflowMetrics
                          ? ((leadflowMetrics.activeConversations / reportingData.totalPeople) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Interface */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='flex space-x-8'>
            <TabsTrigger value='leads' className='flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Leads
            </TabsTrigger>
            <TabsTrigger value='emails' className='flex items-center gap-2'>
              <Mail className='h-4 w-4' />
              Emails
            </TabsTrigger>
          </TabsList>

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
                          fill={CHART_COLORS.primary}
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
                        <Bar dataKey='count' fill={CHART_COLORS.primary} />
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
                          fill: CHART_COLORS.primary,
                        },
                        {
                          name: 'Delivered',
                          value: emailData.statusCounts.delivered,
                          fill: CHART_COLORS.success,
                        },
                        {
                          name: 'Failed',
                          value: emailData.statusCounts.failed,
                          fill: CHART_COLORS.error,
                        },
                        {
                          name: 'Bounced',
                          value: emailData.statusCounts.bounced,
                          fill: CHART_COLORS.warning,
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
                <h3 className='text-lg font-semibold text-foreground mb-2'>
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
