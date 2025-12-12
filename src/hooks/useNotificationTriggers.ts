import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

/**
 * Hook to check and create meeting reminders
 * Runs once per day to check for meetings in next 24 hours
 */
export function useMeetingReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checkMeetingReminders = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get user's client_id if available
      const { data: clientUser } = await supabase
        .from('client_users')
        .select('client_id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check for companies with meetings scheduled in next 24 hours
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);

      const { data: companiesWithMeetings } = await supabase
        .from('companies')
        .select('id, name, pipeline_stage')
        .eq('pipeline_stage', 'meeting_scheduled');

      if (!companiesWithMeetings || companiesWithMeetings.length === 0) {
        return;
      }

      // Check if notification already exists for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingNotifications } = await supabase
        .from('user_notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'meeting_reminder')
        .gte('created_at', `${today}T00:00:00`)
        .eq('is_read', false);

      const existingCompanyIds = new Set(
        (existingNotifications || [])
          .map(n => n.metadata?.company_id)
          .filter(Boolean)
      );

      // Create notifications for meetings without existing notifications
      for (const company of companiesWithMeetings) {
        if (!existingCompanyIds.has(company.id)) {
          const meetingTime = 'tomorrow'; // Simplified - could parse from metadata
          await notificationService.notifyMeetingReminder(
            user.id,
            company.name || 'Unknown Company',
            company.id,
            meetingTime
          );
        }
      }

      queryClient.invalidateQueries({
        queryKey: ['notification-unread-count'],
      });
    } catch (error) {
      console.error('Failed to check meeting reminders:', error);
    }
  }, [user, queryClient]);

  // Check on mount and then daily
  useEffect(() => {
    checkMeetingReminders();

    // Set up daily check (check every hour for simplicity)
    const interval = setInterval(checkMeetingReminders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkMeetingReminders]);
}

/**
 * Hook to check and create follow-up reminders
 * Checks for people who haven't been contacted in X days
 */
export function useFollowUpReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checkFollowUpReminders = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get user's client_id if available
      const { data: clientUser } = await supabase
        .from('client_users')
        .select('client_id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Find people in 'proceed' stage who need follow-up
      // Consider people who:
      // 1. Are in 'proceed' stage
      // 2. Have last_activity > 3 days ago OR no last_activity
      // 3. Have at least one email sent

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const query = supabase
        .from('people')
        .select('id, name, last_activity, people_stage')
        .eq('people_stage', 'meeting_scheduled')
        .or(
          `last_activity.is.null,last_activity.lt.${threeDaysAgo.toISOString()}`
        );

      // Note: people table does not have client_id column; scoping by client
      // should be done via mapping tables if needed. Skip client filter here.

      const { data: peopleNeedingFollowUp } = await query;

      if (!peopleNeedingFollowUp || peopleNeedingFollowUp.length === 0) {
        return;
      }

      // Filter to only those who have sent at least one email
      const { data: emailSends } = await supabase
        .from('email_sends')
        .select('person_id')
        .eq('status', 'sent')
        .in(
          'person_id',
          peopleNeedingFollowUp.map(p => p.id)
        );

      const peopleWithEmails = new Set(
        (emailSends || []).map(e => e.person_id)
      );

      const peopleToNotify = peopleNeedingFollowUp.filter(p =>
        peopleWithEmails.has(p.id)
      );

      if (peopleToNotify.length === 0) {
        return;
      }

      // Check if notification already exists for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingNotification } = await supabase
        .from('user_notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'follow_up_reminder')
        .gte('created_at', `${today}T00:00:00`)
        .eq('is_read', false)
        .maybeSingle();

      if (existingNotification) {
        return; // Already notified today
      }

      // Create single notification for all people needing follow-up
      await notificationService.notifyFollowUpReminder(
        user.id,
        peopleToNotify.length,
        peopleToNotify.map(p => p.id)
      );

      queryClient.invalidateQueries({
        queryKey: ['notification-unread-count'],
      });
    } catch (error) {
      console.error('Failed to check follow-up reminders:', error);
    }
  }, [user, queryClient]);

  // Check on mount and then every 4 hours
  useEffect(() => {
    checkFollowUpReminders();

    const interval = setInterval(checkFollowUpReminders, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkFollowUpReminders]);
}

/**
 * Main hook that initializes all notification triggers
 */
export function useNotificationTriggers() {
  useMeetingReminders();
  useFollowUpReminders();
}
