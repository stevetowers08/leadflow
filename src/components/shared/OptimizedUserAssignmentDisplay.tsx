/**
 * Optimized User Assignment Display
 * 
 * This component uses the optimized assignment hook for better performance
 * and reduced complexity.
 */

import React, { useState, useEffect, memo } from 'react';
import { User, UserPlus, UserX, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AssignmentHistoryModal } from './AssignmentHistoryModal';
import { useOptimizedAssignment } from '@/hooks/useOptimizedAssignment';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface OptimizedUserAssignmentDisplayProps {
  ownerId: string | null;
  entityId: string;
  entityType: 'company' | 'lead' | 'job';
  onAssignmentChange?: () => void;
  className?: string;
}

export const OptimizedUserAssignmentDisplay = memo<OptimizedUserAssignmentDisplayProps>(({
  ownerId,
  entityId,
  entityType,
  onAssignmentChange,
  className
}) => {
  const [showUserList, setShowUserList] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Map entityType to database table name
  const tableName = entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs';

  // Use optimized assignment hook
  const {
    ownerId: currentOwnerId,
    ownerName: currentOwnerName,
    isLoading,
    isUpdating,
    error,
    canAssign,
    assignToUser,
    refreshAssignment
  } = useOptimizedAssignment({
    entityType: tableName as 'people' | 'companies' | 'jobs',
    entityId,
    onSuccess: () => {
      onAssignmentChange?.();
      setShowUserList(false);
    },
    onError: (error) => {
      console.error('Assignment error:', error);
    },
  });

  // Fetch team members for assignment
  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .order('full_name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    if (showUserList && teamMembers.length === 0) {
      fetchTeamMembers();
    }
  }, [showUserList, teamMembers.length]);

  useEffect(() => {
    // Refresh assignment when component mounts or entityId changes
    refreshAssignment();
  }, [entityId, refreshAssignment]);

  const handleAssignment = async (userId: string | null) => {
    const success = await assignToUser(userId);
    if (success) {
      setShowUserList(false);
    }
  };

  const handleUnassign = () => {
    handleAssignment(null);
  };

  const getCurrentOwnerInfo = () => {
    if (!currentOwnerId) return null;
    return teamMembers.find(m => m.id === currentOwnerId) || {
      id: currentOwnerId,
      full_name: currentOwnerName || 'Unknown User',
      role: 'Unknown'
    };
  };

  const currentOwnerInfo = getCurrentOwnerInfo();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading assignment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <span>Error: {error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshAssignment}
          className="h-6 px-2 text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Current Assignment Display */}
      <div className="flex items-center gap-2">
        {currentOwnerId ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {currentOwnerName || 'Unknown User'}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentOwnerInfo?.role || 'Unknown'}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <UserX className="h-4 w-4" />
            <span className="text-sm">Unassigned</span>
          </div>
        )}
      </div>

      {/* Assignment Actions */}
      {canAssign && (
        <div className="flex items-center gap-1">
          {showUserList ? (
            <div className="flex items-center gap-1">
              <DropdownSelect
                options={[
                  { value: '', label: 'Unassign' },
                  ...teamMembers.map(member => ({
                    value: member.id,
                    label: `${member.full_name} (${member.role})`
                  }))
                ]}
                value={currentOwnerId || ''}
                onValueChange={(value) => handleAssignment(value || null)}
                placeholder="Select user..."
                className="min-w-[200px]"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserList(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserList(true)}
                disabled={isUpdating}
                className="h-8 px-2 text-xs"
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <UserPlus className="h-3 w-3" />
                )}
                {currentOwnerId ? 'Reassign' : 'Assign'}
              </Button>
              
              {currentOwnerId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnassign}
                  disabled={isUpdating}
                  className="h-8 px-2 text-xs text-red-500 hover:text-red-700"
                >
                  <UserX className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Assignment History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistoryModal(true)}
            className="h-8 px-2 text-xs"
          >
            <History className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Assignment History Modal */}
      {showHistoryModal && (
        <AssignmentHistoryModal
          entityType={entityType}
          entityId={entityId}
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
});

OptimizedUserAssignmentDisplay.displayName = 'OptimizedUserAssignmentDisplay';
