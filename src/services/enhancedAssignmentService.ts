/**
 * Enhanced Assignment Service with Modern Error Handling
 * Uses Result pattern and comprehensive error classification
 */

import { supabase } from '@/integrations/supabase/client';
import {
  AppError,
  ErrorCategory,
  ErrorFactory,
  ErrorSeverity,
  ErrorType,
  Result,
  ResultBuilder,
} from '@/types/errors';
import { enhancedErrorHandler } from '@/utils/enhancedErrorHandler';

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
  data?: unknown;
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

export class EnhancedAssignmentService {
  /**
   * Validates that a user exists and is active
   */
  static async validateUser(
    userId: string
  ): Promise<Result<boolean, AppError>> {
    try {
      const result = await measureOperation(async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, is_active')
          .eq('id', userId)
          .eq('is_active', true)
          .single();

        if (error) {
          throw error;
        }

        return !!data;
      }, `validateUser(${userId})`);

      return ResultBuilder.success(result);
    } catch (error) {
      const appError = await enhancedErrorHandler.handleError(error, {
        component: 'AssignmentService',
        action: 'validateUser',
        userId,
      });
      return ResultBuilder.failure(appError);
    }
  }

  /**
   * Gets all active team members
   */
  static async getTeamMembers(): Promise<Result<TeamMember[], AppError>> {
    try {
      const result = await measureOperation(async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, role, is_active, avatar_url')
          .eq('is_active', true)
          .order('full_name');

        if (error) {
          throw error;
        }

        return data || [];
      }, 'getTeamMembers');

      return ResultBuilder.success(result);
    } catch (error) {
      const appError = await enhancedErrorHandler.handleError(error, {
        component: 'AssignmentService',
        action: 'getTeamMembers',
      });
      return ResultBuilder.failure(appError);
    }
  }

  /**
   * Assigns a single entity (lead or company) to a user
   */
  static async assignEntity(
    entityType: 'leads' | 'companies',
    entityId: string,
    newOwnerId: string | null,
    assignedBy: string
  ): Promise<Result<AssignmentResult, AppError>> {
    try {
      // Input validation
      const validationResult = this.validateAssignmentInput(
        entityType,
        entityId,
        newOwnerId,
        assignedBy
      );
      if (!validationResult.success) {
        return ResultBuilder.failure(validationResult.error);
      }

      // Validate user exists if assigning to someone
      if (newOwnerId) {
        const userValidation = await this.validateUser(newOwnerId);
        if (!userValidation.success) {
          return ResultBuilder.failure(userValidation.error);
        }
        if (!userValidation.data) {
          return ResultBuilder.failure(
            ErrorFactory.create(
              ErrorType.BUSINESS_RULE_VIOLATION,
              'USER_NOT_FOUND',
              'Target user does not exist or is not active',
              'Cannot assign to user - user not found or inactive',
              {
                recoverable: false,
                severity: ErrorSeverity.MEDIUM,
                category: ErrorCategory.BUSINESS_LOGIC,
                context: { entityType, entityId, newOwnerId, assignedBy },
              }
            )
          );
        }
      }

      // Validate entity exists
      const entityValidation = await this.validateEntityExists(
        entityType,
        entityId
      );
      if (!entityValidation.success) {
        return ResultBuilder.failure(entityValidation.error);
      }

      // Perform the assignment
      const assignmentResult = await this.performAssignment(
        entityType,
        entityId,
        newOwnerId,
        assignedBy
      );
      if (!assignmentResult.success) {
        return ResultBuilder.failure(assignmentResult.error);
      }

      return ResultBuilder.success(assignmentResult.data);
    } catch (error) {
      const appError = await enhancedErrorHandler.handleError(error, {
        component: 'AssignmentService',
        action: 'assignEntity',
        entityType,
        entityId,
        newOwnerId,
        assignedBy,
      });
      return ResultBuilder.failure(appError);
    }
  }

  /**
   * Validates assignment input parameters
   */
  private static validateAssignmentInput(
    entityType: 'leads' | 'companies',
    entityId: string,
    newOwnerId: string | null,
    assignedBy: string
  ): Result<void, AppError> {
    if (!entityType || !['leads', 'companies'].includes(entityType)) {
      return ResultBuilder.failure(
        ErrorFactory.create(
          ErrorType.VALIDATION_ERROR,
          'INVALID_ENTITY_TYPE',
          'Invalid entity type provided',
          'Please select a valid entity type',
          {
            recoverable: true,
            severity: ErrorSeverity.LOW,
            category: ErrorCategory.VALIDATION,
            context: { entityType, entityId, newOwnerId, assignedBy },
          }
        )
      );
    }

    if (
      !entityId ||
      typeof entityId !== 'string' ||
      entityId.trim().length === 0
    ) {
      return ResultBuilder.failure(
        ErrorFactory.create(
          ErrorType.VALIDATION_ERROR,
          'INVALID_ENTITY_ID',
          'Invalid entity ID provided',
          'Please provide a valid entity ID',
          {
            recoverable: true,
            severity: ErrorSeverity.LOW,
            category: ErrorCategory.VALIDATION,
            context: { entityType, entityId, newOwnerId, assignedBy },
          }
        )
      );
    }

    if (
      !assignedBy ||
      typeof assignedBy !== 'string' ||
      assignedBy.trim().length === 0
    ) {
      return ResultBuilder.failure(
        ErrorFactory.create(
          ErrorType.VALIDATION_ERROR,
          'INVALID_ASSIGNED_BY',
          'Invalid assignedBy parameter',
          'Please provide a valid assignedBy user ID',
          {
            recoverable: true,
            severity: ErrorSeverity.LOW,
            category: ErrorCategory.VALIDATION,
            context: { entityType, entityId, newOwnerId, assignedBy },
          }
        )
      );
    }

    return ResultBuilder.success(undefined);
  }

  /**
   * Validates that an entity exists
   */
  private static async validateEntityExists(
    entityType: 'leads' | 'companies',
    entityId: string
  ): Promise<Result<{ id: string; name: string }, AppError>> {
    try {
      // Use appropriate field selection based on entity type
      const selectFields =
        entityType === 'leads' ? 'id, first_name, last_name' : 'id, name';
      const { data, error } = await supabase
        .from(entityType)
        .select(selectFields)
        .eq('id', entityId)
        .single();

      if (error) {
        const appError = enhancedErrorHandler.classifySupabaseError(error, {
          component: 'AssignmentService',
          action: 'validateEntityExists',
          entityType,
          entityId,
        });
        return ResultBuilder.failure(appError);
      }

      if (!data) {
        return ResultBuilder.failure(
          ErrorFactory.create(
            ErrorType.BUSINESS_RULE_VIOLATION,
            'ENTITY_NOT_FOUND',
            `${entityType.slice(0, -1)} not found`,
            `The ${entityType.slice(0, -1)} you're trying to assign was not found`,
            {
              recoverable: false,
              severity: ErrorSeverity.MEDIUM,
              category: ErrorCategory.BUSINESS_LOGIC,
              context: { entityType, entityId },
            }
          )
        );
      }

      return ResultBuilder.success(data);
    } catch (error) {
      const appError = await enhancedErrorHandler.handleError(error, {
        component: 'AssignmentService',
        action: 'validateEntityExists',
        entityType,
        entityId,
      });
      return ResultBuilder.failure(appError);
    }
  }

  /**
   * Performs the actual assignment operation
   */
  private static async performAssignment(
    entityType: 'leads' | 'companies',
    entityId: string,
    newOwnerId: string | null,
    assignedBy: string
  ): Promise<Result<AssignmentResult, AppError>> {
    try {
      // Assignment removed - owner_id no longer exists
      // Just update timestamp
      const { error: updateError } = await supabase
        .from(entityType)
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);

      if (updateError) {
        const appError = enhancedErrorHandler.classifySupabaseError(
          updateError,
          {
            component: 'AssignmentService',
            action: 'performAssignment',
            entityType,
            entityId,
            newOwnerId,
            assignedBy,
          }
        );
        return ResultBuilder.failure(appError);
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

      const assignmentResult: AssignmentResult = {
        success: true,
        message: newOwnerId
          ? `${entityType.slice(0, -1)} assigned to ${ownerName}`
          : `${entityType.slice(0, -1)} unassigned`,
        data: {
          entityId,
          newOwnerId,
          ownerName,
        },
      };

      return ResultBuilder.success(assignmentResult);
    } catch (error) {
      const appError = await enhancedErrorHandler.handleError(error, {
        component: 'AssignmentService',
        action: 'performAssignment',
        entityType,
        entityId,
        newOwnerId,
        assignedBy,
      });
      return ResultBuilder.failure(appError);
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
  ): Promise<Result<BulkAssignmentResult, AppError>> {
    try {
      // Validate inputs
      const validationResult = this.validateBulkAssignmentInput(
        entityIds,
        entityType,
        newOwnerId,
        assignedBy
      );
      if (!validationResult.success) {
        return ResultBuilder.failure(validationResult.error);
      }

      // Validate user exists
      const userValidation = await this.validateUser(newOwnerId);
      if (!userValidation.success) {
        return ResultBuilder.failure(userValidation.error);
      }
      if (!userValidation.data) {
        return ResultBuilder.failure(
          ErrorFactory.create(
            ErrorType.BUSINESS_RULE_VIOLATION,
            'USER_NOT_FOUND',
            'Target user does not exist or is not active',
            'Cannot assign to user - user not found or inactive',
            {
              recoverable: false,
              severity: ErrorSeverity.MEDIUM,
              category: ErrorCategory.BUSINESS_LOGIC,
              context: { entityIds, entityType, newOwnerId, assignedBy },
            }
          )
        );
      }

      // Perform bulk assignment using database function
      const { data, error } = await supabase.rpc('bulk_assign_entities', {
        p_entity_ids: entityIds,
        p_entity_type: entityType,
        p_new_owner_id: newOwnerId,
        p_assigned_by: assignedBy,
      });

      if (error) {
        const appError = enhancedErrorHandler.classifySupabaseError(error, {
          component: 'AssignmentService',
          action: 'bulkAssignEntities',
          entityIds,
          entityType,
          newOwnerId,
          assignedBy,
        });
        return ResultBuilder.failure(appError);
      }

      const bulkResult: BulkAssignmentResult = {
        success: true,
        updated_count: data?.updated_count || 0,
        total_requested: entityIds.length,
        invalid_entities: data?.invalid_entities || [],
        errors: data?.errors || [],
      };

      return ResultBuilder.success(bulkResult);
    } catch (error) {
      const appError = await enhancedErrorHandler.handleError(error, {
        component: 'AssignmentService',
        action: 'bulkAssignEntities',
        entityIds,
        entityType,
        newOwnerId,
        assignedBy,
      });
      return ResultBuilder.failure(appError);
    }
  }

  /**
   * Validates bulk assignment input parameters
   */
  private static validateBulkAssignmentInput(
    entityIds: string[],
    entityType: 'leads' | 'companies',
    newOwnerId: string,
    assignedBy: string
  ): Result<void, AppError> {
    if (!entityIds || entityIds.length === 0) {
      return ResultBuilder.failure(
        ErrorFactory.create(
          ErrorType.VALIDATION_ERROR,
          'NO_ENTITIES_PROVIDED',
          'No entities provided for assignment',
          'Please select at least one entity to assign',
          {
            recoverable: true,
            severity: ErrorSeverity.LOW,
            category: ErrorCategory.VALIDATION,
            context: { entityIds, entityType, newOwnerId, assignedBy },
          }
        )
      );
    }

    if (
      !newOwnerId ||
      typeof newOwnerId !== 'string' ||
      newOwnerId.trim().length === 0
    ) {
      return ResultBuilder.failure(
        ErrorFactory.create(
          ErrorType.VALIDATION_ERROR,
          'INVALID_NEW_OWNER_ID',
          'New owner ID is required',
          'Please select a user to assign the entities to',
          {
            recoverable: true,
            severity: ErrorSeverity.LOW,
            category: ErrorCategory.VALIDATION,
            context: { entityIds, entityType, newOwnerId, assignedBy },
          }
        )
      );
    }

    if (
      !assignedBy ||
      typeof assignedBy !== 'string' ||
      assignedBy.trim().length === 0
    ) {
      return ResultBuilder.failure(
        ErrorFactory.create(
          ErrorType.VALIDATION_ERROR,
          'INVALID_ASSIGNED_BY',
          'AssignedBy parameter is required',
          'Please provide a valid assignedBy user ID',
          {
            recoverable: true,
            severity: ErrorSeverity.LOW,
            category: ErrorCategory.VALIDATION,
            context: { entityIds, entityType, newOwnerId, assignedBy },
          }
        )
      );
    }

    return ResultBuilder.success(undefined);
  }
}
