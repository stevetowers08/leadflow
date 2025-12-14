import { supabase } from '@/integrations/supabase/client';

// Performance monitoring utility
const measureOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - startTime;

    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(
        `🐌 Slow operation: ${operationName} took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `❌ Operation failed: ${operationName} (${duration.toFixed(2)}ms)`,
      error
    );
    throw error;
  }
};

export interface AssignmentResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
}

export interface BulkAssignmentResult {
  success: boolean;
  updated_count: number;
  total_requested: number;
  invalid_entities: string[];
  errors?: string[];
}

export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  avatar_url?: string;
}

export class AssignmentService {
  /**
   * Validates that a user exists and is active
   */
  static async validateUser(userId: string): Promise<boolean> {
    return measureOperation(async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, is_active')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return false;
      }

      return true;
    }, `validateUser(${userId})`);
  }

  /**
   * Gets all active team members
   */
  static async getTeamMembers(): Promise<TeamMember[]> {
    return measureOperation(async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, is_active, avatar_url')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        throw new Error(`Failed to fetch team members: ${error.message}`);
      }

      return data || [];
    }, 'getTeamMembers');
  }

  /**
   * Assigns a single entity (lead or company) to a user
   */
  static async assignEntity(
    entityType: 'leads' | 'companies',
    entityId: string,
    newOwnerId: string | null,
    assignedBy: string
  ): Promise<AssignmentResult> {
    try {
      // Validate user exists if assigning to someone
      if (newOwnerId && !(await this.validateUser(newOwnerId))) {
        return {
          success: false,
          message: 'Cannot assign to user',
          error: 'Target user does not exist or is not active',
        };
      }

      // Validate entity exists - use appropriate field selection
      const selectFields =
        entityType === 'leads' ? 'id, first_name, last_name' : 'id, name';
      const { data: entityData, error: entityError } = await supabase
        .from(entityType)
        .select(selectFields)
        .eq('id', entityId)
        .single();

      if (entityError || !entityData) {
        return {
          success: false,
          message: 'Assignment failed',
          error: `${entityType === 'leads' ? 'lead' : entityType.slice(0, -1)} not found`,
        };
      }

      // Perform the assignment
      const { error: updateError } = await supabase
        .from(entityType)
        .update({
          owner_id: newOwnerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);

      if (updateError) {
        return {
          success: false,
          message: 'Assignment failed',
          error: updateError.message,
        };
      }

      // Get the new owner's name for the response
      let ownerName = null;
      if (newOwnerId) {
        const { data: ownerData } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', newOwnerId)
          .single();

        ownerName = ownerData?.full_name || 'Unknown User';
      }

      return {
        success: true,
        message: newOwnerId
          ? `${entityData.name || entityType.slice(0, -1)} assigned to ${ownerName}`
          : `${entityData.name || entityType.slice(0, -1)} unassigned`,
        data: {
          entityId,
          newOwnerId,
          ownerName,
        },
      };
    } catch (error) {
      console.error('Error assigning entity:', error);
      return {
        success: false,
        message: 'Assignment failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Performs bulk assignment using the database function for atomicity
   */
  static async bulkAssignEntities(
    entityIds: string[],
    entityType: 'leads' | 'companies',
    newOwnerId: string,
    assignedBy: string
  ): Promise<BulkAssignmentResult> {
    try {
      // Validate inputs
      if (!entityIds || entityIds.length === 0) {
        return {
          success: false,
          updated_count: 0,
          total_requested: 0,
          invalid_entities: [],
          errors: ['No entities provided for assignment'],
        };
      }

      if (!newOwnerId) {
        return {
          success: false,
          updated_count: 0,
          total_requested: entityIds.length,
          invalid_entities: entityIds,
          errors: ['New owner ID is required'],
        };
      }

      // Use the database function for atomic bulk assignment
      const { data, error } = await supabase.rpc('bulk_assign_entities', {
        entity_ids: entityIds,
        entity_type: entityType,
        new_owner_id: newOwnerId,
        assigned_by: assignedBy,
      });

      if (error) {
        return {
          success: false,
          updated_count: 0,
          total_requested: entityIds.length,
          invalid_entities: entityIds,
          errors: [error.message],
        };
      }

      return {
        success: data.success,
        updated_count: data.updated_count || 0,
        total_requested: data.total_requested || entityIds.length,
        invalid_entities: data.invalid_entities || [],
        errors: data.error ? [data.error] : [],
      };
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      return {
        success: false,
        updated_count: 0,
        total_requested: entityIds.length,
        invalid_entities: entityIds,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Reassigns orphaned records when a user is deleted
   */
  static async reassignOrphanedRecords(
    deletedUserId: string,
    newOwnerId: string | null = null
  ): Promise<AssignmentResult> {
    try {
      const { data, error } = await supabase.rpc('reassign_orphaned_records', {
        deleted_user_id: deletedUserId,
        new_owner_id: newOwnerId,
      });

      if (error) {
        return {
          success: false,
          message: 'Failed to reassign orphaned records',
          error: error.message,
        };
      }

      return {
        success: true,
        message: `Successfully reassigned ${data.total_records} records`,
        data,
      };
    } catch (error) {
      console.error('Error reassigning orphaned records:', error);
      return {
        success: false,
        message: 'Failed to reassign orphaned records',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Gets assignment history for an entity
   */
  static async getAssignmentHistory(
    entityType: string,
    entityId: string
  ): Promise<Array<Record<string, unknown>>> {
    try {
      const { data, error } = await supabase
        .from('assignment_logs')
        .select(
          `
          id,
          old_owner_id,
          new_owner_id,
          assigned_by,
          assigned_at,
          notes,
          old_owner:old_owner_id(full_name),
          new_owner:new_owner_id(full_name),
          assigned_by_user:assigned_by(full_name)
        `
        )
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('assigned_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch assignment history: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching assignment history:', error);
      throw error;
    }
  }

  /**
   * Gets statistics about user assignments
   */
  static async getAssignmentStats(): Promise<{
    totalAssigned: number;
    unassigned: number;
    byUser: Array<{ userId: string; userName: string; count: number }>;
  }> {
    try {
      // owner_id was removed - using client_id for multi-tenant architecture
      // Assignment feature removed, return empty stats
      return {
        totalAssigned: 0,
        unassigned: 0,
        byUser: [],
      };

      // Get assignment counts by user
      const { data: userStats } = await supabase
        .from('user_profiles')
        .select(
          `
          id,
          full_name,
          people:people(count),
          companies:companies(count),
          jobs:jobs(count)
        `
        )
        .eq('is_active', true);

      const byUser = (userStats || [])
        .map(user => ({
          userId: user.id,
          userName: user.full_name || 'Unknown',
          count:
            (user.people?.[0]?.count || 0) +
            (user.companies?.[0]?.count || 0) +
            (user.jobs?.[0]?.count || 0),
        }))
        .sort((a, b) => b.count - a.count);

      return {
        totalAssigned,
        unassigned,
        byUser,
      };
    } catch (error) {
      console.error('Error fetching assignment stats:', error);
      throw error;
    }
  }
}
