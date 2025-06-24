import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  User,
  Settings,
  Shield,
  Bell,
  Activity,
  Download,
  Upload,
  Edit,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Key,
  Smartphone,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";
import ProfileOverview from "@/components/profile/ProfileOverview";
import AccountSettings from "@/components/profile/AccountSettings";
import SecuritySettings from "@/components/profile/SecuritySettings";
import PrivacySettings from "@/components/profile/PrivacySettings";
import ActivityHistory from "@/components/profile/ActivityHistory";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import ProfileStats from "@/components/profile/ProfileStats";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <AuthGuard message="Please sign in to access your profile and manage your account settings.">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Profile
            </h1>
            <p className="text-gray-600">
              Manage your account settings, security preferences, and view your
              activity
            </p>
          </div>

          {/* Profile Stats Overview */}
          <ProfileStats />

          {/* Main Profile Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:flex">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <ProfileOverview />
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <PrivacySettings />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationPreferences />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ActivityHistory />
            </TabsContent>
          </Tabs>
        </div>
      </AuthGuard>
    </div>
  );
};

export default UserProfile;
