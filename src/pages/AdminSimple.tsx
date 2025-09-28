import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import { Users, Settings, Shield, Crown } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { hasRole, userPermissions } = usePermissions();

  return (
    <Page
      title="Admin Dashboard"
      subtitle="Administrative controls and user management"
    >
      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-orange-600" />
              Current User Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>User ID:</strong> {user?.id}</div>
            <div><strong>Profile Role:</strong> {userProfile?.role || 'Not loaded'}</div>
            <div><strong>Has Owner Role:</strong> {hasRole('owner') ? 'Yes' : 'No'}</div>
            <div><strong>Has Admin Role:</strong> {hasRole('admin') ? 'Yes' : 'No'}</div>
            <div><strong>Permissions:</strong> {userPermissions ? 'Loaded' : 'Not loaded'}</div>
          </CardContent>
        </Card>

        {/* Admin Features Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Admin Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-gray-600">Manage users and roles</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Settings className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system settings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Admin panel is working! You have owner access and can see this page.
              </p>
              <p className="text-sm text-gray-600">
                Full admin features will be implemented next.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default Admin;
