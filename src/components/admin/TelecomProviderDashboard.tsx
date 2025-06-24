
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Signal, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Activity
} from 'lucide-react';

const TelecomProviderDashboard = () => {
  const providers = [
    {
      name: 'Airtel',
      status: 'connected',
      apiHealth: 98,
      lastSync: '2 min ago',
      dataPoints: 45623,
      responseTime: '120ms',
      uptime: '99.9%'
    },
    {
      name: 'Jio',
      status: 'connected',
      apiHealth: 95,
      lastSync: '5 min ago',
      dataPoints: 38924,
      responseTime: '95ms',
      uptime: '99.7%'
    },
    {
      name: 'BSNL',
      status: 'warning',
      apiHealth: 78,
      lastSync: '2 hours ago',
      dataPoints: 12845,
      responseTime: '340ms',
      uptime: '98.2%'
    },
    {
      name: 'Vi (Vodafone Idea)',
      status: 'disconnected',
      apiHealth: 0,
      lastSync: '1 day ago',
      dataPoints: 0,
      responseTime: 'N/A',
      uptime: '0%'
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
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Telecom Provider API Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Signal className="h-6 w-6 text-india-saffron" />
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-gray-500">API Integration</p>
                    </div>
                  </div>
                  {getStatusIcon(provider.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status</span>
                    <div className="mt-1">
                      <Badge className={getStatusColor(provider.status)}>
                        {provider.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Health</span>
                    <div className="mt-1 font-medium">{provider.apiHealth}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Response Time</span>
                    <div className="mt-1 font-medium">{provider.responseTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Uptime</span>
                    <div className="mt-1 font-medium">{provider.uptime}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Health</span>
                    <span>{provider.apiHealth}%</span>
                  </div>
                  <Progress 
                    value={provider.apiHealth} 
                    className={`h-2 ${
                      provider.apiHealth >= 95 ? '[&>div]:bg-green-500' :
                      provider.apiHealth >= 80 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Wifi className="h-3 w-3 mr-1" />
                    Test API
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelecomProviderDashboard;
