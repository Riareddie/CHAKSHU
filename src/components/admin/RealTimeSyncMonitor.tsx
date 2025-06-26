import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Zap,
  Clock,
  TrendingUp,
  Database,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const RealTimeSyncMonitor = () => {
  const {
    systemHealth,
    systemHealthLoading,
    fetchSystemHealth,
    realtimeConnected,
    lastUpdated,
    stats,
  } = useAdmin();

  const [syncProgress, setSyncProgress] = useState({
    reports: 0,
    users: 0,
    health: 0,
  });

  // Simulate sync progress based on real-time connection
  useEffect(() => {
    if (realtimeConnected) {
      const interval = setInterval(() => {
        setSyncProgress((prev) => ({
          reports: Math.min(prev.reports + Math.random() * 10, 100),
          users: Math.min(prev.users + Math.random() * 8, 100),
          health: Math.min(prev.health + Math.random() * 12, 100),
        }));
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [realtimeConnected]);

  const getSyncData = () => {
    const baseData = [
      {
        source: "Fraud Reports",
        status: realtimeConnected ? "syncing" : "disconnected",
        progress: realtimeConnected ? syncProgress.reports : 0,
        rate: stats ? `${Math.round(stats.totalReports / 60)}r/min` : "0/min",
        lastUpdate: realtimeConnected ? "Just now" : "Disconnected",
        health: systemHealth?.database.status || "unknown",
      },
      {
        source: "User Management",
        status: realtimeConnected ? "syncing" : "disconnected",
        progress: realtimeConnected ? syncProgress.users : 0,
        rate: stats ? `${Math.round(stats.activeUsers / 3600)}u/min` : "0/min",
        lastUpdate: realtimeConnected ? "Just now" : "Disconnected",
        health: systemHealth?.database.status || "unknown",
      },
      {
        source: "System Health",
        status: systemHealth ? "completed" : "pending",
        progress: systemHealth ? 100 : syncProgress.health,
        rate: systemHealth ? `${systemHealth.database.responseTime}ms` : "N/A",
        lastUpdate: systemHealth ? "Live" : "Checking...",
        health: systemHealth?.database.status || "unknown",
      },
      {
        source: "Real-time Events",
        status: realtimeConnected ? "connected" : "disconnected",
        progress: realtimeConnected ? 100 : 0,
        rate: systemHealth
          ? `${systemHealth.realtime.channels} channels`
          : "0 channels",
        lastUpdate: realtimeConnected ? "Connected" : "Disconnected",
        health: systemHealth?.realtime.status || "unknown",
      },
    ];

    return baseData;
  };

  const syncData = getSyncData();

  const getStatusColor = (status: string, health?: string) => {
    if (health === "down" || status === "disconnected")
      return "bg-red-100 text-red-800";
    if (health === "degraded") return "bg-orange-100 text-orange-800";

    switch (status) {
      case "completed":
      case "connected":
        return "bg-green-100 text-green-800";
      case "syncing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "error":
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string, health?: string) => {
    if (health === "down" || status === "disconnected")
      return <WifiOff className="h-4 w-4 text-red-600" />;

    switch (status) {
      case "completed":
      case "connected":
        return <Wifi className="h-4 w-4 text-green-600" />;
      case "syncing":
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
      case "disconnected":
        return <Zap className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Real-Time Data Sync Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSystemHealth}
              disabled={systemHealthLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${systemHealthLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            {realtimeConnected ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-200">
                <WifiOff className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-gray-600">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {syncData.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg transition-colors ${
                item.health === "down" || item.status === "disconnected"
                  ? "border-red-200 bg-red-50"
                  : item.health === "degraded"
                    ? "border-orange-200 bg-orange-50"
                    : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status, item.health)}
                  <div>
                    <h3 className="font-semibold">{item.source}</h3>
                    <p className="text-sm text-gray-500">
                      {item.source === "System Health"
                        ? `Response time: ${item.rate}`
                        : item.source === "Real-time Events"
                          ? item.rate
                          : `Sync rate: ${item.rate}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(item.status, item.health)}>
                    {item.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {item.lastUpdate}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span>{Math.round(item.progress)}%</span>
                </div>
                <Progress
                  value={item.progress}
                  className={`h-2 ${
                    item.health === "down" || item.status === "disconnected"
                      ? "[&>div]:bg-red-500"
                      : item.health === "degraded"
                        ? "[&>div]:bg-orange-500"
                        : item.status === "completed" ||
                            item.status === "connected"
                          ? "[&>div]:bg-green-500"
                          : item.status === "syncing"
                            ? "[&>div]:bg-blue-500"
                            : "[&>div]:bg-yellow-500"
                  }`}
                />
              </div>

              {item.health && item.health !== "healthy" && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  System health: {item.health}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeSyncMonitor;
