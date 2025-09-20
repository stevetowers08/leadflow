import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { JobDetailModal } from "@/components/JobDetailModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

interface Company {
  id: string;
  name: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    logo: "",
    location: "",
    industry: "",
    function: "",
    lead_score: "",
    score_reason: "",
    posted_date: "",
    valid_through: "",
    priority: "medium",
    description: "",
    employment_type: "Full-time",
    salary: ""
  });
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("Jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
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

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("Companies")
        .select("id, \"Company Name\"")
        .order("\"Company Name\"");

      if (error) throw error;
      setCompanies(data?.map(c => ({ id: c.id, name: c["Company Name"] })) || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("Jobs")
        .insert([{
          "Job Title": formData.title,
          Company: formData.company,
          Logo: formData.logo,
          "Job Location": formData.location,
          Industry: formData.industry,
          Function: formData.function,
          "Lead Score": formData.lead_score ? parseInt(formData.lead_score) : null,
          "Score Reason (from Company)": formData.score_reason,
          "Posted Date": formData.posted_date,
          "Valid Through": formData.valid_through,
          Priority: formData.priority,
          "Job Description": formData.description,
          "Employment Type": formData.employment_type,
          Salary: formData.salary,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job created successfully",
      });
      
      setIsDialogOpen(false);
      setFormData({
        title: "",
        company: "",
        logo: "",
        location: "",
        industry: "",
        function: "",
        lead_score: "",
        score_reason: "",
        posted_date: "",
        valid_through: "",
        priority: "medium",
        description: "",
        employment_type: "Full-time",
        salary: ""
      });
      fetchJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
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
          <h1 className="text-lg font-semibold tracking-tight">Jobs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage job postings and opportunities
          </p>
        </div>

        <div className="flex items-center justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4">Add Job</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://company.com/logo.png"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Technology, Healthcare, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="function">Function</Label>
                  <Input
                    id="function"
                    value={formData.function}
                    onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                    placeholder="Engineering, Sales, etc."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select value={formData.employment_type} onValueChange={(value) => setFormData({ ...formData, employment_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="$50,000 - $80,000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="posted_date">Posted Date</Label>
                  <Input
                    id="posted_date"
                    type="date"
                    value={formData.posted_date}
                    onChange={(e) => setFormData({ ...formData, posted_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_through">Valid Through</Label>
                  <Input
                    id="valid_through"
                    type="date"
                    value={formData.valid_through}
                    onChange={(e) => setFormData({ ...formData, valid_through: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create Job</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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

export default Jobs;