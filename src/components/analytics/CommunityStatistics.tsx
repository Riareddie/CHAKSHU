
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Globe, TrendingUp, MapPin, Calendar } from "lucide-react";

const CommunityStatistics = () => {
  const [realTimeData, setRealTimeData] = useState({
    totalReports: 15234,
    activeUsers: 1847,
    fraudPrevented: 2846352,
    lastUpdate: new Date()
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalReports: prev.totalReports + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const topFraudCategories = [
    { category: 'Phishing Emails', reports: 3456, percentage: 23 },
    { category: 'Investment Scams', reports: 2891, percentage: 19 },
    { category: 'Identity Theft', reports: 2234, percentage: 15 },
    { category: 'Online Shopping', reports: 1876, percentage: 12 },
    { category: 'Romance Scams', reports: 1543, percentage: 10 },
    { category: 'Tech Support', reports: 1234, percentage: 8 },
    { category: 'Other', reports: 2000, percentage: 13 }
  ];

  const monthlyTrends = [
    { month: 'Jan', reports: 1200, resolved: 950 },
    { month: 'Feb', reports: 1350, resolved: 1080 },
    { month: 'Mar', reports: 1100, resolved: 920 },
    { month: 'Apr', reports: 1650, resolved: 1320 },
    { month: 'May', reports: 1450, resolved: 1200 },
    { month: 'Jun', reports: 1750, resolved: 1450 }
  ];

  const fraudHotspots = [
    { state: 'Maharashtra', reports: 2456, risk: 'high' },
    { state: 'Karnataka', reports: 2134, risk: 'high' },
    { state: 'Delhi', reports: 1987, risk: 'medium' },
    { state: 'Tamil Nadu', reports: 1654, risk: 'medium' },
    { state: 'Telangana', reports: 1432, risk: 'medium' },
    { state: 'Gujarat', reports: 1123, risk: 'low' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{realTimeData.totalReports.toLocaleString()}</h3>
              <p className="text-sm font-medium text-gray-700">Total Reports</p>
              <p className="text-xs text-gray-500">Updated {realTimeData.lastUpdate.toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <Badge variant="secondary">Live</Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{realTimeData.activeUsers.toLocaleString()}</h3>
              <p className="text-sm font-medium text-gray-700">Active Users</p>
              <p className="text-xs text-gray-500">Online now</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-8 w-8 text-purple-600" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">₹{(realTimeData.fraudPrevented / 100000).toFixed(1)}L</h3>
              <p className="text-sm font-medium text-gray-700">Fraud Prevented</p>
              <p className="text-xs text-gray-500">Estimated savings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">89%</h3>
              <p className="text-sm font-medium text-gray-700">Resolution Rate</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Categories Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Fraud Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topFraudCategories} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Reports']} />
              <Bar dataKey="reports" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Reports"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fraud Hotspots */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Hotspots by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fraudHotspots.map((hotspot, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{hotspot.state}</p>
                      <p className="text-sm text-gray-500">{hotspot.reports.toLocaleString()} reports</p>
                    </div>
                  </div>
                  <Badge className={getRiskColor(hotspot.risk)}>
                    {hotspot.risk} risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Fraud Attempts Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Fraud Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-medium">Interactive Map</p>
              <p className="text-sm text-gray-500">Real-time fraud attempt visualization would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStatistics;
