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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Confirm LinkedIn Messages
            <span className="text-sm font-normal text-muted-foreground">
              ({selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {jobTitle && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Job:</span> {jobTitle}
                {companyName && <span className="text-muted-foreground"> at {companyName}</span>}
              </p>
            </div>
          )}

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              {selectedLeads.map((lead, index) => (
                <div key={lead.id} className="space-y-4 p-4 border rounded-lg">
                  {/* Lead Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{lead.Name}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {lead["Company Role"] && (
                            <div>{lead["Company Role"]}</div>
                          )}
                          {lead.Company && (
                            <div>{lead.Company}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead["LinkedIn URL"] ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">LinkedIn Found</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs">No LinkedIn</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Editor */}
                  <div className="space-y-2">
                    <Label htmlFor={`message-${lead.id}`}>
                      LinkedIn Connection Message
                    </Label>
                    <Textarea
                      id={`message-${lead.id}`}
                      value={messages[lead.id] || ''}
                      onChange={(e) => handleMessageChange(lead.id, e.target.value)}
                      rows={6}
                      className="text-sm"
                      placeholder="Enter your LinkedIn connection request message..."
                    />
                    <div className="text-xs text-muted-foreground">
                      Character count: {(messages[lead.id] || '').length}/300
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedLeads.filter(lead => lead["LinkedIn URL"]).length} of {selectedLeads.length} leads have LinkedIn profiles
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={loading || selectedLeads.length === 0}
                className="min-w-[120px]"
              >
                {loading ? "Adding..." : `Add ${selectedLeads.length} to Automation`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}