import { supabase } from "@/integrations/supabase/client";
import { getUserTimezone } from "./timezoneUtils";

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
  async queryWithTimezone(table: string, select: string = '*', timezoneColumns: string[] = []) {
    let query = supabase.from(table).select(select);

    // If we have timezone columns, we need to use raw SQL
    if (timezoneColumns.length > 0) {
      const timezoneSelect = timezoneColumns.map(col => 
        `timezone('${this.timezone}', ${col}) as ${col}_local`
      ).join(', ');
      
      const fullSelect = select === '*' ? 
        `*, ${timezoneSelect}` : 
        `${select}, ${timezoneSelect}`;

      return supabase.rpc('execute_sql', {
        query: `SELECT ${fullSelect} FROM ${table}`
      });
    }

    return query;
  }

  /**
   * Insert with automatic UTC conversion
   */
  async insertWithTimezone(table: string, data: any) {
    // Convert any date fields to UTC
    const processedData = this.convertDatesToUTC(data);
    
    return supabase.from(table).insert(processedData);
  }

  /**
   * Update with automatic UTC conversion
   */
  async updateWithTimezone(table: string, data: any, filter: any) {
    // Convert any date fields to UTC
    const processedData = this.convertDatesToUTC(data);
    
    return supabase.from(table).update(processedData).match(filter);
  }

  /**
   * Convert date fields to UTC
   */
  private convertDatesToUTC(data: any): any {
    const processed = { ...data };
    
    // List of common date field names
    const dateFields = [
      'created_at', 'updated_at', 'posted_date', 'valid_through',
      'last_interaction_at', 'automation_started_at', 'connected_at',
      'last_reply_at', 'connection_request_date', 'connection_accepted_date',
      'message_sent_date', 'response_date', 'meeting_date',
      'email_sent_date', 'email_reply_date', 'stage_updated'
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
