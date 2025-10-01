import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault?: boolean;
}

export interface UserPermissions {
  userId: string;
  roles: Role[];
  permissions: Permission[];
}

interface PermissionsContextType {
  roles: Role[];
  userPermissions: UserPermissions | null;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
  canView: (resource: string) => boolean;
  canEdit: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canExport: (resource: string) => boolean;
  canBulkAction: (resource: string) => boolean;
  loading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Default roles and permissions
const DEFAULT_ROLES: Role[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full system control including user limits and billing',
    isDefault: false,
    permissions: [
      { id: 'users_view', name: 'View Users', description: 'View user accounts', resource: 'users', action: 'view' },
      { id: 'users_edit', name: 'Edit Users', description: 'Edit user accounts', resource: 'users', action: 'edit' },
      { id: 'users_delete', name: 'Delete Users', description: 'Delete user accounts', resource: 'users', action: 'delete' },
      { id: 'users_invite', name: 'Invite Users', description: 'Invite new users', resource: 'users', action: 'invite' },
      { id: 'system_settings_view', name: 'View System Settings', description: 'View system settings', resource: 'system_settings', action: 'view' },
      { id: 'system_settings_edit', name: 'Edit System Settings', description: 'Edit system settings including user limits', resource: 'system_settings', action: 'edit' },
      { id: 'billing_view', name: 'View Billing', description: 'View billing information', resource: 'billing', action: 'view' },
      { id: 'billing_edit', name: 'Edit Billing', description: 'Edit billing information', resource: 'billing', action: 'edit' },
      { id: 'leads_view', name: 'View Leads', description: 'View leads data', resource: 'leads', action: 'view' },
      { id: 'leads_edit', name: 'Edit Leads', description: 'Edit leads data', resource: 'leads', action: 'edit' },
      { id: 'leads_delete', name: 'Delete Leads', description: 'Delete leads', resource: 'leads', action: 'delete' },
      { id: 'leads_export', name: 'Export Leads', description: 'Export leads data', resource: 'leads', action: 'export' },
      { id: 'leads_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on leads', resource: 'leads', action: 'bulk' },
      { id: 'companies_view', name: 'View Companies', description: 'View companies data', resource: 'companies', action: 'view' },
      { id: 'companies_edit', name: 'Edit Companies', description: 'Edit companies data', resource: 'companies', action: 'edit' },
      { id: 'companies_delete', name: 'Delete Companies', description: 'Delete companies', resource: 'companies', action: 'delete' },
      { id: 'companies_export', name: 'Export Companies', description: 'Export companies data', resource: 'companies', action: 'export' },
      { id: 'companies_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on companies', resource: 'companies', action: 'bulk' },
      { id: 'jobs_view', name: 'View Jobs', description: 'View jobs data', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', name: 'Edit Jobs', description: 'Edit jobs data', resource: 'jobs', action: 'edit' },
      { id: 'jobs_delete', name: 'Delete Jobs', description: 'Delete jobs', resource: 'jobs', action: 'delete' },
      { id: 'jobs_export', name: 'Export Jobs', description: 'Export jobs data', resource: 'jobs', action: 'export' },
      { id: 'jobs_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on jobs', resource: 'jobs', action: 'bulk' },
      { id: 'campaigns_view', name: 'View Campaigns', description: 'View campaigns data', resource: 'campaigns', action: 'view' },
      { id: 'campaigns_edit', name: 'Edit Campaigns', description: 'Edit campaigns data', resource: 'campaigns', action: 'edit' },
      { id: 'campaigns_delete', name: 'Delete Campaigns', description: 'Delete campaigns', resource: 'campaigns', action: 'delete' },
      { id: 'campaigns_export', name: 'Export Campaigns', description: 'Export campaigns data', resource: 'campaigns', action: 'export' },
      { id: 'campaigns_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on campaigns', resource: 'campaigns', action: 'bulk' },
      { id: 'workflows_view', name: 'View Workflows', description: 'View workflows', resource: 'workflows', action: 'view' },
      { id: 'workflows_edit', name: 'Edit Workflows', description: 'Edit workflows', resource: 'workflows', action: 'edit' },
      { id: 'workflows_delete', name: 'Delete Workflows', description: 'Delete workflows', resource: 'workflows', action: 'delete' },
      { id: 'workflows_execute', name: 'Execute Workflows', description: 'Execute workflows', resource: 'workflows', action: 'execute' },
      { id: 'reports_view', name: 'View Reports', description: 'View reports and analytics', resource: 'reports', action: 'view' },
      { id: 'reports_export', name: 'Export Reports', description: 'Export reports', resource: 'reports', action: 'export' },
      { id: 'settings_view', name: 'View Settings', description: 'View system settings', resource: 'settings', action: 'view' },
      { id: 'settings_edit', name: 'Edit Settings', description: 'Edit system settings', resource: 'settings', action: 'edit' },
    ]
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manage users and organization settings (limited by owner)',
    isDefault: false,
    permissions: [
      { id: 'users_view', name: 'View Users', description: 'View user accounts', resource: 'users', action: 'view' },
      { id: 'users_edit', name: 'Edit Users', description: 'Edit user accounts', resource: 'users', action: 'edit' },
      { id: 'users_invite', name: 'Invite Users', description: 'Invite new users (within limits)', resource: 'users', action: 'invite' },
      { id: 'leads_view', name: 'View Leads', description: 'View leads data', resource: 'leads', action: 'view' },
      { id: 'leads_edit', name: 'Edit Leads', description: 'Edit leads data', resource: 'leads', action: 'edit' },
      { id: 'leads_delete', name: 'Delete Leads', description: 'Delete leads', resource: 'leads', action: 'delete' },
      { id: 'leads_export', name: 'Export Leads', description: 'Export leads data', resource: 'leads', action: 'export' },
      { id: 'leads_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on leads', resource: 'leads', action: 'bulk' },
      { id: 'companies_view', name: 'View Companies', description: 'View companies data', resource: 'companies', action: 'view' },
      { id: 'companies_edit', name: 'Edit Companies', description: 'Edit companies data', resource: 'companies', action: 'edit' },
      { id: 'companies_delete', name: 'Delete Companies', description: 'Delete companies', resource: 'companies', action: 'delete' },
      { id: 'companies_export', name: 'Export Companies', description: 'Export companies data', resource: 'companies', action: 'export' },
      { id: 'companies_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on companies', resource: 'companies', action: 'bulk' },
      { id: 'jobs_view', name: 'View Jobs', description: 'View jobs data', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', name: 'Edit Jobs', description: 'Edit jobs data', resource: 'jobs', action: 'edit' },
      { id: 'jobs_delete', name: 'Delete Jobs', description: 'Delete jobs', resource: 'jobs', action: 'delete' },
      { id: 'jobs_export', name: 'Export Jobs', description: 'Export jobs data', resource: 'jobs', action: 'export' },
      { id: 'jobs_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on jobs', resource: 'jobs', action: 'bulk' },
      { id: 'campaigns_view', name: 'View Campaigns', description: 'View campaigns data', resource: 'campaigns', action: 'view' },
      { id: 'campaigns_edit', name: 'Edit Campaigns', description: 'Edit campaigns data', resource: 'campaigns', action: 'edit' },
      { id: 'campaigns_delete', name: 'Delete Campaigns', description: 'Delete campaigns', resource: 'campaigns', action: 'delete' },
      { id: 'campaigns_export', name: 'Export Campaigns', description: 'Export campaigns data', resource: 'campaigns', action: 'export' },
      { id: 'campaigns_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on campaigns', resource: 'campaigns', action: 'bulk' },
      { id: 'workflows_view', name: 'View Workflows', description: 'View workflows', resource: 'workflows', action: 'view' },
      { id: 'workflows_edit', name: 'Edit Workflows', description: 'Edit workflows', resource: 'workflows', action: 'edit' },
      { id: 'workflows_delete', name: 'Delete Workflows', description: 'Delete workflows', resource: 'workflows', action: 'delete' },
      { id: 'workflows_execute', name: 'Execute Workflows', description: 'Execute workflows', resource: 'workflows', action: 'execute' },
      { id: 'reports_view', name: 'View Reports', description: 'View reports and analytics', resource: 'reports', action: 'view' },
      { id: 'reports_export', name: 'Export Reports', description: 'Export reports', resource: 'reports', action: 'export' },
      { id: 'settings_view', name: 'View Settings', description: 'View organization settings', resource: 'settings', action: 'view' },
      { id: 'settings_edit', name: 'Edit Settings', description: 'Edit organization settings (not system limits)', resource: 'settings', action: 'edit' },
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manage team and view all data',
    isDefault: false,
    permissions: [
      { id: 'leads_view', name: 'View Leads', description: 'View leads data', resource: 'leads', action: 'view' },
      { id: 'leads_edit', name: 'Edit Leads', description: 'Edit leads data', resource: 'leads', action: 'edit' },
      { id: 'leads_export', name: 'Export Leads', description: 'Export leads data', resource: 'leads', action: 'export' },
      { id: 'leads_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on leads', resource: 'leads', action: 'bulk' },
      { id: 'companies_view', name: 'View Companies', description: 'View companies data', resource: 'companies', action: 'view' },
      { id: 'companies_edit', name: 'Edit Companies', description: 'Edit companies data', resource: 'companies', action: 'edit' },
      { id: 'companies_export', name: 'Export Companies', description: 'Export companies data', resource: 'companies', action: 'export' },
      { id: 'companies_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on companies', resource: 'companies', action: 'bulk' },
      { id: 'jobs_view', name: 'View Jobs', description: 'View jobs data', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', name: 'Edit Jobs', description: 'Edit jobs data', resource: 'jobs', action: 'edit' },
      { id: 'jobs_export', name: 'Export Jobs', description: 'Export jobs data', resource: 'jobs', action: 'export' },
      { id: 'jobs_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on jobs', resource: 'jobs', action: 'bulk' },
      { id: 'campaigns_view', name: 'View Campaigns', description: 'View campaigns data', resource: 'campaigns', action: 'view' },
      { id: 'campaigns_edit', name: 'Edit Campaigns', description: 'Edit campaigns data', resource: 'campaigns', action: 'edit' },
      { id: 'campaigns_export', name: 'Export Campaigns', description: 'Export campaigns data', resource: 'campaigns', action: 'export' },
      { id: 'campaigns_bulk', name: 'Bulk Actions', description: 'Perform bulk actions on campaigns', resource: 'campaigns', action: 'bulk' },
      { id: 'workflows_view', name: 'View Workflows', description: 'View workflows', resource: 'workflows', action: 'view' },
      { id: 'workflows_edit', name: 'Edit Workflows', description: 'Edit workflows', resource: 'workflows', action: 'edit' },
      { id: 'workflows_execute', name: 'Execute Workflows', description: 'Execute workflows', resource: 'workflows', action: 'execute' },
      { id: 'reports_view', name: 'View Reports', description: 'View reports and analytics', resource: 'reports', action: 'view' },
      { id: 'reports_export', name: 'Export Reports', description: 'Export reports', resource: 'reports', action: 'export' },
    ]
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'Manage leads and jobs',
    isDefault: true,
    permissions: [
      { id: 'leads_view', name: 'View Leads', description: 'View leads data', resource: 'leads', action: 'view' },
      { id: 'leads_edit', name: 'Edit Leads', description: 'Edit leads data', resource: 'leads', action: 'edit' },
      { id: 'leads_export', name: 'Export Leads', description: 'Export leads data', resource: 'leads', action: 'export' },
      { id: 'companies_view', name: 'View Companies', description: 'View companies data', resource: 'companies', action: 'view' },
      { id: 'companies_edit', name: 'Edit Companies', description: 'Edit companies data', resource: 'companies', action: 'edit' },
      { id: 'jobs_view', name: 'View Jobs', description: 'View jobs data', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', name: 'Edit Jobs', description: 'Edit jobs data', resource: 'jobs', action: 'edit' },
      { id: 'campaigns_view', name: 'View Campaigns', description: 'View campaigns data', resource: 'campaigns', action: 'view' },
      { id: 'reports_view', name: 'View Reports', description: 'View reports and analytics', resource: 'reports', action: 'view' },
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to data',
    isDefault: false,
    permissions: [
      { id: 'leads_view', name: 'View Leads', description: 'View leads data', resource: 'leads', action: 'view' },
      { id: 'companies_view', name: 'View Companies', description: 'View companies data', resource: 'companies', action: 'view' },
      { id: 'jobs_view', name: 'View Jobs', description: 'View jobs data', resource: 'jobs', action: 'view' },
      { id: 'campaigns_view', name: 'View Campaigns', description: 'View campaigns data', resource: 'campaigns', action: 'view' },
      { id: 'reports_view', name: 'View Reports', description: 'View reports and analytics', resource: 'reports', action: 'view' },
    ]
  }
];

interface PermissionsProviderProps {
  children: React.ReactNode;
  user: any;
  userProfile: any;
  authLoading: boolean;
}

export function PermissionsProvider({ children, user, userProfile, authLoading }: PermissionsProviderProps) {
  const [roles] = useState<Role[]>(DEFAULT_ROLES);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before processing permissions
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user && userProfile) {
      // Use role from user profile database record
      const userRole = userProfile.role;
      
      if (import.meta.env.DEV) {
        console.log('PermissionsContext Debug:', {
          userEmail: user.email,
          userProfileRole: userRole,
          userMetadataRole: user.user_metadata?.role,
          userProfileExists: !!userProfile,
          userProfileData: userProfile
        });
      }
      
      const role = roles.find(r => r.id === userRole);
      
      if (role) {
        setUserPermissions({
          userId: user.id,
          roles: [role],
          permissions: role.permissions
        });
      } else {
        // If role not found, default to recruiter for safety
        const defaultRole = roles.find(r => r.id === 'recruiter');
        if (defaultRole) {
          setUserPermissions({
            userId: user.id,
            roles: [defaultRole],
            permissions: defaultRole.permissions
          });
        }
      }
    } else if (user && !userProfile) {
      // User exists but no profile - try to use metadata role as fallback
      const metadataRole = user.user_metadata?.role;
      if (import.meta.env.DEV) {
        console.log('PermissionsContext Debug: Using metadata role fallback', {
          userEmail: user.email,
          metadataRole: metadataRole
        });
      }
      
      if (metadataRole) {
        const role = roles.find(r => r.id === metadataRole);
        if (role) {
          setUserPermissions({
            userId: user.id,
            roles: [role],
            permissions: role.permissions
          });
        } else {
          // Default to recruiter if metadata role not found
          const defaultRole = roles.find(r => r.id === 'recruiter');
          if (defaultRole) {
            setUserPermissions({
              userId: user.id,
              roles: [defaultRole],
              permissions: defaultRole.permissions
            });
          }
        }
      } else {
        // No metadata role either, clear permissions
        setUserPermissions(null);
      }
    } else {
      // No user or user profile, clear permissions
      if (import.meta.env.DEV) {
        console.log('PermissionsContext Debug: No user or userProfile', {
          hasUser: !!user,
          hasUserProfile: !!userProfile,
          userEmail: user?.email
        });
      }
      setUserPermissions(null);
    }
    setLoading(false);
  }, [user, userProfile, roles, authLoading]);

  const hasPermission = (resource: string, action: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.roles.some(role => 
      role.id === roleName || role.name === roleName
    );
  };

  const canView = (resource: string): boolean => {
    return hasPermission(resource, 'view');
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(resource, 'edit');
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(resource, 'delete');
  };

  const canExport = (resource: string): boolean => {
    return hasPermission(resource, 'export');
  };

  const canBulkAction = (resource: string): boolean => {
    return hasPermission(resource, 'bulk');
  };

  const value: PermissionsContextType = {
    roles,
    userPermissions,
    hasPermission,
    hasRole,
    canView,
    canEdit,
    canDelete,
    canExport,
    canBulkAction,
    loading
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    console.error('usePermissions called outside PermissionsProvider');
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}


