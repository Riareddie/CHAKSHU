
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users, Shield } from "lucide-react";

const RegionalStats = () => {
  const regionalData = [
    {
      state: "Maharashtra",
      city: "Mumbai",
      totalReports: 2456,
      trend: "+12%",
      topScam: "UPI Fraud",
      resolved: 89
    },
    {
      state: "Delhi",
      city: "New Delhi",
      totalReports: 1834,
      trend: "+8%",
      topScam: "Investment Scam",
      resolved: 92
    },
    {
      state: "Karnataka",
      city: "Bangalore",
      totalReports: 1567,
      trend: "+15%",
      topScam: "Tech Support",
      resolved: 87
    },
    {
      state: "Tamil Nadu",
      city: "Chennai",
      totalReports: 1234,
      trend: "+6%",
      topScam: "Romance Scam",
      resolved: 91
    },
    {
      state: "West Bengal",
      city: "Kolkata",
      totalReports: 998,
      trend: "+9%",
      topScam: "Email Phishing",
      resolved: 85
    }
  ];

  const getTrendColor = (trend: string) => {
    const value = parseInt(trend.replace(/[^0-9]/g, ''));
    if (value >= 10) return "text-red-600";
    if (value >= 5) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
          <MapPin className="h-6 w-6 text-india-saffron mr-2" />
          Regional Fraud Statistics
        </CardTitle>
        <p className="text-gray-600">
          Fraud reports and trends across major Indian cities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {regionalData.map((region, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{region.city}</h4>
                <p className="text-sm text-gray-600">{region.state}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-india-saffron">
                  {region.totalReports.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className={`flex items-center justify-center ${getTrendColor(region.trend)}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {region.trend}
                </div>
                <div className="text-gray-600 text-xs">This month</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600">
                  <Shield className="h-3 w-3 mr-1" />
                  {region.resolved}%
                </div>
                <div className="text-gray-600 text-xs">Resolved</div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  {region.topScam}
                </Badge>
                <div className="text-gray-600 text-xs mt-1">Top threat</div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">National Overview</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">8,089 Total Reports</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">+10% This Month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalStats;
