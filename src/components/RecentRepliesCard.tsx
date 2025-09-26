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
  Reply,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { conversationService, Conversation, ConversationMessage } from '../services/conversationService';
import { cn } from '@/lib/utils';

interface RecentRepliesCardProps {
  className?: string;
  onConversationSelect?: (conversation: Conversation) => void;
  conversationType?: 'all' | 'linkedin' | 'email';
}

interface RecentReply {
  conversation: Conversation;
  latestReply: ConversationMessage;
  replyCount: number;
}

export const RecentRepliesCard: React.FC<RecentRepliesCardProps> = ({
  className,
  onConversationSelect,
  conversationType = 'all'
}) => {
  const [recentReplies, setRecentReplies] = useState<RecentReply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentReplies();
  }, [conversationType]);

  const loadRecentReplies = async () => {
    try {
      setLoading(true);
      
      // Get all conversations
      const conversations = await conversationService.getConversations();
      
      // Filter by conversation type if specified
      let filteredConversations = conversations;
      if (conversationType !== 'all') {
        filteredConversations = conversations.filter(conv => conv.conversation_type === conversationType);
      }
      
      // Get recent replies for each conversation
      const replies: RecentReply[] = [];
      
      for (const conversation of filteredConversations.slice(0, 20)) { // Limit to 20 most recent
        try {
          const messages = await conversationService.getConversationMessages(conversation.id);
          
          // Find the latest reply from 'them' (not from us)
          const replyMessages = messages.filter(msg => msg.sender_type === 'them');
          
          if (replyMessages.length > 0) {
            // Sort by received_at to get the most recent
            const latestReply = replyMessages.sort((a, b) => 
              new Date(b.received_at).getTime() - new Date(a.received_at).getTime()
            )[0];
            
            replies.push({
              conversation,
              latestReply,
              replyCount: replyMessages.length
            });
          }
        } catch (error) {
          console.error('Failed to load messages for conversation:', conversation.id, error);
        }
      }
      
      // Sort by most recent reply
      replies.sort((a, b) => 
        new Date(b.latestReply.received_at).getTime() - new Date(a.latestReply.received_at).getTime()
      );
      
      setRecentReplies(replies.slice(0, 10)); // Show top 10 most recent replies
    } catch (error) {
      console.error('Failed to load recent replies:', error);
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

  const truncateMessage = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getReplyStatusIcon = (conversation: Conversation) => {
    if (!conversation.is_read) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <Card className={cn("border-0 shadow-sm bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Reply className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Message Activity</CardTitle>
              <p className="text-sm text-gray-600">{recentReplies.length} active conversations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadRecentReplies}
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
        <ScrollArea className="h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600" />
            </div>
          ) : recentReplies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Reply className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No recent replies</p>
              <p className="text-xs text-gray-400">Replies will appear here</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {recentReplies.map((reply) => (
                <div
                  key={`${reply.conversation.id}-${reply.latestReply.id}`}
                  className={cn(
                    "group p-4 cursor-pointer rounded-xl transition-all duration-200",
                    "hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200",
                    !reply.conversation.is_read && "bg-orange-50/30"
                  )}
                  onClick={() => {
                    if (onConversationSelect) {
                      onConversationSelect(reply.conversation);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Channel Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getChannelIcon(reply.conversation.conversation_type)}
                    </div>
                    
                    {/* Reply Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            !reply.conversation.is_read ? "text-gray-900 font-semibold" : "text-gray-700"
                          )}>
                            {reply.conversation.person_name || 'Unknown Person'}
                          </h4>
                          {getChannelBadge(reply.conversation.conversation_type)}
                          {reply.replyCount > 1 && (
                            <StatusBadge status={`${reply.replyCount} replies`} size="sm" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(reply.latestReply.received_at)}</span>
                        </div>
                      </div>
                      
                      {reply.conversation.person_company && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{reply.conversation.person_company}</span>
                        </div>
                      )}
                      
                      {/* Reply Message Preview */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Reply className="h-3 w-3 text-gray-500" />
                          <span className="text-xs font-medium text-gray-600">Latest Reply:</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {truncateMessage(reply.latestReply.content)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getReplyStatusIcon(reply.conversation)}
                          <span className="text-xs text-gray-500">
                            {reply.conversation.is_read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                    
                    {/* Unread indicator */}
                    {!reply.conversation.is_read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
