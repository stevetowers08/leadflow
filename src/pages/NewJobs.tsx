import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { JobDetailModal } from "@/components/JobDetailModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search, X } from "lucide-react";

interface Job {
  id: string;
  "Job Title": string;
  Company: string;
  Logo: string | null;
  "Job Location": string | null;
  Industry: string | null;
  Function: string | null;
  "Lead Score": number | null;
  "Score Reason (from Company)": string | null;
  "Posted Date": string | null;
  "Valid Through": string | null;
  Priority: string | null;
  "Job Description": string | null;
  "Employment Type": string | null;
  Salary: string | null;
  created_at: string;
}

const NewJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const { toast } = useToast();

  const fetchNewJobs = async () => {
    try {
      // Fetch recent jobs (posted within the last 30 days based on Posted Date)
      const { data, error } = await supabase
        .from("Jobs")
        .select("*");

      if (error) throw error;
      
      // Filter and sort by Posted Date
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
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
      
      const filteredAndSortedJobs = (data || [])
        .filter(job => {
          const postedDate = parseDate(job["Posted Date"]);
          return postedDate >= thirtyDaysAgo;
        })
        .sort((a, b) => {
          const dateA = parseDate(a["Posted Date"]);
          const dateB = parseDate(b["Posted Date"]);
          return dateB.getTime() - dateA.getTime(); // Most recent first
        });
      
      setJobs(filteredAndSortedJobs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch new jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search term, company, and priority
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
    
    return matchesSearch && matchesCompany && matchesPriority;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCompanyFilter("");
    setPriorityFilter("");
  };

  useEffect(() => {
    fetchNewJobs();
  }, []);

  const columns = [
    {
      key: "Company",
      label: "Company",
      render: (job: Job) => (
        <span className="text-xs">{job.Company || "-"}</span>
      ),
    },
    {
      key: "Job Title",
      label: "Job Title",
      render: (job: Job) => (
        <span className="text-xs font-medium">{job["Job Title"]}</span>
      ),
    },
    {
      key: "Job Location",
      label: "Job Location",
      render: (job: Job) => (
        <span className="text-xs">{job["Job Location"] || "-"}</span>
      ),
    },
    {
      key: "Industry",
      label: "Industry",
      render: (job: Job) => (
        <span className="text-xs">{job.Industry || "-"}</span>
      ),
    },
    {
      key: "Function",
      label: "Function",
      render: (job: Job) => (
        <span className="text-xs">{job.Function || "-"}</span>
      ),
    },
    {
      key: "Lead Score",
      label: "Score",
      render: (job: Job) => (
        <div className="text-center">
          {job["Lead Score"] ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-xs font-semibold">
              {job["Lead Score"]}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: "Posted Date",
      label: "Posted Date", 
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
      render: (job: Job) => (
        <StatusBadge status={job.Priority?.toLowerCase() || "medium"} />
      ),
    },
    {
      key: "status_enum",
      label: "Status",
      render: (job: Job) => (
        <StatusBadge status={(job as any).status_enum?.toLowerCase() || "active"} />
      ),
    },
  ];

  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h1 className="text-lg font-semibold tracking-tight">New Jobs</h1>
        <p className="text-xs text-muted-foreground mt-1">Recently posted job opportunities</p>
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3"
          onClick={clearFilters}
          disabled={!searchTerm && !companyFilter && !priorityFilter}
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
      />
    </div>
      
      <JobDetailModal
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

export default NewJobs;