import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { EnhancedCompanyDetailModal } from "@/components/EnhancedCompanyDetailModal";
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
  Building2,
  Users,
  Briefcase,
  Globe,
  MapPin,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  ExternalLink,
  TrendingUp,
  Target
} from "lucide-react";

interface Company {
  id: string;
  "Company Name": string;
  Industry: string | null;
  "Company Size": string | null;
  "Head Office": string | null;
  Website: string | null;
  "Profile Image URL": string | null;
  status_enum: string | null;
  created_at: string;
}

interface CompanyMetrics {
  totalCompanies: number;
  withJobs: number;
  withLeads: number;
  newThisWeek: number;
  byIndustry: { [key: string]: number };
  avgLeadsPerCompany: number;
}

const OptimizedCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [sizeFilter, setSizeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    totalCompanies: 0,
    withJobs: 0,
    withLeads: 0,
    newThisWeek: 0,
    byIndustry: {},
    avgLeadsPerCompany: 0
  });
  const { toast } = useToast();

  // Calculate metrics
  const calculateMetrics = async (companiesData: Company[]) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const newThisWeek = companiesData.filter(company => 
      new Date(company.created_at) >= oneWeekAgo
    ).length;
    
    // Count companies with jobs and leads
    let withJobs = 0;
    let withLeads = 0;
    let totalLeads = 0;
    const industryCount: { [key: string]: number } = {};
    
    for (const company of companiesData) {
      // Count jobs for this company
      const { data: jobs } = await supabase
        .from("Jobs")
        .select("id", { count: "exact", head: true })
        .ilike("Company", `%${company["Company Name"]}%`);
      
      if (jobs && jobs.length > 0) {
        withJobs++;
      }
      
      // Count leads for this company
      const { data: leads } = await supabase
        .from("People")
        .select("id", { count: "exact", head: true })
        .ilike("Company", `%${company["Company Name"]}%`);
      
      if (leads && leads.length > 0) {
        withLeads++;
        totalLeads += leads.length;
      }
      
      // Count by industry
      if (company.Industry) {
        industryCount[company.Industry] = (industryCount[company.Industry] || 0) + 1;
      }
    }
    
    const avgLeadsPerCompany = withLeads > 0 ? Math.round(totalLeads / withLeads) : 0;

    return {
      totalCompanies: companiesData.length,
      withJobs,
      withLeads,
      newThisWeek,
      byIndustry: industryCount,
      avgLeadsPerCompany
    };
  };

  // Filter and sort companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !searchTerm || 
      company["Company Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company["Head Office"]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !industryFilter || 
      company.Industry?.toLowerCase().includes(industryFilter.toLowerCase());
    
    const matchesSize = !sizeFilter || 
      company["Company Size"]?.toLowerCase().includes(sizeFilter.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      company.status_enum?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesIndustry && matchesSize && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "created_at":
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case "name":
        comparison = (a["Company Name"] || "").localeCompare(b["Company Name"] || "");
        break;
      case "industry":
        comparison = (a.Industry || "").localeCompare(b.Industry || "");
        break;
      case "size":
        const sizeOrder = { "1-10": 1, "11-50": 2, "51-200": 3, "201-500": 4, "501-1000": 5, "1000+": 6 };
        const aSize = sizeOrder[a["Company Size"] as keyof typeof sizeOrder] || 0;
        const bSize = sizeOrder[b["Company Size"] as keyof typeof sizeOrder] || 0;
        comparison = aSize - bSize;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("");
    setSizeFilter("");
    setStatusFilter("");
  };

  const fetchCompanies = async () => {
    try {
      // OPTIMIZED: Only fetch fields you actually use
      const { data, error } = await supabase
        .from("Companies")
        .select(`
          id,
          "Company Name",
          Industry,
          "Company Size",
          "Head Office",
          Website,
          "Profile Image URL",
          status_enum,
          created_at
        `);

      if (error) throw error;
      
      setCompanies(data || []);
      setMetrics(await calculateMetrics(data || []));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    {
      key: "Company",
      label: "Company",
      render: (company: Company) => (
        <div className="flex items-center gap-3">
          {company["Profile Image URL"] ? (
            <img src={company["Profile Image URL"]} alt="Company logo" className="w-8 h-8 rounded object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-sm font-medium">
              {company["Company Name"]?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{company["Company Name"] || "-"}</div>
            {company.Website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <a 
                  href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Website
                </a>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "Industry",
      label: "Industry",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center gap-2 justify-center">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{company.Industry || "-"}</span>
        </div>
      ),
    },
    {
      key: "Company Size",
      label: "Size",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center gap-1 justify-center">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm font-medium">{company["Company Size"] || "-"}</span>
        </div>
      ),
    },
    {
      key: "Head Office",
      label: "Location",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center gap-1 justify-center">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm font-medium">{company["Head Office"] || "-"}</span>
        </div>
      ),
    },
    {
      key: "Status",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <StatusBadge status={company.status_enum?.toLowerCase() || "active"} />
      ),
    },
    {
      key: "Created",
      label: "Added",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => {
        const date = new Date(company.created_at);
        const today = new Date();
        const isRecent = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= 7;
        
        return (
          <div className="flex items-center gap-1 justify-center">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className={`text-xs ${isRecent ? 'text-green-600 font-medium' : ''}`}>
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCompany(company);
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

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  const activeFiltersCount = [searchTerm, industryFilter, sizeFilter, statusFilter].filter(Boolean).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Companies</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage company information and track job postings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCompanies}
                disabled={loading}
                className="h-9 px-3"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Cards - Company Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-blue-50/50 border-blue-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Total Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">In database</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 border-green-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                With Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.withJobs}</div>
              <p className="text-xs text-muted-foreground">Active postings</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50/50 border-purple-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                With Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.withLeads}</div>
              <p className="text-xs text-muted-foreground">Lead contacts</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50 border-orange-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                New This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.newThisWeek}</div>
              <p className="text-xs text-muted-foreground">Recently added</p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50/50 border-indigo-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Leads/Company
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{metrics.avgLeadsPerCompany}</div>
              <p className="text-xs text-muted-foreground">Lead density</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 border-emerald-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Top Industry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {Object.keys(metrics.byIndustry).length > 0 ? 
                  Object.entries(metrics.byIndustry).sort(([,a], [,b]) => b - a)[0][0] : 
                  "-"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.keys(metrics.byIndustry).length > 0 ? 
                  Object.entries(metrics.byIndustry).sort(([,a], [,b]) => b - a)[0][1] + " companies" : 
                  "No data"
                }
              </p>
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
                placeholder="Search companies by name, industry, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <DropdownSelect
                options={[
                  { label: "All Industries", value: "all" },
                  ...Array.from(new Set(companies.map(c => c.Industry).filter(Boolean))).map(industry => ({
                    label: industry,
                    value: industry
                  }))
                ]}
                value={industryFilter || "all"}
                onValueChange={(value) => setIndustryFilter(value === "all" ? "" : value)}
                placeholder="Filter by industry"
              />
              
              <DropdownSelect
                options={[
                  { label: "All Sizes", value: "all" },
                  { label: "1-10", value: "1-10" },
                  { label: "11-50", value: "11-50" },
                  { label: "51-200", value: "51-200" },
                  { label: "201-500", value: "201-500" },
                  { label: "501-1000", value: "501-1000" },
                  { label: "1000+", value: "1000+" }
                ]}
                value={sizeFilter || "all"}
                onValueChange={(value) => setSizeFilter(value === "all" ? "" : value)}
                placeholder="Filter by size"
              />

              <div className="flex items-center gap-2">
                <DropdownSelect
                  options={[
                    { label: "Created Date", value: "created_at" },
                    { label: "Name", value: "name" },
                    { label: "Industry", value: "industry" },
                    { label: "Size", value: "size" }
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
                  Showing {filteredCompanies.length} of {companies.length} companies
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <DataTable
          data={filteredCompanies}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          showSearch={false}
          enableBulkActions={true}
          enableExport={true}
          exportFilename="companies-export.csv"
          itemName="company"
          itemNamePlural="companies"
          pagination={{
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />
      </div>
      
      <EnhancedCompanyDetailModal
        company={selectedCompany}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCompany(null);
        }}
      />
    </>
  );
};

export default OptimizedCompanies;


