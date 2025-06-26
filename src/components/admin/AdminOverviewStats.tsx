import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";
import { Skeleton } from "@/components/ui/skeleton";

const AdminOverviewStats = () => {
  const {
    stats,
    statsLoading: loading,
    statsError: error,
    fetchStats: refetch,
    realtimeConnected,
    lastUpdated,
  } = useAdmin();

  const formatNumber = (num: number): string => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">
                  Failed to load admin statistics: {error}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      title: "Total Reports",
      value: formatNumber(stats.totalReports),
      change: `+${stats.monthlyGrowth.reports.toFixed(1)}%`,
      trend: "up",
      icon: AlertTriangle,
      color: "text-blue-600",
    },
    {
      title: "Pending Reviews",
      value: formatNumber(stats.pendingReports),
      change: stats.pendingReports > stats.totalReports * 0.1 ? "+↑" : "-↓",
      trend: stats.pendingReports > stats.totalReports * 0.1 ? "up" : "down",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Resolved Cases",
      value: formatNumber(stats.resolvedReports),
      change: `${((stats.resolvedReports / stats.totalReports) * 100).toFixed(1)}%`,
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: formatNumber(stats.activeUsers),
      change: `+${stats.monthlyGrowth.users.toFixed(1)}%`,
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Fraud Prevented",
      value: formatCurrency(stats.totalAmount),
      change: `+${stats.monthlyGrowth.amount.toFixed(1)}%`,
      trend: "up",
      icon: Shield,
      color: "text-india-saffron",
    },
    {
      title: "Response Time",
      value: `${stats.averageResponseTime}h`,
      change: "-18.5%",
      trend: "down",
      icon: TrendingUp,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Overview Statistics</h3>
          <div className="flex items-center gap-2">
            {realtimeConnected ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-200">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverviewStats;
