import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { LEAD_STAGE_OPTIONS } from "@/hooks/useDropdownOptions";
import { Search, X, Bot, UserCheck, MessageSquare, Clock } from "lucide-react";

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
  created_at: string;
  automation_status?: string;
  days_since_update?: number;
}

const Automations = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const { toast } = useToast();

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
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Process leads to add automation status and days since update
      const processedLeads = (data || []).map(lead => {
        const createdAt = new Date(lead.created_at);
        const daysSinceUpdate = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        
        let automationStatus = "active";
        if (lead.Stage === "contacted" || lead.stage_enum === "contacted") {
          automationStatus = "contacted";
        } else if (lead.Stage === "qualified" || lead.stage_enum === "qualified") {
          automationStatus = "qualified";
        } else if (daysSinceUpdate > 7) {
          automationStatus = "needs_update";
        }
        
        return {
          ...lead,
          automation_status: automationStatus,
          days_since_update: daysSinceUpdate
        };
      });
      
      setLeads(processedLeads);
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

  // Filter leads based on search term, status, and priority
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Email Address"]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (lead.Stage === statusFilter) ||
      (lead.stage_enum === statusFilter);
      
    const matchesPriority = !priorityFilter || 
      lead.priority_enum === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  const handleAutomationAction = async (leadId: string, action: string) => {
    try {
      let updateData: any = {};
      
      switch (action) {
        case "contact":
          updateData = { Stage: "contacted", stage_enum: "contacted" };
          break;
        case "qualify":
          updateData = { Stage: "qualified", stage_enum: "qualified" };
          break;
        case "follow_up":
          updateData = { Stage: "interview", stage_enum: "interview" };
          break;
        default:
          return;
      }

      const { error } = await supabase
        .from("People")
        .update(updateData)
        .eq("id", leadId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Lead status updated to ${updateData.Stage}`,
      });
      
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: "Name",
      label: "Lead Name",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{lead.Name}</span>
          <span className="text-xs text-muted-foreground">{lead["Company Role"] || "No role"}</span>
        </div>
      ),
    },
    {
      key: "Company",
      label: "Company",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{lead.Company || "-"}</span>
          <span className="text-xs text-muted-foreground">{lead["Employee Location"] || ""}</span>
        </div>
      ),
    },
    {
      key: "Stage",
      label: "Current Status",
      render: (lead: Lead) => (
        <StatusBadge status={lead.Stage || lead.stage_enum || "NEW LEAD"} size="sm" />
      ),
    },
    {
      key: "automation_status",
      label: "Automation Status",
      render: (lead: Lead) => {
        const status = lead.automation_status || "active";
        let icon = <Bot className="h-3 w-3" />;
        let color = "bg-blue-100 text-blue-700";
        
        if (status === "contacted") {
          icon = <MessageSquare className="h-3 w-3" />;
          color = "bg-green-100 text-green-700";
        } else if (status === "qualified") {
          icon = <UserCheck className="h-3 w-3" />;
          color = "bg-purple-100 text-purple-700";
        } else if (status === "needs_update") {
          icon = <Clock className="h-3 w-3" />;
          color = "bg-orange-100 text-orange-700";
        }
        
        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {icon}
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </div>
        );
      },
    },
    {
      key: "days_since_update",
      label: "Days Since Update",
      render: (lead: Lead) => {
        const days = lead.days_since_update || 0;
        let color = "text-green-600";
        if (days > 7) color = "text-orange-600";
        if (days > 14) color = "text-red-600";
        
        return (
          <span className={`text-sm font-medium ${color}`}>
            {days} days
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Quick Actions",
      render: (lead: Lead) => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAutomationAction(lead.id, "contact");
            }}
            className="h-7 px-2 text-xs"
          >
            Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAutomationAction(lead.id, "follow_up");
            }}
            className="h-7 px-2 text-xs"
          >
            Follow Up
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
        <div className="border-b pb-3">
          <h1 className="text-lg font-semibold tracking-tight">Automations</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage automated outreach campaigns and sequences
        </p>
        </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search automations..."
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
            onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}
            placeholder="Filter by status"
          />
          
          <DropdownSelect
            options={[
              { label: "All Priorities", value: "all" },
              { label: "High", value: "HIGH" },
              { label: "Medium", value: "MEDIUM" },
              { label: "Low", value: "LOW" }
            ]}
            value={priorityFilter || "all"}
            onValueChange={(value) => setPriorityFilter(value === "all" ? "" : value)}
            placeholder="Filter by priority"
          />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3"
          onClick={clearFilters}
          disabled={!searchTerm && !statusFilter && !priorityFilter}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
        
          <Button 
            variant="outline"
            className="h-9 px-4"
            onClick={() => {
              toast({
                title: "Bulk Actions",
                description: "Bulk automation actions will be available soon",
              });
            }}
          >
            <Bot className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
      </div>

        {/* Active Filters Display */}
        {(statusFilter || priorityFilter) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Active filters:</span>
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
            {priorityFilter && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                <span>Priority: {priorityFilter}</span>
                <button 
                  onClick={() => setPriorityFilter("")}
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
          onRowClick={(lead) => {
            toast({
              title: "Lead Details",
              description: "Detailed lead view will be available soon",
            });
          }}
          showSearch={false}
        />
    </div>
  );
};

export default Automations;