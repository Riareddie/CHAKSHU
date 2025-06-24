
import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect }) => {
  const [open, setOpen] = useState(false);

  if (searches.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3">
          <div className="text-sm font-medium text-gray-600 mb-2">Recent Searches</div>
          <div className="space-y-1">
            {searches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between group p-2 rounded hover:bg-gray-50"
              >
                <Button
                  variant="ghost"
                  className="flex-1 justify-start text-left p-0 h-auto"
                  onClick={() => {
                    onSelect(search);
                    setOpen(false);
                  }}
                >
                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="truncate">{search}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // In a real app, you'd remove this from recent searches
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RecentSearches;
