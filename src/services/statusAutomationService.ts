/**
 * Automatic Status Updates Service
 * Implements 2025 best practices: event-driven, optimistic updates, minimal code
 *
 * Automatically updates statuses based on user actions without manual intervention
 */

import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface StatusUpdateOptions {
  showToast?: boolean;
  optimistic?: boolean;
  skipNotification?: boolean;
}

class StatusAutomationService {
  private static instance: StatusAutomationService;
  private toastHandler: ReturnType<typeof useToast> | null = null;

  private constructor() {}

  static getInstance() {
    if (!StatusAutomationService.instance) {
      StatusAutomationService.instance = new StatusAutomationService();
    }
    return StatusAutomationService.instance;
  }

  /**
   * Initialize service with toast handler
   */
  init(toastHandler: ReturnType<typeof useToast>) {
    this.toastHandler = toastHandler;
  }

  /**
   * Update lead status when message sent
   * Automatically progresses: active → active (status maintained)
   */
  async onMessageSent(
    personId: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status: 'active', email_sent: true })
        .eq('id', personId)
        .select()
        .single();

      if (error) throw error;

      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler.toast({
          title: 'Status Updated',
          description: 'Lead updated after sending message',
        });
      }
    } catch (error) {
      console.error('Failed to update person status:', error);
      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler.toast({
          title: 'Update Failed',
          description: 'Could not update lead status automatically',
          variant: 'destructive',
        });
      }
    }
  }

  /**
   * Update company status when first message sent
   * Note: Pipeline stages removed - this method is kept for backward compatibility but does nothing
   */
  async onOutreachStarted(
    companyId: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    // Pipeline stages removed - no action needed
    return;
  }

  /**
   * Update statuses when response received
   * Lead: active → replied_manual
   */
  async onResponseReceived(
    personId: string,
    companyId: string,
    responseContent: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    try {
      // Update lead
      await supabase
        .from('leads')
        .update({
          status: 'replied_manual',
          last_reply_at: new Date().toISOString(),
          last_reply_message: responseContent,
        })
        .eq('id', personId);

      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler.toast({
          title: 'Response Received',
          description: 'Lead updated to "Replied"',
        });
      }
    } catch (error) {
      console.error('Failed to update response status:', error);
    }
  }

  /**
   * Update company status when meeting scheduled
   * Note: Pipeline stages removed - this method is kept for backward compatibility but does nothing
   */
  async onMeetingScheduled(
    companyId: string,
    meetingDate: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    // Pipeline stages removed - no action needed
    return;
  }

  /**
   * Check for inactive companies (30+ days)
   * Note: Pipeline stages removed - this method is kept for backward compatibility but does nothing
   */
  async checkInactivity(): Promise<void> {
    // Pipeline stages removed - no action needed
    return;
  }

  /**
   * Batch update multiple leads at once
   */
  async batchUpdatePeople(
    personIds: string[],
    stage: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    try {
      await supabase
        .from('leads')
        .update({ status: stage })
        .in('id', personIds);

      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler.toast({
          title: 'Batch Updated',
          description: `Updated ${personIds.length} leads to "${stage}"`,
        });
      }
    } catch (error) {
      console.error('Failed to batch update:', error);
    }
  }
}

// Singleton instance
export const statusAutomation = StatusAutomationService.getInstance();

/**
 * React Hook for Status Automation
 * Provides clean API with toast integration
 */
export function useStatusAutomation() {
  const { toast } = useToast();

  // Initialize on mount
  React.useEffect(() => {
    statusAutomation.init({
      toast,
      dismiss: (toastId?: string) => {},
      toasts: [],
    });
  }, [toast]);

  return {
    onMessageSent: (personId: string, options?: StatusUpdateOptions) =>
      statusAutomation.onMessageSent(personId, options),
    onOutreachStarted: (companyId: string, options?: StatusUpdateOptions) =>
      statusAutomation.onOutreachStarted(companyId, options),
    onResponseReceived: (
      personId: string,
      companyId: string,
      responseContent: string,
      options?: StatusUpdateOptions
    ) =>
      statusAutomation.onResponseReceived(
        personId,
        companyId,
        responseContent,
        options
      ),
    onMeetingScheduled: (
      companyId: string,
      meetingDate: string,
      options?: StatusUpdateOptions
    ) => statusAutomation.onMeetingScheduled(companyId, meetingDate, options),
    checkInactivity: () => statusAutomation.checkInactivity(),
    batchUpdatePeople: (
      personIds: string[],
      stage: string,
      options?: StatusUpdateOptions
    ) => statusAutomation.batchUpdatePeople(personIds, stage, options),
  };
}
