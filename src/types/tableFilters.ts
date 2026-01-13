/**
 * Table Filtering and Sorting Types
 * Defines the structure for table view preferences, filter options, and sorting
 */

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SortOption {
  value: string;
  label: string;
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  type?: 'single' | 'multi';
  placeholder?: string;
}

export interface TableViewPreferences {
  sortBy?: string;
  filters: Record<string, string | string[]>;
}

export interface TableFilterBarProps {
  entityLabel: string;
  entityCount?: number;
  viewOptions?: FilterOption[];
  sortOptions: SortOption[];
  filterConfigs: FilterConfig[];
  preferences: TableViewPreferences;
  onPreferencesChange: (preferences: Partial<TableViewPreferences>) => void;
  onViewChange?: (view: string) => void;
  className?: string;
}
