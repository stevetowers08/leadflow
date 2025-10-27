import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { User, UserX } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface IconOnlyAssignmentCellProps {
  ownerId: string | null;
  entityId: string;
  entityType: 'companies' | 'people' | 'jobs';
  onAssignmentChange?: () => void;
  className?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export const IconOnlyAssignmentCell: React.FC<IconOnlyAssignmentCellProps> = ({
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
  const canAssign = hasRole('admin') || hasRole('owner');

  // Debug logging
  console.log('IconOnlyAssignmentCell Debug:', {
    entityId,
    entityType,
    ownerId,
    canAssign,
    hasAdminRole: hasRole('admin'),
    hasOwnerRole: hasRole('owner'),
  });

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
        console.warn('Invalid ownerId format:', ownerId);
        setCurrentOwner(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, role')
          .eq('id', ownerId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching current owner:', error);
          setCurrentOwner(null);
        } else {
          setCurrentOwner(data);
        }
      } catch (error) {
        console.error('Error fetching current owner:', error);
        setCurrentOwner(null);
      }
    };

    fetchCurrentOwner();
  }, [ownerId]);

  // Fetch team members on mount if user can assign
  useEffect(() => {
    if (canAssign && teamMembers.length === 0) {
      console.log('✅ User can assign, fetching team members on mount...');
      fetchTeamMembers().catch(err => {
        console.error('❌ Failed to fetch team members:', err);
      });
    } else {
      console.log('⏭️ Skipping team member fetch:', {
        canAssign,
        teamMembersCount: teamMembers.length,
      });
    }
  }, [canAssign, teamMembers.length]);

  // Fetch team members for assignment
  const fetchTeamMembers = async () => {
    try {
      console.log('Fetching team members for assignment...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }

      console.log('Team members fetched:', data?.length || 0);
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleAssign = async (newOwnerId: string) => {
    if (!canAssign) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from(entityType)
        .update({
          owner_id: newOwnerId,
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
      console.error('Error assigning entity:', error);
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
      const { error } = await supabase
        .from(entityType)
        .update({
          owner_id: null,
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
      console.error('Error unassigning entity:', error);
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
    // CRITICAL: Stop all event propagation
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    console.log('🚫 Assignment button clicked, stopping propagation');

    if (!canAssign) {
      console.log('⛔ User cannot assign');
      return;
    }

    if (teamMembers.length === 0) {
      console.log('👥 No team members cached, fetching...');
      fetchTeamMembers();
    }

    console.log('🔄 Toggling user list dropdown');
    setShowUserList(!showUserList);
  };

  // Read-only view for users without assignment permissions
  if (!canAssign) {
    if (!currentOwner) {
      return (
        <div className={cn('flex items-center justify-center', className)}>
          <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center'>
            <User className='w-3 h-3 text-gray-400' />
          </div>
        </div>
      );
    }

    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className='w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center'>
          <span className='text-xs font-medium text-orange-800'>
            {currentOwner.full_name
              .split(' ')
              .map(namePart => namePart[0])
              .join('')
              .toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Assignment Display - Icon Only */}
      <button
        type='button'
        className={cn(
          'cursor-pointer transition-colors rounded-md p-1 hover:bg-gray-50 relative z-10',
          isUpdating && 'opacity-50 pointer-events-none'
        )}
        onClick={handleClick}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        title={currentOwner ? currentOwner.full_name : 'Unassigned'}
      >
        {currentOwner ? (
          <div className='w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center'>
            <span className='text-xs font-medium text-orange-800'>
              {currentOwner.full_name
                .split(' ')
                .map(namePart => namePart[0])
                .join('')
                .toUpperCase()}
            </span>
          </div>
        ) : (
          <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center'>
            <User className='w-3 h-3 text-gray-400' />
          </div>
        )}
      </button>

      {/* User Selection Dropdown */}
      {showUserList && (
        <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 z-50'>
          <div className='relative z-50 max-h-96 min-w-[16rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg'>
            {/* Header */}
            <div className='p-3 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>Assign to User</h3>
                {currentOwner && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleUnassign}
                    disabled={isUpdating}
                    className='h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                  >
                    <UserX className='w-3 h-3' />
                  </Button>
                )}
              </div>
            </div>

            {/* User List */}
            <div className='p-1 max-h-64 overflow-y-auto'>
              {teamMembers.length === 0 ? (
                <div className='p-3 text-center text-sm text-gray-500'>
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
                      'hover:bg-gray-100 focus:bg-gray-100',
                      currentOwner?.id === member.id &&
                        'bg-blue-50 text-blue-900',
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
                    <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-3'>
                      {member.full_name
                        .split(' ')
                        .map(namePart => namePart[0])
                        .join('')
                        .toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className='flex-1 min-w-0 text-left'>
                      <div className='font-medium truncate'>
                        {member.full_name}
                      </div>
                      <div className='text-xs text-gray-500 truncate'>
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
