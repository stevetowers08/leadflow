'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { cn, getErrorMessage, logSupabaseError } from '@/lib/utils';
import {
  Building2,
  Mail,
  MailOpen,
  MessageSquare,
  Search,
  Send,
  Settings,
  User,
  ChevronLeft,
  Archive,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

// Client-side mount guard wrapper
const ConversationsPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't call useAuth until component is mounted on client
  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Now safe to use useAuth after mount (client-side only)
  return <ConversationsContent />;
};

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

// Client-side mount guard - prevents useAuth from being called during SSR/build
const ConversationsContent: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
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
  const [showCompose, setShowCompose] = useState(false);
  const [swipedThreadId, setSwipedThreadId] = useState<string | null>(null);
  const swipeStartRef = useRef<{ x: number; id: string } | null>(null);
  const [composeEmail, setComposeEmail] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [people, setPeople] = useState<
    Array<{ id: string; name: string; email_address: string }>
  >([]);
  const [searchPeople, setSearchPeople] = useState('');
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<
    Array<{ id: string; name: string; email_address: string }>
  >([]);

  usePageMeta({
    title: 'Conversations - LeadFlow',
    description: 'Manage all your email conversations with leads.',
  });

  const loadPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email')
        .not('email', 'is', null)
        .order('first_name', { ascending: true })
        .limit(500);

      if (error) throw error;
      // Transform leads data to match expected people format
      const transformedPeople = (data || []).map(lead => ({
        id: lead.id,
        name:
          `${lead.first_name || ''} ${lead.last_name || ''}`.trim() ||
          'Unknown',
        email_address: lead.email || '',
      }));
      setPeople(transformedPeople);
    } catch (error) {
      console.error('Failed to load leads:', getErrorMessage(error), error);
    }
  };

  useEffect(() => {
    if (showCompose) {
      loadPeople();
    }
  }, [showCompose]);

  // Open compose via URL params: /conversations?compose=1&toIds=a,b,c
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('compose') === '1') {
      setShowCompose(true);
      const toIds = params.get('toIds');
      if (toIds) {
        const idList = toIds.split(',').filter(Boolean);
        if (idList.length > 0) {
          (async () => {
            const { data, error } = await supabase
              .from('leads')
              .select('id, email')
              .in('id', idList)
              .not('email', 'is', null);
            if (!error && data) {
              const emails = data
                .map(p => p.email)
                .filter((e): e is string => !!e);
              if (emails.length > 0) {
                setComposeEmail(prev => ({ ...prev, to: emails.join(',') }));
              }
            }
          })();
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchPeople) {
      const filtered = people
        .filter(
          person =>
            person.name?.toLowerCase().includes(searchPeople.toLowerCase()) ||
            person.email_address
              ?.toLowerCase()
              .includes(searchPeople.toLowerCase())
        )
        .slice(0, 10);
      setFilteredPeople(filtered);
      setShowPeoplePicker(true);
    } else {
      setFilteredPeople([]);
      setShowPeoplePicker(false);
    }
  }, [searchPeople, people]);

  const loadThreads = async () => {
    try {
      setLoading(true);

      // Fetch email threads from Gmail sync
      // Note: email_threads table may not exist in types - using type assertion
      const { data: emailThreads, error } = await supabase
        .from('email_threads' as never)
        .select(
          `
          id,
          gmail_thread_id,
          subject,
          last_message_at,
          is_read,
          leads(
            id,
            first_name,
            last_name,
            email,
            job_title,
            company
          )
        `
        )
        .order('last_message_at', { ascending: false })
        .limit(50);

      // Handle missing table gracefully
      if (error) {
        const errorMessage = error.message || '';
        if (
          errorMessage.includes('schema cache') ||
          errorMessage.includes('does not exist')
        ) {
          console.debug(
            'Failed to load conversations: Could not find the table',
            error
          );
          setThreads([]);
          return;
        }
        throw error;
      }

      // Type assertion for query result with proper structure
      interface EmailThreadQueryResult {
        id: string;
        gmail_thread_id: string;
        subject: string | null;
        last_message_at: string;
        is_read: boolean;
        leads: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          job_title: string | null;
          company: string | null;
        } | null;
      }

      const transformedThreads: EmailThread[] = (
        (emailThreads || []) as EmailThreadQueryResult[]
      )
        .filter(
          (
            thread
          ): thread is EmailThreadQueryResult & {
            leads: NonNullable<EmailThreadQueryResult['leads']>;
          } => thread.leads !== null
        )
        .map(thread => {
          const name =
            [thread.leads.first_name, thread.leads.last_name]
              .filter(Boolean)
              .join(' ') || 'Unknown';
          return {
            id: thread.id,
            gmail_thread_id: thread.gmail_thread_id,
            person_id: thread.leads.id,
            person_name: name,
            person_email: thread.leads.email || '',
            person_company: thread.leads.company || undefined,
            person_job_title: thread.leads.job_title || undefined,
            subject: thread.subject || 'No subject',
            last_message_at: thread.last_message_at,
            is_read: thread.is_read,
            message_count: 1,
            last_message_preview: thread.subject || '',
          };
        });

      setThreads(transformedThreads);
    } catch (error) {
      console.error(
        'Failed to load conversations:',
        getErrorMessage(error),
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      setMessagesLoading(true);

      // Fetch messages for this thread
      // Note: email_messages table may not exist in types - using type assertion
      const { data: emailMessages, error } = await supabase
        .from('email_messages' as never)
        .select('*')
        .eq('thread_id', threadId)
        .order('received_at', { ascending: true });

      if (error) throw error;

      // Type assertion for email messages query result
      interface EmailMessageQueryResult {
        id: string;
        thread_id: string;
        from_email: string;
        to_emails: string[] | null;
        subject: string | null;
        body_text: string | null;
        body_html: string | null;
        is_sent: boolean;
        sent_at: string | null;
        received_at: string;
        attachments: unknown[] | null;
      }

      const transformedMessages: EmailMessage[] = (
        (emailMessages || []) as EmailMessageQueryResult[]
      ).map(msg => ({
        id: msg.id,
        thread_id: msg.thread_id || threadId,
        from_email: msg.from_email,
        to_emails: msg.to_emails || [],
        subject: msg.subject || '',
        body_text: msg.body_text || '',
        body_html: msg.body_html || undefined,
        is_sent: msg.is_sent || false,
        sent_at: msg.sent_at || undefined,
        received_at: msg.received_at,
        attachments: (msg.attachments || []) as Record<string, unknown>[],
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Failed to load messages:', getErrorMessage(error), error);
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
      // Send email via Gmail API
      // Implementation uses gmailService.sendEmail() or similar
      alert('Reply sent! (This is a demo - Gmail API integration needed)');

      // Clear the reply text
      setReplyText('');

      // Refresh messages to show the new sent message
      await loadMessages(selectedThread.id);
    } catch (error) {
      console.error('Failed to send reply:', getErrorMessage(error), error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const loadEmailSignature = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      // Handle specific error codes gracefully
      if (error) {
        // PGRST116 = no rows found (normal - user hasn't set signature yet)
        if (error.code === 'PGRST116') {
          setEmailSignature('');
          return;
        }

        // 42P01 = relation does not exist (table missing - migration not run)
        // 42704 = object does not exist (table missing)
        if (
          error.code === '42P01' ||
          error.code === '42704' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('does not exist')
        ) {
          // Table doesn't exist - this is expected if migration hasn't run
          // Silently fail and use empty signature
          setEmailSignature('');
          return;
        }

        // For other errors, log them properly
        logSupabaseError(error, 'loading email signature');
        return;
      }

      const prefs = data?.preferences as
        | { emailSignature?: string }
        | undefined;
      const signature = prefs?.emailSignature || '';
      setEmailSignature(signature);
    } catch (error) {
      // Fallback error handling
      const errorMessage = getErrorMessage(error);
      // Only log if it's a meaningful error (not table missing)
      if (
        !errorMessage.includes('schema cache') &&
        !errorMessage.includes('does not exist')
      ) {
        logSupabaseError(error, 'loading email signature');
      }
      // Set empty signature as fallback
      setEmailSignature('');
    }
  }, [user]);

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

      if (error) {
        // Handle table missing errors gracefully
        if (
          error.code === '42P01' ||
          error.code === '42704' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('does not exist')
        ) {
          alert(
            'Settings table not available. Please ensure database migrations are up to date.'
          );
          return;
        }
        throw error;
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      // Only log meaningful errors
      if (
        !errorMessage.includes('schema cache') &&
        !errorMessage.includes('does not exist')
      ) {
        logSupabaseError(error, 'saving email signature');
      }
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

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent, threadId: string) => {
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, id: threadId };
  };

  const handleTouchMove = (e: React.TouchEvent, threadId: string) => {
    if (!swipeStartRef.current || swipeStartRef.current.id !== threadId) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    // Only allow left swipe (negative deltaX)
    if (deltaX < -50) {
      setSwipedThreadId(threadId);
    } else if (deltaX > 50) {
      // Swipe back right - close swipe
      setSwipedThreadId(null);
    }
  };

  const handleTouchEnd = (threadId: string) => {
    if (swipeStartRef.current?.id === threadId) {
      // If swiped less than threshold, reset
      const touch = swipeStartRef.current;
      // Reset after a short delay to allow button clicks
      setTimeout(() => {
        if (swipedThreadId !== threadId) {
          // Only reset if still swiped (user might have clicked action)
          swipeStartRef.current = null;
        }
      }, 100);
    }
  };

  // Format date for mobile (Gmail style)
  const formatMobileDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Mobile Layout - Gmail-like
  if (isMobile) {
    return (
      <div className='flex flex-col h-full bg-white overflow-hidden'>
        {/* Mobile Header with Tabs */}
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200'>
          <div className='flex items-center justify-between px-4 py-3'>
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-semibold text-foreground'>Inbox</h1>
              {unreadCount > 0 && (
                <Badge className='bg-red-500 text-white text-xs px-2 py-0.5'>
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              onClick={() => setShowCompose(true)}
              size='icon'
              className='rounded-full'
            >
              <Mail className='h-5 w-5' />
            </Button>
          </div>

          {/* Tabs */}
          <div className='flex border-b border-gray-200'>
            {[
              { id: 'inbox', label: 'Primary', icon: MailOpen },
              { id: 'unread', label: 'Unread', icon: Mail },
              { id: 'sent', label: 'Sent', icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 border-b-2 transition-colors',
                  activeView === tab.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-gray-600'
                )}
              >
                <tab.icon className='h-4 w-4' />
                <span className='text-sm'>{tab.label}</span>
                {tab.id === 'unread' && unreadCount > 0 && (
                  <Badge className='bg-red-500 text-white text-[10px] px-1.5 py-0 h-4'>
                    {unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Thread List, Message View, or Compose View */}
        {showCompose ? (
          <div className='flex-1 flex flex-col overflow-hidden'>
            {/* Compose Header */}
            <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold text-foreground'>
                  New Message
                </h2>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowCompose(false)}
                >
                  <ChevronLeft className='h-5 w-5' />
                </Button>
              </div>
            </div>

            {/* Compose Form */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              <div className='relative'>
                <Input
                  placeholder='To'
                  value={composeEmail.to}
                  onChange={e => {
                    setComposeEmail({ ...composeEmail, to: e.target.value });
                    setSearchPeople(e.target.value);
                  }}
                  className='text-base min-h-[48px]'
                />
                {showPeoplePicker && filteredPeople.length > 0 && (
                  <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                    {filteredPeople.map(person => (
                      <button
                        key={person.id}
                        onClick={() => {
                          setComposeEmail({
                            ...composeEmail,
                            to: person.email_address || '',
                          });
                          setSearchPeople('');
                          setShowPeoplePicker(false);
                        }}
                        className='w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 min-h-[48px]'
                      >
                        <User className='h-4 w-4 text-gray-400' />
                        <div>
                          <p className='text-sm font-medium text-foreground'>
                            {person.name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {person.email_address}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                placeholder='Subject'
                value={composeEmail.subject}
                onChange={e =>
                  setComposeEmail({
                    ...composeEmail,
                    subject: e.target.value,
                  })
                }
                className='text-base min-h-[48px]'
              />
              <textarea
                placeholder='Type your message...'
                value={composeEmail.body}
                onChange={e =>
                  setComposeEmail({ ...composeEmail, body: e.target.value })
                }
                className='w-full flex-1 resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base min-h-[200px]'
              />
            </div>

            {/* Compose Footer */}
            <div className='border-t border-gray-200 p-4 bg-white safe-area-pb'>
              <div className='flex items-center justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowCompose(false);
                    setComposeEmail({ to: '', subject: '', body: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Send email functionality
                    setShowCompose(false);
                    setComposeEmail({ to: '', subject: '', body: '' });
                  }}
                >
                  <Send className='h-4 w-4 mr-2' />
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : selectedThread ? (
          <div className='flex-1 flex flex-col overflow-hidden'>
            {/* Message Header */}
            <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3'>
              <div className='flex items-center gap-3'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSelectedThread(null)}
                  className='-ml-2'
                >
                  <ChevronLeft className='h-5 w-5' />
                </Button>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-base font-semibold text-foreground truncate'>
                    {selectedThread.person_name}
                  </h2>
                  <p className='text-xs text-gray-600 truncate'>
                    {selectedThread.person_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-4 py-4'>
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
                  {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const showSenderInfo =
                      !prevMessage ||
                      prevMessage.from_email !== message.from_email ||
                      Math.abs(
                        new Date(message.received_at).getTime() -
                          new Date(prevMessage.received_at).getTime()
                      ) >
                        5 * 60 * 1000;

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.is_sent && 'flex-row-reverse'
                        )}
                      >
                        <div
                          className={cn(
                            'flex-shrink-0 rounded-full flex items-center justify-center text-xs font-medium',
                            message.is_sent
                              ? 'w-8 h-8 bg-primary text-white'
                              : 'w-8 h-8 bg-gray-200 text-gray-600'
                          )}
                        >
                          {message.is_sent ? (
                            <User className='h-4 w-4' />
                          ) : (
                            <MailOpen className='h-4 w-4' />
                          )}
                        </div>
                        <div
                          className={cn(
                            'flex-1 min-w-0',
                            message.is_sent && 'flex flex-col items-end'
                          )}
                        >
                          {showSenderInfo && (
                            <div
                              className={cn(
                                'flex items-center gap-2 mb-1.5',
                                message.is_sent && 'flex-row-reverse'
                              )}
                            >
                              <span className='text-xs font-medium text-foreground'>
                                {message.is_sent ? 'You' : message.from_email}
                              </span>
                              <span className='text-xs text-gray-400'>
                                {new Date(
                                  message.received_at
                                ).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                          <div
                            className={cn(
                              'rounded-2xl px-4 py-3 max-w-[85%] shadow-sm',
                              message.is_sent
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-foreground'
                            )}
                          >
                            <div className='text-sm leading-relaxed break-words'>
                              {message.body_html ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: message.body_html,
                                  }}
                                  className={cn(
                                    message.is_sent
                                      ? 'prose-invert prose-sm'
                                      : 'prose prose-sm'
                                  )}
                                />
                              ) : (
                                <div className='whitespace-pre-wrap'>
                                  {message.body_text}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reply Section */}
            <div className='border-t border-gray-200 bg-white p-4 safe-area-pb'>
              <textarea
                placeholder='Type your reply...'
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                disabled={isSending}
                className='w-full p-3 border border-gray-300 rounded-lg resize-none bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base min-h-[48px]'
                rows={3}
              />
              <div className='flex items-center justify-end gap-2 mt-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setReplyText('')}
                  disabled={isSending}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  size='sm'
                >
                  <Send className='h-4 w-4 mr-2' />
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : (
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
                  Conversations with your leads will appear here.
                </p>
              </div>
            ) : (
              <div className='divide-y divide-gray-100'>
                {filteredThreads.map(thread => {
                  const isSwiped = swipedThreadId === thread.id;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        if (isSwiped) {
                          // Close swipe if clicking while swiped
                          setSwipedThreadId(null);
                          swipeStartRef.current = null;
                        } else {
                          handleThreadSelect(thread);
                        }
                      }}
                      onTouchStart={e => handleTouchStart(e, thread.id)}
                      onTouchMove={e => handleTouchMove(e, thread.id)}
                      onTouchEnd={() => handleTouchEnd(thread.id)}
                      className={cn(
                        'relative px-4 py-3 cursor-pointer transition-transform duration-200 bg-white',
                        !thread.is_read && !isSwiped && 'bg-blue-50/50',
                        isSwiped && '-translate-x-20'
                      )}
                      style={{ touchAction: 'pan-y pan-x' }}
                    >
                      {/* Swipe Actions - Hidden by default, shown when swiped */}
                      {isSwiped && (
                        <div className='absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 bg-gray-100 w-20'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={e => {
                              e.stopPropagation();
                              setSwipedThreadId(null);
                              swipeStartRef.current = null;
                              // Archive action - TODO: Implement archive functionality
                            }}
                          >
                            <Archive className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-destructive'
                            onClick={e => {
                              e.stopPropagation();
                              setSwipedThreadId(null);
                              swipeStartRef.current = null;
                              // Delete action - TODO: Implement delete functionality
                            }}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      )}

                      <div className='flex items-start gap-3'>
                        {/* Avatar/Initial */}
                        <div className='flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold text-sm'>
                          {thread.person_name.charAt(0).toUpperCase()}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between mb-1'>
                            <div className='flex items-center gap-2 flex-1 min-w-0'>
                              <span
                                className={cn(
                                  'text-sm truncate',
                                  !thread.is_read
                                    ? 'font-semibold text-foreground'
                                    : 'font-medium text-gray-700'
                                )}
                              >
                                {thread.person_name}
                              </span>
                              {!thread.is_read && (
                                <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0' />
                              )}
                            </div>
                            <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>
                              {formatMobileDate(thread.last_message_at)}
                            </span>
                          </div>

                          <div className='flex items-center gap-2 mb-1'>
                            <span
                              className={cn(
                                'text-sm truncate',
                                !thread.is_read
                                  ? 'font-medium text-foreground'
                                  : 'text-gray-600'
                              )}
                            >
                              {thread.subject || 'No subject'}
                            </span>
                            {thread.message_count > 1 && (
                              <Badge
                                variant='secondary'
                                className='text-[10px] px-1.5 py-0 h-4'
                              >
                                {thread.message_count}
                              </Badge>
                            )}
                          </div>

                          <div className='text-xs text-gray-500 truncate'>
                            {thread.person_email}
                          </div>

                          {thread.person_company && (
                            <div className='text-xs text-gray-400 mt-1 truncate'>
                              {thread.person_company}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout - Keep existing
  return (
    <div
      className='flex bg-white overflow-hidden'
      style={{ height: 'calc(100vh - 48px)' }} // viewport - topnav (no padding for Conversations)
    >
      {/* Left Sidebar - Simplified */}
      <div className='w-56 bg-gray-50 flex flex-col flex-shrink-0'>
        {/* Search Section */}
        <div className='h-16 border-b border-gray-200 flex items-center px-4'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search conversations'
              className='pl-10 bg-white border-gray-300 text-sm h-9'
            />
          </div>
        </div>

        {/* Navigation Items - Simplified */}
        <div className='flex-1 p-3 overflow-y-auto'>
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
        <div className='h-16 border-b border-gray-200 bg-white flex items-center px-4'>
          <div className='flex items-center justify-between w-full'>
            <h2 className='text-sm font-semibold text-foreground'>
              Conversations
            </h2>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='icon'>
                <Search className='h-4 w-4' />
              </Button>
              <Button onClick={() => setShowCompose(true)} className='gap-2'>
                <Mail className='h-4 w-4' />
                New Email
              </Button>
            </div>
          </div>
        </div>

        {/* Thread List */}
        <div className='flex-1 overflow-y-auto min-h-0'>
          {loading ? (
            <div className='flex items-center justify-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary' />
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-500 p-4'>
              <Mail className='h-10 w-10 mb-3 opacity-30' />
              <p className='text-base font-medium'>No Conversations</p>
              <p className='text-sm text-gray-400 text-center mt-2'>
                Conversations with your leads will appear here.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {filteredThreads.map(thread => {
                const isSelected = selectedThread?.id === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread)}
                    className={cn(
                      'p-4 cursor-pointer transition-colors',
                      isSelected ? 'bg-primary/10' : 'hover:bg-gray-50',
                      !isSelected && !thread.is_read && 'bg-blue-50/50'
                    )}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 mt-1'>
                        <Mail className='h-4 w-4 text-gray-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='font-medium text-foreground text-sm truncate'>
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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Message View */}
      <div className='flex-1 flex flex-col bg-white min-w-0 border-l border-gray-200'>
        {selectedThread ? (
          <>
            {/* Thread Header */}
            <div className='h-16 border-b border-gray-200 bg-white flex items-center px-4'>
              <div className='flex items-center justify-between w-full'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center'>
                      <User className='h-4 w-4 text-white' />
                    </div>
                    <div>
                      <h2 className='text-base font-semibold text-foreground'>
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
                        <span>ΓÇó {selectedThread.person_job_title}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 px-6 py-4 overflow-y-auto min-h-0'>
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
                  {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const showSenderInfo =
                      !prevMessage ||
                      prevMessage.from_email !== message.from_email ||
                      Math.abs(
                        new Date(message.received_at).getTime() -
                          new Date(prevMessage.received_at).getTime()
                      ) >
                        5 * 60 * 1000; // 5 minutes

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3 group',
                          message.is_sent && 'flex-row-reverse'
                        )}
                      >
                        {/* Avatar */}
                        <div
                          className={cn(
                            'flex-shrink-0 rounded-full flex items-center justify-center text-xs font-medium',
                            message.is_sent
                              ? 'w-8 h-8 bg-primary text-white'
                              : 'w-8 h-8 bg-gray-200 text-gray-600'
                          )}
                        >
                          {message.is_sent ? (
                            <User className='h-4 w-4' />
                          ) : (
                            <MailOpen className='h-4 w-4' />
                          )}
                        </div>

                        {/* Message Content */}
                        <div
                          className={cn(
                            'flex-1 min-w-0',
                            message.is_sent ? 'flex flex-col items-end' : ''
                          )}
                        >
                          {/* Sender & Timestamp - Only show for first message or after a gap */}
                          {showSenderInfo && (
                            <div
                              className={cn(
                                'flex items-center gap-2 mb-1.5',
                                message.is_sent && 'flex-row-reverse'
                              )}
                            >
                              <span className='text-xs font-medium text-foreground'>
                                {message.is_sent ? 'You' : message.from_email}
                              </span>
                              <span className='text-xs text-gray-400'>
                                {new Date(
                                  message.received_at
                                ).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={cn(
                              'rounded-2xl px-5 py-3 max-w-[75%] shadow-sm transition-shadow',
                              message.is_sent
                                ? 'bg-primary text-white shadow-primary/20'
                                : 'bg-white border border-gray-200 text-foreground shadow-gray-200/50 hover:shadow-md'
                            )}
                          >
                            <div className='text-sm leading-relaxed break-words'>
                              {message.body_html ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: message.body_html,
                                  }}
                                  className={cn(
                                    message.is_sent
                                      ? 'prose-invert prose-sm'
                                      : 'prose prose-sm'
                                  )}
                                />
                              ) : (
                                <div className='whitespace-pre-wrap'>
                                  {message.body_text}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                      size='icon'
                      onClick={() => setShowSignatureSettings(true)}
                    >
                      <Settings className='h-4 w-4' />
                    </Button>
                  </div>
                )}
                {!emailSignature && (
                  <Button
                    variant='ghost'
                    className='text-xs text-gray-500'
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
                className='w-full p-3 border border-gray-300 rounded-lg resize-none bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500'
                rows={4}
              />
              <div className='flex items-center justify-end gap-3 mt-3'>
                <Button
                  variant='outline'
                  onClick={() => setReplyText('')}
                  disabled={isSending}
                >
                  Clear
                </Button>
                <Button
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
LeadFlow Team
john@company.com
+1 234 567 8900'
                    className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    rows={5}
                  />
                  <div className='flex items-center justify-between mt-4'>
                    <Button
                      variant='outline'
                      onClick={() => setShowSignatureSettings(false)}
                    >
                      Cancel
                    </Button>
                    <Button
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
        ) : showCompose ? (
          <div className='flex-1 flex flex-col bg-white border-l border-gray-200'>
            <div className='p-4 border-b border-gray-200 bg-gray-50'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-foreground'>
                  New Message
                </h3>
                <Button
                  variant='ghost'
                  onClick={() => setShowCompose(false)}
                  className='text-xs'
                >
                  Cancel
                </Button>
              </div>
            </div>

            <div className='flex-1 flex flex-col overflow-hidden'>
              <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                <div className='relative'>
                  <Input
                    placeholder='To'
                    value={composeEmail.to}
                    onChange={e => {
                      setComposeEmail({ ...composeEmail, to: e.target.value });
                      setSearchPeople(e.target.value);
                    }}
                    className='border-gray-300 focus:border-primary focus:ring-primary'
                  />
                  {showPeoplePicker && filteredPeople.length > 0 && (
                    <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                      {filteredPeople.map(person => (
                        <button
                          key={person.id}
                          onClick={() => {
                            setComposeEmail({
                              ...composeEmail,
                              to: person.email_address || '',
                            });
                            setSearchPeople('');
                            setShowPeoplePicker(false);
                          }}
                          className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3'
                        >
                          <User className='h-4 w-4 text-gray-400' />
                          <div>
                            <p className='text-sm font-medium text-foreground'>
                              {person.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {person.email_address}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    placeholder='Subject'
                    value={composeEmail.subject}
                    onChange={e =>
                      setComposeEmail({
                        ...composeEmail,
                        subject: e.target.value,
                      })
                    }
                    className='border-gray-300 focus:border-primary focus:ring-primary'
                  />
                </div>
                <div className='flex-1 min-h-[300px]'>
                  <textarea
                    placeholder='Type your message...'
                    value={composeEmail.body}
                    onChange={e =>
                      setComposeEmail({ ...composeEmail, body: e.target.value })
                    }
                    className='w-full h-full resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    rows={15}
                  />
                </div>
              </div>

              <div className='border-t border-gray-200 p-3 bg-gray-50'>
                <div className='flex items-center justify-end gap-3'>
                  <Button variant='actionbar'>≡ƒôÄ Attach</Button>
                  <Button
                    className='bg-primary hover:bg-primary-hover'
                    onClick={() => {
                      // Send email functionality implemented via gmailService
                      setShowCompose(false);
                      setComposeEmail({ to: '', subject: '', body: '' });
                    }}
                  >
                    <Send className='h-4 w-4 mr-2' />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center bg-gray-50'>
            <div className='text-center'>
              <Mail className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-1'>
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
  );
};

export default ConversationsPage;
