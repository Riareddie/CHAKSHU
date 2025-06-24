
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const PerformanceMetrics = () => {
  const metrics = [
    {
      title: "Average Response Time",
      value: "2.4 hours",
      change: "-15%",
      trend: "down",
      icon: Clock,
      description: "Time to initial response for fraud reports"
    },
    {
      title: "Resolution Rate",
      value: "78%",
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      description: "Percentage of cases successfully resolved"
    },
    {
      title: "Data Accuracy Score",
      value: "94%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      description: "Accuracy of reported fraud data"
    },
    {
      title: "Compliance Score",
      value: "96%",
      change: "+1%",
      trend: "up",
      icon: AlertTriangle,
      description: "Overall compliance with government requirements"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{metric.value}</h3>
                  <p className="text-sm font-medium text-gray-900">{metric.title}</p>
                  <p className="text-xs text-gray-600">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
