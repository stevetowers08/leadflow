import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  HelpCircle,
  MessageSquare,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { usePersonReplyAnalytics } from '../../hooks/useReplyAnalytics';
import type { Person } from '../../types/database';
import { getStatusDisplayText } from '../../utils/statusUtils';

interface PersonReplyAnalyticsProps {
  person: Person;
  showDetails?: boolean;
}

export function PersonReplyAnalytics({
  person,
  showDetails = false,
}: PersonReplyAnalyticsProps) {
  const {
    data: analytics,
    isLoading,
    error,
  } = usePersonReplyAnalytics(person.id);

  if (isLoading) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='animate-pulse space-y-2'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            <div className='h-3 bg-gray-200 rounded w-1/2'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-destructive text-sm'>
            Error loading reply analytics
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  const hasReplies = analytics.total_replies > 0;
  const lastReplyDate = analytics.last_reply_at
    ? new Date(analytics.last_reply_at).toLocaleDateString()
    : null;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' />
          Reply Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {/* Quick Stats */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='text-center p-2 bg-primary/10 rounded-lg'>
            <div className='text-lg font-bold text-primary'>
              {analytics.total_replies}
            </div>
            <div className='text-xs text-primary'>Total Replies</div>
          </div>

          {analytics.last_reply_type && (
            <div className='text-center p-2 bg-success/10 rounded-lg'>
              <div className='flex items-center justify-center gap-1 text-success'>
                {analytics.last_reply_type === 'interested' && (
                  <CheckCircle className='h-4 w-4' />
                )}
                {analytics.last_reply_type === 'not_interested' && (
                  <XCircle className='h-4 w-4' />
                )}
                {analytics.last_reply_type === 'maybe' && (
                  <HelpCircle className='h-4 w-4' />
                )}
                <span className='text-sm font-medium'>
                  {getStatusDisplayText(analytics.last_reply_type)}
                </span>
              </div>
              <div className='text-xs text-success'>Last Intent</div>
            </div>
          )}
        </div>

        {/* Last Reply Info */}
        {hasReplies && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Last Reply:</span>
              <span className='font-medium'>{lastReplyDate}</span>
            </div>

            {analytics.last_reply_type && (
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Intent:</span>
                <Badge
                  variant={
                    analytics.last_reply_type === 'interested'
                      ? 'default'
                      : analytics.last_reply_type === 'not_interested'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className='text-xs'
                >
                  {getStatusDisplayText(analytics.last_reply_type)}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* No Replies State */}
        {!hasReplies && (
          <div className='text-center py-4'>
            <MessageSquare className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
            <p className='text-sm text-muted-foreground'>No replies yet</p>
            <p className='text-xs text-muted-foreground'>
              Waiting for response from {person.name}
            </p>
          </div>
        )}

        {/* Reply History (if showDetails is true) */}
        {showDetails &&
          analytics.reply_history &&
          analytics.reply_history.length > 0 && (
            <div className='space-y-2'>
              <div className='text-sm font-medium'>Reply History</div>
              <div className='space-y-2 max-h-32 overflow-y-auto'>
                {analytics.reply_history.map((reply, index) => (
                  <div key={index} className='p-2 bg-muted rounded text-xs'>
                    <div className='flex items-center justify-between mb-1'>
                      <Badge
                        variant={
                          reply.reply_type === 'interested'
                            ? 'default'
                            : reply.reply_type === 'not_interested'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className='text-xs'
                      >
                        {getStatusDisplayText(reply.reply_type)}
                      </Badge>
                      <span className='text-muted-foreground'>
                        {new Date(reply.reply_date).toLocaleDateString()}
                      </span>
                    </div>
                    {reply.reply_message && (
                      <p className='text-muted-foreground line-clamp-2'>
                        {reply.reply_message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className='flex gap-2 pt-2'>
          <Button variant='outline' size='sm' className='flex-1'>
            <MessageSquare className='h-3 w-3 mr-1' />
            Send Message
          </Button>
          {showDetails && (
            <Button variant='outline' size='sm'>
              <TrendingUp className='h-3 w-3' />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PeopleReplySummaryProps {
  people: Person[];
  showStageBreakdown?: boolean;
}

export function PeopleReplySummary({
  people,
  showStageBreakdown = false,
}: PeopleReplySummaryProps) {
  const totalPeople = people.length;
  const peopleWithReplies = people.filter(p => p.reply_type !== null);
  const totalReplies = peopleWithReplies.length;
  const replyRate = totalPeople > 0 ? (totalReplies / totalPeople) * 100 : 0;

  const interestedCount = people.filter(
    p => p.reply_type === 'interested'
  ).length;
  const notInterestedCount = people.filter(
    p => p.reply_type === 'not_interested'
  ).length;
  const maybeCount = people.filter(p => p.reply_type === 'maybe').length;

  const stageBreakdown = people.reduce(
    (acc, person) => {
      const stage = person.people_stage || 'unknown';
      if (!acc[stage]) {
        acc[stage] = {
          total: 0,
          replies: 0,
          interested: 0,
          notInterested: 0,
          maybe: 0,
        };
      }
      acc[stage].total++;
      if (person.reply_type) {
        acc[stage].replies++;
        if (person.reply_type === 'interested') acc[stage].interested++;
        if (person.reply_type === 'not_interested') acc[stage].notInterested++;
        if (person.reply_type === 'maybe') acc[stage].maybe++;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        total: number;
        replies: number;
        interested: number;
        notInterested: number;
        maybe: number;
      }
    >
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' />
          Reply Summary
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Overall Stats */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='text-center p-3 bg-primary/10 rounded-lg'>
            <div className='text-lg font-bold text-primary'>{totalPeople}</div>
            <div className='text-xs text-primary'>Total People</div>
          </div>
          <div className='text-center p-3 bg-success/10 rounded-lg'>
            <div className='text-lg font-bold text-success'>
              {replyRate.toFixed(1)}%
            </div>
            <div className='text-xs text-success'>Reply Rate</div>
          </div>
        </div>

        {/* Reply Intent Breakdown */}
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Reply Intent</div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='text-center p-2 bg-success/10 rounded'>
              <div className='flex items-center justify-center gap-1 text-success mb-1'>
                <CheckCircle className='h-3 w-3' />
                <span className='text-sm font-bold'>{interestedCount}</span>
              </div>
              <div className='text-xs text-success'>Interested</div>
            </div>
            <div className='text-center p-2 bg-destructive/10 rounded'>
              <div className='flex items-center justify-center gap-1 text-destructive mb-1'>
                <XCircle className='h-3 w-3' />
                <span className='text-sm font-bold'>{notInterestedCount}</span>
              </div>
              <div className='text-xs text-destructive'>Not Interested</div>
            </div>
            <div className='text-center p-2 bg-warning/10 rounded'>
              <div className='flex items-center justify-center gap-1 text-warning mb-1'>
                <HelpCircle className='h-3 w-3' />
                <span className='text-sm font-bold'>{maybeCount}</span>
              </div>
              <div className='text-xs text-warning'>Maybe</div>
            </div>
          </div>
        </div>

        {/* Stage Breakdown */}
        {showStageBreakdown && Object.keys(stageBreakdown).length > 0 && (
          <div className='space-y-2'>
            <div className='text-sm font-medium'>By Stage</div>
            <div className='space-y-1'>
              {Object.entries(stageBreakdown).map(([stage, stats]) => (
                <div
                  key={stage}
                  className='flex items-center justify-between text-xs p-2 bg-muted rounded'
                >
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className='text-xs'>
                      {getStatusDisplayText(stage)}
                    </Badge>
                    <span>{stats.total} people</span>
                  </div>
                  <div className='text-muted-foreground'>
                    {stats.replies} replies (
                    {stats.total > 0
                      ? ((stats.replies / stats.total) * 100).toFixed(0)
                      : 0}
                    %)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
