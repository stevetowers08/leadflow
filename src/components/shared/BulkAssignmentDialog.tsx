import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AssignmentService,
  TeamMember,
  BulkAssignmentResult,
} from '@/services/assignmentService';
import { useAuth } from '@/contexts/AuthContext';

interface BulkAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'people' | 'companies' | 'jobs';
  entityIds: string[];
  entityNames: string[];
  onAssignmentComplete: () => void;
}

export const BulkAssignmentDialog: React.FC<BulkAssignmentDialogProps> = ({
  isOpen,
  onClose,
  entityType,
  entityIds,
  entityNames,
  onAssignmentComplete,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] =
    useState<BulkAssignmentResult | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const entityTypeLabel =
    entityType === 'people'
      ? 'leads'
      : entityType === 'companies'
        ? 'companies'
        : 'jobs';
  const entityCount = entityIds.length;

  useEffect(() => {
    if (isOpen) {
      loadTeamMembers();
    }
  }, [isOpen]);

  const loadTeamMembers = async () => {
    try {
      setLoadingMembers(true);
      const members = await AssignmentService.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive',
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleBulkAssignment = async () => {
    if (!selectedOwnerId || !user) {
      toast({
        title: 'Error',
        description: 'Please select a user to assign to',
        variant: 'destructive',
      });
      return;
    }

    setIsAssigning(true);
    setAssignmentResult(null);

    try {
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        entityType,
        selectedOwnerId,
        user.id
      );

      setAssignmentResult(result);

      if (result.success) {
        toast({
          title: 'Assignment Complete',
          description: `Successfully assigned ${result.updated_count} of ${result.total_requested} ${entityTypeLabel}`,
        });

        if (result.invalid_entities.length > 0) {
          toast({
            title: 'Warning',
            description: `${result.invalid_entities.length} ${entityTypeLabel} could not be assigned`,
            variant: 'destructive',
          });
        }

        onAssignmentComplete();
      } else {
        toast({
          title: 'Assignment Failed',
          description: result.errors?.[0] || 'Failed to assign entities',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      toast({
        title: 'Assignment Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedOwnerId('');
    setAssignmentResult(null);
    onClose();
  };

  const getSelectedOwnerName = () => {
    const owner = teamMembers.find(member => member.id === selectedOwnerId);
    return owner?.full_name || 'Unknown User';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Bulk Assignment
          </DialogTitle>
          <DialogDescription>
            Assign {entityCount} {entityTypeLabel} to a team member
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Entity List Preview */}
          <div className='space-y-2'>
            <div className='text-sm font-medium'>
              Selected {entityTypeLabel}:
            </div>
            <div className='max-h-32 overflow-y-auto space-y-1'>
              {entityNames.slice(0, 10).map((name, index) => (
                <div
                  key={index}
                  className='text-sm text-muted-foreground truncate'
                >
                  {name}
                </div>
              ))}
              {entityNames.length > 10 && (
                <div className='text-sm text-muted-foreground'>
                  ... and {entityNames.length - 10} more
                </div>
              )}
            </div>
            <Badge variant='secondary' className='text-xs'>
              {entityCount} {entityTypeLabel}
            </Badge>
          </div>

          {/* Assignment Result */}
          {assignmentResult && (
            <Alert
              className={
                assignmentResult.success
                  ? 'border-green-200 bg-success/10'
                  : 'border-red-200 bg-destructive/10'
              }
            >
              <div className='flex items-center gap-2'>
                {assignmentResult.success ? (
                  <CheckCircle className='h-4 w-4 text-success' />
                ) : (
                  <XCircle className='h-4 w-4 text-destructive' />
                )}
                <AlertDescription
                  className={
                    assignmentResult.success ? 'text-success' : 'text-destructive'
                  }
                >
                  {assignmentResult.success ? (
                    <>
                      Successfully assigned {assignmentResult.updated_count} of{' '}
                      {assignmentResult.total_requested} {entityTypeLabel}
                      {assignmentResult.invalid_entities.length > 0 && (
                        <div className='text-sm mt-1'>
                          {assignmentResult.invalid_entities.length}{' '}
                          {entityTypeLabel} could not be assigned
                        </div>
                      )}
                    </>
                  ) : (
                    assignmentResult.errors?.[0] || 'Assignment failed'
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* User Selection */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Assign to:</label>
            <Select
              value={selectedOwnerId}
              onValueChange={setSelectedOwnerId}
              disabled={isAssigning || loadingMembers}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingMembers
                      ? 'Loading team members...'
                      : 'Select team member...'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
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
                        <span className='font-medium'>{member.full_name}</span>
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

          {/* Assignment Preview */}
          {selectedOwnerId && (
            <div className='p-3 bg-muted/20 rounded-lg border'>
              <div className='flex items-center gap-2 text-sm'>
                <UserCheck className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>
                  Will assign {entityCount} {entityTypeLabel} to
                </span>
                <span className='font-medium'>{getSelectedOwnerName()}</span>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {isAssigning && (
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-sidebar-primary'></div>
                Assigning {entityTypeLabel}...
              </div>
              <Progress value={undefined} className='h-2' />
            </div>
          )}

          {/* Warning for Large Batches */}
          {entityCount > 50 && (
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                You are assigning a large number of {entityTypeLabel}. This
                operation may take a moment to complete.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkAssignment}
            disabled={!selectedOwnerId || isAssigning || loadingMembers}
            className='min-w-[100px]'
          >
            {isAssigning ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Assigning...
              </>
            ) : (
              <>
                <UserCheck className='h-4 w-4 mr-2' />
                Assign {entityCount} {entityTypeLabel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
