import { supabase } from '../integrations/supabase/client';

export interface Conversation {
  id: string;
  lead_id: string; // Changed from person_id
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
  lead_name?: string; // Changed from person_name
  lead_email?: string; // Changed from person_email
  lead_company?: string; // Changed from person_company
  lead_company_website?: string; // Changed from person_company_website
  lead_job_title?: string; // Changed from person_job_title
  lead_linkedin_url?: string; // Changed from person_linkedin_url
  message_count?: number;
  // Message content
  last_reply_message?: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  lead_id: string; // Changed from person_id
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
  expandi_status?: 'pending' | 'sent' | 'delivered' | 'failed';
}

export class ConversationService {
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('leads')
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

    // Get leads who have conversations (messaged, replied, connected stages)
    let query = supabase
      .from('leads')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        company,
        company_id,
        job_title,
        linkedin_url,
        status,
        last_reply_at,
        last_reply_channel,
        last_reply_message,
        email_sent,
        created_at,
        updated_at
      `
      )
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

    // Transform leads data to conversation format
    return (data || []).map(lead => {
      const fullName =
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown';
      return {
        id: lead.id,
        lead_id: lead.id,
        message_id: undefined,
        subject: undefined,
        participants: [lead.email || fullName].filter(Boolean),
        last_message_at: lead.last_reply_at || lead.created_at,
        is_read: !!lead.last_reply_at,
        conversation_type:
          lead.last_reply_channel === 'email' ? 'email' : 'linkedin',
        status: lead.status === 'replied_manual' ? 'active' : 'active',
        created_at: lead.created_at,
        updated_at: lead.updated_at,
        lead_name: fullName,
        lead_email: lead.email,
        lead_company: lead.company,
        lead_job_title: lead.job_title,
        lead_linkedin_url: lead.linkedin_url,
        message_count: 1, // Simplified for now
      };
    });
  }

  async getConversationMessages(
    conversationId: string
  ): Promise<ConversationMessage[]> {
    // conversation_messages table removed - using activity_log instead
    // Return empty array for now
    console.warn(
      'conversation_messages table removed - use activity_log instead'
    );
    return [];
  }

  async createConversation(conversationData: {
    lead_id: string; // Changed from person_id
    message_id?: string;
    subject?: string;
    participants: string[];
    conversation_type?: 'email';
  }): Promise<Conversation> {
    // conversations table removed - using activity_log instead
    console.warn('conversations table removed - use activity_log instead');
    throw new Error(
      'Conversations table removed - use activity_log for tracking'
    );
  }

  async addMessage(messageData: {
    conversation_id: string;
    lead_id: string; // Changed from person_id
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
    console.warn(
      'conversation_messages table removed - use activity_log instead'
    );
    throw new Error(
      'Conversation messages table removed - use activity_log for tracking'
    );

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
    console.warn(
      'conversation_messages table removed - use activity_log instead'
    );
    // No-op for now
  }

  private async findConversationByLinkedInId(
    linkedinMessageId: string
  ): Promise<Conversation | null> {
    // conversations table removed - using activity_log instead
    console.warn('conversations table removed - use activity_log instead');
    return null;
  }

  private async findLeadByEmailOrName(
    email?: string,
    name?: string
  ): Promise<Record<string, unknown> | null> {
    let query = supabase.from('leads').select('*');

    if (email) {
      query = query.eq('email', email);
    } else if (name) {
      query = query.or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`);
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
    //   user_id: user.user?.id,
    //   operation_type: operationType,
    //   status,
    //   message_count: messageCount,
    //   error_message: errorMessage,
    // });
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
        // Total conversations - leads who have actually replied
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', ''),

        // Unread conversations - leads messaged but no reply yet
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .is('last_reply_at', null),

        // Active conversations - leads who have replied (true conversations)
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', ''),

        // Messages today - leads with message sent today
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('last_reply_at', today),

        // Messages this week - leads with message sent this week
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('last_reply_at', weekAgo),

        // LinkedIn conversations - leads with LinkedIn replies
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .not('last_reply_message', 'is', null)
          .neq('last_reply_message', '')
          .eq('last_reply_channel', 'linkedin'),

        // Email conversations - leads with email replies
        supabase
          .from('leads')
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
