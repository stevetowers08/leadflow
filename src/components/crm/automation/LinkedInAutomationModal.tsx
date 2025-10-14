import { StatusBadge } from "@/components/StatusBadge";
import { FloatingSuccessCard } from "@/components/utils/FloatingSuccessCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, MessageSquare, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

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

interface LinkedInAutomationModalProps {
  selectedLeads: Lead[];
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  companyName?: string;
}

export function LinkedInAutomationModal({ 
  selectedLeads, 
  isOpen, 
  onClose, 
  jobTitle,
  companyName 
}: LinkedInAutomationModalProps) {
  const [automationLoading, setAutomationLoading] = useState(false);
  const [automationMessages, setAutomationMessages] = useState<{[key: string]: string}>({});
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize automation messages when modal opens
  useEffect(() => {
    if (isOpen && selectedLeads && Array.isArray(selectedLeads) && selectedLeads.length > 0) {
      const initialMessages: {[key: string]: string} = {};
      selectedLeads.forEach(lead => {
        const hasLinkedInMessage = lead["LinkedIn Request Message"] && lead["LinkedIn Request Message"].trim();
        const defaultMessage = hasLinkedInMessage || 
          `Hi ${lead.Name?.split(' ')[0] || 'there'},\n\nI came across your profile and noticed your experience as a ${lead["Company Role"] || 'professional'} at ${lead.Company || companyName}. ${jobTitle ? `We have an exciting opportunity for a ${jobTitle} role that might interest you.` : 'I\'d love to connect and discuss potential opportunities.'}\n\nWould you be open to a brief conversation?\n\nBest regards`;
        initialMessages[lead.id] = defaultMessage;
      });
      setAutomationMessages(initialMessages);
    }
  }, [isOpen, selectedLeads, jobTitle, companyName]);

  // Handle message changes
  const handleMessageChange = (leadId: string, message: string) => {
    setAutomationMessages(prev => ({
      ...prev,
      [leadId]: message
    }));
  };

  // Send to webhook
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

    // Send webhook payload

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

  // Handle automation confirmation
  const handleAutomationConfirm = async () => {
    setAutomationLoading(true);
    
    try {
      // Update each lead with their LinkedIn message and set automation status
      const updates = selectedLeads.map(lead => 
        supabase
          .from("people")
          .update({
            linkedin_request_message: automationMessages[lead.id],
            automation_started_at: new Date().toISOString(),
            stage: "contacted"
          })
          .eq("id", lead.id)
      );

      await Promise.all(updates);

      // Auto-assign company to current user when leads are sent to automation
      if (user?.id && companyName) {
        try {
          const { error: companyError } = await supabase
            .from("companies")
            .update({ 
              owner_id: user.id,
              pipeline_stage: "automated" // Also update company stage to automated
            })
            .eq("name", companyName);

          if (companyError) {
            console.error("Error auto-assigning company:", companyError);
          }
        } catch (error) {
          console.error("Error in company auto-assignment:", error);
        }
      }

      // Send each lead to webhook
      const webhookPromises = selectedLeads.map(lead => 
        sendToWebhook(lead, automationMessages[lead.id])
      );

      try {
        const webhookResults = await Promise.allSettled(webhookPromises);
        const successful = webhookResults.filter(result => result.status === 'fulfilled').length;
        const failed = webhookResults.filter(result => result.status === 'rejected').length;
        
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

      // Show floating success card
      setShowSuccessCard(true);

      // Close modal and reset
      onClose();
      
    } catch (error) {
      console.error("Automation error:", error);
      toast({
        title: "Error",
        description: "Failed to add leads to automation",
        variant: "destructive",
      });
    } finally {
      setAutomationLoading(false);
    }
  };

  if (!isOpen) return null;

  // Safety check for selectedLeads
  if (!selectedLeads || !Array.isArray(selectedLeads)) {
    console.error("❌ selectedLeads is not a valid array:", selectedLeads);
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-sm text-gray-600 mb-4">No valid leads selected for automation.</p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-sidebar-primary" />
                LinkedIn Automation
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected for automation
                {jobTitle && (
                  <span className="ml-2 text-sidebar-primary font-medium">
                    • Job: {jobTitle} at {companyName}
                  </span>
                )}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6">
            {selectedLeads.map((lead, index) => (
              <div key={lead.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                {/* Lead Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sidebar-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-sidebar-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">{lead.Name}</div>
                      <div className="text-sm text-gray-600">
                        {lead["Company Role"]} at {lead.Company}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {lead["Employee Location"]} • {lead["Email Address"]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead["LinkedIn URL"] ? (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        <span>LinkedIn Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium">
                        <XCircle className="h-3 w-3" />
                        <span>No LinkedIn</span>
                      </div>
                    )}
                    <StatusBadge status={lead.Stage || "new"} size="sm" />
                  </div>
                </div>
                
                {/* All 3 LinkedIn Messages */}
                <div className="space-y-4">
                  {/* Connection Request Message */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Connection Request Message
                    </label>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      rows={4}
                      value={automationMessages[lead.id] || ''}
                      onChange={(e) => handleMessageChange(lead.id, e.target.value)}
                      placeholder="Hi [Name], I'd like to connect and discuss potential opportunities..."
                      style={{ minHeight: '100px' }}
                      autoFocus={false}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      This message will be sent when requesting to connect on LinkedIn
                    </div>
                  </div>

                  {/* Connected Message */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      After Connection Message
                    </label>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-gray-50 resize-none"
                      rows={3}
                      value={(lead["LinkedIn Connected Message"] && lead["LinkedIn Connected Message"].trim()) || `Thank you for connecting! I'd love to learn more about your experience at ${lead.Company || 'your company'}.`}
                      readOnly
                      style={{ minHeight: '80px' }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      This message will be sent automatically after they accept your connection
                    </div>
                  </div>

                  {/* Follow Up Message */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Follow Up Message
                    </label>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-gray-50 resize-none"
                      rows={3}
                      value={(lead["LinkedIn Follow Up Message"] && lead["LinkedIn Follow Up Message"].trim()) || `Following up on our connection. I hope you're doing well!`}
                      readOnly
                      style={{ minHeight: '80px' }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      This message will be sent as a follow-up after the initial connection
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {selectedLeads.filter(lead => lead["LinkedIn URL"]).length} of {selectedLeads.length}
              </span> leads have LinkedIn profiles
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAutomationConfirm}
                disabled={automationLoading}
                className="px-6 py-3 text-sm bg-sidebar-primary text-sidebar-primary-foreground rounded-lg hover:bg-sidebar-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors min-w-[160px]"
              >
                {automationLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Starting...
                  </div>
                ) : (
                  `Start Automation (${selectedLeads.length})`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Success Card */}
      <FloatingSuccessCard
        isVisible={showSuccessCard}
        onClose={() => setShowSuccessCard(false)}
        title="Automation Started!"
        description={`${selectedLeads.length} lead${selectedLeads.length !== 1 ? 's' : ''} successfully added to automation queue and sent to n8n for processing.`}
        leadCount={selectedLeads.length}
        duration={5000}
      />
    </div>
  );
}

export default LinkedInAutomationModal;