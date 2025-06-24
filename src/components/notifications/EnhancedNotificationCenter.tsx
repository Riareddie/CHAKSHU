import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  BellRing,
  Check,
  X,
  CheckCheck,
  Eye,
  Settings,
  AlertTriangle,
  Info,
  Shield,
  MessageSquare,
  Trash2,
  Filter,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type:
    | "report_status"
    | "community_alert"
    | "system_announcement"
    | "fraud_warning";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "critical";
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  report_status: boolean;
  community_alert: boolean;
  system_announcement: boolean;
  fraud_warning: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
}

const EnhancedNotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    report_status: true,
    community_alert: true,
    system_announcement: true,
    fraud_warning: true,
    email_notifications: true,
    push_notifications: false,
    sound_enabled: true,
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "high_priority">(
    "all",
  );
  const { toast } = useToast();

  // Generate sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: "fraud_warning",
        title: "High-Priority Fraud Alert",
        message:
          "New UPI fraud pattern detected in your area. Be cautious of requests asking for OTP verification.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        priority: "critical",
        actionUrl: "/education#fraud-alerts",
      },
      {
        id: "2",
        type: "report_status",
        title: "Report Update",
        message:
          "Your fraud report #FR-2024-123456 has been reviewed and forwarded to authorities.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        priority: "high",
        actionUrl: "/reports",
      },
      {
        id: "3",
        type: "community_alert",
        title: "Community Alert",
        message:
          "New discussion about WhatsApp scams in your region. 25 people have joined the conversation.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false,
        priority: "medium",
        actionUrl: "/community",
      },
      {
        id: "4",
        type: "system_announcement",
        title: "System Maintenance",
        message:
          "The portal will undergo maintenance tonight from 2:00 AM to 4:00 AM IST.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        priority: "low",
      },
      {
        id: "5",
        type: "report_status",
        title: "Action Taken",
        message:
          "The phone number you reported has been blocked by telecom authorities.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isRead: true,
        priority: "high",
        actionUrl: "/reports",
      },
    ];
    setNotifications(sampleNotifications);

    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("notification-preferences");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
      }
    }
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (5% chance every 30 seconds)
      if (Math.random() < 0.05) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["report_status", "community_alert", "fraud_warning"][
            Math.floor(Math.random() * 3)
          ] as any,
          title: "New Alert",
          message:
            "This is a real-time notification to demonstrate the live update feature.",
          timestamp: new Date(),
          isRead: false,
          priority: ["medium", "high"][Math.floor(Math.random() * 2)] as any,
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Show toast for new notification
        if (preferences.sound_enabled) {
          // In a real app, you would play a notification sound here
          console.log("🔔 Notification sound");
        }

        toast({
          title: "New Notification",
          description: newNotification.message,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [preferences.sound_enabled, toast]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(
      "notification-preferences",
      JSON.stringify(preferences),
    );
  }, [preferences]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "fraud_warning":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "report_status":
        return <Shield className="h-5 w-5 text-blue-500" />;
      case "community_alert":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "system_announcement":
        return <Info className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: Notification["priority"]) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };

    return (
      <Badge variant="secondary" className={variants[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications updated`,
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "Your notification inbox is now empty",
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.isRead;
      case "high_priority":
        return (
          notification.priority === "high" ||
          notification.priority === "critical"
        );
      default:
        return true;
    }
  });

  const updatePreference = (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          {unreadCount > 0 ? (
            <BellRing className="h-6 w-6 text-india-saffron" />
          ) : (
            <Bell className="h-6 w-6 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary">{unreadCount} new</Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className="h-7 text-xs"
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("unread")}
                className="h-7 text-xs"
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === "high_priority" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("high_priority")}
                className="h-7 text-xs"
              >
                Priority (
                {
                  notifications.filter(
                    (n) => n.priority === "high" || n.priority === "critical",
                  ).length
                }
                )
              </Button>
            </div>
          </CardHeader>

          {/* Preferences Panel */}
          {showPreferences && (
            <CardContent className="border-t bg-gray-50 p-4">
              <h4 className="font-medium text-sm mb-3">
                Notification Preferences
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="report-status" className="text-sm">
                    Report Status Updates
                  </Label>
                  <Switch
                    id="report-status"
                    checked={preferences.report_status}
                    onCheckedChange={(value) =>
                      updatePreference("report_status", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="community-alerts" className="text-sm">
                    Community Alerts
                  </Label>
                  <Switch
                    id="community-alerts"
                    checked={preferences.community_alert}
                    onCheckedChange={(value) =>
                      updatePreference("community_alert", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="fraud-warnings" className="text-sm">
                    Fraud Warnings
                  </Label>
                  <Switch
                    id="fraud-warnings"
                    checked={preferences.fraud_warning}
                    onCheckedChange={(value) =>
                      updatePreference("fraud_warning", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-announcements" className="text-sm">
                    System Announcements
                  </Label>
                  <Switch
                    id="system-announcements"
                    checked={preferences.system_announcement}
                    onCheckedChange={(value) =>
                      updatePreference("system_announcement", value)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled" className="text-sm">
                    Sound Notifications
                  </Label>
                  <Switch
                    id="sound-enabled"
                    checked={preferences.sound_enabled}
                    onCheckedChange={(value) =>
                      updatePreference("sound_enabled", value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          )}

          <CardContent className="p-0">
            {/* Action buttons */}
            {!showPreferences && notifications.length > 0 && (
              <div className="px-4 py-2 border-b bg-gray-50 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
            )}

            {/* Notifications list */}
            <ScrollArea className="h-96">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">
                    {filter === "all"
                      ? "No notifications yet"
                      : filter === "unread"
                        ? "No unread notifications"
                        : "No high priority notifications"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {getPriorityBadge(notification.priority)}
                          </div>

                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </span>

                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                title="Delete notification"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs mt-1 text-india-saffron"
                              onClick={() => {
                                markAsRead(notification.id);
                                // In a real app, you would navigate to the URL
                                console.log(
                                  "Navigate to:",
                                  notification.actionUrl,
                                );
                              }}
                            >
                              View Details →
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t p-3 text-center">
                <Button
                  variant="link"
                  size="sm"
                  className="text-india-saffron"
                  onClick={() => {
                    console.log("Navigate to notification history");
                    // In a real app, navigate to /notifications/history
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default EnhancedNotificationCenter;
