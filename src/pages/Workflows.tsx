import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/DataTable';
import { WorkflowBuilder, Workflow } from '@/components/WorkflowBuilder';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Edit, 
  Trash2,
  Users,
  Target,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Workflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { toast } = useToast();

  // Load workflows data
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual Supabase queries
        // For now, start with empty array
        setWorkflows([]);
        
      } catch (error) {
        console.error('Error loading workflows:', error);
        toast({
          title: "Error",
          description: "Failed to load workflows",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWorkflows();
  }, []);

  // Filter workflows
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = !searchTerm || 
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && workflow.isActive) ||
      (statusFilter === 'inactive' && !workflow.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setIsBuilderOpen(true);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsBuilderOpen(true);
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    if (workflow.id && workflows.find(w => w.id === workflow.id)) {
      // Update existing workflow
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w));
    } else {
      // Create new workflow
      const newWorkflow = { ...workflow, id: `workflow-${Date.now()}` };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    setIsBuilderOpen(false);
    setSelectedWorkflow(null);
  };

  const handleToggleWorkflow = async (workflow: Workflow) => {
    const updatedWorkflow = { ...workflow, isActive: !workflow.isActive };
    setWorkflows(prev => prev.map(w => w.id === workflow.id ? updatedWorkflow : w));
    
    toast({
      title: "Workflow Updated",
      description: `Workflow ${updatedWorkflow.isActive ? 'activated' : 'deactivated'}`,
    });
  };

  const handleDeleteWorkflow = async (workflow: Workflow) => {
    if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      setWorkflows(prev => prev.filter(w => w.id !== workflow.id));
      toast({
        title: "Workflow Deleted",
        description: `"${workflow.name}" has been deleted`,
      });
    }
  };

  const getStepCount = (workflow: Workflow) => {
    return workflow.steps.length;
  };

  const getLastRun = (workflow: Workflow) => {
    // Mock data - in real app, this would come from workflow execution logs
    return '2 hours ago';
  };

  const columns = [
    {
      key: "name",
      label: "Workflow Name",
      render: (workflow: Workflow) => (
        <div>
          <div className="font-medium">{workflow.name}</div>
          <div className="text-sm text-muted-foreground">{workflow.description}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (workflow: Workflow) => (
        <Badge variant={workflow.isActive ? "default" : "secondary"}>
          {workflow.isActive ? (
            <>
              <Play className="h-3 w-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <Pause className="h-3 w-3 mr-1" />
              Inactive
            </>
          )}
        </Badge>
      ),
    },
    {
      key: "trigger",
      label: "Trigger",
      render: (workflow: Workflow) => (
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{workflow.trigger.name}</span>
        </div>
      ),
    },
    {
      key: "steps",
      label: "Steps",
      render: (workflow: Workflow) => (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{getStepCount(workflow)} steps</span>
        </div>
      ),
    },
    {
      key: "lastRun",
      label: "Last Run",
      render: (workflow: Workflow) => (
        <span className="text-sm text-muted-foreground">{getLastRun(workflow)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (workflow: Workflow) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleWorkflow(workflow)}
            className="h-8 w-8 p-0"
          >
            {workflow.isActive ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditWorkflow(workflow)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteWorkflow(workflow)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Workflows</h1>
          <p className="text-xs text-muted-foreground mt-1">Automate your people management processes</p>
        </div>
        <Button onClick={handleCreateWorkflow}>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
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
      </div>

      {/* Active Filters Display */}
      {(statusFilter || searchTerm) && (
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
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">All workflows</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Workflow runs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Successful executions</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows Table */}
      <DataTable
        data={filteredWorkflows}
        columns={columns}
        loading={loading}
        enableBulkActions={true}
        enableExport={true}
        exportFilename="workflows-export.csv"
        itemName="workflow"
        itemNamePlural="workflows"
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
            id: 'activate-workflows',
            label: 'Activate',
            icon: Play,
            action: async (workflows) => {
              workflows.forEach(workflow => {
                if (!workflow.isActive) {
                  handleToggleWorkflow(workflow);
                }
              });
            },
            variant: 'secondary'
          },
          {
            id: 'deactivate-workflows',
            label: 'Deactivate',
            icon: Pause,
            action: async (workflows) => {
              workflows.forEach(workflow => {
                if (workflow.isActive) {
                  handleToggleWorkflow(workflow);
                }
              });
            },
            variant: 'secondary'
          }
        ]}
      />

      {/* Workflow Builder Dialog */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
            </DialogTitle>
          </DialogHeader>
          <WorkflowBuilder
            workflow={selectedWorkflow || undefined}
            onSave={handleSaveWorkflow}
            onCancel={() => {
              setIsBuilderOpen(false);
              setSelectedWorkflow(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workflows;

