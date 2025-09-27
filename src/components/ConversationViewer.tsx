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
      <div className={cn("h-full flex flex-col bg-gradient-to-b from-background to-muted/20", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/10">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">No Conversation Selected</h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Choose a conversation from the list to view messages, reply to leads, and continue your outreach efforts
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Email replies</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>LinkedIn messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col bg-gradient-to-b from-background to-muted/20", className)}>
      {/* Enhanced Chat Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {conversation.person_name || 'Unknown Person'}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                {conversation.person_company && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{conversation.person_company}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last active {formatDate(conversation.last_message_at)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {conversation.person_linkedin_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(conversation.person_linkedin_url, '_blank')}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            )}
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
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
            <div className="p-6 space-y-8">
              {messages.map((message, index) => (
                <div key={message.id} className={cn(
                  "flex gap-4",
                  message.sender_type === 'us' ? 'justify-end' : 'justify-start'
                )}>
                  {/* Avatar for incoming messages */}
                  {message.sender_type !== 'us' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-muted to-muted/80 rounded-xl flex items-center justify-center shadow-sm border border-border">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[75%] space-y-3",
                    message.sender_type === 'us' ? 'items-end' : 'items-start'
                  )}>
                    {/* Message Header */}
                    <div className={cn(
                      "flex items-center gap-2 text-xs text-muted-foreground",
                      message.sender_type === 'us' ? 'justify-end' : 'justify-start'
                    )}>
                      <span className="font-semibold">
                        {message.sender_type === 'us' ? 'You' : message.sender_name || 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>{formatDate(message.received_at)}</span>
                      {getMessageBadge(message)}
                    </div>
                    
                    {/* Modern Message Bubble */}
                    <div className={cn(
                      "rounded-2xl px-5 py-4 shadow-sm transition-all duration-200 relative",
                      message.sender_type === 'us'
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}>
                      {/* Chat bubble tail */}
                      <div className={cn(
                        "absolute top-4 w-0 h-0",
                        message.sender_type === 'us' 
                          ? "right-[-8px] border-l-[8px] border-l-primary border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                          : "left-[-8px] border-r-[8px] border-r-card border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                      )} />
                      
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                  
                  {/* Avatar for outgoing messages */}
                  {message.sender_type === 'us' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Enhanced Message Input */}
      <div className="p-6 border-t border-border bg-gradient-to-r from-background to-muted/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your reply..."
              className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
              <Archive className="h-4 w-4" />
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Quick actions:</span>
          <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
            Schedule follow-up
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
            Add to pipeline
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
            Mark as qualified
          </Button>
        </div>
      </div>
    </div>
  );
};
