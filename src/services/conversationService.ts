import { supabase } from '../integrations/supabase/client';

export interface Conversation {
  id: string;
  person_id: string;
  linkedin_message_id?: string;
  subject?: string;
  participants: string[];
  last_message_at: string;
  is_read: boolean;
  conversation_type: 'linkedin' | 'email';
  status: 'active' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
  // Joined data
  person_name?: string;
  person_email?: string;
  person_company?: string;
  person_linkedin_url?: string;
  message_count?: number;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  person_id: string;
  linkedin_message_id?: string;
  sender_type: 'us' | 'them' | 'system';
  sender_name?: string;
  sender_email?: string;
  content: string;
  message_type: 'text' | 'connection_request' | 'follow_up' | 'reply';
  is_read: boolean;
  sent_at?: string;
  received_at: string;
  expandi_status?: 'pending' | 'sent' | 'delivered' | 'failed';
  expandi_message_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpandiWebhookData {
  messageId: string;
  conversationId: string;
  senderType: 'us' | 'them';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
  personEmail?: string;
  personName?: string;
}

export class ConversationService {
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase
        .from('people')
        .select('id')
        .limit(1);
      
      console.log('Test result:', { data, error });
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
    console.log('getConversations called with filters:', filters);
    
    // Get people who have conversations (messaged, replied, connected stages)
    let query = supabase
      .from('people')
      .select(`
        id,
        name,
        email_address,
        company,
        linkedin_url,
        stage,
        last_reply_at,
        last_reply_channel,
        last_reply_message,
        message_sent_date,
        email_sent_date,
        linkedin_connected,
        email_sent,
        created_at,
        updated_at
      `)
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

    console.log('Raw data from Supabase:', data);
    console.log('Data length:', data?.length);

    // Transform people data to conversation format
    return (data || []).map(person => ({
      id: person.id,
      person_id: person.id,
      linkedin_message_id: undefined,
      subject: undefined,
      participants: [person.email_address || person.name].filter(Boolean),
      last_message_at: person.last_reply_at || person.message_sent_date || person.created_at,
      is_read: !!person.last_reply_at,
      conversation_type: person.last_reply_channel === 'email' ? 'email' : 'linkedin',
      status: person.stage === 'replied' ? 'active' : 
              person.stage === 'connected' ? 'active' : 'active',
      created_at: person.created_at,
      updated_at: person.updated_at,
      person_name: person.name,
      person_email: person.email_address,
      person_company: person.company,
      person_linkedin_url: person.linkedin_url,
      message_count: 1, // Simplified for now
    }));
  }

  async getConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
    // Since conversation_messages table doesn't exist, get data from people table
    const { data: person, error } = await supabase
      .from('people')
      .select(`
        id,
        name,
        email_address,
        stage,
        last_reply_at,
        last_reply_channel,
        last_reply_message,
        message_sent_date,
        email_sent_date,
        linkedin_request_message,
        linkedin_follow_up_message,
        linkedin_connected_message
      `)
      .eq('id', conversationId)
      .single();

    if (error) throw error;
    if (!person) return [];

    const messages: ConversationMessage[] = [];

    // Add sent message
    if (person.message_sent_date) {
      messages.push({
        id: `${person.id}-sent`,
        conversation_id: person.id,
        person_id: person.id,
        sender_type: 'us',
        sender_name: 'You',
        sender_email: undefined,
        content: person.linkedin_request_message || person.linkedin_follow_up_message || 'Message sent',
        message_type: 'text',
        is_read: true,
        sent_at: person.message_sent_date,
        received_at: person.message_sent_date,
        created_at: person.message_sent_date,
        updated_at: person.message_sent_date,
      });
    }

    // Add reply message if exists (even if last_reply_at is null)
    if (person.last_reply_message) {
      messages.push({
        id: `${person.id}-reply`,
        conversation_id: person.id,
        person_id: person.id,
        sender_type: 'them',
        sender_name: person.name,
        sender_email: person.email_address,
        content: person.last_reply_message,
        message_type: 'reply',
        is_read: true,
        sent_at: person.last_reply_at || person.updated_at,
        received_at: person.last_reply_at || person.updated_at,
        created_at: person.last_reply_at || person.updated_at,
        updated_at: person.last_reply_at || person.updated_at,
      });
    }

    return messages.sort((a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime());
  }

