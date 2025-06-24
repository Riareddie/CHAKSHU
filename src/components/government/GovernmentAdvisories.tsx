
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, ExternalLink } from "lucide-react";

const GovernmentAdvisories = () => {
  const advisories = [
    {
      id: 1,
      title: "New Cryptocurrency Scam Alert",
      date: "2024-06-08",
      severity: "High",
      content: "Recent reports of fake cryptocurrency exchanges targeting Indian citizens. Be cautious of unsolicited investment opportunities."
    },
    {
      id: 2,
      title: "Banking Fraud Prevention Guidelines",
      date: "2024-06-07",
      severity: "Medium",
      content: "Updated guidelines from Reserve Bank of India regarding online banking security measures."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Government Advisories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advisories.map((advisory) => (
            <div key={advisory.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{advisory.title}</h3>
                <Badge variant={advisory.severity === 'High' ? 'destructive' : 'secondary'}>
                  {advisory.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                {advisory.date}
              </div>
              <p className="text-sm text-gray-700">{advisory.content}</p>
              <div className="mt-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Read Full Advisory
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GovernmentAdvisories;
