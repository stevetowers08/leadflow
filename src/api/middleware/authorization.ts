import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

interface AuthorizationOptions {
  requiredRole?: string | string[];
  requiredPermission?: string;
  resource?: string;
  action?: string;
  allowOwner?: boolean;
  allowAdmin?: boolean;
  allowSelf?: boolean;
}

/**
 * Middleware to authenticate and authorize API requests
 */
export const authenticateAndAuthorize = (
  options: AuthorizationOptions = {}
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract JWT token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Missing or invalid authorization header',
        });
      }

      const token = authHeader.substring(7);

      // Verify JWT token with Supabase
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
      }

      // Get user profile to check role and active status
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User profile not found',
        });
      }

      if (!userProfile.is_active) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User account is deactivated',
        });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email!,
        role: userProfile.role,
        isActive: userProfile.is_active,
      };

      // Check authorization
      const isAuthorized = await checkAuthorization(req, options);

      if (!isAuthorized) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication failed',
      });
    }
  };
};

/**
 * Check if user has required authorization
 */
async function checkAuthorization(
  req: AuthenticatedRequest,
  options: AuthorizationOptions
): Promise<boolean> {
  const user = req.user!;
  const {
    requiredRole,
    requiredPermission,
    resource,
    action,
    allowOwner,
    allowAdmin,
    allowSelf,
  } = options;

  // Check role requirements
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return false;
    }
  }

  // Check permission requirements
  if (requiredPermission) {
    const hasPermission = await checkPermission(user.id, requiredPermission);
    if (!hasPermission) {
      return false;
    }
  }

  // Check resource-specific permissions
  if (resource && action) {
    const hasResourcePermission = await checkResourcePermission(
      user.id,
      resource,
      action
    );
    if (!hasResourcePermission) {
      return false;
    }
  }

  // Check ownership for specific resources
  if (allowOwner || allowAdmin || allowSelf) {
    const resourceId = req.params.id || req.body.id;
    if (resourceId) {
      const hasOwnership = await checkOwnership(
        user.id,
        resourceId,
        req.route?.path
      );
      if (!hasOwnership) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if user has specific permission
 */
async function checkPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  // Get user role
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!userProfile) return false;

  // Define role-based permissions
  const rolePermissions: Record<string, string[]> = {
    owner: [
      'users_view',
      'users_edit',
      'users_delete',
      'users_invite',
      'leads_view',
      'leads_edit',
      'leads_delete',
      'leads_export',
      'leads_bulk',
      'companies_view',
      'companies_edit',
      'companies_delete',
      'companies_export',
      'companies_bulk',
      'jobs_view',
      'jobs_edit',
      'jobs_delete',
      'jobs_export',
      'jobs_bulk',
      'campaigns_view',
      'campaigns_edit',
      'campaigns_delete',
      'campaigns_export',
      'campaigns_bulk',
      'reports_view',
      'reports_export',
      'settings_view',
      'settings_edit',
      'billing_view',
      'billing_edit',
    ],
    admin: [
      'users_view',
      'users_edit',
      'users_invite',
      'leads_view',
      'leads_edit',
      'leads_delete',
      'leads_export',
      'leads_bulk',
      'companies_view',
      'companies_edit',
      'companies_delete',
      'companies_export',
      'companies_bulk',
      'jobs_view',
      'jobs_edit',
      'jobs_delete',
      'jobs_export',
      'jobs_bulk',
      'campaigns_view',
      'campaigns_edit',
      'campaigns_delete',
      'campaigns_export',
      'campaigns_bulk',
      'reports_view',
      'reports_export',
      'settings_view',
      'settings_edit',
    ],
    recruiter: [
      'leads_view',
      'leads_edit',
      'leads_export',
      'companies_view',
      'companies_edit',
      'companies_export',
      'jobs_view',
      'jobs_edit',
      'jobs_export',
      'campaigns_view',
      'campaigns_edit',
      'campaigns_export',
      'reports_view',
    ],
    viewer: [
      'leads_view',
      'companies_view',
      'jobs_view',
      'campaigns_view',
      'reports_view',
    ],
  };

  const userPermissions = rolePermissions[userProfile.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if user has permission for specific resource and action
 */
async function checkResourcePermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const permission = `${resource}_${action}`;
  return checkPermission(userId, permission);
}

/**
 * Check if user owns a specific resource
 */
async function checkOwnership(
  userId: string,
  resourceId: string,
  routePath?: string
): Promise<boolean> {
  if (!routePath) return false;

  // Determine table name from route
  let tableName = '';
  if (routePath.includes('/companies')) {
    tableName = 'companies';
  } else if (routePath.includes('/people') || routePath.includes('/leads')) {
    tableName = 'people';
  } else if (routePath.includes('/jobs')) {
    tableName = 'jobs';
  } else if (routePath.includes('/campaigns')) {
    tableName = 'campaigns';
  }

  if (!tableName) return false;

  // Check ownership
  const { data, error } = await supabase
    .from(tableName)
    .select('owner_id')
    .eq('id', resourceId)
    .single();

  if (error || !data) return false;

  return data.owner_id === userId;
}

/**
 * Middleware to check if user can access specific entity
 */
export const checkEntityAccess = (
  entityType: 'companies' | 'people' | 'jobs' | 'campaigns'
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user!;
      const entityId = req.params.id;

      if (!entityId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Entity ID is required',
        });
      }

      // Check if user can access this entity
      const { data, error } = await supabase.rpc('can_access_entity', {
        entity_type: entityType,
        entity_id: entityId,
        user_id: user.id,
      });

      if (error || !data) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this entity',
        });
      }

      next();
    } catch (error) {
      console.error('Entity access check error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Access check failed',
      });
    }
  };
};

