import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CommunityReportsFeed = () => {
  const { toast } = useToast();

  const handleReportSimilar = (report: any) => {
    toast({
      title: "Report Similar Incident",
      description: `You would be redirected to report a similar ${report.type} incident.`,
    });

    // In a real app, this would navigate to the fraud reporting form with pre-filled category
    setTimeout(() => {
      window.location.href = "/?report=true";
    }, 1500);
  };
  const communityReports = [
    {
      id: 1,
      type: "Phishing",
      location: "Sector 5",
      time: "2 hours ago",
      description: "Fake OTP request call",
      verified: true,
      upvotes: 12,
    },
    {
      id: 2,
      type: "SMS Fraud",
      location: "Downtown",
      time: "4 hours ago",
      description: "Lottery winning message scam",
      verified: false,
      upvotes: 8,
    },
    {
      id: 3,
      type: "Call Fraud",
      location: "Mall Area",
      time: "6 hours ago",
      description: "Fake tech support call",
      verified: true,
      upvotes: 15,
    },
    {
      id: 4,
      type: "Email Spam",
      location: "Residential",
      time: "8 hours ago",
      description: "Investment scheme email",
      verified: false,
      upvotes: 5,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Community Reports</CardTitle>
        <CardDescription>
          Latest fraud reports from your community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communityReports.map((report) => (
            <div
              key={report.id}
              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {report.type}
                  </Badge>
                  {report.verified && (
                    <Badge
                      variant="default"
                      className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">{report.time}</span>
              </div>

              <p className="text-sm text-gray-700 dark:text-white mb-2">
                {report.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{report.location}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    ↑ {report.upvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleReportSimilar(report)}
                  >
                    Report Similar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link to="/community">
          <Button variant="outline" className="w-full mt-4">
            View All Community Reports
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CommunityReportsFeed;
