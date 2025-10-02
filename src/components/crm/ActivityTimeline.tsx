import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Mail, 
  Bot, 
  User, 
  Calendar, 
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Mail as EmailIcon,
  Zap,
  FileText
} from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityTimelineProps {
  entityId: string;
  entityName: string;
  entityType?: "lead" | "company" | "job";
}

interface ActivityItem {
  id: string;
  type: 'linkedin_message' | 'email_message' | 'automation_step' | 'note' | 'stage_change';
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  authorId?: string;
  leadName?: string;
  leadId?: string;
  icon: any;
  color: string;
  metadata?: any;
}

export const ActivityTimeline = ({ entityId, entityName, entityType = "lead" }: ActivityTimelineProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [entityId, entityType]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const allActivities: ActivityItem[] = [];

      // Fetch LinkedIn messages
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          id,
          person_id,
          subject,
          last_message_at,
          conversation_type,
          people!inner(name, company_id, companies(name))
        `)
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
              color: 'bg-blue-100 text-blue-600',
              metadata: { conversationId: conv.id, messageId: message.id }
            });
          }
        }
      }

      // Fetch email messages
      const { data: emailThreads } = await supabase
        .from('email_threads')
        .select(`
          id,
          person_id,
          subject,
          last_message_at,
          people!inner(name, company_id, companies(name))
        `)
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
              color: 'bg-green-100 text-green-600',
              metadata: { threadId: thread.id, emailId: email.id }
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
        // Connection request
        if (personData.connection_request_date) {
          allActivities.push({
            id: `automation_connection_${entityId}`,
            type: 'automation_step',
            title: 'LinkedIn Connection Request Sent',
            description: personData.linkedin_request_message || 'Connection request sent',
            timestamp: personData.connection_request_date,
            leadName: personData.name,
            leadId: entityId,
            icon: Zap,
            color: 'bg-purple-100 text-purple-600',
            metadata: { step: 'connection_request' }
          });
        }

        // Connection accepted
        if (personData.connection_accepted_date) {
          allActivities.push({
            id: `automation_connected_${entityId}`,
            type: 'automation_step',
            title: 'LinkedIn Connection Accepted',
            description: personData.linkedin_connected_message || 'Connection accepted',
            timestamp: personData.connection_accepted_date,
            leadName: personData.name,
            leadId: entityId,
            icon: Zap,
            color: 'bg-purple-100 text-purple-600',
            metadata: { step: 'connection_accepted' }
          });
        }

        // Message sent
        if (personData.message_sent_date) {
          allActivities.push({
            id: `automation_message_${entityId}`,
            type: 'automation_step',
            title: 'LinkedIn Message Sent',
            description: personData.linkedin_follow_up_message || 'Follow-up message sent',
            timestamp: personData.message_sent_date,
            leadName: personData.name,
            leadId: entityId,
            icon: Zap,
            color: 'bg-purple-100 text-purple-600',
            metadata: { step: 'message_sent' }
          });
        }

        // Email sent
        if (personData.email_sent_date) {
          allActivities.push({
            id: `automation_email_${entityId}`,
            type: 'automation_step',
            title: 'Email Sent',
            description: personData.email_draft || 'Email sent',
            timestamp: personData.email_sent_date,
            leadName: personData.name,
            leadId: entityId,
            icon: Zap,
            color: 'bg-purple-100 text-purple-600',
            metadata: { step: 'email_sent' }
          });
        }

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
            color: 'bg-orange-100 text-orange-600',
            metadata: { newStage: personData.stage }
          });
        }
      }

      // Fetch notes
      const { data: notes } = await supabase
        .from('notes')
        .select(`
          id,
          content,
          author_id,
          created_at,
          user_profiles!inner(full_name)
        `)
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
            color: 'bg-gray-100 text-gray-600',
            metadata: { noteId: note.id }
          });
        }
      }

      // Sort all activities by timestamp
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(allActivities);

    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.leadName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const badges = {
      'linkedin_message': { label: 'LinkedIn', color: 'bg-blue-100 text-blue-800' },
      'email_message': { label: 'Email', color: 'bg-green-100 text-green-800' },
      'automation_step': { label: 'Automation', color: 'bg-purple-100 text-purple-800' },
      'note': { label: 'Note', color: 'bg-gray-100 text-gray-800' },
      'stage_change': { label: 'Stage', color: 'bg-orange-100 text-orange-800' }
    };
    return badges[type as keyof typeof badges] || { label: 'Activity', color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No activities found
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const Icon = activity.icon;
            const isExpanded = expandedItems.has(activity.id);
            const typeBadge = getTypeBadge(activity.type);
            const isLongContent = activity.description.length > 100;

            return (
              <Card key={activity.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Activity Icon */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <Badge className={typeBadge.color}>
                            {typeBadge.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                        </div>
                      </div>

                      {/* Lead Name */}
                      {activity.leadName && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Lead: {activity.leadName}
                        </div>
                      )}

                      {/* Author */}
                      {activity.author && (
                        <div className="text-xs text-gray-500 mt-1">
                          by {activity.author}
                        </div>
                      )}

                      {/* Description */}
                      <div className="mt-2">
                        {isLongContent && !isExpanded ? (
                          <div>
                            <p className="text-sm text-gray-700">
                              {activity.description.substring(0, 100)}...
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(activity.id)}
                              className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800"
                            >
                              Show more
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-700">
                              {activity.description}
                            </p>
                            {isLongContent && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(activity.id)}
                                className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800"
                              >
                                Show less
                                <ChevronUp className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-gray-400 mt-2">
                        {format(parseISO(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
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