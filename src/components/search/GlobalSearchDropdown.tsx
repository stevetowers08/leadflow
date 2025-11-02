'use client';

import { SearchResults } from '@/components/search/SearchResults';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
import { PersonDetailsSlideOut } from '@/components/slide-out/PersonDetailsSlideOut';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/lib/utils';
import { SearchResult } from '@/services/globalSearchService';
import { Loader2, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface GlobalSearchDropdownProps {
  className?: string;
}

// Internal component that requires SearchProvider
const GlobalSearchDropdownContent: React.FC<GlobalSearchDropdownProps> = ({
  className,
}) => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    setSearchQuery,
    clearSearch,
    isSearchOpen,
    setIsSearchOpen,
    suggestions,
  } = useSearch();

  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<
    'job' | 'company' | 'person' | null
  >(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setIsSearchOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchQuery) {
      setIsSearchOpen(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay closing to allow for clicks on results
    setTimeout(() => {
      if (!isFocused) {
        setIsSearchOpen(false);
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsSearchOpen(true);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    // Open the appropriate slide-out based on result type
    setSelectedEntityId(result.id);
    setSelectedEntityType(result.type as 'job' | 'company' | 'person');
    setIsSlideOutOpen(true);

    // Close search dropdown
    setIsSearchOpen(false);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleCloseSlideOut = () => {
    setIsSlideOutOpen(false);
    setSelectedEntityId(null);
    setSelectedEntityType(null);
  };

  const handleClearSearch = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
      setShowSuggestions(false);
    }
  };

  const shouldShowDropdown =
    isSearchOpen && (searchQuery.length > 0 || isSearching);
  const shouldShowSuggestions =
    showSuggestions && suggestions.length > 0 && !isSearching;

  return (
    <div ref={dropdownRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className='relative w-full'>
        <div className='relative w-full'>
          <input
            ref={inputRef}
            type='text'
            placeholder='Search people, companies, jobs...'
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className='w-full h-8 rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-gray-400 focus:border-primary search-input-light'
          />

          {/* Search Icon */}
          <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
            {isSearching ? (
              <Loader2 className='w-4 h-4 text-gray-400 animate-spin' />
            ) : (
              <Search className='w-4 h-4 text-gray-400' />
            )}
          </div>

          {/* Clear Button */}
          {searchQuery && (
            <button
              type='button'
              onClick={handleClearSearch}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {(shouldShowDropdown || shouldShowSuggestions) && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden'>
          {/* Suggestions */}
          {shouldShowSuggestions && (
            <div className='p-2 border-b border-gray-100'>
              <div className='text-xs font-medium text-gray-500 mb-2 px-2'>
                Suggestions
              </div>
              <div className='space-y-1'>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className='w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {shouldShowDropdown && (
            <div className='p-2'>
              {searchError ? (
                <div className='text-center py-4 text-red-600 text-sm'>
                  {searchError}
                </div>
              ) : (
                <SearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  onResultClick={handleResultClick}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Slide-Outs for Search Results */}
      {selectedEntityType === 'job' && (
        <JobDetailsSlideOut
          jobId={selectedEntityId}
          isOpen={isSlideOutOpen}
          onClose={handleCloseSlideOut}
        />
      )}
      {selectedEntityType === 'company' && (
        <CompanyDetailsSlideOut
          companyId={selectedEntityId}
          isOpen={isSlideOutOpen}
          onClose={handleCloseSlideOut}
        />
      )}
      {selectedEntityType === 'person' && (
        <PersonDetailsSlideOut
          personId={selectedEntityId}
          isOpen={isSlideOutOpen}
          onClose={handleCloseSlideOut}
        />
      )}
    </div>
  );
};

// Public component with safe context access and SSR handling
export const GlobalSearchDropdown: React.FC<GlobalSearchDropdownProps> = ({
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR or before mount, return a placeholder to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className={cn('relative w-full', className)}>
        <div className='w-full h-8 rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 opacity-50 pointer-events-none'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <span className='absolute left-10 top-1/2 -translate-y-1/2 text-gray-400'>
            Search people, companies, jobs...
          </span>
        </div>
      </div>
    );
  }

  // Once mounted on client, render the actual component
  // Error boundary will catch if SearchProvider is missing
  return <GlobalSearchDropdownContent className={className} />;
};
