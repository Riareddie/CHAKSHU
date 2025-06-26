import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Server,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  HardDrive,
  Zap,
  Clock,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const SystemHealthMonitoring = () => {
  const {
    systemHealth,
    systemHealthLoading: loading,
    systemHealthError: error,
    fetchSystemHealth: refreshHealth,
    realtimeConnected,
    stats,
  } = useAdmin();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
        return "bg-green-100 text-green-800";
      case "degraded":
      case "reconnecting":
        return "bg-yellow-100 text-yellow-800";
      case "down":
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "degraded":
      case "reconnecting":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "down":
      case "disconnected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthScore = () => {
    if (!systemHealth) return 0;

    let score = 0;
    let total = 0;

    // Database health (40% weight)
    if (systemHealth.database.status === "healthy") score += 40;
    else if (systemHealth.database.status === "degraded") score += 20;
    total += 40;

    // Realtime health (30% weight)
    if (systemHealth.realtime.status === "connected") score += 30;
    else if (systemHealth.realtime.status === "reconnecting") score += 15;
    total += 30;

    // Storage health (30% weight)
    if (systemHealth.storage.status === "healthy") score += 30;
    else if (systemHealth.storage.status === "degraded") score += 15;
    total += 30;

    return Math.round((score / total) * 100);
  };

  const getPerformanceMetrics = () => {
    if (!systemHealth) return [];

    return [
      {
        name: "Database Performance",
        value: Math.max(100 - systemHealth.database.responseTime, 0),
        status: systemHealth.database.responseTime > 100 ? "warning" : "good",
        icon: Database,
        unit: "%",
        detail: `${systemHealth.database.responseTime}ms response time`,
      },
      {
        name: "Real-time Latency",
        value: Math.max(100 - systemHealth.realtime.latency, 0),
        status: systemHealth.realtime.latency > 50 ? "warning" : "good",
        icon: Wifi,
        unit: "%",
        detail: `${systemHealth.realtime.latency}ms latency`,
      },
      {
        name: "Storage Usage",
        value: 100 - systemHealth.storage.usage,
        status:
          systemHealth.storage.usage > 80
            ? "critical"
            : systemHealth.storage.usage > 60
              ? "warning"
              : "good",
        icon: HardDrive,
        unit: "%",
        detail: `${systemHealth.storage.usage}% used`,
      },
      {
        name: "Active Connections",
        value: Math.min((systemHealth.database.connections / 50) * 100, 100),
        status: systemHealth.database.connections > 40 ? "warning" : "good",
        icon: Server,
        unit: "",
        detail: `${systemHealth.database.connections} connections`,
      },
    ];
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSystemAlerts = () => {
    if (!systemHealth) return [];

    const alerts = [];

    if (systemHealth.database.status === "down") {
      alerts.push({
        type: "error",
        message: "Database connection is down",
        timestamp: "Now",
      });
    } else if (systemHealth.database.responseTime > 100) {
      alerts.push({
        type: "warning",
        message: `High database response time: ${systemHealth.database.responseTime}ms`,
        timestamp: "Now",
      });
    }

    if (systemHealth.realtime.status === "disconnected") {
      alerts.push({
        type: "error",
        message: "Real-time connection lost",
        timestamp: "Now",
      });
    }

    if (systemHealth.storage.usage > 80) {
      alerts.push({
        type: "warning",
        message: `Storage usage is high: ${systemHealth.storage.usage}%`,
        timestamp: "Now",
      });
    }

    if (!realtimeConnected) {
      alerts.push({
        type: "warning",
        message: "Real-time updates are currently disabled",
        timestamp: "Now",
      });
    }

    return alerts;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">
                Failed to load system health: {error}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={refreshHealth}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthScore = getHealthScore();
  const performanceMetrics = getPerformanceMetrics();
  const systemAlerts = getSystemAlerts();

  return (
    <div className="space-y-6">
      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="space-y-2">
          {systemAlerts.map((alert, index) => (
            <Alert
              key={index}
              className={
                alert.type === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-yellow-200 bg-yellow-50"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <span className="text-sm text-gray-500">
                    {alert.timestamp}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Monitoring
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${healthScore >= 80 ? "text-green-600" : healthScore >= 60 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {healthScore}%
                </div>
                <div className="text-xs text-gray-500">Overall Health</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshHealth}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
          {systemHealth && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Last checked:{" "}
                {new Date(systemHealth.lastCheck).toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                {realtimeConnected ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <Wifi className="h-3 w-3 mr-1" />
                    Real-time Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Real-time Offline
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {systemHealth ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Database</span>
                  </div>
                  <Badge
                    className={getStatusColor(systemHealth.database.status)}
                  >
                    {systemHealth.database.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span
                      className={
                        systemHealth.database.responseTime > 100
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {systemHealth.database.responseTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections</span>
                    <span
                      className={
                        systemHealth.database.connections > 40
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {systemHealth.database.connections}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance</span>
                    <Progress
                      value={Math.max(
                        100 - systemHealth.database.responseTime,
                        0,
                      )}
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Real-time</span>
                  </div>
                  <Badge
                    className={getStatusColor(systemHealth.realtime.status)}
                  >
                    {systemHealth.realtime.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active Channels</span>
                    <span>{systemHealth.realtime.channels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency</span>
                    <span
                      className={
                        systemHealth.realtime.latency > 50
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {systemHealth.realtime.latency}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance</span>
                    <Progress
                      value={Math.max(100 - systemHealth.realtime.latency, 0)}
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">Storage</span>
                  </div>
                  <Badge
                    className={getStatusColor(systemHealth.storage.status)}
                  >
                    {systemHealth.storage.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Usage</span>
                    <span
                      className={
                        systemHealth.storage.usage > 80
                          ? "text-red-600"
                          : systemHealth.storage.usage > 60
                            ? "text-yellow-600"
                            : "text-green-600"
                      }
                    >
                      {systemHealth.storage.usage}%
                    </span>
                  </div>
                  <Progress
                    value={systemHealth.storage.usage}
                    className={`h-2 ${
                      systemHealth.storage.usage > 80
                        ? "[&>div]:bg-red-500"
                        : systemHealth.storage.usage > 60
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                    }`}
                  />
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span>{systemHealth.storage.capacity}GB</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Health Data
              </h3>
              <p className="text-gray-600">
                System health data is not available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-5 w-5 ${getMetricColor(metric.status)}`}
                        />
                        <span className="font-medium text-sm">
                          {metric.name}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-lg font-bold ${getMetricColor(metric.status)}`}
                        >
                          {Math.round(metric.value)}
                          {metric.unit}
                        </span>
                      </div>
                      <Progress
                        value={metric.value}
                        className={`h-2 ${
                          metric.status === "critical"
                            ? "[&>div]:bg-red-500"
                            : metric.status === "warning"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                        }`}
                      />
                      <p className="text-xs text-gray-500">{metric.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Activity Summary */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalReports}
                  </div>
                  <div className="text-sm text-gray-500">Total Reports</div>
                </div>
                <Server className="h-8 w-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.activeUsers}
                  </div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.pendingReports}
                  </div>
                  <div className="text-sm text-gray-500">Pending Reviews</div>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemHealthMonitoring;
