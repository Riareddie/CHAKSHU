import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Activity,
  FileText,
  MessageSquare,
  Shield,
  User,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Search,
  Clock,
  MapPin,
  Eye,
  ThumbsUp,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { format } from "date-fns";

const ActivityHistory = () => {
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const activities = [
    {
      id: 1,
      type: "report_submit",
      title: "Submitted fraud report",
      description: "UPI fraud case - Unauthorized transaction",
      details: "Report ID: FR-2024-001234",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: { amount: 5000, reportId: "FR-2024-001234" },
    },
    {
      id: 2,
      type: "comment",
      title: "Posted community comment",
      description: "Shared advice on identifying fake investment schemes",
      details: "Thread: How to spot Ponzi schemes",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: { threadId: "thread-456", likes: 12 },
    },
    {
      id: 3,
      type: "profile_update",
      title: "Updated profile information",
      description: "Changed contact information and privacy settings",
      details: "Updated phone number and email preferences",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: {},
    },
    {
      id: 4,
      type: "report_update",
      title: "Report status updated",
      description: "Your fraud report has been reviewed",
      details: "Report ID: FR-2024-001200 - Status: Under Investigation",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "under_review",
      location: "Mumbai, Maharashtra",
      metadata: { reportId: "FR-2024-001200", previousStatus: "pending" },
    },
    {
      id: 5,
      type: "login",
      title: "Account login",
      description: "Successful login from Chrome browser",
      details: "IP: 192.168.1.100",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: { device: "Chrome on Windows", ip: "192.168.1.100" },
    },
    {
      id: 6,
      type: "help_given",
      title: "Helped community member",
      description: "Provided guidance on suspicious SMS identification",
      details: "Marked as helpful by 8 users",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: { helpfulVotes: 8, userId: "user-789" },
    },
    {
      id: 7,
      type: "security",
      title: "Security setting changed",
      description: "Enabled two-factor authentication",
      details: "Account security enhanced",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: { setting: "2fa", enabled: true },
    },
    {
      id: 8,
      type: "achievement",
      title: "Achievement unlocked",
      description: "Earned 'Fraud Fighter' badge",
      details: "Completed 10 fraud reports milestone",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "completed",
      location: "Mumbai, Maharashtra",
      metadata: { achievementId: "fraud-fighter", level: 1 },
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "report_submit":
      case "report_update":
        return <FileText className="h-4 w-4" />;
      case "comment":
      case "help_given":
        return <MessageSquare className="h-4 w-4" />;
      case "profile_update":
        return <User className="h-4 w-4" />;
      case "login":
        return <Shield className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "achievement":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "report_submit":
      case "report_update":
        return "text-blue-600 bg-blue-100";
      case "comment":
      case "help_given":
        return "text-green-600 bg-green-100";
      case "profile_update":
        return "text-purple-600 bg-purple-100";
      case "login":
        return "text-gray-600 bg-gray-100";
      case "security":
        return "text-red-600 bg-red-100";
      case "achievement":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "under_review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
        );
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (filterType !== "all" && activity.type !== filterType) {
      return false;
    }
    if (
      searchQuery &&
      !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (dateRange.from && activity.timestamp < dateRange.from) {
      return false;
    }
    if (dateRange.to && activity.timestamp > dateRange.to) {
      return false;
    }
    return true;
  });

  const handleExportHistory = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      total_activities: filteredActivities.length,
      activities: filteredActivities,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-history-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Activity Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="report_submit">
                    Report Submissions
                  </SelectItem>
                  <SelectItem value="report_update">Report Updates</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="help_given">Community Help</SelectItem>
                  <SelectItem value="profile_update">
                    Profile Changes
                  </SelectItem>
                  <SelectItem value="login">Login Activity</SelectItem>
                  <SelectItem value="security">Security Changes</SelectItem>
                  <SelectItem value="achievement">Achievements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredActivities.length} of {activities.length}{" "}
              activities
            </p>
            <Button onClick={handleExportHistory} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No activities found for the selected filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="relative">
                  {index !== filteredActivities.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                  )}

                  <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div
                      className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          {activity.details && (
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.details}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(activity.timestamp, "MMM d, yyyy h:mm a")}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(activity.status)}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Activity Metadata */}
                      {Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(activity.metadata).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-500 capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}:
                                  </span>
                                  <span className="text-gray-700">
                                    {String(value)}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {activities.filter((a) => a.type.includes("report")).length}
              </div>
              <div className="text-sm text-blue-700">Report Activities</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  activities.filter(
                    (a) => a.type === "comment" || a.type === "help_given",
                  ).length
                }
              </div>
              <div className="text-sm text-green-700">Community Engagement</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {activities.filter((a) => a.type === "profile_update").length}
              </div>
              <div className="text-sm text-purple-700">Profile Updates</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {activities.filter((a) => a.type === "achievement").length}
              </div>
              <div className="text-sm text-yellow-700">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityHistory;
