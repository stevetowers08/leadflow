import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import { CheckCircle2, Clock } from 'lucide-react';
import React, { useState } from 'react';

interface JobQualificationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onQualified: () => void;
}

export const JobQualificationModal: React.FC<JobQualificationModalProps> = ({
  job,
  isOpen,
  onClose,
  onQualified,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>('new');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!job || !user) return;

    setLoading(true);
    try {
      // Update job qualification status
      const updateData: Record<string, string | null> = {
        qualification_status: status,
        qualified_at: status === 'qualify' ? new Date().toISOString() : null,
        qualified_by: status === 'qualify' ? user.id : null,
        qualification_notes: notes || null,
      };

      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', job.id);

      if (error) throw error;

      // If job is qualified, trigger webhook for company enrichment
      if (status === 'qualify') {
        try {
          const { error: webhookError } = await supabase.functions.invoke(
            'job-qualification-webhook',
            {
              body: {
                job_id: job.id,
                qualification_status: status,
              },
            }
          );

          if (webhookError) {
            console.warn('Webhook trigger failed:', webhookError);
            // Don't fail the entire operation if webhook fails
          } else {
            console.log('Job qualification webhook triggered successfully');
          }
        } catch (webhookError) {
          console.warn('Error triggering webhook:', webhookError);
          // Don't fail the entire operation if webhook fails
        }
      }

      toast({
        title: 'Success',
        description: `Job marked as ${status.replace('_', ' ')}${status === 'qualify' ? ' - Company enrichment triggered' : ''}`,
      });

      onQualified();
      onClose();
      setNotes('');
      setStatus('new');
    } catch (error) {
      console.error('Error qualifying job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job qualification',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    {
      value: 'new',
      label: 'New',
      description: 'New job awaiting review',
      dotColor: 'bg-blue-500',
    },
    {
      value: 'qualify',
      label: 'Qualify',
      description: 'This job meets our criteria',
      dotColor: 'bg-green-500',
    },
    {
      value: 'skip',
      label: 'Skip',
      description: 'Skip this job for now',
      dotColor: 'bg-red-500',
    },
  ];

  const selectedOption = statusOptions.find(opt => opt.value === status);

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Qualify Job</DialogTitle>
          <DialogDescription>
            Review and qualify this job posting
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Job Info */}
          <div className='rounded-lg bg-gray-50 p-4 space-y-2'>
            <h4 className='font-semibold text-gray-900'>{job.title}</h4>
            <p className='text-sm text-gray-600'>
              {job.companies?.name || 'Unknown Company'}
            </p>
            {job.location && (
              <p className='text-sm text-gray-500'>📍 {job.location}</p>
            )}
          </div>

          {/* Qualification Status */}
          <div className='space-y-2'>
            <Label htmlFor='status'>Qualification Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id='status'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => {
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className='flex items-center gap-3 py-2'>
                        <div
                          className={`w-2 h-2 rounded-full ${option.dotColor}`}
                        ></div>
                        <div>
                          <div className='text-xs font-medium text-gray-900'>
                            {option.label}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedOption && (
              <p className='text-sm text-gray-500 flex items-center gap-1'>
                <div
                  className={`w-2 h-2 rounded-full ${selectedOption.dotColor}`}
                ></div>
                {selectedOption.description}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className='space-y-2'>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              placeholder='Add any notes about this qualification...'
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className='resize-none'
            />
            <p className='text-xs text-gray-500'>
              These notes will be saved with the qualification
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={loading}
            type='button'
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} type='button'>
            {loading ? (
              <>
                <Clock className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className='mr-2 h-4 w-4' />
                Save Qualification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
