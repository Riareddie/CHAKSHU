
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const RealTimeAnalysis = () => {
  const [activeScans, setActiveScans] = useState(1247);
  const [threatsDetected, setThreatsDetected] = useState(23);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScans(prev => prev + Math.floor(Math.random() * 3));
      if (Math.random() > 0.8) {
        setThreatsDetected(prev => prev + 1);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const realtimeData = [
    { time: '14:30:45', action: 'SMS Pattern Analysis', status: 'analyzing', risk: 'medium' },
    { time: '14:30:43', action: 'Email Header Verification', status: 'completed', risk: 'low' },
    { time: '14:30:41', action: 'Phone Number Validation', status: 'threat_detected', risk: 'high' },
    { time: '14:30:39', action: 'URL Pattern Matching', status: 'completed', risk: 'low' },
    { time: '14:30:37', action: 'Social Media Cross-Check', status: 'analyzing', risk: 'medium' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzing': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'threat_detected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[risk as keyof typeof colors]}`;
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-Time Fraud Pattern Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI continuously monitors and analyzes patterns across multiple channels, 
          providing instant detection and classification of potential fraud attempts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeScans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{threatsDetected}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3</span> in last 5 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">847ms</div>
            <p className="text-xs text-muted-foreground">
              Average analysis time
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Live Analysis Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realtimeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <span className="font-mono text-sm text-gray-500">{item.time}</span>
                  <span className="font-medium">{item.action}</span>
                </div>
                <span className={getRiskBadge(item.risk)}>
                  {item.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RealTimeAnalysis;
