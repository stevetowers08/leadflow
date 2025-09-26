import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { usePopup } from "@/contexts/PopupContext";
import { JobsStatsCards } from "@/components/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Trash2 } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getCompanyLogoUrlSync } from "@/utils/logoService";
import { getLabel } from '@/utils/labels';
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs"> & {
  company_name?: string;
  company_industry?: string;
  company_logo_url?: string;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const { openJobPopup } = usePopup();
  const { toast } = useToast();

  usePageMeta({
    title: "Jobs",
    description: "Manage and track job opportunities"
  });

  const sortOptions = [
    { label: "Date Created", value: "created_at" },
    { label: "Title", value: "title" },
    { label: "Priority", value: "priority" },
    { label: "Lead Score", value: "lead_score_job" },
    { label: "Location", value: "location" },
  ];

  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "Very High", value: "VERY HIGH" },
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ];

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(job => job.priority === priorityFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Job];
      const bValue = b[sortBy as keyof Job];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [jobs, searchTerm, sortBy, sortOrder, priorityFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          companies!inner(name, website, industry)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to include company information
      const transformedData = data?.map(job => ({
        ...job,
        company_name: job.companies?.name || null,
        company_industry: job.companies?.industry || null,
        company_logo_url: getCompanyLogoUrlSync(
          job.companies?.name || '', 
          job.companies?.website
        )
      })) || [];
      
      setJobs(transformedData);
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
  }, []);

  const columns = [
    {
      key: "status",
      label: "Status",
      width: "120px",
      render: (job: Job) => (
        <StatusBadge 
          status={job.priority || "MEDIUM"} 
          size="sm"
        />
      )
    },
    {
      key: "title",
      label: "Job Title",
      width: "200px",
      render: (job: Job) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            {job.company_logo_url ? (
              <img 
                src={job.company_logo_url} 
                alt={job.company_name || 'Company'}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold"
              style={{ display: job.company_logo_url ? 'none' : 'flex' }}
            >
              {job.company_name ? job.company_name.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {job.title}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "company_name",
      label: "Company",
      width: "150px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600 truncate">
          {job.company_name || "Not specified"}
        </span>
      )
    },
    {
      key: "industry",
      label: "Industry",
      width: "180px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600 truncate">
          {job.company_industry || "Not specified"}
        </span>
      )
    },
    {
      key: "location",
      label: "Location",
      width: "150px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600 truncate">
          {job.location || "Not specified"}
        </span>
      )
    },
    {
      key: "function",
      label: "Function",
      width: "200px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600 truncate">
          {job.function || "Not specified"}
        </span>
      )
    },
    {
      key: "priority",
      label: "Priority",
      width: "100px",
      render: (job: Job) => (
        <StatusBadge 
          status={job.priority || "MEDIUM"} 
          size="sm"
        />
      )
    },
    {
      key: "lead_score_job",
      label: "AI Score",
      width: "80px",
      render: (job: Job) => (
        <span className="text-sm font-medium text-gray-900">
          {job.lead_score_job || 0}
        </span>
      )
    },
    {
      key: "leads",
      label: "Leads",
      width: "80px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600">
          0
        </span>
      )
    },
    {
      key: "posted_date",
      label: "Posted",
      width: "100px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600">
          {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "Not specified"}
        </span>
      )
    },
    {
      key: "valid_through",
      label: "Expires",
      width: "100px",
      render: (job: Job) => (
        <span className="text-sm text-gray-600">
          {job.valid_through ? new Date(job.valid_through).toLocaleDateString() : "Not specified"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      width: "120px",
      render: (job: Job) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openJobPopup(job.id)}
          >
            View Details
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage and track job opportunities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <JobsStatsCards jobs={jobs} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <DropdownSelect
          options={priorityOptions}
          value={priorityFilter}
          onValueChange={setPriorityFilter}
          placeholder="Filter by priority"
        />
        <DropdownSelect
          options={sortOptions}
          value={sortBy}
          onValueChange={setSortBy}
          placeholder="Sort by"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredAndSortedJobs}
        columns={columns}
        loading={loading}
        onRowClick={(job) => openJobPopup(job.id)}
      />
    </div>
  );
};

export default Jobs;