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
import { EmailTemplate } from '@/services/secureGmailService';
import { Paperclip, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Tables } from '../../../integrations/supabase/types';
import { SendEmailRequest, gmailService } from '../../../services/gmailService';

interface EmailComposerProps {
  selectedPerson?: Tables<'people'>;
  onSent?: () => void;
  variant?: 'default' | 'compact';
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  selectedPerson,
  onSent,
  variant = 'default',
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    to: selectedPerson?.email_address || '',
    subject: '',
    body: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  useEffect(() => {
    if (selectedPerson?.email_address) {
      setFormData(prev => ({
        ...prev,
        to: selectedPerson.email_address || prev.to,
      }));
    }
  }, [selectedPerson?.email_address]);

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTemplates = async () => {
    try {
      const templateList = await gmailService.getEmailTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(type => type.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body_text || template.body_html,
      }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate email addresses
    const emailList = formData.to.split(',').map(email => email.trim()).filter(Boolean);
    const invalidEmails = emailList.filter(email => !validateEmail(email));
    
    if (invalidEmails.length > 0) {
      toast({
        title: 'Invalid Email Address',
        description: `Please enter valid email addresses: ${invalidEmails.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const request: SendEmailRequest = {
        to: emailList,
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        personId: selectedPerson?.id,
      };

      await gmailService.sendEmail(request);

      toast({
        title: 'Email Sent',
        description: `Email sent to ${formData.to}`,
      });

      // Reset form but preserve "to" field in compact mode
      setFormData({
        to: variant === 'compact' && selectedPerson?.email_address ? selectedPerson.email_address : '',
        subject: '',
        body: '',
      });

      onSent?.();
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: 'Failed to Send Email',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    variant === 'default' ? (
      <Card>
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>{children}</CardContent>
      </Card>
    ) : (
      <div className='space-y-2'>{children}</div>
    );

  return (
    <Wrapper>
      {templates.length > 0 && variant === 'default' && (
        <div className='space-y-2'>
          <Label htmlFor='template'>Template</Label>
          <Select onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue placeholder='Select a template' />
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
      )}

      <div className='space-y-1.5'>
        <Label htmlFor='to' className='text-sm'>To</Label>
        <Input
          id='to'
          value={formData.to}
          onChange={e =>
            setFormData(prev => ({ ...prev, to: e.target.value }))
          }
          placeholder='recipient@example.com'
          className={variant === 'compact' ? 'h-9' : ''}
        />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='subject' className='text-sm'>Subject</Label>
        <Input
          id='subject'
          value={formData.subject}
          onChange={e =>
            setFormData(prev => ({ ...prev, subject: e.target.value }))
          }
          placeholder='Enter subject...'
          className={variant === 'compact' ? 'h-9' : ''}
        />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='body' className='text-sm'>Message</Label>
        <Textarea
          id='body'
          value={formData.body}
          onChange={e =>
            setFormData(prev => ({ ...prev, body: e.target.value }))
          }
          placeholder='Start typing your email, or create a template'
          rows={variant === 'compact' ? 16 : 10}
          className='resize-none'
        />
      </div>

      <div className={`flex items-center gap-2 pt-1 ${variant === 'compact' ? 'justify-end' : ''}`}>
        <Button variant='ghost' size='sm' className='h-8' type='button'>
          <Paperclip className='h-4 w-4' />
        </Button>
        <Button
          onClick={handleSend}
          disabled={
            isSending || !formData.to || !formData.subject || !formData.body
          }
          className={variant === 'compact' ? 'h-8 px-4' : 'flex-1'}
          type='button'
        >
          {isSending ? (
            <>
              <Send className='h-4 w-4 mr-2 animate-spin' />
              Sending...
            </>
          ) : (
            <>
              <Send className='h-4 w-4 mr-2' />
              Send email
            </>
          )}
        </Button>
      </div>
    </Wrapper>
  );
};
