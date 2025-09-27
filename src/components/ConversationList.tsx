import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  MessageSquareText, 
  Clock, 
  User, 
  Building2,
  CheckCircle,
  AlertCircle,
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  Linkedin
} from 'lucide-react';
import { conversationService, Conversation } from '../services/conversationService';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ConversationListProps {
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: string;
  className?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onConversationSelect,
  selectedConversationId,
  className
}) => {
  console.log('ConversationList component mounted');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, [filter]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch people who have actually replied (true conversations)
      const { data, error } = await supabase
        .from('people')
        .select(`
          id,
          name,
          email_address,
          company_id,
          linkedin_url,
          stage,
          last_reply_at,
          last_reply_channel,
          last_reply_message,
          message_sent_date,
          email_sent_date,
          linkedin_connected,
          email_sent,
          created_at,
          updated_at,
          companies(
            name
          )
        `)
        .not('last_reply_message', 'is', null)
        .neq('last_reply_message', '')
        .order('last_reply_at', { ascending: false, nullsFirst: false })
        .limit(50);

      if (error) {
        console.error('Supabase error:', error);
        alert('Error fetching data: ' + error.message);
        return;
      }

      console.log('Raw data from Supabase:', data);
      console.log('Data length:', data?.length);
      console.log('Error:', error);

      // Transform to conversation format
      const conversations = (data || []).map(person => ({
        id: person.id,
        person_id: person.id,
        linkedin_message_id: undefined,
        subject: undefined,
        participants: [person.email_address || person.name].filter(Boolean),
        last_message_at: person.last_reply_at || person.message_sent_date || person.created_at,
        is_read: !!person.last_reply_message,
        conversation_type: person.last_reply_channel === 'email' ? 'email' : 'linkedin',
        status: person.stage === 'replied' ? 'active' : 
                person.stage === 'connected' ? 'active' : 'active',
        created_at: person.created_at,
        updated_at: person.updated_at,
        person_name: person.name,
        person_email: person.email_address,
        person_company: person.companies?.name,
        person_linkedin_url: person.linkedin_url,
        message_count: 1,
        // Add the actual message content
        last_reply_message: person.last_reply_message,
      }));

      console.log('Transformed conversations:', conversations);
      setConversations(conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      alert('Failed to load conversations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getStatusIcon = (conversation: Conversation) => {
    if (!conversation.is_read) {
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
    return <MessageSquareText className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusBadge = (conversation: Conversation) => {
    if (!conversation.is_read) {
      return <StatusBadge status="New Lead" size="sm" />;
    }
    return null;
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conversation.person_name?.toLowerCase().includes(query) ||
      conversation.person_company?.toLowerCase().includes(query)
    );
  });

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Modern Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Replies</h2>
            <p className="text-sm text-gray-500">{filteredConversations.length} conversations</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs text-gray-400">LinkedIn messages will appear here</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative p-3 cursor-pointer rounded-lg transition-all duration-200",
                    "hover:bg-gray-50",
                    selectedConversationId === conversation.id
                      ? "bg-blue-50 border border-blue-200"
                      : "",
                    !conversation.is_read && "bg-blue-50/50"
                  )}
                  onClick={() => onConversationSelect(conversation)}
                >
                  {/* Unread indicator */}
                  {!conversation.is_read && (
                    <div className="absolute left-3 top-3 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      conversation.conversation_type === 'email' 
                        ? "bg-emerald-100" 
                        : "bg-blue-100"
                    )}>
                      {conversation.conversation_type === 'email' ? (
                        <Mail className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Linkedin className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            "text-sm font-medium truncate",
                            !conversation.is_read ? "text-gray-900" : "text-gray-700"
                          )}>
                            {conversation.person_name || 'Unknown Person'}
                          </h3>
                          {conversation.person_company && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {conversation.person_company}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 ml-2">
                          {formatDate(conversation.last_message_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
