import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Archive,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Forward,
  Linkedin,
  Mail,
  MailOpen,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Reply,
  Search,
  Star,
  Timer,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';

// Types for email inbox
interface EmailThread {
  id: string;
  person_id: string;
  person_name: string;
  person_email: string;
  person_company?: string;
  person_job_title?: string;
  subject: string;
  last_message_at: string;
  is_read: boolean;
  message_count: number;
  last_message_preview: string;
  lead_status?:
    | 'interested'
    | 'not_interested'
    | 'out_of_office'
    | 'no_response'
    | 'meeting_scheduled';
  campaign_name?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  is_starred?: boolean;
  is_snoozed?: boolean;
  snooze_until?: string;
}

interface EmailMessage {
  id: string;
  thread_id: string;
  from_email: string;
  to_emails: string[];
  subject: string;
  body_text: string;
  body_html?: string;
  is_sent: boolean;
  sent_at?: string;
  received_at: string;
  attachments?: Record<string, unknown>[];
}

// Main Conversations Page Component
const ConversationsPage: React.FC = () => {
  console.log('🚀 Smartlead-style Inbox loaded');

  const [activeView, setActiveView] = useState('inbox');
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(
    null
  );
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Set page meta tags
  usePageMeta({
    title: 'Master Inbox - Empowr CRM',
    description:
      'Smartlead-style master inbox for managing all your LinkedIn and email conversations.',
    keywords:
      'master inbox, conversations, LinkedIn, email, leads, CRM, Smartlead',
    ogTitle: 'Master Inbox - Empowr CRM',
    ogDescription:
      'Smartlead-style master inbox for managing all your conversations.',
    twitterTitle: 'Master Inbox - Empowr CRM',
    twitterDescription:
      'Smartlead-style master inbox for managing all your conversations.',
  });

  // Load conversations from both LinkedIn and email
  const loadThreads = async () => {
    try {
      setLoading(true);

      // Fetch people with conversations (both LinkedIn and email)
      const { data, error } = await supabase
        .from('people')
        .select(
          `
          id,
          name,
          email_address,
          company_role,
          linkedin_url,
          last_reply_at,
          last_reply_channel,
          last_reply_message,
          message_sent_date,
          email_sent_date,
          linkedin_connected,
          email_sent,
          stage,
          created_at,
          updated_at,
          companies(name, website)
        `
        )
        .or(
          'last_reply_message.not.is.null,linkedin_connected.eq.true,email_sent.eq.true'
        )
        .order('last_reply_at', { ascending: false, nullsFirst: false })
        .limit(50);

      if (error) throw error;

      // Transform to EmailThread format
      const transformedThreads: EmailThread[] = (data || []).map(person => ({
        id: person.id,
        person_id: person.id,
        person_name: person.name || 'Unknown',
        person_email: person.email_address || '',
        person_company: person.companies?.name,
        person_job_title: person.company_role,
        subject: person.last_reply_message
          ? 'Got reply from the lead'
          : 'Outreach sent',
        last_message_at:
          person.last_reply_at || person.message_sent_date || person.created_at,
        is_read: !!person.last_reply_message,
        message_count: 1,
        last_message_preview:
          person.last_reply_message || 'Outreach message sent',
        lead_status:
          person.stage === 'replied'
            ? 'interested'
            : person.stage === 'connected'
              ? 'interested'
              : 'no_response',
        campaign_name: 'Client:AES_C1',
        priority: 'medium',
        tags: [],
        is_starred: false,
        is_snoozed: false,
      }));

      setThreads(transformedThreads);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for selected thread
  const loadMessages = async (threadId: string) => {
    try {
      setMessagesLoading(true);

      // For now, create mock messages since we don't have detailed message history
      const mockMessages: EmailMessage[] = [
        {
          id: '1',
          thread_id: threadId,
          from_email: 'us@company.com',
          to_emails: ['lead@company.com'],
          subject: 'Outreach Message',
          body_text:
            'Hi there! I came across your profile and thought you might be interested in our opportunity...',
          body_html:
            'Hi there! I came across your profile and thought you might be interested in our opportunity...',
          is_sent: true,
          sent_at: '2025-01-15T10:00:00Z',
          received_at: '2025-01-15T10:00:00Z',
          attachments: [],
        },
        {
          id: '2',
          thread_id: threadId,
          from_email: 'lead@company.com',
          to_emails: ['us@company.com'],
          subject: 'Re: Outreach Message',
          body_text:
            'Thanks for reaching out! I am interested in learning more about this opportunity.',
          body_html:
            'Thanks for reaching out! I am interested in learning more about this opportunity.',
          is_sent: false,
          received_at: '2025-01-16T14:30:00Z',
          attachments: [],
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Handle thread selection
  const handleThreadSelect = (thread: EmailThread) => {
    setSelectedThread(thread);
    loadMessages(thread.id);
  };

  // Load data on mount
  useEffect(() => {
    loadThreads();
  }, []);

  const unreadCount = threads.filter(t => !t.is_read).length;

  return (
    <div className='bg-white -mx-4 -my-4 lg:-mx-6 lg:-my-6'>
      <div className='flex bg-white' style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Left Sidebar - Smartlead Style (Narrow) */}
        <div className='w-56 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0'>
          {/* Search Section */}
          <div className='p-4 border-b border-gray-200'>
            <div className='relative mb-3'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search lead'
                className='pl-10 bg-white border-gray-300 text-sm h-9'
              />
            </div>
            <select className='w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white h-8'>
              <option>FOR ME</option>
              <option>ALL TEAM</option>
            </select>
          </div>

          {/* Navigation Items */}
          <div className='flex-1 p-3'>
            <div className='space-y-1'>
              {[
                {
                  id: 'inbox',
                  label: 'Inbox',
                  icon: MailOpen,
                  count: unreadCount,
                },
                { id: 'unread', label: 'Unread Replies', icon: Mail },
                { id: 'sent', label: 'Sent', icon: MessageSquare },
                { id: 'important', label: 'Important', icon: Star },
                { id: 'snoozed', label: 'Snoozed', icon: Clock },
                { id: 'reminders', label: 'Reminders', icon: Calendar },
                { id: 'scheduled', label: 'Scheduled', icon: Calendar },
                { id: 'archived', label: 'Archived', icon: Archive },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors',
                    activeView === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <item.icon className='h-4 w-4' />
                    <span>{item.label}</span>
                  </div>
                  {item.count && item.count > 0 && (
                    <Badge
                      variant='secondary'
                      className='bg-red-100 text-red-700 text-xs px-2 py-0.5 h-5'
                    >
                      {item.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            <Separator className='my-4' />

            {/* Views Section */}
            <div>
              <div className='flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide'>
                <span>Views</span>
                <div className='flex gap-1'>
                  <Search className='h-3 w-3' />
                  <span className='text-blue-600'>+</span>
                </div>
              </div>
              <div className='text-xs text-gray-400 px-3 py-1 mb-2'>
                Upgrade to PRO or CUSTOM plan to add unlimited views.
              </div>

              {[
                { id: 'interested', label: 'Interested', icon: CheckCircle },
                {
                  id: 'out_of_office',
                  label: 'Out of Office',
                  icon: AlertCircle,
                },
                { id: 'no_response', label: 'No Response', icon: Clock },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors',
                    activeView === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Thread List (Smartlead Width) */}
        <div className='w-80 flex flex-col bg-white flex-shrink-0 border-l border-gray-200'>
          {/* Header */}
          <div className='p-4 border-b border-gray-200 bg-white'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <h2 className='text-sm font-semibold text-gray-900'>Inbox</h2>
                <Button variant='ghost' size='sm' className='h-7 w-7 p-0'>
                  <RefreshCw className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 w-7 p-0 relative'
                >
                  <Filter className='h-4 w-4' />
                  <Badge className='absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs'>
                    1
                  </Badge>
                </Button>
              </div>
            </div>
            <Badge
              variant='outline'
              className='bg-yellow-50 text-yellow-700 border-yellow-200 text-sm mt-2'
            >
              Syncs every 1-2 hours
            </Badge>
          </div>

          {/* Thread List */}
          <div className='flex-1 overflow-y-auto'>
            {loading ? (
              <div className='flex items-center justify-center h-32'>
                <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600' />
              </div>
            ) : threads.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-gray-500 p-4'>
                <Mail className='h-10 w-10 mb-3 opacity-30' />
                <p className='text-base font-medium'>No Conversations</p>
                <p className='text-sm text-gray-400 text-center'>
                  Start engaging with your leads to see conversations here.
                </p>
              </div>
            ) : (
              <div className='divide-y divide-gray-100'>
                {threads.map(thread => (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread)}
                    className={cn(
                      'p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-transparent',
                      selectedThread?.id === thread.id &&
                        'bg-blue-50 border-l-blue-500',
                      !thread.is_read && 'bg-blue-50/50'
                    )}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 mt-1'>
                        {thread.last_message_preview.includes('LinkedIn') ? (
                          <Linkedin className='h-4 w-4 text-blue-600' />
                        ) : (
                          <Mail className='h-4 w-4 text-gray-400' />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='font-medium text-gray-900 text-sm truncate'>
                            {thread.person_name}
                          </span>
                          <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>
                            {new Date(
                              thread.last_message_at
                            ).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className='text-xs text-gray-600 mb-1 truncate'>
                          {thread.person_email}
                        </div>
                        <div className='text-xs text-gray-500 mb-2'>
                          Got reply from the lead
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge className='bg-pink-100 text-pink-700 text-xs px-2 py-1 h-5'>
                            Out Of Office
                          </Badge>
                          <Badge
                            variant='outline'
                            className='text-xs px-2 py-1 h-5'
                          >
                            <Zap className='h-3 w-3 mr-1' />
                            Client:AES_C1
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Message View */}
        <div className='flex-1 flex flex-col bg-white min-w-0 border-l border-gray-200'>
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className='p-4 border-b border-gray-200 bg-white'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                        <User className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <h2 className='text-base font-semibold text-gray-900'>
                          {selectedThread.person_name}
                        </h2>
                        <p className='text-xs text-gray-600'>
                          {selectedThread.person_email}
                        </p>
                      </div>
                    </div>

                    {selectedThread.person_company && (
                      <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                        <Building2 className='h-4 w-4' />
                        <span>{selectedThread.person_company}</span>
                        {selectedThread.person_job_title && (
                          <span>• {selectedThread.person_job_title}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' className='h-7 text-xs'>
                      <Star className='h-3 w-3 mr-1' />
                      Star
                    </Button>
                    <Button variant='outline' size='sm' className='h-7 text-xs'>
                      <Timer className='h-3 w-3 mr-1' />
                      Snooze
                    </Button>
                    <Button variant='outline' size='sm' className='h-7 w-7 p-0'>
                      <MoreHorizontal className='h-3 w-3' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Badge className='bg-green-100 text-green-700 text-xs'>
                    Interested
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    <Zap className='h-3 w-3 mr-1' />
                    Client:AES_C1
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <div className='flex-1 p-4 overflow-y-auto'>
                <div className='space-y-4'>
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        'p-3 rounded border',
                        message.is_sent
                          ? 'bg-blue-50 border-blue-200 ml-6'
                          : 'bg-gray-50 border-gray-200 mr-6'
                      )}
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          {message.is_sent ? (
                            <Mail className='h-3 w-3 text-blue-600' />
                          ) : (
                            <MailOpen className='h-3 w-3 text-gray-600' />
                          )}
                          <span className='font-medium text-sm'>
                            {message.is_sent ? 'You' : message.from_email}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                          <Clock className='h-3 w-3' />
                          <span>
                            {new Date(message.received_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className='prose prose-sm max-w-none text-sm'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: message.body_html || message.body_text,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Section */}
              <div className='p-4 border-t border-gray-200 bg-gray-50'>
                <div className='flex items-center gap-2 mb-3'>
                  <Button variant='outline' size='sm' className='h-7 text-xs'>
                    <Reply className='h-3 w-3 mr-1' />
                    Reply
                  </Button>
                  <Button variant='outline' size='sm' className='h-7 text-xs'>
                    <Forward className='h-3 w-3 mr-1' />
                    Forward
                  </Button>
                  <Button variant='outline' size='sm' className='h-7 text-xs'>
                    <Trash2 className='h-3 w-3 mr-1' />
                    Delete
                  </Button>
                </div>

                <div className='border border-gray-300 rounded p-3 bg-white'>
                  <textarea
                    placeholder='Type your reply...'
                    className='w-full h-20 resize-none border-none outline-none text-sm'
                  />
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
              <div className='text-center'>
                <div className='relative mb-4'>
                  <Mail className='h-16 w-16 text-gray-300 mx-auto' />
                  <div className='absolute -top-2 -left-2 bg-gray-200 rounded px-2 py-1'>
                    <div className='flex gap-1'>
                      <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                      <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                      <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                    </div>
                  </div>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  Your master inbox
                </h3>
                <p className='text-sm text-gray-600'>
                  To access the inbox, simply click on the lead.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