  async createConversation(conversationData: {
    person_id: string;
    linkedin_message_id?: string;
    subject?: string;
    participants: string[];
    conversation_type?: 'linkedin' | 'email';
  }): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addMessage(messageData: {
    conversation_id: string;
    person_id: string;
    linkedin_message_id?: string;
    sender_type: 'us' | 'them' | 'system';
    sender_name?: string;
    sender_email?: string;
    content: string;
    message_type?: 'text' | 'connection_request' | 'follow_up' | 'reply';
    sent_at?: string;
    expandi_status?: 'pending' | 'sent' | 'delivered' | 'failed';
    expandi_message_id?: string;
  }): Promise<ConversationMessage> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;

    // Update conversation's last_message_at
    await supabase
      .from('conversations')
      .update({ 
        last_message_at: messageData.sent_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', messageData.conversation_id);

    return data;
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({ 
        is_read: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    if (error) throw error;

    // Also mark all messages in the conversation as read
    await supabase
      .from('conversation_messages')
      .update({ 
        is_read: true,
        updated_at: new Date().toISOString()
      })
      .eq('conversation_id', conversationId);
  }

  async updateMessageStatus(
    messageId: string, 
    status: 'pending' | 'sent' | 'delivered' | 'failed',
    expandiMessageId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('conversation_messages')
      .update({ 
        expandi_status: status,
        expandi_message_id: expandiMessageId,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) throw error;
  }

  async handleExpandiWebhook(webhookData: ExpandiWebhookData): Promise<void> {
    try {
      // Find or create conversation
      let conversation = await this.findConversationByLinkedInId(webhookData.conversationId);
      
      if (!conversation) {
        // Try to find person by email or name
        const person = await this.findPersonByEmailOrName(
          webhookData.personEmail, 
          webhookData.personName
        );
        
        if (!person) {
          console.warn('Could not find person for webhook data:', webhookData);
          return;
        }

        // Create new conversation
        conversation = await this.createConversation({
          person_id: person.id,
          linkedin_message_id: webhookData.conversationId,
          participants: [webhookData.personEmail || webhookData.personName || 'Unknown'],
          conversation_type: 'linkedin',
        });
      }

      // Add message to conversation
      await this.addMessage({
        conversation_id: conversation.id,
        person_id: conversation.person_id,
        linkedin_message_id: webhookData.messageId,
        sender_type: webhookData.senderType,
        sender_name: webhookData.personName,
        sender_email: webhookData.personEmail,
        content: webhookData.content,
        sent_at: webhookData.timestamp,
        expandi_status: webhookData.status,
        expandi_message_id: webhookData.messageId,
      });

      // Log successful webhook processing
      await this.logSyncOperation('webhook_received', 'success', 1);

    } catch (error) {
      console.error('Failed to process Expandi webhook:', error);
      await this.logSyncOperation('webhook_received', 'error', 0, error.message);
      throw error;
    }
  }

  private async findConversationByLinkedInId(linkedinMessageId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('linkedin_message_id', linkedinMessageId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  private async findPersonByEmailOrName(email?: string, name?: string): Promise<any> {
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
    
    await supabase
      .from('conversation_sync_logs')
      .insert({
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
    // OPTIMIZED: Use count queries instead of fetching all data
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalConversations },
      { count: unreadConversations },
      { count: activeConversations },
      { count: messagesToday },
      { count: messagesThisWeek },
      { count: linkedinConversations },
      { count: emailConversations }
    ] = await Promise.all([
      // Total conversations
      supabase.from('people').select('*', { count: 'exact', head: true })
        .in('stage', ['messaged', 'replied', 'connected']),
      
      // Unread conversations
      supabase.from('people').select('*', { count: 'exact', head: true })
        .eq('stage', 'messaged')
        .is('last_reply_message', null),
      
      // Active conversations
      supabase.from('people').select('*', { count: 'exact', head: true })
        .in('stage', ['messaged', 'replied']),
      
      // Messages today
      supabase.from('people').select('*', { count: 'exact', head: true })
        .gte('message_sent_date', today),
      
      // Messages this week
      supabase.from('people').select('*', { count: 'exact', head: true })
        .gte('message_sent_date', weekAgo),
      
      // LinkedIn conversations
      supabase.from('people').select('*', { count: 'exact', head: true })
        .in('stage', ['messaged', 'replied', 'connected']),
      
      // Email conversations
      supabase.from('people').select('*', { count: 'exact', head: true })
        .or('email_sent.eq.true,last_reply_channel.eq.email')
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
  }
}

export const conversationService = new ConversationService();








