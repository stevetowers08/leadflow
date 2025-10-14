import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { getStatusDisplayText } from '@/utils/statusUtils';
import {
    ChevronDown,
    Filter,
    Mail,
    MessageSquare,
    MessageSquareText,
    Search
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Conversation } from '../../../services/conversationService';
import { StatusBadge } from '../../StatusBadge';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';

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
  const [filter, setFilter] = useState<'all' | 'unread' | 'email' | 'linkedin'>('all');
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
          company_role,
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
            name,
            website
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
        person_company_website: person.companies?.website,
        person_job_title: person.company_role,
        person_linkedin_url: person.linkedin_url,
        message_count: 1,
        // Add the actual message content
        last_reply_message: person.last_reply_message,
      }));

      console.log('Transformed conversations:', conversations);
      setConversations(conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to load conversations: ' + errorMessage);
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
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
      return <StatusBadge status={getStatusDisplayText("new")} size="sm" />;
    }
    return null;
  };

  // Filter conversations based on search query and filter
  const filteredConversations = conversations.filter(conversation => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        conversation.person_name?.toLowerCase().includes(query) ||
        conversation.person_company?.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Apply type filter
    switch (filter) {
      case 'unread':
        return !conversation.is_read;
      case 'email':
        return conversation.conversation_type === 'email';
      case 'linkedin':
        return conversation.conversation_type === 'linkedin';
      case 'all':
      default:
        return true;
    }
  });

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Modern Header with Gradient */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Conversations</h2>
            <p className="text-sm text-muted-foreground">{filteredConversations.length} active conversations</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filter === 'all' ? 'All' : 
                   filter === 'unread' ? 'Unread' :
                   filter === 'email' ? 'Email' : 'LinkedIn'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Conversations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('email')}>
                  Email Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('linkedin')}>
                  LinkedIn Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations, people, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
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
            <div className="p-4 space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group",
                    selectedConversationId === conversation.id && "bg-sidebar-primary/10",
                    !conversation.is_read && "bg-sidebar-primary/5"
                  )}
                  onClick={() => onConversationSelect(conversation)}
                >
                  <div className="flex items-center gap-3">
                    {/* Channel Icon */}
                    <div className="flex-shrink-0">
                      {conversation.conversation_type === 'email' ? (
                        <Mail className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {conversation.person_name || 'Unknown Person'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {conversation.person_job_title && `${conversation.person_job_title} • `}
                        {conversation.person_company || 'No company'}
                      </div>
                    </div>
                    
                    {/* Time and Badge */}
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">
                        {formatDate(conversation.last_message_at)}
                      </div>
                      {!conversation.is_read && (
                        <Badge className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                          New
                        </Badge>
                      )}
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
