import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  User, 
  Building2, 
  Briefcase, 
  Star, 
  MapPin, 
  Mail, 
  Calendar,
  Filter,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  type: "lead" | "company" | "job";
  title: string;
  subtitle?: string;
  description?: string;
  score?: number | string;
  location?: string;
  email?: string;
  url?: string;
  icon: React.ComponentType<any>;
  data: any;
}

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
}

export const GlobalSearch = ({ 
  placeholder = "Search leads, companies, jobs...", 
  className = "",
  onResultClick 
}: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["leads", "companies", "jobs"]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  const searchFilters = [
    { id: "leads", label: "Leads", icon: User },
    { id: "companies", label: "Companies", icon: Building2 },
    { id: "jobs", label: "Jobs", icon: Briefcase }
  ];

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search leads/people
      if (selectedFilters.includes("leads")) {
        const { data: leads } = await supabase
          .from("People")
          .select(`
            id,
            Name,
            Company,
            "Company Role",
            "Email Address",
            "Employee Location",
            "Lead Score",
            "LinkedIn URL",
            Stage,
            stage_enum,
            Owner
          `)
          .or(`Name.ilike.%${searchQuery}%,Company.ilike.%${searchQuery}%,"Company Role".ilike.%${searchQuery}%,"Email Address".ilike.%${searchQuery}%,"Employee Location".ilike.%${searchQuery}%`)
          .limit(10);

        leads?.forEach(lead => {
          searchResults.push({
            id: lead.id,
            type: "lead",
            title: lead.Name || "Unknown Lead",
            subtitle: lead.Company || undefined,
            description: lead["Company Role"] || undefined,
            score: lead["Lead Score"],
            location: lead["Employee Location"] || undefined,
            email: lead["Email Address"] || undefined,
            url: lead["LinkedIn URL"] || undefined,
            icon: User,
            data: lead
          });
        });
      }

      // Search companies
      if (selectedFilters.includes("companies")) {
        const { data: companies } = await supabase
          .from("Companies")
          .select(`
            id,
            "Company Name",
            Industry,
            "Company Size",
            "Head Office",
            "Lead Score",
            Website,
            "LinkedIn URL",
            "Profile Image URL",
            STATUS,
            Priority
          `)
          .or(`"Company Name".ilike.%${searchQuery}%,Industry.ilike.%${searchQuery}%,"Head Office".ilike.%${searchQuery}%`)
          .limit(10);

        companies?.forEach(company => {
          searchResults.push({
            id: company.id,
            type: "company",
            title: company["Company Name"] || "Unknown Company",
            subtitle: company.Industry || undefined,
            description: company["Company Size"] || undefined,
            score: company["Lead Score"],
            location: company["Head Office"] || undefined,
            url: company.Website || company["LinkedIn URL"] || undefined,
            icon: Building2,
            data: company
          });
        });
      }

      // Search jobs
      if (selectedFilters.includes("jobs")) {
        const { data: jobs } = await supabase
          .from("Jobs")
          .select(`
            id,
            "Job Title",
            Company,
            "Job Location",
            Industry,
            Function,
            "Employment Type",
            "Lead Score",
            "Posted Date",
            "Job URL",
            Salary
          `)
          .or(`"Job Title".ilike.%${searchQuery}%,Company.ilike.%${searchQuery}%,"Job Location".ilike.%${searchQuery}%,Industry.ilike.%${searchQuery}%,Function.ilike.%${searchQuery}%`)
          .limit(10);

        jobs?.forEach(job => {
          searchResults.push({
            id: job.id,
            type: "job",
            title: job["Job Title"] || "Unknown Job",
            subtitle: job.Company || undefined,
            description: job["Employment Type"] || job.Function || undefined,
            score: job["Lead Score"],
            location: job["Job Location"] || undefined,
            url: job["Job URL"] || undefined,
            icon: Briefcase,
            data: job
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, selectedFilters]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    
    if (onResultClick) {
      onResultClick(result);
      return;
    }

    // Default navigation behavior
    switch (result.type) {
      case "lead":
        navigate(`/leads`);
        break;
      case "company":
        navigate(`/companies`);
        break;
      case "job":
        navigate(`/jobs`);
        break;
    }
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={`relative ${className}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-20"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* Filter Toggle */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Search in:</div>
                  {searchFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isSelected = selectedFilters.includes(filter.id);
                    return (
                      <Button
                        key={filter.id}
                        variant={isSelected ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => toggleFilter(filter.id)}
                        className="w-full justify-start h-8"
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {filter.label}
                        {isSelected && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            ✓
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command>
          {query.length >= 2 && (
            <CommandList className="max-h-96">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <div className="text-sm text-muted-foreground">Searching...</div>
                </div>
              ) : results.length === 0 ? (
                <CommandEmpty className="py-6">
                  <div className="text-center">
                    <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-sm font-medium">No results found</div>
                    <div className="text-xs text-muted-foreground">Try different keywords or adjust filters</div>
                  </div>
                </CommandEmpty>
              ) : (
                <>
                  {Object.entries(groupedResults).map(([type, typeResults]) => {
                    const filterConfig = searchFilters.find(f => f.id === type + "s" || f.id === type);
                    if (!filterConfig) return null;
                    
                    const Icon = filterConfig.icon;
                    return (
                      <CommandGroup 
                        key={type} 
                        heading={
                          <div className="flex items-center gap-2">
                            <Icon className="h-3 w-3" />
                            <span className="capitalize">{filterConfig.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {typeResults.length}
                            </Badge>
                          </div>
                        }
                      >
                        {typeResults.map((result) => {
                          const ResultIcon = result.icon;
                          return (
                            <CommandItem
                              key={`${result.type}-${result.id}`}
                              onSelect={() => handleResultClick(result)}
                              className="cursor-pointer p-3 space-y-1"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                                  <ResultIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm truncate">{result.title}</span>
                                    {result.score && (
                                      <Badge variant="outline" className="text-xs">
                                        Score: {result.score}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {result.subtitle && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Building2 className="h-3 w-3" />
                                      <span className="truncate">{result.subtitle}</span>
                                    </div>
                                  )}
                                  
                                  {result.description && (
                                    <div className="text-xs text-muted-foreground truncate">
                                      {result.description}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    {result.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate max-w-24">{result.location}</span>
                                      </div>
                                    )}
                                    {result.email && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate max-w-32">{result.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  })}
                </>
              )}
            </CommandList>
          )}
          
          {query.length < 2 && query.length > 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};