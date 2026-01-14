import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { AssignmentService } from '@/services/assignmentService';
import { formatDistanceToNow } from 'date-fns';

interface AssignmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'people' | 'companies';
  entityId: string;
  entityName: string;
}

interface AssignmentHistoryEntry {
  id: string;
  old_owner_id: string | null;
  new_owner_id: string | null;
  assigned_by: string;
  assigned_at: string;
  notes: string | null;
  old_owner: { full_name: string } | null;
  new_owner: { full_name: string } | null;
  assigned_by_user: { full_name: string } | null;
}

export const AssignmentHistoryModal: React.FC<AssignmentHistoryModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
}) => {
  const [history, setHistory] = useState<AssignmentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAssignmentHistory();
    }
  }, [isOpen, entityId]);

  const loadAssignmentHistory = async () => {
    setLoading(true);
    try {
      const historyData = await AssignmentService.getAssignmentHistory(
        entityType,
        entityId
      );
      setHistory(historyData as unknown as AssignmentHistoryEntry[]);
    } catch (error) {
      console.error('Error loading assignment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentIcon = (entry: AssignmentHistoryEntry) => {
    if (entry.old_owner_id && entry.new_owner_id) {
      return <RefreshCw className='h-4 w-4 text-primary' />;
    } else if (entry.new_owner_id) {
      return <UserCheck className='h-4 w-4 text-success' />;
    } else {
      return <UserX className='h-4 w-4 text-warning' />;
    }
  };

  const getAssignmentDescription = (entry: AssignmentHistoryEntry) => {
    if (entry.old_owner_id && entry.new_owner_id) {
      return `Reassigned from ${entry.old_owner?.full_name || 'Unknown'} to ${entry.new_owner?.full_name || 'Unknown'}`;
    } else if (entry.new_owner_id) {
      return `Assigned to ${entry.new_owner?.full_name || 'Unknown'}`;
    } else {
      return `Unassigned from ${entry.old_owner?.full_name || 'Unknown'}`;
    }
  };

  const getAssignmentBadgeVariant = (entry: AssignmentHistoryEntry) => {
    if (entry.old_owner_id && entry.new_owner_id) {
      return 'default';
    } else if (entry.new_owner_id) {
      return 'default';
    } else {
      return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Assignment History
          </DialogTitle>
          <DialogDescription>
            Assignment history for {entityName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[400px]'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Loading assignment history...
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <Users className='h-8 w-8 mx-auto mb-2 opacity-50' />
              <p>No assignment history found</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {history.map((entry, index) => (
                <Card key={entry.id} className='border-l-4 border-l-blue-200'>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 mt-1'>
                        {getAssignmentIcon(entry)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <Badge
                            variant={getAssignmentBadgeVariant(entry)}
                            className='text-xs'
                          >
                            {entry.old_owner_id && entry.new_owner_id
                              ? 'Reassigned'
                              : entry.new_owner_id
                                ? 'Assigned'
                                : 'Unassigned'}
                          </Badge>
                          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            {formatDistanceToNow(new Date(entry.assigned_at), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                        <p className='text-sm font-medium text-foreground mb-1'>
                          {getAssignmentDescription(entry)}
                        </p>
                        {entry.assigned_by_user && (
                          <p className='text-xs text-muted-foreground'>
                            Assigned by {entry.assigned_by_user.full_name}
                          </p>
                        )}
                        {entry.notes && (
                          <p className='text-xs text-muted-foreground mt-1 italic'>
                            "{entry.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className='flex justify-end'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
