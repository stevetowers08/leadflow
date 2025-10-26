import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  PieChart,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { useDashboardReplyAnalytics } from '../../hooks/useReplyAnalytics';
import type { OverallReplyMetrics, ReplyAnalytics } from '../../types/database';
import { getStatusDisplayText } from '../../utils/statusUtils';

interface ReplyAnalyticsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

function ReplyAnalyticsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}: ReplyAnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className={`text-${color}-600`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value.toLocaleString()}</div>
        {subtitle && (
          <p className='text-xs text-muted-foreground'>{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className='flex items-center text-xs text-muted-foreground mt-1'>
            <TrendingUp className='h-3 w-3 mr-1' />
            {trend > 0 ? '+' : ''}
            {trend}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReplyRateCardProps {
  title: string;
  rate: number;
  total: number;
  color?: string;
}

function ReplyRateCard({
  title,
  rate,
  total,
  color = 'blue',
}: ReplyRateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-2xl font-bold'>{rate.toFixed(1)}%</span>
            <span className='text-sm text-muted-foreground'>
              of {total.toLocaleString()}
            </span>
          </div>
          <Progress value={rate} className='h-2' />
        </div>
      </CardContent>
    </Card>
  );
}

interface StageAnalyticsTableProps {
  data: ReplyAnalytics[];
}

function StageAnalyticsTable({ data }: StageAnalyticsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3 className='h-5 w-5' />
          Reply Analytics by Stage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {data.map(stage => (
            <div key={stage.people_stage} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>
                    {getStatusDisplayText(stage.people_stage)}
                  </Badge>
                  <span className='text-sm text-muted-foreground'>
                    {stage.total_people} people
                  </span>
                </div>
                <div className='text-sm font-medium'>
                  {stage.reply_rate_percent.toFixed(1)}% reply rate
                </div>
              </div>

              <div className='grid grid-cols-4 gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <span>{stage.interested_count} interested</span>
                </div>
                <div className='flex items-center gap-1'>
                  <XCircle className='h-4 w-4 text-red-600' />
                  <span>{stage.not_interested_count} not interested</span>
                </div>
                <div className='flex items-center gap-1'>
                  <HelpCircle className='h-4 w-4 text-yellow-600' />
                  <span>{stage.maybe_count} maybe</span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageSquare className='h-4 w-4 text-blue-600' />
                  <span>{stage.total_replies} total replies</span>
                </div>
              </div>

              <Progress value={stage.reply_rate_percent} className='h-1' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ReplyIntentBreakdownProps {
  data: OverallReplyMetrics;
}

function ReplyIntentBreakdown({ data }: ReplyIntentBreakdownProps) {
  const totalReplies = data.total_replies;

  if (totalReplies === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <PieChart className='h-5 w-5' />
            Reply Intent Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-center py-8'>
            No replies yet to analyze intent
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <PieChart className='h-5 w-5' />
          Reply Intent Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <span className='text-sm font-medium'>Interested</span>
              </div>
              <div className='text-sm font-bold'>
                {data.interested_count} ({data.interested_rate.toFixed(1)}%)
              </div>
            </div>
            <Progress value={data.interested_rate} className='h-2' />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <XCircle className='h-4 w-4 text-red-600' />
                <span className='text-sm font-medium'>Not Interested</span>
              </div>
              <div className='text-sm font-bold'>
                {data.not_interested_count} (
                {data.not_interested_rate.toFixed(1)}%)
              </div>
            </div>
            <Progress value={data.not_interested_rate} className='h-2' />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <HelpCircle className='h-4 w-4 text-yellow-600' />
                <span className='text-sm font-medium'>Maybe</span>
              </div>
              <div className='text-sm font-bold'>
                {data.maybe_count} ({data.maybe_rate.toFixed(1)}%)
              </div>
            </div>
            <Progress value={data.maybe_rate} className='h-2' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReplyAnalyticsDashboard() {
  const { data, isLoading, error } = useDashboardReplyAnalytics();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              </CardHeader>
              <CardContent className='animate-pulse'>
                <div className='h-8 bg-gray-200 rounded w-1/2 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-full'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-red-600'>
            Error loading reply analytics: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-muted-foreground'>
            No reply analytics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const { overall, byStage, trends, topPerforming } = data;

  return (
    <div className='space-y-6'>
      {/* Key Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <ReplyAnalyticsCard
          title='Total People'
          value={overall.total_people}
          subtitle='In your pipeline'
          icon={<Users className='h-4 w-4' />}
          color='blue'
        />
        <ReplyAnalyticsCard
          title='Total Replies'
          value={overall.total_replies}
          subtitle={`${overall.overall_reply_rate.toFixed(1)}% reply rate`}
          icon={<MessageSquare className='h-4 w-4' />}
          color='green'
        />
        <ReplyAnalyticsCard
          title='Interested'
          value={overall.interested_count}
          subtitle={`${overall.interested_rate.toFixed(1)}% of replies`}
          icon={<CheckCircle className='h-4 w-4' />}
          color='green'
        />
        <ReplyAnalyticsCard
          title='Not Interested'
          value={overall.not_interested_count}
          subtitle={`${overall.not_interested_rate.toFixed(1)}% of replies`}
          icon={<XCircle className='h-4 w-4' />}
          color='red'
        />
      </div>

      {/* Reply Rate Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <ReplyRateCard
          title='Overall Reply Rate'
          rate={overall.overall_reply_rate}
          total={overall.total_people}
          color='blue'
        />
        <ReplyRateCard
          title='Interested Rate'
          rate={overall.interested_rate}
          total={overall.total_replies}
          color='green'
        />
        <ReplyRateCard
          title='Conversion Rate'
          rate={(overall.interested_count / overall.total_people) * 100}
          total={overall.total_people}
          color='purple'
        />
      </div>

      {/* Detailed Analytics */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <StageAnalyticsTable data={byStage} />
        <ReplyIntentBreakdown data={overall} />
      </div>

      {/* Top Performing Stages */}
      {topPerforming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Top Performing Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {topPerforming.map((stage, index) => (
                <div
                  key={stage.people_stage}
                  className='flex items-center justify-between p-3 border rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold'>
                      {index + 1}
                    </div>
                    <div>
                      <div className='font-medium'>
                        {getStatusDisplayText(stage.people_stage)}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {stage.total_people} people, {stage.total_replies}{' '}
                        replies
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold text-green-600'>
                      {stage.reply_rate_percent.toFixed(1)}%
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      reply rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
