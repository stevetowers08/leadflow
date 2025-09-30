import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Users, X } from 'lucide-react';
import { Tables } from '../integrations/supabase/types';
import { EmailAutomationModal } from './EmailAutomationModal';

interface EmailBulkActionsProps {
  selectedLeads: Tables<'people'>[];
  onActionComplete: () => void;
}

export const EmailBulkActions: React.FC<EmailBulkActionsProps> = ({
  selectedLeads,
  onActionComplete,
}) => {
  const [showAutomationModal, setShowAutomationModal] = useState(false);

  const handleBulkEmail = () => {
    // In a real implementation, you'd open a bulk email composer
    console.log('Bulk email to:', selectedLeads.map(lead => lead.email_address));
    onActionComplete();
  };

  const handleAutomation = () => {
    setShowAutomationModal(true);
  };

  const handleAutomationComplete = () => {
    setShowAutomationModal(false);
    onActionComplete();
  };

  const validEmails = selectedLeads.filter(lead => lead.email_address);

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <Badge variant="secondary">
                {validEmails.length} with email addresses
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleBulkEmail}
                disabled={validEmails.length === 0}
                size="sm"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              
              <Button
                onClick={handleAutomation}
                disabled={validEmails.length === 0}
                size="sm"
              >
                <Send className="mr-2 h-4 w-4" />
                Create Automation
              </Button>
              
              <Button
                onClick={onActionComplete}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmailAutomationModal
        isOpen={showAutomationModal}
        onClose={() => setShowAutomationModal(false)}
        selectedPersonId={validEmails[0]?.id}
      />
    </>
  );
};