import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { usePopup } from "@/contexts/PopupContext";
import { CompaniesStatsCards } from "@/components/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Trash2 } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getCompanyLogoUrlSync } from "@/utils/logoService";
import { getLabel } from '@/utils/labels';
import type { Tables } from "@/integrations/supabase/types";

type Company = Tables<"companies"> & {
  people_count?: number;
  jobs_count?: number;
};

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { openCompanyPopup } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  // Set page meta tags
  usePageMeta({
    title: 'Companies - Empowr CRM',
    description: 'Manage your company database and track business relationships. View company details, job opportunities, and lead connections.',
    keywords: 'companies, business, CRM, company management, business relationships, job opportunities',
    ogTitle: 'Companies - Empowr CRM',
    ogDescription: 'Manage your company database and track business relationships.',
    twitterTitle: 'Companies - Empowr CRM',
    twitterDescription: 'Manage your company database and track business relationships.'
  });

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Company Name", value: "name" },
    { label: "Industry", value: "industry" },
    { label: "Head Office", value: "head_office" },
    { label: getLabel('sort', 'ai_score'), value: "lead_score" },
    { label: getLabel('sort', 'priority'), value: "priority" },
    { label: "Leads Count", value: "people_count" },
    { label: "Jobs Count", value: "jobs_count" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Qualified", value: "qualified" },
    { label: "Prospect", value: "prospect" },
    { label: "New Lead", value: "new" },
  ];

  // Calculate stats for stats cards
  const companiesStats = useMemo(() => {
    let activeCompanies = 0;
    let qualifiedCompanies = 0;
    let prospectCompanies = 0;
    let newCompanies = 0;
    let companiesWithLeads = 0;
    let companiesWithJobs = 0;
    
    companies.forEach(company => {
      // Count companies with leads
      if (company.people_count && company.people_count > 0) {
        companiesWithLeads++;
      }
      
      // Count companies with jobs
      if (company.jobs_count && company.jobs_count > 0) {
        companiesWithJobs++;
      }
      
      // Categorize by status
      if (company.automation_active) {
        activeCompanies++;
      } else if (company.confidence_level === 'high') {
        qualifiedCompanies++;
      } else if (company.confidence_level === 'medium') {
        prospectCompanies++;
      } else {
        newCompanies++;
      }
    });
    
    return {
      totalCompanies: companies.length,
      activeCompanies,
      qualifiedCompanies,
      prospectCompanies,
      newCompanies,
      companiesWithLeads,
      companiesWithJobs
    };
  }, [companies]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    // Filter by search term and status
    const filtered = companies.filter(company => {
      // Search filter
      const matchesSearch = !searchTerm || (() => {
        const searchLower = searchTerm.toLowerCase();
        return (
          company.name?.toLowerCase().includes(searchLower) ||
          company.industry?.toLowerCase().includes(searchLower) ||
          company.head_office?.toLowerCase().includes(searchLower)
        );
      })();

      // Status filter
      const matchesStatus = statusFilter === "all" || (() => {
        if (company.automation_active) return statusFilter === "active";
        else if (company.confidence_level === 'high') return statusFilter === "qualified";
        else if (company.confidence_level === 'medium') return statusFilter === "prospect";
        else if (company.confidence_level === 'low') return statusFilter === "new";
        else return statusFilter === "new";
      })();

      return matchesSearch && matchesStatus;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "created_at":
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "industry":
          aValue = a.industry?.toLowerCase() || "";
          bValue = b.industry?.toLowerCase() || "";
          break;
        case "head_office":
          aValue = a.head_office?.toLowerCase() || "";
          bValue = b.head_office?.toLowerCase() || "";
          break;
        case "lead_score":
          aValue = parseInt(a.lead_score || "0");
          bValue = parseInt(b.lead_score || "0");
          break;
        case "priority":
          const priorityOrder = { urgent: 4, HIGH: 3, MEDIUM: 2, LOW: 1, 'VERY HIGH': 5 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case "people_count":
          aValue = a.people_count || 0;
          bValue = b.people_count || 0;
          break;
        case "jobs_count":
          aValue = a.jobs_count || 0;
          bValue = b.jobs_count || 0;
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
  }, [companies, searchTerm, sortBy, sortOrder, statusFilter]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Fetch all companies
      const { data: allCompanies, error: allError } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (allError) throw allError;
      
      
      // Get people count for each company
      const { data: peopleCounts, error: peopleError } = await supabase
        .from("people")
        .select("company_id")
        .not("company_id", "is", null);

      if (peopleError) throw peopleError;

      // Get jobs count for each company
      const { data: jobsCounts, error: jobsError } = await supabase
        .from("jobs")
        .select("company_id")
        .not("company_id", "is", null);

      if (jobsError) throw jobsError;

      // Count people per company
      const companyPeopleCount: Record<string, number> = {};
      peopleCounts?.forEach(person => {
        if (person.company_id) {
          companyPeopleCount[person.company_id] = (companyPeopleCount[person.company_id] || 0) + 1;
        }
      });

      // Count jobs per company
      const companyJobsCount: Record<string, number> = {};
      jobsCounts?.forEach(job => {
        if (job.company_id) {
          companyJobsCount[job.company_id] = (companyJobsCount[job.company_id] || 0) + 1;
        }
      });

      // Add counts to companies
      const companiesWithCounts = (allCompanies || []).map(company => ({
        ...company,
        people_count: companyPeopleCount[company.id] || 0,
        jobs_count: companyJobsCount[company.id] || 0
      }));


      setCompanies(companiesWithCounts);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Company",
      width: "200px",
      render: (company: Company) => (
        <div className="min-w-0 max-w-80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {(() => {
                const logoUrl = getCompanyLogoUrlSync(company.name, company.website);
                return logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={company.name}
                    className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                  />
                ) : null;
              })()}
              <div 
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
                style={{ display: getCompanyLogoUrlSync(company.name, company.website) ? 'none' : 'flex' }}
              >
                {company.name ? getStatusDisplayText(company.name.charAt(0)) : '?'}
              </div>
            </div>
            <div className="text-sm font-medium break-words">{company.name || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      width: "200px",
      render: (company: Company) => (
        <div className="min-w-0 max-w-64">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.industry || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "head_office",
      label: "Head Office",
      width: "180px",
      render: (company: Company) => (
        <div className="min-w-0 max-w-56">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.head_office || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "lead_score",
      label: "AI Score",
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {company.lead_score || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      width: "100px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => {
        return <StatusBadge status={company.priority || "Medium"} size="sm" />;
      },
    },
    {
      key: "leads",
      label: "Leads",
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {(company as any).people_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "jobs",
      label: "Jobs",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {(company as any).jobs_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "lead_score",
      label: getLabel('table', 'ai_score'),
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {company.lead_score || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "priority",
      label: getLabel('table', 'priority'),
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => {
        return <StatusBadge status={company.priority || "Medium"} size="sm" />;
      },
    },
    {
      key: "leads",
      label: "Leads",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="text-base font-semibold bg-muted px-3 py-2 rounded-md">
          {company.people_count || 0}
        </div>
      ),
    },
    {
      key: "jobs",
      label: "Jobs",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="text-base font-semibold bg-muted px-3 py-2 rounded-md">
          {company.jobs_count || 0}
        </div>
      ),
    },
    {
      key: "status",
      label: getLabel('table', 'status'),
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => {
        // Determine status based on confidence_level or automation status
        if (company.automation_active) {
          return <StatusBadge status="Active" size="sm" />;
        } else if (company.confidence_level === 'high') {
          return <StatusBadge status="Qualified" size="sm" />;
        } else if (company.confidence_level === 'medium') {
          return <StatusBadge status="Prospect" size="sm" />;
        } else if (company.confidence_level === 'low') {
          return <StatusBadge status="New Lead" size="sm" />;
        } else {
          return <StatusBadge status="New Lead" size="sm" />;
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCompany(company.id, company.name);
          }}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleRowClick = (company: Company) => {
    openCompanyPopup(company.id);
  };

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete the company "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Company "${companyName}" has been deleted.`,
      });

      // Refresh the companies list
      fetchCompanies();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete company: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Companies</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your target companies and prospects
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <CompaniesStatsCards 
          totalCompanies={companiesStats.totalCompanies}
          activeCompanies={companiesStats.activeCompanies}
          qualifiedCompanies={companiesStats.qualifiedCompanies}
          prospectCompanies={companiesStats.prospectCompanies}
          newCompanies={companiesStats.newCompanies}
          companiesWithLeads={companiesStats.companiesWithLeads}
          companiesWithJobs={companiesStats.companiesWithJobs}
        />

        {/* Search, Filter and Sort Controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm w-64 bg-white"
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
          </div>
          
          {/* Sort Controls - Far Right */}
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
              className="px-2 py-1 text-sm border rounded hover:bg-muted transition-colors"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        <DataTable
          data={filteredAndSortedCompanies}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          pagination={{
            enabled: true,
            pageSize: 20,
            pageSizeOptions: [10, 20, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />
      </div>

    </>
  );
};

export default Companies;