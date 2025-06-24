
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LatestFraudAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "Fake UPI QR Code Scams Rising",
      severity: "High",
      date: "2024-01-15",
      description: "Scammers placing fake QR codes over legitimate ones at shops and restaurants",
      affected: "Delhi, Mumbai, Bangalore",
      tips: "Always verify merchant details before scanning QR codes"
    },
    {
      id: 2,
      title: "Investment App Ponzi Scheme",
      severity: "Critical",
      date: "2024-01-12",
      description: "Multiple apps promising high returns found to be fraudulent",
      affected: "Pan India",
      tips: "Verify app credentials and avoid unrealistic return promises"
    },
    {
      id: 3,
      title: "Fake Job Interview Scams",
      severity: "Medium",
      date: "2024-01-10",
      description: "Fraudsters conducting fake interviews and asking for advance payments",
      affected: "Tier 2 & 3 Cities",
      tips: "Legitimate companies never ask for money during recruitment"
    },
    {
      id: 4,
      title: "WhatsApp Business Verification Fraud",
      severity: "High",
      date: "2024-01-08",
      description: "Fake WhatsApp business accounts impersonating banks and government agencies",
      affected: "All States",
      tips: "Always verify official communication through official channels"
    }
  ];

  const trendingScams = [
    "Cryptocurrency investment frauds",
    "Fake loan approval messages",
    "Insurance premium refund scams",
    "Digital arrest threats",
    "Fake government subsidy schemes"
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Latest Fraud Techniques Alert
          </CardTitle>
          <p className="text-gray-600 text-center">
            Stay updated with the newest fraud methods and protect yourself
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${
                alert.severity === 'Critical' ? 'border-red-500' : 
                alert.severity === 'High' ? 'border-orange-500' : 'border-yellow-500'
              }`}>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge variant={
                        alert.severity === 'Critical' ? 'destructive' : 
                        alert.severity === 'High' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Date: </span>
                        {alert.date}
                      </div>
                      <div>
                        <span className="font-medium">Areas: </span>
                        {alert.affected}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-sm">
                      <span className="font-medium text-blue-800">Prevention Tip: </span>
                      <span className="text-blue-700">{alert.tips}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Currently Trending Scams:</h4>
            <div className="grid gap-2">
              {trendingScams.map((scam, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">{scam}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LatestFraudAlerts;
