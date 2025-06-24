
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  AlertTriangle, 
  CheckCircle,
  Activity
} from 'lucide-react';

const SystemHealthMonitoring = () => {
  const systemMetrics = [
    {
      name: 'CPU Usage',
      value: 45,
      status: 'good',
      icon: Cpu,
      unit: '%'
    },
    {
      name: 'Memory Usage',
      value: 67,
      status: 'warning',
      icon: MemoryStick,
      unit: '%'
    },
    {
      name: 'Disk Usage',
      value: 23,
      status: 'good',
      icon: HardDrive,
      unit: '%'
    },
    {
      name: 'Network Latency',
      value: 45,
      status: 'good',
      icon: Wifi,
      unit: 'ms'
    }
  ];

  const services = [
    {
      name: 'Web Server',
      status: 'online',
      uptime: '99.9%',
      lastCheck: '2 minutes ago',
      responseTime: '120ms'
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      lastCheck: '1 minute ago',
      responseTime: '45ms'
    },
    {
      name: 'Email Service',
      status: 'online',
      uptime: '99.5%',
      lastCheck: '3 minutes ago',
      responseTime: '340ms'
    },
    {
      name: 'SMS Gateway',
      status: 'warning',
      uptime: '98.2%',
      lastCheck: '5 minutes ago',
      responseTime: '2.3s'
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '99.9%',
      lastCheck: '1 minute ago',
      responseTime: '89ms'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'High memory usage detected on server-02',
      timestamp: '5 minutes ago'
    },
    {
      type: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '2 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} className={alert.type === 'warning' ? 'border-yellow-200' : 'border-blue-200'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <span className="text-sm text-gray-500">{alert.timestamp}</span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${getMetricColor(metric.status)}`} />
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <span className={`text-lg font-bold ${getMetricColor(metric.status)}`}>
                      {metric.value}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-2 ${
                      metric.status === 'warning' ? '[&>div]:bg-yellow-500' : 
                      metric.status === 'critical' ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">
                      Uptime: {service.uptime} • Response: {service.responseTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{service.lastCheck}</span>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthMonitoring;
