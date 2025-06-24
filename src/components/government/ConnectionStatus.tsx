
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Building, 
  Phone, 
  Users, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Settings 
} from "lucide-react";

interface ConnectionService {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'warning' | 'disconnected' | 'maintenance';
  lastSync: string;
  uptime: number;
  responseTime: number;
  dataPoints: number;
  endpoint: string;
  icon: any;
  region: string;
  contacts: {
    emergency: string;
    support: string;
    escalation: string;
  };
}

interface ConnectionStatusProps {
  connectionStats: any;
}

const ConnectionStatus = ({ connectionStats }: ConnectionStatusProps) => {
  const [services, setServices] = useState<ConnectionService[]>([
    {
      id: 'police-cyber',
      name: 'Police Cyber Crime Cells',
      type: 'Law Enforcement',
      status: 'connected',
      lastSync: '2 minutes ago',
      uptime: 99.2,
      responseTime: 250,
      dataPoints: 1234,
      endpoint: 'https://cybercrime.gov.in/api/v1/reports',
      icon: Shield,
      region: 'National',
      contacts: {
        emergency: '1930',
        support: '+91-11-26741182',
        escalation: 'cybercrime@gov.in'
      }
    },
    {
      id: 'trai',
      name: 'Telecom Regulatory Authority',
      type: 'Regulatory Body',
      status: 'connected',
      lastSync: '5 minutes ago',
      uptime: 98.7,
      responseTime: 180,
      dataPoints: 987,
      endpoint: 'https://trai.gov.in/api/fraud-reports',
      icon: Building,
      region: 'National',
      contacts: {
        emergency: '198',
        support: '+91-11-23230404',
        escalation: 'fraud@trai.gov.in'
      }
    },
    {
      id: 'banking-fraud',
      name: 'Banking Fraud Department',
      type: 'Financial Regulator',
      status: 'warning',
      lastSync: '2 hours ago',
      uptime: 85.3,
      responseTime: 450,
      dataPoints: 567,
      endpoint: 'https://rbi.gov.in/api/fraud-monitoring',
      icon: Building,
      region: 'National',
      contacts: {
        emergency: '14440',
        support: '+91-22-26572000',
        escalation: 'fraudmonitoring@rbi.org.in'
      }
    },
    {
      id: 'consumer-protection',
      name: 'Consumer Protection Agencies',
      type: 'Consumer Rights',
      status: 'connected',
      lastSync: '10 minutes ago',
      uptime: 96.8,
      responseTime: 320,
      dataPoints: 432,
      endpoint: 'https://consumerhelpline.gov.in/api/complaints',
      icon: Users,
      region: 'State & National',
      contacts: {
        emergency: '1915',
        support: '+91-11-23466715',
        escalation: 'complaints@consumerhelpline.gov.in'
      }
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastSync: Math.random() > 0.8 ? 'Just now' : service.lastSync,
        dataPoints: service.dataPoints + Math.floor(Math.random() * 5)
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleTestConnection = (serviceId: string) => {
    console.log('Testing connection for:', serviceId);
    // In a real implementation, this would test the actual connection
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'disconnected': return <X className="h-4 w-4 text-red-600" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return 'text-green-600';
    if (uptime >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime <= 200) return 'text-green-600';
    if (responseTime <= 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallHealth = services.reduce((acc, service) => acc + service.uptime, 0) / services.length;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health Overview
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getUptimeColor(overallHealth)}`}>
                {overallHealth.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Overall Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {services.filter(s => s.status === 'connected').length}
              </div>
              <p className="text-sm text-gray-600">Services Online</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {services.filter(s => s.status === 'warning').length}
              </div>
              <p className="text-sm text-gray-600">Issues Detected</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {services.reduce((acc, s) => acc + s.dataPoints, 0)}
              </div>
              <p className="text-sm text-gray-600">Data Points Today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-india-saffron" />
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-gray-600">{service.type} • {service.region}</p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(service.status)}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">Last sync: {service.lastSync}</span>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-lg font-bold ${getUptimeColor(service.uptime)}`}>
                      {service.uptime}%
                    </div>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${getResponseTimeColor(service.responseTime)}`}>
                      {service.responseTime}ms
                    </div>
                    <p className="text-xs text-gray-600">Response</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {service.dataPoints}
                    </div>
                    <p className="text-xs text-gray-600">Data Points</p>
                  </div>
                </div>

                {/* Connection Details */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Endpoint: </span>
                    <code className="text-xs bg-gray-100 px-1 rounded">{service.endpoint}</code>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Emergency Contacts</h4>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span>Helpline:</span>
                      <span className="font-medium">{service.contacts.emergency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span className="font-medium">{service.contacts.support}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escalation:</span>
                      <span className="font-medium">{service.contacts.escalation}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleTestConnection(service.id)}
                  >
                    Test Connection
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>

                {/* Service-specific alerts */}
                {service.status === 'warning' && (
                  <Alert className="border-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Connection Issues Detected:</strong> Experiencing intermittent connectivity. 
                      Reports may take longer to process.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={service.id} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{service.name}</div>
                <div className="flex-1">
                  <Progress 
                    value={service.uptime} 
                    className={`h-2 ${
                      service.uptime >= 99 ? '[&>div]:bg-green-500' :
                      service.uptime >= 95 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
                <div className="w-16 text-sm text-right">{service.uptime}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionStatus;
