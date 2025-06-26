import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  CheckCircle,
  X,
  AlertCircle,
  Clock,
  RefreshCw,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const PendingReportsQueue = () => {
  const {
    reports,
    reportsLoading: loading,
    reportsError: error,
    fetchReports: refetch,
    updateReportStatus,
    reportFilters,
    setReportFilters,
    selectedReport,
    setSelectedReport,
  } = useAdmin();
  const { toast } = useToast();

  const [sortBy, setSortBy] = useState("priority");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "approve" | "reject" | "view" | null;
    reportId: string;
  }>({ open: false, action: null, reportId: "" });
  const [comments, setComments] = useState("");
  const [processing, setProcessing] = useState(false);

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    if (!reports || !Array.isArray(reports)) return [];

    let filtered = reports.filter((report) => {
      if (reportFilters.status === "all" || !reportFilters.status) return true;
      if (reportFilters.status === "pending")
        return report.status === "pending";
      if (reportFilters.status === "under-review")
        return report.status === "under_review";
      if (reportFilters.status === "escalated")
        return report.priority === "critical";
      return report.status === reportFilters.status;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (
            (priorityOrder[b.priority || "low"] || 1) -
            (priorityOrder[a.priority || "low"] || 1)
          );
        case "date":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "amount":
          return (b.amount_involved || 0) - (a.amount_involved || 0);
        case "type":
          return a.fraud_type.localeCompare(b.fraud_type);
        default:
          return 0;
      }
    });
  }, [reports, reportFilters.status, sortBy]);

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "under_review":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFraudType = (type: string) => {
    const typeMap: Record<string, string> = {
      phishing: "Phishing",
      sms_fraud: "SMS Fraud",
      call_fraud: "Call Fraud",
      email_spam: "Email Spam",
      investment_scam: "Investment Scam",
      lottery_scam: "Lottery Scam",
      tech_support_scam: "Tech Support",
      romance_scam: "Romance Scam",
      other: "Other",
    };
    return typeMap[type] || type;
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      under_review: "Under Review",
      resolved: "Resolved",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
    };
    return statusMap[status] || status;
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleAction = (
    action: "approve" | "reject" | "view",
    reportId: string,
  ) => {
    const report = reports.find((r) => r.id === reportId);
    setSelectedReport(report);
    setActionDialog({ open: true, action, reportId });
    setComments("");
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.action || !actionDialog.reportId) return;

    setProcessing(true);
    try {
      const newStatus =
        actionDialog.action === "approve" ? "resolved" : "rejected";
      const authorityAction =
        actionDialog.action === "approve"
          ? "case_closed"
          : "no_action_required";

      await updateReportStatus(
        actionDialog.reportId,
        newStatus,
        comments || undefined,
        authorityAction,
      );

      setActionDialog({ open: false, action: null, reportId: "" });
      setSelectedReport(null);
      setComments("");
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Reports Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">
                Failed to load reports: {error}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pending Reports Queue</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredAndSortedReports.length} reports found
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={reportFilters.status || "all"}
                onValueChange={(value) =>
                  setReportFilters({
                    ...reportFilters,
                    status: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="escalated">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedReports.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No reports found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {!reportFilters.status || reportFilters.status === "all"
                  ? "No reports have been submitted yet."
                  : `No reports match the current filter: ${reportFilters.status}`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{formatFraudType(report.fraud_type)}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority?.toUpperCase() || "LOW"}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.user_name || "Unknown User"}</TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(report.amount_involved)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {report.evidence_count || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        {formatStatus(report.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("view", report.id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(report.status === "pending" ||
                          report.status === "under_review") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleAction("approve", report.id)}
                              title="Approve/Resolve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleAction("reject", report.id)}
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          !open && setActionDialog({ open: false, action: null, reportId: "" })
        }
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "view" && "Report Details"}
              {actionDialog.action === "approve" && "Approve Report"}
              {actionDialog.action === "reject" && "Reject Report"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "view" &&
                "Review the details of this fraud report."}
              {actionDialog.action === "approve" &&
                "Mark this report as resolved. This action cannot be undone."}
              {actionDialog.action === "reject" &&
                "Reject this report. Please provide a reason."}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Report ID</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedReport.id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFraudType(selectedReport.fraud_type)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(selectedReport.amount_involved)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedReport.city && selectedReport.state
                      ? `${selectedReport.city}, ${selectedReport.state}`
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  {selectedReport.description}
                </p>
              </div>

              {actionDialog.action !== "view" && (
                <div>
                  <Label htmlFor="comments" className="text-sm font-medium">
                    Comments {actionDialog.action === "reject" && "*"}
                  </Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={
                      actionDialog.action === "approve"
                        ? "Optional: Add resolution comments..."
                        : "Required: Provide reason for rejection..."
                    }
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({ open: false, action: null, reportId: "" })
              }
              disabled={processing}
            >
              {actionDialog.action === "view" ? "Close" : "Cancel"}
            </Button>
            {actionDialog.action !== "view" && (
              <Button
                onClick={handleActionConfirm}
                disabled={
                  processing ||
                  (actionDialog.action === "reject" && !comments.trim())
                }
                className={
                  actionDialog.action === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {actionDialog.action === "approve" ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    {actionDialog.action === "approve" ? "Approve" : "Reject"}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingReportsQueue;
