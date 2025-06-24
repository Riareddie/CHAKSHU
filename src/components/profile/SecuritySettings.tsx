import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Monitor,
  MapPin,
  Trash2,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

const SecuritySettings = () => {
  const { toast } = useToast();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    sessionTimeout: "30",
    requirePasswordForSensitiveActions: true,
    allowRememberDevice: true,
  });

  const [loginSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Mumbai, Maharashtra",
      ip: "192.168.1.100",
      lastActive: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      isCurrent: true,
    },
    {
      id: 2,
      device: "Mobile App on Android",
      location: "Mumbai, Maharashtra",
      ip: "192.168.1.101",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isCurrent: false,
    },
    {
      id: 3,
      device: "Safari on iPhone",
      location: "Pune, Maharashtra",
      ip: "203.192.1.45",
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isCurrent: false,
    },
  ]);

  const [securityActivity] = useState([
    {
      id: 1,
      type: "login",
      description: "Successful login from Chrome on Windows",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "success",
      location: "Mumbai, Maharashtra",
    },
    {
      id: 2,
      type: "password_change",
      description: "Password changed successfully",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      status: "success",
      location: "Mumbai, Maharashtra",
    },
    {
      id: 3,
      type: "suspicious",
      description: "Login attempt from unrecognized device blocked",
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      status: "blocked",
      location: "Unknown Location",
    },
  ]);

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would make an API call
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSecuritySettingChange = (
    setting: string,
    value: boolean | string,
  ) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
    toast({
      title: "Security Setting Updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleTerminateSession = (sessionId: number) => {
    toast({
      title: "Session Terminated",
      description: "The selected session has been terminated successfully.",
    });
  };

  const handleTerminateAllSessions = () => {
    toast({
      title: "All Sessions Terminated",
      description:
        "All other sessions have been terminated. You'll need to sign in again on other devices.",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "password_change":
        return <Key className="h-4 w-4 text-blue-500" />;
      case "suspicious":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("Mobile") || device.includes("iPhone")) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePasswordChange}
            className="bg-india-saffron hover:bg-saffron-600"
            disabled={
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
            {securitySettings.twoFactorEnabled && (
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) =>
                handleSecuritySettingChange("twoFactorEnabled", checked)
              }
            />
          </div>

          {securitySettings.twoFactorEnabled && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Two-Factor Authentication is Active
                </span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your account is protected with authenticator app-based 2FA.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Recovery Codes
                </Button>
                <Button variant="outline" size="sm">
                  Reconfigure
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Login Notifications</Label>
                <p className="text-sm text-gray-600">
                  Get notified when someone signs in to your account
                </p>
              </div>
              <Switch
                checked={securitySettings.loginNotifications}
                onCheckedChange={(checked) =>
                  handleSecuritySettingChange("loginNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Suspicious Activity Alerts</Label>
                <p className="text-sm text-gray-600">
                  Get alerted about unusual account activity
                </p>
              </div>
              <Switch
                checked={securitySettings.suspiciousActivityAlerts}
                onCheckedChange={(checked) =>
                  handleSecuritySettingChange(
                    "suspiciousActivityAlerts",
                    checked,
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">
                  Require Password for Sensitive Actions
                </Label>
                <p className="text-sm text-gray-600">
                  Ask for password when changing important settings
                </p>
              </div>
              <Switch
                checked={securitySettings.requirePasswordForSensitiveActions}
                onCheckedChange={(checked) =>
                  handleSecuritySettingChange(
                    "requirePasswordForSensitiveActions",
                    checked,
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Remember This Device</Label>
                <p className="text-sm text-gray-600">
                  Allow this device to be remembered for 30 days
                </p>
              </div>
              <Switch
                checked={securitySettings.allowRememberDevice}
                onCheckedChange={(checked) =>
                  handleSecuritySettingChange("allowRememberDevice", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTerminateAllSessions}
          >
            Terminate All Other Sessions
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getDeviceIcon(session.device)}
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {session.device}
                    {session.isCurrent && (
                      <Badge className="bg-green-100 text-green-800">
                        Current
                      </Badge>
                    )}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {session.ip}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last active {format(session.lastActive, "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Security Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 border rounded-lg"
            >
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <h4 className="font-medium">{activity.description}</h4>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(activity.timestamp, "MMM d, yyyy h:mm a")}
                  </div>
                </div>
              </div>
              <Badge
                className={
                  activity.status === "success"
                    ? "bg-green-100 text-green-800"
                    : activity.status === "blocked"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }
              >
                {activity.status}
              </Badge>
            </div>
          ))}

          <Button variant="outline" className="w-full mt-4">
            View All Security Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
