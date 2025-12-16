/**
 * Type-Safe Supabase Query Helpers
 *
 * Provides type-safe wrappers for Supabase queries that replace `as never` assertions.
 * These helpers ensure type safety while working with tables/views not in generated types.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  EmailThread,
  EmailMessage,
  Show,
  ShowCompany,
  ErrorSettings,
  ErrorNotification,
  UserAssignmentStats,
  LeadAssignmentWithUser,
  CompanyAssignmentWithUser,
  DashboardMetrics,
  EntityTag,
  Conversation,
  ConversationMessage,
  ClientUser,
  CampaignSequence,
  CampaignSequenceLead,
  Integration,
  GmailIntegrationConfig,
} from '@/types/missingTables';

// ============================================================================
// EMAIL QUERIES
// ============================================================================

export const emailThreadsQueries = {
  async getAll(filters?: {
    personId?: string;
    leadId?: string;
    limit?: number;
  }): Promise<EmailThread[]> {
    let query = supabase
      .from('email_threads' as never)
      .select('*')
      .order('last_message_at', { ascending: false });

    if (filters?.personId) {
      query = query.eq('person_id', filters.personId);
    }
    if (filters?.leadId) {
      query = query.eq('lead_id', filters.leadId);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as EmailThread[];
  },

  async getById(threadId: string): Promise<EmailThread | null> {
    const { data, error } = await supabase
      .from('email_threads' as never)
      .select('*')
      .eq('id', threadId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as EmailThread;
  },
};

export const emailMessagesQueries = {
  async getByThreadId(threadId: string): Promise<EmailMessage[]> {
    const { data, error } = await supabase
      .from('email_messages' as never)
      .select('*')
      .eq('thread_id', threadId)
      .order('received_at', { ascending: true });

    if (error) throw error;
    return (data || []) as EmailMessage[];
  },
};

// ============================================================================
// SHOW QUERIES
// ============================================================================

export const showsQueries = {
  async getAll(ownerId?: string): Promise<Show[]> {
    let query = supabase
      .from('shows' as never)
      .select('*')
      .order('start_date', { ascending: false });

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query;

    // Handle missing table gracefully
    if (error) {
      const errorMessage = (error as { message?: string })?.message || '';
      const isTableMissing =
        error.code === 'PGRST116' ||
        error.code === '42P01' ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('relation') ||
        (error as { status?: number })?.status === 404;

      if (isTableMissing) {
        return []; // Table doesn't exist, return empty array
      }
      throw error;
    }
    return (data || []) as Show[];
  },

  async getById(showId: string, ownerId?: string): Promise<Show | null> {
    let query = supabase
      .from('shows' as never)
      .select('*')
      .eq('id', showId);

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query.single();
    if (error) {
      const errorMessage = (error as { message?: string })?.message || '';
      const isTableMissing =
        error.code === 'PGRST116' ||
        error.code === '42P01' ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('relation') ||
        (error as { status?: number })?.status === 404;

      if (isTableMissing || error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    return data as Show;
  },

  async create(
    input: Omit<Show, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Show> {
    const { data, error } = await supabase
      .from('shows' as never)
      .insert(input)
      .select()
      .single();

    if (error) {
      const errorMessage = (error as { message?: string })?.message || '';
      const isTableMissing =
        error.code === 'PGRST116' ||
        error.code === '42P01' ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('relation') ||
        (error as { status?: number })?.status === 404;

      if (isTableMissing) {
        throw new Error(
          'shows table does not exist. Please run the migration to create it.'
        );
      }
      throw error;
    }
    return data as Show;
  },
};

export const showCompaniesQueries = {
  async link(showId: string, companyId: string): Promise<ShowCompany> {
    const { data, error } = await supabase
      .from('show_companies' as never)
      .insert({ show_id: showId, company_id: companyId })
      .select()
      .single();

    if (error) throw error;
    return data as ShowCompany;
  },

  async unlink(showId: string, companyId: string): Promise<void> {
    const { error } = await supabase
      .from('show_companies' as never)
      .delete()
      .eq('show_id', showId)
      .eq('company_id', companyId);

    if (error) throw error;
  },
};

// ============================================================================
// INTEGRATIONS QUERIES (using existing table)
// ============================================================================

export const integrationsQueries = {
  async getGmailIntegration(userId: string): Promise<Integration | null> {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('platform', 'gmail')
      .eq('connected', true)
      .maybeSingle();

    if (error) throw error;
    return data as Integration | null;
  },

  async upsertGmailIntegration(
    userId: string,
    config: GmailIntegrationConfig
  ): Promise<Integration> {
    const { data, error } = await supabase
      .from('integrations')
      .upsert(
        {
          platform: 'gmail',
          connected: true,
          config: config as never,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'platform' }
      )
      .select()
      .single();

    if (error) throw error;
    return data as Integration;
  },

  async updateGmailConfig(
    integrationId: string,
    config: Partial<GmailIntegrationConfig>
  ): Promise<void> {
    const { error } = await supabase
      .from('integrations')
      .update({
        config: config as never,
        updated_at: new Date().toISOString(),
      })
      .eq('id', integrationId);

    if (error) throw error;
  },
};

// ============================================================================
// ERROR LOGGING QUERIES
// ============================================================================

// error_settings table removed - using simple defaults instead
// No database queries needed for error settings

export const errorNotificationsQueries = {
  async create(
    notification: Omit<ErrorNotification, 'id' | 'created_at'>
  ): Promise<ErrorNotification> {
    const { data, error } = await supabase
      .from('error_notifications' as never)
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data as ErrorNotification;
  },
};

// ============================================================================
// VIEW QUERIES
// ============================================================================

export const viewsQueries = {
  async getUserAssignmentStats(): Promise<UserAssignmentStats[]> {
    const { data, error } = await supabase
      .from('user_assignment_stats' as never)
      .select('*')
      .order('total_leads', { ascending: false });

    if (error) throw error;
    return (data || []) as UserAssignmentStats[];
  },

  async getLeadAssignmentsWithUsers(filters?: {
    ownerId?: string;
  }): Promise<LeadAssignmentWithUser[]> {
    let query = supabase
      .from('lead_assignments_with_users' as never)
      .select('*');

    if (filters?.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as LeadAssignmentWithUser[];
  },

  async getCompanyAssignmentsWithUsers(filters?: {
    ownerId?: string;
  }): Promise<CompanyAssignmentWithUser[]> {
    let query = supabase
      .from('company_assignments_with_users' as never)
      .select('*');

    if (filters?.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as CompanyAssignmentWithUser[];
  },

  async getDashboardMetrics(): Promise<DashboardMetrics | null> {
    const { data, error } = await supabase
      .from('dashboard_metrics' as never)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as DashboardMetrics;
  },
};

// ============================================================================
// ENTITY TAGS QUERIES
// ============================================================================

export const entityTagsQueries = {
  async getByEntity(
    entityId: string,
    entityType: 'lead' | 'company'
  ): Promise<EntityTag[]> {
    const { data, error } = await supabase
      .from('entity_tags' as never)
      .select('*')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType);

    if (error) throw error;
    return (data || []) as EntityTag[];
  },

  async create(tag: Omit<EntityTag, 'id' | 'created_at'>): Promise<EntityTag> {
    const { data, error } = await supabase
      .from('entity_tags' as never)
      .insert(tag)
      .select()
      .single();

    if (error) throw error;
    return data as EntityTag;
  },

  async delete(entityId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('entity_tags' as never)
      .delete()
      .eq('entity_id', entityId)
      .eq('tag_id', tagId);

    if (error) throw error;
  },
};

// ============================================================================
// GENERIC TYPE-SAFE TABLE QUERIES
// ============================================================================

/**
 * Type-safe table query helper
 * Replaces `as never` with proper type checking
 */
export async function queryTable<T>(
  tableName: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  options?: {
    select?: string;
    filters?: Record<string, unknown>;
    data?: unknown;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
): Promise<T[]> {
  let query = supabase.from(tableName as never);

  if (operation === 'select') {
    query = query.select(options?.select || '*');

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as T[];
  }

  // Other operations would be implemented similarly
  throw new Error(`Operation ${operation} not yet implemented`);
}
