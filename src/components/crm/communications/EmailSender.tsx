import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Eye, Loader2, Mail, Send, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Tables } from '../../../integrations/supabase/types';
import {
  EmailTemplate,
  SendEmailRequest,
  secureGmailService,
} from '../../../services/secureGmailService';

interface EmailSenderProps {
  selectedPerson?: Tables<'people'>;
  onEmailSent?: () => void;
}

interface Person {
  id: string;
  name: string;
  email_address: string;
  company_name?: string;
  company_role?: string;
}

export const EmailSender: React.FC<EmailSenderProps> = ({
  selectedPerson,
  onEmailSent,
}) => {
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form state
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    selectedPerson?.id || ''
  );
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<{
    subject: string;
    body: string;
    bodyHtml: string;
  } | null>(null);

  useEffect(() => {
    initializeEmailSender();
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      setSelectedPersonId(selectedPerson.id);
    }
  }, [selectedPerson]);

  const initializeEmailSender = async () => {
    try {
      setLoading(true);

      // Check Gmail connection
      const connected = await secureGmailService.isGmailConnected();
      setIsGmailConnected(connected);

      if (connected) {
        // Load templates
        const templateList = await secureGmailService.getEmailTemplates();
        setTemplates(templateList);

        // Load people (you might want to add pagination here)
        await loadPeople();
      }
    } catch (error) {
      console.error('Failed to initialize email sender:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPeople = async () => {
    try {
      // This would typically come from your people service
      // For now, using mock data
      const mockPeople: Person[] = [
        {
          id: '1',
          name: 'John Doe',
          email_address: 'john@example.com',
          company_name: 'Example Corp',
          company_role: 'Software Engineer',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email_address: 'jane@example.com',
          company_name: 'Tech Inc',
          company_role: 'Product Manager',
        },
      ];
      setPeople(mockPeople);
    } catch (error) {
      console.error('Failed to load people:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);

    if (template) {
      setCustomSubject(template.subject);
      setCustomBody(template.body_html);
    }
  };

  const handlePersonSelect = (personId: string) => {
    setSelectedPersonId(personId);
  };

  const generatePreview = () => {
    if (!selectedTemplate || !selectedPersonId) return;

    const person = people.find(p => p.id === selectedPersonId);
    if (!person) return;

    const rendered = secureGmailService.renderTemplate(selectedTemplate, {
      name: person.name,
      email_address: person.email_address,
      company_name: person.company_name || '',
      company_role: person.company_role || '',
    });

    setPreviewContent(rendered);
    setShowPreview(true);
  };

  const handleSendEmail = async () => {
    if (!selectedPersonId || !isGmailConnected) {
      alert('Please select a person and ensure Gmail is connected');
      return;
    }

    const person = people.find(p => p.id === selectedPersonId);
    if (!person) {
      alert('Selected person not found');
      return;
    }

    if (!customSubject || !customBody) {
      alert('Please fill in subject and body');
      return;
    }

    try {
      setSending(true);

      const emailRequest: SendEmailRequest = {
        to: [person.email_address],
        subject: customSubject,
        body: customBody.replace(/<[^>]*>/g, ''), // Plain text version
        bodyHtml: customBody,
        templateId: selectedTemplate?.id,
        personId: person.id,
      };

      const result = await secureGmailService.sendEmail(emailRequest);

      console.log('Email sent successfully:', result);
      alert('Email sent successfully!');

      // Reset form
      setCustomSubject('');
      setCustomBody('');
      setSelectedTemplate(null);
      setSelectedPersonId('');

      onEmailSent?.();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setSending(false);
    }
  };

  const connectGmail = async () => {
    try {
      await secureGmailService.authenticateWithGmail();
    } catch (error) {
      console.error('Failed to connect Gmail:', error);
      alert('Failed to connect Gmail. Please try again.');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
            <p>Loading email sender...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isGmailConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Mail className='h-5 w-5' />
            Email Sender
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center py-8'>
          <AlertCircle className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
          <h3 className='text-lg font-medium mb-2'>Gmail Not Connected</h3>
          <p className='text-muted-foreground mb-6'>
            Connect your Gmail account to send emails
          </p>
          <Button onClick={connectGmail}>
            <Mail className='mr-2 h-4 w-4' />
            Connect Gmail
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Send className='h-5 w-5' />
            Send Email
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Person Selection */}
          <div className='space-y-2'>
            <Label htmlFor='person'>Select Person</Label>
            <Select value={selectedPersonId} onValueChange={handlePersonSelect}>
              <SelectTrigger>
                <SelectValue placeholder='Choose a person to email' />
              </SelectTrigger>
              <SelectContent>
                {people.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      <span>{person.name}</span>
                      <span className='text-muted-foreground'>
                        ({person.email_address})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Selection */}
          <div className='space-y-2'>
            <Label htmlFor='template'>Email Template (Optional)</Label>
            <Select
              value={selectedTemplate?.id || ''}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose a template or write custom email' />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4' />
                      <span>{template.name}</span>
                      <Badge variant='outline' className='text-xs'>
                        {template.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Email Content */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='subject'>Subject Line</Label>
              <Input
                id='subject'
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                placeholder='Enter email subject'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='body'>Email Body</Label>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={generatePreview}
                    disabled={!selectedTemplate || !selectedPersonId}
                  >
                    <Eye className='mr-2 h-4 w-4' />
                    Preview
                  </Button>
                </div>
              </div>
              <textarea
                id='body'
                value={customBody}
                onChange={e => setCustomBody(e.target.value)}
                placeholder='Write your email content here...'
                rows={8}
                className='w-full p-3 border rounded-md resize-none'
              />
            </div>
          </div>

          <Separator />

          {/* Send Button */}
          <div className='flex justify-end'>
            <Button
              onClick={handleSendEmail}
              disabled={
                sending || !selectedPersonId || !customSubject || !customBody
              }
              className='min-w-[120px]'
            >
              {sending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  <Send className='mr-2 h-4 w-4' />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              Preview how your email will look to the recipient
            </DialogDescription>
          </DialogHeader>
          {previewContent && (
            <ScrollArea className='max-h-[60vh]'>
              <div className='space-y-4'>
                <div>
                  <Label className='text-sm font-medium'>Subject</Label>
                  <div className='p-3 bg-muted rounded-md text-sm'>
                    {previewContent.subject}
                  </div>
                </div>
                <div>
                  <Label className='text-sm font-medium'>Body</Label>
                  <div className='p-4 border rounded-md bg-white'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: previewContent.bodyHtml,
                      }}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
