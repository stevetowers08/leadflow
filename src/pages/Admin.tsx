import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Page } from '@/design-system/components';
import { Users, Settings, Shield, Crown, UserPlus, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
}

const Admin: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { hasRole, userPermissions } = usePermissions();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    ownerUsers: 0
  });

  // Fetch users and stats
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from user_profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
        return;
      }

      setUsers(profiles || []);
      
      // Calculate stats
      const totalUsers = profiles?.length || 0;
      const activeUsers = profiles?.filter(p => p.is_active).length || 0;
      const adminUsers = profiles?.filter(p => p.role === 'admin').length || 0;
      const ownerUsers = profiles?.filter(p => p.role === 'owner').length || 0;
      
      setStats({
        totalUsers,
        activeUsers,
        adminUsers,
        ownerUsers
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      owner: { label: 'Owner', className: 'bg-orange-100 text-orange-800' },
      admin: { label: 'Admin', className: 'bg-blue-100 text-blue-800' },
      recruiter: { label: 'Recruiter', className: 'bg-green-100 text-green-800' },
      viewer: { label: 'Viewer', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Page
      title="Admin Dashboard"
      subtitle="Manage users and system settings"
    >
      <div className="space-y-6">
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-orange-600" />
              Your Access Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <div className="mt-1">
                  {getRoleBadge(userProfile?.role || 'unknown')}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Permissions</p>
                <p className="text-sm">
                  {userPermissions ? `${userPermissions.permissions.length} permissions` : 'Loading...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold">{stats.adminUsers}</p>
                </div>
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Owners</p>
                  <p className="text-2xl font-bold">{stats.ownerUsers}</p>
                </div>
                <Crown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </div>
              <Button onClick={fetchUsers} variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.full_name || user.email}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>Joined: {formatDate(user.created_at)}</p>
                      {user.last_sign_in_at && (
                        <p>Last login: {formatDate(user.last_sign_in_at)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No users found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => window.location.href = '/settings'}
              >
                <Settings className="h-6 w-6" />
                <span>System Settings</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => window.location.href = '/settings'}
              >
                <UserPlus className="h-6 w-6" />
                <span>User Management</span>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> User invitations and detailed user management are available in Settings.
                Admins and owners can invite users, but only owners can assign roles.
                This admin dashboard provides an overview of system status and user statistics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default Admin;