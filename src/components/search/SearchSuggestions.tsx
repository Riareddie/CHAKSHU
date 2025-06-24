
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Clock, X } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

const mockSuggestions = [
  { text: 'phishing email', category: 'Email Fraud', count: 245 },
  { text: 'UPI fraud', category: 'Financial', count: 189 },
  { text: 'fake job offers', category: 'Employment', count: 156 },
  { text: 'SMS scam', category: 'SMS Fraud', count: 134 },
  { text: 'investment scam', category: 'Financial', count: 123 },
  { text: 'dating scam', category: 'Online Fraud', count: 98 },
  { text: 'tech support scam', category: 'Phone Fraud', count: 87 },
  { text: 'lottery scam', category: 'Prize Fraud', count: 76 }
];

const trendingSearches = [
  'OTP theft Mumbai',
  'fake delivery SMS',
  'credit card cloning',
  'WhatsApp scam',
  'fake bank calls'
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSelect, onClose }) => {
  const filteredSuggestions = mockSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
    suggestion.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-medium text-gray-900">Search Suggestions</h4>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {filteredSuggestions.length > 0 && (
          <div className="p-3 border-b">
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Related Searches
            </h5>
            <div className="space-y-1">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-between text-left h-auto p-2"
                  onClick={() => {
                    onSelect(suggestion.text);
                    onClose();
                  }}
                >
                  <div>
                    <div className="font-medium">{suggestion.text}</div>
                    <div className="text-xs text-gray-500">{suggestion.category}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.count} reports
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending Searches
          </h5>
          <div className="space-y-1">
            {trendingSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => {
                  onSelect(search);
                  onClose();
                }}
              >
                <Clock className="h-3 w-3 mr-2 text-gray-400" />
                {search}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;
