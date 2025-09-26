import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  Mail, 
  Linkedin,
  Clock,
  User,
  Building2,
  MoreHorizontal,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react';
import { conversationService, Conversation } from '../services/conversationService';
import { cn } from '@/lib/utils';

interface MessageNotificationsCardProps {
  className?: string;
  onConversationSelect?: (conversation: Conversation) => void;
}

interface RecentMessage {
  id: string;
  conversation_id: string;
  person_name: string;
  person_company?: string;
  content: string;
  received_at: string;
  conversation_type: 'linkedin' | 'email';
  sender_type: 'us' | 'them' | 'system';
  is_read: boolean;
}

export const MessageNotificationsCard: React.FC<MessageNotificationsCardProps> = ({
  className,
  onConversationSelect
}) => {
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadRecentMessages();
  }, []);

  const loadRecentMessages = async () => {
    try {
      setLoading(true);
      // Get recent unread messages
      const conversations = await conversationService.getConversations({ isRead: false });
      
      // Get messages for each conversation
      const messages: RecentMessage[] = [];
      for (const conversation of conversations.slice(0, 10)) { // Limit to 10 most recent
        try {
          const conversationMessages = await conversationService.getConversationMessages(conversation.id);
          const latestMessage = conversationMessages[conversationMessages.length - 1];
          
          if (latestMessage && latestMessage.sender_type === 'them') {
            messages.push({
              id: latestMessage.id,
              conversation_id: conversation.id,
              person_name: conversation.person_name || 'Unknown',
              person_company: conversation.person_company,
              content: latestMessage.content,
              received_at: latestMessage.received_at,
              conversation_type: conversation.conversation_type,
              sender_type: latestMessage.sender_type,
              is_read: latestMessage.is_read
            });
          }
        } catch (error) {
          console.error('Failed to load messages for conversation:', conversation.id, error);
        }
      }
      
      // Sort by most recent
      messages.sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());
      setRecentMessages(messages);
    } catch (error) {
      console.error('Failed to load recent messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getChannelIcon = (type: 'linkedin' | 'email') => {
    switch (type) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChannelBadge = (type: 'linkedin' | 'email') => {
    switch (type) {
      case 'linkedin':
        return <StatusBadge status="LinkedIn" size="sm" />;
      case 'email':
        return <StatusBadge status="Email" size="sm" />;
      default:
        return <StatusBadge status="Unknown" size="sm" />;
    }
  };

  const truncateMessage = (content: string, maxLength: number = 80): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const displayedMessages = showAll ? recentMessages : recentMessages.slice(0, 5);

  return (
    <Card className={cn("border-0 shadow-sm bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Messages</CardTitle>
              <p className="text-sm text-gray-600">{recentMessages.length} new messages</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadRecentMessages}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-600" />
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <BellOff className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No new messages</p>
              <p className="text-xs text-gray-400">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {displayedMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "group p-4 cursor-pointer rounded-xl transition-all duration-200",
                    "hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200",
                    !message.is_read && "bg-orange-50/30"
                  )}
                  onClick={() => {
                    // Find the conversation and select it
                    if (onConversationSelect) {
                      // This would need to be implemented to find the conversation by ID
                      // For now, we'll just log it
                      console.log('Select conversation:', message.conversation_id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Channel Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getChannelIcon(message.conversation_type)}
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            !message.is_read ? "text-gray-900 font-semibold" : "text-gray-700"
                          )}>
                            {message.person_name}
                          </h4>
                          {getChannelBadge(message.conversation_type)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(message.received_at)}</span>
                        </div>
                      </div>
                      
                      {message.person_company && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{message.person_company}</span>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {truncateMessage(message.content)}
                      </p>
                    </div>
                    
                    {/* Unread indicator */}
                    {!message.is_read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {/* Show More/Less Button */}
        {recentMessages.length > 5 && (
          <div className="p-4 border-t border-gray-200/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-gray-600 hover:text-gray-900"
            >
              {showAll ? 'Show Less' : `Show ${recentMessages.length - 5} More`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

