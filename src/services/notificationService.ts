import { supabase } from '@/integrations/supabase/client';

export type NotificationType =
  | 'new_jobs_discovered'
  | 'email_response_received'
  | 'meeting_reminder'
  | 'follow_up_reminder'
  | 'company_enriched';

export type NotificationPriority = 'low' | 'medium' | 'high';

export type ActionEntityType =
  | 'job'
  | 'person'
  | 'company'
  | 'campaign'
  | 'page';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_type: 'navigate' | 'none' | null;
  action_url: string | null;
  action_entity_type: ActionEntityType | null;
  action_entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  action_type?: 'navigate' | 'none';
  action_url?: string;
  action_entity_type?: ActionEntityType;
  action_entity_id?: string;
  metadata?: Record<string, unknown>;
}

class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(
    input: CreateNotificationInput
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: input.user_id,
        type: input.type,
        priority: input.priority || 'high',
        title: input.title,
        message: input.message,
        action_type: input.action_type || 'none',
        action_url: input.action_url || null,
        action_entity_type: input.action_entity_type || null,
        action_entity_id: input.action_entity_id || null,
        metadata: input.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }

    return data as Notification;
  }

  /**
   * Get notifications for current user
   */
  async getNotifications(options?: {
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<Notification[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const fields = [
      'id',
      'user_id',
      'type',
      'priority',
      'title',
      'message',
      'action_type',
      'action_url',
      'action_entity_type',
      'action_entity_id',
      'is_read',
      'read_at',
      'metadata',
      'created_at',
    ].join(', ');

    let query = supabase
      .from('user_notifications')
      .select(fields)
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (options?.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }

    return (data || []) as Notification[];
  }

  /**
   * Get unread notification count
   * Uses database function for better performance
   */
  async getUnreadCount(): Promise<number> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return 0;

    try {
      const { data, error } = await supabase.rpc(
        'get_unread_notification_count',
        {}
      );

      if (error) {
        console.error('Failed to get unread count via RPC:', error);
        // Fallback to direct query if RPC fails
        const { count, error: fallbackError } = await supabase
          .from('user_notifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.user.id)
          .eq('is_read', false);

        if (fallbackError) {
          console.error('Failed to get unread count:', fallbackError);
          return 0;
        }

        return count || 0;
      }

      return typeof data === 'number' ? data : 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase.rpc('mark_notification_read', {
      notification_id: notificationId,
    });

    if (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<number> {
    const { data, error } = await supabase.rpc(
      'mark_all_notifications_read',
      {}
    );

    if (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }

    return typeof data === 'number' ? data : 0;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  // ====================
  // High-Priority Notification Creators
  // ====================

  /**
   * Create notification for new jobs discovered
   */
  async notifyNewJobsDiscovered(
    userId: string,
    jobCount: number,
    clientId?: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      type: 'new_jobs_discovered',
      priority: 'high',
      title: `${jobCount} New Job${jobCount > 1 ? 's' : ''} Discovered`,
      message:
        jobCount === 1
          ? 'A new job has been discovered and is ready for review.'
          : `${jobCount} new jobs have been discovered and are ready for review.`,
      action_type: 'navigate',
      action_url: '/jobs?status=new',
      action_entity_type: 'page',
      metadata: {
        job_count: jobCount,
        client_id: clientId,
      },
    });
  }

  /**
   * Create notification for email response received
   */
  async notifyEmailResponseReceived(
    userId: string,
    personName: string,
    personId: string,
    companyId?: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      type: 'email_response_received',
      priority: 'high',
      title: 'New Email Response',
      message: `${personName} replied to your message`,
      action_type: 'navigate',
      action_url: `/people/${personId}`,
      action_entity_type: 'person',
      action_entity_id: personId,
      metadata: {
        person_id: personId,
        company_id: companyId,
      },
    });
  }

  /**
   * Create notification for meeting reminder
   */
  async notifyMeetingReminder(
    userId: string,
    companyName: string,
    companyId: string,
    meetingTime: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      type: 'meeting_reminder',
      priority: 'high',
      title: 'Meeting Reminder',
      message: `Meeting with ${companyName} ${meetingTime}`,
      action_type: 'navigate',
      action_url: `/companies/${companyId}`,
      action_entity_type: 'company',
      action_entity_id: companyId,
      metadata: {
        meeting_time: meetingTime,
      },
    });
  }

  /**
   * Create notification for follow-up reminder
   */
  async notifyFollowUpReminder(
    userId: string,
    personCount: number,
    personIds?: string[]
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      type: 'follow_up_reminder',
      priority: 'high',
      title: 'Follow-Up Reminder',
      message:
        personCount === 1
          ? '1 person needs follow-up today'
          : `${personCount} people need follow-up today`,
      action_type: 'navigate',
      action_url: '/people?stage=proceed&needs_followup=true',
      action_entity_type: 'page',
      metadata: {
        person_count: personCount,
        person_ids: personIds || [],
      },
    });
  }

  /**
   * Create notification for company enrichment completion
   */
  async notifyCompanyEnriched(
    userId: string,
    companyName: string,
    companyId: string,
    leadsFound?: number
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      type: 'company_enriched',
      priority: 'high',
      title: 'Company Enriched',
      message:
        typeof leadsFound === 'number'
          ? `${companyName} enriched. ${leadsFound} decision maker${
              leadsFound === 1 ? '' : 's'
            } found.`
          : `${companyName} enriched successfully.`,
      action_type: 'navigate',
      action_url: `/companies/${companyId}`,
      action_entity_type: 'company',
      action_entity_id: companyId,
      metadata: {
        company_id: companyId,
        leads_found: leadsFound,
      },
    });
  }
}

export const notificationService = new NotificationService();
