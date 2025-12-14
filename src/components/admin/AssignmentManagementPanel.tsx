import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AssignmentService, TeamMember } from '@/services/assignmentService';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';

interface AssignmentStats {
  totalAssigned: number;
  unassigned: number;
  byUser: Array<{ userId: string; userName: string; count: number }>;
}

export const AssignmentManagementPanel: React.FC = () => {
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newOwnerId, setNewOwnerId] = useState<string>('');
  const [isReassigning, setIsReassigning] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  const canManageAssignments = hasRole('admin');

  useEffect(() => {
    if (canManageAssignments) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageAssignments]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, membersData] = await Promise.all([
        AssignmentService.getAssignmentStats(),
        AssignmentService.getTeamMembers(),
      ]);

      setStats(statsData);
      setTeamMembers(membersData);
    } catch (error) {
      console.error('Error loading assignment data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assignment data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReassignUserRecords = async () => {
    if (!selectedUser || !newOwnerId || !user) {
      toast({
        title: 'Error',
        description: 'Please select both the user and new owner',
        variant: 'destructive',
      });
      return;
    }

    setIsReassigning(true);
    try {
      const result = await AssignmentService.reassignOrphanedRecords(
        selectedUser,
        newOwnerId
      );

      if (result.success) {
        toast({
          title: 'Reassignment Complete',
          description: result.message,
        });
        setShowReassignDialog(false);
        setSelectedUser('');
        setNewOwnerId('');
        loadData(); // Refresh stats
      } else {
        toast({
          title: 'Reassignment Failed',
          description: result.error || 'Failed to reassign records',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error reassigning records:', error);
      toast({
        title: 'Reassignment Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsReassigning(false);
    }
  };

  const getSelectedUserName = () => {
    const selectedMember = teamMembers.find(
      member => member.id === selectedUser
    );
    return selectedMember?.full_name || 'Unknown User';
  };

  const getNewOwnerName = () => {
    const newOwner = teamMembers.find(member => member.id === newOwnerId);
    return newOwner?.full_name || 'Unknown User';
  };

  if (!canManageAssignments) {
    return (
      <Alert>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          You don&apos;t have permission to manage assignments. Only
          administrators and owners can access this panel.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <RefreshCw className='h-4 w-4 animate-spin' />
          Loading assignment data...
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Assignment Management</h2>
          <p className='text-muted-foreground'>
            Manage user assignments and handle orphaned records
          </p>
        </div>
        <Button onClick={loadData} variant='outline' size='sm'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Assignment Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Assigned
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.totalAssigned || 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              Leads, companies, and jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Unassigned</CardTitle>
            <XCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-warning'>
              {stats?.unassigned || 0}
            </div>
            <p className='text-xs text-muted-foreground'>Need assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Team Members</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{teamMembers.length}</div>
            <p className='text-xs text-muted-foreground'>Active users</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignment by User */}
      <Card>
        <CardHeader>
          <CardTitle>Assignments by User</CardTitle>
          <CardDescription>
            Distribution of assignments across team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.byUser.map(userStat => {
                const member = teamMembers.find(
                  teamMember => teamMember.id === userStat.userId
                );
                return (
                  <TableRow key={userStat.userId}>
                    <TableCell className='font-medium'>
                      {member?.full_name || 'Unknown User'}
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {member?.role || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{userStat.count}</TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedUser(userStat.userId);
                          setShowReassignDialog(true);
                        }}
                        disabled={userStat.count === 0}
                      >
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Reassign
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reassignment Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign User Records</DialogTitle>
            <DialogDescription>
              Transfer all assignments from one user to another
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>From User:</label>
              <div className='p-3 bg-muted/20 rounded-lg border'>
                <div className='font-medium'>{getSelectedUserName()}</div>
                <div className='text-sm text-muted-foreground'>
                  {stats?.byUser.find(
                    userStat => userStat.userId === selectedUser
                  )?.count || 0}{' '}
                  assigned items
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>To User:</label>
              <Select value={newOwnerId} onValueChange={setNewOwnerId}>
                <SelectTrigger>
                  <SelectValue placeholder='Select new owner...' />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter(member => member.id !== selectedUser)
                    .map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium'>
                            {member.full_name
                              .split(' ')
                              .map(namePart => namePart[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className='flex flex-col'>
                            <span className='font-medium'>
                              {member.full_name}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {newOwnerId && (
              <Alert>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  This will transfer all assignments from{' '}
                  <strong>{getSelectedUserName()}</strong> to{' '}
                  <strong>{getNewOwnerName()}</strong>. This action cannot be
                  undone.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowReassignDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReassignUserRecords}
              disabled={!newOwnerId || isReassigning}
              className='min-w-[120px]'
            >
              {isReassigning ? (
                <>
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                  Reassigning...
                </>
              ) : (
                <>
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Reassign Records
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
