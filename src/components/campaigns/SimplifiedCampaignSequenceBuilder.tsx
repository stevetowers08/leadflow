/**
 * Simplified Campaign Sequence Builder
 * Smartlead-style interface without drag-and-drop complexity
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCampaignSteps } from '@/hooks/useCampaignSequences';
import { CampaignSequence } from '@/types/campaign.types';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  GitBranch,
  Mail,
  Pause,
  Play,
  Save,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  sequence: CampaignSequence;
  onClose: () => void;
}

export default function SimplifiedCampaignSequenceBuilder({
  sequence,
  onClose,
}: Props) {
  const { steps, loading, addStep, updateStep, deleteStep, reorderSteps } =
    useCampaignSteps(sequence.id);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const selectedStep = steps.find(s => s.id === selectedStepId);

  const handleAddStep = async (type: 'email' | 'wait' | 'condition') => {
    try {
      const newStep = await addStep.mutateAsync(type);
      if (newStep) {
        setSelectedStepId(newStep.id);
        toast({
          title: 'Step Added',
          description: `New ${type} step added to sequence`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add step',
        variant: 'destructive',
      });
    }
  };

  const handleMoveStep = async (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = steps.findIndex(s => s.id === stepId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    // Create new order
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(currentIndex, 1);
    newSteps.splice(newIndex, 0, movedStep);

    // Update order positions
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order_position: index + 1,
    }));

    try {
      await reorderSteps.mutateAsync(reorderedSteps);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder steps',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (confirm('Are you sure you want to delete this step?')) {
      try {
        await deleteStep.mutate(stepId);
        if (selectedStepId === stepId) {
          setSelectedStepId(null);
        }
        toast({
          title: 'Step Deleted',
          description: 'Step removed from sequence',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete step',
          variant: 'destructive',
        });
      }
    }
  };

  const getStepIcon = (stepType: string) => {
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
  };

  const getStepColor = (stepType: string) => {
    switch (stepType) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'wait':
        return 'bg-yellow-100 text-yellow-800';
      case 'condition':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Campaigns
            </Button>
            <div className='h-8 w-px bg-gray-300' />
            <h1 className='text-xl font-semibold text-gray-900'>
              {sequence.name}
            </h1>
            <Badge variant='secondary' className='capitalize'>
              {sequence.status}
            </Badge>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsSaving(true)}
              disabled={isSaving}
            >
              <Save className='w-4 h-4 mr-2' />
              {isSaving ? 'Saving...' : 'Save'}
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

      <div className='flex flex-1 p-6 gap-6'>
        {/* Left Panel - Steps List */}
        <div className='w-96 space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Sequence Steps</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {/* Add Step Buttons */}
              <div className='grid grid-cols-3 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleAddStep('email')}
                  className='flex items-center gap-2'
                >
                  <Mail className='w-4 h-4' />
                  Email
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleAddStep('wait')}
                  className='flex items-center gap-2'
                >
                  <Clock className='w-4 h-4' />
                  Wait
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleAddStep('condition')}
                  className='flex items-center gap-2'
                >
                  <GitBranch className='w-4 h-4' />
                  If/Then
                </Button>
              </div>

              {/* Steps List */}
              <div className='space-y-2'>
                {steps.map((step, index) => (
                  <Card
                    key={step.id}
                    className={`cursor-pointer transition-all ${
                      selectedStepId === step.id
                        ? 'ring-2 ring-blue-500 border-blue-500'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStepId(step.id)}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3 flex-1'>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepColor(step.step_type)}`}
                          >
                            {getStepIcon(step.step_type)}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-sm font-medium text-gray-900'>
                                Step {index + 1}
                              </span>
                              <Badge variant='outline' className='text-xs'>
                                {step.step_type}
                              </Badge>
                            </div>
                            <h3 className='text-sm font-medium text-gray-900 mb-1'>
                              {step.name}
                            </h3>

                            {step.step_type === 'email' && (
                              <p className='text-xs text-gray-500'>
                                Subject: {step.email_subject || 'No subject'}
                              </p>
                            )}

                            {step.step_type === 'wait' && (
                              <p className='text-xs text-gray-500'>
                                Wait {step.wait_duration} {step.wait_unit}
                              </p>
                            )}

                            {step.step_type === 'condition' && (
                              <p className='text-xs text-gray-500'>
                                If {step.condition_type}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={e => {
                              e.stopPropagation();
                              handleMoveStep(step.id, 'up');
                            }}
                            disabled={index === 0}
                            className='p-1 h-6 w-6'
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
                          >
                            <ChevronDown className='w-3 h-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteStep(step.id);
                            }}
                            className='p-1 h-6 w-6 text-red-500 hover:text-red-700'
                          >
                            <Trash2 className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {steps.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    <p className='text-sm'>No steps yet</p>
                    <p className='text-xs'>
                      Add your first step to get started
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Step Editor */}
        <div className='flex-1'>
          {selectedStep ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  {getStepIcon(selectedStep.step_type)}
                  Edit Step: {selectedStep.name}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Step Name */}
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

                {/* Email Step Fields */}
                {selectedStep.step_type === 'email' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='email-subject'>Email Subject</Label>
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
                        className='min-h-[200px]'
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

                {/* Wait Step Fields */}
                {selectedStep.step_type === 'wait' && (
                  <>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='wait-duration'>Wait Duration</Label>
                        <Input
                          id='wait-duration'
                          type='number'
                          value={selectedStep.wait_duration || 1}
                          onChange={e => {
                            updateStep.mutate({
                              id: selectedStep.id,
                              updates: {
                                wait_duration: parseInt(e.target.value),
                              },
                            });
                          }}
                          min='1'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='wait-unit'>Wait Unit</Label>
                        <Select
                          value={selectedStep.wait_unit || 'days'}
                          onValueChange={value => {
                            updateStep.mutate({
                              id: selectedStep.id,
                              updates: { wait_unit: value },
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='hours'>Hours</SelectItem>
                            <SelectItem value='days'>Days</SelectItem>
                            <SelectItem value='weeks'>Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={selectedStep.business_hours_only || false}
                          onChange={e => {
                            updateStep.mutate({
                              id: selectedStep.id,
                              updates: {
                                business_hours_only: e.target.checked,
                              },
                            });
                          }}
                        />
                        Only wait during business hours
                      </Label>
                    </div>
                  </>
                )}

                {/* Condition Step Fields */}
                {selectedStep.step_type === 'condition' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='condition-type'>Condition Type</Label>
                      <Select
                        value={selectedStep.condition_type || 'opened'}
                        onValueChange={value => {
                          updateStep.mutate({
                            id: selectedStep.id,
                            updates: { condition_type: value },
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className='flex items-center justify-center h-96'>
                <div className='text-center text-gray-500'>
                  <p className='text-lg mb-2'>No step selected</p>
                  <p className='text-sm'>
                    Select a step from the left to edit it
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
