import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// Person type is Contact - using inline type definition
type Person = {
  id: string;
  name: string;
  email_address: string | null;
  company_id: string | null;
  [key: string]: unknown;
};
import { format, formatDistanceToNow } from 'date-fns';
import {
  Check,
  Copy,
  Linkedin,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ConversationMessage {
  id: string;
  conversation_id?: string;
  thread_id?: string;
  content?: string;
  subject?: string;
  body_text?: string;
  sender_type: string;
  sent_at: string;
  sender_name?: string;
  conversation_type?: string;
}

interface Conversation {
  id: string;
  conversation_type: 'linkedin' | 'email';
  subject?: string;
  last_message_at: string;
  messages: ConversationMessage[];
}

interface PersonMessagingPanelProps {
  person: Person;
  campaigns?: Array<{ id: string; name: string }>;
}

export const PersonMessagingPanel: React.FC<PersonMessagingPanelProps> = ({
  person,
  campaigns = [],
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendMode, setSendMode] = useState<'campaign' | 'copy'>('copy');
  const [selectedMessage, setSelectedMessage] =
    useState<ConversationMessage | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    if (!person?.id) return;

    try {
      setLoading(true);

      const allConversations: Conversation[] = [];

      // Note: conversations and conversation_messages tables don't exist in the database
      // LinkedIn conversations feature is not available
      // const linkedInConversations: never[] = [];
      //
      // for (const conv of linkedInConversations || []) {
      //   const { data: messages } = await supabase
      //     .from('conversation_messages')
      //     .select('*')
      //     .eq('conversation_id', conv.id)
      //     .order('sent_at', { ascending: false })
      //     .limit(5);
      //
      //   if (messages && messages.length > 0) {
      //     allConversations.push({
      //       id: conv.id,
      //       conversation_type: 'linkedin',
      //       subject: conv.subject || 'LinkedIn Conversation',
      //       last_message_at: conv.last_message_at,
      //       messages: messages.map(m => ({
      //         id: m.id,
      //         conversation_id: m.conversation_id,
      //         content: m.content,
      //         sender_type: m.sender_type,
      //         sent_at: m.sent_at || m.created_at,
      //         sender_name: m.sender_name,
      //         conversation_type: 'linkedin',
      //       })),
      //     });
      //   }
      // }

      // Note: email_threads and email_messages tables don't exist in the database
      // Email threads feature is not available
      // const { data: emailThreads } = await supabase
      //   .from('email_threads')
      //   .select('*')
      //   .eq('person_id', person.id)
      //   .order('last_message_at', { ascending: false })
      //   .limit(10);
      //
      // for (const thread of emailThreads || []) {
      //   const { data: messages } = await supabase
      //     .from('email_messages')
      //     .select('*')
      //     .eq('thread_id', thread.id)
      //     .order('sent_at', { ascending: false })
      //     .limit(5);
      //
      //   if (messages && messages.length > 0) {
      //     allConversations.push({
      //       id: thread.id,
      //       conversation_type: 'email',
      //       subject: thread.subject || 'Email Thread',
      //       last_message_at: thread.last_message_at,
      //       messages: messages.map(m => ({
      //         id: m.id,
      //         thread_id: m.thread_id,
      //         content: m.body_text,
      //         subject: m.subject,
      //         body_text: m.body_text,
      //         sender_type:
      //           m.from_email === person.email_address ? 'them' : 'us',
      //         sent_at: m.sent_at || m.created_at,
      //         sender_name: m.from_name || m.from_email,
      //         conversation_type: 'email',
      //       })),
      //     });
      //   }
      // }

      // Sort by last_message_at
      allConversations.sort(
        (a, b) =>
          new Date(b.last_message_at).getTime() -
          new Date(a.last_message_at).getTime()
      );

      setConversations(allConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [person?.id, toast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleCopy = async (message: ConversationMessage) => {
    const textToCopy =
      message.content || message.body_text || message.subject || '';

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(message.id);
      toast({
        title: 'Copied',
        description: 'Message copied to clipboard',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy message',
        variant: 'destructive',
      });
    }
  };

  const handleSend = (
    message: ConversationMessage,
    mode: 'campaign' | 'copy'
  ) => {
    setSelectedMessage(message);
    setSendMode(mode);
    setSendDialogOpen(true);
  };

  const handleExecuteSend = async () => {
    if (!selectedMessage) return;

    if (sendMode === 'copy') {
      handleCopy(selectedMessage);
      setSendDialogOpen(false);
      return;
    }

    setIsSending(true);

    try {
      if (sendMode === 'campaign') {
        if (!selectedCampaign || !person?.id) {
          toast({
            title: 'Error',
            description: 'Please select a campaign',
            variant: 'destructive',
          });
          return;
        }

        // Add person to campaign
        const { error } = await supabase
          .from('campaign_sequence_leads' as never)
          .insert({
            sequence_id: selectedCampaign,
            lead_id: person.id,
            status: 'active',
            started_at: new Date().toISOString(),
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: `Added to campaign`,
        });
      }

      setSendDialogOpen(false);
    } catch (error) {
      console.error('Error sending:', error);
      toast({
        title: 'Error',
        description: 'Failed to send',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <MessageCircle className='h-12 w-12 mx-auto mb-3 opacity-50' />
        <p className='text-sm'>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Conversations List */}
      {conversations.map(conv => (
        <div
          key={conv.id}
          className='bg-white border border-border rounded-lg p-4'
        >
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              {conv.conversation_type === 'linkedin' ? (
                <Linkedin className='h-4 w-4 text-primary' />
              ) : (
                <Mail className='h-4 w-4 text-success' />
              )}
              <span className='text-sm font-medium'>{conv.subject}</span>
              <span className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(conv.last_message_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className='space-y-2'>
            {conv.messages.map(message => (
              <div
                key={message.id}
                className='flex items-start gap-2 p-2 bg-muted rounded hover:bg-gray-100 transition-colors'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs font-medium text-foreground'>
                      {message.sender_name || 'You'}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {format(new Date(message.sent_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className='text-sm text-foreground line-clamp-2'>
                    {message.content ||
                      message.body_text ||
                      message.subject ||
                      'No content'}
                  </p>
                </div>
                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleCopy(message)}
                    className='h-8 w-8 p-0'
                  >
                    {copiedId === message.id ? (
                      <Check className='h-4 w-4 text-success' />
                    ) : (
                      <Copy className='h-4 w-4 text-muted-foreground' />
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleSend(message, 'copy')}
                    className='h-8 w-8 p-0'
                  >
                    <Send className='h-4 w-4 text-muted-foreground' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Send Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {sendMode === 'campaign' ? 'Add to Campaign' : 'Copy Message'}
            </DialogTitle>
            <DialogDescription>
              {sendMode === 'campaign' &&
                'Select a campaign to enroll this person'}
              {sendMode === 'copy' && 'Copy this message to clipboard'}
            </DialogDescription>
          </DialogHeader>

          {sendMode === 'campaign' && (
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Campaign
                </label>
                <Select
                  value={selectedCampaign}
                  onValueChange={setSelectedCampaign}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a campaign' />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {sendMode === 'copy' && selectedMessage && (
            <div className='p-4 bg-muted rounded border border-border'>
              <p className='text-sm text-foreground'>
                {selectedMessage.content ||
                  selectedMessage.body_text ||
                  'No content'}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setSendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExecuteSend}
              disabled={
                isSending || (sendMode === 'campaign' && !selectedCampaign)
              }
            >
              {isSending ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  {sendMode === 'copy' && <Copy className='h-4 w-4 mr-2' />}
                  {sendMode === 'campaign' && <Send className='h-4 w-4 mr-2' />}
                  {sendMode === 'copy' ? 'Copy' : 'Add to Campaign'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
