import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type FraudType = Database['public']['Enums']['fraud_type'];
type ReportStatus = Database['public']['Enums']['report_status'];

interface ReportFilters {
  status: ReportStatus[];
  fraudType: FraudType[];
  dateRange: { from: Date | null; to: Date | null };
  amountRange: { min: number | null; max: number | null };
}

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
}

const ReportFilters = ({ filters, onFiltersChange }: ReportFiltersProps) => {
  const statusOptions: { value: ReportStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  const fraudTypeOptions: { value: FraudType; label: string }[] = [
    { value: 'phishing', label: 'Phishing' },
    { value: 'sms_fraud', label: 'SMS Fraud' },
    { value: 'call_fraud', label: 'Call Fraud' },
    { value: 'email_spam', label: 'Email Spam' },
    { value: 'investment_scam', label: 'Investment Scam' },
    { value: 'lottery_scam', label: 'Lottery Scam' },
    { value: 'tech_support_scam', label: 'Tech Support Scam' },
    { value: 'romance_scam', label: 'Romance Scam' },
    { value: 'other', label: 'Other' }
  ];

  const handleStatusChange = (status: ReportStatus, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      status: newStatus
    });
  };

  const handleFraudTypeChange = (type: FraudType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.fraudType, type]
      : filters.fraudType.filter(t => t !== type);
    
    onFiltersChange({
      ...filters,
      fraudType: newTypes
    });
  };

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date || null
      }
    });
  };

  const handleAmountRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    onFiltersChange({
      ...filters,
      amountRange: {
        ...filters.amountRange,
        [field]: numValue
      }
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: [],
      fraudType: [],
      dateRange: { from: null, to: null },
      amountRange: { min: null, max: null }
    });
  };

  const hasActiveFilters = 
    filters.status.length > 0 ||
    filters.fraudType.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.amountRange.min !== null ||
    filters.amountRange.max !== null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Status Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Status</Label>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${option.value}`}
                checked={filters.status.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleStatusChange(option.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`status-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Fraud Type Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Fraud Type</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {fraudTypeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${option.value}`}
                checked={filters.fraudType.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleFraudTypeChange(option.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`type-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Date Range</Label>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-500">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    format(filters.dateRange.from, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from || undefined}
                  onSelect={(date) => handleDateRangeChange('from', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-xs text-gray-500">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? (
                    format(filters.dateRange.to, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to || undefined}
                  onSelect={(date) => handleDateRangeChange('to', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Amount Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Amount Range (₹)</Label>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-500">Minimum</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.amountRange.min || ''}
              onChange={(e) => handleAmountRangeChange('min', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Maximum</Label>
            <Input
              type="number"
              placeholder="100000"
              value={filters.amountRange.max || ''}
              onChange={(e) => handleAmountRangeChange('max', e.target.value)}
            />
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="w-full flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
