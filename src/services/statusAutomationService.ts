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
  init(toast: ReturnType<typeof useToast>) {
    this.toastHandler = toast;
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
        this.toastHandler({
          title: 'Status Updated',
          description: 'Lead updated after sending message',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to update person status:', error);
      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler({
          title: 'Update Failed',
          description: 'Could not update lead status automatically',
          variant: 'destructive',
        });
      }
    }
  }

  /**
   * Update company status when first message sent
   * Automatically progresses: new_lead → outreach_started
   */
  async onOutreachStarted(
    companyId: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ pipeline_stage: 'outreach_started' })
        .eq('id', companyId)
        .eq('pipeline_stage', 'new_lead') // Only update if still new_lead
        .select()
        .single();

      if (error) throw error;

      if (data && !options.skipNotification && this.toastHandler) {
        this.toastHandler({
          title: 'Pipeline Updated',
          description: 'Company moved to "Outreach Started"',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to update company status:', error);
    }
  }

  /**
   * Update statuses when response received
   * Lead: active → replied_manual
   * Company: outreach_started → replied
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

      // Update company
      await supabase
        .from('companies')
        .update({ pipeline_stage: 'replied' })
        .eq('id', companyId)
        .eq('pipeline_stage', 'outreach_started');

      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler({
          title: 'Response Received',
          description: 'Lead updated to "Replied", company to "Replied"',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to update response status:', error);
    }
  }

  /**
   * Update company status when meeting scheduled
   * Company: replied → meeting_scheduled
   */
  async onMeetingScheduled(
    companyId: string,
    meetingDate: string,
    options: StatusUpdateOptions = {}
  ): Promise<void> {
    try {
      await supabase
        .from('companies')
        .update({ pipeline_stage: 'meeting_scheduled' })
        .eq('id', companyId);

      if (!options.skipNotification && this.toastHandler) {
        this.toastHandler({
          title: 'Meeting Scheduled',
          description: 'Company moved to "Meeting Scheduled"',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to update meeting status:', error);
    }
  }

  /**
   * Check for inactive companies (30+ days)
   * Automatically moves to on_hold
   */
  async checkInactivity(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: inactiveCompanies } = await supabase
        .from('companies')
        .select('id, name')
        .in('pipeline_stage', ['new_lead', 'outreach_started'])
        .lt('updated_at', thirtyDaysAgo.toISOString());

      if (inactiveCompanies && inactiveCompanies.length > 0) {
        await supabase
          .from('companies')
          .update({ pipeline_stage: 'on_hold' })
          .in(
            'id',
            inactiveCompanies.map(c => c.id)
          );
      }
    } catch (error) {
      console.error('Failed to check inactivity:', error);
    }
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
        this.toastHandler({
          title: 'Batch Updated',
          description: `Updated ${personIds.length} leads to "${stage}"`,
          variant: 'success',
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
    statusAutomation.init(toast);
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
