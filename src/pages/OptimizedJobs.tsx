import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { DynamicStatusBadge } from "@/components/DynamicStatusBadge";
import { EnhancedJobDetailModal } from "@/components/EnhancedJobDetailModal";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { useToast } from "@/hooks/use-toast";
import { useBatchJobStatuses } from "@/hooks/useDynamicStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  X, 
  RefreshCw, 
  Edit, 
  Archive, 
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  ExternalLink,
  Briefcase
} from "lucide-react";

interface Job {
  id: string;
  "Job Title": string;
  Company: string;
  Logo: string | null;
  "Job Location": string | null;
  Industry: string | null;
  "Lead Score": number | null;
  "Posted Date": string | null;
  "Valid Through": string | null;
  Priority: string | null;
  "Employment Type": string | null;
  Salary: string | null;
  status_enum: string | null;
  created_at: string;
}

interface JobMetrics {
  totalJobs: number;
  newToday: number;
  expiringSoon: number;
  highPriority: number;
  activeJobs: number;
}

const OptimizedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("posted_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [metrics, setMetrics] = useState<JobMetrics>({
    totalJobs: 0,
    newToday: 0,
    expiringSoon: 0,
    highPriority: 0,
    activeJobs: 0
  });
  const { toast } = useToast();

  // Dynamic status management
  const { statusMap, isLoading: statusLoading, getJobStatus, refreshAllStatuses } = useBatchJobStatuses(jobs);
  // Removed real-time status to prevent performance issues

  // Calculate metrics
  const calculateMetrics = (jobsData: Job[]) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newToday = jobsData.filter(job => {
      if (!job["Posted Date"]) return false;
      const parseDate = (dateStr: string) => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return new Date(`${year}-${month}-${day}`);
        }
        return new Date(dateStr);
      };
      
      try {
        const jobDate = parseDate(job["Posted Date"]);
        return jobDate.toISOString().split('T')[0] === todayStr;
      } catch {
        return false;
      }
    }).length;

    const expiringSoon = jobsData.filter(job => {
      if (!job["Valid Through"]) return false;
      const parseDate = (dateStr: string) => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return new Date(`${year}-${month}-${day}`);
        }
        return new Date(dateStr);
      };
      
      try {
        const expiryDate = parseDate(job["Valid Through"]);
        return expiryDate <= sevenDaysFromNow && expiryDate >= today;
      } catch {
        return false;
      }
    }).length;

    const highPriority = jobsData.filter(job => job.Priority?.toLowerCase() === 'high').length;
    const activeJobs = jobsData.filter(job => {
      const statusInfo = getJobStatus(job.id);
      return statusInfo.status === 'active';
    }).length;

    return {
      totalJobs: jobsData.length,
      newToday,
      expiringSoon,
      highPriority,
      activeJobs
    };
  };

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job["Job Title"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job["Job Location"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = !companyFilter || 
      job.Company?.toLowerCase().includes(companyFilter.toLowerCase());
    
    const matchesPriority = !priorityFilter || 
      job.Priority?.toLowerCase() === priorityFilter.toLowerCase();
    
    const matchesIndustry = !industryFilter || 
      job.Industry?.toLowerCase().includes(industryFilter.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      job["Job Location"]?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesEmploymentType = !employmentTypeFilter || 
      job["Employment Type"]?.toLowerCase() === employmentTypeFilter.toLowerCase();
    
    const jobStatusInfo = getJobStatus(job.id);
    const matchesStatus = !statusFilter || 
      jobStatusInfo.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCompany && matchesPriority && matchesIndustry && matchesLocation && matchesEmploymentType && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "posted_date":
        const parseDate = (dateStr: string | null) => {
          if (!dateStr) return new Date(0);
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return new Date(`${year}-${month}-${day}`);
          }
          return new Date(dateStr);
        };
        
        const dateA = parseDate(a["Posted Date"]);
        const dateB = parseDate(b["Posted Date"]);
        comparison = dateA.getTime() - dateB.getTime();
        break;
      case "company":
        comparison = (a.Company || "").localeCompare(b.Company || "");
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.Priority?.toLowerCase() as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.Priority?.toLowerCase() as keyof typeof priorityOrder] || 0;
        comparison = aPriority - bPriority;
        break;
      case "score":
        comparison = (a["Lead Score"] || 0) - (b["Lead Score"] || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCompanyFilter("");
    setPriorityFilter("");
    setStatusFilter("");
    setIndustryFilter("");
    setLocationFilter("");
    setEmploymentTypeFilter("");
  };

  const fetchJobs = async () => {
    try {
      // OPTIMIZED: Only fetch fields you actually use
      const { data, error } = await supabase
        .from("Jobs")
        .select(`
          id,
          "Job Title",
          Company,
          Logo,
          "Job Location",
          Industry,
          "Lead Score",
          "Posted Date",
          "Valid Through",
          Priority,
          "Employment Type",
          Salary,
          status_enum,
          created_at
        `);

      if (error) throw error;
      
      setJobs(data || []);
      setMetrics(calculateMetrics(data || []));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Register for real-time updates
  useEffect(() => {
    const unregister = registerRefreshCallback(refreshAllStatuses);
    return unregister;
  }, [registerRefreshCallback, refreshAllStatuses]);

  // Enable real-time updates when component mounts
  useEffect(() => {
    enableRealTime();
    return () => disableRealTime();
  }, [enableRealTime, disableRealTime]);

  // Update metrics when jobs change
  useEffect(() => {
    setMetrics(calculateMetrics(jobs));
  }, [jobs, statusMap]);

  const columns = [
    {
      key: "Company",
      label: "Company",
      render: (job: Job) => (
        <div className="flex items-center gap-2">
          {job.Logo ? (
            <img src={job.Logo} alt="Company logo" className="w-6 h-6 rounded object-cover" />
          ) : (
            <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
              <Building2 className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium">{job.Company || "-"}</span>
        </div>
      ),
    },
    {
      key: "Job Summary",
      label: "Job Summary",
      render: (job: Job) => (
        <div className="max-w-xs">
          <div className="text-sm font-medium mb-1">{job["Job Title"]}</div>
          <div className="text-xs text-muted-foreground space-y-1">
            {job["Job Location"] && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job["Job Location"]}
              </div>
            )}
            {job.Industry && (
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {job.Industry}
              </div>
            )}
            {job["Employment Type"] && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job["Employment Type"]}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "AI Score",
      label: "AI Score",
      render: (job: Job) => (
        <div className="text-center">
          <AIScoreBadge
            leadData={{
              name: "Job Candidate",
              company: job.Company || "",
              role: job["Job Title"] || "",
              location: job["Job Location"] || "",
              industry: job.Industry,
              company_size: "Unknown"
            }}
            initialScore={job["Lead Score"] ? parseInt(job["Lead Score"].toString()) : undefined}
            showDetails={false}
          />
        </div>
      ),
    },
    {
      key: "Posted Date",
      label: "Posted",
      render: (job: Job) => {
        if (!job["Posted Date"]) return <span className="text-xs text-muted-foreground">-</span>;
        
        const parseDate = (dateStr: string) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return new Date(`${year}-${month}-${day}`);
          }
          return new Date(dateStr);
        };
        
        try {
          const date = parseDate(job["Posted Date"]);
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();
          const isRecent = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= 7;
          
          return (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className={`text-xs ${isToday ? 'text-green-600 font-medium' : isRecent ? 'text-blue-600' : ''}`}>
                {isToday ? 'Today' : date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          );
        } catch {
          return <span className="text-xs">{job["Posted Date"]}</span>;
        }
      },
    },
    {
      key: "Valid Through",
      label: "Expires",
      render: (job: Job) => {
        if (!job["Valid Through"]) return <span className="text-xs text-muted-foreground">-</span>;
        
        const parseDate = (dateStr: string) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return new Date(`${year}-${month}-${day}`);
          }
          return new Date(dateStr);
        };
        
        try {
          const date = parseDate(job["Valid Through"]);
          const today = new Date();
          const daysUntilExpiry = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let color = "text-muted-foreground";
          let icon = Clock;
          
          if (daysUntilExpiry < 0) {
            color = "text-red-600";
            icon = AlertTriangle;
          } else if (daysUntilExpiry <= 7) {
            color = "text-yellow-600";
            icon = AlertTriangle;
          } else if (daysUntilExpiry <= 30) {
            color = "text-orange-600";
          }
          
          const IconComponent = icon;
          
          return (
            <div className="flex items-center gap-1">
              <IconComponent className={`h-3 w-3 ${color}`} />
              <span className={`text-xs ${color}`}>
                {daysUntilExpiry < 0 ? 'Expired' : 
                 daysUntilExpiry === 0 ? 'Today' : 
                 daysUntilExpiry === 1 ? 'Tomorrow' : 
                 `${daysUntilExpiry}d`}
              </span>
            </div>
          );
        } catch {
          return <span className="text-xs">{job["Valid Through"]}</span>;
        }
      },
    },
    {
      key: "Priority",
      label: "Priority",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <StatusBadge status={job.Priority?.toLowerCase() || "medium"} />
      ),
    },
    {
      key: "status_enum",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        const statusInfo = getJobStatus(job.id);
        return (
          <DynamicStatusBadge
            status={statusInfo.status}
            leadCount={statusInfo.leadCount}
            isLoading={statusInfo.isLoading}
            showLeadCount={true}
          />
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedJob(job);
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

  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  };

  const activeFiltersCount = [searchTerm, companyFilter, priorityFilter, statusFilter, industryFilter, locationFilter, employmentTypeFilter].filter(Boolean).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage job postings and track candidate pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAllStatuses}
                disabled={statusLoading}
                className="h-9 px-3"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${statusLoading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Cards - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-blue-50/50 border-blue-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalJobs}</div>
              <p className="text-xs text-muted-foreground">Active postings</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 border-green-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                New Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.newToday}</div>
              <p className="text-xs text-muted-foreground">Posted today</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50/50 border-yellow-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50/50 border-red-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.highPriority}</div>
              <p className="text-xs text-muted-foreground">Urgent jobs</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50/50 border-purple-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.activeJobs}</div>
              <p className="text-xs text-muted-foreground">With candidates</p>
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
                placeholder="Search jobs by title, company, location, or industry..."
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
                  ...Array.from(new Set(jobs.map(j => j.Company).filter(Boolean))).map(company => ({
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
                  { label: "All Industries", value: "all" },
                  ...Array.from(new Set(jobs.map(j => j.Industry).filter(Boolean))).map(industry => ({
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
                  { label: "All Locations", value: "all" },
                  ...Array.from(new Set(jobs.map(j => j["Job Location"]).filter(Boolean))).map(location => ({
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
                  { label: "All Employment Types", value: "all" },
                  { label: "Full-time", value: "full-time" },
                  { label: "Part-time", value: "part-time" },
                  { label: "Contract", value: "contract" },
                  { label: "Internship", value: "internship" },
                  { label: "Freelance", value: "freelance" }
                ]}
                value={employmentTypeFilter || "all"}
                onValueChange={(value) => setEmploymentTypeFilter(value === "all" ? "" : value)}
                placeholder="Filter by employment type"
              />

              <div className="flex items-center gap-2">
                <DropdownSelect
                  options={[
                    { label: "Posted Date", value: "posted_date" },
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
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <DataTable
          data={filteredJobs}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          showSearch={false}
          enableBulkActions={true}
          enableExport={true}
          exportFilename="jobs-export.csv"
          itemName="job"
          itemNamePlural="jobs"
          pagination={{
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
          bulkActions={[
            {
              id: 'update-priority',
              label: 'Update Priority',
              icon: Edit,
              action: async (jobs) => {
                const newPriority = prompt('Enter new priority (high/medium/low):');
                if (newPriority) {
                  for (const job of jobs) {
                    await supabase
                      .from("Jobs")
                      .update({ Priority: newPriority })
                      .eq("id", job.id);
                  }
                  fetchJobs();
                }
              },
              variant: 'secondary'
            },
            {
              id: 'archive-jobs',
              label: 'Archive Jobs',
              icon: Archive,
              action: async (jobs) => {
                for (const job of jobs) {
                  await supabase
                    .from("Jobs")
                    .update({ status_enum: 'cancelled' })
                    .eq("id", job.id);
                }
                fetchJobs();
              },
              variant: 'secondary',
              requiresConfirmation: true,
              confirmationMessage: 'Are you sure you want to archive the selected jobs?'
            }
          ]}
        />
      </div>
      
      <EnhancedJobDetailModal
        job={selectedJob}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </>
  );
};

export default OptimizedJobs;
