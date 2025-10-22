/**
 * WorkflowBuilder - Clean Linear Workflow Builder
 *
 * Features:
 * - Clean linear design with connected nodes
 * - Plus buttons between steps
 * - Right sidebar for configuration
 * - No hover states
 * - Simple and functional
 */

import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Play,
  Plus,
  Tag,
  Target,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Types
interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'end';
  actionType?: string;
  config: Record<string, unknown>;
  position: number;
}

// Mock data
const mockEmailTemplates = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to our service!' },
  {
    id: '2',
    name: 'Follow-up Email',
    subject: 'Following up on our conversation',
  },
];

const mockDomains = [
  { id: '1', domain: 'example.com', verified: true },
  { id: '2', domain: 'mycompany.com', verified: true },
];

const mockSmsSettings = [
  { id: '1', phoneNumber: '+1234567890', friendlyName: 'Main Number' },
];

const WorkflowBuilder: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `step_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }, []);

  // Step type definitions
  const stepTypes = {
    trigger: {
      label: 'Trigger',
      icon: Zap,
      color: 'bg-orange-500',
    },
    action: {
      label: 'Action',
      icon: Play,
      color: 'bg-primary',
    },
    condition: {
      label: 'Condition',
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    delay: {
      label: 'Delay',
      icon: Clock,
      color: 'bg-yellow-500',
    },
    end: {
      label: 'End',
      icon: Target,
      color: 'bg-gray-500',
    },
  };

  // Action types
  const actionTypes = {
    send_email: {
      label: 'Send Email',
      icon: Mail,
    },
    send_sms: {
      label: 'Send SMS',
      icon: MessageSquare,
    },
    add_tag: {
      label: 'Add Tag',
      icon: Tag,
    },
    update_lead_status: {
      label: 'Update Lead Status',
      icon: Users,
    },
    schedule_meeting: {
      label: 'Schedule Meeting',
      icon: Calendar,
    },
  };

  // Add step
  const addStep = useCallback(
    (type: keyof typeof stepTypes, position?: number) => {
      const newStep: WorkflowStep = {
        id: generateId(),
        type,
        config: {},
        position: position !== undefined ? position : steps.length,
      };

      if (position !== undefined) {
        setSteps(prev => {
          const newSteps = [...prev];
          newSteps.splice(position, 0, newStep);
          return newSteps.map((step, index) => ({ ...step, position: index }));
        });
      } else {
        setSteps(prev => [...prev, { ...newStep, position: prev.length }]);
      }
    },
    [generateId, steps.length]
  );

  // Update step
  const updateStep = useCallback(
    (stepId: string, updates: Partial<WorkflowStep>) => {
      setSteps(prev =>
        prev.map(step => (step.id === stepId ? { ...step, ...updates } : step))
      );
    },
    []
  );

  // Delete step
  const deleteStep = useCallback(
    (stepId: string) => {
      setSteps(prev => {
        const newSteps = prev.filter(step => step.id !== stepId);
        return newSteps.map((step, index) => ({ ...step, position: index }));
      });
      if (selectedStep === stepId) {
        setSelectedStep(null);
      }
    },
    [selectedStep]
  );

  // Get selected step data
  const selectedStepData = steps.find(step => step.id === selectedStep);

  // Render step
  const renderStep = (step: WorkflowStep, index: number) => {
    const stepType = stepTypes[step.type];
    const Icon = stepType.icon;

    return (
      <div key={step.id} className='flex flex-col items-center'>
        {/* Step Node */}
        <div
          className={`w-48 bg-white rounded-md border p-3 cursor-pointer ${
            selectedStep === step.id
              ? 'border-primary shadow-sm'
              : 'border-gray-200'
          }`}
          onClick={() => setSelectedStep(step.id)}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-6 h-6 ${stepType.color} rounded-md flex items-center justify-center`}
              >
                <Icon className='w-3 h-3 text-white' />
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>
                  {stepType.label}
                </h3>
                {step.actionType && (
                  <p className='text-xs text-primary'>
                    {
                      actionTypes[step.actionType as keyof typeof actionTypes]
                        ?.label
                    }
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                deleteStep(step.id);
              }}
              className='p-1 text-gray-400'
            >
              <Trash2 className='w-3 h-3' />
            </button>
          </div>
        </div>

        {/* Connection Line */}
        {index < steps.length - 1 && (
          <div className='w-0.5 h-6 bg-gray-200'></div>
        )}

        {/* Plus Button */}
        <button
          onClick={() => addStep('action', index + 1)}
          className='w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center mt-1'
        >
          <Plus className='w-3 h-3' />
        </button>
      </div>
    );
  };

  return (
    <div className='h-full flex bg-white'>
      {/* Main Workflow Area */}
      <div className='flex-1 flex flex-col'>
        {/* Workflow Canvas */}
        <div className='flex-1 p-6 overflow-y-auto'>
          {steps.length === 0 ? (
            /* Empty State */
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3'>
                <Zap className='w-6 h-6 text-gray-400' />
              </div>
              <h3 className='text-base font-medium text-gray-900 mb-1'>
                Start Building Your Workflow
              </h3>
              <p className='text-sm text-gray-500 mb-4 max-w-sm'>
                Create automated workflows to streamline your processes.
              </p>
              <button
                onClick={() => addStep('trigger')}
                className='px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium'
              >
                Add Trigger
              </button>
            </div>
          ) : (
            /* Workflow Steps */
            <div className='flex flex-col items-center space-y-3'>
              {steps.map((step, index) => renderStep(step, index))}

              {/* Final Plus Button */}
              <button
                onClick={() => addStep('action')}
                className='w-48 h-12 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500'
              >
                <div className='flex items-center gap-2'>
                  <Plus className='w-4 h-4' />
                  <span className='text-sm font-medium'>Add Step</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Step Configuration */}
      {selectedStepData && (
        <div className='w-72 border-l border-gray-100 bg-white'>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-medium text-gray-900'>
                Configure Step
              </h3>
              <button
                onClick={() => setSelectedStep(null)}
                className='text-gray-400 text-lg leading-none'
              >
                ×
              </button>
            </div>

            {/* Step Configuration */}
            <div className='space-y-3'>
              {/* Trigger Configuration */}
              {selectedStepData.type === 'trigger' && (
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    Trigger Type
                  </label>
                  <select
                    value={
                      (selectedStepData.config.triggerType as string) || ''
                    }
                    onChange={e =>
                      updateStep(selectedStepData.id, {
                        config: {
                          ...selectedStepData.config,
                          triggerType: e.target.value,
                        },
                      })
                    }
                    className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                  >
                    <option value=''>Select trigger...</option>
                    <option value='new_lead'>New Lead Added</option>
                    <option value='email_opened'>Email Opened</option>
                    <option value='email_clicked'>Email Clicked</option>
                    <option value='sms_received'>SMS Received</option>
                    <option value='stage_changed'>Stage Changed</option>
                  </select>
                </div>
              )}

              {/* Action Configuration */}
              {selectedStepData.type === 'action' && (
                <div className='space-y-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Action Type
                    </label>
                    <select
                      value={selectedStepData.actionType || ''}
                      onChange={e =>
                        updateStep(selectedStepData.id, {
                          actionType: e.target.value,
                          config: {},
                        })
                      }
                      className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                    >
                      <option value=''>Select action...</option>
                      {Object.entries(actionTypes).map(([key, action]) => (
                        <option key={key} value={key}>
                          {action.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email Action Configuration */}
                  {selectedStepData.actionType === 'send_email' && (
                    <>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Sending Domain
                        </label>
                        <select
                          value={
                            (selectedStepData.config.domain as string) || ''
                          }
                          onChange={e =>
                            updateStep(selectedStepData.id, {
                              config: {
                                ...selectedStepData.config,
                                domain: e.target.value,
                              },
                            })
                          }
                          className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                        >
                          <option value=''>Select domain...</option>
                          {mockDomains.map(domain => (
                            <option key={domain.id} value={domain.domain}>
                              {domain.domain} {domain.verified ? '✓' : '⚠'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Email Template
                        </label>
                        <select
                          value={
                            (selectedStepData.config.template as string) || ''
                          }
                          onChange={e =>
                            updateStep(selectedStepData.id, {
                              config: {
                                ...selectedStepData.config,
                                template: e.target.value,
                              },
                            })
                          }
                          className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                        >
                          <option value=''>Select template...</option>
                          {mockEmailTemplates.map(template => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* SMS Action Configuration */}
                  {selectedStepData.actionType === 'send_sms' && (
                    <>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          From Number
                        </label>
                        <select
                          value={
                            (selectedStepData.config.phoneNumber as string) ||
                            ''
                          }
                          onChange={e =>
                            updateStep(selectedStepData.id, {
                              config: {
                                ...selectedStepData.config,
                                phoneNumber: e.target.value,
                              },
                            })
                          }
                          className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                        >
                          <option value=''>Select number...</option>
                          {mockSmsSettings.map(setting => (
                            <option
                              key={setting.id}
                              value={setting.phoneNumber}
                            >
                              {setting.friendlyName} ({setting.phoneNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Message
                        </label>
                        <textarea
                          value={
                            (selectedStepData.config.message as string) || ''
                          }
                          onChange={e =>
                            updateStep(selectedStepData.id, {
                              config: {
                                ...selectedStepData.config,
                                message: e.target.value,
                              },
                            })
                          }
                          placeholder='Enter your SMS message...'
                          rows={2}
                          className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                        />
                      </div>
                    </>
                  )}

                  {/* Delay Configuration */}
                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Delay (minutes)
                    </label>
                    <input
                      type='number'
                      value={(selectedStepData.config.delay as number) || ''}
                      onChange={e =>
                        updateStep(selectedStepData.id, {
                          config: {
                            ...selectedStepData.config,
                            delay: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder='0'
                      min='0'
                      className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                    />
                  </div>
                </div>
              )}

              {/* Delay Configuration */}
              {selectedStepData.type === 'delay' && (
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    Wait Time (minutes)
                  </label>
                  <input
                    type='number'
                    value={(selectedStepData.config.duration as number) || ''}
                    onChange={e =>
                      updateStep(selectedStepData.id, {
                        config: {
                          ...selectedStepData.config,
                          duration: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder='Enter delay in minutes...'
                    min='0'
                    className='w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
