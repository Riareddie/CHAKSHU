/**
 * Responsive Table Component
 * Provides responsive tables with horizontal scroll on mobile, touch-friendly interactions
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  sticky?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
  mobileRender?: (value: any, row: any, index: number) => React.ReactNode;
  hideOnMobile?: boolean;
  showOnMobile?: boolean; // Force show on mobile even if hideOnMobile is true for other columns
  className?: string;
  headerClassName?: string;
}

export interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any, index: number) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  disabled?: (row: any) => boolean;
  hidden?: (row: any) => boolean;
}

export interface ResponsiveTableProps {
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  mobileView?: "scroll" | "cards" | "stack";
  stickyHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  className?: string;
  containerClassName?: string;
  onRowClick?: (row: any, index: number) => void;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  rowKey?: string | ((row: any) => string);
  exportable?: boolean;
  onExport?: () => void;
  // Responsive breakpoints
  breakpoints?: {
    mobile?: number; // px
    tablet?: number; // px
    desktop?: number; // px
  };
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = "No data available",
  emptyDescription = "Try adjusting your search or filter criteria",
  searchable = false,
  filterable = false,
  sortable = false,
  pagination,
  mobileView = "scroll",
  stickyHeader = false,
  striped = true,
  hoverable = true,
  compact = false,
  className = "",
  containerClassName = "",
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  rowKey = "id",
  exportable = false,
  onExport,
  breakpoints = { mobile: 768, tablet: 1024, desktop: 1280 },
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [hiddenColumns, setHiddenColumns] = React.useState<string[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);

  // Responsive detection
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < (breakpoints.mobile || 768));
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoints.mobile]);

  // Get row ID
  const getRowId = (row: any, index: number) => {
    if (typeof rowKey === "function") return rowKey(row);
    return row[rowKey] || index.toString();
  };

  // Filter and sort data
  const processedData = React.useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchable && searchTerm) {
      const searchableColumns = columns.filter(
        (col) => col.searchable !== false,
      );
      filtered = filtered.filter((row) =>
        searchableColumns.some((col) => {
          const value = row[col.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }),
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((row) => {
          const rowValue = row[key];
          return rowValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortConfig, columns, searchable]);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        return current.direction === "asc"
          ? { key: columnKey, direction: "desc" }
          : null;
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  // Handle selection
  const handleRowSelection = (rowId: string, selected: boolean) => {
    if (!onSelectionChange) return;

    const newSelection = selected
      ? [...selectedRows, rowId]
      : selectedRows.filter((id) => id !== rowId);

    onSelectionChange(newSelection);
  };

  const handleSelectAll = (selected: boolean) => {
    if (!onSelectionChange) return;

    const allIds = processedData.map((row, index) => getRowId(row, index));
    onSelectionChange(selected ? allIds : []);
  };

  // Visible columns for current viewport
  const visibleColumns = React.useMemo(() => {
    return columns.filter((col) => {
      if (hiddenColumns.includes(col.key)) return false;
      if (isMobile) {
        if (col.hideOnMobile && !col.showOnMobile) return false;
      }
      return true;
    });
  }, [columns, hiddenColumns, isMobile]);

  // Render sort icon
  const renderSortIcon = (columnKey: string) => {
    if (!sortable) return null;

    const isActive = sortConfig?.key === columnKey;
    const direction = sortConfig?.direction;

    if (!isActive) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }

    return direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Render mobile card view
  const renderMobileCards = () => (
    <div className="space-y-4">
      {processedData.map((row, index) => {
        const rowId = getRowId(row, index);
        const isSelected = selectedRows.includes(rowId);

        return (
          <Card
            key={rowId}
            className={cn(
              "transition-all duration-200",
              hoverable && "hover:shadow-md cursor-pointer",
              isSelected && "ring-2 ring-primary",
              onRowClick && "cursor-pointer",
            )}
            onClick={() => onRowClick?.(row, index)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {visibleColumns.map((column) => {
                  const value = row[column.key];
                  const content = column.mobileRender
                    ? column.mobileRender(value, row, index)
                    : column.render
                      ? column.render(value, row, index)
                      : value;

                  return (
                    <div
                      key={column.key}
                      className="flex justify-between items-start"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.label}:
                      </span>
                      <span className="text-sm text-right flex-1 ml-2">
                        {content}
                      </span>
                    </div>
                  );
                })}

                {actions.length > 0 && (
                  <div className="flex justify-end space-x-2 pt-2 border-t">
                    {actions
                      .filter((action) => !action.hidden?.(row))
                      .slice(0, 2) // Show max 2 actions in mobile view
                      .map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || "outline"}
                          size="sm"
                          disabled={action.disabled?.(row)}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row, index);
                          }}
                          className="text-xs"
                        >
                          {action.icon && (
                            <span className="mr-1">{action.icon}</span>
                          )}
                          {action.label}
                        </Button>
                      ))}

                    {actions.length > 2 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.slice(2).map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(row, index)}
                              disabled={action.disabled?.(row)}
                            >
                              {action.icon && (
                                <span className="mr-2">{action.icon}</span>
                              )}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Render desktop table
  const renderDesktopTable = () => (
    <ScrollArea className="w-full">
      <Table className={cn("w-full", compact && "text-sm", className)}>
        <TableHeader
          className={cn(stickyHeader && "sticky top-0 bg-background z-10")}
        >
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === processedData.length &&
                    processedData.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
              </TableHead>
            )}
            {visibleColumns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "font-medium",
                  column.headerClassName,
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.sticky && "sticky left-0 bg-background z-10",
                  sortable &&
                    column.sortable !== false &&
                    "cursor-pointer hover:bg-muted/50",
                )}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                }}
                onClick={() =>
                  column.sortable !== false && handleSort(column.key)
                }
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable !== false && renderSortIcon(column.key)}
                </div>
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="w-24 text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {processedData.map((row, index) => {
            const rowId = getRowId(row, index);
            const isSelected = selectedRows.includes(rowId);

            return (
              <TableRow
                key={rowId}
                className={cn(
                  striped && index % 2 === 0 && "bg-muted/30",
                  hoverable && "hover:bg-muted/50 cursor-pointer",
                  isSelected && "bg-primary/10",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row, index)}
              >
                {onSelectionChange && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleRowSelection(rowId, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((column) => {
                  const value = row[column.key];
                  const content = column.render
                    ? column.render(value, row, index)
                    : value;

                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        column.className,
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.sticky && "sticky left-0 bg-background",
                        compact && "py-2",
                      )}
                    >
                      {content}
                    </TableCell>
                  );
                })}
                {actions.length > 0 && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {actions
                        .filter((action) => !action.hidden?.(row))
                        .slice(0, 2)
                        .map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.variant || "ghost"}
                            size="sm"
                            disabled={action.disabled?.(row)}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row, index);
                            }}
                          >
                            {action.icon || action.label}
                          </Button>
                        ))}

                      {actions.length > 2 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.slice(2).map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => action.onClick(row, index)}
                                disabled={action.disabled?.(row)}
                              >
                                {action.icon && (
                                  <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    const { page, pageSize, total, onPageChange, onPageSizeChange } =
      pagination;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>
            Showing {startItem} to {endItem} of {total} results
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm px-2">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", containerClassName)}>
      {/* Controls */}
      {(searchable || filterable || exportable) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Column visibility toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columns.map((column) => (
                  <DropdownMenuItem
                    key={column.key}
                    onClick={() => {
                      setHiddenColumns((current) =>
                        current.includes(column.key)
                          ? current.filter((key) => key !== column.key)
                          : [...current, column.key],
                      );
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.includes(column.key)}
                        readOnly
                        className="h-4 w-4"
                      />
                      <span>{column.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {exportable && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : processedData.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-lg font-medium">{emptyMessage}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {emptyDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {isMobile && mobileView === "cards"
            ? renderMobileCards()
            : renderDesktopTable()}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default ResponsiveTable;
