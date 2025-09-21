import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { LinkedInConfirmationModal } from "@/components/LinkedInConfirmationModal";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { useLeadStageDropdown, FALLBACK_LEAD_STAGE_OPTIONS } from "@/hooks/useDropdownOptions";
import { Search, X, Edit, Mail, Bot, MessageSquare, Zap } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
  automation_status_enum: string | null;
  "Automation Status": string | null;
  created_at: string;
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
  
  // Database-driven dropdowns
  const { options: leadStageOptions, loading: leadStageLoading } = useLeadStageDropdown();

  // Get company filter from URL params (when navigating from companies page)
  useEffect(() => {
    const company = searchParams.get('company');
    if (company) {
      setCompanyFilter(company);
    }
  }, [searchParams]);

  // Filter leads based on search term, status, and company
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Email Address"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Company Role"]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (lead.Stage === statusFilter) ||
      (lead.stage_enum === statusFilter);
    
    const matchesCompany = !companyFilter || 
      lead.Company?.toLowerCase().includes(companyFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCompanyFilter("");
    setSearchParams({});
  };

  const fetchLeads = async () => {
    try {
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
          automation_status_enum,
          "Automation Status",
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log('Fetched leads data:', data);
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
  }, []);

  // Automation handlers
  const handleAutomateLeads = (leads: Lead[]) => {
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

  const handleConfirmAutomation = () => {
    fetchLeads(); // Refresh leads after automation
    setShowAutomationModal(false);
    setSelectedLeadsForAutomation([]);
  };

  const handleSingleLeadAutomation = async (lead: Lead) => {
    console.log('handleSingleLeadAutomation called with lead:', lead);
    console.log('Lead LinkedIn URL:', lead["LinkedIn URL"]);
    
    if (!lead["LinkedIn URL"]) {
      console.log('No LinkedIn URL found, showing error toast');
      toast({
        title: "No LinkedIn Profile",
        description: "This lead doesn't have a LinkedIn profile for automation",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Setting up automation modal for lead:', lead.Name);
    setSelectedLeadsForAutomation([lead]);
    setShowAutomationModal(true);
    console.log('Modal state should be true now');
  };

  const columns = [
    {
      key: "Stage",
      label: "Status",
      render: (lead: Lead) => (
        <div className="flex justify-center">
          <div className="w-28 flex justify-center">
            <StatusBadge 
              status={lead.Stage || lead.stage_enum || "NEW LEAD"} 
              size="sm"
              className="shadow-sm"
            />
          </div>
        </div>
      ),
    },
    {
      key: "Name",
      label: "Lead Name",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-xs">{lead.Name}</span>
          {lead["Company Role"] && (
            <span className="text-xs text-muted-foreground opacity-75">{lead["Company Role"]}</span>
          )}
        </div>
      ),
    },
    {
      key: "Company",
      label: "Company",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-xs">{lead.Company || "-"}</span>
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
      render: (lead: Lead) => (
        <div className="text-center">
          <AIScoreBadge
            leadData={{
              name: lead.Name || "",
              company: lead.Company || "",
              role: lead["Company Role"] || "",
              location: lead["Employee Location"] || "",
              industry: lead.Industry,
              company_size: "Unknown"
            }}
            initialScore={lead["Lead Score"] ? parseInt(lead["Lead Score"]) : undefined}
            showDetails={false}
          />
        </div>
      ),
    },
    {
      key: "LinkedIn URL",
      label: "LinkedIn",
      render: (lead: Lead) => (
        lead["LinkedIn URL"] ? (
          <a 
            href={lead["LinkedIn URL"]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
            </svg>
            View
          </a>
        ) : <span className="text-muted-foreground text-xs">-</span>
      ),
    },
    {
      key: "automation_status_enum",
      label: "Automation",
      render: (lead: Lead) => {
        const status = lead.automation_status_enum || lead["Automation Status"];
        
        if (!status || status === "idle") {
          return (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bot className="h-3 w-3" />
              <span className="text-xs">Not Automated</span>
            </div>
          );
        }
        
        let color = "bg-blue-100 text-blue-700";
        if (status === "running") color = "bg-green-100 text-green-700";
        else if (status === "completed") color = "bg-purple-100 text-purple-700";
        else if (status === "paused") color = "bg-orange-100 text-orange-700";
        else if (status === "failed") color = "bg-red-100 text-red-700";
        else if (status === "queued") color = "bg-yellow-100 text-yellow-700";
        
        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            <Bot className="h-3 w-3" />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (lead: Lead) => {
        const automationStatus = lead.automation_status_enum || lead["Automation Status"];
        const hasLinkedIn = !!lead["LinkedIn URL"];
        
        console.log('Rendering actions for lead:', lead.Name, {
          hasLinkedIn,
          automationStatus,
          linkedinUrl: lead["LinkedIn URL"]
        });
        
        return (
          <div className="flex gap-1">
            {/* Debug button - always visible for testing */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                console.log('DEBUG: Test button clicked for lead:', lead.Name);
                console.log('Lead data:', lead);
                e.stopPropagation();
                handleSingleLeadAutomation(lead);
              }}
              className="h-7 px-2 text-xs bg-yellow-100"
            >
              <Zap className="h-3 w-3 mr-1" />
              Test
            </Button>
            
            {hasLinkedIn && (!automationStatus || automationStatus === "idle") && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  console.log('Automate button clicked for lead:', lead.Name);
                  e.stopPropagation();
                  handleSingleLeadAutomation(lead);
                }}
                className="h-7 px-2 text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Automate
              </Button>
            )}
            {automationStatus && automationStatus !== "idle" && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toast({
                    title: "Automation Active",
                    description: `This lead is currently ${automationStatus}. Manage it in the Automations page.`,
                  });
                }}
                className="h-7 px-2 text-xs"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Active
              </Button>
            )}
          </div>
        );
      },
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
          <h1 className="text-lg font-semibold tracking-tight">Leads</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your recruitment leads and their stages
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
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
              ...(leadStageOptions.length > 0 ? leadStageOptions : FALLBACK_LEAD_STAGE_OPTIONS)
            ]}
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}
            placeholder="Filter by status"
            loading={leadStageLoading}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3"
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
              icon: Bot,
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
                      .update({ Stage: newStatus, stage_enum: newStatus })
                      .eq("id", lead.id);
                  }
                  fetchLeads(); // Refresh data
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
      
      <LinkedInConfirmationModal
        selectedLeads={selectedLeadsForAutomation}
        isOpen={showAutomationModal}
        onClose={() => {
          console.log('Modal closing');
          setShowAutomationModal(false);
          setSelectedLeadsForAutomation([]);
        }}
        onConfirm={handleConfirmAutomation}
        jobTitle="Lead Outreach"
        companyName="General Outreach"
      />
      
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