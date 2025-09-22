import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useLeadStageDropdown, FALLBACK_LEAD_STAGE_OPTIONS } from "@/hooks/useDropdownOptions";
import { Search, X, Edit, Mail, MessageSquare, Zap } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// Stage options that match the actual Stage field text values in the People table
const LEAD_STAGE_OPTIONS = [
  { value: 'NEW LEAD', label: 'NEW LEAD' },
  { value: 'IN QUEUE', label: 'IN QUEUE' },
  { value: 'CONNECT SENT', label: 'CONNECT SENT' },
  { value: 'MSG SENT', label: 'MSG SENT' },
  { value: 'CONNECTED', label: 'CONNECTED' },
  { value: 'REPLIED', label: 'REPLIED' },
  { value: 'LEAD LOST', label: 'LEAD LOST' },
  { value: 'contacted', label: 'contacted' }
];

interface Lead {
  id: string;
  Name: string;
  Company: string | null;
  "Email Address": string | null;
  "Employee Location": string | null;
  "Company Role": string | null;
  Stage: string | null;
  stage_enum: string | null;
  priority_enum: string | null;
  "Lead Score": string | null;
  "LinkedIn URL": string | null;
  "LinkedIn Request Message": string | null;
  "LinkedIn Connected Message": string | null;
  "LinkedIn Follow Up Message": string | null;
  automation_status_enum: string | null;
  "Automation Status": string | null;
  Created: string | null;
  Updated: string | null;
}

