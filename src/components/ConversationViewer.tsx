import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Building2,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
  MoreHorizontal,
  Reply,
  Forward,
  Archive
} from 'lucide-react';
import { conversationService, Conversation, ConversationMessage } from '../services/conversationService';
import { cn } from '@/lib/utils';

interface ConversationViewerProps {
  conversation: Conversation | null;
  className?: string;
}

export const ConversationViewer: React.FC<ConversationViewerProps> = ({
  conversation,
  className
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      markAsRead();
    }
  }, [conversation]);

  const loadMessages = async () => {
    if (!conversation) return;

    try {
      setLoading(true);
      
      // Since we don't have a conversation_messages table, create a mock message from the conversation data
      const mockMessage: ConversationMessage = {
        id: `msg-${conversation.id}`,
        conversation_id: conversation.id,
        person_id: conversation.person_id,
        sender_type: 'them',
        sender_name: conversation.person_name || 'Unknown',
        sender_email: conversation.person_email,
        content: conversation.last_reply_message || 'No message content',
        message_type: 'reply',
        is_read: conversation.is_read,
        sent_at: conversation.last_message_at,
        received_at: conversation.last_message_at,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at,
      };
      
      setMessages([mockMessage]);
      
      // Auto-scroll to bottom after messages load
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!conversation) return;

    try {
      await conversationService.markConversationAsRead(conversation.id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageIcon = (message: ConversationMessage) => {
    switch (message.sender_type) {
      case 'us':
        return <Send className="h-4 w-4 text-green-500" />;
      case 'them':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMessageBadge = (message: ConversationMessage) => {
    if (message.expandi_status) {
      switch (message.expandi_status) {
        case 'sent':
          return <StatusBadge status="Sent" size="sm" />;
        case 'delivered':
          return <StatusBadge status="Delivered" size="sm" />;
        case 'failed':
          return <StatusBadge status="Failed" size="sm" />;
        case 'pending':
          return <StatusBadge status="Pending" size="sm" />;
      }
    }
    return null;
  };

  if (!conversation) {
    return (
      <div className={cn("h-full flex flex-col", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Conversation Selected</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Choose a conversation from the list to view messages and continue your LinkedIn outreach
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Modern Chat Header */}
      <div className="p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {conversation.person_name || 'Unknown Person'}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {conversation.person_company && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{conversation.person_company}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last active {formatDate(conversation.last_message_at)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {conversation.person_linkedin_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(conversation.person_linkedin_url, '_blank')}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No messages found</p>
              <p className="text-xs text-gray-400">Messages will appear here</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {messages.map((message, index) => (
                <div key={message.id} className={cn(
                  "flex gap-3",
                  message.sender_type === 'us' ? 'justify-end' : 'justify-start'
                )}>
                  {/* Avatar for incoming messages */}
                  {message.sender_type !== 'us' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[70%] space-y-2",
                    message.sender_type === 'us' ? 'items-end' : 'items-start'
                  )}>
                    {/* Message Header */}
                    <div className={cn(
                      "flex items-center gap-2 text-xs text-gray-500",
                      message.sender_type === 'us' ? 'justify-end' : 'justify-start'
                    )}>
                      <span className="font-medium">
                        {message.sender_type === 'us' ? 'You' : message.sender_name || 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>{formatDate(message.received_at)}</span>
                      {getMessageBadge(message)}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={cn(
                      "rounded-lg px-4 py-3 shadow-sm transition-all duration-200",
                      message.sender_type === 'us'
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    )}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                  
                  {/* Avatar for outgoing messages */}
                  {message.sender_type === 'us' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Modern Message Input */}
      <div className="p-6 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
