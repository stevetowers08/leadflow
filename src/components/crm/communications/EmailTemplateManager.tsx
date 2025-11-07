import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DOMPurify from 'dompurify';
import { Edit, Eye, Mail, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  EmailTemplate,
  secureGmailService,
} from '../../../services/secureGmailService';

interface EmailTemplateManagerProps {
  onTemplateSelect?: (template: EmailTemplate) => void;
  showSelectButton?: boolean;
}

export const EmailTemplateManager: React.FC<EmailTemplateManagerProps> = ({
  onTemplateSelect,
  showSelectButton = false,
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templateList = await secureGmailService.getEmailTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (
    templateData: Omit<
      EmailTemplate,
      'id' | 'created_by' | 'created_at' | 'updated_at'
    >
  ) => {
    try {
      await secureGmailService.createEmailTemplate(templateData);
      await loadTemplates();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      // In a real implementation, you'd call a delete API
      console.log('Delete template:', templateId);
      await loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      outreach: 'bg-blue-100 text-primary',
      follow_up: 'bg-green-100 text-success',
      meeting: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-foreground',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center'>Loading templates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Email Templates</h2>
          <p className='text-muted-foreground'>
            Manage your email templates for personalised outreach
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl max-h-[90vh]'>
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
              <DialogDescription>
                Create a new email template with dynamic placeholders
              </DialogDescription>
            </DialogHeader>
            <TemplateEditor
              onSave={handleCreateTemplate}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {templates.map(template => (
          <Card key={template.id} className='hover:shadow-md transition-shadow'>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <CardTitle className='text-lg'>{template.name}</CardTitle>
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category.replace('_', ' ')}
                  </Badge>
                </div>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <Label className='text-sm font-medium'>Subject</Label>
                <p className='text-sm text-muted-foreground line-clamp-2'>
                  {template.subject}
                </p>
              </div>
              <div>
                <Label className='text-sm font-medium'>Preview</Label>
                <p className='text-sm text-muted-foreground line-clamp-3'>
                  {template.body_text ||
                    template.body_html.replace(/<[^>]*>/g, '')}
                </p>
              </div>
              {template.placeholders.length > 0 && (
                <div>
                  <Label className='text-sm font-medium'>Placeholders</Label>
                  <div className='flex flex-wrap gap-1 mt-1'>
                    {template.placeholders.map(placeholder => (
                      <Badge
                        key={placeholder}
                        variant='outline'
                        className='text-xs'
                      >
                        {placeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {showSelectButton && (
                <Button
                  className='w-full'
                  onClick={() => onTemplateSelect?.(template)}
                >
                  <Mail className='mr-2 h-4 w-4' />
                  Use Template
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Mail className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
            <h3 className='text-lg font-medium mb-2'>No templates yet</h3>
            <p className='text-muted-foreground mb-4'>
              Create your first email template to get started
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <Dialog
          open={!!editingTemplate}
          onOpenChange={() => setEditingTemplate(null)}
        >
          <DialogContent className='max-w-4xl max-h-[90vh]'>
            <DialogHeader>
              <DialogTitle>Edit Email Template</DialogTitle>
              <DialogDescription>Update your email template</DialogDescription>
            </DialogHeader>
            <TemplateEditor
              template={editingTemplate}
              onSave={data => {
                // Handle update
                setEditingTemplate(null);
                loadTemplates();
              }}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Template Modal */}
      {previewTemplate && (
        <Dialog
          open={!!previewTemplate}
          onOpenChange={() => setPreviewTemplate(null)}
        >
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Template Preview</DialogTitle>
              <DialogDescription>
                Preview how this template will look
              </DialogDescription>
            </DialogHeader>
            <TemplatePreview template={previewTemplate} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Template Editor Component
interface TemplateEditorProps {
  template?: EmailTemplate;
  onSave: (
    data: Omit<EmailTemplate, 'id' | 'created_by' | 'created_at' | 'updated_at'>
  ) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    body_html: template?.body_html || '',
    body_text: template?.body_text || '',
    category: template?.category || 'outreach',
    placeholders: template?.placeholders || [],
  });

  const availablePlaceholders = [
    { key: '{{name}}', label: 'Full Name', description: "Person's full name" },
    {
      key: '{{first_name}}',
      label: 'First Name',
      description: "Person's first name",
    },
    {
      key: '{{last_name}}',
      label: 'Last Name',
      description: "Person's last name",
    },
    { key: '{{email}}', label: 'Email', description: "Person's email address" },
    {
      key: '{{company}}',
      label: 'Company',
      description: "Person's company name",
    },
    {
      key: '{{job_title}}',
      label: 'Job Title',
      description: "Person's job title",
    },
  ];

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById(
      'body_html'
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + placeholder + after;

      setFormData(prev => ({ ...prev, body_html: newText }));

      // Update cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + placeholder.length,
          start + placeholder.length
        );
      }, 0);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.subject || !formData.body_html) {
      alert('Please fill in all required fields');
      return;
    }

    // Extract placeholders from content
    const placeholderRegex = /\{\{[^}]+\}\}/g;
    const foundPlaceholders = formData.body_html.match(placeholderRegex) || [];
    const uniquePlaceholders = [...new Set(foundPlaceholders)];

    onSave({
      ...formData,
      placeholders: uniquePlaceholders,
      preview_data: {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        job_title: 'Software Engineer',
      },
      variables: {},
      is_active: true,
    });
  };

  return (
    <ScrollArea className='max-h-[70vh]'>
      <div className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Template Name *</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder='e.g., Initial Outreach'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Select
              value={formData.category}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  category: value as
                    | 'outreach'
                    | 'follow_up'
                    | 'meeting'
                    | 'proposal'
                    | 'other',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='outreach'>Outreach</SelectItem>
                <SelectItem value='follow_up'>Follow Up</SelectItem>
                <SelectItem value='meeting'>Meeting</SelectItem>
                <SelectItem value='proposal'>Proposal</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='subject'>Subject Line *</Label>
          <Input
            id='subject'
            value={formData.subject}
            onChange={e =>
              setFormData(prev => ({ ...prev, subject: e.target.value }))
            }
            placeholder='e.g., Quick question about {{company}}'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='body_html'>Email Body (HTML) *</Label>
            <div className='flex gap-1'>
              {availablePlaceholders.map(placeholder => (
                <Button
                  key={placeholder.key}
                  variant='outline'
                  size='sm'
                  onClick={() => insertPlaceholder(placeholder.key)}
                  title={placeholder.description}
                >
                  {placeholder.label}
                </Button>
              ))}
            </div>
          </div>
          <Textarea
            id='body_html'
            value={formData.body_html}
            onChange={e =>
              setFormData(prev => ({ ...prev, body_html: e.target.value }))
            }
            placeholder='Write your email content here...'
            rows={12}
            className='font-mono text-sm'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='body_text'>Plain Text Version (Optional)</Label>
          <Textarea
            id='body_text'
            value={formData.body_text}
            onChange={e =>
              setFormData(prev => ({ ...prev, body_text: e.target.value }))
            }
            placeholder='Plain text version of your email...'
            rows={6}
          />
        </div>

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

// Template Preview Component
interface TemplatePreviewProps {
  template: EmailTemplate;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  const sampleData = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Example Corp',
    job_title: 'Software Engineer',
  };

  const renderedContent = secureGmailService.renderTemplate(
    template,
    sampleData
  );

  return (
    <div className='space-y-4'>
      <div>
        <Label className='text-sm font-medium'>Subject</Label>
        <div className='p-3 bg-muted rounded-md text-sm'>
          {renderedContent.subject}
        </div>
      </div>
      <div>
        <Label className='text-sm font-medium'>Preview</Label>
        <div className='p-4 border rounded-md bg-white'>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderedContent.bodyHtml),
            }}
          />
        </div>
      </div>
    </div>
  );
};
