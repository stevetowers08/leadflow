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
  icon: React.ComponentType<any>;
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
        .from('People')
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
      if (lead.created_at) {
        timelineActivities.push({
          id: `created-${lead.created_at}`,
          type: 'lead_created',
          title: 'Lead Added',
          description: `${leadName || 'Lead'} was added to the system`,
          date: lead.created_at,
          icon: Users,
          color: 'bg-blue-100 text-primary',
        });
      }

      // Connection Request
      if (lead['Connection Request Date']) {
        timelineActivities.push({
          id: `connection-request-${lead['Connection Request Date']}`,
          type: 'connection_request',
          title: 'LinkedIn Connection Sent',
          description:
            lead['Connection Request'] || 'Connection request sent on LinkedIn',
          date: lead['Connection Request Date'],
          icon: UserCheck,
          color: 'bg-accent/20 text-accent',
        });
      }

      // Connection Accepted
      if (lead['Connection Accepted Date']) {
        timelineActivities.push({
          id: `connection-accepted-${lead['Connection Accepted Date']}`,
          type: 'connection_accepted',
          title: 'LinkedIn Connection Accepted',
          description: 'LinkedIn connection request was accepted',
          date: lead['Connection Accepted Date'],
          icon: UserCheck,
          color: 'bg-green-100 text-success',
        });
      }

      // LinkedIn Connected Message
      if (lead['LinkedIn Connected'] && lead['Connection Accepted Date']) {
        timelineActivities.push({
          id: `linkedin-message-${lead['Connection Accepted Date']}`,
          type: 'linkedin_message',
          title: 'LinkedIn Message Sent',
          description:
            lead['LinkedIn Connected Message'] ||
            'Follow-up message sent on LinkedIn',
          date: lead['Connection Accepted Date'],
          icon: MessageCircle,
          color: 'bg-purple-100 text-purple-700',
        });
      }

      // Email Sent
      if (lead['Email Sent Date']) {
        timelineActivities.push({
          id: `email-sent-${lead['Email Sent Date']}`,
          type: 'email_sent',
          title: 'Email Sent',
          description: lead['Email Sent'] || 'Email sent to prospect',
          date: lead['Email Sent Date'],
          icon: Mail,
          color: 'bg-orange-100 text-warning',
        });
      }

      // Email Reply
      if (lead['Email Reply Date']) {
        timelineActivities.push({
          id: `email-reply-${lead['Email Reply Date']}`,
          type: 'email_reply',
          title: 'Email Reply Received',
          description: lead['Email Reply'] || 'Prospect replied to email',
          date: lead['Email Reply Date'],
          icon: Mail,
          color: 'bg-green-100 text-success',
        });
      }

      // Message Sent
      if (lead['Message Sent Date']) {
        timelineActivities.push({
          id: `message-sent-${lead['Message Sent Date']}`,
          type: 'message_sent',
          title: 'Message Sent',
          description: lead['Last Message'] || 'Message sent to prospect',
          date: lead['Message Sent Date'],
          icon: MessageCircle,
          color: 'bg-blue-100 text-primary',
        });
      }

      // Response Date
      if (lead['Response Date']) {
        timelineActivities.push({
          id: `response-${lead['Response Date']}`,
          type: 'response_received',
          title: 'Response Received',
          description: 'Prospect responded to outreach',
          date: lead['Response Date'],
          icon: MessageCircle,
          color: 'bg-green-100 text-success',
        });
      }

      // Meeting Booked
      if (lead['Meeting Date']) {
        timelineActivities.push({
          id: `meeting-${lead['Meeting Date']}`,
          type: 'meeting_booked',
          title:
            lead['Meeting Booked'] === 'Yes'
              ? 'Meeting Scheduled'
              : 'Meeting Planned',
          description: `Meeting scheduled for ${format(parseISO(lead['Meeting Date']), "PPP 'at' p")}`,
          date: lead['Meeting Date'],
          icon: Calendar,
          color: 'bg-emerald-100 text-emerald-700',
        });
      }

      // Stage Updates
      if (lead['Stage Updated']) {
        timelineActivities.push({
          id: `stage-update-${lead['Stage Updated']}`,
          type: 'stage_update',
          title: 'Stage Updated',
          description: `Lead stage changed to: ${lead['Stage'] || 'Unknown'}`,
          date: lead['Stage Updated'],
          icon: FileText,
          color: 'bg-gray-100 text-foreground',
        });
      }

      // Automation Activities
      if (lead['Automation Date']) {
        timelineActivities.push({
          id: `automation-${lead['Automation Date']}`,
          type: 'automation',
          title: 'Automation Activity',
          description: `Automation status: ${lead['Automation Status'] || 'Unknown'}`,
          date: lead['Automation Date'],
          icon: Clock,
          color: 'bg-violet-100 text-violet-700',
        });
      }

      // Last Contact
      if (lead['Last Contact Date']) {
        timelineActivities.push({
          id: `last-contact-${lead['Last Contact Date']}`,
          type: 'last_contact',
          title: 'Last Contact',
          description: lead['Last Message'] || 'Last contact with prospect',
          date: lead['Last Contact Date'],
          icon: Phone,
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
