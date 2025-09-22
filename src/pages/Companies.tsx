import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { SimplifiedCompanyDetailModal } from "@/components/SimplifiedCompanyDetailModal";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";

interface Company {
  id: string;
  "Company Name": string;
  "Industry": string | null;
  "Website": string | null;
  "Company Size": string | null;
  "Head Office": string | null;
  "Lead Score": number | null;
  "Score Reason": string | null;
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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Debounced search for better performance
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300, 0);

  // Memoized filtering for optimal performance
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      if (!debouncedSearchTerm) return true;
      return company["Company Name"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
             company["Industry"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
             company["Head Office"]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });
  }, [companies, debouncedSearchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    {
      key: "Company Name",
      label: "Company",
      render: (company: Company) => (
        <div className="flex items-center gap-2">
          {company["Profile Image URL"] ? (
            <img src={company["Profile Image URL"]} alt="Company logo" className="w-8 h-8 rounded object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-sm font-medium">
              {company["Company Name"]?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <span className="text-sm font-medium">{company["Company Name"] || "-"}</span>
        </div>
      ),
    },
    {
      key: "Industry",
      label: "Industry",
      render: (company: Company) => (
        <span className="text-xs text-muted-foreground">{company["Industry"] || "-"}</span>
      ),
    },
    {
      key: "Company Size",
      label: "Size",
      render: (company: Company) => (
        <span className="text-xs text-muted-foreground">{company["Company Size"] || "-"}</span>
      ),
    },
    {
      key: "Head Office",
      label: "Location",
      render: (company: Company) => (
        <span className="text-xs text-muted-foreground">{company["Head Office"] || "-"}</span>
      ),
    },
    {
      key: "AI Score",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="text-center">
          <AIScoreBadge
            leadData={{
              name: "Company",
              company: company["Company Name"] || "",
              role: "Company",
              location: company["Head Office"] || "",
              industry: company["Industry"],
              company_size: company["Company Size"] || "Unknown"
            }}
            initialScore={company["Lead Score"] ? parseInt(company["Lead Score"].toString()) : undefined}
            showDetails={false}
          />
        </div>
      ),
    },
    {
      key: "Priority",
      label: "Priority",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <StatusBadge status={company["Priority"]?.toLowerCase() || "medium"} />
      ),
    },
    {
      key: "STATUS",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => {
        return (
          <StatusBadge status={company["STATUS"] || "Unknown"} />
        );
      },
    },
  ];

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
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

        {/* Simple Search */}
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
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3"
            onClick={fetchCompanies}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>

        <DataTable
          data={filteredCompanies}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          showSearch={false}
          enableBulkActions={false}
          enableExport={true}
          exportFilename="companies-export.csv"
          itemName="company"
          itemNamePlural="companies"
          pagination={{
            enabled: true,
            pageSize: 20,
            pageSizeOptions: [10, 20, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <SimplifiedCompanyDetailModal
          company={selectedCompany}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </>
  );
};

export default Companies;