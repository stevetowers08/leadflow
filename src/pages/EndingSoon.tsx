import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { JobDetailModal } from "@/components/JobDetailModal";
import { useToast } from "@/hooks/use-toast";

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

const EndingSoon = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchEndingSoonJobs = async () => {
    try {
      // Get jobs ending within the next week
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      
      const { data, error } = await supabase
        .from("Jobs")
        .select("*")
        .not("Valid Through", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Filter jobs that are ending soon (client-side filtering for date parsing)
      const filteredJobs = (data || []).filter(job => {
        if (!job["Valid Through"]) return false;
        
        try {
          // Parse date from DD/M/YYYY or DD/MM/YYYY format
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
          
          const validThrough = parseDate(job["Valid Through"]);
          const now = new Date();
          return validThrough >= now && validThrough <= oneWeekFromNow;
        } catch {
          return false;
        }
      });
      
      setJobs(filteredJobs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ending soon jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndingSoonJobs();
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
      render: (job: Job) => (
        <span className="text-xs">
          {job["Posted Date"] ? new Date(job["Posted Date"]).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : "-"}
        </span>
      ),
    },
    {
      key: "Valid Through",
      label: "Valid Through",
      render: (job: Job) => {
        if (!job["Valid Through"]) return <span className="text-xs text-muted-foreground">-</span>;
        
        const validThrough = new Date(job["Valid Through"]);
        const now = new Date();
        const diffTime = validThrough.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let urgencyClass = "text-xs";
        if (diffDays <= 1) {
          urgencyClass = "text-xs text-red-600 font-medium";
        } else if (diffDays <= 3) {
          urgencyClass = "text-xs text-orange-600 font-medium";
        } else if (diffDays <= 7) {
          urgencyClass = "text-xs text-yellow-600 font-medium";
        }
        
        return (
          <div className="flex flex-col">
            <span className={urgencyClass}>
              {validThrough.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="text-xs text-muted-foreground">
              ({diffDays} day{diffDays !== 1 ? 's' : ''} left)
            </span>
          </div>
        );
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
          <h1 className="text-lg font-semibold tracking-tight">Ending Soon</h1>
        <p className="text-xs text-muted-foreground mt-1">Job postings that are about to expire</p>
      </div>

      <DataTable
        data={jobs}
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

export default EndingSoon;