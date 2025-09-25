import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { JobDetailPopup } from "@/components/JobDetailPopup";
import { JobsStatsCards } from "@/components/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Clock, DollarSign, Bot, Users, Briefcase, Zap, Target, AlertTriangle, Trash2 } from "lucide-react";
import { getClearbitLogo } from "@/utils/logoService";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs"> & {
  company_name?: string;
  company_industry?: string;
  company_logo_url?: string;
  company_head_office?: string;
  company_size?: string;
  company_website?: string;
  company_lead_score?: string;
  company_priority?: string;
  company_automation_active?: boolean;
  company_confidence_level?: string;
  company_linkedin_url?: string;
  company_score_reason?: string;
  total_leads?: number;
  new_leads?: number;
  automation_started_leads?: number;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("posted_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const { toast } = useToast();
  
  // Sort options
  const sortOptions = [
    { label: "Posted Date", value: "posted_date" },
    { label: "Job Title", value: "title" },
    { label: "Company", value: "company_name" },
    { label: "Location", value: "location" },
    { label: "Priority", value: "priority" },
    { label: "AI Score", value: "lead_score_job" },
    { label: "Valid Through", value: "valid_through" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Expiring Soon", value: "expiring_soon" },
  ];

  // Priority filter options
  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
    { label: "Urgent", value: "urgent" },
  ];

  // Calculate stats for top stats bar
  const jobsStats = {
    activeJobs: jobs.filter(job => !job.valid_through || new Date(job.valid_through) >= new Date()).length,
    automatedJobs: jobs.filter(job => job.automation_started_leads && job.automation_started_leads > 0).length,
    pendingJobs: jobs.filter(job => job.new_leads && job.new_leads > 0).length,
    endingSoonJobs: jobs.filter(job => {
      if (!job.valid_through) return false;
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return new Date(job.valid_through) <= sevenDaysFromNow && new Date(job.valid_through) >= new Date();
    }).length
  };

  // Debug logging
  console.log('Jobs Stats Debug:', {
    totalJobs: jobs.length,
    automatedJobs: jobsStats.automatedJobs,
    pendingJobs: jobsStats.pendingJobs,
    sampleJobs: jobs.slice(0, 3).map(job => ({
      title: job.title,
      new_leads: job.new_leads,
      automation_started_leads: job.automation_started_leads,
      total_leads: job.total_leads
    }))
  });

  // Debug logging
  console.log('🔍 Current filter state:', { statusFilter, searchTerm, priorityFilter });
  console.log('🔍 Total jobs:', jobs.length);

  // Filter and sort jobs
  const filteredAndSortedJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch = !searchTerm || (
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.function?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Status filter
    const matchesStatus = statusFilter === "all" || (() => {
      if (statusFilter === "recent") {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return job.created_at && new Date(job.created_at) >= oneDayAgo;
      } else if (statusFilter === "sales") {
        return job.title?.toLowerCase().includes('sales');
      } else if (statusFilter === "not_automated") {
        // Show jobs where there are leads with stage "new" AND no automation has started
        return job.new_leads && job.new_leads > 0 && job.automation_started_leads === 0;
      }
      return true;
    })();

    // Filter out expired jobs for all tabs
    const isActiveJob = !job.valid_through || new Date(job.valid_through) >= new Date();

    // Priority filter
    const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority && isActiveJob;
  });

  console.log('🔍 Filtered jobs count:', filteredAndSortedJobs.length);

  const sortedJobs = filteredAndSortedJobs.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "posted_date":
        aValue = new Date(a.posted_date || 0).getTime();
        bValue = new Date(b.posted_date || 0).getTime();
        break;
      case "title":
        aValue = a.title?.toLowerCase() || "";
        bValue = b.title?.toLowerCase() || "";
        break;
      case "company_name":
        aValue = a.company_name?.toLowerCase() || "";
        bValue = b.company_name?.toLowerCase() || "";
        break;
      case "location":
        aValue = a.location?.toLowerCase() || "";
        bValue = b.location?.toLowerCase() || "";
        break;
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority?.toLowerCase() as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority?.toLowerCase() as keyof typeof priorityOrder] || 0;
        break;
      case "lead_score_job":
        aValue = a.lead_score_job || 0;
        bValue = b.lead_score_job || 0;
        break;
      case "valid_through":
        aValue = new Date(a.valid_through || 0).getTime();
        bValue = new Date(b.valid_through || 0).getTime();
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs first
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_date", { ascending: false });

      console.log('🔍 Jobs fetch result:', { jobsData, jobsError });

      if (jobsError) throw jobsError;

      // Fetch companies separately
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("id, name, industry, profile_image_url, head_office, company_size, website, lead_score, priority, automation_active, confidence_level, linkedin_url, score_reason");

      if (companiesError) throw companiesError;

      // Fetch people separately
      const { data: peopleData, error: peopleError } = await supabase
        .from("people")
        .select("id, company_id, stage, automation_started_at");

      if (peopleError) throw peopleError;

      // Create maps for quick lookup
      const companiesMap = new Map(companiesData?.map(company => [company.id, company]) || []);
      const peopleMap = new Map();
      
      // Group people by company_id
      peopleData?.forEach(person => {
        if (person.company_id) {
          if (!peopleMap.has(person.company_id)) {
            peopleMap.set(person.company_id, []);
          }
          peopleMap.get(person.company_id).push(person);
        }
      });

      // Transform the data to include company information and lead counts
      const jobsWithCompanyAndLeads = (jobsData || []).map(job => {
        const company = companiesMap.get(job.company_id);
        const leads = peopleMap.get(job.company_id) || [];
        
        const newLeadsCount = leads.filter(lead => lead.stage === 'new').length;
        const automatedLeadsCount = leads.filter(lead => lead.stage !== 'new' || lead.automation_started_at).length;
        
        // Debug logging for first few jobs
        if (job.id && jobsData.indexOf(job) < 3) {
          console.log(`Job ${job.title}:`, {
            company_id: job.company_id,
            company_data: company,
            clearbit_logo_url: company?.website ? getClearbitLogo(company.name, company.website) : null,
            total_leads: leads.length,
            new_leads: newLeadsCount,
            automation_started_leads: automatedLeadsCount,
            lead_stages: leads.map(l => l.stage)
          });
        }
        
        return {
          ...job,
          company_name: company?.name,
          company_industry: company?.industry,
          company_logo_url: company?.website ? getClearbitLogo(company.name, company.website) : null,
          company_head_office: company?.head_office,
          company_size: company?.company_size,
          company_website: company?.website,
          company_lead_score: company?.lead_score,
          company_priority: company?.priority,
          company_automation_active: company?.automation_active,
          company_confidence_level: company?.confidence_level,
          company_linkedin_url: company?.linkedin_url,
          company_score_reason: company?.score_reason,
          total_leads: leads.length,
          new_leads: newLeadsCount,
          automation_started_leads: automatedLeadsCount
        };
      });

      console.log('🔍 Jobs data:', jobsWithCompanyAndLeads);
      setJobs(jobsWithCompanyAndLeads);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Set up real-time subscriptions for automatic updates
    const companiesSubscription = supabase
      .channel('companies-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'companies' 
        }, 
        (payload) => {
          console.log('Companies table changed:', payload);
          // Refresh jobs data when companies are added/updated/deleted
          fetchJobs();
        }
      )
      .subscribe();

    const jobsSubscription = supabase
      .channel('jobs-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'jobs' 
        }, 
        (payload) => {
          console.log('Jobs table changed:', payload);
          // Refresh jobs data when jobs are added/updated/deleted
          fetchJobs();
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(companiesSubscription);
      supabase.removeChannel(jobsSubscription);
    };
  }, []);

  useEffect(() => {
    console.log('🔍 StatusFilter changed to:', statusFilter);
    console.log('🔍 Jobs after filter change:', jobs.length);
  }, [statusFilter, jobs]);

  const columns = [
    {
      key: "status",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "120px",
      render: (job: Job) => {
        if (job.automation_started_leads && job.automation_started_leads > 0) {
          return (
            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200 w-32 flex justify-center">
              AUTOMATED ({job.automation_started_leads})
            </div>
          );
        } else if (job.new_leads && job.new_leads > 0) {
          return (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 w-32 flex justify-center">
              NEW JOB
            </div>
          );
        } else {
          return (
            <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200 w-32 flex justify-center">
              -
            </div>
          );
        }
      },
    },
    {
      key: "title",
      label: "Job Title",
      render: (job: Job) => (
        <div className="min-w-0 w-80">
          <div className="text-sm font-medium break-words leading-tight">{job.title || "-"}</div>
        </div>
      ),
    },
    {
      key: "company_name",
      label: "Company",
      render: (job: Job) => (
        <div className="min-w-0 w-64">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {job.company_logo_url ? (
                <img 
                  src={job.company_logo_url} 
                  alt={job.company_name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    console.log(`Failed to load company logo for ${job.company_name}: ${job.company_logo_url}`);
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded company logo for ${job.company_name}: ${job.company_logo_url}`);
                  }}
                />
              ) : null}
              <div 
                className={`w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold ${job.company_logo_url ? 'hidden' : 'flex'}`}
              >
                {job.company_name ? job.company_name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="text-sm font-medium break-words leading-tight">{job.company_name || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "company_industry",
      label: "Industry",
      render: (job: Job) => (
        <div className="min-w-0 w-80">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.company_industry || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (job: Job) => (
        <div className="min-w-0 w-56">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.location || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "function",
      label: "Function",
      render: (job: Job) => (
        <div className="min-w-0 w-64">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.function || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        const priority = job.priority?.toLowerCase() || "medium";
        const uppercasePriority = priority.toUpperCase();
        return (
          <div className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200 w-24 flex justify-center">
            {uppercasePriority}
          </div>
        );
      },
    },
    {
      key: "lead_score_job",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
            {job.lead_score_job || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "total_leads",
      label: "Leads",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
            {job.total_leads || 0}
          </span>
        </div>
      ),
    },
    {
      key: "posted_date",
      label: "Posted",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        if (!job.posted_date) return <span className="text-sm">-</span>;
        
        try {
          const date = new Date(job.posted_date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {diffDays === 0 ? 'Today' : 
                 diffDays === 1 ? '1 day ago' : 
                 `${diffDays} days ago`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-sm">-</span>;
        }
      },
    },
    {
      key: "valid_through",
      label: "Expires",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        if (!job.valid_through) return <span className="text-sm">-</span>;
        
        try {
          const expiryDate = new Date(job.valid_through);
          const now = new Date();
          const diffTime = expiryDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let className = "text-sm";
          if (diffDays < 0) {
            className += " text-red-600 font-medium";
          } else if (diffDays <= 7) {
            className += " text-yellow-600 font-medium";
          } else {
            className += " text-muted-foreground";
          }
          
          return (
            <div className="text-center">
              <div className={className}>
                {diffDays < 0 ? 'Expired' :
                 diffDays === 0 ? 'Today' :
                 diffDays === 1 ? 'Tomorrow' :
                 `${diffDays} days`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-sm">-</span>;
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteJob(job.id, job.title);
          }}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete the job "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Job "${jobTitle}" has been deleted.`,
      });

      // Refresh the jobs list
      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete job: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Jobs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage job postings and opportunities
            </p>
          </div>
        </div>
      </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header with Stats in Top Right */}
        <div className="grid grid-cols-12 gap-4 items-center border-b pb-3">
          <div className="col-span-6">
            <h1 className="text-base font-semibold tracking-tight">Jobs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage job postings and opportunities
            </p>
          </div>
          
          {/* Stats Cards - Top Right */}
          <div className="col-span-6 flex justify-end">
            <div className="flex items-center gap-3">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{jobsStats.activeJobs}</span>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{jobsStats.automatedJobs}</span>
                  <span className="text-sm text-gray-600">Automated</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{jobsStats.pendingJobs}</span>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{jobsStats.endingSoonJobs}</span>
                  <span className="text-sm text-gray-600">Ending Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Tabs and Controls Row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Navigation Tabs - Left Aligned */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="flex-1">
            <TabsList className="grid w-fit grid-cols-4 border border-gray-200">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              LAST 24HRS ({jobs.filter(job => {
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const isActiveJob = !job.valid_through || new Date(job.valid_through) >= new Date();
                return job.created_at && new Date(job.created_at) >= oneDayAgo && isActiveJob;
              }).length})
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              SALES ROLES ({jobs.filter(job => {
                const isActiveJob = !job.valid_through || new Date(job.valid_through) >= new Date();
                return job.title?.toLowerCase().includes('sales') && isActiveJob;
              }).length})
            </TabsTrigger>
            <TabsTrigger value="not_automated" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              NEW JOBS ({jobs.filter(job => {
                const isActiveJob = !job.valid_through || new Date(job.valid_through) >= new Date();
                return job.new_leads && job.new_leads > 0 && job.automation_started_leads === 0 && isActiveJob;
              }).length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              ALL JOBS ({jobs.filter(job => {
                const isActiveJob = !job.valid_through || new Date(job.valid_through) >= new Date();
                return isActiveJob;
              }).length})
            </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Priority Filter and Sort Controls - Far Right */}
          <div className="flex items-center gap-3">
            {/* Priority Filter */}
            <DropdownSelect
              options={priorityOptions}
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value)}
              placeholder="All Priorities"
              className="min-w-32 bg-white"
            />
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort:</span>
              <DropdownSelect
                options={sortOptions}
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
                placeholder="Select sort"
                className="min-w-32 bg-white"
              />
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <DataTable
          data={sortedJobs}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          pagination={{
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />
      </div>
      
      {/* Job Detail Modal */}
      {selectedJob && (
        <>
          {console.log('🔍 Selected Job Data:', {
            company_name: selectedJob.company_name,
            company_industry: selectedJob.company_industry,
            company_head_office: selectedJob.company_head_office,
            company_size: selectedJob.company_size,
            company_website: selectedJob.company_website,
            company_lead_score: selectedJob.company_lead_score,
            company_priority: selectedJob.company_priority,
            company_automation_active: selectedJob.company_automation_active,
            company_confidence_level: selectedJob.company_confidence_level,
            company_linkedin_url: selectedJob.company_linkedin_url,
            total_leads: selectedJob.total_leads
          })}
          <JobDetailPopup
          job={{
            ...selectedJob,
            companies: {
              name: selectedJob.company_name,
              industry: selectedJob.company_industry,
              head_office: selectedJob.company_head_office,
              company_size: selectedJob.company_size,
              website: selectedJob.company_website,
              lead_score: selectedJob.company_lead_score,
              priority: selectedJob.company_priority,
              automation_active: selectedJob.company_automation_active,
              confidence_level: selectedJob.company_confidence_level,
              profile_image_url: selectedJob.company_logo_url,
              people_count: selectedJob.total_leads,
              score_reason: selectedJob.company_score_reason
            }
          }}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedJob(null);
          }}
        />
        </>
      )}
    </>
  );
};

export default Jobs;