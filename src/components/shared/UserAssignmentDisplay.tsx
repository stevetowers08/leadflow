import React, { useState, useEffect } from 'react';
import { User, UserPlus, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  className
}) => {
  const [assignedUser, setAssignedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  // Check if user can assign
  const canAssign = hasRole('admin') || hasRole('owner') || true; // Temporarily always true for testing


  // Fetch assigned user details
  useEffect(() => {
    if (!ownerId) {
      setAssignedUser(null);
      return;
    }

    const fetchAssignedUser = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, role')
          .eq('id', ownerId)
          .single();

        if (error) throw error;
        setAssignedUser(data);
      } catch (error) {
        console.error('Error fetching assigned user:', error);
        setAssignedUser(null);
      }
    };

    fetchAssignedUser();
  }, [ownerId]);

  // Fetch team members for assignment
  const fetchTeamMembers = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members automatically when component mounts
  useEffect(() => {
    if (canAssign) {
      fetchTeamMembers();
    }
  }, [canAssign]);

  const handleAssign = async (newOwnerId: string) => {
    if (!canAssign) return;
    
    const newOwner = teamMembers.find(m => m.id === newOwnerId);
    const currentOwner = assignedUser?.full_name;
    
    // Confirmation dialog
    const confirmMessage = currentOwner 
      ? `Are you sure you want to reassign this ${entityType} from ${currentOwner} to ${newOwner?.full_name}?`
      : `Are you sure you want to assign this ${entityType} to ${newOwner?.full_name}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setIsAssigning(true);
    try {
      const tableName = entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs';
      const { error } = await supabase
        .from(tableName)
        .update({ owner_id: newOwnerId })
        .eq('id', entityId);

      if (error) throw error;
      
      onAssignmentChange?.();
      setShowUserList(false);
    } catch (error) {
      console.error('Error assigning user:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async () => {
    if (!canAssign) return;
    
    const currentOwner = assignedUser?.full_name;
    
    // Confirmation dialog
    const confirmMessage = `Are you sure you want to unassign ${currentOwner} from this ${entityType}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setIsAssigning(true);
    try {
      const tableName = entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs';
      const { error } = await supabase
        .from(tableName)
        .update({ owner_id: null })
        .eq('id', entityId);

      if (error) throw error;
      
      onAssignmentChange?.();
    } catch (error) {
      console.error('Error unassigning user:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClick = () => {
    if (!canAssign) return;
    
    // If team members haven't been fetched yet, fetch them
    if (teamMembers.length === 0) {
      fetchTeamMembers();
    }
    
    setShowUserList(!showUserList);
  };


  if (!canAssign) {
    // Read-only view
    if (!assignedUser) {
      return (
        <div className={cn("flex items-center gap-2 text-gray-400", className)}>
          <User className="w-4 h-4" />
          <span className="text-sm">Unassigned</span>
        </div>
      );
    }

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-3 h-3 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{assignedUser.full_name}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Assignment Display - Match pipeline stage badge design */}
      <div 
        className={cn(
          "w-40 px-3 py-2 rounded-md text-sm font-medium h-10 flex items-center justify-center cursor-pointer transition-colors border",
          assignedUser 
            ? "bg-green-50 border-green-200 hover:bg-green-100 text-green-800" 
            : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
      >
        {assignedUser ? (
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate text-sm">{assignedUser.full_name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Assign User</span>
          </div>
        )}
      </div>

      {/* User Selection Dropdown - Match Select component design */}
      {showUserList && (
        <div className="absolute top-full left-0 mt-1 w-64 z-50">
          <div className="relative z-50 max-h-96 min-w-[16rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            {/* Header */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Assign to User</h3>
                {assignedUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUnassign}
                    disabled={isAssigning}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserX className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* User List */}
            <div className="p-1 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Loading team members...
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  No team members found
                </div>
              ) : (
                teamMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleAssign(member.id)}
                    disabled={isAssigning}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
                      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      assignedUser?.id === member.id && "bg-accent text-accent-foreground",
                      isAssigning && "opacity-50 pointer-events-none"
                    )}
                  >
                    {/* Check indicator for current assignment */}
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {assignedUser?.id === member.id && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </span>
                    
                    {/* User Avatar */}
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-3">
                      {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-medium truncate">{member.full_name}</div>
                      <div className="text-xs text-muted-foreground truncate">{member.role}</div>
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
