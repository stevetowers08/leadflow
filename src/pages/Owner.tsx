import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/DataTable';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { 
  Building2, 
  Users, 
  Settings, 
  CreditCard, 
  Save, 
  Crown,
  Shield,
  DollarSign,
  UserCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemSettings {
  companyName: string;
  maxUsers: number;
  currentPlan: string;
  billingEmail: string;
  subscriptionStatus: string;
  nextBillingDate: string;
  sessionTimeout: number;
  dataRetentionDays: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'recruiter' | 'viewer';
  department?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

interface Invite {
  id: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
  department?: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  inviteLink: string;
}

export default function Owner() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: '',
    maxUsers: 10,
    currentPlan: 'Professional',
    billingEmail: '',
    subscriptionStatus: 'active',
    nextBillingDate: '',
    sessionTimeout: 24,
    dataRetentionDays: 365,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userPermissions } = usePermissions();

  useEffect(() => {
    fetchData();
  }, [user, userPermissions]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Add current user to the users list
      if (user) {
        const userRole = userPermissions?.roles[0]?.id || 'owner';
        const currentUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || 'Current User',
          role: userRole as 'owner' | 'admin' | 'recruiter' | 'viewer',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: user.created_at,
          department: 'IT'
        };
        setUsers([currentUser]);
      } else {
        setUsers([]);
      }
      
      // TODO: Replace with actual Supabase queries for invites
      setInvites([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement actual Supabase update
      // await supabase.from('system_settings').upsert(settings);
      
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const userColumns = [
    {
      key: "name",
      label: "Name",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => {
        const roleColors = {
          owner: "bg-purple-100 text-purple-800",
          admin: "bg-blue-100 text-blue-800",
          recruiter: "bg-green-100 text-green-800",
          viewer: "bg-gray-100 text-gray-800",
        };
        return (
          <Badge className={roleColors[user.role]}>
            {user.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: "department",
      label: "Department",
      render: (user: User) => user.department || '-',
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <Badge className={user.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {user.status === 'active' ? <UserCheck className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (user: User) => new Date(user.lastLogin).toLocaleDateString(),
    },
  ];

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800"><UserCheck className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <PermissionGuard requiredRole="Owner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Owner</h1>
            <p className="text-muted-foreground">Control user limits, billing, and system settings</p>
            <p className="text-sm text-muted-foreground mt-1">
              User limit: {users.length + invites.filter(i => i.status === 'pending').length} / {settings.maxUsers}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter(u => u.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invites.filter(i => i.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting acceptance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">User Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{settings.maxUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(((users.length + invites.filter(i => i.status === 'pending').length) / settings.maxUsers) * 100)}% used
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{settings.currentPlan}</div>
              <p className="text-xs text-muted-foreground">
                {settings.subscriptionStatus}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="user-control" className="space-y-4">
          <TabsList>
            <TabsTrigger value="user-control">User Control</TabsTrigger>
          </TabsList>

          {/* User Control Tab - Owner's main function */}
          <TabsContent value="user-control" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">User Limits & Control</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">Maximum Users</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={settings.maxUsers}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls the maximum number of users that can be invited to the system.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Usage</Label>
                    <div className="text-lg font-semibold">
                      {users.length + invites.filter(i => i.status === 'pending').length} / {settings.maxUsers}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, ((users.length + invites.filter(i => i.status === 'pending').length) / settings.maxUsers) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Owner Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>System Status</Label>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Plan</Label>
                    <div className="text-lg font-semibold">{settings.currentPlan}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Email</Label>
                    <div className="text-sm">{settings.billingEmail || 'Not set'}</div>
                  </div>
                  <Button onClick={handleSaveSettings} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
}
