import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, MessageSquare, CheckCircle, XCircle } from "lucide-react";

interface Lead {
  id: string;
  Name: string;
  Company: string | null;
  "Company Role": string | null;
  "Email Address": string | null;
  "Employee Location": string | null;
  "LinkedIn URL": string | null;
  "LinkedIn Request Message": string | null;
  "LinkedIn Connected Message": string | null;
  "LinkedIn Follow Up Message": string | null;
  Stage: string | null;
  stage_enum: string | null;
  priority_enum: string | null;
  "Lead Score": string | null;
  automation_status_enum: string | null;
  "Automation Status": string | null;
  created_at: string;
}

interface LinkedInConfirmationModalProps {
  selectedLeads: Lead[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle?: string;
  companyName?: string;
}

export function LinkedInConfirmationModal({ 
  selectedLeads, 
  isOpen, 
  onClose, 
  onConfirm,
  jobTitle,
  companyName 
}: LinkedInConfirmationModalProps) {
  const [messages, setMessages] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Debug logging
  console.log("LinkedInConfirmationModal opened with leads:", selectedLeads);

  // Initialize messages for each lead
  const initializeMessages = () => {
    const initialMessages: {[key: string]: string} = {};
    selectedLeads.forEach(lead => {
      // Use existing LinkedIn Request Message or create a default one
      const defaultMessage = lead["LinkedIn Request Message"] || 
        `Hi ${lead.Name?.split(' ')[0] || 'there'},\n\nI came across your profile and noticed your experience as a ${lead["Company Role"] || 'professional'} at ${lead.Company || companyName}. ${jobTitle ? `We have an exciting opportunity for a ${jobTitle} role that might interest you.` : 'I\'d love to connect and discuss potential opportunities.'}\n\nWould you be open to a brief conversation?\n\nBest regards`;
      initialMessages[lead.id] = defaultMessage;
    });
    setMessages(initialMessages);
  };

  // Initialize messages when modal opens
  useEffect(() => {
    if (isOpen && selectedLeads.length > 0) {
      initializeMessages();
    }
  }, [isOpen, selectedLeads]);

  const handleMessageChange = (leadId: string, message: string) => {
    setMessages(prev => ({
      ...prev,
      [leadId]: message
    }));
  };

  const sendToWebhook = async (lead: Lead, message: string) => {
    const webhookUrl = "https://n8n.srv814433.hstgr.cloud/webhook/crm";
    
    const webhookPayload = {
      timestamp: new Date().toISOString(),
      source: "crm_automation",
      action: "lead_automation_trigger",
      lead: {
        id: lead.id,
        name: lead.Name,
        company: lead.Company,
        companyRole: lead["Company Role"],
        email: lead["Email Address"],
        location: lead["Employee Location"],
        linkedinUrl: lead["LinkedIn URL"],
        stage: lead.Stage || lead.stage_enum,
        priority: lead.priority_enum,
        leadScore: lead["Lead Score"],
        automationStatus: lead.automation_status_enum || lead["Automation Status"],
        createdAt: lead.created_at,
        linkedinMessage: message,
        jobTitle: jobTitle,
        companyName: companyName
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CRM-Automation/1.0'
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Webhook error for lead:', lead.Name, error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    console.log("LinkedInConfirmationModal handleConfirm called with leads:", selectedLeads);
    setLoading(true);
    try {
      // Update each lead with their LinkedIn message and set automation status
      const updates = selectedLeads.map(lead => 
        supabase
          .from("People")
          .update({
            "LinkedIn Request Message": messages[lead.id],
            "Automation Status": "PENDING",
            automation_status_enum: "queued",
            "Stage": "contacted",
            stage_enum: "contacted"
          })
          .eq("id", lead.id)
      );

      await Promise.all(updates);
      console.log("Database updates completed");

      // Send each lead to webhook
      console.log("Sending webhooks for", selectedLeads.length, "leads");
      const webhookPromises = selectedLeads.map(lead => 
        sendToWebhook(lead, messages[lead.id])
      );

      try {
        const webhookResults = await Promise.allSettled(webhookPromises);
        const successful = webhookResults.filter(result => result.status === 'fulfilled').length;
        const failed = webhookResults.filter(result => result.status === 'rejected').length;
        
        console.log(`Webhook results: ${successful} successful, ${failed} failed`);
        
        if (failed > 0) {
          console.error('Failed webhooks:', webhookResults.filter(result => result.status === 'rejected'));
          toast({
            title: "Warning",
            description: `Leads updated but ${failed} webhook notification(s) failed`,
            variant: "destructive",
          });
        }
      } catch (webhookError) {
        console.error('Webhook processing error:', webhookError);
        toast({
          title: "Warning",
          description: "Leads updated but webhook notifications failed",
          variant: "destructive",
        });
      }

      toast({
        title: "Success",
        description: `${selectedLeads.length} lead(s) added to automation queue and sent to n8n`,
      });

      onConfirm();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add leads to automation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-4 w-4 text-primary" />
            LinkedIn Automation
            <span className="text-sm font-normal text-muted-foreground">
              ({selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {jobTitle && (
            <div className="p-2 bg-gray-50 rounded text-sm">
              <span className="font-medium">Job:</span> {jobTitle}
              {companyName && <span className="text-muted-foreground"> at {companyName}</span>}
            </div>
          )}

          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3 pr-2">
              {selectedLeads.map((lead, index) => (
                <div key={lead.id} className="space-y-2 p-3 border rounded">
                  {/* Lead Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{lead.Name}</h4>
                        <div className="text-xs text-gray-500">
                          {lead["Company Role"] && lead.Company && `${lead["Company Role"]} at ${lead.Company}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {lead["LinkedIn URL"] ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span className="text-xs">LinkedIn</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-3 w-3" />
                          <span className="text-xs">No LinkedIn</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* All 3 LinkedIn Messages */}
                  <div className="space-y-2">
                    {/* Connection Request Message */}
                    <div>
                      <Label htmlFor={`request-${lead.id}`} className="text-xs font-medium">
                        Connection Request
                      </Label>
                      <Textarea
                        id={`request-${lead.id}`}
                        value={messages[lead.id] || lead["LinkedIn Request Message"] || ''}
                        onChange={(e) => handleMessageChange(lead.id, e.target.value)}
                        rows={2}
                        className="text-xs mt-1"
                        placeholder="Hi [Name], I'd like to connect..."
                      />
                    </div>

                    {/* Connected Message */}
                    <div>
                      <Label htmlFor={`connected-${lead.id}`} className="text-xs font-medium">
                        After Connection
                      </Label>
                      <Textarea
                        id={`connected-${lead.id}`}
                        value={lead["LinkedIn Connected Message"] || 'Thank you for connecting! I\'d love to learn more about your experience at ' + (lead.Company || 'your company') + '.'}
                        rows={2}
                        className="text-xs mt-1 bg-gray-50"
                        placeholder="Thank you for connecting! I'd love to learn more about..."
                        readOnly
                      />
                    </div>

                    {/* Follow Up Message */}
                    <div>
                      <Label htmlFor={`followup-${lead.id}`} className="text-xs font-medium">
                        Follow Up
                      </Label>
                      <Textarea
                        id={`followup-${lead.id}`}
                        value={lead["LinkedIn Follow Up Message"] || 'Following up on our connection. I hope you\'re doing well!'}
                        rows={2}
                        className="text-xs mt-1 bg-gray-50"
                        placeholder="Following up on our connection..."
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-gray-500">
              {selectedLeads.filter(lead => lead["LinkedIn URL"]).length} of {selectedLeads.length} have LinkedIn
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading} size="sm" className="text-xs">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={loading || selectedLeads.length === 0}
                size="sm"
                className="text-xs min-w-[100px]"
              >
                {loading ? "Sending..." : `Automate ${selectedLeads.length}`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}