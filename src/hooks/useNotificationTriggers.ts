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
      // Multi-tenant removed - not in PDR. All users see their own data via RLS.

      // Check for companies with meetings scheduled in next 24 hours
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);

      // Pipeline stages removed - no meeting notifications based on pipeline stage
      const { data: companiesWithMeetings, error: companiesError } =
        await supabase.from('companies').select('id, name').limit(0); // Return empty since pipeline stages are removed

      // Handle Supabase errors gracefully (network issues, auth errors, etc.)
      if (companiesError) {
        // Silently return - errors are expected during network issues or when user is not authenticated
        return;
      }

      if (!companiesWithMeetings || companiesWithMeetings.length === 0) {
        return;
      }

      // Check if notification already exists for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingNotifications, error: notificationsError } =
        await supabase
          .from('user_notifications' as never)
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'meeting_reminder')
          .gte('created_at', `${today}T00:00:00`)
          .eq('is_read', false);

      // Handle Supabase errors gracefully
      if (notificationsError) {
        // Silently return - errors are expected during network issues
        return;
      }

      const existingCompanyIds = new Set(
        (existingNotifications || [])
          .map(
            (n: { metadata?: { company_id?: string } }) =>
              n.metadata?.company_id
          )
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
      // Multi-tenant removed - not in PDR. All users see their own data via RLS.

      // Find people in 'proceed' stage who need follow-up
      // Consider people who:
      // 1. Are in 'proceed' stage
      // 2. Have last_activity > 3 days ago OR no last_activity
      // 3. Have at least one email sent

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const query = supabase
        .from('leads')
        .select('id, first_name, last_name, updated_at, status')
        .eq('status', 'replied_manual')
        .or(`updated_at.is.null,updated_at.lt.${threeDaysAgo.toISOString()}`);

      // Note: people table does not have client_id column; scoping by client
      // should be done via mapping tables if needed. Skip client filter here.

      const { data: peopleNeedingFollowUp, error: leadsError } = await query;

      // Handle Supabase errors gracefully (network issues, auth errors, etc.)
      if (leadsError) {
        // Silently return - errors are expected during network issues or when user is not authenticated
        return;
      }

      if (!peopleNeedingFollowUp || peopleNeedingFollowUp.length === 0) {
        return;
      }

      // Filter to only those who have sent at least one email
      const { data: emailSends, error: emailSendsError } = await supabase
        .from('email_sends')
        .select('lead_id')
        .eq('status', 'sent')
        .in(
          'lead_id',
          peopleNeedingFollowUp.map(p => p.id)
        );

      // Handle Supabase errors gracefully
      if (emailSendsError) {
        // Silently return - errors are expected during network issues
        return;
      }

      const peopleWithEmails = new Set(
        (emailSends || []).map(e => e.lead_id).filter(Boolean)
      );

      const peopleToNotify = peopleNeedingFollowUp.filter(p =>
        peopleWithEmails.has(p.id)
      );

      if (peopleToNotify.length === 0) {
        return;
      }

      // Check if notification already exists for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingNotification, error: notificationCheckError } =
        await supabase
          .from('user_notifications' as never)
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'follow_up_reminder')
          .gte('created_at', `${today}T00:00:00`)
          .eq('is_read', false)
          .maybeSingle();

      // Handle Supabase errors gracefully
      if (notificationCheckError) {
        // Silently return - errors are expected during network issues
        return;
      }

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
