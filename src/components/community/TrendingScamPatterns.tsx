
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar } from "lucide-react";

const TrendingScamPatterns = () => {
  const patterns = [
    {
      id: 1,
      title: "UPI Payment Reversal Scam",
      description: "Scammers send money via UPI and then claim it was sent by mistake, requesting a refund while planning to reverse the original transaction.",
      trend: "+156%",
      victims: "2,341",
      peakMonth: "Current Month",
      category: "Digital Payment"
    },
    {
      id: 2,
      title: "AI Voice Cloning Fraud",
      description: "Criminals use AI to clone voices of family members and call for emergency money, creating highly convincing audio impersonations.",
      trend: "+89%",
      victims: "892",
      peakMonth: "Last 30 days",
      category: "Emerging Tech"
    },
    {
      id: 3,
      title: "Fake Government Job Schemes",
      description: "Fraudsters pose as government officials offering jobs in exchange for processing fees, targeting unemployed youth.",
      trend: "+45%",
      victims: "5,678",
      peakMonth: "Last 60 days",
      category: "Employment"
    }
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Trending Scam Patterns
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Emerging fraud patterns identified by our AI analysis and community reporting.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {patterns.map((pattern) => (
          <Card key={pattern.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {pattern.category}
                </Badge>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-semibold">{pattern.trend}</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {pattern.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {pattern.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-red-600 mr-1" />
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {pattern.victims}
                  </div>
                  <div className="text-xs text-gray-600">Victims</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Peak: {pattern.peakMonth}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TrendingScamPatterns;