interface Company {
  id: string;
  name: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Automation states
  const [selectedLeadsForAutomation, setSelectedLeadsForAutomation] = useState<Lead[]>([]);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [messages, setMessages] = useState<{[key: string]: {request: string, connected: string, followUp: string}}>({});
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [automationLoading, setAutomationLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>("Created");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Using static stage options that match the STAGE field values

  // Data loaded successfully

  // Get company filter from URL params (when navigating from companies page)
  useEffect(() => {
    const company = searchParams.get('company');
    const status = searchParams.get('status');
    
    if (company) {
      setCompanyFilter(company);
    }
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  // Debounced search for better performance
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300, 0);

  // Memoized filtering for optimal performance
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !debouncedSearchTerm || 
        lead.Name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        lead.Company?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        lead["Email Address"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        lead["Company Role"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || 
        (lead.Stage?.toLowerCase() === statusFilter.toLowerCase());
      
      const matchesCompany = !companyFilter || 
        lead.Company?.toLowerCase().includes(companyFilter.toLowerCase());
      
      
      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [leads, debouncedSearchTerm, statusFilter, companyFilter]);
  
  // Filtering applied successfully

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCompanyFilter("");
    setSearchParams({});
  };

  const fetchLeads = async () => {
    try {
      // OPTIMIZED: Fetch only essential fields for the table view
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Email Address",
          "Employee Location", 
          "Company Role",
          Stage,
          stage_enum,
          priority_enum,
          "Lead Score",
          "LinkedIn URL",
          "LinkedIn Request Message",
          "LinkedIn Connected Message",
          "LinkedIn Follow Up Message",
          automation_status_enum,
          "Automation Status",
          Created,
          Updated
        `)
        .order(sortBy, { ascending: sortDirection === "asc" })
        .limit(200); // Increased limit to show more diverse records

      if (error) throw error;
      
      // Data fetched successfully
      
      setLeads(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [sortBy, sortDirection]);

  // Automation handlers
  const handleAutomateLeads = async (leads: Lead[]) => {
    // Filter leads that have LinkedIn URLs
    const linkedInLeads = leads.filter(lead => lead["LinkedIn URL"]);
    
    if (linkedInLeads.length === 0) {
      toast({
        title: "No LinkedIn Profiles",
        description: "Selected leads don't have LinkedIn profiles for automation",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedLeadsForAutomation(linkedInLeads);
    setShowAutomationModal(true);
  };

  const handleConfirmAutomation = async () => {
    setAutomationLoading(true);
    
    try {
      // Send each lead to the webhook
      const promises = selectedLeadsForAutomation.map(lead => 
        sendToWebhook(lead, messages[lead.id] || {request: '', connected: '', followUp: ''})
      );
      
      await Promise.all(promises);
      
      // Update lead automation status in database
      const leadIds = selectedLeadsForAutomation.map(lead => lead.id);
      const { error } = await supabase
        .from('People')
        .update({ 
          automation_status_enum: 'queued',
          "Automation Status": 'Automation Triggered',
          updated_at: new Date().toISOString()
        })
        .in('id', leadIds);

      if (error) {
        console.error('Database update error:', error);
      }

      setShowAutomationModal(false);
      setSelectedLeadsForAutomation([]);
      setMessages({});
      setSelectedCampaign("");
      
      toast({
        title: "Success",
        description: `${selectedLeadsForAutomation.length} lead(s) added to automation queue and sent to n8n`,
      });
      
      fetchLeads(); // Refresh leads after automation
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add leads to automation",
        variant: "destructive",
      });
    } finally {
      setAutomationLoading(false);
    }
  };

  const handleSingleLeadAutomation = async (lead: Lead) => {
    if (!lead["LinkedIn URL"]) {
      toast({
        title: "No LinkedIn Profile",
        description: "This lead doesn't have a LinkedIn profile for automation",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedLeadsForAutomation([lead]);
    setShowAutomationModal(true);
  };

  // Initialize messages for each lead
  const initializeMessages = () => {
    const initialMessages: {[key: string]: {request: string, connected: string, followUp: string}} = {};
    selectedLeadsForAutomation.forEach(lead => {
      // Only use existing messages from database, leave empty if none exist
      initialMessages[lead.id] = {
        request: lead["LinkedIn Request Message"] || '',
        connected: lead["LinkedIn Connected Message"] || '',
        followUp: lead["LinkedIn Follow Up Message"] || ''
      };
    });
    setMessages(initialMessages);
  };

  // Initialize messages when modal opens
  useEffect(() => {
    if (showAutomationModal && selectedLeadsForAutomation.length > 0) {
      initializeMessages();
    }
  }, [showAutomationModal, selectedLeadsForAutomation]);

  const handleMessageChange = (leadId: string, messageType: 'request' | 'connected' | 'followUp', message: string) => {
    setMessages(prev => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [messageType]: message
      }
    }));
  };

  const sendToWebhook = async (lead: Lead, leadMessages: {request: string, connected: string, followUp: string}) => {
    const webhookUrl = "https://n8n.srv814433.hstgr.cloud/webhook/crm";
    
    const webhookPayload = {
      timestamp: new Date().toISOString(),
      source: "crm_automation",
      action: "lead_automation_trigger",
      lead: {
        id: lead.id,
        name: lead.Name,
        company: lead.Company,
        role: lead["Company Role"],
        location: lead["Employee Location"],
        linkedin_url: lead["LinkedIn URL"],
        email: lead["Email Address"],
        stage: lead.Stage || lead.stage_enum,
        priority: lead.priority_enum,
        lead_score: lead["Lead Score"],
        automation_status: lead.automation_status_enum || lead["Automation Status"]
      },
      messages: {
        request_message: leadMessages.request,
        connected_message: leadMessages.connected,
        follow_up_message: leadMessages.followUp
      },
      campaign: selectedCampaign,
      automation_type: "linkedin_outreach"
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  };

  const columns = [
    {
      key: "Stage",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => {
        // Use ONLY the Stage field, no fallback
        const statusValue = lead.Stage;
        
        // Status badge rendered
        
        return (
          <div className="flex justify-center">
            <StatusBadge status={statusValue} />
          </div>
        );
      },
    },
    {
      key: "Name",
      label: "Lead Name",
      render: (lead: Lead) => (
        <div className="flex flex-col w-48 max-w-48">
          <span className="text-sm font-medium break-words">{lead.Name}</span>
          {lead["Company Role"] && (
            <span className="text-xs text-muted-foreground opacity-75 break-words">{lead["Company Role"]}</span>
          )}
        </div>
      ),
    },
    {
      key: "Company",
      label: "Company",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{lead.Company || "-"}</span>
          {lead["Employee Location"] && (
            <span className="text-xs text-muted-foreground opacity-75">
              {lead["Employee Location"]}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "AI Score",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => {
        // Use Lead Score from People table - same as Companies page
        const leadScore = lead["Lead Score"];
        
        // Debug: Check what Lead Score data we have
        console.log('Lead Score Debug for', lead.Name, ':', {
          leadScore: leadScore,
          leadScoreType: typeof leadScore,
          leadScoreValue: leadScore,
          parsedScore: leadScore ? parseInt(leadScore.toString()) : undefined,
          isNaN: leadScore ? isNaN(parseInt(leadScore.toString())) : true,
          allLeadFields: Object.keys(lead).filter(key => key.toLowerCase().includes('score')),
          allFields: Object.keys(lead), // Show ALL fields to see what's available
          fullLeadObject: lead
        });
        
        // Just display the Lead Score text directly
        if (!leadScore) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "No Lead Score",
                  description: "This lead doesn't have a score yet.",
                });
              }}
              className="h-6 px-2 text-xs"
            >
              Score
            </Button>
          );
        }
        
        // Show the actual Lead Score text in a badge
        const getScoreColor = (score: string) => {
          const scoreLower = score.toLowerCase();
          if (scoreLower.includes('very high')) return "bg-emerald-100 text-emerald-800 border-emerald-200";
          if (scoreLower.includes('high')) return "bg-green-100 text-green-800 border-green-200";
          if (scoreLower.includes('medium')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
          if (scoreLower.includes('low')) return "bg-red-100 text-red-800 border-red-200";
          return "bg-gray-100 text-gray-800 border-gray-200";
        };
        
        return (
          <span className={`inline-flex items-center justify-center w-20 h-6 rounded-full text-xs font-medium border ${getScoreColor(leadScore.toString())}`}>
            {leadScore}
          </span>
        );
      },
    },
    {
      key: "Created",
      label: "Created",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      sortable: true,
      render: (lead: Lead) => {
        if (!lead.Created) return <span className="text-xs text-muted-foreground">-</span>;
        
        // Display the Created text field directly
        return (
          <span className="text-xs text-muted-foreground">
            {lead.Created}
          </span>
        );
      },
    },
    {
      key: "Updated",
      label: "Updated",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      sortable: true,
      render: (lead: Lead) => {
        if (!lead.Updated) return <span className="text-xs text-muted-foreground">-</span>;
        
        // Display the Updated text field directly
        return (
          <span className="text-xs text-muted-foreground">
            {lead.Updated}
          </span>
        );
      },
    },
    {
      key: "LinkedIn URL",
      label: "LinkedIn",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "w-24",
      render: (lead: Lead) => (
        lead["LinkedIn URL"] ? (
          <Button
            variant="outline"
            size="xs"
            asChild
          >
            <a 
              href={lead["LinkedIn URL"]} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
              </svg>
              View
            </a>
          </Button>
        ) : <span className="text-muted-foreground text-xs">-</span>
      ),
    },
  ];

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h1 className="text-xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your recruitment leads and their stages
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          
          <DropdownSelect
            options={[
              { label: "All Statuses", value: "all" },
              ...LEAD_STAGE_OPTIONS
            ]}
            value={statusFilter || "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? "" : value);
            }}
            placeholder="Filter by status"
          />
          
          <DropdownSelect
            options={[
              { label: "Sort by Created (Newest)", value: "Created_desc" },
              { label: "Sort by Created (Oldest)", value: "Created_asc" },
              { label: "Sort by Updated (Newest)", value: "Updated_desc" },
              { label: "Sort by Updated (Oldest)", value: "Updated_asc" },
              { label: "Sort by Name (A-Z)", value: "Name_asc" },
              { label: "Sort by Name (Z-A)", value: "Name_desc" },
              { label: "Sort by Company (A-Z)", value: "Company_asc" },
              { label: "Sort by Company (Z-A)", value: "Company_desc" }
            ]}
            value={`${sortBy}_${sortDirection}`}
            onValueChange={(value) => {
              const [field, direction] = value.split('_');
              setSortBy(field);
              setSortDirection(direction as "asc" | "desc");
            }}
            placeholder="Sort by..."
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            disabled={!searchTerm && !statusFilter && !companyFilter}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
          
        </div>

        {/* Active Filters Display */}
        {(companyFilter || statusFilter) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Active filters:</span>
            {companyFilter && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                <span>Company: {companyFilter}</span>
                <button 
                  onClick={() => setCompanyFilter("")}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {statusFilter && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                <span>Status: {statusFilter}</span>
                <button 
                  onClick={() => setStatusFilter("")}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        <DataTable
          data={filteredLeads}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          showSearch={false}
          enableBulkActions={true}
          enableExport={true}
          exportFilename="leads-export.csv"
          itemName="lead"
          itemNamePlural="leads"
          bulkActions={[
            {
              id: 'automate-leads',
              label: 'Automate LinkedIn',
              icon: Zap,
              action: handleAutomateLeads,
              variant: 'default'
            },
            {
              id: 'update-status',
              label: 'Update Status',
              icon: Edit,
              action: async (leads) => {
                const newStatus = prompt('Enter new status:');
                if (newStatus) {
                  // Update leads in database
                  for (const lead of leads) {
                    await supabase
                      .from("People")
                      .update({ Stage: newStatus })
                      .eq("id", lead.id);
                  }
                  await fetchLeads(); // Refresh data
                }
              },
              variant: 'secondary'
            },
            {
              id: 'send-email',
              label: 'Send Email',
              icon: Mail,
              action: async (leads) => {
                const emailSubject = prompt('Enter email subject:');
                const emailBody = prompt('Enter email body:');
                if (emailSubject && emailBody) {
                  // In a real app, you'd integrate with email service
                  console.log('Sending emails to:', leads.map(l => l["Email Address"]));
                  toast({
                    title: "Emails Queued",
                    description: `Email queued for ${leads.length} leads`,
                  });
                }
              },
              variant: 'secondary'
            }
          ]}
        />
      </div>
      
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }}
      />
      
      {/* Enhanced Automation Modal */}
      {showAutomationModal && (
        <Dialog open={showAutomationModal} onOpenChange={() => setShowAutomationModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{ zIndex: 999999 }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                LinkedIn Automation
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Campaign Selection */}
              <div className="space-y-2">
                <Label htmlFor="campaign-select" className="text-sm font-medium">
                  Select Campaign:
                </Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger id="campaign-select" className="w-full">
                    <SelectValue placeholder="Choose a campaign..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-recruitment">Tech Recruitment</SelectItem>
                    <SelectItem value="sales-outreach">Sales Outreach</SelectItem>
                    <SelectItem value="marketing-leads">Marketing Leads</SelectItem>
                    <SelectItem value="general-networking">General Networking</SelectItem>
                    <SelectItem value="custom-campaign">Custom Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Leads with LinkedIn Messages */}
              <div>
                <h3 className="font-medium mb-2">LinkedIn Messages ({selectedLeadsForAutomation.length})</h3>
                <ScrollArea className="h-96 border rounded-lg p-2">
                  <div className="space-y-4">
                    {selectedLeadsForAutomation.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{lead.Name}</div>
                            <div className="text-xs text-gray-600">
                              {lead["Company Role"]} • {lead["Employee Location"]}
                            </div>
                          </div>
                          <StatusBadge 
                            status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          {/* Request Message */}
                          <div>
                            <Label htmlFor={`request-${lead.id}`} className="text-xs font-medium text-gray-700">
                              Connection Request Message:
                            </Label>
                            <Textarea
                              id={`request-${lead.id}`}
                              value={messages[lead.id]?.request || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'request', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your connection request message..."
                            />
                          </div>

                          {/* Connected Message */}
                          <div>
                            <Label htmlFor={`connected-${lead.id}`} className="text-xs font-medium text-gray-700">
                              After Connection Message:
                            </Label>
                            <Textarea
                              id={`connected-${lead.id}`}
                              value={messages[lead.id]?.connected || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'connected', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your message after they accept..."
                            />
                          </div>

                          {/* Follow Up Message */}
                          <div>
                            <Label htmlFor={`followup-${lead.id}`} className="text-xs font-medium text-gray-700">
                              Follow Up Message:
                            </Label>
                            <Textarea
                              id={`followup-${lead.id}`}
                              value={messages[lead.id]?.followUp || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'followUp', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your follow up message..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowAutomationModal(false);
                    setSelectedLeadsForAutomation([]);
                    setMessages({});
                    setSelectedCampaign("");
                  }}
                  disabled={automationLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmAutomation}
                  disabled={automationLoading || !selectedCampaign}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {automationLoading ? "Starting Automation..." : "Start Automation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded">
          Modal Open: {showAutomationModal.toString()}<br/>
          Selected Leads: {selectedLeadsForAutomation.length}
        </div>
      )}
    </>
  );
};

export default Leads;