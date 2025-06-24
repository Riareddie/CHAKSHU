
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CheckCircle, XCircle, Eye, Trash } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

const BulkActions = ({ selectedCount, onBulkAction }: BulkActionsProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selected
          </Badge>
          <span className="text-sm text-gray-600">
            Perform bulk actions on selected reports
          </span>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Change Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => onBulkAction('mark-reviewed')}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Mark as Under Review
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onBulkAction('mark-resolved')}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Resolved
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onBulkAction('mark-rejected')}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Mark as Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('export')}
          >
            Export Selected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
