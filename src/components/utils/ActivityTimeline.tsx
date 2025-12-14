import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Calendar,
  Clock,
  Mail,
  MessageCircle,
  UserCheck,
  Users,
  Phone,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';

interface ActivityTimelineProps {
  leadId: string;
  leadName?: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  status?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
}

export const ActivityTimeline = ({
  leadId,
  leadName,
}: ActivityTimelineProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .select(
          `
          "Last Contact Date",
          "Last Message",
          "Email Sent",
          "Email Sent Date", 
          "Email Reply",
          "Email Reply Date",
          "Connection Request",
          "Connection Request Date",
          "Connection Accepted Date",
          "LinkedIn Connected",
          "LinkedIn Connected Message",
          "LinkedIn Responded",
          "Meeting Booked",
          "Meeting Date",
          "Stage",
          "Stage Updated",
          "Automation Date",
          "Automation Status",
          "Message Sent Date",
          "Response Date",
          created_at,
          updated_at
        `
        )
        .eq('id', leadId)
        .single();

      if (error) throw error;

      // Convert lead data to timeline activities
      const timelineActivities: Activity[] = [];

      // Lead created
      if (error) {
        console.error('Error fetching lead:', error);
        return;
      }
      if (!lead || typeof lead !== 'object') {
        return;
      }
      const leadData = lead as Record<string, unknown>;
      if ('created_at' in leadData && leadData.created_at) {
        timelineActivities.push({
          id: `created-${leadData.created_at}`,
          type: 'lead_created',
          title: 'Lead Added',
          description: `${leadName || 'Lead'} was added to the system`,
          date: String(leadData.created_at),
          icon: Users as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-blue-100 text-primary',
        });
      }

      // Connection Request
      if (
        'Connection Request Date' in leadData &&
        leadData['Connection Request Date']
      ) {
        timelineActivities.push({
          id: `connection-request-${leadData['Connection Request Date']}`,
          type: 'connection_request',
          title: 'LinkedIn Connection Sent',
          description:
            (leadData['Connection Request'] as string) ||
            'Connection request sent on LinkedIn',
          date: String(leadData['Connection Request Date']),
          icon: UserCheck as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-accent/20 text-accent',
        });
      }

      // Connection Accepted
      if (
        'Connection Accepted Date' in leadData &&
        leadData['Connection Accepted Date']
      ) {
        timelineActivities.push({
          id: `connection-accepted-${leadData['Connection Accepted Date']}`,
          type: 'connection_accepted',
          title: 'LinkedIn Connection Accepted',
          description: 'LinkedIn connection request was accepted',
          date: String(leadData['Connection Accepted Date']),
          icon: UserCheck as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-green-100 text-success',
        });
      }

      // LinkedIn Connected Message
      if (
        'LinkedIn Connected' in leadData &&
        leadData['LinkedIn Connected'] &&
        'Connection Accepted Date' in leadData &&
        leadData['Connection Accepted Date']
      ) {
        timelineActivities.push({
          id: `linkedin-message-${leadData['Connection Accepted Date']}`,
          type: 'linkedin_message',
          title: 'LinkedIn Message Sent',
          description:
            (leadData['LinkedIn Connected Message'] as string) ||
            'Follow-up message sent on LinkedIn',
          date: String(leadData['Connection Accepted Date']),
          icon: MessageCircle as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-purple-100 text-purple-700',
        });
      }

      // Email Sent
      if ('Email Sent Date' in leadData && leadData['Email Sent Date']) {
        timelineActivities.push({
          id: `email-sent-${leadData['Email Sent Date']}`,
          type: 'email_sent',
          title: 'Email Sent',
          description:
            (leadData['Email Sent'] as string) || 'Email sent to prospect',
          date: String(leadData['Email Sent Date']),
          icon: Mail as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-orange-100 text-warning',
        });
      }

      // Email Reply
      if ('Email Reply Date' in leadData && leadData['Email Reply Date']) {
        timelineActivities.push({
          id: `email-reply-${leadData['Email Reply Date']}`,
          type: 'email_reply',
          title: 'Email Reply Received',
          description:
            (leadData['Email Reply'] as string) || 'Prospect replied to email',
          date: String(leadData['Email Reply Date']),
          icon: Mail as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-green-100 text-success',
        });
      }

      // Message Sent
      if ('Message Sent Date' in leadData && leadData['Message Sent Date']) {
        timelineActivities.push({
          id: `message-sent-${leadData['Message Sent Date']}`,
          type: 'message_sent',
          title: 'Message Sent',
          description:
            (leadData['Last Message'] as string) || 'Message sent to prospect',
          date: String(leadData['Message Sent Date']),
          icon: MessageCircle as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-blue-100 text-primary',
        });
      }

      // Response Date
      if ('Response Date' in leadData && leadData['Response Date']) {
        timelineActivities.push({
          id: `response-${leadData['Response Date']}`,
          type: 'response_received',
          title: 'Response Received',
          description: 'Prospect responded to outreach',
          date: String(leadData['Response Date']),
          icon: MessageCircle as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-green-100 text-success',
        });
      }

      // Meeting Booked
      if ('Meeting Date' in leadData && leadData['Meeting Date']) {
        const meetingDate = String(leadData['Meeting Date']);
        timelineActivities.push({
          id: `meeting-${meetingDate}`,
          type: 'meeting_booked',
          title:
            (leadData['Meeting Booked'] as string) === 'Yes'
              ? 'Meeting Scheduled'
              : 'Meeting Planned',
          description: `Meeting scheduled for ${format(parseISO(meetingDate), "PPP 'at' p")}`,
          date: meetingDate,
          icon: Calendar as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-emerald-100 text-emerald-700',
        });
      }

      // Stage Updates
      if ('Stage Updated' in leadData && leadData['Stage Updated']) {
        timelineActivities.push({
          id: `stage-update-${leadData['Stage Updated']}`,
          type: 'stage_update',
          title: 'Stage Updated',
          description: `Lead stage changed to: ${(leadData['Stage'] as string) || 'Unknown'}`,
          date: String(leadData['Stage Updated']),
          icon: FileText as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-gray-100 text-foreground',
        });
      }

      // Automation Activities
      if ('Automation Date' in leadData && leadData['Automation Date']) {
        timelineActivities.push({
          id: `automation-${leadData['Automation Date']}`,
          type: 'automation',
          title: 'Automation Activity',
          description: `Automation status: ${(leadData['Automation Status'] as string) || 'Unknown'}`,
          date: String(leadData['Automation Date']),
          icon: Clock as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-violet-100 text-violet-700',
        });
      }

      // Last Contact
      if ('Last Contact Date' in leadData && leadData['Last Contact Date']) {
        timelineActivities.push({
          id: `last-contact-${leadData['Last Contact Date']}`,
          type: 'last_contact',
          title: 'Last Contact',
          description:
            (leadData['Last Message'] as string) ||
            'Last contact with prospect',
          date: String(leadData['Last Contact Date']),
          icon: Phone as React.ComponentType<{
            className?: string;
            size?: number;
          }>,
          color: 'bg-accent/20 text-accent',
        });
      }

      // Sort by date (most recent first)
      const sortedActivities = timelineActivities
        .filter(activity => activity.date)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    }
  }, [leadId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-muted-foreground'>
            Loading activities...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-muted-foreground text-center py-4'>
            No activities recorded yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-medium'>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const isLast = index === activities.length - 1;

            return (
              <div
                key={activity.id}
                className='relative flex items-start space-x-3'
              >
                {/* Timeline line */}
                {!isLast && (
                  <div className='absolute left-4 top-8 h-full w-px bg-border' />
                )}

                {/* Activity icon */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.color}`}
                >
                  <Icon className='w-4 h-4' />
                </div>

                {/* Activity content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center space-x-2'>
                    <h4 className='text-sm font-medium text-foreground'>
                      {activity.title}
                    </h4>
                    <StatusBadge
                      status={formatDistanceToNow(parseISO(activity.date), {
                        addSuffix: true,
                      })}
                      size='sm'
                    />
                  </div>

                  {activity.description && (
                    <p className='text-sm text-muted-foreground mt-1'>
                      {activity.description}
                    </p>
                  )}

                  <div className='text-xs text-muted-foreground mt-1'>
                    {format(parseISO(activity.date), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
