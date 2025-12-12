/**
 * Enhanced Error Logging Service with Supabase Integration
 * Provides comprehensive error logging with email notifications
 */

import { supabase } from '@/integrations/supabase/client';
import {
  ErrorCategory,
  ErrorContext,
  ErrorSeverity,
  errorLogger,
} from './errorLogger';

export interface ErrorNotificationSettings {
  emailNotifications: boolean;
  notificationSeverity: ErrorSeverity;
  notificationEmail?: string;
  slackWebhookUrl?: string;
  webhookUrl?: string;
}

export interface SupabaseErrorLog {
  id: string;
  error_id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  user_id?: string;
  session_id?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  user_agent?: string;
  url?: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
}

class SupabaseErrorService {
  private notificationSettings: ErrorNotificationSettings | null = null;
  private adminEmail: string | null = null;
  private isLogging = false; // Guard flag to prevent recursive logging
  private isLogging = false; // Guard flag to prevent recursive logging

  /**
   * Initialize the error service with admin email
   */
  async initialize(adminEmail?: string): Promise<void> {
    this.adminEmail = adminEmail || null;
    await this.loadNotificationSettings();
  }

  /**
   * Load notification settings for the current user
   */
  private async loadNotificationSettings(): Promise<void> {
    try {
      // Safely get user - prevent errors during initialization
      let user = null;
      try {
        const authResponse = await supabase.auth.getUser();
        // Defensive check: ensure authResponse and data exist before accessing
        if (authResponse?.data && authResponse.data.user) {
          user = authResponse.data.user;
        }
      } catch (authError) {
        // Auth might fail during initialization - just return without settings
        return;
      }

      if (!user) return;

      const { data: settings, error } = await supabase
        .from('error_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Handle case where error_settings table doesn't exist yet
      if (error && error.code === 'PGRST116') {
        // Silently use default settings without logging
        this.notificationSettings = {
          emailNotifications: true,
          notificationSeverity: ErrorSeverity.HIGH,
          notificationEmail: user.email || undefined,
        };
        return;
      }

      if (error) {
        // Only log non-table-missing errors
        if (error.code !== 'PGRST205') {
          console.error('Failed to load notification settings:', error);
        }
        return;
      }

      if (settings) {
        this.notificationSettings = {
          emailNotifications: settings.email_notifications ?? true,
          notificationSeverity:
            (settings.notification_severity as ErrorSeverity) ??
            ErrorSeverity.HIGH,
          notificationEmail: settings.notification_email ?? undefined,
          slackWebhookUrl: settings.slack_webhook_url ?? undefined,
          webhookUrl: settings.webhook_url ?? undefined,
        };
      }
    } catch (error) {
      // Only log unexpected errors, not table missing errors
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code !== 'PGRST205'
      ) {
        console.error('Failed to load notification settings:', error);
      }
      // Set default settings on error
      this.notificationSettings = {
        emailNotifications: true,
        notificationSeverity: ErrorSeverity.HIGH,
      };
    }
  }

