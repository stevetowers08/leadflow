import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  Building2,
  Mail,
  MailOpen,
  MessageSquare,
  Search,
  Settings,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EmailThread {
  id: string;
  gmail_thread_id: string;
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

const ConversationsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('inbox');
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(
    null
  );
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSignature, setEmailSignature] = useState('');
  const [showSignatureSettings, setShowSignatureSettings] = useState(false);

  usePageMeta({
    title: 'Conversations - Empowr CRM',
    description: 'Manage all your email conversations with leads.',
  });

  const loadThreads = async () => {
    try {
      setLoading(true);

      // Fetch email threads from Gmail sync
      const { data: emailThreads, error } = await supabase
        .from('email_threads')
        .select(
          `
          id,
          gmail_thread_id,
          subject,
          last_message_at,
          is_read,
          people(
            id,
            name,
            email_address,
            company_role,
            companies(name)
          )
        `
        )
        .order('last_message_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transformedThreads: EmailThread[] = (emailThreads || [])
        .filter(thread => thread.people) // Only show threads with matching people
        .map(thread => ({
          id: thread.id,
          gmail_thread_id: thread.gmail_thread_id,
          person_id: thread.people.id,
          person_name: thread.people.name || 'Unknown',
          person_email: thread.people.email_address || '',
          person_company: thread.people.companies?.name,
          person_job_title: thread.people.company_role,
          subject: thread.subject || 'No subject',
          last_message_at: thread.last_message_at,
          is_read: thread.is_read,
          message_count: 1,
          last_message_preview: thread.subject || '',
        }));

      setThreads(transformedThreads);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      setMessagesLoading(true);

      // Fetch messages for this thread
      const { data: emailMessages, error } = await supabase
        .from('email_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('received_at', { ascending: true });

      if (error) throw error;

      const transformedMessages: EmailMessage[] = (emailMessages || []).map(
        msg => ({
          id: msg.id,
          thread_id: msg.thread_id || threadId,
          from_email: msg.from_email,
          to_emails: msg.to_emails || [],
          subject: msg.subject || '',
          body_text: msg.body_text || '',
          body_html: msg.body_html,
          is_sent: msg.is_sent || false,
          sent_at: msg.sent_at,
          received_at: msg.received_at,
          attachments: msg.attachments || [],
        })
      );

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleThreadSelect = (thread: EmailThread) => {
    setSelectedThread(thread);
    loadMessages(thread.id);
    setReplyText(''); // Clear reply text when switching threads
  };

  const handleSendReply = async () => {
    if (!selectedThread || !replyText.trim()) return;

    try {
      setIsSending(true);

      const messageWithSignature = getFullMessageWithSignature(replyText);

      // For now, just show a success message
      // TODO: Implement actual Gmail API send
      alert('Reply sent! (This is a demo - Gmail API integration needed)');

      // Clear the reply text
      setReplyText('');

      // Refresh messages to show the new sent message
      await loadMessages(selectedThread.id);
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (user) {
      loadEmailSignature();
    }
  }, [user]);

  const loadEmailSignature = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const prefs = data?.preferences as
        | { emailSignature?: string }
        | undefined;
      const signature = prefs?.emailSignature || '';
      setEmailSignature(signature);
    } catch (error) {
      console.error('Failed to load email signature:', error);
    }
  };

  const getFullMessageWithSignature = (messageText: string): string => {
    if (!emailSignature) return messageText;
    return `${messageText}\n\n--\n${emailSignature}`;
  };

  const saveEmailSignature = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from('user_settings').upsert(
        {
          user_id: user.id,
          preferences: { emailSignature },
        },
        { onConflict: 'user_id' }
      );

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save email signature:', error);
      alert('Failed to save signature. Please try again.');
    }
  };

  const unreadCount = threads.filter(t => !t.is_read).length;

  // Filter threads based on active view
  const filteredThreads = threads.filter(thread => {
    if (activeView === 'unread') return !thread.is_read;
    if (activeView === 'sent') return true; // Sent tab shows all threads (they all have sent messages from you)
    return true; // 'inbox' shows all
  });

  return (
    <div className='bg-white -mx-4 -my-4 lg:-mx-6 lg:-my-6'>
      <div className='flex bg-white' style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Left Sidebar - Simplified */}
        <div className='w-56 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0'>
          {/* Search Section */}
          <div className='p-4 border-b border-gray-200'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search conversations'
                className='pl-10 bg-white border-gray-300 text-sm h-9'
              />
            </div>
          </div>

          {/* Navigation Items - Simplified */}
          <div className='flex-1 p-3'>
            <div className='space-y-1'>
              {[
                {
                  id: 'inbox',
                  label: 'Inbox',
                  icon: MailOpen,
                  count: null,
                },
                {
                  id: 'unread',
                  label: 'Unread',
                  icon: Mail,
                  count: unreadCount,
                },
                { id: 'sent', label: 'Sent', icon: MessageSquare, count: null },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors',
                    activeView === item.id
                      ? 'bg-primary-light text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <item.icon className='h-4 w-4' />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null &&
                    item.count !== undefined &&
                    item.count > 0 && (
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
          </div>
        </div>

        {/* Middle Panel - Thread List */}
        <div className='w-80 flex flex-col bg-white flex-shrink-0 border-l border-gray-200'>
          <div className='p-4 border-b border-gray-200 bg-white'>
            <div className='flex items-center justify-between'>
              <h2 className='text-sm font-semibold text-gray-900'>
                Conversations
              </h2>
              <Button variant='ghost' size='sm' className='h-7 w-7 p-0'>
                <Search className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Thread List */}
          <div className='flex-1 overflow-y-auto'>
            {loading ? (
              <div className='flex items-center justify-center h-32'>
                <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary' />
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-gray-500 p-4'>
                <Mail className='h-10 w-10 mb-3 opacity-30' />
                <p className='text-base font-medium'>No Conversations</p>
                <p className='text-sm text-gray-400 text-center mt-2'>
                  Conversations with your leads will appear here once emails are
                  synced from Gmail.
                </p>
              </div>
            ) : (
              <div className='divide-y divide-gray-100'>
                {filteredThreads.map(thread => (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread)}
                    className={cn(
                      'p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-transparent',
                      selectedThread?.id === thread.id &&
                        'bg-primary-light border-l-primary',
                      !thread.is_read && 'bg-blue-50/50'
                    )}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 mt-1'>
                        <Mail className='h-4 w-4 text-gray-400' />
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
                        <div className='text-xs text-gray-500 mb-2 truncate'>
                          {thread.subject}
                        </div>
                        {thread.person_company && (
                          <div className='text-xs text-gray-500 truncate'>
                            {thread.person_company}
                          </div>
                        )}
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
                      <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center'>
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
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Building2 className='h-4 w-4' />
                        <span>{selectedThread.person_company}</span>
                        {selectedThread.person_job_title && (
                          <span>• {selectedThread.person_job_title}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className='flex-1 p-4 overflow-y-auto'>
                {messagesLoading ? (
                  <div className='flex items-center justify-center h-32'>
                    <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary' />
                  </div>
                ) : messages.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                    <Mail className='h-12 w-12 mb-3 opacity-30' />
                    <p className='text-sm font-medium'>No messages loaded</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={cn(
                          'p-3 rounded border',
                          message.is_sent
                            ? 'bg-primary-light border-primary-medium ml-6'
                            : 'bg-gray-50 border-gray-200 mr-6'
                        )}
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex items-center gap-2'>
                            {message.is_sent ? (
                              <Mail className='h-3 w-3 text-primary' />
                            ) : (
                              <MailOpen className='h-3 w-3 text-gray-600' />
                            )}
                            <span className='font-medium text-sm'>
                              {message.is_sent ? 'You' : message.from_email}
                            </span>
                          </div>
                          <span className='text-xs text-gray-500'>
                            {new Date(message.received_at).toLocaleString()}
                          </span>
                        </div>
                        <div className='prose prose-sm max-w-none text-sm'>
                          {message.body_html ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.body_html,
                              }}
                            />
                          ) : (
                            <div className='whitespace-pre-wrap'>
                              {message.body_text}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply/Compose Section */}
              <div className='p-4 border-t border-gray-200 bg-gray-50'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs text-gray-500'>Compose Reply</span>
                  {emailSignature && (
                    <div className='flex items-center gap-2 text-xs text-green-600'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      <span>Signature enabled</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-6 p-1'
                        onClick={() => setShowSignatureSettings(true)}
                      >
                        <Settings className='h-3 w-3' />
                      </Button>
                    </div>
                  )}
                  {!emailSignature && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 text-xs text-gray-500'
                      onClick={() => setShowSignatureSettings(true)}
                    >
                      + Add signature
                    </Button>
                  )}
                </div>
                <textarea
                  placeholder='Type your reply...'
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  disabled={isSending}
                  className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed'
                  rows={4}
                />
                <div className='flex items-center justify-end gap-3 mt-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setReplyText('')}
                    disabled={isSending}
                  >
                    Clear
                  </Button>
                  <Button
                    size='sm'
                    onClick={handleSendReply}
                    disabled={isSending || !replyText.trim()}
                    className='bg-primary hover:bg-primary-hover'
                  >
                    <Mail className='h-4 w-4 mr-2' />
                    {isSending ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </div>

              {/* Signature Settings Modal */}
              {showSignatureSettings && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                  <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Email Signature
                    </h3>
                    <textarea
                      value={emailSignature}
                      onChange={e => setEmailSignature(e.target.value)}
                      placeholder='John Doe
Recruitment Team
john@company.com
+1 234 567 8900'
                      className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      rows={5}
                    />
                    <div className='flex items-center justify-between mt-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setShowSignatureSettings(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size='sm'
                        onClick={async () => {
                          await saveEmailSignature();
                          setShowSignatureSettings(false);
                        }}
                        className='bg-primary hover:bg-primary-hover'
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
              <div className='text-center'>
                <Mail className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  Select a Conversation
                </h3>
                <p className='text-sm text-gray-600'>
                  Choose a conversation from the list to view messages
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
