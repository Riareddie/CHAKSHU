
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  Database 
} from 'lucide-react';

const RealTimeSyncMonitor = () => {
  const [syncData, setSyncData] = useState([
    {
      source: 'Fraud Reports',
      status: 'syncing',
      progress: 85,
      rate: '1.2k/min',
      lastUpdate: 'Just now'
    },
    {
      source: 'User Data',
      status: 'completed',
      progress: 100,
      rate: '450/min',
      lastUpdate: '2 sec ago'
    },
    {
      source: 'Telecom Logs',
      status: 'syncing',
      progress: 67,
      rate: '890/min',
      lastUpdate: '1 sec ago'
    },
    {
      source: 'Bank Transactions',
      status: 'pending',
      progress: 0,
      rate: '0/min',
      lastUpdate: '5 min ago'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncData(prev => prev.map(item => {
        if (item.status === 'syncing' && item.progress < 100) {
          return {
            ...item,
            progress: Math.min(item.progress + Math.random() * 5, 100),
            lastUpdate: 'Just now'
          };
        }
        return item;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Database className="h-4 w-4 text-green-600" />;
      case 'syncing': return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error': return <Zap className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Real-Time Data Sync Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {syncData.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h3 className="font-semibold">{item.source}</h3>
                    <p className="text-sm text-gray-500">Sync rate: {item.rate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.lastUpdate}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(item.progress)}%</span>
                </div>
                <Progress 
                  value={item.progress} 
                  className={`h-2 ${
                    item.status === 'completed' ? '[&>div]:bg-green-500' :
                    item.status === 'syncing' ? '[&>div]:bg-blue-500' :
                    item.status === 'pending' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeSyncMonitor;
