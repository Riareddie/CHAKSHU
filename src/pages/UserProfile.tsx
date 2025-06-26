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
        <div className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
            {/* Profile Header */}
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                User Profile
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl">
                Manage your account settings, security preferences, and view
                your activity. Keep your information up to date for the best
                experience.
              </p>
            </div>

            {/* Profile Stats Overview */}
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <ProfileStats />
            </div>

            {/* Main Profile Content */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Responsive Tabs Navigation */}
              <div className="w-full mb-6 sm:mb-8">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="inline-flex w-full min-w-max sm:w-auto sm:grid sm:grid-cols-3 lg:grid-cols-6 bg-white border border-gray-200 rounded-lg p-1">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base min-w-0 whitespace-nowrap transition-all duration-200"
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="account"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base min-w-0 whitespace-nowrap transition-all duration-200"
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">
                        Account
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base min-w-0 whitespace-nowrap transition-all duration-200"
                    >
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">
                        Security
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="privacy"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base min-w-0 whitespace-nowrap transition-all duration-200"
                    >
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">
                        Privacy
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base min-w-0 whitespace-nowrap transition-all duration-200"
                    >
                      <Bell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">
                        Notifications
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base min-w-0 whitespace-nowrap transition-all duration-200"
                    >
                      <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">
                        Activity
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6 w-full">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  <ProfileOverview />
                </TabsContent>

                <TabsContent value="account" className="mt-0 space-y-6">
                  <AccountSettings />
                </TabsContent>

                <TabsContent value="security" className="mt-0 space-y-6">
                  <SecuritySettings />
                </TabsContent>

                <TabsContent value="privacy" className="mt-0 space-y-6">
                  <PrivacySettings />
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 space-y-6">
                  <NotificationPreferences />
                </TabsContent>

                <TabsContent value="activity" className="mt-0 space-y-6">
                  <ActivityHistory />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </AuthGuard>
    </div>
  );
};

export default UserProfile;
