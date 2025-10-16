import React, { useState, useEffect } from 'react';
import { User, UserPlus, UserX, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AssignmentHistoryModal } from './AssignmentHistoryModal';
import { useAssignmentState } from '@/hooks/useAssignmentState';
import { useAssignmentRefresh } from '@/hooks/useAssignmentRefresh';

interface UserAssignmentDisplayProps {
  ownerId: string | null;
  entityId: string;
  entityType: 'company' | 'lead' | 'job';
  onAssignmentChange?: () => void;
  className?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export const UserAssignmentDisplay: React.FC<UserAssignmentDisplayProps> = ({
  ownerId,
  entityId,
  entityType,
  onAssignmentChange,
  className,
}) => {
  const [showUserList, setShowUserList] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { user } = useAuth();
  const permissionsContext = usePermissions();
  const { hasRole, loading: permissionsLoading } = permissionsContext;
  const { refreshAssignmentLists, refreshSpecificEntity } =
    useAssignmentRefresh();

  // Map entityType to database table name
  const tableName =
    entityType === 'lead'
      ? 'people'
      : entityType === 'company'
        ? 'companies'
        : 'jobs';

  // Use unified assignment state management
  const {
    ownerId: currentOwnerId,
    ownerName: currentOwnerName,
    isLoading,
    isUpdating,
    error,
    canAssign,
    assignToUser,
  } = useAssignmentState({
    entityType: tableName as 'people' | 'companies' | 'jobs',
    entityId,
    onSuccess: () => {
      // Trigger refresh of all assignment lists
      refreshAssignmentLists();
      // Also refresh specific entity
      refreshSpecificEntity(
        tableName as 'people' | 'companies' | 'jobs',
        entityId
      );
      // Call the original callback
      onAssignmentChange?.();
      setShowUserList(false);
    },
    onError: error => {
      console.error('Assignment error:', error);
    },
  });

  // Load team members when user list is shown
  useEffect(() => {
    if (showUserList) {
      loadTeamMembers();
    }
  }, [showUserList]);

  // Fetch team members automatically when component mounts
  useEffect(() => {
    if (canAssign) {
      fetchTeamMembers();
    }
  }, [canAssign]);

  // Don't render anything while permissions are loading
  if (permissionsLoading) {
    return (
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-sidebar-primary'></div>
        Loading permissions...
      </div>
    );
  }

  // Debug logging
  console.log('🔍 UserAssignmentDisplay Debug:', {
    entityType,
    tableName,
    entityId,
    canAssign,
    isLoading,
    isUpdating,
    error,
    currentOwnerId,
    currentOwnerName,
    teamMembersCount: teamMembers.length,
    permissionsLoading,
    userRole: permissionsContext?.userRole || 'unknown',
  });

  // Fetch team members for assignment
  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        console.error('❌ Error fetching team members:', error);
        throw error;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error('❌ Error fetching team members:', error);
    }
  };

  const handleAssign = async (newOwnerId: string) => {
    if (!canAssign) return;

    const newOwner = teamMembers.find(member => member.id === newOwnerId);
    const currentOwner = currentOwnerName;

    // Confirmation dialog
    const confirmMessage = currentOwner
      ? `Are you sure you want to reassign this ${entityType} from ${currentOwner} to ${newOwner?.full_name}?`
      : `Are you sure you want to assign this ${entityType} to ${newOwner?.full_name}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    assignToUser(newOwnerId);
  };

  const handleUnassign = async () => {
    if (!canAssign) return;

    const currentOwner = currentOwnerName;

    // Confirmation dialog
    const confirmMessage = `Are you sure you want to unassign ${currentOwner} from this ${entityType}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    assignToUser(null);
  };

  const handleClick = () => {
    console.log('🔍 Assignment Click Debug:', {
      canAssign,
      teamMembersCount: teamMembers.length,
      showUserList,
      entityType,
      entityId,
    });

    if (!canAssign) {
      console.log('❌ Cannot assign - permission denied');
      return;
    }

    // If team members haven't been fetched yet, fetch them
    if (teamMembers.length === 0) {
      console.log('🔄 Fetching team members...');
      fetchTeamMembers();
    }

    setShowUserList(!showUserList);
  };

  if (!canAssign) {
    // Read-only view
    if (isLoading) {
      return (
        <div className={cn('flex items-center gap-2 text-gray-400', className)}>
          <User className='w-4 h-4 animate-pulse' />
          <span className='text-sm'>Loading...</span>
        </div>
      );
    }

    if (!currentOwnerId) {
      return (
        <div className={cn('flex items-center gap-2 text-gray-400', className)}>
          <User className='w-4 h-4' />
          <span className='text-sm'>Unassigned</span>
        </div>
      );
    }

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
          <User className='w-3 h-3 text-blue-600' />
        </div>
        <span className='text-sm font-medium text-gray-700'>
          {currentOwnerName || 'Loading...'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Assignment Display - Match pipeline stage badge design */}
      <div
        className={cn(
          'px-2 py-1 rounded-md text-xs font-medium h-8 flex items-center justify-center cursor-pointer transition-colors border',
          currentOwnerId
            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800'
            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600',
          isUpdating && 'opacity-50 pointer-events-none'
        )}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
      >
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <User className='w-4 h-4 flex-shrink-0 animate-pulse' />
            <span className='text-sm'>Loading...</span>
          </div>
        ) : currentOwnerId ? (
          <div className='flex items-center gap-2 min-w-0'>
            <User className='w-4 h-4 flex-shrink-0' />
            <span className='truncate text-sm'>
              {currentOwnerName || 'Loading...'}
            </span>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <UserPlus className='w-4 h-4 flex-shrink-0' />
            <span className='text-sm'>Assign User</span>
          </div>
        )}
      </div>

      {/* User Selection Dropdown - Match Select component design */}
      {showUserList && (
        <div className='absolute top-full left-0 mt-1 w-64 z-50'>
          <div className='relative z-50 max-h-96 min-w-[16rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2'>
            {/* Header */}
            <div className='p-3 border-b border-border'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>Assign to User</h3>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowHistoryModal(true)}
                    className='h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    title='View assignment history'
                  >
                    <History className='w-3 h-3' />
                  </Button>
                  {currentOwnerId && (
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
                      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
                      'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                      currentOwnerId === member.id &&
                        'bg-accent text-accent-foreground',
                      isUpdating && 'opacity-50 pointer-events-none'
                    )}
                  >
                    {/* Check indicator for current assignment */}
                    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
                      {currentOwnerId === member.id && (
                        <div className='h-2 w-2 rounded-full bg-sidebar-primary' />
                      )}
                    </span>

                    {/* User Avatar */}
                    <div className='w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-3'>
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

      {/* Assignment History Modal */}
      <AssignmentHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        entityType={tableName as 'people' | 'companies' | 'jobs'}
        entityId={entityId}
        entityName={`${entityType} ${entityId}`}
      />
    </div>
  );
};