  /**
   * Log error to Supabase database
   */
  async logErrorToSupabase(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context: ErrorContext = {}
  ): Promise<string> {
    try {
      // Safely get user - handle case where auth might fail during error logging
      let user = null;
      try {
        const authResponse = await supabase.auth.getUser();
        // Defensive check: ensure authResponse and data exist before accessing
        if (authResponse?.data && authResponse.data.user) {
          user = authResponse.data.user;
        }
      } catch (authError) {
        // Silently fail auth check during error logging to prevent cascading errors
        // Don't log to prevent infinite loops
      }

      const errorId = this.generateErrorId();
      const timestamp = new Date().toISOString();

      const errorData = {
        id: errorId,
        message: typeof error === 'string' ? error : error.message,
        stack:
          typeof error === 'object' && error.stack ? error.stack : undefined,
        severity,
        type: category,
        user_id: user?.id,
        session_id: context.sessionId,
        component_name: context.component,
        metadata: {
          ...context.metadata,
          action: context.action,
          url:
            context.url ||
            (typeof window !== 'undefined' ? window.location.href : undefined),
        },
        user_agent:
          context.userAgent ||
          (typeof window !== 'undefined'
            ? window.navigator.userAgent
            : undefined),
        url:
          context.url ||
          (typeof window !== 'undefined' ? window.location.href : undefined),
        timestamp: timestamp,
      };

      // Use API route instead of direct Supabase insert to avoid RLS issues
      // Prevent recursive logging
      if (this.isLogging) {
        return errorId;
      }

      try {
        this.isLogging = true;
        
        // Map ErrorCategory to API route's expected type
        const categoryToTypeMap: Record<ErrorCategory, 'unhandled' | 'promise' | 'resource' | 'validation' | 'permission' | 'data' | 'unknown'> = {
          [ErrorCategory.AUTHENTICATION]: 'permission',
          [ErrorCategory.DATABASE]: 'data',
          [ErrorCategory.NETWORK]: 'resource',
          [ErrorCategory.VALIDATION]: 'validation',
          [ErrorCategory.UI]: 'unhandled',
          [ErrorCategory.BUSINESS_LOGIC]: 'data',
          [ErrorCategory.UNKNOWN]: 'unknown',
        };

        const response = await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: errorData.message,
            stack: errorData.stack,
            timestamp: errorData.timestamp,
            userAgent: errorData.user_agent || (typeof window !== 'undefined' ? window.navigator.userAgent : ''),
            url: errorData.url || (typeof window !== 'undefined' ? window.location.href : ''),
            type: categoryToTypeMap[category] || 'unknown',
            componentName: errorData.component_name,
            userId: errorData.user_id,
            sessionId: errorData.session_id,
            metadata: errorData.metadata,
          }),
        });

        if (!response.ok) {
          // Silently fail - don't let error logging cause cascading errors
          this.isLogging = false;
          return errorId;
        }

        const result = await response.json().catch(() => null);
        if (result?.id) {
          // Use the returned ID from API
          errorData.id = result.id;
        }
        
        this.isLogging = false;
      } catch (fetchError) {
        // Silently fail error logging to prevent cascading errors
        this.isLogging = false;
        return errorId;
      }

      // For notification purposes, create a mock data object
      const data = {
        id: errorId,
        ...errorData,
      };

      // Check if we should send notifications
      // Wrap in try-catch to prevent notification errors from breaking error logging
      if (data) {
        try {
          await this.checkAndSendNotifications(data, severity);
        } catch (notificationError) {
          // Silently fail notifications - don't let notification errors break error logging
        }
      }

      return errorId;
    } catch (error) {
      // Prevent error logging from causing cascading errors
      // Never log errors that occur during error logging - this prevents infinite loops
      // Silently return an error ID so the calling code can continue
      return this.generateErrorId();
    }
  }

  /**
   * Check if notifications should be sent and send them
   */
  private async checkAndSendNotifications(
    errorLog: SupabaseErrorLog,
    severity: ErrorSeverity
  ): Promise<void> {
    if (!this.shouldSendNotification(severity)) {
      return;
    }

    try {
      // Send email notification
      if (this.notificationSettings?.emailNotifications) {
        await this.sendEmailNotification(errorLog);
      }

      // Send Slack notification if configured
      if (this.notificationSettings?.slackWebhookUrl) {
        await this.sendSlackNotification(errorLog);
      }

      // Send webhook notification if configured
      if (this.notificationSettings?.webhookUrl) {
        await this.sendWebhookNotification(errorLog);
      }
    } catch (error) {
      console.error('Failed to send notifications:', error);
    }
  }

  /**
   * Determine if notification should be sent based on severity
   */
  private shouldSendNotification(severity: ErrorSeverity): boolean {
    if (!this.notificationSettings) return false;

    const severityLevels = {
      [ErrorSeverity.LOW]: 1,
      [ErrorSeverity.MEDIUM]: 2,
      [ErrorSeverity.HIGH]: 3,
      [ErrorSeverity.CRITICAL]: 4,
    };

    const currentLevel = severityLevels[severity];
    const thresholdLevel =
      severityLevels[this.notificationSettings.notificationSeverity];

    return currentLevel >= thresholdLevel;
  }

  /**
   * Send email notification for critical errors
   */
  private async sendEmailNotification(
    errorLog: SupabaseErrorLog
  ): Promise<void> {
    try {
      const recipientEmail =
        this.notificationSettings?.notificationEmail || this.adminEmail;
      if (!recipientEmail) return;

      const emailSubject = `🚨 ${errorLog.severity.toUpperCase()} Error in Empowr CRM`;
      const emailBody = this.generateErrorEmailBody(errorLog);

      // Use the existing Gmail service to send the email
      const { gmailService } = await import('@/services/gmailService');

      await gmailService.sendEmail({
        to: [recipientEmail],
        subject: emailSubject,
        body: emailBody,
      });

      // Log the notification
      await this.logNotification(errorLog.id, 'email', recipientEmail, 'sent');
    } catch (error) {
      console.error('Failed to send email notification:', error);
      await this.logNotification(
        errorLog.id,
        'email',
        this.notificationSettings?.notificationEmail,
        'failed',
        error.message
      );
    }
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    errorLog: SupabaseErrorLog
  ): Promise<void> {
    try {
      const webhookUrl = this.notificationSettings?.slackWebhookUrl;
      if (!webhookUrl) return;

      const slackMessage = {
        text: `🚨 ${errorLog.severity.toUpperCase()} Error in Empowr CRM`,
        attachments: [
          {
            color: this.getSeverityColor(errorLog.severity),
            fields: [
              {
                title: 'Error Message',
                value: errorLog.message,
                short: false,
              },
              {
                title: 'Category',
                value: errorLog.category,
                short: true,
              },
              {
                title: 'Component',
                value: errorLog.component || 'Unknown',
                short: true,
              },
              {
                title: 'User',
                value: errorLog.user_id || 'Anonymous',
                short: true,
              },
              {
                title: 'URL',
                value: errorLog.url || 'Unknown',
                short: false,
              },
            ],
            footer: 'Empowr CRM Error Monitoring',
            ts: Math.floor(new Date(errorLog.created_at).getTime() / 1000),
          },
        ],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage),
      });

      await this.logNotification(errorLog.id, 'slack', webhookUrl, 'sent');
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      await this.logNotification(
        errorLog.id,
        'slack',
        this.notificationSettings?.slackWebhookUrl,
        'failed',
        error.message
      );
    }
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(
    errorLog: SupabaseErrorLog
  ): Promise<void> {
    try {
      const webhookUrl = this.notificationSettings?.webhookUrl;
      if (!webhookUrl) return;

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error_notification',
          error: errorLog,
          timestamp: new Date().toISOString(),
        }),
      });

      await this.logNotification(errorLog.id, 'webhook', webhookUrl, 'sent');
    } catch (error) {
      console.error('Failed to send webhook notification:', error);
      await this.logNotification(
        errorLog.id,
        'webhook',
        this.notificationSettings?.webhookUrl,
        'failed',
        error.message
      );
    }
  }

  /**
   * Generate HTML email body for error notifications
   */
  private generateErrorEmailBody(errorLog: SupabaseErrorLog): string {
    const severityEmoji = {
      [ErrorSeverity.LOW]: '🟡',
      [ErrorSeverity.MEDIUM]: '🟠',
      [ErrorSeverity.HIGH]: '🔴',
      [ErrorSeverity.CRITICAL]: '🚨',
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-left: 4px solid ${this.getSeverityColor(errorLog.severity)}; padding: 20px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0; color: #333;">
            ${severityEmoji[errorLog.severity]} ${errorLog.severity.toUpperCase()} Error Detected
          </h2>
          <p style="margin: 0; color: #666; font-size: 14px;">
            ${new Date(errorLog.created_at).toLocaleString()}
          </p>
        </div>

        <div style="background-color: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">Error Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 150px;">Message:</td>
              <td style="padding: 8px 0; color: #333;">${errorLog.message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Category:</td>
              <td style="padding: 8px 0; color: #333;">${errorLog.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Component:</td>
              <td style="padding: 8px 0; color: #333;">${errorLog.component || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Action:</td>
              <td style="padding: 8px 0; color: #333;">${errorLog.action || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">User ID:</td>
              <td style="padding: 8px 0; color: #333;">${errorLog.user_id || 'Anonymous'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">URL:</td>
              <td style="padding: 8px 0; color: #333;">${errorLog.url || 'Unknown'}</td>
            </tr>
          </table>
        </div>

        ${
          errorLog.stack
            ? `
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Stack Trace</h3>
            <pre style="background-color: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 0;">${errorLog.stack}</pre>
          </div>
        `
            : ''
        }

        ${
          errorLog.metadata && Object.keys(errorLog.metadata).length > 0
            ? `
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Additional Metadata</h3>
            <pre style="background-color: white; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 0; border: 1px solid #e9ecef;">${JSON.stringify(errorLog.metadata, null, 2)}</pre>
          </div>
        `
            : ''
        }

        <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #1976d2;">Next Steps</h3>
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            <li>Review the error details above</li>
            <li>Check the application logs for more context</li>
            <li>Consider implementing additional error handling</li>
            <li>Monitor for similar errors in the future</li>
          </ul>
        </div>

        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          This notification was sent by Empowr CRM Error Monitoring System.<br>
          Error ID: ${errorLog.error_id}
        </p>
      </div>
    `;
  }

  /**
   * Get color for severity level
   */
  private getSeverityColor(severity: ErrorSeverity): string {
    const colors = {
      [ErrorSeverity.LOW]: '#28a745',
      [ErrorSeverity.MEDIUM]: '#ffc107',
      [ErrorSeverity.HIGH]: '#fd7e14',
      [ErrorSeverity.CRITICAL]: '#dc3545',
    };
    return colors[severity];
  }

  /**
   * Log notification attempt
   */
  private async logNotification(
    errorLogId: string,
    type: string,
    recipient: string,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase.from('error_notifications').insert({
        error_log_id: errorLogId,
        notification_type: type,
        recipient_email: type === 'email' ? recipient : undefined,
        status,
        error_message: errorMessage,
        metadata: {
          recipient,
          type,
        },
      });
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }

  /**
   * Get error logs with pagination
   */
  async getErrorLogs(
    page: number = 1,
    limit: number = 50,
    severity?: ErrorSeverity,
    category?: ErrorCategory,
    resolved?: boolean
  ): Promise<{ data: SupabaseErrorLog[]; count: number }> {
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse?.data?.user ?? null;
      if (!user) return { data: [], count: 0 };

      // Note: activity_log doesn't have user_id, severity, category, resolved fields
      // Using activity_type and metadata for filtering
      let query = supabase
        .from('activity_log')
        .select('*', { count: 'exact' })
        .eq('activity_type', 'manual_note')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      // Note: Filtering by severity/category/resolved would require querying metadata jsonb
      // For now, returning all manual_note activities

      const { data, count, error } = await query;

      if (error) {
        console.error('Failed to fetch error logs:', error);
        return { data: [], count: 0 };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Failed to get error logs:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Mark error as resolved
   */
  async resolveError(errorId: string): Promise<boolean> {
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse?.data?.user ?? null;
      if (!user) return false;

      // Note: activity_log doesn't have resolved, resolved_at, resolved_by, error_id, user_id fields
      // This function may not work correctly with activity_log structure
      // Consider using metadata field to track resolution status
      const { error } = await supabase
        .from('activity_log')
        .update({
          metadata: {
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: user.id,
          } as Record<string, unknown>,
        })
        .eq('id', errorId);

      return !error;
    } catch (error) {
      console.error('Failed to resolve error:', error);
      return false;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    settings: Partial<ErrorNotificationSettings>
  ): Promise<boolean> {
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse?.data?.user ?? null;
      if (!user) return false;

      const { error } = await supabase.from('error_settings').upsert({
        user_id: user.id,
        email_notifications: settings.emailNotifications,
        notification_severity: settings.notificationSeverity,
        notification_email: settings.notificationEmail,
        slack_webhook_url: settings.slackWebhookUrl,
        webhook_url: settings.webhookUrl,
      });

      if (!error) {
        await this.loadNotificationSettings();
      }

      return !error;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      return false;
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    // Generate a proper UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}

// Create singleton instance
export const supabaseErrorService = new SupabaseErrorService();

// Enhanced error logger that integrates with Supabase
export class EnhancedErrorLogger {
  /**
   * Log error with Supabase integration
   * Wrapped in try-catch to prevent error logging from causing cascading errors
   */
  async logError(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context: ErrorContext = {}
  ): Promise<string> {
    try {
      // Log to local error logger (always succeeds)
      const localErrorId = errorLogger.logError(
        error,
        severity,
        category,
        context
      );

      // Log to Supabase (may fail silently to prevent cascading errors)
      try {
        const supabaseErrorId = await supabaseErrorService.logErrorToSupabase(
          error,
          severity,
          category,
          context
        );
        return supabaseErrorId || localErrorId;
      } catch (supabaseError) {
        // If Supabase logging fails, just return local error ID
        // Don't log this error to prevent infinite loops
        return localErrorId;
      }
    } catch (error) {
      // Last resort - just generate an ID and return
      // This should never happen, but if it does, we need to prevent infinite loops
      return `error-${Date.now()}`;
    }
  }

  /**
   * Log authentication errors
   */
  async logAuthError(
    error: Error | string,
    context: ErrorContext = {}
  ): Promise<string> {
    return this.logError(
      error,
      ErrorSeverity.HIGH,
      ErrorCategory.AUTHENTICATION,
      context
    );
  }

  /**
   * Log database errors
   */
  async logDatabaseError(
    error: Error | string,
    context: ErrorContext = {}
  ): Promise<string> {
    return this.logError(
      error,
      ErrorSeverity.HIGH,
      ErrorCategory.DATABASE,
      context
    );
  }

  /**
   * Log network errors
   */
  async logNetworkError(
    error: Error | string,
    context: ErrorContext = {}
  ): Promise<string> {
    return this.logError(
      error,
      ErrorSeverity.MEDIUM,
      ErrorCategory.NETWORK,
      context
    );
  }

  /**
   * Log UI errors
   */
  async logUIError(
    error: Error | string,
    context: ErrorContext = {}
  ): Promise<string> {
    return this.logError(error, ErrorSeverity.LOW, ErrorCategory.UI, context);
  }

  /**
   * Log critical errors
   */
  async logCriticalError(
    error: Error | string,
    context: ErrorContext = {}
  ): Promise<string> {
    return this.logError(
      error,
      ErrorSeverity.CRITICAL,
      ErrorCategory.UNKNOWN,
      context
    );
  }
}

// Export enhanced error logger instance
export const enhancedErrorLogger = new EnhancedErrorLogger();
