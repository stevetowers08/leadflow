/**
 * Centralized Database Query Utilities
 * Prevents common database query issues and provides consistent patterns
 *
 * 📚 Schema reference: src/types/databaseSchema.ts
 */

import { supabase } from '@/integrations/supabase/client';
import { COMMON_SELECTIONS } from '@/types/databaseSchema';

export interface DatabaseErrorInfo {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class DatabaseQueries {
  /**
   * Safe entity fetching with proper field selection
   */
  static async getEntity<T>(
    table: 'people' | 'companies',
    id: string
  ): Promise<T> {
    try {
      let selection: string;
      if (table === 'people') {
        selection = COMMON_SELECTIONS.people;
      } else {
        selection = COMMON_SELECTIONS.companies;
      }

      const { data, error } = await supabase
        .from(table)
        .select(selection)
        .eq('id', id)
        .single();

      if (error) {
        console.error(`❌ Error fetching ${table}:`, error);
        throw new DatabaseError(
          error.code || 'UNKNOWN_ERROR',
          error.message,
          error.details
            ? (error.details as unknown as Record<string, unknown>)
            : undefined
        );
      }

      return data as T;
    } catch (error) {
      console.error(`❌ Failed to fetch ${table} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Safe assignment fetching (avoids complex joins)
   */
  static async getAssignment(
    table: 'people' | 'companies',
    entityId: string
  ): Promise<{ ownerId: string | null; ownerName: string | null }> {
    try {
      // First, get the assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from(table)
        .select('owner_id')
        .eq('id', entityId)
        .single();

      if (assignmentError) {
        console.error(
          `❌ Error fetching assignment for ${table}:`,
          assignmentError
        );
        throw new DatabaseError(assignmentError.code, assignmentError.message);
      }

      const ownerId = assignmentData?.owner_id || null;
      let ownerName = null;

      // If there's an owner, fetch their profile separately
      if (ownerId) {
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', ownerId)
          .maybeSingle();

        if (!userError && userData) {
          ownerName = userData.full_name;
        }
      }

      return { ownerId, ownerName };
    } catch (error) {
      console.error(
        `❌ Failed to fetch assignment for ${table} ${entityId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Safe user profile fetching
   */
  static async getUserProfile(userId: string): Promise<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error(`❌ Error fetching user profile ${userId}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch user profile ${userId}:`, error);
      return null;
    }
  }

  /**
   * Safe team members fetching
   */
  static async getTeamMembers(): Promise<
    Array<{
      id: string;
      full_name: string;
      email: string;
      role: string;
    }>
  > {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        console.error('❌ Error fetching team members:', error);
        throw new DatabaseError(error.code, error.message);
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch team members:', error);
      throw error;
    }
  }

  /**
   * Safe assignment update
   */
  static async updateAssignment(
    table: 'people' | 'companies' | 'jobs',
    entityId: string,
    ownerId: string | null
  ): Promise<void> {
    try {
      // Validate user exists if assigning to someone
      if (ownerId) {
        const userExists = await this.getUserProfile(ownerId);
        if (!userExists) {
          throw new DatabaseError(
            'USER_NOT_FOUND',
            'Target user does not exist or is not active'
          );
        }
      }

      // Perform the assignment
      const { error } = await supabase
        .from(table)
        .update({
          owner_id: ownerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);

      if (error) {
        console.error(`❌ Error updating assignment for ${table}:`, error);
        throw new DatabaseError(error.code, error.message);
      }
    } catch (error) {
      console.error(
        `❌ Failed to update assignment for ${table} ${entityId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Safe related entities fetching
   */
  static async getRelatedEntities(
    entityType: 'contacts' | 'companies' | 'jobs',
    companyId: string,
    excludeId?: string
  ): Promise<{
    leads: Record<string, unknown>[];
    jobs: Record<string, unknown>[];
  }> {
    try {
      const [leadsResult, jobsResult] = await Promise.all([
        // Fetch leads
        supabase
          .from('people')
          .select(
            `
            id, name, company_id, email_address, employee_location,
            company_role, people_stage, score, linkedin_url,
            owner_id, created_at, updated_at
          `
          )
          .eq('company_id', companyId)
          .neq('id', excludeId || '')
          .order('created_at', { ascending: false }),

        // Fetch jobs
        supabase
          .from('jobs')
          .select(
            `
            id, title, location, function, employment_type,
            seniority_level, salary, created_at
          `
          )
          .eq('company_id', companyId)
          .order('created_at', { ascending: false }),
      ]);

      if (leadsResult.error) {
        console.error('❌ Error fetching related leads:', leadsResult.error);
        throw new DatabaseError(
          leadsResult.error.code,
          leadsResult.error.message
        );
      }

      if (jobsResult.error) {
        console.error('❌ Error fetching related jobs:', jobsResult.error);
        throw new DatabaseError(
          jobsResult.error.code,
          jobsResult.error.message
        );
      }

      return {
        leads: leadsResult.data || [],
        jobs: jobsResult.data || [],
      };
    } catch (error) {
      console.error(
        `❌ Failed to fetch related entities for company ${companyId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Validate field exists in table
   */
  static async validateField(table: string, field: string): Promise<boolean> {
    try {
      // Try a simple query with the field
      const { error } = await supabase.from(table).select(field).limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Query validation utilities
 */
export class QueryValidator {
  /**
   * Validate entity ID format
   */
  static isValidId(id: string): boolean {
    return typeof id === 'string' && id.length > 0;
  }

  /**
   * Validate table name
   */
  static isValidTable(table: string): boolean {
    return ['people', 'companies', 'jobs', 'user_profiles'].includes(table);
  }

  /**
   * Sanitize search term
   */
  static sanitizeSearchTerm(term: string): string {
    return term.trim().replace(/[%_]/g, '\\$&');
  }
}
