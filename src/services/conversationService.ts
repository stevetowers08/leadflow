import { supabase } from '../integrations/supabase/client';

export interface Conversation {
  id: string;
  person_id: string;
  message_id?: string;
  subject?: string;
  participants: string[];
  last_message_at: string;
  is_read: boolean;
  conversation_type: 'email';
  status: 'active' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
  // Joined data
  person_name?: string;
  person_email?: string;
  person_company?: string;
  person_linkedin_url?: string;
  message_count?: number;
  // Message content
  last_reply_message?: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  person_id: string;
  message_id?: string;
  sender_type: 'us' | 'them' | 'system';
  sender_name?: string;
  sender_email?: string;
  content: string;
  message_type: 'text' | 'connection_request' | 'follow_up' | 'reply';
  is_read: boolean;
  sent_at?: string;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export class ConversationService {
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('id')
        .limit(1);

      return !error;
    } catch (err) {
      console.error('Test connection error:', err);
      return false;
    }
  }
  async getConversations(filters?: {
    status?: string;
    isRead?: boolean;
    personId?: string;
  }): Promise<Conversation[]> {
    // Get conversations with filters

    // Get people who have conversations (messaged, replied, connected stages)
    let query = supabase
      .from('people')
      .select(
        `
        id,
        name,
        email_address,
        company,
        linkedin_url,
        stage,
        last_reply_at,
        last_reply_channel,
        last_reply_message,
        email_sent,
        created_at,
        updated_at
      `
      )
      // .in('stage', ['messaged', 'replied', 'connected'])
      .order('last_reply_message', { ascending: false, nullsFirst: false })
      .order('last_reply_at', { ascending: false, nullsFirst: false });

    if (filters?.personId) {
      query = query.eq('id', filters.personId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Transform raw data to conversation format

    // Transform people data to conversation format
    return (data || []).map(person => ({
      id: person.id,
      person_id: person.id,
      message_id: undefined,
      subject: undefined,
      participants: [person.email_address || person.name].filter(Boolean),
      last_message_at: person.last_reply_at || person.created_at,
      is_read: !!person.last_reply_at,
      conversation_type:
        person.last_reply_channel === 'email' ? 'email' : 'linkedin',
      status:
        person.people_stage === 'new_lead'
          ? 'active'
          : person.people_stage === 'new_lead'
            ? 'active'
            : 'active',
      created_at: person.created_at,
      updated_at: person.updated_at,
      person_name: person.name,
      person_email: person.email_address,
      person_company: person.company,
      person_linkedin_url: person.linkedin_url,
      message_count: 1, // Simplified for now
    }));
  }

  async getConversationMessages(
    conversationId: string
  ): Promise<ConversationMessage[]> {
    // conversation_messages table removed - using activity_log instead
    // Return empty array for now
    console.warn('conversation_messages table removed - use activity_log instead');
    return [];
  }

  async createConversation(conversationData: {
    person_id: string;
    message_id?: string;
    subject?: string;
    participants: string[];
    conversation_type?: 'email';
  }): Promise<Conversation> {
    // conversations table removed - using activity_log instead
    console.warn('conversations table removed - use activity_log instead');
    throw new Error('Conversations table removed - use activity_log for tracking');
  }

  async addMessage(messageData: {
    conversation_id: string;
    person_id: string;
    message_id?: string;
    sender_type: 'us' | 'them' | 'system';
    sender_name?: string;
    sender_email?: string;
    content: string;
    message_type?: 'text' | 'connection_request' | 'follow_up' | 'reply';
    sent_at?: string;
    expandi_status?: 'pending' | 'sent' | 'delivered' | 'failed';
    expandi_message_id?: string;
  }): Promise<ConversationMessage> {
    // conversation_messages table removed - using activity_log instead
    console.warn('conversation_messages table removed - use activity_log instead');
    throw new Error('Conversation messages table removed - use activity_log for tracking');

    if (error) throw error;

    // Update conversation's last_message_at - conversations table removed
    // await supabase
    //   .from('conversations')
    //   .update({
    //     last_message_at: messageData.sent_at || new Date().toISOString(),
        // updated_at: new Date().toISOString(),
      // })
      // .eq('id', messageData.conversation_id);

    return data;
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    // conversations table removed - using activity_log instead
    console.warn('conversations table removed - use activity_log instead');
    // No-op for now
  }

  async updateMessageStatus(
    messageId: string,
    status: 'pending' | 'sent' | 'delivered' | 'failed',
    expandiMessageId?: string
  ): Promise<void> {
    // conversation_messages table removed - using activity_log instead
    console.warn('conversation_messages table removed - use activity_log instead');
    // No-op for now
  }

  private async findConversationByLinkedInId(
    linkedinMessageId: string
  ): Promise<Conversation | null> {
    // conversations table removed - using activity_log instead
    console.warn('conversations table removed - use activity_log instead');
    return null;
  }

  private async findPersonByEmailOrName(
    email?: string,
    name?: string
  ): Promise<Record<string, unknown> | null> {
    let query = supabase.from('people').select('*');

    if (email) {
      query = query.eq('email_address', email);
    } else if (name) {
      query = query.ilike('name', `%${name}%`);
    } else {
      return null;
    }

    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  private async logSyncOperation(
    operationType: string,
    status: 'success' | 'error' | 'partial',
    messageCount: number,
    errorMessage?: string
  ): Promise<void> {
    const { data: user } = await supabase.auth.getUser();

    // conversation_sync_logs table removed - using activity_log instead
    // await supabase.from('conversation_sync_logs').insert({
      user_id: user.user?.id,
      operation_type: operationType,
      status,
      message_count: messageCount,
      error_message: errorMessage,
    });
  }

  async getConversationStats(): Promise<{
    totalConversations: number;
    unreadConversations: number;
    activeConversations: number;
    messagesToday: number;
    messagesThisWeek: number;
    linkedinConversations: number;
    emailConversations: number;
  }> {
    try {
      // OPTIMIZED: Use count queries instead of fetching all data
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      const [
        { count: totalConversations },
        { count: unreadConversations },
        { count: activeConversations },
        { count: messagesToday },
        { count: messagesThisWeek },
        { count: linkedinConversations },
        { count: emailConversations },
      ] = await Promise.all([
        // Total conversations - people who have actually replied
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', ''),

        // Unread conversations - people messaged but no reply yet
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .eq('people_stage', 'new_lead')
          .is('last_reply_at', null),

        // Active conversations - people who have replied (true conversations)
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', ''),

        // Messages today - people with message sent today
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .gte('last_reply_at', today),

        // Messages this week - people with message sent this week
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .gte('last_reply_at', weekAgo),

        // LinkedIn conversations - people with LinkedIn replies
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', '')
          .eq('last_reply_channel', 'linkedin'),

        // Email conversations - people with email replies
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', '')
          .eq('last_reply_channel', 'email'),
      ]);

      return {
        totalConversations: totalConversations || 0,
        unreadConversations: unreadConversations || 0,
        activeConversations: activeConversations || 0,
        messagesToday: messagesToday || 0,
        messagesThisWeek: messagesThisWeek || 0,
        linkedinConversations: linkedinConversations || 0,
        emailConversations: emailConversations || 0,
      };
    } catch (error) {
      console.error('Error fetching conversation stats:', error);
      // Return default values on error
      return {
        totalConversations: 0,
        unreadConversations: 0,
        activeConversations: 0,
        messagesToday: 0,
        messagesThisWeek: 0,
        linkedinConversations: 0,
        emailConversations: 0,
      };
    }
  }
}

export const conversationService = new ConversationService();
