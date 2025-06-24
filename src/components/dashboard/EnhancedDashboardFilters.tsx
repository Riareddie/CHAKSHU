import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Filter, Calendar as CalendarIcon, X, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterState {
  dateRange: {
    preset: string;
    customStart?: Date;
    customEnd?: Date;
  };
  status: string[];
  fraudTypes: string[];
  severity: string[];
  location?: string;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

interface EnhancedDashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const defaultFilters: FilterState = {
  dateRange: { preset: "last30days" },
  status: [],
  fraudTypes: [],
  severity: [],
  location: "",
  amountRange: {},
};

const fraudTypeOptions = [
  { id: "call", label: "Call Fraud", icon: "📞" },
  { id: "sms", label: "SMS Fraud", icon: "💬" },
  { id: "email", label: "Email Spam", icon: "📧" },
  { id: "whatsapp", label: "WhatsApp Scam", icon: "📱" },
  { id: "upi", label: "UPI Fraud", icon: "💳" },
  { id: "banking", label: "Banking Fraud", icon: "🏦" },
  { id: "investment", label: "Investment Scam", icon: "📈" },
  { id: "lottery", label: "Lottery Scam", icon: "🎲" },
  { id: "romance", label: "Romance Scam", icon: "💕" },
  { id: "job", label: "Job Scam", icon: "💼" },
  { id: "cryptocurrency", label: "Crypto Fraud", icon: "₿" },
  { id: "social_media", label: "Social Media", icon: "📲" },
];

const statusOptions = [
  { id: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  {
    id: "under_review",
    label: "Under Review",
    color: "bg-blue-100 text-blue-800",
  },
  { id: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { id: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  {
    id: "escalated",
    label: "Escalated",
    color: "bg-purple-100 text-purple-800",
  },
];

const severityOptions = [
  { id: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
  { id: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { id: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { id: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

const datePresets = [
  { id: "last7days", label: "Last 7 days" },
  { id: "last30days", label: "Last 30 days" },
  { id: "last90days", label: "Last 90 days" },
  { id: "last6months", label: "Last 6 months" },
  { id: "lastyear", label: "Last year" },
  { id: "custom", label: "Custom range" },
];

const EnhancedDashboardFilters: React.FC<EnhancedDashboardFiltersProps> = ({
  filters,
  onFiltersChange,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (
    key: "status" | "fraudTypes" | "severity",
    value: string,
  ) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    updateFilter(key, newArray);
  };

  const resetFilters = () => {
    onFiltersChange(defaultFilters);
    setIsExpanded(false);
  };

  const getActiveFilterCount = () => {
    if (!filters) return 0;

    let count = 0;
    if (filters.dateRange?.preset !== "last30days") count++;
    if (filters.status?.length > 0) count++;
    if (filters.fraudTypes?.length > 0) count++;
    if (filters.severity?.length > 0) count++;
    if (filters.location && filters.location.trim()) count++;
    if (filters.amountRange?.min || filters.amountRange?.max) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const handleDateRangeChange = (preset: string) => {
    if (preset === "custom") {
      setShowCustomDatePicker(true);
      updateFilter("dateRange", {
        preset,
        customStart: undefined,
        customEnd: undefined,
      });
    } else {
      setShowCustomDatePicker(false);
      updateFilter("dateRange", { preset });
    }
  };

  const handleCustomDateSelect = (start?: Date, end?: Date) => {
    updateFilter("dateRange", {
      preset: "custom",
      customStart: start,
      customEnd: end,
    });
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm"
              >
                {isExpanded ? "Hide Filters" : "Show All Filters"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Date:</Label>
              <Select
                value={filters.dateRange?.preset || "last30days"}
                onValueChange={handleDateRangeChange}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {datePresets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filters.dateRange?.preset === "custom" && (
                <Popover
                  open={showCustomDatePicker}
                  onOpenChange={setShowCustomDatePicker}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {filters.dateRange?.customStart &&
                      filters.dateRange?.customEnd
                        ? `${format(filters.dateRange.customStart, "MMM dd")} - ${format(filters.dateRange.customEnd, "MMM dd")}`
                        : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: filters.dateRange?.customStart,
                        to: filters.dateRange?.customEnd,
                      }}
                      onSelect={(range) => {
                        if (range?.from) {
                          handleCustomDateSelect(range.from, range.to);
                        }
                      }}
                      numberOfMonths={2}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Quick Status Filters */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Status:</Label>
              <div className="flex gap-1">
                {statusOptions.slice(0, 3).map((status) => (
                  <Button
                    key={status.id}
                    variant={
                      (filters.status || []).includes(status.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleArrayFilter("status", status.id)}
                    className="text-xs"
                  >
                    {status.label}
                  </Button>
                ))}
                {statusOptions.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="text-xs"
                  >
                    +{statusOptions.length - 3} more
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="space-y-6 pt-4 border-t">
              {/* Fraud Types */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Fraud Types
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {fraudTypeOptions.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <Checkbox
                        checked={(filters.fraudTypes || []).includes(type.id)}
                        onCheckedChange={() =>
                          toggleArrayFilter("fraudTypes", type.id)
                        }
                      />
                      <span className="text-sm flex items-center gap-1">
                        <span>{type.icon}</span>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status (All Options) */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Report Status
                </Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status.id}
                      variant={
                        (filters.status || []).includes(status.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleArrayFilter("status", status.id)}
                      className="flex items-center gap-1"
                    >
                      {status.label}
                      {(filters.status || []).includes(status.id) && (
                        <X className="h-3 w-3" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Severity Level */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Severity Level
                </Label>
                <div className="flex flex-wrap gap-2">
                  {severityOptions.map((severity) => (
                    <Button
                      key={severity.id}
                      variant={
                        (filters.severity || []).includes(severity.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleArrayFilter("severity", severity.id)}
                      className="flex items-center gap-1"
                    >
                      {severity.label}
                      {(filters.severity || []).includes(severity.id) && (
                        <X className="h-3 w-3" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Location and Amount Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Filter */}
                <div>
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium mb-2 block"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State (e.g., Mumbai, Maharashtra)"
                    value={filters.location || ""}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Amount Range */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Amount Range (₹)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min amount"
                      value={filters.amountRange?.min || ""}
                      onChange={(e) =>
                        updateFilter("amountRange", {
                          ...filters.amountRange,
                          min: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-gray-400">to</span>
                    <Input
                      type="number"
                      placeholder="Max amount"
                      value={filters.amountRange?.max || ""}
                      onChange={(e) =>
                        updateFilter("amountRange", {
                          ...filters.amountRange,
                          max: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-xs text-gray-500 py-1">
                Active filters:
              </span>

              {filters.dateRange.preset !== "last30days" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date:{" "}
                  {
                    datePresets.find((p) => p.id === filters.dateRange.preset)
                      ?.label
                  }
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() =>
                      updateFilter("dateRange", { preset: "last30days" })
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(filters.status || []).map((status) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {statusOptions.find((s) => s.id === status)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => toggleArrayFilter("status", status)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {(filters.fraudTypes || []).map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {fraudTypeOptions.find((t) => t.id === type)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => toggleArrayFilter("fraudTypes", type)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {(filters.severity || []).map((severity) => (
                <Badge
                  key={severity}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {severityOptions.find((s) => s.id === severity)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => toggleArrayFilter("severity", severity)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {filters.location}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => updateFilter("location", "")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(filters.amountRange?.min || filters.amountRange?.max) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Amount: ₹{filters.amountRange?.min || 0} - ₹
                  {filters.amountRange?.max || "∞"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => updateFilter("amountRange", {})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDashboardFilters;
