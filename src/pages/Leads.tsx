import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
      key: "Stage",
      label: "Status",
      render: (lead: Lead) => (
        <div className="flex justify-center">
          <StatusBadge 
            status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
            size="md"
            className="shadow-sm"
          />
        </div>
      ),
    },
    {
      key: "Name",
      label: "Lead Name",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm">{lead.Name}</span>
          {lead["Company Role"] && (
            <span className="text-xs text-muted-foreground">{lead["Company Role"]}</span>
          )}
        </div>
      ),
    },
    {
      key: "Company",
      label: "Company",
      render: (lead: Lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{lead.Company || "-"}</span>
          {lead["Employee Location"] && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              📍 {lead["Employee Location"]}
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
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${scoreColor} ${bgColor}`}>
            {score}
          </div>
        );
      },
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
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
            </svg>
            View
          </a>
        ) : <span className="text-muted-foreground text-sm">-</span>
      ),
    },
  ];

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <DataTable
        title="Leads"
        data={leads}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
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