/**
 * Modern Jobs Page - Matching Exact HTML Structure
 * 
 * Features:
 * - Exact HTML structure matching provided design
 * - Sidebar navigation
 * - Header with search and user profile
 * - Stats cards section
 * - Filter tabs
 * - Search and filter controls
 * - Data table with specific columns
 * - Pagination
 */

import { DropdownSelect } from "@/components/ui/dropdown-select";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { Page, type StatItemProps } from "@/design-system/components";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { getJobStatus } from "@/utils/jobStatus";
import { getClearbitLogo } from "@/utils/logoService";
import {
    ArrowUpDown,
    Bot,
    Briefcase,
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Search,
    Star,
    Target,
    Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Job = Tables<"jobs"> & {
  companies?: {
    name?: string;
    industry?: string;
    logo_url?: string;
    head_office?: string;
    company_size?: string;
    website?: string;
    lead_score?: string;
    priority?: string;
    automation_active?: boolean;
    confidence_level?: string;
    linkedin_url?: string;
    score_reason?: string;
    is_favourite?: boolean;
    pipeline_stage?: string;
  };
  total_leads?: number;
  new_leads?: number;
  automation_started_leads?: number;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("posted_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<{id: string, full_name: string, role: string}[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();

  // Calculate job status based on company's pipeline stage
  const getJobStatusFromCompany = (job: Job): string => {
    return getJobStatus(job.companies?.pipeline_stage);
  };

  // Sort options
  const sortOptions = [
    { label: "Posted Date", value: "posted_date" },
    { label: "Job Title", value: "title" },
    { label: "Company", value: "companies.name" },
    { label: "Location", value: "location" },
    { label: "Salary", value: "salary_range" },
  ];

  // Status options (based on automation_active and other job states)
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Automated", value: "automated" },
    { label: "Not Automated", value: "not_automated" },
    { label: "Expired", value: "expired" },
  ];

  // Priority options
  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from("jobs")
          .select(`
            *,
            companies!inner(
              name,
              industry,
              logo_url,
              head_office,
              company_size,
              website,
              lead_score,
              priority,
              automation_active,
              confidence_level,
              linkedin_url,
              score_reason,
              is_favourite,
              pipeline_stage,
              people(count)
            )
          `);

        // Apply filters
        if (statusFilter !== 'all') {
          switch (statusFilter) {
            case 'active':
              query = query.eq('automation_active', false);
              break;
            case 'automated':
              query = query.eq('automation_active', true);
              break;
            case 'not_automated':
              query = query.eq('automation_active', false);
              break;
            case 'expired':
              query = query.lt('valid_through', new Date().toISOString().split('T')[0]);
              break;
          }
        }

        if (priorityFilter !== 'all') {
          query = query.eq('priority', priorityFilter);
        }

        // Apply search
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,companies.name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === "asc" });

        const { data, error } = await query;

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch jobs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [statusFilter, priorityFilter, searchTerm, sortBy, sortOrder, toast]);

  // Calculate stats for stats cards
  const jobsStats = useMemo(() => {
    let activeJobs = 0;
    let automatedJobs = 0;
    let pendingJobs = 0;
    let endingSoonJobs = 0;

    jobs.forEach(job => {
      // Count active jobs (any job that's not closed)
      if (job.companies?.pipeline_stage !== 'closed_lost' && job.companies?.pipeline_stage !== 'closed_won') {
        activeJobs++;
      }
      
      // Count automated jobs
      if (job.companies?.automation_active) {
        automatedJobs++;
      }
      
      // Count pending jobs (new leads, automated, replied)
      if (['new_lead', 'automated', 'replied'].includes(job.companies?.pipeline_stage || '')) {
        pendingJobs++;
      }
      
      // Count ending soon jobs (negotiation stage)
      if (job.companies?.pipeline_stage === 'negotiation') {
        endingSoonJobs++;
      }
    });

    return {
      totalJobs: jobs.length,
      activeJobs,
      automatedJobs,
      pendingJobs,
      endingSoonJobs
    };
  }, [jobs]);

  // Stats for Jobs page
  const stats: StatItemProps[] = [
    {
      icon: Briefcase,
      value: jobsStats.activeJobs,
      label: "active jobs"
    },
    {
      icon: Zap,
      value: jobsStats.automatedJobs,
      label: "automated"
    },
    {
      icon: Target,
      value: jobsStats.pendingJobs,
      label: "pending"
    },
    {
      icon: CheckCircle,
      value: jobsStats.endingSoonJobs,
      label: "ending soon"
    }
  ];

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          job.title?.toLowerCase().includes(searchLower) ||
          job.companies?.name?.toLowerCase().includes(searchLower) ||
          job.location?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [jobs, searchTerm]);


  // Company Logo Component
  const CompanyLogo = ({ job }: { job: Job }) => {
    const logoUrl = getClearbitLogo(job.companies?.name || "");
    
    return (
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={`${job.companies?.name} logo`}
            className="h-full w-full object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <Building2 className={cn("h-1/2 w-1/2 text-muted-foreground", logoUrl && "hidden")} />
      </div>
    );
  };

  const tableData = useMemo(() => filteredJobs.map((job) => ({
    id: job.id,
    title: job.title,
    employment_type: job.employment_type,
    company: job.companies?.name || "-",
    industry: job.companies?.industry || "-",
    location: job.location || "-",
    function: job.function || "-",
    priority: job.priority || "medium",
    ai_score: job.lead_score_job || job.companies?.lead_score || "-",
    leads: job.companies?.people?.[0]?.count || "-",
    posted_date: job.posted_date || null,
    expires: job.valid_through || "-",
    status: getJobStatusFromCompany(job),
    is_favorite: job.is_favorite,
  })), [filteredJobs]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Page
      title=""
      stats={stats}
    >
      {/* Unified Tabs and Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Modern Filter Tabs */}
        <div className="flex items-center gap-1">
          {[
            { 
              id: "recent", 
              label: "Last 24hrs", 
              icon: Clock, 
              count: jobs.filter(job => {
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return job.created_at && new Date(job.created_at) >= oneDayAgo;
              }).length
            },
            { 
              id: "sales", 
              label: "Sales Roles", 
              icon: DollarSign, 
              count: jobs.filter(job => job.title?.toLowerCase().includes('sales')).length
            },
            { 
              id: "not_automated", 
              label: "New Jobs", 
              icon: Bot, 
              count: jobs.filter(job => job.new_leads && job.new_leads > 0 && job.automation_started_leads === 0).length
            },
            { 
              id: "all", 
              label: "All Jobs", 
              icon: Briefcase, 
              count: jobs.length
            }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200",
                  "border-b-2 border-transparent hover:border-gray-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-1",
                  statusFilter === tab.id
                    ? "text-primary-600 border-primary-600 bg-primary-50/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors",
                  statusFilter === tab.id ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className="font-medium">{tab.label}</span>
                <span className={cn(
                  "inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full transition-colors min-w-[20px]",
                  statusFilter === tab.id
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48 text-sm"
          />
          </div>
          
          {/* Status Filter */}
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
            placeholder="All Statuses"
            className="min-w-32 bg-white"
          />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
            placeholder="Sort by"
              className="min-w-32 bg-white"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm min-w-full font-sans" role="table" aria-label="Data table">
          <thead className="[&_tr]:border-b">
            <tr className="transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-200 bg-gray-50/50">
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center" scope="col" style={{width: '120px', minWidth: '120px'}}>
                <div className="flex items-center gap-2 justify-center">
                  <span>Status</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left" scope="col" style={{width: '450px', minWidth: '450px'}}>
                <div className="flex items-center gap-2 justify-start">
                  <span>Job Title</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left" scope="col" style={{width: '300px', minWidth: '300px'}}>
                <div className="flex items-center gap-2 justify-start">
                  <span>Company</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left" scope="col" style={{width: '200px', minWidth: '200px'}}>
                <div className="flex items-center gap-2 justify-start">
                  <span>Industry</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left" scope="col" style={{width: '150px', minWidth: '150px'}}>
                <div className="flex items-center gap-2 justify-start">
                  <span>Location</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left" scope="col" style={{width: '180px', minWidth: '180px'}}>
                <div className="flex items-center gap-2 justify-start">
                  <span>Function</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center" scope="col" style={{width: '120px', minWidth: '120px'}}>
                <div className="flex items-center gap-2 justify-center">
                  <span>Priority</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center" scope="col" style={{width: '100px', minWidth: '100px'}}>
                <div className="flex items-center gap-2 justify-center">
                  <span>AI Score</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center" scope="col" style={{width: '100px', minWidth: '100px'}}>
                <div className="flex items-center gap-2 justify-center">
                  <span>Leads</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center" scope="col" style={{width: '120px', minWidth: '120px'}}>
                <div className="flex items-center gap-2 justify-center">
                  <span>Posted</span>
                </div>
              </th>
              <th className="h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center" scope="col" style={{width: '120px', minWidth: '120px'}}>
                <div className="flex items-center gap-2 justify-center">
                  <span>Expires</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedJobs.map((job, index) => (
              <tr 
                key={job.id} 
                className="data-[state=selected]:bg-muted border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200 group cursor-pointer relative" 
                role="row" 
                tabIndex={0} 
                aria-label={`Row ${index + 1}`}
                onClick={() => openPopup('job', job.id, job.title)}
              >
                {/* Status */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 text-center" style={{width: '120px', minWidth: '120px'}}>
                  <div className="border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]">
                    New Lead
                  </div>
                </td>
                
                {/* Job Title */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0" style={{width: '450px', minWidth: '450px'}}>
                  <div className="min-w-0">
                    <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {job.title || "-"}
                    </div>
                  </div>
                </td>
                
                {/* Company */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0" style={{width: '300px', minWidth: '300px'}}>
                  <div className="min-w-0 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors duration-150">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {job.companies?.website ? (
                          <img 
                            src={getClearbitLogo(job.companies.name || "")} 
                            alt={job.companies.name}
                            className="w-6 h-6 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white items-center justify-center text-xs font-semibold hidden">
                          {job.companies?.name ? job.companies.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="text-sm leading-tight hover:text-blue-600 transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis">
                          {job.companies?.name || "-"}
                        </div>
                      </div>
                      <div>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation hover:scale-[1.02] active:scale-98 min-h-[44px] h-6 w-6 p-0 hover:bg-transparent text-gray-500 hover:text-yellow-500">
                          <Star className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Industry */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0" style={{width: '200px', minWidth: '200px'}}>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {job.companies?.industry || "-"}
                    </div>
                  </div>
                </td>
                
                {/* Location */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0" style={{width: '150px', minWidth: '150px'}}>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {job.location || "-"}
                    </div>
                  </div>
                </td>
                
                {/* Function */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0" style={{width: '180px', minWidth: '180px'}}>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {job.function || "-"}
                    </div>
                  </div>
                </td>
                
                {/* Priority */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 text-center" style={{width: '120px', minWidth: '120px'}}>
                  <div className="border justify-center items-center flex mx-auto bg-orange-50 text-orange-700 border-orange-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]">
                    {job.priority || "Medium"}
                  </div>
                </td>
                
                {/* AI Score */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 text-center" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm bg-rose-50 text-rose-700 border-rose-200 border w-12 h-8 rounded-full flex items-center justify-center">
                        <span className="font-mono text-xs font-semibold">{job.lead_score_job || job.companies?.lead_score || "-"}</span>
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Leads */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 text-center" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 border border-gray-200">
                      {job.total_leads || 0}
                    </span>
                  </div>
                </td>
                
                {/* Posted */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 text-center" style={{width: '120px', minWidth: '120px'}}>
                  <span className="text-sm text-gray-500">
                    {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "-"}
                  </span>
                </td>
                
                {/* Expires */}
                <td className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 py-1 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 text-center" style={{width: '120px', minWidth: '120px'}}>
                  <span className="text-sm text-gray-500">
                    {job.valid_through ? new Date(job.valid_through).toLocaleDateString() : "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Page>
  );
};

export default Jobs;
