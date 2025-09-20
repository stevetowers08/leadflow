import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
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
  title: string;
  company_id: string | null;
  logo: string | null;
  description: string | null;
  requirements: string | null;
  location: string | null;
  industry: string | null;
  function: string | null;
  lead_score: number | null;
  score_reason: string | null;
  posted_date: string | null;
  valid_through: string | null;
  priority: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: string;
  type: string;
  remote: boolean;
  created_at: string;
  companies?: {
    name: string;
  };
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
  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    logo: "",
    description: "",
    requirements: "",
    location: "",
    industry: "",
    function: "",
    lead_score: "",
    score_reason: "",
    posted_date: "",
    valid_through: "",
    priority: "medium",
    salary_min: "",
    salary_max: "",
    status: "active",
    type: "full-time",
    remote: false
  });
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          companies (
            name
          )
        `)
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
        .from("companies")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        company_id: formData.company_id || null,
        logo: formData.logo || null,
        industry: formData.industry || null,
        function: formData.function || null,
        lead_score: formData.lead_score ? parseInt(formData.lead_score) : null,
        score_reason: formData.score_reason || null,
        posted_date: formData.posted_date || null,
        valid_through: formData.valid_through || null,
        priority: formData.priority || "medium",
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      };

      const { error } = await supabase
        .from("jobs")
        .insert([submitData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job created successfully",
      });
      
      setIsDialogOpen(false);
      setFormData({
        title: "",
        company_id: "",
        logo: "",
        description: "",
        requirements: "",
        location: "",
        industry: "",
        function: "",
        lead_score: "",
        score_reason: "",
        posted_date: "",
        valid_through: "",
        priority: "medium",
        salary_min: "",
        salary_max: "",
        status: "active",
        type: "full-time",
        remote: false
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

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "-";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (job: Job) => (
        <div className="flex items-center">
          {job.logo ? (
            <img src={job.logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
          ) : (
            <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                {job.companies?.name?.charAt(0) || "?"}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (job: Job) => (
        <span className="text-xs">{job.companies?.name || "-"}</span>
      ),
    },
    {
      key: "title",
      label: "Job Title",
      render: (job: Job) => (
        <span className="text-xs font-medium">{job.title}</span>
      ),
    },
    {
      key: "location",
      label: "Job Location",
      render: (job: Job) => (
        <span className="text-xs">{job.location || "-"}</span>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      render: (job: Job) => (
        <span className="text-xs">{job.industry || "-"}</span>
      ),
    },
    {
      key: "function",
      label: "Function",
      render: (job: Job) => (
        <span className="text-xs">{job.function || "-"}</span>
      ),
    },
    {
      key: "lead_score",
      label: "Lead Score",
      render: (job: Job) => (
        <span className="text-xs font-mono">
          {job.lead_score ? `#${job.lead_score}` : "-"}
        </span>
      ),
    },
    {
      key: "score_reason",
      label: "Score Reason",
      render: (job: Job) => (
        <span className="text-xs text-muted-foreground max-w-24 truncate" title={job.score_reason || ""}>
          {job.score_reason || "-"}
        </span>
      ),
    },
    {
      key: "posted_date",
      label: "Posted Date",
      render: (job: Job) => (
        <span className="text-xs">
          {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "valid_through",
      label: "Valid Through",
      render: (job: Job) => (
        <span className="text-xs">
          {job.valid_through ? new Date(job.valid_through).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (job: Job) => (
        <StatusBadge status={job.priority || "medium"} />
      ),
    },
  ];

  return (
    <DataTable
      title="Jobs"
      data={jobs}
      columns={columns}
      loading={loading}
      addButton={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="company_id">Company</Label>
                <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="filled">Filled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="lead_score">Lead Score</Label>
                   <Input
                     id="lead_score"
                     type="number"
                     value={formData.lead_score}
                     onChange={(e) => setFormData({ ...formData, lead_score: e.target.value })}
                     placeholder="1-100"
                   />
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
                 <Label htmlFor="score_reason">Score Reason</Label>
                 <Input
                   id="score_reason"
                   value={formData.score_reason}
                   onChange={(e) => setFormData({ ...formData, score_reason: e.target.value })}
                   placeholder="Reason for lead score from company data"
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
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={formData.remote}
                  onCheckedChange={(checked) => setFormData({ ...formData, remote: checked as boolean })}
                />
                <Label htmlFor="remote">Remote work available</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min">Min Salary</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="salary_max">Max Salary</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    placeholder="100000"
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
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
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
      }
    />
  );
};

export default Jobs;