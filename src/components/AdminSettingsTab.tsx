import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Loader2, Users, UserPlus, Mail, Shield, Trash2, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { gmailService } from '@/services/gmailService';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
}

const AdminSettingsTab = () => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('recruiter');
  const [inviting, setInviting] = useState(false);
  const [userRoleChanges, setUserRoleChanges] = useState<Record<string, string>>({});
  const [userLimit, setUserLimit] = useState<number | null>(null);
  const [savingLimit, setSavingLimit] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
    loadUserLimit();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log('Loading users...');
      console.log('Current user:', user);
      console.log('User role:', user?.user_metadata?.role);
      
      // Simple approach - get all users from user_profiles
      // This should work once the RLS policy is applied
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users data:', { data, error });
      console.log('Number of users found:', data?.length || 0);

      if (error) {
        console.error('Error loading users:', error);
        toast.error(`Failed to load users: ${error.message}`);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadUserLimit = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_limit')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading user limit:', error);
        return;
      }

      setUserLimit(data?.user_limit || null);
    } catch (error) {
      console.error('Error loading user limit:', error);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Only admins and owners can invite users
    if (!hasRole('admin') && !hasRole('owner')) {
      toast.error('Only admins and owners can invite users');
      return;
    }

    // Check user limit (exclude owners from count)
    if (userLimit !== null && userLimit > 0) {
      const currentUserCount = users.filter(u => u.role !== 'owner').length;
      if (currentUserCount >= userLimit) {
        toast.error(`User limit reached. Maximum ${userLimit} users allowed (excluding owners).`);
        return;
      }
    }

    setInviting(true);
    try {
      // Create invitation in database
      const { data: invitation, error } = await supabase
        .from('invitations')
        .insert({
          email: inviteEmail.trim(),
          role: inviteRole,
          invited_by: user?.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        toast.error('Failed to create invitation');
        return;
      }

      // Send invitation email using Gmail service
      try {
        const invitationLink = `${window.location.origin}/invite/${invitation.token}`;
        const inviterName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Team Member';
        
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">You're Invited to Join Our CRM!</h2>
            
            <p>Hello!</p>
            
            <p><strong>${inviterName}</strong> has invited you to join our CRM system as a <strong>${inviteRole}</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">What's Next?</h3>
              <p>Click the button below to accept your invitation and create your account:</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${invitationLink}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Accept Invitation
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                This invitation will expire in 7 days. If the button doesn't work, copy and paste this link into your browser:
                <br><a href="${invitationLink}">${invitationLink}</a>
              </p>
            </div>
            
            <p>If you have any questions, please contact your team administrator.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">
              This invitation was sent to ${inviteEmail}. If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        `;

        await gmailService.sendEmail({
          to: [inviteEmail.trim()],
          subject: `Invitation to Join Our CRM - ${inviteRole} Role`,
          body: emailContent,
        });

        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
        setInviteRole('recruiter');
        
      } catch (emailError) {
        console.error('Error sending invitation email:', emailError);
        toast.error('Invitation created but failed to send email. Please try again.');
      }
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUserRoleChanges(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveUserRole = async (userId: string) => {
    // Only owners can change user roles
    if (!hasRole('owner')) {
      toast.error('Only owners can change user roles');
      return;
    }

    const newRole = userRoleChanges[userId];
    if (!newRole) {
      toast.error('No changes to save');
      return;
    }

    try {
      console.log('Updating user role:', { userId, newRole });
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Error updating user role:', error);
        toast.error(`Failed to update user role: ${error.message}`);
        return;
      }

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      // Clear the change from state
      setUserRoleChanges(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleSaveUserLimit = async () => {
    if (!hasRole('owner')) {
      toast.error('Only owners can set user limits');
      return;
    }

    setSavingLimit(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ user_limit: userLimit })
        .eq('id', user?.id);

      if (error) {
        console.error('Error saving user limit:', error);
        toast.error('Failed to save user limit');
        return;
      }

      toast.success('User limit updated successfully');
    } catch (error) {
      console.error('Error saving user limit:', error);
      toast.error('Failed to save user limit');
    } finally {
      setSavingLimit(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete user profile
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return;
      }

      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const columns = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'full_name',
      header: 'Name',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }: { row: any }) => {
        const user = row.original;
        const hasChanges = userRoleChanges[user.id];
        const currentRole = hasChanges || user.role;
        
        return (
          <div className="flex items-center gap-2">
            <Select 
              value={currentRole} 
              onValueChange={(value) => handleRoleChange(user.id, value)}
              disabled={!hasRole('owner')}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
            {hasRole('owner') && hasChanges && (
              <Button
                size="sm"
                onClick={() => handleSaveUserRole(user.id)}
              >
                <Save className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ row }: { row: any }) => {
        return new Date(row.original.created_at).toLocaleDateString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            {user.id !== user?.id && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* User Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
            Manage existing team members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {users.length === 0 && (
                <Alert>
                  <AlertDescription>
                    No users found. This is likely due to Row Level Security (RLS) policies preventing access to other users' profiles. 
                    Check the browser console for detailed debugging information.
                  </AlertDescription>
                </Alert>
              )}
              <DataTable columns={columns} data={users} searchKey="email" />
            </div>
          )}
          </CardContent>
        </Card>

      {/* Invite User Section */}
      {(hasRole('admin') || hasRole('owner')) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite User
            </CardTitle>
            <CardDescription>
              Send an invitation email to add new team members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteRole">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {hasRole('owner') && (
                      <SelectItem value="owner">Owner</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  onClick={handleInviteUser} 
                  disabled={inviting || !inviteEmail.trim()}
                  className="w-full"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
            </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Limit Settings - Owner Only */}
      {hasRole('owner') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Limit Settings
            </CardTitle>
            <CardDescription>
              Set the maximum number of users allowed (excluding owners)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userLimit">Maximum Users</Label>
                <Input
                  id="userLimit"
                  type="number"
                  min="0"
                  value={userLimit || ''}
                  onChange={(e) => setUserLimit(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="No limit"
                />
                <p className="text-xs text-muted-foreground">
                  Set to 0 or leave empty for no limit. Owners are not counted.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Current Count</Label>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {users.filter(u => u.role !== 'owner').length}
                  </span>
                  <span className="text-muted-foreground">
                    {userLimit ? `/ ${userLimit}` : 'users (no limit)'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  onClick={handleSaveUserLimit} 
                  disabled={savingLimit}
                  className="w-full"
                >
                  {savingLimit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Limit
                    </>
                  )}
            </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSettingsTab;
