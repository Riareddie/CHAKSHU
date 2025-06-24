
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Phone, 
  Mail, 
  Shield, 
  Smartphone, 
  Database, 
  Cloud, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  X 
} from 'lucide-react';

const IntegrationStatus = () => {
  const integrations = [
    {
      name: 'Airtel Integration',
      type: 'Telecom Provider',
      status: 'connected',
      lastSync: '2 minutes ago',
      dataPoints: 45623,
      icon: Phone,
      health: 98,
      description: 'Real-time fraud report synchronization'
    },
    {
      name: 'Jio Integration',
      type: 'Telecom Provider',
      status: 'connected',
      lastSync: '5 minutes ago',
      dataPoints: 38924,
      icon: Phone,
      health: 95,
      description: 'SMS and call fraud detection'
    },
    {
      name: 'BSNL Integration',
      type: 'Telecom Provider',
      status: 'warning',
      lastSync: '2 hours ago',
      dataPoints: 12845,
      icon: Phone,
      health: 78,
      description: 'Limited connectivity issues detected'
    },
    {
      name: 'Vi Integration',
      type: 'Telecom Provider',
      status: 'disconnected',
      lastSync: '1 day ago',
      dataPoints: 0,
      icon: Phone,
      health: 0,
      description: 'Connection timeout - needs attention'
    },
    {
      name: 'Email Gateway',
      type: 'Communication',
      status: 'connected',
      lastSync: '1 minute ago',
      dataPoints: 2834,
      icon: Mail,
      health: 99,
      description: 'Notification and alert delivery'
    },
    {
      name: 'SMS Gateway',
      type: 'Communication',
      status: 'connected',
      lastSync: '3 minutes ago',
      dataPoints: 1567,
      icon: Smartphone,
      health: 94,
      description: 'OTP and alert SMS delivery'
    },
    {
      name: 'Government Database',
      type: 'Data Source',
      status: 'connected',
      lastSync: '10 minutes ago',
      dataPoints: 67890,
      icon: Database,
      health: 97,
      description: 'Citizen verification and cross-reference'
    },
    {
      name: 'Bank API Integration',
      type: 'Financial',
      status: 'connected',
      lastSync: '15 minutes ago',
      dataPoints: 23456,
      icon: Shield,
      health: 96,
      description: 'Transaction fraud verification'
    },
    {
      name: 'Cloud Storage',
      type: 'Infrastructure',
      status: 'connected',
      lastSync: 'Real-time',
      dataPoints: 156789,
      icon: Cloud,
      health: 99,
      description: 'Document and evidence storage'
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
      case 'disconnected': return <X className="h-4 w-4 text-red-600" />;
      default: return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600';
    if (health >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const warningCount = integrations.filter(i => i.status === 'warning').length;
  const disconnectedCount = integrations.filter(i => i.status === 'disconnected').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
            <p className="text-sm text-gray-600">Connected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-sm text-gray-600">Warning</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{disconnectedCount}</div>
            <p className="text-sm text-gray-600">Disconnected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{integrations.length}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <Card key={index} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-india-saffron" />
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.type}</p>
                        </div>
                      </div>
                      {getStatusIcon(integration.status)}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status</span>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Health</span>
                          <span className={`text-sm font-medium ${getHealthColor(integration.health)}`}>
                            {integration.health}%
                          </span>
                        </div>
                        <Progress 
                          value={integration.health} 
                          className={`h-2 ${
                            integration.health >= 95 ? '[&>div]:bg-green-500' :
                            integration.health >= 80 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Last Sync</span>
                          <span className="text-sm text-gray-600">{integration.lastSync}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Data Points</span>
                          <span className="text-sm font-medium">{integration.dataPoints.toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">{integration.description}</p>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        {integration.status === 'disconnected' && (
                          <Button size="sm" className="flex-1 bg-india-saffron hover:bg-saffron-600">
                            Reconnect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationStatus;