/**
 * Middleware to check if user can assign entities
 */
export const checkAssignmentPermission = (
  entityType: 'companies' | 'people' | 'jobs' | 'campaigns'
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user!;
      const entityId = req.params.id;
      const newOwnerId = req.body.owner_id || req.body.new_owner_id;

      if (!entityId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Entity ID is required',
        });
      }

      if (!newOwnerId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'New owner ID is required',
        });
      }

      // Check if user can assign this entity
      const { data, error } = await supabase.rpc('can_assign_entity', {
        entity_type: entityType,
        entity_id: entityId,
        new_owner_id: newOwnerId,
        current_user_id: user.id,
      });

      if (error || !data) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to assign this entity',
        });
      }

      next();
    } catch (error) {
      console.error('Assignment permission check error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Assignment check failed',
      });
    }
  };
};

/**
 * Middleware to filter data based on user permissions
 */
export const filterDataByPermissions = (
  entityType: 'companies' | 'people' | 'jobs' | 'campaigns'
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user!;

      // Admin/Owner can see all data
      if (user.role === 'admin' || user.role === 'owner') {
        return next();
      }

      // Other users can only see their assigned data
      // This will be handled by RLS policies, but we can add additional filtering here if needed
      next();
    } catch (error) {
      console.error('Data filtering error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Data filtering failed',
      });
    }
  };
};

/**
 * Utility function to get user's assigned entities
 */
export const getUserAssignedEntities = async (
  userId: string,
  entityType: string
) => {
  const { data, error } = await supabase
    .from(entityType)
    .select('*')
    .eq('owner_id', userId);

  if (error) {
    throw new Error(`Failed to get assigned ${entityType}: ${error.message}`);
  }

  return data;
};

/**
 * Utility function to check if user is admin or owner
 */
export const isAdminOrOwner = (user: AuthenticatedRequest['user']): boolean => {
  return user?.role === 'admin' || user?.role === 'owner';
};

/**
 * Utility function to check if user can perform bulk operations
 */
export const canPerformBulkOperations = async (
  userId: string,
  resource: string
): Promise<boolean> => {
  const permission = `${resource}_bulk`;
  return checkPermission(userId, permission);
};
