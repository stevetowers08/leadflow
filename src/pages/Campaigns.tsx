import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { DataTable } from "@/components/DataTable";
import { Search, X, Plus, Filter, Edit, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'linkedin' | 'phone' | 'social';
  targetAudience: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
  budget: number;
  created_at: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const { toast } = useToast();

  // Load campaigns data
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual Supabase queries
        // For now, start with empty array
        setCampaigns([]);
        
      } catch (error) {
        console.error('Error loading campaigns:', error);
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = !searchTerm || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || campaign.status === statusFilter;
    const matchesType = !typeFilter || campaign.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const columns = [
    {
      key: "name",
      label: "Campaign Name",
      render: (campaign: Campaign) => (
        <div className="font-medium">{campaign.name}</div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (campaign: Campaign) => (
        <span className="capitalize">{campaign.type}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (campaign: Campaign) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
          campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
          campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status}
        </span>
      ),
    },
    {
      key: "targetAudience",
      label: "Target Audience",
      render: (campaign: Campaign) => campaign.targetAudience,
    },
    {
      key: "impressions",
      label: "Impressions",
      render: (campaign: Campaign) => campaign.impressions.toLocaleString(),
    },
    {
      key: "conversions",
      label: "Conversions",
      render: (campaign: Campaign) => campaign.conversions,
    },
    {
      key: "budget",
      label: "Budget",
      render: (campaign: Campaign) => `$${campaign.budget.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Campaigns</h1>
          <p className="text-xs text-muted-foreground mt-1">Create and manage marketing campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
        
        <DropdownSelect
          options={[
            { label: "All Statuses", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Completed", value: "completed" }
          ]}
          value={statusFilter || "all"}
          onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}
          placeholder="Filter by status"
        />
        
        <DropdownSelect
          options={[
            { label: "All Types", value: "all" },
            { label: "Email", value: "email" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Phone", value: "phone" },
            { label: "Social", value: "social" }
          ]}
          value={typeFilter || "all"}
          onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}
          placeholder="Filter by type"
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3"
          onClick={clearFilters}
          disabled={!searchTerm && !statusFilter && !typeFilter}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      {/* Active Filters Display */}
      {(statusFilter || typeFilter || searchTerm) && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
              <span>Search: "{searchTerm}"</span>
              <button 
                onClick={() => setSearchTerm("")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {statusFilter && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
              <span>Status: {statusFilter}</span>
              <button 
                onClick={() => setStatusFilter("")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {typeFilter && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
              <span>Type: {typeFilter}</span>
              <button 
                onClick={() => setTypeFilter("")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0 
                ? ((campaigns.reduce((sum, c) => sum + c.clicks, 0) / campaigns.reduce((sum, c) => sum + c.impressions, 0)) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average CTR</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0 
                ? ((campaigns.reduce((sum, c) => sum + c.conversions, 0) / campaigns.reduce((sum, c) => sum + c.clicks, 0)) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Leads converted</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <DataTable
        data={filteredCampaigns}
        columns={columns}
        loading={loading}
        enableBulkActions={true}
        enableExport={true}
        exportFilename="campaigns-export.csv"
        itemName="campaign"
        itemNamePlural="campaigns"
        showSearch={false}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          showPageSizeSelector: true,
          showItemCount: true,
        }}
        bulkActions={[
          {
            id: 'update-status',
            label: 'Update Status',
            icon: Edit,
            action: async (campaigns) => {
              const newStatus = prompt('Enter new status (draft/active/paused/completed):');
              if (newStatus) {
                // In a real app, you'd update the database
                console.log('Updating campaigns:', campaigns.map(c => c.id), 'to status:', newStatus);
                toast({
                  title: "Status Updated",
                  description: `Updated ${campaigns.length} campaigns to ${newStatus}`,
                });
              }
            },
            variant: 'secondary'
          },
          {
            id: 'pause-campaigns',
            label: 'Pause Campaigns',
            icon: Pause,
            action: async (campaigns) => {
              // In a real app, you'd update the database
              console.log('Pausing campaigns:', campaigns.map(c => c.id));
              toast({
                title: "Campaigns Paused",
                description: `Paused ${campaigns.length} campaigns`,
              });
            },
            variant: 'secondary'
          }
        ]}
      />
    </div>
  );
};

export default Campaigns;