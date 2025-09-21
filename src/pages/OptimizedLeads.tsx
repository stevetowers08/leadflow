import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { EnhancedLeadDetailModal } from "@/components/EnhancedLeadDetailModal";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  X, 
  RefreshCw, 
  Users,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
  UserPlus,
  CheckCircle,
  Clock,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

interface Lead {
  id: string;
  Name: string;
  Company: string | null;
  "Company Role": string | null;
  "Employee Location": string | null;
  Stage: string | null;
  stage_enum: string | null;
  "Lead Score": string | null;
  priority_enum: string | null;
  automation_status_enum: string | null;
  "Request Message": string | null;
  "Connected Message": string | null;
  "Follow Up Message": string | null;
  "Message Sent": boolean | null;
  "Connection Request": boolean | null;
  "Connection Request Date": string | null;
  "Email Reply": boolean | null;
  "Meeting Booked": boolean | null;
  created_at: string;
}

interface LeadMetrics {
  totalLeads: number;
  newThisWeek: number;
  contacted: number;
  connected: number;
  meetingsBooked: number;
  highPriority: number;
  automated: number;
}

const OptimizedLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [automationFilter, setAutomationFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [metrics, setMetrics] = useState<LeadMetrics>({
    totalLeads: 0,
    newThisWeek: 0,
    contacted: 0,
    connected: 0,
    meetingsBooked: 0,
    highPriority: 0,
    automated: 0
  });
  const { toast } = useToast();

  // Calculate metrics
  const calculateMetrics = (leadsData: Lead[]) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const newThisWeek = leadsData.filter(lead => 
      new Date(lead.created_at) >= oneWeekAgo
    ).length;
    
    const contacted = leadsData.filter(lead => 
      lead["Message Sent"] === true
    ).length;
    
    const connected = leadsData.filter(lead => 
      lead["Connection Request"] === true
    ).length;
    
    const meetingsBooked = leadsData.filter(lead => 
      lead["Meeting Booked"] === true
    ).length;
    
    const highPriority = leadsData.filter(lead => 
      lead.priority_enum?.toLowerCase() === 'high'
    ).length;
    
    const automated = leadsData.filter(lead => 
      lead.automation_status_enum && lead.automation_status_enum !== 'idle'
    ).length;

    return {
      totalLeads: leadsData.length,
      newThisWeek,
      contacted,
      connected,
      meetingsBooked,
      highPriority,
      automated
    };
  };

  // Filter and sort leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Company Role"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Employee Location"]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = !companyFilter || 
      lead.Company?.toLowerCase().includes(companyFilter.toLowerCase());
    
    const matchesStage = !stageFilter || 
      lead.stage_enum?.toLowerCase() === stageFilter.toLowerCase();
    
    const matchesPriority = !priorityFilter || 
      lead.priority_enum?.toLowerCase() === priorityFilter.toLowerCase();
    
    const matchesAutomation = !automationFilter || 
      lead.automation_status_enum?.toLowerCase() === automationFilter.toLowerCase();
    
    const matchesLocation = !locationFilter || 
      lead["Employee Location"]?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCompany && matchesStage && matchesPriority && matchesAutomation && matchesLocation;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "created_at":
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case "name":
        comparison = (a.Name || "").localeCompare(b.Name || "");
        break;
      case "company":
        comparison = (a.Company || "").localeCompare(b.Company || "");
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority_enum?.toLowerCase() as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority_enum?.toLowerCase() as keyof typeof priorityOrder] || 0;
        comparison = aPriority - bPriority;
        break;
      case "score":
        comparison = (parseInt(a["Lead Score"] || "0")) - (parseInt(b["Lead Score"] || "0"));
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCompanyFilter("");
    setStageFilter("");
    setPriorityFilter("");
    setAutomationFilter("");
    setLocationFilter("");
  };

  const fetchLeads = async () => {
    try {
      // OPTIMIZED: Only fetch fields you actually use
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Company Role",
          "Employee Location",
          Stage,
          stage_enum,
          "Lead Score",
          priority_enum,
          automation_status_enum,
          "Request Message",
          "Connected Message",
          "Follow Up Message",
          "Message Sent",
          "Connection Request",
          "Connection Request Date",
          "Email Reply",
          "Meeting Booked",
          created_at
        `);

      if (error) throw error;
      
      setLeads(data || []);
      setMetrics(calculateMetrics(data || []));
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

  // Update metrics when leads change
  useEffect(() => {
    setMetrics(calculateMetrics(leads));
  }, [leads]);

  const columns = [
    {
      key: "Name",
      label: "Lead",
      render: (lead: Lead) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {lead.Name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="text-sm font-medium">{lead.Name || "-"}</div>
            <div className="text-xs text-muted-foreground">{lead["Company Role"] || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "Company",
      label: "Company",
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{lead.Company || "-"}</span>
        </div>
      ),
    },
    {
      key: "Location",
      label: "Location",
      render: (lead: Lead) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{lead["Employee Location"] || "-"}</span>
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
              industry: "Unknown",
              company_size: "Unknown"
            }}
            initialScore={lead["Lead Score"] ? parseInt(lead["Lead Score"]) : undefined}
            showDetails={false}
          />
        </div>
      ),
    },
    {
      key: "Stage",
      label: "Stage",
      render: (lead: Lead) => (
        <StatusBadge status={lead.stage_enum?.toLowerCase() || "new"} />
      ),
    },
    {
      key: "Priority",
      label: "Priority",
      render: (lead: Lead) => (
        <StatusBadge status={lead.priority_enum?.toLowerCase() || "medium"} />
      ),
    },
    {
      key: "LinkedIn Messages",
      label: "LinkedIn Messages",
      render: (lead: Lead) => (
        <div className="space-y-1">
          {lead["Request Message"] && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-blue-600" />
              <span className="text-xs">Request</span>
            </div>
          )}
          {lead["Connected Message"] && (
            <div className="flex items-center gap-1">
              <UserPlus className="h-3 w-3 text-green-600" />
              <span className="text-xs">Connected</span>
            </div>
          )}
          {lead["Follow Up Message"] && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-600" />
              <span className="text-xs">Follow Up</span>
            </div>
          )}
          {!lead["Request Message"] && !lead["Connected Message"] && !lead["Follow Up Message"] && (
            <span className="text-xs text-muted-foreground">No messages</span>
          )}
        </div>
      ),
    },
    {
      key: "Outreach Status",
      label: "Outreach Status",
      render: (lead: Lead) => (
        <div className="space-y-1">
          {lead["Message Sent"] && (
            <Badge variant="secondary" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Sent
            </Badge>
          )}
          {lead["Connection Request"] && (
            <Badge variant="outline" className="text-xs">
              <UserPlus className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
          {lead["Meeting Booked"] && (
            <Badge variant="default" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Meeting
            </Badge>
          )}
          {!lead["Message Sent"] && !lead["Connection Request"] && !lead["Meeting Booked"] && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "Automation",
      label: "Automation",
      render: (lead: Lead) => (
        <div className="text-center">
          {lead.automation_status_enum && lead.automation_status_enum !== 'idle' ? (
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {lead.automation_status_enum}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Manual
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      headerAlign: "center",
      cellAlign: "center",
      render: (lead: Lead) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLead(lead);
              setIsDetailModalOpen(true);
            }}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const activeFiltersCount = [searchTerm, companyFilter, stageFilter, priorityFilter, automationFilter, locationFilter].filter(Boolean).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">People</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track leads, LinkedIn outreach, and automation status
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLeads}
                disabled={loading}
                className="h-9 px-3"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Cards - Focused on Outreach */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-blue-50/50 border-blue-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalLeads}</div>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 border-green-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                New This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.newThisWeek}</div>
              <p className="text-xs text-muted-foreground">Added recently</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50/50 border-purple-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.contacted}</div>
              <p className="text-xs text-muted-foreground">Outreach sent</p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50/50 border-indigo-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Connected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{metrics.connected}</div>
              <p className="text-xs text-muted-foreground">LinkedIn connections</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 border-emerald-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Meetings Booked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{metrics.meetingsBooked}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50/50 border-red-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.highPriority}</div>
              <p className="text-xs text-muted-foreground">Urgent leads</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50 border-orange-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Automated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.automated}</div>
              <p className="text-xs text-muted-foreground">Auto-processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter Controls */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leads by name, company, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <DropdownSelect
                options={[
                  { label: "All Companies", value: "all" },
                  ...Array.from(new Set(leads.map(l => l.Company).filter(Boolean))).map(company => ({
                    label: company,
                    value: company
                  }))
                ]}
                value={companyFilter || "all"}
                onValueChange={(value) => setCompanyFilter(value === "all" ? "" : value)}
                placeholder="Filter by company"
              />
              
              <DropdownSelect
                options={[
                  { label: "All Stages", value: "all" },
                  { label: "New", value: "new" },
                  { label: "Contacted", value: "contacted" },
                  { label: "Qualified", value: "qualified" },
                  { label: "Interview", value: "interview" },
                  { label: "Offer", value: "offer" },
                  { label: "Hired", value: "hired" }
                ]}
                value={stageFilter || "all"}
                onValueChange={(value) => setStageFilter(value === "all" ? "" : value)}
                placeholder="Filter by stage"
              />
              
              <DropdownSelect
                options={[
                  { label: "All Locations", value: "all" },
                  ...Array.from(new Set(leads.map(l => l["Employee Location"]).filter(Boolean))).map(location => ({
                    label: location,
                    value: location
                  }))
                ]}
                value={locationFilter || "all"}
                onValueChange={(value) => setLocationFilter(value === "all" ? "" : value)}
                placeholder="Filter by location"
              />
            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <DropdownSelect
                options={[
                  { label: "All Priorities", value: "all" },
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" }
                ]}
                value={priorityFilter || "all"}
                onValueChange={(value) => setPriorityFilter(value === "all" ? "" : value)}
                placeholder="Filter by priority"
              />
              
              <DropdownSelect
                options={[
                  { label: "All Automation", value: "all" },
                  { label: "Automated", value: "automated" },
                  { label: "Manual", value: "manual" },
                  { label: "Idle", value: "idle" }
                ]}
                value={automationFilter || "all"}
                onValueChange={(value) => setAutomationFilter(value === "all" ? "" : value)}
                placeholder="Filter by automation"
              />

              <div className="flex items-center gap-2">
                <DropdownSelect
                  options={[
                    { label: "Created Date", value: "created_at" },
                    { label: "Name", value: "name" },
                    { label: "Company", value: "company" },
                    { label: "Priority", value: "priority" },
                    { label: "AI Score", value: "score" }
                  ]}
                  value={sortBy}
                  onValueChange={setSortBy}
                  placeholder="Sort by"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-9 px-3"
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 px-3"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All Filters
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  Showing {filteredLeads.length} of {leads.length} leads
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
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
          pagination={{
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />
      </div>
      
      <EnhancedLeadDetailModal
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

export default OptimizedLeads;
