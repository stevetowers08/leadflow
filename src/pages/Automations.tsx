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
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search, X, Play, Pause, Settings } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  type: string;
  status: string;
  leads_count: number;
  completed_count: number;
  success_rate: number;
  created_at: string;
  last_run: string | null;
}

const Automations = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    type: "linkedin_outreach",
    message_template: "",
    follow_up_message: "",
    delay_days: "3"
  });
  const { toast } = useToast();

  // Mock data for now - replace with actual Supabase queries when automation table is created
  const mockAutomations: Automation[] = [
    {
      id: "1",
      name: "LinkedIn Tech Professionals",
      type: "LinkedIn Outreach",
      status: "active",
      leads_count: 156,
      completed_count: 89,
      success_rate: 23.5,
      created_at: "2024-01-15",
      last_run: "2024-01-20"
    },
    {
      id: "2", 
      name: "Sales Manager Campaign",
      type: "LinkedIn Outreach",
      status: "paused",
      leads_count: 87,
      completed_count: 45,
      success_rate: 18.2,
      created_at: "2024-01-10",
      last_run: "2024-01-18"
    },
    {
      id: "3",
      name: "Follow-up Sequence",
      type: "Email Campaign",
      status: "completed",
      leads_count: 234,
      completed_count: 234,
      success_rate: 31.8,
      created_at: "2024-01-05",
      last_run: "2024-01-19"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAutomations(mockAutomations);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter automations based on search term and status
  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = !searchTerm || 
      automation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      automation.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock creation - replace with actual Supabase insert when table is ready
    toast({
      title: "Success",
      description: "Automation created successfully",
    });
    
    setIsDialogOpen(false);
    setFormData({
      name: "",
      type: "linkedin_outreach",
      message_template: "",
      follow_up_message: "",
      delay_days: "3"
    });
  };

  const handleToggleStatus = (automationId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === automationId 
          ? { ...automation, status: newStatus }
          : automation
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Automation ${newStatus === "active" ? "started" : "paused"}`,
    });
  };

  const columns = [
    {
      key: "name",
      label: "Campaign Name",
      render: (automation: Automation) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{automation.name}</span>
          <span className="text-xs text-muted-foreground">{automation.type}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (automation: Automation) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={automation.status} />
          {automation.status !== "completed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(automation.id, automation.status);
              }}
              className="h-6 w-6 p-0"
            >
              {automation.status === "active" ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      ),
    },
    {
      key: "leads_count",
      label: "Leads",
      render: (automation: Automation) => (
        <div className="text-center">
          <div className="text-sm font-medium">{automation.leads_count}</div>
          <div className="text-xs text-muted-foreground">
            {automation.completed_count} completed
          </div>
        </div>
      ),
    },
    {
      key: "success_rate",
      label: "Success Rate",
      render: (automation: Automation) => (
        <div className="text-center">
          <div className="text-sm font-medium">{automation.success_rate}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: `${automation.success_rate}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "last_run",
      label: "Last Run",
      render: (automation: Automation) => (
        <span className="text-xs">
          {automation.last_run 
            ? new Date(automation.last_run).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            : "Never"
          }
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (automation: Automation) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toast({
              title: "Settings",
              description: "Automation settings will be available soon",
            });
          }}
          className="h-6 w-6 p-0"
        >
          <Settings className="h-3 w-3" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h1 className="text-lg font-semibold tracking-tight">Automations</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your LinkedIn outreach campaigns and automation workflows
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search automations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
        
        <DropdownSelect
          options={[
            { label: "All Statuses", value: "all" },
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Completed", value: "completed" }
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
            <Button className="h-9 px-4">Create Automation</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="LinkedIn Tech Professionals"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Campaign Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin_outreach">LinkedIn Outreach</SelectItem>
                    <SelectItem value="email_campaign">Email Campaign</SelectItem>
                    <SelectItem value="follow_up_sequence">Follow-up Sequence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message_template">Initial Message Template</Label>
                <Textarea
                  id="message_template"
                  value={formData.message_template}
                  onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
                  placeholder="Hi [Name], I noticed you work at [Company]..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="follow_up_message">Follow-up Message</Label>
                <Textarea
                  id="follow_up_message"
                  value={formData.follow_up_message}
                  onChange={(e) => setFormData({ ...formData, follow_up_message: e.target.value })}
                  placeholder="Hi [Name], following up on my previous message..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="delay_days">Follow-up Delay (days)</Label>
                <Input
                  id="delay_days"
                  type="number"
                  value={formData.delay_days}
                  onChange={(e) => setFormData({ ...formData, delay_days: e.target.value })}
                  min="1"
                  max="30"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create Automation</Button>
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
        data={filteredAutomations}
        columns={columns}
        loading={loading}
        onRowClick={(automation) => {
          toast({
            title: "Automation Details",
            description: "Detailed automation view will be available soon",
          });
        }}
        showSearch={false}
      />
    </div>
  );
};

export default Automations;