import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Shield, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
  is_active: boolean | null;
}

const AdminSettingsTab = () => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, role, is_active')
          .order('full_name');

        if (error) throw error;

        setTeamMembers(data || []);
      } catch (err) {
        console.error('Error loading team members:', err);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  const handleUpdateRole = async (
    memberId: string,
    newRole: 'owner' | 'admin' | 'user'
  ) => {
    setActionLoading(memberId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, role: newRole } : m))
      );

      toast.success('Role updated successfully');
    } catch (err: unknown) {
      console.error('Error updating role:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update role';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (
    memberId: string,
    currentStatus: boolean
  ) => {
    setActionLoading(memberId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev =>
        prev.map(m =>
          m.id === memberId ? { ...m, is_active: !currentStatus } : m
        )
      );

      toast.success(!currentStatus ? 'User activated' : 'User deactivated');
    } catch (err: unknown) {
      console.error('Error toggling active status:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update user status';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-primary';
      case 'user':
        return 'bg-green-100 text-success';
      default:
        return 'bg-gray-100 text-foreground';
    }
  };

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return <Shield className='h-4 w-4' />;
      default:
        return <UserIcon className='h-4 w-4' />;
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  const currentUserRole = teamMembers.find(m => m.id === user?.id)?.role;
  const isOwner = currentUserRole === 'owner' || hasRole('owner');

  if (!isOwner) {
    return (
      <Alert>
        <Shield className='h-4 w-4' />
        <AlertDescription>
          You need owner permissions to manage team members.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-foreground mb-2'>
          Team Members
        </h2>
        <p className='text-sm text-muted-foreground'>
          Manage team members and their permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            <CardTitle>Team Management</CardTitle>
          </div>
          <CardDescription>
            View and manage your team members' roles and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {teamMembers.map(member => {
              const isCurrentUser = member.id === user?.id;
              const isActionLoading = actionLoading === member.id;

              return (
                <div
                  key={member.id}
                  className='flex items-center justify-between p-3 border rounded-lg hover:bg-muted'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100'>
                      <UserIcon className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>
                          {member.full_name || 'Unnamed User'}
                        </span>
                        {isCurrentUser && (
                          <Badge variant='outline' className='text-xs'>
                            You
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Mail className='h-3 w-3' />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className={getRoleColor(member.role || '')}
                    >
                      <span className='flex items-center gap-1'>
                        {getRoleIcon(member.role)}
                        {member.role || 'Unknown'}
                      </span>
                    </Badge>

                    {!isCurrentUser && (
                      <>
                        <select
                          className='px-2 py-1 text-sm border rounded'
                          value={member.role || ''}
                          onChange={e =>
                            handleUpdateRole(member.id, e.target.value as 'owner' | 'admin' | 'user')
                          }
                          disabled={isActionLoading}
                        >
                          <option value='user'>User</option>
                          <option value='admin'>Admin</option>
                        </select>

                        <Button
                          size='sm'
                          variant={member.is_active ? 'destructive' : 'default'}
                          onClick={() =>
                            handleToggleActive(
                              member.id,
                              member.is_active || false
                            )
                          }
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : member.is_active ? (
                            'Deactivate'
                          ) : (
                            'Activate'
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
