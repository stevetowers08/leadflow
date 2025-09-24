import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  Star, 
  MapPin, 
  Building2,
  User,
  Search,
  ChevronDown
} from "lucide-react";
import { format, parseISO, subDays, subWeeks, subMonths } from "date-fns";

interface FilterOption {
  id: string;
  label: string;
  type: "select" | "text" | "date" | "number" | "multi-select";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export const AdvancedFilters = ({
  filters,
  values,
  onFiltersChange,
  onSearch,
  searchPlaceholder = "Search...",
  className = ""
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "custom", label: "Custom Range" }
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...values, [filterId]: value };
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const clearFilter = (filterId: string) => {
    const newFilters = { ...values };
    delete newFilters[filterId];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setSearchQuery("");
    onSearch?.("");
    setSelectedDateRange("all");
  };

  const getActiveFilterCount = () => {
    return Object.keys(values).filter(key => values[key] !== undefined && values[key] !== "" && values[key] !== null).length;
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = values[filter.id];

    switch (filter.type) {
      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => handleFilterChange(filter.id, val || undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multi-select":
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">
                  {selectedValues.length === 0 
                    ? filter.placeholder || `Select ${filter.label}`
                    : `${selectedValues.length} selected`
                  }
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filter.options?.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newValues = isSelected 
                          ? selectedValues.filter(v => v !== option.value)
                          : [...selectedValues, option.value];
                        handleFilterChange(filter.id, newValues.length > 0 ? newValues : undefined);
                      }}
                    >
                      {option.label}
                      {isSelected && <span className="ml-auto">✓</span>}
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );

      case "text":
        return (
          <Input
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value || undefined)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || `Enter ${filter.label}`}
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value ? Number(e.target.value) : undefined)}
          />
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">
                  {value ? format(parseISO(value), "MMM d, yyyy") : filter.placeholder || "Select date"}
                </span>
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? parseISO(value) : undefined}
                onSelect={(date) => handleFilterChange(filter.id, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar */}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex items-center gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {getActiveFilterCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <Separator />

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Dynamic Filters */}
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{filter.label}</label>
                    {values[filter.id] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearFilter(filter.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick Date Filters */}
        <div className="flex items-center gap-1">
          <Button
            variant={selectedDateRange === "7d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedDateRange("7d")}
          >
            7d
          </Button>
          <Button
            variant={selectedDateRange === "30d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedDateRange("30d")}
          >
            30d
          </Button>
          <Button
            variant={selectedDateRange === "90d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedDateRange("90d")}
          >
            90d
          </Button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(values).map(([key, value]) => {
            if (!value || value === "") return null;
            
            const filter = filters.find(f => f.id === key);
            if (!filter) return null;

            const displayValue = Array.isArray(value) 
              ? `${value.length} selected`
              : typeof value === "string" && value.length > 20 
                ? `${value.substring(0, 20)}...` 
                : String(value);

            return (
              <Badge key={key} variant="secondary" className="text-xs">
                {filter.label}: {displayValue}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(key)}
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};