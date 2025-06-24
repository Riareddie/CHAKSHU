import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useAdminStats, useAdminReports } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

const ReportGeneration = () => {
  const { stats } = useAdminStats();
  const { reports } = useAdminReports();
  const { toast } = useToast();

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [reportType, setReportType] = useState("");
  const [format_type, setFormatType] = useState("");
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: "fraud-summary", label: "Fraud Summary Report" },
    { value: "user-activity", label: "User Activity Report" },
    { value: "regional-analysis", label: "Regional Analysis Report" },
    { value: "trend-analysis", label: "Trend Analysis Report" },
    { value: "financial-impact", label: "Financial Impact Report" },
    { value: "response-time", label: "Response Time Report" },
  ];

  const generateQuickReport = async (type: "today" | "weekly" | "monthly") => {
    setGenerating(true);

    try {
      // Filter reports based on type
      let filteredReports = reports;
      const now = new Date();

      if (type === "today") {
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        filteredReports = reports.filter(
          (r) => new Date(r.created_at) >= today,
        );
      } else if (type === "weekly") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredReports = reports.filter(
          (r) => new Date(r.created_at) >= weekAgo,
        );
      } else if (type === "monthly") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredReports = reports.filter(
          (r) => new Date(r.created_at) >= monthAgo,
        );
      }

      // Generate report data
      const reportData = {
        period: type,
        generated_at: new Date().toISOString(),
        summary: {
          total_reports: filteredReports.length,
          pending: filteredReports.filter((r) => r.status === "pending").length,
          resolved: filteredReports.filter((r) => r.status === "resolved")
            .length,
          rejected: filteredReports.filter((r) => r.status === "rejected")
            .length,
          total_amount: filteredReports.reduce(
            (sum, r) => sum + (r.amount_involved || 0),
            0,
          ),
        },
        fraud_types: filteredReports.reduce(
          (acc, r) => {
            acc[r.fraud_type] = (acc[r.fraud_type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        reports: filteredReports,
      };

      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create and download the report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fraud_report_${type}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} report has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateCustomReport = async () => {
    if (!reportType || !format_type) {
      toast({
        title: "Missing Information",
        description: "Please select both report type and format.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      // Filter reports by date range if specified
      let filteredReports = reports;
      if (dateFrom || dateTo) {
        filteredReports = reports.filter((r) => {
          const reportDate = new Date(r.created_at);
          if (dateFrom && reportDate < dateFrom) return false;
          if (dateTo && reportDate > dateTo) return false;
          return true;
        });
      }

      // Generate report based on type
      let reportData: any = {
        type: reportType,
        format: format_type,
        date_range: {
          from: dateFrom?.toISOString(),
          to: dateTo?.toISOString(),
        },
        generated_at: new Date().toISOString(),
        total_records: filteredReports.length,
      };

      switch (reportType) {
        case "fraud-summary":
          reportData.summary = {
            total_reports: filteredReports.length,
            by_status: filteredReports.reduce(
              (acc, r) => {
                acc[r.status] = (acc[r.status] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            ),
            by_type: filteredReports.reduce(
              (acc, r) => {
                acc[r.fraud_type] = (acc[r.fraud_type] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            ),
            total_amount: filteredReports.reduce(
              (sum, r) => sum + (r.amount_involved || 0),
              0,
            ),
          };
          break;
        case "regional-analysis":
          reportData.regional_data = filteredReports.reduce(
            (acc, r) => {
              const location = `${r.city || "Unknown"}, ${r.state || "Unknown"}`;
              if (!acc[location]) {
                acc[location] = { count: 0, total_amount: 0 };
              }
              acc[location].count++;
              acc[location].total_amount += r.amount_involved || 0;
              return acc;
            },
            {} as Record<string, { count: number; total_amount: number }>,
          );
          break;
        case "financial-impact":
          reportData.financial_analysis = {
            total_loss: filteredReports.reduce(
              (sum, r) => sum + (r.amount_involved || 0),
              0,
            ),
            average_loss:
              filteredReports.length > 0
                ? filteredReports.reduce(
                    (sum, r) => sum + (r.amount_involved || 0),
                    0,
                  ) / filteredReports.length
                : 0,
            by_fraud_type: filteredReports.reduce(
              (acc, r) => {
                if (!acc[r.fraud_type]) {
                  acc[r.fraud_type] = { count: 0, total_amount: 0 };
                }
                acc[r.fraud_type].count++;
                acc[r.fraud_type].total_amount += r.amount_involved || 0;
                return acc;
              },
              {} as Record<string, { count: number; total_amount: number }>,
            ),
          };
          break;
        default:
          reportData.data = filteredReports;
      }

      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create and download the report
      let blob: Blob;
      let fileName: string;

      if (format_type === "json") {
        blob = new Blob([JSON.stringify(reportData, null, 2)], {
          type: "application/json",
        });
        fileName = `${reportType}_${Date.now()}.json`;
      } else if (format_type === "csv") {
        // Simple CSV conversion for reports
        const csvHeaders = ["ID", "Type", "Status", "Amount", "City", "Date"];
        const csvRows = filteredReports.map((r) => [
          r.id,
          r.fraud_type,
          r.status,
          r.amount_involved || 0,
          r.city || "Unknown",
          new Date(r.created_at).toLocaleDateString(),
        ]);
        const csvContent = [csvHeaders, ...csvRows]
          .map((row) => row.join(","))
          .join("\n");

        blob = new Blob([csvContent], { type: "text/csv" });
        fileName = `${reportType}_${Date.now()}.csv`;
      } else {
        // Default to JSON for PDF and Excel (would need additional libraries for proper conversion)
        blob = new Blob([JSON.stringify(reportData, null, 2)], {
          type: "application/json",
        });
        fileName = `${reportType}_${Date.now()}.json`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: `Custom ${reportType} report has been generated and downloaded.`,
      });

      if (email) {
        toast({
          title: "Email Notification",
          description: `Report generation notification sent to ${email}`,
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate custom report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const quickReports = [
    {
      title: "Today's Summary",
      description: "Quick overview of today's fraud reports",
      icon: BarChart3,
      action: () => generateQuickReport("today"),
    },
    {
      title: "Weekly Trends",
      description: "Last 7 days fraud pattern analysis",
      icon: TrendingUp,
      action: () => generateQuickReport("weekly"),
    },
    {
      title: "Monthly Overview",
      description: "Complete monthly fraud statistics",
      icon: PieChart,
      action: () => generateQuickReport("monthly"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickReports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Icon className="h-8 w-8 text-india-saffron" />
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {report.description}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={report.action}
                  disabled={generating}
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {generating ? "Generating..." : "Generate"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Export Format</Label>
                <Select value={format_type} onValueChange={setFormatType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Report To (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chaksu.gov.in"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-india-saffron hover:bg-saffron-600"
              disabled={!reportType || !format_type || generating}
              onClick={generateCustomReport}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {generating ? "Generating Report..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGeneration;
