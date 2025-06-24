
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MapPin } from "lucide-react";

const PublicFraudAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "Phishing",
      description: "Fake bank SMS asking for OTP verification",
      location: "Mumbai, Maharashtra",
      timeAgo: "2 hours ago",
      severity: "High",
      reports: 45
    },
    {
      id: 2,
      type: "Investment Scam",
      description: "Cryptocurrency investment scheme promising 300% returns",
      location: "Delhi NCR",
      timeAgo: "4 hours ago",
      severity: "Critical",
      reports: 78
    },
    {
      id: 3,
      type: "Tech Support",
      description: "Fake Microsoft support calls demanding remote access",
      location: "Bangalore, Karnataka",
      timeAgo: "6 hours ago",
      severity: "Medium",
      reports: 23
    },
    {
      id: 4,
      type: "Romance Scam",
      description: "Dating app profile requesting money for emergency",
      location: "Chennai, Tamil Nadu",
      timeAgo: "8 hours ago",
      severity: "High",
      reports: 34
    }
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      "Critical": "bg-red-100 text-red-800",
      "High": "bg-orange-100 text-orange-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-green-100 text-green-800"
    };
    return colors[severity as keyof typeof colors] || colors.Medium;
  };

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Live Fraud Alerts
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real-time alerts from our community. Stay informed about the latest fraud attempts in your area.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {alert.type}
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {alert.description}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {alert.location}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {alert.timeAgo}
                </div>
                <span className="text-india-saffron font-medium">
                  {alert.reports} reports
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PublicFraudAlerts;
