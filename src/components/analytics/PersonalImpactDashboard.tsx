
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, Clock, Users } from "lucide-react";

const PersonalImpactDashboard = () => {
  const reportsOverTime = [
    { month: 'Jan', reports: 3 },
    { month: 'Feb', reports: 5 },
    { month: 'Mar', reports: 2 },
    { month: 'Apr', reports: 8 },
    { month: 'May', reports: 4 },
    { month: 'Jun', reports: 6 }
  ];

  const fraudTypes = [
    { name: 'Phishing', value: 45, color: '#ef4444' },
    { name: 'Investment Scam', value: 25, color: '#f97316' },
    { name: 'Identity Theft', value: 20, color: '#eab308' },
    { name: 'Online Shopping', value: 10, color: '#22c55e' }
  ];

  const impactStats = [
    {
      title: "Total Reports Submitted",
      value: "28",
      change: "+12%",
      trend: "up",
      icon: Shield,
      description: "Reports submitted this year"
    },
    {
      title: "Resolution Success Rate",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      description: "Of your reports were resolved"
    },
    {
      title: "Average Response Time",
      value: "2.4 hrs",
      change: "-15%",
      trend: "down",
      icon: Clock,
      description: "Faster than average"
    },
    {
      title: "People Helped",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: Users,
      description: "Estimated people protected by your reports"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-700">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports Submitted Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types of Fraud Encountered</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fraudTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fraudTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { status: 'Resolved', count: 22, total: 28, color: 'bg-green-500' },
            { status: 'Under Investigation', count: 4, total: 28, color: 'bg-yellow-500' },
            { status: 'Pending', count: 2, total: 28, color: 'bg-gray-500' }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.status}</span>
                <span className="text-gray-500">{item.count}/{item.total}</span>
              </div>
              <Progress 
                value={(item.count / item.total) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Community Contribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time saved for others</span>
                  <span className="font-medium">~47 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Potential fraud prevented</span>
                  <span className="font-medium">₹2,34,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Community ranking</span>
                  <span className="font-medium">Top 15%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Recognition</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fraud Fighter</p>
                    <p className="text-xs text-gray-500">10+ reports submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🛡️
                  </div>
                  <div>
                    <p className="text-sm font-medium">Community Guardian</p>
                    <p className="text-xs text-gray-500">Helped 100+ people</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalImpactDashboard;
