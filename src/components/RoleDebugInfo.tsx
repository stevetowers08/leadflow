import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function RoleDebugInfo() {
  const { user } = useAuth();
  const { userPermissions, hasRole, loading } = usePermissions();

  if (!user) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug: Your Current Role</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>User ID:</strong> {user.id}</div>
        <div><strong>Metadata Role:</strong> {user.user_metadata?.role || 'none'}</div>
        <div><strong>Detected Role ID:</strong> {userPermissions?.roles[0]?.id || 'none'}</div>
        <div><strong>Detected Role Name:</strong> {userPermissions?.roles[0]?.name || 'none'}</div>
        <div><strong>Is Owner:</strong> {hasRole('Owner') ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Is Administrator:</strong> {hasRole('Administrator') ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}</div>
        <div className="mt-2">
          <Badge variant="outline">
            Current Role: {userPermissions?.roles[0]?.name || 'Unknown'}
          </Badge>
        </div>
        <div className="mt-2">
          <Badge variant="outline">
            Can Access Admin: {hasRole('Administrator') ? '✅ Yes' : '❌ No'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
