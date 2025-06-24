import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  AlertTriangle,
  Clock,
  Volume2,
  VolumeX,
  Settings,
  TestTube,
} from "lucide-react";

const NotificationPreferences = () => {
  const { toast } = useToast();

  const [notificationSettings, setNotificationSettings] = useState({
    // Delivery Methods
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,

    // Notification Types
    fraudAlerts: true,
    reportUpdates: true,
    communityActivity: true,
    systemAnnouncements: true,
    marketingEmails: false,
    weeklyDigest: true,
    monthlyReport: true,

    // Timing & Frequency
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    frequency: "immediate",
    timezone: "Asia/Kolkata",

    // Priority Settings
    criticalAlertsOnly: false,
    soundEnabled: true,
    vibrationEnabled: true,
    soundVolume: [75],

    // Advanced Settings
    intelligentFiltering: true,
    duplicateFiltering: true,
    locationBasedAlerts: true,
  });

  const handleSettingChange = (
    setting: string,
    value: boolean | string | number[],
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }));
    toast({
      title: "Notification Setting Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleTestNotification = (type: string) => {
    toast({
      title: "Test Notification Sent",
      description: `A test ${type} notification has been sent to verify your settings.`,
    });
  };

  const notificationTypes = [
    {
      id: "fraudAlerts",
      title: "Fraud Alerts",
      description: "Critical fraud warnings and security alerts",
      icon: AlertTriangle,
      priority: "high",
      setting: notificationSettings.fraudAlerts,
    },
    {
      id: "reportUpdates",
      title: "Report Updates",
      description: "Status changes on your submitted reports",
      icon: Shield,
      priority: "medium",
      setting: notificationSettings.reportUpdates,
    },
    {
      id: "communityActivity",
      title: "Community Activity",
      description: "Replies, mentions, and community discussions",
      icon: MessageSquare,
      priority: "low",
      setting: notificationSettings.communityActivity,
    },
    {
      id: "systemAnnouncements",
      title: "System Announcements",
      description: "Platform updates and maintenance notices",
      icon: Bell,
      priority: "medium",
      setting: notificationSettings.systemAnnouncements,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Delivery Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestNotification("email")}
                  disabled={!notificationSettings.emailNotifications}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Browser and mobile app notifications
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("pushNotifications", checked)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestNotification("push")}
                  disabled={!notificationSettings.pushNotifications}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Critical alerts via text message
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("smsNotifications", checked)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestNotification("SMS")}
                  disabled={!notificationSettings.smsNotifications}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-500" />
                <div className="space-y-0.5">
                  <Label className="text-base">In-App Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Notifications within the application
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.inAppNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("inAppNotifications", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{type.title}</h4>
                      <Badge className={getPriorityColor(type.priority)}>
                        {type.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={type.setting}
                  onCheckedChange={(checked) =>
                    handleSettingChange(type.id, checked)
                  }
                />
              </div>
            );
          })}

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Digest</Label>
                <p className="text-sm text-gray-600">
                  Summary of your activity and community highlights
                </p>
              </div>
              <Switch
                checked={notificationSettings.weeklyDigest}
                onCheckedChange={(checked) =>
                  handleSettingChange("weeklyDigest", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Monthly Report</Label>
                <p className="text-sm text-gray-600">
                  Monthly fraud trends and prevention insights
                </p>
              </div>
              <Switch
                checked={notificationSettings.monthlyReport}
                onCheckedChange={(checked) =>
                  handleSettingChange("monthlyReport", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing & Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timing & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Quiet Hours</Label>
              <p className="text-sm text-gray-600">
                Pause non-critical notifications during these hours
              </p>
            </div>
            <Switch
              checked={notificationSettings.quietHoursEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("quietHoursEnabled", checked)
              }
            />
          </div>

          {notificationSettings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="quietStart">Start Time</Label>
                <Select
                  value={notificationSettings.quietHoursStart}
                  onValueChange={(value) =>
                    handleSettingChange("quietHoursStart", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietEnd">End Time</Label>
                <Select
                  value={notificationSettings.quietHoursEnd}
                  onValueChange={(value) =>
                    handleSettingChange("quietHoursEnd", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="frequency">Notification Frequency</Label>
            <Select
              value={notificationSettings.frequency}
              onValueChange={(value) => handleSettingChange("frequency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sound & Vibration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {notificationSettings.soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
            Sound & Vibration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sound Notifications</Label>
                <p className="text-sm text-gray-600">
                  Play sound for notifications
                </p>
              </div>
              <Switch
                checked={notificationSettings.soundEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("soundEnabled", checked)
                }
              />
            </div>

            {notificationSettings.soundEnabled && (
              <div className="space-y-3">
                <Label>Sound Volume</Label>
                <div className="px-3">
                  <Slider
                    value={notificationSettings.soundVolume}
                    onValueChange={(value) =>
                      handleSettingChange("soundVolume", value)
                    }
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Silent</span>
                    <span>{notificationSettings.soundVolume[0]}%</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Vibration</Label>
                <p className="text-sm text-gray-600">
                  Vibrate for mobile notifications
                </p>
              </div>
              <Switch
                checked={notificationSettings.vibrationEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("vibrationEnabled", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Critical Alerts Only</Label>
                <p className="text-sm text-gray-600">
                  Only receive high-priority fraud alerts
                </p>
              </div>
              <Switch
                checked={notificationSettings.criticalAlertsOnly}
                onCheckedChange={(checked) =>
                  handleSettingChange("criticalAlertsOnly", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Intelligent Filtering</Label>
                <p className="text-sm text-gray-600">
                  Use AI to filter relevant notifications
                </p>
              </div>
              <Switch
                checked={notificationSettings.intelligentFiltering}
                onCheckedChange={(checked) =>
                  handleSettingChange("intelligentFiltering", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Duplicate Filtering</Label>
                <p className="text-sm text-gray-600">
                  Prevent duplicate notifications for the same event
                </p>
              </div>
              <Switch
                checked={notificationSettings.duplicateFiltering}
                onCheckedChange={(checked) =>
                  handleSettingChange("duplicateFiltering", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Location-Based Alerts</Label>
                <p className="text-sm text-gray-600">
                  Receive alerts relevant to your location
                </p>
              </div>
              <Switch
                checked={notificationSettings.locationBasedAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("locationBasedAlerts", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;
