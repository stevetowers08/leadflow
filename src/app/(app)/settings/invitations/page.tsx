'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  MoreVertical,
  RefreshCw,
  X,
  UserPlus,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Invitation } from '@/types/database';

export default function InvitationsPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'user' as 'user' | 'admin' | 'manager' | 'viewer',
  });

  const canInvite = hasPermission('users', 'invite');

  useEffect(() => {
    if (user && canInvite) {
      loadInvitations();
    }
  }, [user, canInvite]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000); // Reasonable limit

      // Handle missing table gracefully
      if (error) {
        const errorMessage = error.message || '';
        if (
          errorMessage.includes('schema cache') ||
          errorMessage.includes('does not exist') ||
          error.code === 'PGRST116' ||
          error.code === '42P01' // PostgreSQL table does not exist
        ) {
          console.debug('Invitations table does not exist, showing empty list');
          setInvitations([]);
          return;
        }
        throw error;
      }
      // Type assertion: database returns invitations table structure
      setInvitations((data || []) as Invitation[]);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = inviteForm.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          role: inviteForm.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation');
      }

      toast.success('Invitation sent successfully');
      setInviteDialogOpen(false);
      setInviteForm({ email: '', role: 'user' });
      loadInvitations();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to send invitation'
      );
    }
  };

  const handleResend = async (invitationId: string) => {
    try {
      setResending(invitationId);
      const response = await fetch('/api/admin/invite/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend invitation');
      }

      toast.success('Invitation resent successfully');
      loadInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to resend invitation'
      );
    } finally {
      setResending(null);
    }
  };

  const handleCancel = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    try {
      setCancelling(invitationId);
      const response = await fetch('/api/admin/invite/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel invitation');
      }

      toast.success('Invitation cancelled successfully');
      loadInvitations();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel invitation'
      );
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant='outline' className='bg-yellow-50 text-yellow-700'>
            <Clock className='mr-1 h-3 w-3' />
            Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant='outline' className='bg-green-50 text-green-700'>
            <CheckCircle2 className='mr-1 h-3 w-3' />
            Accepted
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant='outline' className='bg-gray-50 text-gray-700'>
            <XCircle className='mr-1 h-3 w-3' />
            Expired
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant='outline' className='bg-red-50 text-red-700'>
            <XCircle className='mr-1 h-3 w-3' />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  if (!canInvite) {
    return (
      <div className='p-6'>
        <Alert>
          <AlertDescription>
            You don't have permission to manage invitations. Please contact an
            administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            User Invitations
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage user invitations and track their status
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className='mr-2 h-4 w-4' />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : invitations.length === 0 ? (
            <div className='text-center py-12'>
              <Mail className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>
                No invitations sent yet. Invite your first user to get started.
              </p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map(invitation => (
                    <TableRow key={invitation.id}>
                      <TableCell className='font-medium'>
                        {invitation.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary'>{invitation.role}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell className='text-muted-foreground'>
                        {invitation.invited_at
                          ? format(
                              new Date(invitation.invited_at),
                              'MMM d, yyyy'
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {invitation.expires_at
                          ? format(
                              new Date(invitation.expires_at),
                              'MMM d, yyyy'
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className='text-right'>
                        {invitation.status === 'pending' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => handleResend(invitation.id)}
                                disabled={resending === invitation.id}
                              >
                                {resending === invitation.id ? (
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                ) : (
                                  <RefreshCw className='mr-2 h-4 w-4' />
                                )}
                                Resend
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancel(invitation.id)}
                                disabled={cancelling === invitation.id}
                                className='text-destructive'
                              >
                                {cancelling === invitation.id ? (
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                ) : (
                                  <X className='mr-2 h-4 w-4' />
                                )}
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation email to a new user. They'll receive a magic
              link to create their account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                type='email'
                placeholder='user@example.com'
                value={inviteForm.email}
                onChange={e =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='role'>Role</Label>
              <Select
                value={inviteForm.role}
                onValueChange={value =>
                  setInviteForm({
                    ...inviteForm,
                    role: value as typeof inviteForm.role,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='user'>User</SelectItem>
                  <SelectItem value='manager'>Manager</SelectItem>
                  <SelectItem value='viewer'>Viewer</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>
                <Mail className='mr-2 h-4 w-4' />
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
