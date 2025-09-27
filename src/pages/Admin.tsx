import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/DataTable';
import { LogoManager } from '@/components/LogoManager';
import { StatusBadge } from '@/components/StatusBadge';
import { Users, Building2, Crown, Plus, Save, Mail, UserPlus, Settings, Database, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Page, StatItemProps } from '@/design-system/components';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'recruiter' | 'viewer' | 'owner';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  department: string;
}

interface Invite {
  id: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
  invitedBy: string;
}

interface OrganizationSettings {
  companyName: string;
  maxUsers: number;
  currentPlan: string;
  billingEmail: string;
  subscriptionStatus: string;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { userPermissions, hasRole, loading } = usePermissions();
  const { toast } = useToast();

  // Set page meta tags
  usePageMeta({
    title: 'Admin - Empowr CRM',
    description: 'Administrative dashboard for managing users, organization settings, and system configuration.',
    keywords: 'admin, administration, user management, organization settings, system configuration, CRM admin',
    ogTitle: 'Admin - Empowr CRM',
    ogDescription: 'Administrative dashboard for managing users, organization settings, and system configuration.',
    twitterTitle: 'Admin - Empowr CRM',
    twitterDescription: 'Administrative dashboard for managing users, organization settings, and system configuration.'
  });

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [settings, setSettings] = useState<OrganizationSettings>({
    companyName: '',
    maxUsers: 10,
    currentPlan: 'Professional',
    billingEmail: '',
    subscriptionStatus: 'active'
  });
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'recruiter' as 'admin' | 'recruiter' | 'viewer'
  });

  // Fetch data
  const fetchData = async () => {
    try {
      if (user) {
        const userRole = userPermissions?.roles[0]?.id || 'admin';
        const currentUser: User = {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || 'Current User',
          role: userRole as 'admin' | 'recruiter' | 'viewer' | 'owner',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: user.created_at,
          department: 'IT'
        };
        setUsers([currentUser]);
      } else {
        setUsers([]);
      }
      setInvites([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, userPermissions]);

  // Handlers
  const handleInviteUser = async () => {
    if (!newInvite.email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    // Check user limit
    const currentUsers = users.length;
    const pendingInvites = invites.filter(i => i.status === 'pending').length;
    if (currentUsers + pendingInvites >= settings.maxUsers) {
      toast({
        title: "User Limit Reached",
        description: `Cannot invite more users. Current limit: ${settings.maxUsers}`,
        variant: "destructive"
      });
      return;
    }

    const newInviteData: Invite = {
      id: Date.now().toString(),
      email: newInvite.email,
      role: newInvite.role,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      invitedBy: user?.email || 'Unknown'
    };

    setInvites(prev => [...prev, newInviteData]);
    setNewInvite({ email: '', role: 'recruiter' });
    setIsInviteUserOpen(false);

    toast({
      title: "Invite Sent",
      description: `Invite sent to ${newInvite.email}`,
    });
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    console.log('Updating role:', { userId, newRole, currentUsers: users });
    
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole as any } : u
    ));

    toast({
      title: "Role Updated",
      description: `User role updated to ${newRole}`,
    });
  };

  const handleSaveSettings = async () => {
    // TODO: Save to Supabase
      toast({
      title: "Settings Saved",
      description: "Organization settings updated successfully",
    });
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge className={getUnifiedStatusClass(role)}>
        {getStatusDisplayText(role)}
      </Badge>
    );
  };

  const getInviteStatusBadge = (status: string) => {
    return (
      <Badge className={getUnifiedStatusClass(status)}>
        {getStatusDisplayText(status)}
      </Badge>
    );
  };

  // Show loading state if permissions are still loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Organization Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage users, roles, and system settings
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  const stats: StatItemProps[] = [
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: Users,
      trend: null,
    },
    {
      label: "Active Users",
      value: users.filter(u => u.status === 'active').length.toString(),
      icon: CheckCircle,
      trend: null,
    },
    {
      label: "Pending Invites",
      value: invites.filter(i => i.status === 'pending').length.toString(),
      icon: Mail,
      trend: null,
    },
    {
      label: "User Limit",
      value: `${users.length + invites.filter(i => i.status === 'pending').length} / ${settings.maxUsers}`,
      icon: Settings,
      trend: null,
    },
  ];

  // User columns for DataTable
  const userColumns = [
    {
      key: "fullName",
      label: "Name",
      render: (user: User) => user.fullName,
    },
    {
      key: "email",
      label: "Email",
      render: (user: User) => user.email,
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => {
        const isOwner = hasRole('owner');
        const isCurrentUser = user.id === user?.id; // Use user?.id instead of userPermissions?.userId
        
        // Always show role badge for non-owners
        if (!isOwner) {
          return (
            <div className="flex items-center gap-2">
              {getRoleBadge(user.role)}
              {isCurrentUser && <StatusBadge status="You" size="sm" />}
            </div>
          );
        }
        
        // Owner can change any user's role (including their own for testing)
        return (
          <div className="flex items-center gap-2">
            <Select value={user.role} onValueChange={(value) => handleUpdateUserRole(user.id, value)}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            {isCurrentUser && <StatusBadge status="You" size="sm" />}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <StatusBadge status={user.status} size="sm" />
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (user: User) => {
        const date = new Date(user.lastLogin);
        return date.toLocaleDateString();
      },
    },
  ];

  // Invite columns for DataTable
  const inviteColumns = [
    {
      key: "email",
      label: "Email",
      render: (invite: Invite) => invite.email,
    },
    {
      key: "role",
      label: "Role",
      render: (invite: Invite) => getRoleBadge(invite.role),
    },
    {
      key: "status",
      label: "Status",
      render: (invite: Invite) => getInviteStatusBadge(invite.status),
    },
    {
      key: "createdAt",
      label: "Invited",
      render: (invite: Invite) => {
        const date = new Date(invite.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      key: "expiresAt",
      label: "Expires",
      render: (invite: Invite) => {
        const date = new Date(invite.expiresAt);
        return date.toLocaleDateString();
      },
    },
  ];

  return (
    <Page
      title="Organization Admin"
      subtitle="Manage users, invites, and organization settings"
      stats={stats}
    >
      <div className="flex items-center gap-2 mb-4">
        <StatusBadge status="Organization" size="sm" />
        {hasRole('owner') && (
          <StatusBadge status="Owner" size="sm" />
        )}
      </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="w-full">
        <TabsList className={`grid w-full ${hasRole('owner') ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          {hasRole('owner') && <TabsTrigger value="owner">Owner</TabsTrigger>}
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">User Management</h2>
            <Dialog open={isInviteUserOpen} onOpenChange={setIsInviteUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                  Invite User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                      value={newInvite.email}
                      onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@company.com"
                      />
                    </div>
                  <div>
                      <Label htmlFor="role">Role</Label>
                    <Select value={newInvite.role} onValueChange={(value: any) => setNewInvite(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsInviteUserOpen(false)}>
                        Cancel
                      </Button>
                    <Button onClick={handleInviteUser}>
                      Send Invite
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          <DataTable columns={userColumns} data={users} showSearch={false} />
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pending Invites</h2>
            <StatusBadge status={`${invites.filter(i => i.status === 'pending').length} pending`} size="sm" />
          </div>
          <DataTable columns={inviteColumns} data={invites} showSearch={false} />
          </TabsContent>

          {/* Logos Tab */}
          <TabsContent value="logos" className="space-y-4">
            <LogoManager />
          </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Organization Settings</h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Your Company Name"
                    />
                  </div>
                <div>
                  <Label htmlFor="billingEmail">Billing Email</Label>
                    <Input
                    id="billingEmail"
                      type="email"
                    value={settings.billingEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, billingEmail: e.target.value }))}
                    placeholder="billing@company.com"
                    />
                  </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Plan</Label>
                  <div className="text-lg font-semibold">{settings.currentPlan}</div>
                </div>
                <div>
                  <Label>Subscription Status</Label>
                  <StatusBadge status={settings.subscriptionStatus} size="sm" />
                </div>
                <div>
                  <Label>User Limit</Label>
                  <div className="text-lg font-semibold">{settings.maxUsers} users</div>
                  <p className="text-xs text-muted-foreground">
                    Contact your Owner to increase the limit
                  </p>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Billing Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Plan</Label>
                  <div className="text-lg font-semibold">{settings.currentPlan}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={settings.subscriptionStatus} size="sm" />
                </div>
                <div>
                  <Label>User Limit</Label>
                  <div className="text-lg font-semibold">{settings.maxUsers} users</div>
                </div>
                </CardContent>
              </Card>
              
            <Card>
              <CardHeader>
                <CardTitle>Billing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Billing Email</Label>
                  <div className="text-sm">{settings.billingEmail || 'Not set'}</div>
                </div>
                <div>
                  <Label>Next Billing Date</Label>
                  <div className="text-sm">January 1, 2025</div>
                </div>
                <div>
                  <Label>Usage This Month</Label>
                  <div className="text-sm">{users.length} / {settings.maxUsers} users</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Owner Tab - Only visible to Owners */}
        {hasRole('owner') && (
          <TabsContent value="owner" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Owner Controls</h2>
              <StatusBadge status="Owner" size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ownerMaxUsers">Maximum Users</Label>
                    <Input
                      id="ownerMaxUsers"
                      type="number"
                      value={settings.maxUsers}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Current usage: {users.length + invites.filter(i => i.status === 'pending').length} users
                    </p>
                  </div>
                  <div>
                    <Label>Usage Breakdown</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <span>{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Invites:</span>
                        <span>{invites.filter(i => i.status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{users.length + invites.filter(i => i.status === 'pending').length} / {settings.maxUsers}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Plan</Label>
                    <div className="text-lg font-semibold">{settings.currentPlan}</div>
                  </div>
                  <div>
                    <Label>Subscription Status</Label>
                    <StatusBadge status={settings.subscriptionStatus} size="sm" />
                  </div>
                  <div>
                    <Label>Billing Email</Label>
                    <div className="text-sm">{settings.billingEmail || 'Not set'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
        </Tabs>
    </Page>
  );
};

export default Admin;