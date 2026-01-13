'use client';

/**
 * Analytics & Insights Page
 *
 * PDR Section: Insights Screen (Section 5)
 * Displays lead analytics aligned with PDR requirements:
 * - Header with date range selector and export button
 * - Key Metrics (4 cards): Total Leads, Response Rate, Hot Leads, Avg Response Time
 * - Charts: Lead Quality Distribution (Donut), Capture Timeline (Line), Workflow Performance (Bar)
 * - Recent Activity Feed
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/ui/stat-card';
import { Page } from '@/design-system/components';
import { designTokens } from '@/design-system/tokens';
import { useLeadAnalytics } from '@/hooks/useLeadAnalytics';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'this_event' | 'last_30_days' | 'all_time'
  >('last_30_days');

  const {
    data: analytics,
    isLoading,
    error,
  } = useLeadAnalytics({
    period: selectedPeriod,
  });

  return (
    <Page
      title='Analytics & Insights'
      loading={isLoading}
      loadingMessage='Loading analytics...'
      hideHeader
    >
      <div className={cn('space-y-6', designTokens.spacing.pagePadding.full)}>
        {/* Header with Controls */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1
              className={cn(
                designTokens.typography.heading.h1,
                'text-3xl font-bold'
              )}
            >
              Analytics & Insights
            </h1>
            <p className={cn(designTokens.typography.body.muted, 'mt-1')}>
              Track your lead capture and engagement metrics
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Select
              value={selectedPeriod}
              onValueChange={(
                value: 'this_event' | 'last_30_days' | 'all_time'
              ) => setSelectedPeriod(value)}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='this_event'>This Event</SelectItem>
                <SelectItem value='last_30_days'>Last 30 Days</SelectItem>
                <SelectItem value='all_time'>All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='outline'>
              <Download className={cn(designTokens.icons.size, 'mr-2')} />
              Export Report
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error loading analytics</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : 'Unknown error occurred'}
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics (4 cards, 2x2 grid) */}
        {isLoading ? (
          <div className={designTokens.layout.cardGrid}>
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className='p-6'>
                  <Skeleton className='h-4 w-24 mb-4' />
                  <Skeleton className='h-8 w-32' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analytics ? (
          <div className={designTokens.layout.cardGrid}>
            {/* Card 1: Total Leads */}
            <StatCard
              title='Total Leads'
              value={analytics.totalLeads}
              change={analytics.totalLeadsChange}
              changeLabel='vs previous period'
              trend={
                analytics.totalLeadsChange > 0
                  ? 'up'
                  : analytics.totalLeadsChange < 0
                    ? 'down'
                    : 'neutral'
              }
            />

            {/* Card 2: Response Rate */}
            <StatCard
              title='Response Rate'
              value={`${analytics.responseRate.toFixed(1)}%`}
              change={analytics.responseRateChange}
              changeLabel={
                analytics.responseRateBenchmark > 0
                  ? `${analytics.responseRateBenchmark.toFixed(1)}% above average`
                  : `${Math.abs(analytics.responseRateBenchmark).toFixed(1)}% below average`
              }
              trend={
                analytics.responseRateChange > 0
                  ? 'up'
                  : analytics.responseRateChange < 0
                    ? 'down'
                    : 'neutral'
              }
            />

            {/* Card 3: Hot Leads */}
            <StatCard
              title='Hot Leads'
              value={analytics.hotLeads}
              changeLabel={`${analytics.hotLeadsPercentage.toFixed(1)}% of total leads`}
              icon={Flame}
            />

            {/* Card 4: Avg Response Time */}
            <StatCard
              title='Avg Response Time'
              value={`${analytics.avgResponseTime.toFixed(0)}h`}
              changeLabel={
                analytics.avgResponseTimeChange > 0
                  ? `${analytics.avgResponseTimeChange.toFixed(1)}h faster than last event`
                  : analytics.avgResponseTimeChange < 0
                    ? `${Math.abs(analytics.avgResponseTimeChange).toFixed(1)}h slower than last event`
                    : 'No change'
              }
              icon={Zap}
            />
          </div>
        ) : null}

        {/* Charts Section */}
        {isLoading ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {[1, 2].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className='h-6 w-48' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-[300px] w-full' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analytics ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Lead Quality Distribution (Donut Chart) */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'Hot',
                          value: analytics.qualityDistribution.hot,
                        },
                        {
                          name: 'Warm',
                          value: analytics.qualityDistribution.warm,
                        },
                        {
                          name: 'Cold',
                          value: analytics.qualityDistribution.cold,
                        },
                      ]}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={100}
                      dataKey='value'
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill='#EF4444' />
                      <Cell fill='#F59E0B' />
                      <Cell fill='#6B7280' />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className='text-center mt-4'>
                  <p className='text-2xl font-bold'>{analytics.totalLeads}</p>
                  <p className='text-sm text-muted-foreground'>Total Leads</p>
                </div>
              </CardContent>
            </Card>

            {/* Capture Timeline (Line Chart) */}
            <Card>
              <CardHeader>
                <CardTitle>Capture Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={analytics.captureTimeline}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={date => {
                        const d = new Date(date);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={date => {
                        const d = new Date(date);
                        return d.toLocaleDateString();
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='count'
                      stroke='#2563EB'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Workflow Performance (Bar Chart) */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-48' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-[400px] w-full' />
            </CardContent>
          </Card>
        ) : analytics && analytics.workflowPerformance.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={400}>
                <BarChart
                  data={analytics.workflowPerformance}
                  layout='vertical'
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis dataKey='workflowName' type='category' width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='sent' fill='#2563EB' name='Sent' />
                  <Bar dataKey='opened' fill='#10B981' name='Opened' />
                  <Bar dataKey='replied' fill='#059669' name='Replied' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : null}

        {/* Recent Activity Feed */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='flex items-start gap-3 pb-4 border-b'>
                    <Skeleton className='h-2 w-2 rounded-full mt-1' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : analytics ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {analytics.recentActivity.length === 0 ? (
                  <p
                    className={cn(
                      designTokens.typography.body.muted,
                      'text-center py-8'
                    )}
                  >
                    No recent activity
                  </p>
                ) : (
                  analytics.recentActivity.map(activity => (
                    <div
                      key={activity.id}
                      className={cn(
                        'flex items-start gap-3 pb-4 border-b last:border-0',
                        designTokens.borders.tableRow
                      )}
                    >
                      <div className='mt-1'>
                        {activity.type === 'lead_captured' && (
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              designTokens.colors.background.info
                            )}
                          />
                        )}
                        {activity.type === 'email_sent' && (
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              designTokens.colors.background.success
                            )}
                          />
                        )}
                        {activity.type === 'email_opened' && (
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              designTokens.colors.background.warning
                            )}
                          />
                        )}
                        {activity.type === 'email_replied' && (
                          <div className='h-2 w-2 rounded-full bg-purple-500' />
                        )}
                        {activity.type === 'workflow_paused' && (
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              designTokens.colors.background.error
                            )}
                          />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p
                          className={cn(
                            designTokens.typography.body.default,
                            'font-medium'
                          )}
                        >
                          {activity.description}
                        </p>
                        <p
                          className={cn(
                            designTokens.typography.body.small,
                            'mt-1'
                          )}
                        >
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {analytics.recentActivity.length > 0 && (
                <Button variant='ghost' className='w-full mt-4'>
                  View All Activity
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Page>
  );
}
