import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Clock, Mail } from 'lucide-react';
import { gmailService, EmailTemplate } from '../../../services/gmailService';

interface EmailAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonId?: string;
}

interface AutomationStep {
  id: string;
  delay: number;
  delayUnit: 'hours' | 'days';
  templateId: string;
  subject: string;
  body: string;
}

export const EmailAutomationModal: React.FC<EmailAutomationModalProps> = ({
  isOpen,
  onClose,
  selectedPersonId,
}) => {
  const [automationName, setAutomationName] = useState('');
  const [steps, setSteps] = useState<AutomationStep[]>([
    {
      id: '1',
      delay: 1,
      delayUnit: 'days',
      templateId: '',
      subject: '',
      body: '',
    },
  ]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const templateList = await gmailService.getEmailTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const addStep = () => {
    const newStep: AutomationStep = {
      id: Date.now().toString(),
      delay: 1,
      delayUnit: 'days',
      templateId: '',
      subject: '',
      body: '',
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, updates: Partial<AutomationStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleTemplateSelect = (stepId: string, templateId: string) => {
    const template = templates.find(type => type.id === templateId);
    if (template) {
      updateStep(stepId, {
        templateId,
        subject: template.subject,
        body: template.body_text || template.body_html,
      });
    }
  };

  const handleSave = async () => {
    if (!automationName.trim() || steps.length === 0) {
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, you'd save this to a database
      console.log('Saving email automation:', {
        name: automationName,
        steps,
        personId: selectedPersonId,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to save automation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDelay = () => {
    return steps.reduce((total, step) => {
      const delayInHours = step.delayUnit === 'days' ? step.delay * 24 : step.delay;
      return total + delayInHours;
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Email Automation</DialogTitle>
          <DialogDescription>
            Set up automated email sequences for your leads
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="automation-name">Automation Name</Label>
              <Input
                id="automation-name"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                placeholder="e.g., Lead Follow-up Sequence"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Steps</h3>
                <Button onClick={addStep} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>

              {steps.map((step, index) => (
                <Card key={step.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Step {index + 1}
                      </CardTitle>
                      {steps.length > 1 && (
                        <Button
                          onClick={() => removeStep(step.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Delay</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={step.delay}
                            onChange={(e) => updateStep(step.id, { 
                              delay: parseInt(e.target.value) || 1 
                            })}
                          />
                          <Select
                            value={step.delayUnit}
                            onValueChange={(value: 'hours' | 'days') => 
                              updateStep(step.id, { delayUnit: value })
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Template</Label>
                        <Select
                          value={step.templateId}
                          onValueChange={(value) => handleTemplateSelect(step.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={step.subject}
                        onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                        placeholder="Email subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={step.body}
                        onChange={(e) => updateStep(step.id, { body: e.target.value })}
                        placeholder="Email content"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Automation Summary</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {steps.length} steps
                </Badge>
                <span>
                  Total duration: {getTotalDelay()} hours
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || !automationName.trim() || steps.length === 0}
          >
            {loading ? 'Saving...' : 'Create Automation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};








