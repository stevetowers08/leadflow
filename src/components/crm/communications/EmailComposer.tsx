import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Paperclip } from 'lucide-react';
import { gmailService, SendEmailRequest } from '../services/gmailService';
import { Tables } from '../integrations/supabase/types';

interface EmailComposerProps {
  selectedPerson?: Tables<'people'>;
  onSent?: () => void;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ 
  selectedPerson, 
  onSent 
}) => {
  const [formData, setFormData] = useState({
    to: selectedPerson?.email_address || '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  React.useEffect(() => {
    loadTemplates();
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
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body_text || template.body_html,
      }));
    }
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      return;
    }

    setIsSending(true);
    try {
      const request: SendEmailRequest = {
        to: formData.to.split(',').map(email => email.trim()),
        cc: formData.cc ? formData.cc.split(',').map(email => email.trim()) : undefined,
        bcc: formData.bcc ? formData.bcc.split(',').map(email => email.trim()) : undefined,
        subject: formData.subject,
        body: formData.body,
        personId: selectedPerson?.id,
      };

      await gmailService.sendEmail(request);
      
      // Reset form
      setFormData({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
      });
      
      onSent?.();
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
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

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            value={formData.to}
            onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
            placeholder="recipient@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cc">CC</Label>
          <Input
            id="cc"
            value={formData.cc}
            onChange={(e) => setFormData(prev => ({ ...prev, cc: e.target.value }))}
            placeholder="cc@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bcc">BCC</Label>
          <Input
            id="bcc"
            value={formData.bcc}
            onChange={(e) => setFormData(prev => ({ ...prev, bcc: e.target.value }))}
            placeholder="bcc@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Email subject"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Message</Label>
          <Textarea
            id="body"
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Type your message here..."
            rows={8}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={isSending || !formData.to || !formData.subject || !formData.body}
            className="flex-1"
          >
            {isSending ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};








