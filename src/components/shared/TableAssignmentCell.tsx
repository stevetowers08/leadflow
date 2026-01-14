import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { User, UserX } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { logger } from '@/utils/productionLogger';

interface TableAssignmentCellProps {
  ownerId: string | null;
  entityId: string;
  entityType: 'companies' | 'people';
  onAssignmentChange?: () => void;
  className?: string;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
}

export const TableAssignmentCell: React.FC<TableAssignmentCellProps> = ({
  ownerId,
  entityId,
  entityType,
  onAssignmentChange,
  className,
}) => {
  const [showUserList, setShowUserList] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentOwner, setCurrentOwner] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const { toast } = useToast();

  // Check if user can assign
  const canAssign = hasRole('admin');

  // Fetch current owner details
  useEffect(() => {
    const fetchCurrentOwner = async () => {
      // Validate ownerId - must be a valid UUID string
      if (!ownerId || typeof ownerId !== 'string' || ownerId.trim() === '') {
        setCurrentOwner(null);
        return;
      }

      // Basic UUID validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(ownerId)) {
        logger.warn('Invalid ownerId format:', ownerId);
        setCurrentOwner(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, role')
          .eq('id', ownerId)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

        if (error) {
          // Only log non-PGRST116 errors (PGRST116 means no rows found, which is normal)
          if (error.code !== 'PGRST116') {
            logger.error('Error fetching current owner:', error);
          }
          setCurrentOwner(null);
        } else if (data && 'id' in data) {
          setCurrentOwner(data as UserProfile);
        }
      } catch (error) {
        logger.error('Error fetching current owner:', error);
        setCurrentOwner(null);
      }
    };

    fetchCurrentOwner();
  }, [ownerId]);

  // Fetch team members for assignment
  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        logger.error('Error fetching team members:', error);
        throw error;
      }

      setTeamMembers((data || []) as UserProfile[]);
    } catch (error) {
      logger.error('Error fetching team members:', error);
    }
  };

  const handleAssign = async (newOwnerId: string) => {
    if (!canAssign) return;

    setIsUpdating(true);
    try {
      // Assignment removed - owner_id no longer exists
      const tableName = entityType === 'people' ? 'leads' : entityType;
      const { error } = await supabase
        .from(tableName as never)
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);

      if (error) {
        throw error;
      }

      // Update local state
      const newOwner = teamMembers.find(member => member.id === newOwnerId);
      setCurrentOwner(newOwner || null);

      toast({
        title: 'Assignment Updated',
        description: `${entityType.slice(0, -1)} assigned successfully`,
      });

      onAssignmentChange?.();
      setShowUserList(false);
    } catch (error) {
      logger.error('Error assigning entity:', error);
      toast({
        title: 'Assignment Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnassign = async () => {
    if (!canAssign) return;

    setIsUpdating(true);
    try {
      // Assignment removed - owner_id no longer exists
      const tableName = entityType === 'people' ? 'leads' : entityType;
      const { error } = await supabase
        .from(tableName as never)
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);

      if (error) {
        throw error;
      }

      setCurrentOwner(null);

      toast({
        title: 'Assignment Updated',
        description: `${entityType.slice(0, -1)} unassigned successfully`,
      });

      onAssignmentChange?.();
      setShowUserList(false);
    } catch (error) {
      logger.error('Error unassigning entity:', error);
      toast({
        title: 'Assignment Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canAssign) return;

    if (teamMembers.length === 0) {
      fetchTeamMembers();
    }

    setShowUserList(!showUserList);
  };

  // Read-only view for users without assignment permissions
  if (!canAssign) {
    if (!currentOwner) {
      return (
        <div
          className={cn(
            'flex items-center gap-2 text-muted-foreground',
            className
          )}
        >
          <User className='w-4 h-4' />
          <span className='text-sm'>Unassigned</span>
        </div>
      );
    }

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className='w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center'>
          <span className='text-xs font-medium text-orange-800'>
            {currentOwner.full_name
              ? currentOwner.full_name
                  .split(' ')
                  .map(namePart => namePart[0])
                  .join('')
                  .toUpperCase()
              : currentOwner.email?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
        <span className='text-sm font-medium text-foreground'>
          {currentOwner.full_name || currentOwner.email || 'Unknown'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Assignment Display */}
      <div
        className={cn(
          'flex items-center gap-2 cursor-pointer transition-colors rounded-md px-2 py-1 hover:bg-muted',
          isUpdating && 'opacity-50 pointer-events-none'
        )}
        onClick={handleClick}
      >
        {currentOwner ? (
          <>
            <div className='w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center'>
              <span className='text-xs font-medium text-orange-800'>
                {currentOwner.full_name
                  ? currentOwner.full_name
                      .split(' ')
                      .map(namePart => namePart[0])
                      .join('')
                      .toUpperCase()
                  : currentOwner.email?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <span className='text-sm font-medium text-foreground'>
              {currentOwner.full_name || currentOwner.email || 'Unknown'}
            </span>
          </>
        ) : (
          <>
            <div className='w-7 h-7 rounded-full bg-muted flex items-center justify-center border border-border'>
              <User className='w-3 h-3 text-muted-foreground' />
            </div>
            <span className='text-sm text-muted-foreground'>Unassigned</span>
          </>
        )}
      </div>

      {/* User Selection Dropdown */}
      {showUserList && (
        <div className='absolute top-full left-0 mt-1 w-64 z-50'>
          <div className='relative z-50 max-h-96 min-w-[16rem] overflow-hidden rounded-md border bg-background text-foreground shadow-lg'>
            {/* Header */}
            <div className='p-3 border-b border-border'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>Assign to User</h3>
                {currentOwner && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleUnassign}
                    disabled={isUpdating}
                    className='h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                  >
                    <UserX className='w-3 h-3' />
                  </Button>
                )}
              </div>
            </div>

            {/* User List */}
            <div className='p-1 max-h-64 overflow-y-auto'>
              {teamMembers.length === 0 ? (
                <div className='p-3 text-center text-sm text-muted-foreground'>
                  Loading team members...
                </div>
              ) : (
                teamMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => handleAssign(member.id)}
                    disabled={isUpdating}
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors',
                      'hover:bg-accent focus:bg-accent',
                      currentOwner?.id === member.id &&
                        'bg-primary/10 text-blue-900',
                      isUpdating && 'opacity-50 pointer-events-none'
                    )}
                  >
                    {/* Check indicator for current assignment */}
                    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
                      {currentOwner?.id === member.id && (
                        <div className='h-2 w-2 rounded-full bg-blue-600' />
                      )}
                    </span>

                    {/* User Avatar */}
                    <div className='w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-3 border border-border'>
                      {member.full_name
                        ? member.full_name
                            .split(' ')
                            .map(namePart => namePart[0])
                            .join('')
                            .toUpperCase()
                        : member.email?.charAt(0).toUpperCase() || '?'}
                    </div>

                    {/* User Info */}
                    <div className='flex-1 min-w-0 text-left'>
                      <div className='font-medium truncate'>
                        {member.full_name || member.email || 'Unknown'}
                      </div>
                      <div className='text-xs text-muted-foreground truncate'>
                        {member.role}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
