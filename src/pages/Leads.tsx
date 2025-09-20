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
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { LEAD_STAGE_OPTIONS, PRIORITY_OPTIONS } from "@/hooks/useDropdownOptions";

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
}

interface Company {
  id: string;
  name: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    location: "",
    role: "",
    stage: "new",
    priority: "",
    lead_score: "",
    linkedin_url: ""
  });
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
      const insertData: any = {
        Name: formData.name,
        Company: formData.company,
        "Email Address": formData.email,
        "Employee Location": formData.location,
        "Company Role": formData.role,
        Stage: formData.stage,
        stage_enum: formData.stage,
        "Lead Score": formData.lead_score,
        "LinkedIn URL": formData.linkedin_url
      };

      // Only add priority_enum if a priority is selected
      if (formData.priority) {
        insertData.priority_enum = formData.priority;
      }

      const { error } = await supabase
        .from("People")
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        location: "",
        role: "",
        stage: "new",
        priority: "",
        lead_score: "",
        linkedin_url: ""
      });
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchCompanies();
  }, []);

  const columns = [
    {
      key: "Name",
      label: "Name",
      render: (lead: Lead) => (
        <span className="text-xs font-medium">{lead.Name}</span>
      ),
    },
    {
      key: "Company",
      label: "Company",
      render: (lead: Lead) => (
        <span className="text-xs">{lead.Company || "-"}</span>
      ),
    },
    {
      key: "Email Address",
      label: "Email",
      render: (lead: Lead) => (
        <span className="text-xs">{lead["Email Address"] || "-"}</span>
      ),
    },
    {
      key: "Company Role",
      label: "Role",
      render: (lead: Lead) => (
        <span className="text-xs">{lead["Company Role"] || "-"}</span>
      ),
    },
    {
      key: "Employee Location",
      label: "Location",
      render: (lead: Lead) => (
        <span className="text-xs">{lead["Employee Location"] || "-"}</span>
      ),
    },
    {
      key: "Lead Score",
      label: "Lead Score",
      render: (lead: Lead) => (
        <span className="text-xs font-mono">{lead["Lead Score"] || "-"}</span>
      ),
    },
    {
      key: "Stage",
      label: "Stage", 
      render: (lead: Lead) => (
        <StatusBadge status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} />
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
            className="text-xs text-primary hover:underline"
          >
            View
          </a>
        ) : "-"
      ),
    },
  ];

  return (
    <DataTable
      title="Leads"
      data={leads}
      columns={columns}
      loading={loading}
      addButton={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <DropdownSelect
                  options={LEAD_STAGE_OPTIONS}
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                  placeholder="Select stage..."
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <DropdownSelect
                  options={PRIORITY_OPTIONS}
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  placeholder="Select priority..."
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/profile"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create Lead</Button>
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

export default Leads;