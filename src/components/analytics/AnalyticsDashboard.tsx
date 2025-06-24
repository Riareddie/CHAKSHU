
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PersonalImpactDashboard from './PersonalImpactDashboard';
import CommunityStatistics from './CommunityStatistics';
import ComparativeAnalytics from './ComparativeAnalytics';
import ExportableReports from './ExportableReports';
import PredictiveAnalytics from './PredictiveAnalytics';
import { BarChart3, TrendingUp, Globe, Download, AlertTriangle } from "lucide-react";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into fraud patterns and your impact</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
          <TabsTrigger value="comparative" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Comparative</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Predictive</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalImpactDashboard />
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <CommunityStatistics />
        </TabsContent>

        <TabsContent value="comparative" className="mt-6">
          <ComparativeAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ExportableReports />
        </TabsContent>

        <TabsContent value="predictive" className="mt-6">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
