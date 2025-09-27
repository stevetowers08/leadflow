import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Inbox, Search, Plus } from 'lucide-react';
import { EmailComposer } from '../components/EmailComposer';
import { EmailThreadViewer } from '../components/EmailThreadViewer';
import { EmailStatsCards } from '../components/EmailStatsCards';
import { gmailService, EmailThread } from '../services/gmailService';
import { Tables } from '../integrations/supabase/types';
import { Page, StatItemProps } from '@/design-system/components';

export const EmailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailStats, setEmailStats] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    sentToday: 0,
    lastSync: null as string | null,
  });

  useEffect(() => {
    loadEmailThreads();
  }, []);

  const loadEmailThreads = async () => {
    try {
      setLoading(true);
      const emailThreads = await gmailService.getEmailThreads();
      setThreads(emailThreads);
      
      // Update stats
      const unreadCount = emailThreads.filter(thread => !thread.is_read).length;
      const today = new Date().toDateString();
      const sentToday = emailThreads.filter(thread => 
        new Date(thread.last_message_at).toDateString() === today
      ).length;
      
      setEmailStats({
        totalEmails: emailThreads.length,
        unreadEmails: unreadCount,
        sentToday,
        lastSync: emailThreads.length > 0 ? new Date().toISOString() : null,
      });
    } catch (error) {
      console.error('Failed to load email threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleThreadClick = (thread: EmailThread) => {
    setSelectedThread(thread);
  };

  const handleComposeSent = () => {
    loadEmailThreads(); // Refresh threads after sending
    setActiveTab('inbox');
  };

  const stats: StatItemProps[] = [
    {
      label: "Total Emails",
      value: emailStats.totalEmails.toString(),
      icon: Mail,
      trend: null,
    },
    {
      label: "Unread Emails",
      value: emailStats.unreadEmails.toString(),
      icon: Inbox,
      trend: null,
    },
    {
      label: "Sent Today",
      value: emailStats.sentToday.toString(),
      icon: Plus,
      trend: null,
    },
    {
      label: "Last Sync",
      value: emailStats.lastSync ? new Date(emailStats.lastSync).toLocaleDateString() : "Never",
      icon: Search,
      trend: null,
    },
  ];

  return (
    <Page
      title="Email"
      subtitle="Manage your Gmail integration and email communications"
      stats={stats}
    >
      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => setActiveTab('compose')}>
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Compose
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="h-5 w-5" />
                    Email Threads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : filteredThreads.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No email threads found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredThreads.map((thread) => (
                          <div
                            key={thread.id}
                            onClick={() => handleThreadClick(thread)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                              selectedThread?.id === thread.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm truncate">
                                  {thread.subject || 'No Subject'}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {!thread.is_read && (
                                    <StatusBadge status="Unread" size="sm" />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(thread.last_message_at)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {thread.participants.join(', ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedThread ? (
                <EmailThreadViewer
                  threadId={selectedThread.id}
                  onClose={() => setSelectedThread(null)}
                />
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      Select an email thread to view messages
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compose">
          <div className="max-w-2xl mx-auto">
            <EmailComposer onSent={handleComposeSent} />
          </div>
        </TabsContent>

      </Tabs>
    </Page>
  );
};
