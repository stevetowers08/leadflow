/**
 * Campaign Sequence Builder - 2025 Best Practices
 * Modern, accessible, and user-friendly campaign builder
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Page } from '@/design-system/components';
import {
  useCampaignSteps,
  useCampaignSequences,
} from '@/hooks/useCampaignSequences';
import { CampaignSequence, CampaignStep } from '@/types/campaign.types';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Eye,
  GitBranch,
  Mail,
  Pause,
  Pencil,
  Play,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import StepCreationModal from './StepCreationModal';
import WaitStepConfig from './WaitStepConfig';

interface Props {
  sequence: CampaignSequence;
  onClose: () => void;
}

export default function SmartleadStyleSequenceBuilder({
  sequence,
  onClose,
}: Props) {
  const { steps, isLoading, addStep, updateStep, deleteStep, reorderSteps } =
    useCampaignSteps(sequence.id);
  const { updateSequence } = useCampaignSequences();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<string | null>(null);
  const [pauseOnReply, setPauseOnReply] = useState(
    sequence.pause_on_reply ?? true
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(sequence.name);

  useEffect(() => {
    setEditedName(sequence.name);
  }, [sequence.name]);

  const selectedStep = useMemo(
    () => steps.find(s => s.id === selectedStepId),
    [steps, selectedStepId]
  );

  const handlePauseOnReplyToggle = useCallback(
    async (checked: boolean) => {
      setPauseOnReply(checked);
      try {
        await updateSequence.mutateAsync({
          id: sequence.id,
          updates: { pause_on_reply: checked },
        });
        toast.success('Settings updated', {
          description: 'Auto-pause on reply setting saved',
        });
      } catch (error) {
        toast.error('Failed to update settings');
        setPauseOnReply(!checked);
      }
    },
    [sequence.id, updateSequence]
  );

  const handleAddStep = useCallback(
    async (type: 'email' | 'wait' | 'condition') => {
      try {
        const newStep = await addStep.mutateAsync(type);
        if (newStep) {
          setSelectedStepId(newStep.id);
          toast.success('Step added', {
            description: `New ${type} step added to sequence`,
          });
        }
      } catch (error) {
        toast.error('Failed to add step');
      }
    },
    [addStep]
  );

  const handleStepModalSelect = useCallback(
    (stepType: 'email' | 'wait' | 'condition') => {
      handleAddStep(stepType);
    },
    [handleAddStep]
  );

  const handleMoveStep = useCallback(
    async (stepId: string, direction: 'up' | 'down') => {
      const currentIndex = steps.findIndex(s => s.id === stepId);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= steps.length) return;

      const newSteps = [...steps];
      const [movedStep] = newSteps.splice(currentIndex, 1);
      newSteps.splice(newIndex, 0, movedStep);

      const reorderedSteps = newSteps.map((step, index) => ({
        ...step,
        order_position: index + 1,
      }));

      try {
        await reorderSteps.mutateAsync(reorderedSteps);
        toast.success('Step moved', {
          description: `Step moved ${direction}`,
        });
      } catch (error) {
        toast.error('Failed to reorder step');
      }
    },
    [steps, reorderSteps]
  );

  const handleDeleteClick = useCallback((stepId: string) => {
    setStepToDelete(stepId);
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!stepToDelete) return;

    try {
      await deleteStep.mutateAsync(stepToDelete);
      if (selectedStepId === stepToDelete) {
        setSelectedStepId(null);
      }
      toast.success('Step deleted', {
        description: 'Step removed from sequence',
      });
    } catch (error) {
      toast.error('Failed to delete step');
    } finally {
      setShowDeleteDialog(false);
      setStepToDelete(null);
    }
  }, [stepToDelete, selectedStepId, deleteStep]);

  const handleNameSave = useCallback(async () => {
    if (editedName.trim() && editedName !== sequence.name) {
      try {
        await updateSequence.mutateAsync({
          id: sequence.id,
          updates: { name: editedName.trim() },
        });
        toast.success('Sequence name updated');
      } catch (error) {
        toast.error('Failed to update sequence name');
        setEditedName(sequence.name);
      }
    } else {
      setEditedName(sequence.name);
    }
    setIsEditingName(false);
  }, [editedName, sequence.name, sequence.id, updateSequence]);

  const getStepIcon = useCallback((stepType: string) => {
    switch (stepType) {
      case 'email':
        return <Mail className='w-4 h-4' />;
      case 'wait':
        return <Clock className='w-4 h-4' />;
      case 'condition':
        return <GitBranch className='w-4 h-4' />;
      default:
        return <Mail className='w-4 h-4' />;
    }
  }, []);

  const getStepTitle = useCallback((step: CampaignStep, index: number) => {
    switch (step.step_type) {
      case 'email':
        return `Email Follow Up ${index + 1}`;
      case 'wait':
        return `Wait Step ${index + 1}`;
      case 'condition':
        return `Condition Step ${index + 1}`;
      default:
        return `Step ${index + 1}`;
    }
  }, []);

  const getStepDescription = useCallback((step: CampaignStep) => {
    switch (step.step_type) {
      case 'email':
        return {
          type: 'Email',
          detail: `Subject: ${step.email_subject || '----'}`,
        };
      case 'wait':
        return {
          type: 'Wait',
          detail: `Wait for ${step.wait_duration || 1} ${step.wait_unit || 'day'} then`,
        };
      case 'condition':
        return {
          type: 'Condition',
          detail: `Title: ${step.name || '----'}`,
        };
      default:
        return {
          type: 'Unknown',
          detail: '----',
        };
    }
  }, []);

  if (isLoading) {
    return (
      <Page title='Campaign Builder' loading={true}>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading campaign steps...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <div className='h-full flex flex-col bg-background overflow-hidden'>
      {/* Header */}
      <div className='bg-card border-b border-border px-6 py-4 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='text-muted-foreground hover:text-foreground'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
            <div className='h-8 w-px bg-border' />
            {isEditingName ? (
              <Input
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  } else if (e.key === 'Escape') {
                    setEditedName(sequence.name);
                    setIsEditingName(false);
                  }
                }}
                className='text-xl font-semibold h-8 px-2'
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className='flex items-center gap-2 group hover:bg-muted/50 rounded px-2 py-1 -ml-2 transition-colors'
                aria-label='Edit sequence name'
              >
                <h1 className='text-xl font-semibold text-foreground'>
                  {sequence.name || 'Untitled Campaign'}
                </h1>
                <Pencil className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
              </button>
            )}
            <Badge variant='secondary' className='capitalize'>
              {sequence.status}
            </Badge>
          </div>

          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm'>
              <Save className='w-4 h-4 mr-2' />
              Save
            </Button>
            <Button size='sm'>
              {sequence.status === 'active' ? (
                <>
                  <Pause className='w-4 h-4 mr-2' />
                  Pause
                </>
              ) : (
                <>
                  <Play className='w-4 h-4 mr-2' />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Row */}
      <div className='px-6 py-3 bg-muted/50 border-b border-border flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <Label className='text-sm font-medium text-foreground'>
            Campaign Settings
          </Label>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Switch
                id='pause-on-reply'
                checked={pauseOnReply}
                onCheckedChange={handlePauseOnReplyToggle}
              />
              <Label
                htmlFor='pause-on-reply'
                className='text-sm text-muted-foreground cursor-pointer'
              >
                Auto-pause on reply
              </Label>
            </div>
            <div className='text-xs text-muted-foreground'>
              {pauseOnReply
                ? 'Sequence will pause when someone replies'
                : 'Sequence will continue even after replies'}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-1 min-h-0 overflow-hidden'>
        {/* Left Panel - Vertical Timeline */}
        <div className='w-80 bg-muted/30 border-r border-border p-6 overflow-y-auto flex-shrink-0'>
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <Button
                onClick={() => setShowStepModal(true)}
                className='flex items-center gap-2'
              >
                <Plus className='w-4 h-4' />
                Add Step
              </Button>
            </div>

            <div className='relative'>
              <div className='absolute left-6 top-0 bottom-0 w-px bg-border' />

              <div className='space-y-4'>
                {steps.map((step, index) => {
                  const description = getStepDescription(step);
                  const isLast = index === steps.length - 1;
                  const isSelected = selectedStepId === step.id;

                  return (
                    <div key={step.id} className='relative'>
                      <div className='absolute left-4 top-4 w-4 h-4 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center z-10'>
                        {getStepIcon(step.step_type)}
                      </div>

                      <Card
                        className={`ml-12 cursor-pointer transition-all ${
                          isSelected
                            ? 'ring-2 ring-primary border-primary'
                            : 'hover:border-border/60'
                        }`}
                        onClick={() => setSelectedStepId(step.id)}
                      >
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='text-sm font-medium text-foreground mb-2'>
                                {getStepTitle(step, index)}
                              </h3>

                              <div className='bg-muted rounded p-3 text-xs text-muted-foreground'>
                                <div className='font-medium'>
                                  {description.type}
                                </div>
                                <div className='mt-1 truncate'>
                                  {description.detail}
                                </div>
                              </div>
                            </div>

                            <div className='flex items-center gap-1 ml-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleMoveStep(step.id, 'up');
                                }}
                                disabled={index === 0}
                                className='p-1 h-6 w-6'
                                aria-label='Move step up'
                              >
                                <ChevronUp className='w-3 h-3' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleMoveStep(step.id, 'down');
                                }}
                                disabled={index === steps.length - 1}
                                className='p-1 h-6 w-6'
                                aria-label='Move step down'
                              >
                                <ChevronDown className='w-3 h-3' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteClick(step.id);
                                }}
                                className='p-1 h-6 w-6 text-destructive hover:text-destructive'
                                aria-label='Delete step'
                              >
                                <Trash2 className='w-3 h-3' />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {!isLast && (
                        <div className='absolute left-6 top-16 w-px h-4 bg-border' />
                      )}
                    </div>
                  );
                })}

                {steps.length === 0 && (
                  <div className='text-center py-8 text-muted-foreground'>
                    <p className='text-sm'>No steps yet</p>
                    <p className='text-xs'>
                      Add your first step to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Step Editor */}
        <div className='flex-1 bg-background min-w-0 overflow-hidden'>
          {selectedStep ? (
            <div className='h-full flex flex-col overflow-hidden'>
              <div className='border-b border-border px-6 py-4 flex-shrink-0'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-foreground'>
                    {getStepTitle(
                      selectedStep,
                      steps.findIndex(s => s.id === selectedStep.id)
                    )}
                  </h2>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm'>
                      <Eye className='w-4 h-4 mr-2' />
                      Preview
                    </Button>
                    <Button variant='outline' size='sm'>
                      <Copy className='w-4 h-4 mr-2' />
                      Duplicate
                    </Button>
                  </div>
                </div>
              </div>

              <div className='flex-1 p-6 space-y-6 overflow-y-auto min-h-0'>
                <div className='space-y-2'>
                  <Label htmlFor='step-name'>Step Name</Label>
                  <Input
                    id='step-name'
                    value={selectedStep.name}
                    onChange={e => {
                      updateStep.mutate({
                        id: selectedStep.id,
                        updates: { name: e.target.value },
                      });
                    }}
                    placeholder='Enter step name...'
                  />
                </div>

                {selectedStep.step_type === 'email' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='email-subject'>Subject</Label>
                      <Input
                        id='email-subject'
                        value={selectedStep.email_subject || ''}
                        onChange={e => {
                          updateStep.mutate({
                            id: selectedStep.id,
                            updates: { email_subject: e.target.value },
                          });
                        }}
                        placeholder='Hi {{first_name}}, interested in {{company}}?'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email-body'>Email Body</Label>
                      <Textarea
                        id='email-body'
                        value={selectedStep.email_body || ''}
                        onChange={e => {
                          updateStep.mutate({
                            id: selectedStep.id,
                            updates: { email_body: e.target.value },
                          });
                        }}
                        placeholder='Enter your email content here...'
                        className='min-h-[300px]'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='send-timing'>Send Timing</Label>
                      <Select
                        value={selectedStep.send_immediately || 'immediate'}
                        onValueChange={value => {
                          updateStep.mutate({
                            id: selectedStep.id,
                            updates: { send_immediately: value },
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='immediate'>
                            Send Immediately
                          </SelectItem>
                          <SelectItem value='business_hours'>
                            Send During Business Hours
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {selectedStep.step_type === 'wait' && (
                  <WaitStepConfig
                    config={{
                      duration: selectedStep.wait_duration || 1,
                      unit:
                        (selectedStep.wait_unit as
                          | 'minutes'
                          | 'hours'
                          | 'days'
                          | 'weeks') || 'days',
                      businessHoursOnly:
                        selectedStep.business_hours_only || false,
                    }}
                    onChange={config => {
                      updateStep.mutate({
                        id: selectedStep.id,
                        updates: {
                          wait_duration: config.duration,
                          wait_unit:
                            config.unit === 'minutes'
                              ? 'hours'
                              : (config.unit as 'hours' | 'days' | 'weeks'),
                          business_hours_only: config.businessHoursOnly,
                        },
                      });
                    }}
                  />
                )}

                {selectedStep.step_type === 'condition' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='condition-type'>Condition Type</Label>
                      <Select
                        value={selectedStep.condition_type || 'opened'}
                        onValueChange={value => {
                          updateStep.mutate({
                            id: selectedStep.id,
                            updates: {
                              condition_type: value as
                                | 'opened'
                                | 'clicked'
                                | 'replied'
                                | 'custom',
                            },
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='opened'>Email Opened</SelectItem>
                          <SelectItem value='clicked'>Link Clicked</SelectItem>
                          <SelectItem value='replied'>Email Replied</SelectItem>
                          <SelectItem value='bounced'>Email Bounced</SelectItem>
                          <SelectItem value='unsubscribed'>
                            Unsubscribed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='condition-wait'>
                        Wait Duration Before Checking (hours)
                      </Label>
                      <Input
                        id='condition-wait'
                        type='number'
                        value={selectedStep.condition_wait_duration || 24}
                        onChange={e => {
                          updateStep.mutate({
                            id: selectedStep.id,
                            updates: {
                              condition_wait_duration: parseInt(e.target.value),
                            },
                          });
                        }}
                        min='1'
                      />
                    </div>
                  </>
                )}
              </div>

              <div className='border-t border-border px-6 py-4 bg-muted/50 flex-shrink-0'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>
                    All changes saved automatically
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center text-muted-foreground'>
              <div className='text-center'>
                <p className='text-lg mb-2'>No step selected</p>
                <p className='text-sm'>
                  Select a step from the timeline to edit it
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <StepCreationModal
        isOpen={showStepModal}
        onClose={() => setShowStepModal(false)}
        onSelectStep={handleStepModalSelect}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
