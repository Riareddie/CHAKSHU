
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ExternalLink } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  fraud_type: string;
  status: string;
  incident_date: string | null;
  amount_involved: number | null;
  created_at: string;
  updated_at: string;
  authority_action: string | null;
  authority_comments: string | null;
}

interface ReportsTableProps {
  reports: Report[];
  selectedReports: string[];
  onReportSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewReport: (report: Report) => void;
  loading: boolean;
}

const ReportsTable = ({
  reports,
  selectedReports,
  onReportSelect,
  onSelectAll,
  onViewReport,
  loading
}: ReportsTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "outline",
      under_review: "secondary",
      resolved: "default",
      rejected: "destructive",
      withdrawn: "outline"
    };

    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getFraudTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-india-saffron"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedReports.length === reports.length && reports.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Incident Date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => onReportSelect(report.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 truncate max-w-xs">
                      {report.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {report.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getFraudTypeBadge(report.fraud_type)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(report.status)}
                </TableCell>
                <TableCell>
                  {formatAmount(report.amount_involved)}
                </TableCell>
                <TableCell>
                  {report.incident_date 
                    ? new Date(report.incident_date).toLocaleDateString('en-IN')
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  {formatDate(report.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewReport(report)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;
