import { Button } from '@/components/ui/button';
import { useCampaignSteps } from '@/hooks/useCampaignSequences';
import { CampaignSequence } from '@/types/campaign.types';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ArrowLeft,
  Clock,
  GitBranch,
  Mail,
  Pause,
  Play,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import StepEditor from './StepEditor';

interface Props {
  sequence: CampaignSequence;
  onClose: () => void;
}

const CampaignSequenceBuilder = memo(({ sequence, onClose }: Props) => {
  const { steps, loading, addStep, updateStep, deleteStep, reorderSteps } =
    useCampaignSteps(sequence.id);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedStep = useMemo(
    () => steps.find(s => s.id === selectedStepId),
    [steps, selectedStepId]
  );

  const handleAddStep = useCallback(
    async (type: 'email' | 'wait' | 'condition') => {
      const newStep = await addStep.mutateAsync(type);
      if (newStep) {
        setSelectedStepId(newStep.id);
      }
    },
    [addStep]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = steps.findIndex(s => s.id === active.id);
      const newIndex = steps.findIndex(s => s.id === over.id);

      const reordered = arrayMove(steps, oldIndex, newIndex);
      await reorderSteps.mutateAsync(reordered);
    },
    [steps, reorderSteps]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    // Auto-saves are already handled by updateStep
    setTimeout(() => setIsSaving(false), 500);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Header Bar */}
      <div className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6'>
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
          <h1 className='text-lg font-semibold text-gray-900'>
            {sequence.name}
          </h1>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sequence.status)}`}
          >
            {sequence.status}
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSave}
            disabled={isSaving}
            className='flex items-center gap-2'
          >
            <Save className='w-4 h-4' />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button size='sm' className='flex items-center gap-2'>
            {sequence.status === 'active' ? (
              <>
                <Pause className='w-4 h-4' />
                Pause Campaign
              </>
            ) : (
              <>
                <Play className='w-4 h-4' />
                Activate Campaign
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Left Sidebar - Step List */}
        <div className='w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto'>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-sm font-semibold text-gray-900'>
                Sequence Steps
              </h2>
              <div className='relative group'>
                <Button variant='outline' size='sm' className='p-1.5'>
                  <Plus className='w-4 h-4' />
                </Button>

                {/* Add Step Dropdown */}
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20'>
                  <Button
                    variant='ghost'
                    onClick={() => handleAddStep('email')}
                    className='w-full justify-start px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2'
                  >
                    📧 Email Step
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={() => handleAddStep('wait')}
                    className='w-full justify-start px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2'
                  >
                    ⏱️ Wait Step
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={() => handleAddStep('condition')}
                    className='w-full justify-start px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2'
                  >
                    🔀 Condition Step
                  </Button>
                </div>
              </div>
            </div>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={steps.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-3'>
                  {steps.map((step, index) => (
                    <div key={step.id} className='relative'>
                      {/* Step Card */}
                      <div
                        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          selectedStepId === step.id
                            ? 'border-purple-500 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedStepId(step.id)}
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start gap-3 flex-1'>
                            {/* Step Icon */}
                            <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0'>
                              {step.step_type === 'email' && (
                                <Mail className='w-4 h-4 text-purple-600' />
                              )}
                              {step.step_type === 'wait' && (
                                <Clock className='w-4 h-4 text-purple-600' />
                              )}
                              {step.step_type === 'condition' && (
                                <GitBranch className='w-4 h-4 text-purple-600' />
                              )}
                            </div>

                            {/* Step Content */}
                            <div className='flex-1 min-w-0'>
                              <h3 className='text-sm font-medium text-gray-900 mb-1'>
                                Step {index + 1}:{' '}
                                {step.step_type === 'email'
                                  ? 'Email follow up'
                                  : step.step_type === 'wait'
                                    ? 'Wait step'
                                    : 'Condition step'}
                              </h3>

                              {step.step_type === 'email' && (
                                <div className='bg-gray-50 rounded p-2 text-xs text-gray-600'>
                                  <div>Email</div>
                                  <div>
                                    Subject: {step.email_subject || '----'}
                                  </div>
                                </div>
                              )}

                              {step.step_type === 'wait' && (
                                <div className='bg-gray-50 rounded p-2 text-xs text-gray-600'>
                                  <div>
                                    Wait for {step.wait_duration || 1}{' '}
                                    {step.wait_unit || 'day'} then
                                  </div>
                                </div>
                              )}

                              {step.step_type === 'condition' && (
                                <div className='bg-gray-50 rounded p-2 text-xs text-gray-600'>
                                  <div>
                                    If {step.condition_type || 'opened'}
                                  </div>
                                </div>
                              )}

                              {step.step_type === 'email' && (
                                <button className='text-blue-600 text-xs mt-1 hover:underline'>
                                  + Add Variant
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={e => {
                              e.stopPropagation();
                              deleteStep.mutate(step.id);
                            }}
                            className='text-gray-400 hover:text-red-600 p-1'
                          >
                            <Trash2 className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>

                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className='absolute left-4 top-full w-px h-3 bg-gray-300 -translate-y-1'></div>
                      )}
                    </div>
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
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Right Panel - Step Editor */}
        <div className='flex-1 bg-white overflow-y-auto'>
          {selectedStep ? (
            <StepEditor step={selectedStep} onUpdate={updateStep.mutateAsync} />
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500'>
              <div className='text-center'>
                <p className='text-lg mb-2'>No step selected</p>
                <p className='text-sm'>
                  Select a step from the left or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CampaignSequenceBuilder.displayName = 'CampaignSequenceBuilder';

export default CampaignSequenceBuilder;
