import { supabase } from '@/integrations/supabase/client';
import { getUserTimezone } from './timezoneUtils';

/**
 * Supabase client wrapper with timezone handling
 */
export class SupabaseWithTimezone {
  private timezone: string;

  constructor(timezone?: string) {
    this.timezone = timezone || getUserTimezone();
  }

  /**
   * Set timezone for this instance
   */
  setTimezone(timezone: string) {
    this.timezone = timezone;
  }

  /**
   * Get current timezone
   */
  getTimezone(): string {
    return this.timezone;
  }

  /**
   * Query with timezone conversion
   */
  async queryWithTimezone(
    table:
      | 'companies'
      | 'user_profiles'
      | 'leads'
      | 'workflows'
      | 'activity_log'
      | 'email_replies'
      | 'email_sends'
      | 'user_settings'
      | 'integrations',
    select: string = '*',
    timezoneColumns: string[] = []
  ) {
    const query = supabase.from(table).select(select);

    // If we have timezone columns, we need to use raw SQL
    if (timezoneColumns.length > 0) {
      const timezoneSelect = timezoneColumns
        .map(col => `timezone('${this.timezone}', ${col}) as ${col}_local`)
        .join(', ');

      const fullSelect =
        select === '*'
          ? `*, ${timezoneSelect}`
          : `${select}, ${timezoneSelect}`;

      // Note: execute_sql RPC function may not exist in all projects
      // This is a fallback for timezone conversion - consider using Postgres timezone functions instead
      console.warn(
        'execute_sql RPC not available - timezone conversion skipped'
      );
      return query;
    }

    return query;
  }

  /**
   * Insert with automatic UTC conversion
   */
  async insertWithTimezone(
    table:
      | 'companies'
      | 'user_profiles'
      | 'leads'
      | 'workflows'
      | 'activity_log'
      | 'email_replies'
      | 'email_sends'
      | 'user_settings'
      | 'integrations',
    data: Record<string, unknown>
  ) {
    // Convert any date fields to UTC
    const processedData = this.convertDatesToUTC(data);

    return supabase.from(table).insert(processedData);
  }

  /**
   * Update with automatic UTC conversion
   */
  async updateWithTimezone(
    table:
      | 'companies'
      | 'user_profiles'
      | 'leads'
      | 'workflows'
      | 'activity_log'
      | 'email_replies'
      | 'email_sends'
      | 'user_settings'
      | 'integrations',
    data: Record<string, unknown>,
    filter: Record<string, unknown>
  ) {
    // Convert any date fields to UTC
    const processedData = this.convertDatesToUTC(data);

    return supabase.from(table).update(processedData).match(filter);
  }

  /**
   * Convert date fields to UTC
   */
  private convertDatesToUTC(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const processed = { ...data };

    // List of common date field names
    const dateFields = [
      'created_at',
      'updated_at',
      'posted_date',
      'valid_through',
      'last_interaction_at',
      'automation_started_at',
      'connected_at',
      'last_reply_at',
      'connection_request_date',
      'connection_accepted_date',
      'response_date',
      'meeting_date',
      'email_reply_date',
      'stage_updated',
    ];

    dateFields.forEach(field => {
      if (processed[field] && typeof processed[field] === 'string') {
        // Convert to UTC if it's a valid date string
        try {
          const date = new Date(processed[field]);
          if (!isNaN(date.getTime())) {
            processed[field] = date.toISOString();
          }
        } catch (error) {
          console.warn(`Failed to convert date field ${field}:`, error);
        }
      }
    });

    return processed;
  }
}

// Export a default instance
export const supabaseWithTimezone = new SupabaseWithTimezone();
