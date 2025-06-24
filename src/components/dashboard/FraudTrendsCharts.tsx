import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart, PieChart as PieChartIcon } from "lucide-react";

const FraudTrendsCharts = () => {
  const trendData = [
    { month: "Jan", reports: 45, resolved: 38 },
    { month: "Feb", reports: 52, resolved: 45 },
    { month: "Mar", reports: 48, resolved: 42 },
    { month: "Apr", reports: 61, resolved: 55 },
    { month: "May", reports: 55, resolved: 48 },
    { month: "Jun", reports: 67, resolved: 59 },
  ];

  const fraudTypes = [
    { name: "Phishing", value: 35, fill: "#ef4444" },
    { name: "SMS Fraud", value: 28, fill: "#22c55e" },
    { name: "Call Fraud", value: 20, fill: "#3b82f6" },
    { name: "Email Spam", value: 17, fill: "#f59e0b" },
  ];

  const chartConfig = {
    reports: {
      label: "Reports",
      color: "#ef4444",
    },
    resolved: {
      label: "Resolved",
      color: "#22c55e",
    },
  };

  const pieChartConfig = {
    phishing: {
      label: "Phishing",
      color: "#ef4444",
    },
    sms: {
      label: "SMS Fraud",
      color: "#22c55e",
    },
    call: {
      label: "Call Fraud",
      color: "#3b82f6",
    },
    email: {
      label: "Email Spam",
      color: "#f59e0b",
    },
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Fraud Reports Trend
            </CardTitle>
            <CardDescription>
              Monthly comparison of reported vs resolved cases
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="var(--color-reports)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-reports)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="var(--color-resolved)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-resolved)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Fraud Types Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of fraud types in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer
              config={pieChartConfig}
              className="h-[300px] w-full"
            >
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={fraudTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={30}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {fraudTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FraudTrendsCharts;
