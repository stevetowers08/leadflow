import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { DynamicStatusBadge } from "@/components/DynamicStatusBadge";
import { SimplifiedJobDetailModal } from "@/components/SimplifiedJobDetailModal";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { useToast } from "@/hooks/use-toast";
import { useOptimizedStatus, useRealTimeStatus } from "@/hooks/useOptimizedStatus";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { measureFilterPerformance } from "@/utils/performanceUtils";
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
  ExternalLink
} from "lucide-react";

import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"Jobs">;

interface Company {
  id: string;
  name: string;
}

interface JobMetrics {
  totalJobs: number;
  newToday: number;
  expiringSoon: number;
  highPriority: number;
  activeJobs: number;
}

const Jobs = () => {
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
  const [sortBy, setSortBy] = useState<string>("posted_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [metrics, setMetrics] = useState<JobMetrics>({
    totalJobs: 0,
    newToday: 0,
    expiringSoon: 0,
    highPriority: 0,
    activeJobs: 0
  });
  const { toast } = useToast();

  // Optimized status management
  const { getJobStatus, isLoading: statusLoading } = useOptimizedStatus();
  const { refreshAllStatuses } = useRealTimeStatus();

  // Debounced search for better performance
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300, 0);

  // Memoized filtering for optimal performance with measurement
  const filteredJobs = useMemo(() => {
    return measureFilterPerformance(
      jobs,
      job => {
        const matchesSearch = !debouncedSearchTerm || 
          job["Job Title"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          job.Company?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          job["Job Location"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          job.Industry?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        
        const matchesCompany = !companyFilter || 
          job.Company?.toLowerCase().includes(companyFilter.toLowerCase());
        
        const matchesPriority = !priorityFilter || 
          job.Priority?.toLowerCase() === priorityFilter.toLowerCase();
        
        const jobStatusInfo = getJobStatus(job.id);
        const matchesStatus = !statusFilter || 
          jobStatusInfo.status === statusFilter.toLowerCase();
        
        return matchesSearch && matchesCompany && matchesPriority && matchesStatus;
      },
      'jobs-filtering'
    );
  }, [jobs, debouncedSearchTerm, companyFilter, priorityFilter, statusFilter, getJobStatus]);

  const clearFilters = () => {
    setSearchTerm("");
    setCompanyFilter("");
    setPriorityFilter("");
    setStatusFilter("");
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("Jobs")
        .select("*");

      if (error) throw error;
      
      // Sort by Posted Date (most recent first)
      const sortedJobs = (data || []).sort((a, b) => {
        const parseDate = (dateStr: string | null) => {
          if (!dateStr) return new Date(0); // Put jobs without dates at the end
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
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });
      
      setJobs(sortedJobs);
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


  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      key: "Company",
      label: "Company",
      render: (job: Job) => (
        <div className="flex items-center gap-2">
          {job.Logo ? (
            <img src={job.Logo} alt="Company logo" className="w-8 h-8 rounded object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-sm font-medium">
              {job.Company?.charAt(0)?.toUpperCase() || "?"}
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
          <div className="text-xs text-muted-foreground">
            {job["Job Location"] && `${job["Job Location"]} • `}
            {job.Industry && `${job.Industry} • `}
            {job.Function && job.Function}
          </div>
        </div>
      ),
    },
    {
      key: "AI Score",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
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
      label: "Posted Date",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        if (!job["Posted Date"]) return <span className="text-xs">-</span>;
        
        // Parse the date from DD/M/YYYY or DD/MM/YYYY format
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
          return (
            <span className="text-xs">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          );
        } catch {
          return <span className="text-xs">{job["Posted Date"]}</span>;
        }
      },
    },
    {
      key: "Valid Through",
      label: "Valid Through",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        if (!job["Valid Through"]) return <span className="text-xs">-</span>;
        
        // Parse the date from DD/M/YYYY or DD/MM/YYYY format
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
          return (
            <span className="text-xs">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
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
            isLoading={false}
            showLeadCount={true}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Jobs</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage job postings and opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          
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
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Paused", value: "paused" },
              { label: "Filled", value: "filled" },
              { label: "Cancelled", value: "cancelled" }
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
            disabled={!searchTerm && !companyFilter && !priorityFilter && !statusFilter}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>

        {/* Active Filters Display */}
        {(companyFilter || priorityFilter) && (
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
                  fetchJobs(); // Refresh data
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
                fetchJobs(); // Refresh data
              },
              variant: 'secondary',
              requiresConfirmation: true,
              confirmationMessage: 'Are you sure you want to archive the selected jobs?'
            }
          ]}
        />
      </div>
      
      {selectedJob && (
        <SimplifiedJobDetailModal
          job={selectedJob as Tables<"Jobs">}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </>
  );
};

export default Jobs;