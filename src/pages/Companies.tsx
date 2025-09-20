import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { CompanyDetailModal } from "@/components/CompanyDetailModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search, X } from "lucide-react";

interface Company {
  id: string;
  "Company Name": string;
  "Industry": string | null;
  "Website": string | null;
  "Company Size": string | null;
  "Head Office": string | null;
  "Lead Score": number | null;
  "Priority": string | null;
  "STATUS": string | null;
  "Company Info": string | null;
  "LinkedIn URL": string | null;
  "Profile Image URL": string | null;
  created_at: string;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    status: "prospect",
    notes: ""
  });
  const { toast } = useToast();

  // Filter companies based on search term and status
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !searchTerm || 
      company["Company Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company["Industry"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company["Head Office"]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      company["STATUS"]?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("Companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("Companies")
        .insert([{
          "Company Name": formData.name,
          "Industry": formData.industry,
          "Website": formData.website,
          "Head Office": formData.address,
          "STATUS": formData.status,
          "Company Info": formData.notes,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company created successfully",
      });
      
      setIsDialogOpen(false);
      setFormData({
        name: "",
        industry: "",
        website: "",
        phone: "",
        email: "",
        address: "",
        status: "prospect",
        notes: ""
      });
      fetchCompanies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    {
      key: "Company Name",
      label: "Company",
      render: (company: Company) => (
        <div className="flex items-center gap-2 min-w-0 max-w-xs">
          {company["Profile Image URL"] ? (
            <img 
              src={company["Profile Image URL"]} 
              alt={`${company["Company Name"]} logo`}
              className="w-8 h-8 rounded object-cover flex-shrink-0 cursor-default"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0 cursor-default">
              <span className="text-xs font-medium text-muted-foreground">
                {company["Company Name"]?.charAt(0)?.toUpperCase() || "C"}
              </span>
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/leads?company=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="text-xs font-medium truncate hover:text-primary transition-colors text-left"
            >
              {company["Company Name"] || "-"}
            </button>
            {company["Website"] && (
              <a 
                href={company["Website"]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors truncate opacity-75 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {company["Website"].replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "Industry",
      label: "Industry",
      render: (company: Company) => (
        <div className="max-w-xs">
          <span className="text-xs font-medium text-foreground">
            {company["Industry"] || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "Company Size",
      label: "Company Size",
      render: (company: Company) => (
        <span className="text-xs text-muted-foreground">
          {company["Company Size"] || "-"}
        </span>
      ),
    },
    {
      key: "Head Office",
      label: "Location",
      render: (company: Company) => (
        <div className="max-w-xs">
          <span className="text-xs text-muted-foreground">
            {company["Head Office"] || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "Lead Score",
      label: "Score",
      render: (company: Company) => (
        <div className="text-center">
          {company["Lead Score"] ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-xs font-semibold">
              {company["Lead Score"]}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: "Priority",
      label: "Priority",
      render: (company: Company) => (
        <StatusBadge status={company["Priority"]?.toLowerCase() || "medium"} />
      ),
    },
    {
      key: "STATUS",
      label: "Status",
      render: (company: Company) => (
        <StatusBadge status={company["STATUS"]?.toLowerCase() || "active"} />
      ),
    },
  ];

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h1 className="text-lg font-semibold tracking-tight">Companies</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your target companies and prospects
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          
          <DropdownSelect
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Prospect", value: "prospect" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" }
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
            disabled={!searchTerm && !statusFilter}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4">Add Company</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Company</Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filters Display */}
        {statusFilter && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Active filters:</span>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
              <span>Status: {statusFilter}</span>
              <button 
                onClick={() => setStatusFilter("")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <DataTable
          data={filteredCompanies}
            columns={columns}
            loading={loading}
            onRowClick={handleRowClick}
            showSearch={false}
          />
      </div>
      
      <CompanyDetailModal
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

export default Companies;