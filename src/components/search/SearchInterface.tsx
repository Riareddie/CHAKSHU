
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import RecentSearches from './RecentSearches';
import SearchSuggestions from './SearchSuggestions';
import VoiceSearch from './VoiceSearch';
import { useToast } from '@/hooks/use-toast';

interface SearchState {
  query: string;
  filters: {
    dateRange: { from: Date | null; to: Date | null };
    fraudTypes: string[];
    location: string;
    severity: number[];
    status: string[];
  };
  sortBy: 'date' | 'relevance' | 'severity';
  sortOrder: 'asc' | 'desc';
}

const SearchInterface = () => {
  const { toast } = useToast();
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {
      dateRange: { from: null, to: null },
      fraudTypes: [],
      location: '',
      severity: [1, 10],
      status: []
    },
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  const updateSearchState = (updates: Partial<SearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
  };

  const handleQueryChange = (query: string) => {
    setSearchState(prev => ({ ...prev, query }));
    setShowSuggestions(query.length > 0);
  };

  const handleSearch = async () => {
    if (!searchState.query.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Add to recent searches
      const newRecentSearches = [
        searchState.query,
        ...recentSearches.filter(s => s !== searchState.query)
      ].slice(0, 10);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));

      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800));

      toast({
        title: "Search Complete",
        description: `Found results for "${searchState.query}"`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (filters: Partial<SearchState['filters']>) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters }
    }));
  };

  const handleSortChange = (sortBy: 'date' | 'relevance' | 'severity', sortOrder: 'asc' | 'desc') => {
    setSearchState(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const clearAllFilters = () => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        dateRange: { from: null, to: null },
        fraudTypes: [],
        location: '',
        severity: [1, 10],
        status: []
      }
    }));
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset.",
    });
  };

  const handleExportResults = () => {
    toast({
      title: "Export Started",
      description: "Your search results are being prepared for download.",
    });
    
    // Simulate export
    setTimeout(() => {
      const data = {
        query: searchState.query,
        filters: searchState.filters,
        timestamp: new Date().toISOString(),
        results: "Search results data would be here..."
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `search-results-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Search results have been downloaded.",
      });
    }, 2000);
  };

  const handleVoiceResult = (transcript: string) => {
    handleQueryChange(transcript);
    toast({
      title: "Voice Input Received",
      description: `Searching for: "${transcript}"`,
    });
  };

  const hasActiveFilters = 
    searchState.filters.fraudTypes.length > 0 ||
    searchState.filters.location !== '' ||
    searchState.filters.status.length > 0 ||
    searchState.filters.dateRange.from ||
    searchState.filters.dateRange.to ||
    (searchState.filters.severity[0] !== 1 || searchState.filters.severity[1] !== 10);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Search fraud reports, discussions, and educational content..."
                value={searchState.query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-12"
              />
              {searchState.query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => handleQueryChange('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <VoiceSearch onResult={handleVoiceResult} />
            
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchState.query.trim()}
              className="bg-india-saffron hover:bg-saffron-600"
            >
              {isSearching ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <SearchSuggestions
              query={searchState.query}
              onSelect={handleQueryChange}
              onClose={() => setShowSuggestions(false)}
            />
          )}

          {/* Recent Searches */}
          {!showSuggestions && searchState.query === '' && recentSearches.length > 0 && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleQueryChange}
            />
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchState.filters.fraudTypes.map(type => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange({
                      fraudTypes: searchState.filters.fraudTypes.filter(t => t !== type)
                    })}
                  />
                </Badge>
              ))}
              {searchState.filters.location && (
                <Badge variant="secondary" className="gap-1">
                  {searchState.filters.location}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange({ location: '' })}
                  />
                </Badge>
              )}
              {searchState.filters.status.map(status => (
                <Badge key={status} variant="secondary" className="gap-1">
                  {status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange({
                      status: searchState.filters.status.filter(s => s !== status)
                    })}
                  />
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="ml-2"
              >
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters Toggle */}
      <div className="flex justify-between items-center">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1">
                  {searchState.filters.fraudTypes.length + 
                   searchState.filters.status.length + 
                   (searchState.filters.location ? 1 : 0) +
                   (searchState.filters.dateRange.from || searchState.filters.dateRange.to ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <SearchFilters
                  filters={searchState.filters}
                  onFiltersChange={handleFilterChange}
                  sortBy={searchState.sortBy}
                  sortOrder={searchState.sortOrder}
                  onSortChange={handleSortChange}
                />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant="outline"
          onClick={handleExportResults}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Search Results */}
      <SearchResults
        searchState={searchState}
        onQueryChange={handleQueryChange}
      />
    </div>
  );
};

export default SearchInterface;
