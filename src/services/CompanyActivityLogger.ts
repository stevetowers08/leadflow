import { supabase } from '@/integrations/supabase/client';

export interface AutomationEventData {
  companyId: string;
  activityType:
    | 'automation'
    | 'email_sent'
    | 'linkedin_message'
    | 'lead_reply'
    | 'meeting_scheduled'
    | 'call_made';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  leadId?: string;
  jobId?: string;
}

export class CompanyActivityLogger {
  /**
   * Log an automation event for a company
   */
  static async logAutomationEvent(
    data: AutomationEventData
  ): Promise<string | null> {
    try {
      const { data: activityId, error } = await supabase.rpc(
        'log_company_automation_event',
        {
          p_company_id: data.companyId,
          p_activity_type: data.activityType,
          p_title: data.title,
          p_description: data.description || null,
          p_metadata: data.metadata || {},
          p_lead_id: data.leadId || null,
          p_job_id: data.jobId || null,
        }
      );

      if (error) {
        console.error('Error logging automation event:', error);
        return null;
      }

      return activityId;
    } catch (error) {
      console.error('Error logging automation event:', error);
      return null;
    }
  }

  /**
   * Log when LinkedIn automation starts for a company
   */
  static async logLinkedInAutomationStarted(
    companyId: string,
    leadsCount: number,
    campaignType: string = 'linkedin'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      activityType: 'automation',
      title: 'LinkedIn Automation Started',
      description: `Automated LinkedIn outreach campaign initiated for ${leadsCount} leads`,
      metadata: {
        campaign_type: campaignType,
        leads_count: leadsCount,
        automation_platform: 'linkedin',
      },
    });
  }

  /**
   * Log when a LinkedIn message is sent
   */
  static async logLinkedInMessageSent(
    companyId: string,
    leadId: string,
    leadName: string,
    messageType: string = 'connection'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      leadId,
      activityType: 'linkedin_message',
      title: 'LinkedIn Message Sent',
      description: `${messageType} message sent to ${leadName}`,
      metadata: {
        message_type: messageType,
        lead_name: leadName,
        platform: 'linkedin',
      },
    });
  }

  /**
   * Log when a lead replies to outreach
   */
  static async logLeadReply(
    companyId: string,
    leadId: string,
    leadName: string,
    responseType: string = 'positive'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      leadId,
      activityType: 'lead_reply',
      title: 'Lead Response Received',
      description: `${leadName} replied to outreach message`,
      metadata: {
        lead_name: leadName,
        response_type: responseType,
        response_platform: 'linkedin',
      },
    });
  }

  /**
   * Log when an email is sent
   */
  static async logEmailSent(
    companyId: string,
    leadId: string,
    leadName: string,
    emailType: string = 'cold_outreach'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      leadId,
      activityType: 'email_sent',
      title: 'Email Sent',
      description: `${emailType} email sent to ${leadName}`,
      metadata: {
        email_type: emailType,
        lead_name: leadName,
        platform: 'email',
      },
    });
  }

  /**
   * Log when a meeting is scheduled
   */
  static async logMeetingScheduled(
    companyId: string,
    leadId: string,
    leadName: string,
    meetingType: string = 'discovery'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      leadId,
      activityType: 'meeting_scheduled',
      title: 'Meeting Scheduled',
      description: `${meetingType} meeting scheduled with ${leadName}`,
      metadata: {
        meeting_type: meetingType,
        lead_name: leadName,
        status: 'scheduled',
      },
    });
  }

  /**
   * Log when a call is made
   */
  static async logCallMade(
    companyId: string,
    leadId: string,
    leadName: string,
    callOutcome: string = 'no_answer'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      leadId,
      activityType: 'call_made',
      title: 'Call Made',
      description: `Call made to ${leadName}`,
      metadata: {
        lead_name: leadName,
        call_outcome: callOutcome,
        call_type: 'outbound',
      },
    });
  }

  /**
   * Log when automation is paused or stopped
   */
  static async logAutomationStopped(
    companyId: string,
    reason: string = 'manual_stop'
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      activityType: 'automation',
      title: 'Automation Stopped',
      description: `Automation campaign stopped: ${reason}`,
      metadata: {
        stop_reason: reason,
        automation_status: 'stopped',
      },
    });
  }

  /**
   * Log when automation encounters an error
   */
  static async logAutomationError(
    companyId: string,
    errorMessage: string,
    leadId?: string
  ): Promise<string | null> {
    return this.logAutomationEvent({
      companyId,
      leadId,
      activityType: 'automation',
      title: 'Automation Error',
      description: `Automation encountered an error: ${errorMessage}`,
      metadata: {
        error_message: errorMessage,
        error_type: 'automation_error',
        automation_status: 'error',
      },
    });
  }
}

// Export convenience functions for easy use
export const logLinkedInAutomationStarted =
  CompanyActivityLogger.logLinkedInAutomationStarted;
export const logLinkedInMessageSent =
  CompanyActivityLogger.logLinkedInMessageSent;
export const logLeadReply = CompanyActivityLogger.logLeadReply;
export const logEmailSent = CompanyActivityLogger.logEmailSent;
export const logMeetingScheduled = CompanyActivityLogger.logMeetingScheduled;
export const logCallMade = CompanyActivityLogger.logCallMade;
export const logAutomationStopped = CompanyActivityLogger.logAutomationStopped;
export const logAutomationError = CompanyActivityLogger.logAutomationError;
