/**
 * Modern Reporting Page - Real Data Integration
 *
 * Features:
 * - Real data from database tables
 * - Dynamic metrics and analytics
 * - Modern design aligned with app patterns
 * - Focus on actual metrics that matter
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import { useReportingData } from '@/hooks/useReportingData';
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function Reporting() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>(
    '30d'
  );

  const {
    data: reportingData,
    isLoading,
    error,
    refetch,
  } = useReportingData({
    filters: { period: selectedPeriod },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const handleRefresh = () => {
    refetch();
  };

  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
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

  return (
    <Page title='Reporting' hideHeader>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Reporting</h1>
            <p className='text-gray-600'>
              Track your recruitment performance and insights
            </p>
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

        {/* Key Metrics */}
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
              <p className='text-xs text-muted-foreground'>
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
              <p className='text-xs text-muted-foreground'>
                {reportingData?.growthMetrics.companiesGrowth !== undefined
                  ? `${formatGrowthRate(reportingData.growthMetrics.companiesGrowth)} from last period`
                  : 'Loading...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Jobs</CardTitle>
              <Briefcase className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoading
                  ? '...'
                  : reportingData?.totalJobs.toLocaleString() || 0}
              </div>
              <p className='text-xs text-muted-foreground'>
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
              <p className='text-xs text-muted-foreground'>
                {reportingData?.growthMetrics.qualificationRate !== undefined
                  ? `${reportingData.growthMetrics.qualificationRate.toFixed(1)}% qualification rate`
                  : 'Loading...'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Overview */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5' />
                People Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>New</span>
                <Badge variant='secondary'>
                  {isLoading ? '...' : reportingData?.peoplePipeline.new || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Qualified</span>
                <Badge variant='secondary'>
                  {isLoading
                    ? '...'
                    : reportingData?.peoplePipeline.qualified || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Proceed</span>
                <Badge variant='secondary'>
                  {isLoading
                    ? '...'
                    : reportingData?.peoplePipeline.proceed || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Skip</span>
                <Badge variant='outline'>
                  {isLoading ? '...' : reportingData?.peoplePipeline.skip || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Briefcase className='h-5 w-5' />
                Job Qualification
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>New</span>
                <Badge variant='secondary'>
                  {isLoading ? '...' : reportingData?.jobQualification.new || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Qualify</span>
                <Badge variant='secondary'>
                  {isLoading
                    ? '...'
                    : reportingData?.jobQualification.qualify || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Skip</span>
                <Badge variant='outline'>
                  {isLoading
                    ? '...'
                    : reportingData?.jobQualification.skip || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Insights */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Briefcase className='h-5 w-5' />
                Top Job Functions
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {isLoading ? (
                <div className='space-y-2'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='flex items-center justify-between'>
                      <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                      <div className='h-6 bg-gray-200 rounded w-12 animate-pulse'></div>
                    </div>
                  ))}
                </div>
              ) : (
                reportingData?.topJobFunctions
                  .slice(0, 4)
                  .map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm font-medium truncate pr-2'>
                        {item.function || 'Unknown Function'}
                      </span>
                      <Badge variant='secondary'>{item.count}</Badge>
                    </div>
                  )) || (
                  <div className='text-center py-4 text-gray-500'>
                    No job function data available
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building2 className='h-5 w-5' />
                Top Companies by Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {isLoading ? (
                <div className='space-y-2'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='flex items-center justify-between'>
                      <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                      <div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
                    </div>
                  ))}
                </div>
              ) : (
                reportingData?.topCompaniesByJobs
                  .slice(0, 4)
                  .map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm font-medium truncate pr-2'>
                        {item.companyName}
                      </span>
                      <Badge variant='secondary'>{item.jobCount} jobs</Badge>
                    </div>
                  )) || (
                  <div className='text-center py-4 text-gray-500'>
                    No company data available
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {isLoading ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-2 h-2 bg-gray-300 rounded-full animate-pulse'></div>
                        <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                      </div>
                      <div className='h-3 bg-gray-200 rounded w-16 animate-pulse'></div>
                    </div>
                  ))}
                </div>
              ) : reportingData?.recentActivity.length ? (
                reportingData.recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === 'job_discovered'
                            ? 'bg-green-500'
                            : activity.type === 'job_qualified'
                              ? 'bg-blue-500'
                              : activity.type === 'person_added'
                                ? 'bg-orange-500'
                                : 'bg-purple-500'
                        }`}
                      ></div>
                      <span className='text-sm'>{activity.description}</span>
                    </div>
                    <span className='text-xs text-gray-500'>
                      {formatActivityTime(activity.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  No recent activity found for the selected period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <TrendingUp className='h-12 w-12 text-gray-400 mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Advanced Analytics Coming Soon
            </h3>
            <p className='text-gray-600 text-center max-w-md'>
              We're working on advanced reporting features including cost
              tracking, automation metrics, and detailed performance analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
