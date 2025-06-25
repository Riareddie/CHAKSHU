/**
 * Admin Dashboard Page
 * Comprehensive admin dashboard with role-based access control and user management
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Database,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  FileCheck,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import {
  ProtectedComponent,
  RoleBadge,
} from "@/components/rbac/ProtectedComponent";
import AdminUserManagement from "@/components/rbac/AdminUserManagement";
import { DynamicNavigation } from "@/components/rbac/DynamicNavigation";
import { UserRole, Permission } from "@/types/rbac";
import { useAuth } from "@/contexts/SecureAuthContext";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalAmount: number;
  todayReports: number;
  systemHealth: "good" | "warning" | "critical";
}

interface RecentActivity {
  id: string;
  type:
    | "user_created"
    | "report_submitted"
    | "role_changed"
    | "report_resolved";
  description: string;
  timestamp: Date;
  user: string;
  severity: "low" | "medium" | "high";
}

// Mock data
const mockStats: DashboardStats = {
  totalUsers: 2847,
  activeUsers: 1923,
  totalReports: 5649,
  pendingReports: 234,
  resolvedReports: 4981,
  totalAmount: 15670000, // ₹1.567 crores
  todayReports: 45,
  systemHealth: "good",
};

const mockActivity: RecentActivity[] = [
  {
    id: "1",
    type: "report_submitted",
    description: "New fraud report submitted by citizen",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    user: "john.doe@citizen.in",
    severity: "medium",
  },
  {
    id: "2",
    type: "user_created",
    description: "New officer account created",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: "admin@govt.in",
    severity: "low",
  },
  {
    id: "3",
    type: "role_changed",
    description: "User role changed from Citizen to Officer",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: "admin@govt.in",
    severity: "high",
  },
  {
    id: "4",
    type: "report_resolved",
    description: "Fraud case resolved with recovery action",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: "officer@govt.in",
    severity: "low",
  },
];

const AdminDashboard: React.FC = () => {
  const { user, hasPermission } = useRBAC();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_created":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "report_submitted":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "role_changed":
        return <Shield className="h-4 w-4 text-orange-500" />;
      case "report_resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ProtectedComponent
      permissions={[Permission.DASHBOARD_ADMIN]}
      unauthorizedMessage="You need admin privileges to access this dashboard."
    >
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <DynamicNavigation variant="sidebar" onLogout={logout} />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <DynamicNavigation variant="mobile" onLogout={logout} />
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back, {user.fullName}
                  </p>
                  <div className="mt-2">
                    <RoleBadge role={user.role} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>

                  <ProtectedComponent permissions={[Permission.DATA_EXPORT]}>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </ProtectedComponent>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>

                <ProtectedComponent
                  permissions={[Permission.USERS_VIEW_ALL]}
                  showFallback={false}
                >
                  <TabsTrigger value="users">User Management</TabsTrigger>
                </ProtectedComponent>

                <ProtectedComponent
                  permissions={[Permission.ANALYTICS_VIEW_ADVANCED]}
                  showFallback={false}
                >
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </ProtectedComponent>

                <ProtectedComponent
                  permissions={[Permission.SYSTEM_CONFIG]}
                  showFallback={false}
                >
                  <TabsTrigger value="system">System</TabsTrigger>
                </ProtectedComponent>

                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockStats.totalUsers.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mockStats.activeUsers} active users
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Reports
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockStats.totalReports.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mockStats.todayReports} new today
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Amount Involved
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(mockStats.totalAmount)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total reported losses
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Resolution Rate
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(
                          (mockStats.resolvedReports / mockStats.totalReports) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mockStats.resolvedReports} resolved cases
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Pending Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">
                        {mockStats.pendingReports}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Reports awaiting review
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        variant={
                          mockStats.systemHealth === "good"
                            ? "default"
                            : "destructive"
                        }
                        className="text-lg p-2"
                      >
                        {mockStats.systemHealth.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        All systems operational
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Today's Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {mockStats.todayReports}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        New reports today
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent System Activity</CardTitle>
                    <CardDescription>
                      Latest activities across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockActivity.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-4"
                        >
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {activity.user} •{" "}
                              {activity.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.severity === "high"
                                ? "destructive"
                                : activity.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {activity.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Management Tab */}
              <TabsContent value="users">
                <AdminUserManagement />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <ProtectedComponent
                  permissions={[Permission.ANALYTICS_VIEW_ADVANCED]}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Advanced Analytics
                      </CardTitle>
                      <CardDescription>
                        Detailed system analytics and reporting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Advanced analytics dashboard would be implemented here
                        with charts, trends, and detailed metrics.
                      </p>
                    </CardContent>
                  </Card>
                </ProtectedComponent>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system">
                <ProtectedComponent permissions={[Permission.SYSTEM_CONFIG]}>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          System Configuration
                        </CardTitle>
                        <CardDescription>
                          Manage system settings and configuration
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          System configuration interface would be implemented
                          here.
                        </p>
                      </CardContent>
                    </Card>

                    <ProtectedComponent
                      permissions={[Permission.SYSTEM_AUDIT_LOGS]}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Audit Logs
                          </CardTitle>
                          <CardDescription>
                            View system audit logs and security events
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Audit logs interface would be implemented here.
                          </p>
                        </CardContent>
                      </Card>
                    </ProtectedComponent>
                  </div>
                </ProtectedComponent>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Activity Log
                    </CardTitle>
                    <CardDescription>
                      Detailed log of all system activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-4 p-4 border rounded-lg"
                        >
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="font-medium">
                              {activity.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Performed by {activity.user}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {activity.timestamp.toLocaleString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.severity === "high"
                                ? "destructive"
                                : activity.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {activity.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default AdminDashboard;
