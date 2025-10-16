import {
  GlobalSearchService,
  SearchResult,
} from '@/services/globalSearchService';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface SearchContextType {
  // Search state
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchError: string | null;

  // Search actions
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;

  // UI state
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Suggestions
  suggestions: string[];
  loadSuggestions: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await GlobalSearchService.search(query, {
        limit: 50,
        includeInactive: false,
        sortBy: 'relevance',
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to perform search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Load suggestions
  const loadSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestions = await GlobalSearchService.getSuggestions(query, 10);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Suggestions error:', error);
      setSuggestions([]);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setSuggestions([]);
    setIsSearchOpen(false);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
        loadSuggestions(searchQuery);
      } else {
        setSearchResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch, loadSuggestions]);

  const value: SearchContextType = useMemo(
    () => ({
      searchQuery,
      searchResults,
      isSearching,
      searchError,
      setSearchQuery,
      performSearch,
      clearSearch,
      isSearchOpen,
      setIsSearchOpen,
      suggestions,
      loadSuggestions,
    }),
    [
      searchQuery,
      searchResults,
      isSearching,
      searchError,
      performSearch,
      clearSearch,
      isSearchOpen,
      suggestions,
      loadSuggestions,
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
