
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MapPin, Users, TrendingUp, Calendar } from "lucide-react";

const ComparativeAnalytics = () => {
  const regionalComparison = [
    { region: 'Your Area (Mumbai)', fraud: 45, national: 52, difference: -7 },
    { region: 'Delhi NCR', fraud: 58, national: 52, difference: 6 },
    { region: 'Bangalore', fraud: 41, national: 52, difference: -11 },
    { region: 'Chennai', fraud: 49, national: 52, difference: -3 },
    { region: 'Hyderabad', fraud: 38, national: 52, difference: -14 },
    { region: 'Pune', fraud: 44, national: 52, difference: -8 }
  ];

  const demographicPatterns = [
    { ageGroup: '18-25', male: 34, female: 28, total: 31 },
    { ageGroup: '26-35', male: 42, female: 38, total: 40 },
    { ageGroup: '36-45', male: 38, female: 35, total: 36.5 },
    { ageGroup: '46-55', male: 29, female: 32, total: 30.5 },
    { ageGroup: '56+', male: 21, female: 25, total: 23 }
  ];

  const seasonalTrends = [
    { month: 'Jan', current: 1200, previous: 1100, prediction: 1350 },
    { month: 'Feb', current: 1350, previous: 1250, prediction: 1400 },
    { month: 'Mar', current: 1100, previous: 1300, prediction: 1200 },
    { month: 'Apr', current: 1650, previous: 1450, prediction: 1700 },
    { month: 'May', current: 1450, previous: 1380, prediction: 1500 },
    { month: 'Jun', current: 1750, previous: 1600, prediction: 1800 }
  ];

  const deviceVulnerability = [
    { platform: 'Mobile Apps', incidents: 3456, percentage: 45, risk: 'high' },
    { platform: 'Web Browsers', incidents: 2891, percentage: 38, risk: 'medium' },
    { platform: 'Email Clients', incidents: 1234, percentage: 16, risk: 'low' },
    { platform: 'SMS/Text', incidents: 123, percentage: 1, risk: 'low' }
  ];

  const yourStats = {
    reportsSubmitted: 28,
    successRate: 78,
    avgResponseTime: 2.4,
    communityRanking: 15
  };

  const nationalAverage = {
    reportsSubmitted: 12,
    successRate: 65,
    avgResponseTime: 4.2,
    communityRanking: 50
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComparisonColor = (yours: number, average: number) => {
    return yours > average ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Your Performance vs National Average */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Performance vs National Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reports Submitted</span>
                <span className={`text-sm font-bold ${getComparisonColor(yourStats.reportsSubmitted, nationalAverage.reportsSubmitted)}`}>
                  {yourStats.reportsSubmitted > nationalAverage.reportsSubmitted ? '+' : ''}
                  {((yourStats.reportsSubmitted - nationalAverage.reportsSubmitted) / nationalAverage.reportsSubmitted * 100).toFixed(0)}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>You: {yourStats.reportsSubmitted}</span>
                  <span>Average: {nationalAverage.reportsSubmitted}</span>
                </div>
                <Progress value={(yourStats.reportsSubmitted / 50) * 100} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Success Rate</span>
                <span className={`text-sm font-bold ${getComparisonColor(yourStats.successRate, nationalAverage.successRate)}`}>
                  {yourStats.successRate > nationalAverage.successRate ? '+' : ''}
                  {yourStats.successRate - nationalAverage.successRate}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>You: {yourStats.successRate}%</span>
                  <span>Average: {nationalAverage.successRate}%</span>
                </div>
                <Progress value={yourStats.successRate} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Response Time</span>
                <span className={`text-sm font-bold ${getComparisonColor(nationalAverage.avgResponseTime, yourStats.avgResponseTime)}`}>
                  {yourStats.avgResponseTime < nationalAverage.avgResponseTime ? '' : '+'}
                  {(yourStats.avgResponseTime - nationalAverage.avgResponseTime).toFixed(1)}h
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>You: {yourStats.avgResponseTime}h</span>
                  <span>Average: {nationalAverage.avgResponseTime}h</span>
                </div>
                <Progress value={(1 - yourStats.avgResponseTime / 10) * 100} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Community Ranking</span>
                <span className={`text-sm font-bold ${getComparisonColor(nationalAverage.communityRanking, yourStats.communityRanking)}`}>
                  Top {yourStats.communityRanking}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>You: Top {yourStats.communityRanking}%</span>
                  <span>Average: Top {nationalAverage.communityRanking}%</span>
                </div>
                <Progress value={100 - yourStats.communityRanking} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Regional Fraud Rates (per 1000 people)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fraud" fill="#ef4444" name="Regional Rate" />
              <Bar dataKey="national" fill="#94a3b8" name="National Average" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographic Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Fraud by Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographicPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="male" fill="#3b82f6" name="Male" />
                <Bar dataKey="female" fill="#ec4899" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Seasonal Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seasonal Fraud Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="current" stroke="#22c55e" strokeWidth={3} name="2024" />
                <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={2} name="2023" />
                <Line type="monotone" dataKey="prediction" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device/Platform Vulnerability */}
      <Card>
        <CardHeader>
          <CardTitle>Device & Platform Vulnerability Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceVulnerability.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.platform}</h4>
                    <p className="text-sm text-gray-600">{item.incidents.toLocaleString()} incidents</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">{item.percentage}%</p>
                    <p className="text-xs text-gray-500">of total incidents</p>
                  </div>
                  <Badge className={getRiskColor(item.risk)}>
                    {item.risk} risk
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

export default ComparativeAnalytics;
