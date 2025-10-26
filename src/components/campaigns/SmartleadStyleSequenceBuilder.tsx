/**
 * Smartlead-Style Campaign Sequence Builder
 * Vertical timeline design with connected steps
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import {
  useCampaignSteps,
  useCampaignSequences,
} from '@/hooks/useCampaignSequences';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Eye,
  GitBranch,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
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
  const { steps, loading, addStep, updateStep, deleteStep, reorderSteps } =
    useCampaignSteps(sequence.id);
  const { updateSequence } = useCampaignSequences();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [pauseOnReply, setPauseOnReply] = useState(
    sequence.pause_on_reply ?? true
  );
  const { toast } = useToast();

  const selectedStep = steps.find(s => s.id === selectedStepId);

  const handlePauseOnReplyToggle = async (checked: boolean) => {
    setPauseOnReply(checked);
    try {
      await updateSequence.mutateAsync({
        id: sequence.id,
        pause_on_reply: checked,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update pause on reply setting',
        variant: 'destructive',
      });
      setPauseOnReply(!checked); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading campaign steps...</p>
        </div>
      </div>
    );
  }

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

  const handleStepModalSelect = (stepType: 'email' | 'wait' | 'condition') => {
    handleAddStep(stepType);
  };

  const handleMoveStep = async (stepId: string, direction: 'up' | 'down') => {
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

  const getStepTitle = (step: CampaignStep, index: number) => {
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
  };

  const getStepDescription = (step: CampaignStep) => {
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
          type: 'Manual',
          detail: `Title: ${step.name || '----'}`,
        };
      default:
        return {
          type: 'Unknown',
          detail: '----',
        };
    }
  };

  return (
    <div className='min-h-screen bg-white'>
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

        {/* Settings Row */}
        <div className='px-6 py-2 bg-gray-50 border-b border-gray-200'>
          <div className='flex items-center justify-between max-w-7xl mx-auto'>
            <div className='flex items-center gap-8'>
              <Label className='text-sm font-medium text-gray-700'>
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
                    className='text-sm text-gray-600 cursor-pointer'
                  >
                    Auto-pause on reply
                  </Label>
                </div>
                <div className='text-xs text-gray-500'>
                  {pauseOnReply
                    ? 'Sequence will pause when someone replies'
                    : 'Sequence will continue even after replies'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-1'>
        {/* Left Panel - Vertical Timeline */}
        <div className='w-80 bg-gray-50 border-r border-gray-200 p-6'>
          <div className='space-y-6'>
            {/* Add Step Button */}
            <div className='flex justify-center'>
              <Button
                onClick={() => setShowStepModal(true)}
                className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200'
              >
                <Plus className='w-4 h-4' />
                Add Step
              </Button>
            </div>

            {/* Vertical Timeline */}
            <div className='relative'>
              {/* Timeline Line */}
              <div className='absolute left-6 top-0 bottom-0 w-px bg-gray-300'></div>

              {/* Steps */}
              <div className='space-y-4'>
                {steps.map((step, index) => {
                  const description = getStepDescription(step);
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={step.id} className='relative'>
                      {/* Timeline Node */}
                      <div className='absolute left-4 top-4 w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded-full flex items-center justify-center z-10'>
                        {getStepIcon(step.step_type)}
                      </div>

                      {/* Step Card */}
                      <div
                        className={`ml-12 cursor-pointer transition-all ${
                          selectedStepId === step.id
                            ? 'opacity-100'
                            : 'opacity-90 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedStepId(step.id)}
                      >
                        <div
                          className={`bg-white rounded-lg border-2 p-4 ${
                            selectedStepId === step.id
                              ? 'border-purple-500 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <h3 className='text-sm font-medium text-gray-900 mb-2'>
                                {getStepTitle(step, index)}
                              </h3>

                              <div className='bg-gray-50 rounded p-3 text-xs text-gray-600'>
                                <div className='font-medium'>
                                  {description.type}
                                </div>
                                <div className='mt-1'>{description.detail}</div>
                              </div>

                              {/* Add Variant Button for Email Steps */}
                              {step.step_type === 'email' && (
                                <button className='text-blue-600 text-xs mt-2 hover:underline flex items-center gap-1'>
                                  <Plus className='w-3 h-3' />
                                  Add Variant
                                </button>
                              )}
                            </div>

                            {/* Action Buttons */}
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
                        </div>
                      </div>

                      {/* Connector Line */}
                      {!isLast && (
                        <div className='absolute left-6 top-16 w-px h-4 bg-gray-300'></div>
                      )}
                    </div>
                  );
                })}

                {/* Add Step Button */}
                <div className='relative'>
                  <div className='absolute left-4 top-4 w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded-full flex items-center justify-center z-10'>
                    <Plus className='w-3 h-3 text-purple-600' />
                  </div>
                  <div className='ml-12'>
                    <Button
                      variant='ghost'
                      onClick={() => setShowStepModal(true)}
                      className='text-gray-500 hover:text-gray-700 hover:bg-purple-50 transition-colors'
                    >
                      Add step
                    </Button>
                  </div>
                </div>

                {steps.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
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
        <div className='flex-1 bg-white'>
          {selectedStep ? (
            <div className='h-full flex flex-col'>
              {/* Editor Header */}
              <div className='border-b border-gray-200 px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-gray-900'>
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
                    <Button variant='outline' size='sm'>
                      <MoreHorizontal className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div className='flex-1 p-6 space-y-6'>
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
                      <Label htmlFor='email-subject'>Subject:</Label>
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

                {/* Wait Step Fields */}
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
                          wait_unit: config.unit,
                          business_hours_only: config.businessHoursOnly,
                        },
                      });
                    }}
                  />
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
              </div>

              {/* Editor Footer */}
              <div className='border-t border-gray-200 px-6 py-4 bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-gray-500'>All changes saved</div>
                  <Button className='bg-purple-600 hover:bg-purple-700 text-white'>
                    Save & Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500'>
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

      {/* Step Creation Modal */}
      <StepCreationModal
        isOpen={showStepModal}
        onClose={() => setShowStepModal(false)}
        onSelectStep={handleStepModalSelect}
      />
    </div>
  );
}
