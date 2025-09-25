import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Settings, 
  Mail, 
  MessageSquare, 
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin
} from 'lucide-react';

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowStep;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

const WORKFLOW_TYPES = {
  trigger: [
    { value: 'lead_created', label: 'Lead Created', icon: Users },
    { value: 'status_changed', label: 'Status Changed', icon: Target },
    { value: 'email_opened', label: 'Email Opened', icon: Mail },
    { value: 'form_submitted', label: 'Form Submitted', icon: CheckCircle },
    { value: 'time_based', label: 'Time Based', icon: Clock },
  ],
  condition: [
    { value: 'lead_score', label: 'Lead Score', icon: Target },
    { value: 'company_size', label: 'Company Size', icon: Users },
    { value: 'industry', label: 'Industry', icon: Building2 },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'stage', label: 'Stage', icon: Target },
  ],
  action: [
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'send_linkedin', label: 'Send LinkedIn Message', icon: MessageSquare },
    { value: 'create_task', label: 'Create Task', icon: CheckCircle },
    { value: 'update_status', label: 'Update Status', icon: Target },
    { value: 'assign_user', label: 'Assign User', icon: Users },
    { value: 'schedule_call', label: 'Schedule Call', icon: Calendar },
  ],
  delay: [
    { value: 'wait_time', label: 'Wait Time', icon: Clock },
    { value: 'wait_business_hours', label: 'Wait Business Hours', icon: Clock },
    { value: 'wait_weekdays', label: 'Wait Weekdays', icon: Calendar },
  ]
};

export function WorkflowBuilder({ workflow, onSave, onCancel }: WorkflowBuilderProps) {
  const [workflowData, setWorkflowData] = useState<Workflow>(
    workflow || {
      id: '',
      name: '',
      description: '',
      isActive: false,
      trigger: {
        id: 'trigger-1',
        type: 'trigger',
        name: 'Lead Created',
        config: { type: 'lead_created' },
        position: { x: 100, y: 100 }
      },
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const { toast } = useToast();

  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      name: `New ${type}`,
      config: {},
      position: { x: 300, y: 100 + (workflowData.steps.length * 150) }
    };

    setWorkflowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const deleteStep = (stepId: string) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
    setSelectedStep(null);
  };

  const handleSave = () => {
    if (!workflowData.name.trim()) {
      toast({
        title: "Error",
        description: "Workflow name is required",
        variant: "destructive",
      });
      return;
    }

    const workflowToSave = {
      ...workflowData,
      id: workflowData.id || `workflow-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    onSave(workflowToSave);
    toast({
      title: "Success",
      description: "Workflow saved successfully",
    });
  };

  const getStepIcon = (step: WorkflowStep) => {
    const typeConfig = WORKFLOW_TYPES[step.type]?.find(t => t.value === step.config.type);
    return typeConfig?.icon || Settings;
  };

  const getStepColor = (type: WorkflowStep['type']) => {
    // Use unified color scheme for consistency
    return getUnifiedStatusClass(type);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Workflow Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowData.name}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter workflow name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-status">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="workflow-status"
                  checked={workflowData.isActive}
                  onCheckedChange={(checked) => setWorkflowData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="workflow-status">
                  {workflowData.isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description</Label>
            <Textarea
              id="workflow-description"
              value={workflowData.description}
              onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this workflow does"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[400px] border-2 border-dashed border-gray-200 rounded-lg p-4">
            {/* Trigger Step */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`px-3 py-2 rounded-lg border ${getStepColor('trigger')} flex items-center gap-2`}>
                <Play className="h-4 w-4" />
                <span className="font-medium">Trigger: {workflowData.trigger.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                When a lead is created
              </div>
            </div>

            {/* Workflow Steps */}
            {workflowData.steps.map((step, index) => {
              const IconComponent = getStepIcon(step);
              return (
                <div key={step.id} className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-lg border ${getStepColor(step.type)} flex items-center gap-2 cursor-pointer hover:opacity-80`}
                    onClick={() => setSelectedStep(step)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{step.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStep(step.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}

            {/* Add Step Buttons */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addStep('condition')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Condition
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addStep('action')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Action
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addStep('delay')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Delay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Configuration */}
      {selectedStep && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Step: {selectedStep.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="step-name">Step Name</Label>
              <Input
                id="step-name"
                value={selectedStep.name}
                onChange={(e) => updateStep(selectedStep.id, { name: e.target.value })}
                placeholder="Enter step name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="step-type">Step Type</Label>
              <Select
                value={selectedStep.config.type || ''}
                onValueChange={(value) => updateStep(selectedStep.id, { 
                  config: { ...selectedStep.config, type: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select step type" />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_TYPES[selectedStep.type]?.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic configuration based on step type */}
            {selectedStep.type === 'action' && selectedStep.config.type === 'send_email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    value={selectedStep.config.subject || ''}
                    onChange={(e) => updateStep(selectedStep.id, { 
                      config: { ...selectedStep.config, subject: e.target.value }
                    })}
                    placeholder="Enter email subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-body">Email Body</Label>
                  <Textarea
                    id="email-body"
                    value={selectedStep.config.body || ''}
                    onChange={(e) => updateStep(selectedStep.id, { 
                      config: { ...selectedStep.config, body: e.target.value }
                    })}
                    placeholder="Enter email body"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {selectedStep.type === 'delay' && (
              <div className="space-y-2">
                <Label htmlFor="delay-time">Delay Time (hours)</Label>
                <Input
                  id="delay-time"
                  type="number"
                  value={selectedStep.config.hours || 1}
                  onChange={(e) => updateStep(selectedStep.id, { 
                    config: { ...selectedStep.config, hours: parseInt(e.target.value) }
                  })}
                  placeholder="Enter delay in hours"
                />
              </div>
            )}

            {selectedStep.type === 'condition' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="condition-field">Field</Label>
                  <Select
                    value={selectedStep.config.field || ''}
                    onValueChange={(value) => updateStep(selectedStep.id, { 
                      config: { ...selectedStep.config, field: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead_score">Lead Score</SelectItem>
                      <SelectItem value="company_size">Company Size</SelectItem>
                      <SelectItem value="industry">Industry</SelectItem>
                      <SelectItem value="stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition-value">Value</Label>
                  <Input
                    id="condition-value"
                    value={selectedStep.config.value || ''}
                    onChange={(e) => updateStep(selectedStep.id, { 
                      config: { ...selectedStep.config, value: e.target.value }
                    })}
                    placeholder="Enter condition value"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Workflow
        </Button>
      </div>
    </div>
  );
}
