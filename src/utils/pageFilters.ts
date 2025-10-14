/**
 * Shared filtering and sorting utilities for page components
 * Reduces code duplication across People, Companies, and Jobs pages
 */

export interface FilterOptions {
  searchTerm: string;
  statusFilter: string;
  showFavoritesOnly: boolean;
  selectedUser: string;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface FilterableItem {
  id: string;
  name?: string;
  email_address?: string;
  company_name?: string;
  stage?: string;
  owner_id?: string;
  favourite?: boolean | string;
  is_favourite?: boolean | string;
  created_at?: string;
}

/**
 * Normalize various truthy values that might be stored as string/boolean
 */
export const toBoolean = (val: unknown): boolean => {
  return val === true || val === 'true' || val === 't' || val === 1 || val === '1' || val === 'yes';
};

/**
 * Generic filter function for all page types
 */
export const filterItems = <T extends FilterableItem>(
  items: T[],
  filters: FilterOptions
): T[] => {
  return items.filter(item => {
    const { searchTerm, statusFilter, showFavoritesOnly, selectedUser } = filters;

    // Search filter
    const matchesSearch = !searchTerm || (() => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email_address?.toLowerCase().includes(searchLower) ||
        item.company_name?.toLowerCase().includes(searchLower)
      );
    })();

    // Status filter
    const matchesStatus = statusFilter === "all" || item.stage === statusFilter;

    // Favorites filter
    const isFavorite = toBoolean(item.favourite) || toBoolean(item.is_favourite);
    const matchesFavorites = !showFavoritesOnly || isFavorite;
    
    // User filter
    const matchesUser = selectedUser === 'all' || item.owner_id === selectedUser;

    return matchesSearch && matchesStatus && matchesFavorites && matchesUser;
  });
};

/**
 * Generic sort function for all page types
 */
export const sortItems = <T extends FilterableItem>(
  items: T[],
  sortOptions: SortOptions
): T[] => {
  const { sortBy, sortOrder } = sortOptions;

  return items.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "created_at":
        aValue = new Date(a.created_at || 0).getTime();
        bValue = new Date(b.created_at || 0).getTime();
        break;
      case "first_name":
      case "last_name":
      case "name":
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
        break;
      case "email":
        aValue = a.email_address?.toLowerCase() || "";
        bValue = b.email_address?.toLowerCase() || "";
        break;
      case "company_name":
        aValue = a.company_name?.toLowerCase() || "";
        bValue = b.company_name?.toLowerCase() || "";
        break;
      case "stage":
        aValue = a.stage?.toLowerCase() || "";
        bValue = b.stage?.toLowerCase() || "";
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
};

/**
 * Combined filter and sort function
 */
export const filterAndSortItems = <T extends FilterableItem>(
  items: T[],
  filters: FilterOptions,
  sortOptions: SortOptions
): T[] => {
  const filtered = filterItems(items, filters);
  return sortItems(filtered, sortOptions);
};

/**
 * Common sort options for all pages
 */
export const getCommonSortOptions = () => [
  { label: "Created Date", value: "created_at" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Company", value: "company_name" },
  { label: "Status", value: "stage" },
];

/**
 * Common status options for all pages
 */
export const getCommonStatusOptions = () => [
  { label: "All Stages", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Unqualified", value: "unqualified" },
  { label: "Meeting Scheduled", value: "meeting_scheduled" },
  { label: "Proposal Sent", value: "proposal_sent" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Closed Won", value: "closed_won" },
  { label: "Closed Lost", value: "closed_lost" },
];
