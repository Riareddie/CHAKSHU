import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getReportStats, mockReportsData } from "@/data/mockReports";

const QuickStatsCards = () => {
  const reportStats = getReportStats();

  const stats = [
    {
      title: "Reports Filed",
      value: reportStats.total.toString(),
      change: "+3 this month",
      changeType: "positive",
    },
    {
      title: "Cases Resolved",
      value: reportStats.resolved.toString(),
      change: `${reportStats.resolutionRate}% success rate`,
      changeType: "positive",
    },
    {
      title: "Total Amount",
      value: `₹${(reportStats.totalAmount / 100000).toFixed(1)}L`,
      change: "Cases reported",
      changeType: "neutral",
    },
    {
      title: "Under Review",
      value: reportStats.underReview.toString(),
      change: `${reportStats.pending} pending`,
      changeType: reportStats.pending > 3 ? "negative" : "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-light-yellow">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <Badge
                variant="secondary"
                className={`w-fit text-xs ${
                  stat.changeType === "positive"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {stat.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsCards;
