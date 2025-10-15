import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}) => {
  const { hasRole, hasPermission, loading } = usePermissions();

  // Helper function to check if user has any of the required roles
  const hasAnyRole = (roles: string | string[]): boolean => {
    if (!roles) return true;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.some(role => hasRole(role));
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-sm text-muted-foreground'>
            Loading permissions...
          </p>
        </div>
      </div>
    );
  }

  // Check role permission
  if (requiredRole && !hasAnyRole(requiredRole)) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
                <Shield className='h-6 w-6 text-destructive' />
              </div>
              <CardTitle className='text-xl'>Access Denied</CardTitle>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='text-muted-foreground'>
                You don't have permission to access this page.
                {requiredRole &&
                  ` Required role: ${Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}`}
              </p>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  // Check specific permission
  if (
    requiredPermission &&
    !hasPermission(requiredPermission.resource, requiredPermission.action)
  ) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
                <AlertTriangle className='h-6 w-6 text-destructive' />
              </div>
              <CardTitle className='text-xl'>Permission Required</CardTitle>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='text-muted-foreground'>
                You don't have permission to {requiredPermission.action}{' '}
                {requiredPermission.resource}.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
};
