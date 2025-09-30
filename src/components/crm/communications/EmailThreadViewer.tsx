import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, MailOpen, Clock, User } from 'lucide-react';
import { gmailService, EmailThread, EmailMessage } from '../../../services/gmailService';

interface EmailThreadViewerProps {
  threadId: string;
  onClose?: () => void;
}

export const EmailThreadViewer: React.FC<EmailThreadViewerProps> = ({ 
  threadId, 
  onClose 
}) => {
  const [thread, setThread] = useState<EmailThread | null>(null);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreadData();
  }, [threadId]);

  const loadThreadData = async () => {
    try {
      setLoading(true);
      const [threadData, messagesData] = await Promise.all([
        gmailService.getEmailThreads().then(threads => threads.find(t => t.id === threadId)),
        gmailService.getEmailMessages(threadId)
      ]);
      
      setThread(threadData || null);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load thread data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!thread) return;
    
    try {
      await gmailService.markAsRead(thread.gmail_thread_id);
      setThread(prev => prev ? { ...prev, is_read: true } : null);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading thread...</div>
        </CardContent>
      </Card>
    );
  }

  if (!thread) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Thread not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{thread.subject}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{thread.participants.join(', ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!thread.is_read && (
              <Badge variant="secondary">Unread</Badge>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-lg border ${
                  message.is_sent 
                    ? 'bg-blue-50 border-blue-200 ml-8' 
                    : 'bg-gray-50 border-gray-200 mr-8'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.is_sent ? (
                      <Mail className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="font-medium">
                      {message.is_sent ? 'You' : message.from_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(message.received_at)}</span>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: message.body_html || message.body_text 
                    }} 
                  />
                </div>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {message.attachments.length} attachment(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {!thread.is_read && (
          <div className="mt-4 pt-4 border-t">
            <Button onClick={markAsRead} size="sm">
              Mark as Read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};








