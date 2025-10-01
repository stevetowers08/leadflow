import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Shield, Crown, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  invited_at: string;
  expires_at: string;
  status: string;
  invited_by: string;
}

const Accounts = () => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'recruiter' as 'admin' | 'recruiter' | 'viewer'
  });

  // Check if user has admin permissions
  const canInviteUsers = hasRole('admin') || hasRole('owner');
  const canAssignRoles = hasRole('owner');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        // If RLS is blocking access, show a message about permissions
        if (usersError.code === 'PGRST301' || usersError.message.includes('permission')) {
          toast({
            title: "Permission Required",
            description: "You need proper permissions to view user profiles. Please contact an administrator.",
            variant: "destructive",
          });
          setUsers([]);
          return;
        }
        throw usersError;
      }
      setUsers(usersData || []);

      // Fetch invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('*')
        .order('invited_at', { ascending: false });

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        // Don't throw error for invitations, just log it
        setInvitations([]);
      } else {
        setInvitations(invitationsData || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteData.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      // Determine the role to assign
      const assignedRole = canAssignRoles ? inviteData.role : 'recruiter';
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', inviteData.email)
        .single();

      if (existingUser) {
        toast({
          title: "Error",
          description: "User with this email already exists",
          variant: "destructive",
        });
        return;
      }

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('invitations')
        .select('id, status')
        .eq('email', inviteData.email)
        .eq('status', 'pending')
        .single();

      if (existingInvitation) {
        toast({
          title: "Error",
          description: "An invitation for this email is already pending",
          variant: "destructive",
        });
        return;
      }

      // Create invitation
      const { data: invitation, error } = await supabase
        .from('invitations')
        .insert({
          email: inviteData.email,
          role: assignedRole,
          invited_by: user?.id
        })
        .select()
        .single();

      if (error) {
        // Check if it's a user limit error
        if (error.message.includes('User limit exceeded')) {
          toast({
            title: "User Limit Exceeded",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      const roleMessage = canAssignRoles 
        ? `Invitation sent to ${inviteData.email} with ${assignedRole} role`
        : `Invitation sent to ${inviteData.email} as a Recruiter (only owners can assign other roles)`;

      toast({
        title: "Invitation Sent",
        description: roleMessage,
      });

      setInviteData({ email: '', role: 'recruiter' });
      setIsInviteOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      owner: { label: 'Owner', className: 'bg-orange-100 text-orange-800', icon: Crown },
      admin: { label: 'Admin', className: 'bg-accent/20 text-accent', icon: Shield },
      recruiter: { label: 'Recruiter', className: 'bg-green-100 text-green-800', icon: User },
      viewer: { label: 'Viewer', className: 'bg-gray-100 text-gray-800', icon: User }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!canInviteUsers) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need admin or owner permissions to manage user accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Invitation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-sidebar-primary" />
              <div>
                <CardTitle>Invite New User</CardTitle>
                <CardDescription>
                  Add new team members to your CRM
                </CardDescription>
              </div>
            </div>
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
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
                      placeholder="user@example.com"
                      value={inviteData.email}
                      onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    {canAssignRoles ? (
                      <Select value={inviteData.role} onValueChange={(value: 'admin' | 'recruiter' | 'viewer') => 
                        setInviteData(prev => ({ ...prev, role: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                        <Shield className="h-4 w-4 text-sidebar-primary" />
                        <span className="text-sm text-gray-600">
                          Only owners can assign roles. New users will be assigned as Recruiters by default.
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteUser}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Pending Invitations */}
      {invitations.filter(inv => inv.status === 'pending').length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-yellow-600" />
              <div>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Invitations waiting for acceptance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations
                .filter(inv => inv.status === 'pending')
                .map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <p className="text-sm text-gray-600">
                          Invited {formatDate(invitation.invited_at)} • Expires {formatDate(invitation.expires_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getRoleBadge(invitation.role)}
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage existing user accounts and permissions
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-3">
              {users.map((userData) => (
                <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{userData.full_name || userData.email}</p>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getRoleBadge(userData.role)}
                    <div className="text-right text-sm text-gray-600">
                      <p>Joined: {formatDate(userData.created_at)}</p>
                      {userData.last_sign_in_at && (
                        <p>Last login: {formatDate(userData.last_sign_in_at)}</p>
                      )}
                    </div>
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
    </div>
  );
};

export default Accounts;

