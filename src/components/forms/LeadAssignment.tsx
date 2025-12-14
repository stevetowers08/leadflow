import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Users, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { AssignmentService, TeamMember } from '@/services/assignmentService';
import { AssignmentErrorBoundary } from '@/components/shared/ErrorBoundary';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { UserSelector } from '@/components/shared/UserSelector';

interface LeadAssignmentProps {
  leadId: string;
  currentOwner?: string | null;
  leadName?: string;
  onAssignmentChange?: (newOwner: string | null) => void;
}

const LeadAssignmentComponent = ({
  leadId,
  currentOwner,
  leadName,
  onAssignmentChange,
}: LeadAssignmentProps) => {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(
    currentOwner || null
  );
  const { startTiming, endTiming } = usePerformanceMonitoring('LeadAssignment');
  const [isAssigning, setIsAssigning] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  // Fetch team members from user_profiles table
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await AssignmentService.getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load team members',
          variant: 'destructive',
        });
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  const handleAssignment = async (newOwnerId: string | null) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to assign leads',
        variant: 'destructive',
      });
      return;
    }

    setIsAssigning(true);
    try {
      const result = await AssignmentService.assignEntity(
        'leads',
        leadId,
        newOwnerId,
        user.id
      );

      if (result.success) {
        setSelectedOwner(newOwnerId);
        onAssignmentChange?.(result.data?.ownerName || null);
        toast({
          title: 'Assignment Updated',
          description: result.message,
        });
      } else {
        toast({
          title: 'Assignment Failed',
          description: result.error || 'Failed to update lead assignment',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast({
        title: 'Assignment Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = () => {
    handleAssignment(null);
  };

  const getCurrentOwnerInfo = () => {
    if (!currentOwner) return null;
    return (
      teamMembers.find(member => member.full_name === currentOwner) || {
        id: 'unknown',
        full_name: currentOwner,
        role: 'Unknown',
      }
    );
  };

  const currentOwnerInfo = getCurrentOwnerInfo();

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Users className='h-4 w-4 text-muted-foreground' />
        <span className='text-sm font-medium'>Outreach Assignment</span>
      </div>

      {/* Current Assignment Display */}
      {currentOwnerInfo ? (
        <div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg border'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium'>
              {currentOwnerInfo.full_name
                .split(' ')
                .map(namePart => namePart[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <div className='font-medium text-sm'>
                {currentOwnerInfo.full_name}
              </div>
              {currentOwnerInfo.role && (
                <div className='text-xs text-muted-foreground'>
                  {currentOwnerInfo.role}
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <StatusBadge status='Assigned' size='sm' />
            <Button
              variant='ghost'
              size='sm'
              onClick={handleUnassign}
              disabled={isAssigning}
              className='text-muted-foreground hover:text-destructive'
            >
              <UserX className='w-4 h-4' />
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg'>
          <div className='text-center text-muted-foreground'>
            <User className='w-8 h-8 mx-auto mb-2 opacity-50' />
            <div className='text-sm'>Unassigned</div>
            <div className='text-xs'>This lead is not assigned to anyone</div>
          </div>
        </div>
      )}

      {/* Quick Self-Assignment */}
      {user && !currentOwnerInfo && (
        <div className='space-y-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleAssignment(user.id)}
            disabled={isAssigning}
            className='w-full'
          >
            <UserCheck className='w-4 h-4 mr-2' />
            Assign to Me
          </Button>
        </div>
      )}

      {/* Assignment Selector */}
      <div className='space-y-2'>
        <UserSelector
          value={selectedOwner || undefined}
          onValueChange={value => handleAssignment(value === '' ? null : value)}
          placeholder={
            loadingMembers
              ? 'Loading team members...'
              : 'Assign to team member...'
          }
          disabled={isAssigning || loadingMembers}
          showUnassignOption={true}
        />
      </div>

      {/* Team Overview */}
      <div className='pt-2 border-t'>
        <div className='text-xs font-medium text-muted-foreground mb-2'>
          Team Members
        </div>
        {loadingMembers ? (
          <div className='text-center text-muted-foreground text-sm py-4'>
            Loading team members...
          </div>
        ) : (
          <div className='grid grid-cols-3 gap-2'>
            {teamMembers.slice(0, 6).map(member => {
              const isAssigned =
                currentOwnerInfo?.full_name === member.full_name;
              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-2 p-2 rounded border transition-colors cursor-pointer hover:bg-muted/50 ${
                    isAssigned ? 'bg-sidebar-primary/10' : ''
                  }`}
                  onClick={() => handleAssignment(member.id)}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      isAssigned
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {member.full_name
                      .split(' ')
                      .map(namePart => namePart[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className='text-xs truncate'>
                    {member.full_name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Export with error boundary wrapper
export const LeadAssignment = (props: LeadAssignmentProps) => {
  return (
    <AssignmentErrorBoundary>
      <LeadAssignmentComponent {...props} />
    </AssignmentErrorBoundary>
  );
};
