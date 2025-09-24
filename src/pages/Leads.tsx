import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search, X } from "lucide-react";
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
  Owner: string | null;
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
          Owner,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
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
      key: "Lead Score",
      label: "Score",
      render: (lead: Lead) => {
        const score = lead["Lead Score"];
        if (!score) return <span className="text-muted-foreground">-</span>;
        
        const numScore = parseInt(score);
        let scoreColor = "text-muted-foreground";
        let bgColor = "bg-muted/20";
        
        if (numScore >= 80) {
          scoreColor = "text-green-700";
          bgColor = "bg-green-100";
        } else if (numScore >= 60) {
          scoreColor = "text-yellow-700";
          bgColor = "bg-yellow-100";
        } else if (numScore >= 40) {
          scoreColor = "text-orange-700";
          bgColor = "bg-orange-100";
        } else if (numScore > 0) {
          scoreColor = "text-red-700";
          bgColor = "bg-red-100";
        }
        
        return (
          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${scoreColor} ${bgColor}`}>
            {score}
          </div>
        );
      },
    },
    {
      key: "Owner", 
      label: "Assigned To",
      render: (lead: Lead) => (
        lead.Owner ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {lead.Owner.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <span className="text-xs truncate max-w-[80px]">{lead.Owner.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )
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
              { label: "New Lead", value: "NEW LEAD" },
              { label: "Contacted", value: "CONTACTED" },
              { label: "Qualified", value: "QUALIFIED" },
              { label: "Lost", value: "LOST" }
            ]}
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}
            placeholder="Filter by status"
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
    </>
  );
};

export default Leads;