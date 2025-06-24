
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectionStatus from "@/components/government/ConnectionStatus";
import EscalationWorkflow from "@/components/government/EscalationWorkflow";
import GovernmentAdvisories from "@/components/government/GovernmentAdvisories";
import LegalActionTracker from "@/components/government/LegalActionTracker";
import ComplianceDashboard from "@/components/government/ComplianceDashboard";
import DataSharingAgreements from "@/components/government/DataSharingAgreements";
import PerformanceMetrics from "@/components/government/PerformanceMetrics";
import { Badge } from "@/components/ui/badge";
import { Shield, Building, Scale, FileText, BarChart, Link as LinkIcon, AlertTriangle } from "lucide-react";

const GovernmentIntegration = () => {
  const [connectionStats, setConnectionStats] = useState({
    police: 'connected',
    telecom: 'connected',
    banking: 'warning',
    consumer: 'connected'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Government Services Integration
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real-time integration with government agencies for seamless fraud reporting, 
            case escalation, and compliance monitoring.
          </p>
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Police Cyber Cells</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Telecom Authority</p>
                  <p className="text-2xl font-bold text-green-600">Connected</p>
                </div>
                <Building className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Banking Dept</p>
                  <p className="text-2xl font-bold text-yellow-600">Warning</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consumer Protection</p>
                  <p className="text-2xl font-bold text-green-600">Online</p>
                </div>
                <Scale className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Status</span>
            </TabsTrigger>
            <TabsTrigger value="escalation" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Escalation</span>
            </TabsTrigger>
            <TabsTrigger value="advisories" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Advisories</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Legal</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="agreements" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Agreements</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <ConnectionStatus connectionStats={connectionStats} />
          </TabsContent>

          <TabsContent value="escalation">
            <EscalationWorkflow />
          </TabsContent>

          <TabsContent value="advisories">
            <GovernmentAdvisories />
          </TabsContent>

          <TabsContent value="legal">
            <LegalActionTracker />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceDashboard />
          </TabsContent>

          <TabsContent value="agreements">
            <DataSharingAgreements />
          </TabsContent>

          <TabsContent value="metrics">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default GovernmentIntegration;
