'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

/**
 * Overview Page - PDR Section 5.2
 * 
 * ROI Metrics (Bento Grid) + Live Feed
 * Refactored from dashboard
 */
export default function OverviewPage() {
  // TODO: Replace with real data from API
  const roiMetrics = {
    pipelineValue: 142500,
    speedToLead: '4m 12s',
    activeConversations: 18,
  };

  // TODO: Replace with real activity feed data
  const liveFeed = [
    { id: '1', user: 'John', action: 'scanned', prospect: 'Sarah Johnson', time: new Date(Date.now() - 2 * 60000) },
    { id: '2', user: 'Jane', action: 'enriched', prospect: 'Mike Chen', time: new Date(Date.now() - 5 * 60000) },
    { id: '3', user: 'John', action: 'sent email', prospect: 'Emily Davis', time: new Date(Date.now() - 10 * 60000) },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Section 1: ROI Metrics (Bento Grid) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card A: Pipeline Value */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              ${roiMetrics.pipelineValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Card B: Speed to Lead */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Speed to Lead
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {roiMetrics.speedToLead}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Avg time Scan → First Email
            </p>
          </CardContent>
        </Card>

        {/* Card C: Active Conversations */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {roiMetrics.activeConversations}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Threads in Inbox
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Live Feed */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Live Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {liveFeed.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {item.user.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span>{' '}
                      {item.action} <span className="font-medium">{item.prospect}</span>
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.time, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

