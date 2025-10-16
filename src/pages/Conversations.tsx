import { Page } from '@/design-system/components';
import { usePageMeta } from '@/hooks/usePageMeta';
import React, { useState } from 'react';
import { ConversationList } from '../components/crm/communications/ConversationList';
import { ConversationViewer } from '../components/crm/communications/ConversationViewer';
import { Card } from '../components/ui/card';
import { Conversation } from '../services/conversationService';

// Modern Conversations Page with Message Notifications
const ConversationsPage: React.FC = () => {
  console.log('ConversationsPage component mounted');
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  // Set page meta tags
  usePageMeta({
    title: 'Conversations - Empowr CRM',
    description:
      'Manage all your communication channels in one place. Track LinkedIn messages, email threads, and candidate conversations.',
    keywords:
      'conversations, messages, LinkedIn, email, communication, CRM, candidate engagement',
    ogTitle: 'Conversations - Empowr CRM',
    ogDescription: 'Manage all your communication channels in one place.',
    twitterTitle: 'Conversations - Empowr CRM',
    twitterDescription: 'Manage all your communication channels in one place.',
  });

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <Page title='Conversations'>
      {/* Main Conversation Interface - Full Width */}
      <div className='flex flex-col lg:flex-row gap-6 w-full min-h-0 flex-1'>
        {/* Conversation List - Mobile Stack */}
        <div className='lg:w-5/12 flex flex-col min-h-0'>
          <Card className='flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex-1 min-h-0'>
            <ConversationList
              onConversationSelect={handleConversationSelect}
              selectedConversationId={selectedConversation?.id}
            />
          </Card>
        </div>

        {/* Conversation Viewer - Mobile Stack */}
        <div className='lg:w-7/12 flex flex-col min-h-0'>
          <Card className='flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex-1 min-h-0'>
            <ConversationViewer conversation={selectedConversation} />
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default ConversationsPage;
