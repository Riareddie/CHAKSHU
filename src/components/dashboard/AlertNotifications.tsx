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
import { useToast } from "@/hooks/use-toast";
import { Bell, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
  priority: "high" | "medium" | "low";
  read: boolean;
  actionUrl?: string;
}

const AlertNotifications = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "High Activity",
      message: "Increased fraud activity in your area",
      time: "1 hour ago",
      priority: "high",
      read: false,
      actionUrl: "/analytics",
    },
    {
      id: 2,
      type: "Report Update",
      message: "Your report RPT-001 has been resolved",
      time: "3 hours ago",
      priority: "medium",
      read: false,
      actionUrl: "/reports-management",
    },
    {
      id: 3,
      type: "New Pattern",
      message: "New phishing pattern detected",
      time: "1 day ago",
      priority: "medium",
      read: true,
      actionUrl: "/community",
    },
    {
      id: 4,
      type: "Security Alert",
      message: "Suspicious login attempt detected",
      time: "2 days ago",
      priority: "high",
      read: false,
    },
    {
      id: 5,
      type: "System Update",
      message: "New fraud detection features available",
      time: "3 days ago",
      priority: "low",
      read: true,
      actionUrl: "/ai-features",
    },
  ]);

  const handleDismissAlert = (alertId: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== alertId),
    );
    toast({
      title: "Alert Dismissed",
      description: "The alert has been removed from your notifications.",
    });
  };

  const handleMarkAsRead = (alertId: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert,
      ),
    );
  };

  const handleAlertClick = (alert: Alert) => {
    if (!alert.read) {
      handleMarkAsRead(alert.id);
    }

    if (alert.actionUrl) {
      navigate(alert.actionUrl);
      toast({
        title: "Navigating to " + alert.type,
        description: "Taking you to the relevant section.",
      });
    }
  };

  const handleViewAllNotifications = () => {
    navigate("/notifications/history");
    toast({
      title: "Opening Notifications",
      description: "Taking you to the full notifications page.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Notifications
          <Badge variant="secondary" className="ml-auto">
            {alerts.filter((alert) => !alert.read).length} new
          </Badge>
        </CardTitle>
        <CardDescription>Important updates and security alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-3 transition-all duration-200 ${
                !alert.read
                  ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              } ${alert.actionUrl ? "cursor-pointer hover:shadow-md" : ""}`}
              onClick={() => alert.actionUrl && handleAlertClick(alert)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(alert.priority)}>
                    <div className="flex items-center gap-1">
                      {alert.priority === "high" && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {alert.priority === "medium" && (
                        <Info className="h-3 w-3" />
                      )}
                      {alert.priority === "low" && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {alert.type}
                    </div>
                  </Badge>
                  {!alert.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismissAlert(alert.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <p className="text-sm text-gray-700 dark:text-white mb-2">
                {alert.message}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{alert.time}</span>
                {alert.actionUrl && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Click to view →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleViewAllNotifications}
        >
          <Bell className="h-4 w-4 mr-2" />
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlertNotifications;
