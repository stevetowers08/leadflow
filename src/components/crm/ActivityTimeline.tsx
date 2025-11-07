import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateMockActivities, shouldUseMockData } from '@/utils/mockData';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  Mail as EmailIcon,
  FileText,
  Linkedin,
  Search,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ActivityTimelineProps {
  entityId: string;
  entityName: string;
  entityType?: 'lead' | 'company' | 'job';
}

interface ActivityItem {
  id: string;
  type:
    | 'linkedin_message'
    | 'email_message'
    | 'automation_step'
    | 'note'
    | 'stage_change'
    | 'call'
    | 'meeting';
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  authorId?: string;
  leadName?: string;
  leadId?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  metadata?: Record<string, unknown>;
}

export const ActivityTimeline = ({
  entityId,
  entityName,
  entityType = 'lead',
}: ActivityTimelineProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const allActivities: ActivityItem[] = [];

      // Use mock data in development if enabled
      if (shouldUseMockData()) {
        const mockActivities = generateMockActivities(
          entityId,
          entityName,
          entityType
        );
        setActivities(mockActivities);
        setIsLoading(false);
        return;
      }

      // Fetch LinkedIn messages
      const { data: conversations } = await supabase
        .from('conversations')
        .select(
          `
          id,
          person_id,
          subject,
          last_message_at,
          conversation_type,
          people!inner(name, company_id, companies(name))
        `
        )
        .eq('person_id', entityId)
        .order('last_message_at', { ascending: false });

      if (conversations) {
        for (const conv of conversations) {
          const { data: messages } = await supabase
            .from('conversation_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('sent_at', { ascending: false })
            .limit(1);

          if (messages && messages[0]) {
            const message = messages[0];
            allActivities.push({
              id: `linkedin_${message.id}`,
              type: 'linkedin_message',
              title: 'LinkedIn Message',
              description: message.content,
              timestamp: message.sent_at || message.created_at,
              author: message.sender_name || 'Unknown',
              leadName: conv.people?.name,
              leadId: conv.person_id,
              icon: Linkedin,
              color: 'bg-blue-100 text-primary',
              metadata: { conversationId: conv.id, messageId: message.id },
            });
          }
        }
      }

      // Fetch email messages
      const { data: emailThreads } = await supabase
        .from('email_threads')
        .select(
          `
          id,
          person_id,
          subject,
          last_message_at,
          people!inner(name, company_id, companies(name))
        `
        )
        .eq('person_id', entityId)
        .order('last_message_at', { ascending: false });

      if (emailThreads) {
        for (const thread of emailThreads) {
          const { data: emails } = await supabase
            .from('email_messages')
            .select('*')
            .eq('thread_id', thread.id)
            .order('sent_at', { ascending: false })
            .limit(1);

          if (emails && emails[0]) {
            const email = emails[0];
            allActivities.push({
              id: `email_${email.id}`,
              type: 'email_message',
              title: 'Email Message',
              description: email.body_text || email.subject || 'Email sent',
              timestamp: email.sent_at || email.created_at,
              author: email.from_email,
              leadName: thread.people?.name,
              leadId: thread.person_id,
              icon: EmailIcon,
              color: 'bg-green-100 text-success',
              metadata: { threadId: thread.id, emailId: email.id },
            });
          }
        }
      }

      // Fetch automation steps from people table
      const { data: personData } = await supabase
        .from('people')
        .select('*')
        .eq('id', entityId)
        .single();

      if (personData) {
        // Stage changes
        if (personData.stage_updated) {
          allActivities.push({
            id: `stage_change_${entityId}`,
            type: 'stage_change',
            title: `Stage Updated to ${personData.stage}`,
            description: `Lead moved to ${personData.stage} stage`,
            timestamp: personData.stage_updated,
            leadName: personData.name,
            leadId: entityId,
            icon: User,
            color: 'bg-orange-100 text-warning',
            metadata: { newStage: personData.stage },
          });
        }
      }

      // Fetch notes
      const { data: notes } = await supabase
        .from('notes')
        .select(
          `
          id,
          content,
          author_id,
          created_at,
          user_profiles!inner(full_name)
        `
        )
        .eq('entity_id', entityId)
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });

      if (notes) {
        for (const note of notes) {
          allActivities.push({
            id: `note_${note.id}`,
            type: 'note',
            title: 'Note Added',
            description: note.content,
            timestamp: note.created_at,
            author: note.user_profiles?.full_name || 'Unknown',
            leadName: entityName,
            leadId: entityId,
            icon: FileText,
            color: 'bg-gray-100 text-muted-foreground',
            metadata: { noteId: note.id },
          });
        }
      }

      // Sort all activities by timestamp
      allActivities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType, entityName]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredActivities = activities.filter(
    activity =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.leadName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const badges = {
      linkedin_message: {
        label: 'LinkedIn',
        color: 'bg-blue-100 text-primary',
      },
      email_message: { label: 'Email', color: 'bg-green-100 text-success' },
      automation_step: {
        label: 'Automation',
        color: 'bg-purple-100 text-purple-800',
      },
      note: { label: 'Note', color: 'bg-gray-100 text-foreground' },
      stage_change: { label: 'Stage', color: 'bg-orange-100 text-orange-800' },
      call: { label: 'Call', color: 'bg-purple-100 text-purple-800' },
      meeting: { label: 'Meeting', color: 'bg-yellow-100 text-warning' },
    };
    return (
      badges[type as keyof typeof badges] || {
        label: 'Activity',
        color: 'bg-gray-100 text-foreground',
      }
    );
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-muted-foreground'>Loading activities...</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
        <Input
          placeholder='Search events...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Activities List */}
      <div className='space-y-3'>
        {filteredActivities.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            No activities found
          </div>
        ) : (
          filteredActivities.map(activity => {
            const Icon = activity.icon;
            const isExpanded = expandedItems.has(activity.id);
            const typeBadge = getTypeBadge(activity.type);
            const isLongContent = activity.description.length > 100;

            return (
              <Card key={activity.id} className='border-l-4 border-l-blue-500'>
                <CardContent className='p-4'>
                  <div className='flex items-start space-x-3'>
                    {/* Activity Icon */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.color}`}
                    >
                      <Icon className='w-4 h-4' />
                    </div>

                    {/* Activity Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <h4 className='text-sm font-medium text-foreground'>
                            {activity.title}
                          </h4>
                          <Badge className={typeBadge.color}>
                            {typeBadge.label}
                          </Badge>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {formatDistanceToNow(parseISO(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>

                      {/* Lead Name */}
                      {activity.leadName && (
                        <div className='text-xs text-primary font-medium mt-1'>
                          Lead: {activity.leadName}
                        </div>
                      )}

                      {/* Author */}
                      {activity.author && (
                        <div className='text-xs text-muted-foreground mt-1'>
                          by {activity.author}
                        </div>
                      )}

                      {/* Description */}
                      <div className='mt-2'>
                        {isLongContent && !isExpanded ? (
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              {activity.description.substring(0, 100)}...
                            </p>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => toggleExpanded(activity.id)}
                              className='mt-1 p-0 h-auto text-primary hover:text-primary'
                            >
                              Show more
                              <ChevronDown className='w-3 h-3 ml-1' />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              {activity.description}
                            </p>
                            {isLongContent && (
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => toggleExpanded(activity.id)}
                                className='mt-1 p-0 h-auto text-primary hover:text-primary'
                              >
                                Show less
                                <ChevronUp className='w-3 h-3 ml-1' />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className='text-xs text-muted-foreground mt-2'>
                        {format(
                          parseISO(activity.timestamp),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
