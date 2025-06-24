
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";

const CommunityLeaderboard = () => {
  const topReporters = [
    {
      rank: 1,
      name: "FraudHunter2024",
      reports: 156,
      accuracy: 94,
      badge: "Gold Defender",
      points: 4680
    },
    {
      rank: 2,
      name: "SafetyFirst",
      reports: 143,
      accuracy: 91,
      badge: "Silver Guardian",
      points: 4290
    },
    {
      rank: 3,
      name: "DigitalSentinel",
      reports: 128,
      accuracy: 89,
      badge: "Bronze Protector",
      points: 3840
    },
    {
      rank: 4,
      name: "ScamBuster",
      reports: 95,
      accuracy: 92,
      badge: "Rising Star",
      points: 2850
    },
    {
      rank: 5,
      name: "CyberGuard",
      reports: 87,
      accuracy: 88,
      badge: "Community Helper",
      points: 2610
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      case 3:
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
          Community Leaderboard
        </CardTitle>
        <p className="text-gray-600">
          Top fraud reporters making our community safer
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {topReporters.map((reporter) => (
          <div
            key={reporter.rank}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {getRankIcon(reporter.rank)}
                <span className="ml-2 text-lg font-bold text-gray-700">
                  #{reporter.rank}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {reporter.name}
                </div>
                <Badge className={getBadgeColor(reporter.rank)}>
                  {reporter.badge}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-india-saffron">
                {reporter.points} pts
              </div>
              <div className="text-sm text-gray-600">
                {reporter.reports} reports • {reporter.accuracy}% accuracy
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CommunityLeaderboard;
