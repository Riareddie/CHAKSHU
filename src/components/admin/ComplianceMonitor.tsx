
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye
} from 'lucide-react';

const ComplianceMonitor = () => {
  const complianceChecks = [
    {
      name: 'Data Privacy (GDPR)',
      status: 'compliant',
      score: 98,
      lastCheck: '2 hours ago',
      requirements: 15,
      completed: 15
    },
    {
      name: 'Data Retention Policy',
      status: 'compliant',
      score: 95,
      lastCheck: '1 day ago',
      requirements: 8,
      completed: 8
    },
    {
      name: 'User Consent Management',
      status: 'warning',
      score: 85,
      lastCheck: '6 hours ago',
      requirements: 12,
      completed: 10
    },
    {
      name: 'Cross-border Data Transfer',
      status: 'compliant',
      score: 92,
      lastCheck: '4 hours ago',
      requirements: 6,
      completed: 6
    }
  ];

  const privacyMetrics = [
    {
      metric: 'Data Subjects Processed',
      value: '2.4M',
      trend: '+5.2%',
      icon: Users
    },
    {
      metric: 'Consent Rate',
      value: '94.2%',
      trend: '+2.1%',
      icon: CheckCircle
    },
    {
      metric: 'Data Retention Compliance',
      value: '98.7%',
      trend: '+0.5%',
      icon: Clock
    },
    {
      metric: 'Privacy Requests Processed',
      value: '847',
      trend: '+12.3%',
      icon: FileText
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'non_compliant': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {privacyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-india-saffron" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-green-600">{metric.trend}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">{metric.metric}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Compliance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Data Privacy Compliance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {complianceChecks.map((check, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <h3 className="font-semibold">{check.name}</h3>
                      <p className="text-sm text-gray-500">
                        {check.completed}/{check.requirements} requirements met
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(check.status)}>
                      {check.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">{check.lastCheck}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Score</span>
                    <span className="font-medium">{check.score}%</span>
                  </div>
                  <Progress 
                    value={check.score} 
                    className={`h-2 ${
                      check.score >= 95 ? '[&>div]:bg-green-500' :
                      check.score >= 80 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    Generate Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <Alert className="border-yellow-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex justify-between items-center">
            <span>User consent management requires attention - 2 outstanding consent requests</span>
            <Button size="sm" variant="outline">
              Review Now
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ComplianceMonitor;
