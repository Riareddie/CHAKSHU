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
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Database,
  Share2,
  Download,
  Trash2,
  AlertTriangle,
  Info,
} from "lucide-react";

const PrivacySettings = () => {
  const { toast } = useToast();

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessaging: true,
    shareDataForImprovement: true,
    analyticsOptIn: false,
    marketingEmails: false,
    activityTracking: true,
    searchAppearance: true,
    thirdPartySharing: false,
    dataRetention: "2years",
  });

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
    toast({
      title: "Privacy Setting Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleDataExport = () => {
    toast({
      title: "Data Export Requested",
      description:
        "Your data export will be ready within 24 hours. We'll send you a download link via email.",
    });
  };

  const handleDataDeletion = () => {
    toast({
      title: "Data Deletion Requested",
      description:
        "Your data deletion request has been submitted. This process may take up to 30 days.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Who can see your profile?</Label>
            <Select
              value={privacySettings.profileVisibility}
              onValueChange={(value) =>
                handleSettingChange("profileVisibility", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="members">Registered members only</SelectItem>
                <SelectItem value="private">Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Email Address</Label>
                <p className="text-sm text-gray-600">
                  Display your email on your public profile
                </p>
              </div>
              <Switch
                checked={privacySettings.showEmail}
                onCheckedChange={(checked) =>
                  handleSettingChange("showEmail", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Phone Number</Label>
                <p className="text-sm text-gray-600">
                  Display your phone number on your public profile
                </p>
              </div>
              <Switch
                checked={privacySettings.showPhone}
                onCheckedChange={(checked) =>
                  handleSettingChange("showPhone", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Location</Label>
                <p className="text-sm text-gray-600">
                  Display your city and state on your profile
                </p>
              </div>
              <Switch
                checked={privacySettings.showLocation}
                onCheckedChange={(checked) =>
                  handleSettingChange("showLocation", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Allow Direct Messaging</Label>
                <p className="text-sm text-gray-600">
                  Let other users send you private messages
                </p>
              </div>
              <Switch
                checked={privacySettings.allowMessaging}
                onCheckedChange={(checked) =>
                  handleSettingChange("allowMessaging", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Appear in Search Results</Label>
                <p className="text-sm text-gray-600">
                  Allow your profile to appear in user searches
                </p>
              </div>
              <Switch
                checked={privacySettings.searchAppearance}
                onCheckedChange={(checked) =>
                  handleSettingChange("searchAppearance", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Usage & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Usage & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Activity Tracking</Label>
                <p className="text-sm text-gray-600">
                  Track your activity to provide personalized recommendations
                </p>
              </div>
              <Switch
                checked={privacySettings.activityTracking}
                onCheckedChange={(checked) =>
                  handleSettingChange("activityTracking", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Analytics & Performance</Label>
                <p className="text-sm text-gray-600">
                  Help improve our services by sharing anonymous usage data
                </p>
              </div>
              <Switch
                checked={privacySettings.analyticsOptIn}
                onCheckedChange={(checked) =>
                  handleSettingChange("analyticsOptIn", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">
                  Share Data for Service Improvement
                </Label>
                <p className="text-sm text-gray-600">
                  Share anonymized data to help improve fraud detection
                </p>
              </div>
              <Switch
                checked={privacySettings.shareDataForImprovement}
                onCheckedChange={(checked) =>
                  handleSettingChange("shareDataForImprovement", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Third-party Data Sharing</Label>
                <p className="text-sm text-gray-600">
                  Allow sharing data with authorized government agencies for
                  fraud prevention
                </p>
              </div>
              <Switch
                checked={privacySettings.thirdPartySharing}
                onCheckedChange={(checked) =>
                  handleSettingChange("thirdPartySharing", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Communication Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-gray-600">
                  Receive emails about new features and fraud prevention tips
                </p>
              </div>
              <Switch
                checked={privacySettings.marketingEmails}
                onCheckedChange={(checked) =>
                  handleSettingChange("marketingEmails", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention Period</Label>
              <Select
                value={privacySettings.dataRetention}
                onValueChange={(value) =>
                  handleSettingChange("dataRetention", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                  <SelectItem value="indefinite">
                    Until account deletion
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                How long should we keep your data after account deletion?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  Data Protection Rights
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Under data protection laws, you have rights regarding your
                  personal data including:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Right to access your data</li>
                  <li>Right to correct inaccurate data</li>
                  <li>Right to delete your data</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Export Your Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                Download a copy of all your personal data stored in our system.
              </p>
              <Button
                variant="outline"
                onClick={handleDataExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Request Data Export
              </Button>
            </div>

            <div className="p-4 border border-red-200 rounded-lg">
              <h4 className="font-medium mb-2 text-red-800">
                Delete Your Data
              </h4>
              <p className="text-sm text-red-700 mb-3">
                Permanently delete all your personal data. This action cannot be
                undone and will close your account.
              </p>
              <Button
                variant="destructive"
                onClick={handleDataDeletion}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Request Data Deletion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Legal & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              View Privacy Policy
            </Button>
            <Button variant="outline" className="justify-start">
              View Terms of Service
            </Button>
            <Button variant="outline" className="justify-start">
              Cookie Settings
            </Button>
            <Button variant="outline" className="justify-start">
              Data Processing Agreement
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-2">
            <p>Last privacy policy update: December 15, 2024</p>
            <p>
              For privacy-related questions, contact: privacy@chakshu.gov.in
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
