import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ConversationList } from '../components/crm/communications/ConversationList';
import { ConversationViewer } from '../components/crm/communications/ConversationViewer';
import { conversationService, Conversation } from '../services/conversationService';
import { Page } from '@/design-system/components';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';

// Modern Conversations Page with Message Notifications
const ConversationsPage: React.FC = () => {
  console.log('ConversationsPage component mounted');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  // Set page meta tags
  usePageMeta({
    title: 'Conversations - Empowr CRM',
    description: 'Manage all your communication channels in one place. Track LinkedIn messages, email threads, and candidate conversations.',
    keywords: 'conversations, messages, LinkedIn, email, communication, CRM, candidate engagement',
    ogTitle: 'Conversations - Empowr CRM',
    ogDescription: 'Manage all your communication channels in one place.',
    twitterTitle: 'Conversations - Empowr CRM',
    twitterDescription: 'Manage all your communication channels in one place.'
  });

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <Page
      title="Conversations"
    >

      {/* Main Conversation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversation List - Mobile Stack */}
        <div className="lg:col-span-5">
          <Card className="h-[calc(100vh-200px)] lg:h-[calc(100vh-200px)] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <ConversationList
              onConversationSelect={handleConversationSelect}
              selectedConversationId={selectedConversation?.id}
            />
          </Card>
        </div>
        
        {/* Conversation Viewer - Mobile Stack */}
        <div className="lg:col-span-7">
          <Card className="h-[calc(100vh-200px)] lg:h-[calc(100vh-200px)] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <ConversationViewer conversation={selectedConversation} />
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default ConversationsPage;
