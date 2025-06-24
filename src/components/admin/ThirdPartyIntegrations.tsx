
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Database, 
  Shield, 
  Building, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Settings 
} from 'lucide-react';

const ThirdPartyIntegrations = () => {
  const integrations = [
    {
      name: 'Government Database',
      type: 'Data Source',
      status: 'connected',
      description: 'Citizen verification and cross-reference',
      lastSync: '10 min ago',
      dataPoints: 67890,
      icon: Database
    },
    {
      name: 'Social Media Monitor',
      type: 'Monitoring',
      status: 'connected',
      description: 'Real-time fraud pattern detection',
      lastSync: '2 min ago',
      dataPoints: 23456,
      icon: Globe
    },
    {
      name: 'Bank Fraud Database',
      type: 'Financial',
      status: 'connected',
      description: 'Transaction fraud verification',
      lastSync: '5 min ago',
      dataPoints: 45678,
      icon: Building
    },
    {
      name: 'Law Enforcement API',
      type: 'Reporting',
      status: 'warning',
      description: 'Case escalation and reporting',
      lastSync: '1 hour ago',
      dataPoints: 890,
      icon: Shield
    },
    {
      name: 'Privacy Compliance Tool',
      type: 'Compliance',
      status: 'connected',
      description: 'Data privacy and GDPR compliance',
      lastSync: '15 min ago',
      dataPoints: 12340,
      icon: Users
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Third-Party Service Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Icon className="h-8 w-8 text-india-saffron" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {integration.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Last sync: {integration.lastSync}</span>
                      <span>Data points: {integration.dataPoints.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration.status)}
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThirdPartyIntegrations;
