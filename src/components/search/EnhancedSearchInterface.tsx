
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Clock, X, Sparkles, TrendingUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface SmartInsight {
  type: 'trending' | 'pattern' | 'alert';
  title: string;
  description: string;
  confidence: number;
  action?: string;
}

const EnhancedSearchInterface = () => {
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

  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{query: string, timestamp: Date, results: number}>>([]);

  // Load saved data
  useEffect(() => {
    const savedSearches = localStorage.getItem('recent-searches');
    const savedHistory = localStorage.getItem('search-history');
    
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
    
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSearchHistory(history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }

    // Generate smart insights
    generateSmartInsights();
  }, []);

  const generateSmartInsights = () => {
    const insights: SmartInsight[] = [
      {
        type: 'trending',
        title: 'Rising Threat: UPI Fraud',
        description: 'UPI-related fraud reports have increased by 45% this month in your region.',
        confidence: 92,
        action: 'View UPI Safety Guide'
      },
      {
        type: 'pattern',
        title: 'Weekend Scam Pattern',
        description: 'Most phishing attempts in your area occur on weekends between 2-6 PM.',
        confidence: 78,
        action: 'Set Weekend Alerts'
      },
      {
        type: 'alert',
        title: 'New Scam Method Detected',
        description: 'AI has identified a new fake job portal scam targeting IT professionals.',
        confidence: 85,
        action: 'Learn More'
      }
    ];
    setSmartInsights(insights);
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
      // Simulate AI-powered search
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Update recent searches
      const newRecentSearches = [
        searchState.query,
        ...recentSearches.filter(s => s !== searchState.query)
      ].slice(0, 10);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));

      // Update search history
      const mockResultCount = Math.floor(Math.random() * 500) + 10;
      const newHistoryEntry = {
        query: searchState.query,
        timestamp: new Date(),
        results: mockResultCount
      };
      
      const newHistory = [newHistoryEntry, ...searchHistory].slice(0, 50);
      setSearchHistory(newHistory);
      localStorage.setItem('search-history', JSON.stringify(newHistory));

      toast({
        title: "AI Search Complete",
        description: `Found ${mockResultCount} relevant results with 94% confidence`,
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

  const handleVoiceResult = (transcript: string) => {
    handleQueryChange(transcript);
    toast({
      title: "Voice Input Processed",
      description: `AI understood: "${transcript}"`,
    });
  };

  const hasActiveFilters = 
    searchState.filters.fraudTypes.length > 0 ||
    searchState.filters.location !== '' ||
    searchState.filters.status.length > 0 ||
    searchState.filters.dateRange.from ||
    searchState.filters.dateRange.to ||
    (searchState.filters.severity[0] !== 1 || searchState.filters.severity[1] !== 10);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'pattern': return <Sparkles className="h-4 w-4" />;
      case 'alert': return <Clock className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pattern': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'alert': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Search Header */}
      <Card className="border-2 border-gradient-to-r from-india-saffron to-saffron-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-india-saffron" />
            AI-Enhanced Search
            <Badge variant="secondary" className="ml-2">BETA</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask AI: 'Show me recent phishing attempts in Mumbai' or 'Find investment scams targeting seniors'"
                value={searchState.query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-12 text-lg py-3"
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
              className="bg-india-saffron hover:bg-saffron-600 px-8"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin mr-2" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  AI Search
                </>
              )}
            </Button>
          </div>

          {/* Smart Suggestions */}
          {showSuggestions && (
            <SearchSuggestions
              query={searchState.query}
              onSelect={handleQueryChange}
              onClose={() => setShowSuggestions(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* Smart Insights & History Tabs */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Smart Insights
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Searches
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Search History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {smartInsights.map((insight, index) => (
              <Card key={index} className={`border ${getInsightColor(insight.type)}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        {insight.action && (
                          <Button variant="ghost" size="sm" className="text-xs h-6">
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          {recentSearches.length > 0 ? (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleQueryChange}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No recent searches found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {searchHistory.length > 0 ? (
                <div className="space-y-3">
                  {searchHistory.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium cursor-pointer hover:text-india-saffron" 
                           onClick={() => handleQueryChange(item.query)}>
                          {item.query}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {item.results} results
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No search history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
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
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilters
            filters={searchState.filters}
            onFiltersChange={handleFilterChange}
            sortBy={searchState.sortBy}
            sortOrder={searchState.sortOrder}
            onSortChange={handleSortChange}
          />
        </CardContent>
      </Card>

      {/* Search Results */}
      <SearchResults
        searchState={searchState}
        onQueryChange={handleQueryChange}
      />
    </div>
  );
};

export default EnhancedSearchInterface;
