import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  MessageSquare, 
  RefreshCw, 
  Users,
  MessageSquareText,
  Clock,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  AlertCircle
} from 'lucide-react';
import { ConversationList } from '../components/ConversationList';
import { ConversationViewer } from '../components/ConversationViewer';
import { conversationService, Conversation } from '../services/conversationService';
import { Input } from '../components/ui/input';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';

// Modern Conversations Page with Message Notifications
export const ConversationsPage: React.FC = () => {
  console.log('ConversationsPage component mounted');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadConversations: 0,
    activeConversations: 0,
    messagesToday: 0,
    messagesThisWeek: 0,
    linkedinConversations: 0,
    emailConversations: 0,
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await conversationService.getConversationStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load conversation stats:', error);
      // Set default stats if service fails
      setStats({
        totalConversations: 0,
        unreadConversations: 0,
        activeConversations: 0,
        messagesToday: 0,
        messagesThisWeek: 0,
        linkedinConversations: 0,
        emailConversations: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleRefresh = async () => {
    await loadStats();
    // Refresh conversation list if needed
  };

  const statsCards = [
    {
      title: "Total Conversations",
      value: stats.totalConversations,
      icon: MessageSquare,
    },
    {
      title: "Social Messages",
      value: stats.linkedinConversations,
      icon: MessageSquareText,
    },
    {
      title: "Email Threads",
      value: stats.emailConversations,
      icon: Mail,
    },
    {
      title: "Unread Messages",
      value: stats.unreadConversations,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header - Matching Index Page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Conversations</h1>
          <p className="text-sm text-muted-foreground mt-1">Message threads with your leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 w-64 bg-muted border-border focus:bg-background transition-colors"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="bg-card border-border hover:bg-muted"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>
      {/* Key Metrics - Matching Index Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="shadow-sm !border-none bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.title}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Conversation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversation List - Modern Sidebar */}
        <div className="lg:col-span-5">
          <Card className="h-[calc(100vh-200px)] border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <ConversationList
              onConversationSelect={handleConversationSelect}
              selectedConversationId={selectedConversation?.id}
            />
          </Card>
        </div>
        
        {/* Conversation Viewer - Modern Chat Interface */}
        <div className="lg:col-span-7">
          <Card className="h-[calc(100vh-200px)] border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <ConversationViewer conversation={selectedConversation} />
          </Card>
        </div>
      </div>
    </div>
  );
};
