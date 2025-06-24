import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Shield,
  IndianRupee,
} from "lucide-react";
import Header from "@/components/Header";
import NavigationButtons from "@/components/common/NavigationButtons";
import { formatCurrency, formatCurrencyCompact } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  fraudTrends: { month: string; incidents: number; amount: number }[];
  fraudTypes: {
    type: string;
    percentage: number;
    count: number;
    color: string;
  }[];
  topHotspots: {
    city: string;
    state: string;
    incidents: number;
    increase: number;
  }[];
  timePatterns: { hour: number; incidents: number }[];
  ageGroups: { group: string; vulnerability: number; incidents: number }[];
  resolutionRates: { month: string; resolved: number; total: number }[];
  financialLoss: { month: string; amount: number; prevented: number }[];
}

const mockAnalyticsData: AnalyticsData = {
  fraudTrends: [
    { month: "Jan", incidents: 1250, amount: 45000000 },
    { month: "Feb", incidents: 1180, amount: 42000000 },
    { month: "Mar", incidents: 1420, amount: 52000000 },
    { month: "Apr", incidents: 1380, amount: 48000000 },
    { month: "May", incidents: 1650, amount: 61000000 },
    { month: "Jun", incidents: 1580, amount: 58000000 },
    { month: "Jul", incidents: 1720, amount: 64000000 },
    { month: "Aug", incidents: 1890, amount: 71000000 },
    { month: "Sep", incidents: 1750, amount: 66000000 },
    { month: "Oct", incidents: 1920, amount: 74000000 },
    { month: "Nov", incidents: 2100, amount: 82000000 },
    { month: "Dec", incidents: 2250, amount: 89000000 },
  ],
  fraudTypes: [
    { type: "UPI Fraud", percentage: 28, count: 5600, color: "#dc2626" },
    { type: "Call Fraud", percentage: 22, count: 4400, color: "#ea580c" },
    { type: "SMS Fraud", percentage: 18, count: 3600, color: "#d97706" },
    { type: "Email Spam", percentage: 12, count: 2400, color: "#65a30d" },
    { type: "WhatsApp Scam", percentage: 10, count: 2000, color: "#059669" },
    { type: "Banking Fraud", percentage: 6, count: 1200, color: "#0891b2" },
    { type: "Investment Scam", percentage: 4, count: 800, color: "#7c3aed" },
  ],
  topHotspots: [
    { city: "Mumbai", state: "Maharashtra", incidents: 2250, increase: 15 },
    { city: "Delhi", state: "Delhi", incidents: 2100, increase: 22 },
    { city: "Bangalore", state: "Karnataka", incidents: 1890, increase: 8 },
    { city: "Chennai", state: "Tamil Nadu", incidents: 1650, increase: 12 },
    { city: "Pune", state: "Maharashtra", incidents: 1420, increase: 18 },
    { city: "Kolkata", state: "West Bengal", incidents: 1380, increase: 5 },
    { city: "Hyderabad", state: "Telangana", incidents: 1250, increase: 25 },
    { city: "Ahmedabad", state: "Gujarat", incidents: 1180, increase: 10 },
    { city: "Jaipur", state: "Rajasthan", incidents: 950, increase: 14 },
    { city: "Lucknow", state: "Uttar Pradesh", incidents: 820, increase: 7 },
  ],
  timePatterns: [
    { hour: 0, incidents: 45 },
    { hour: 1, incidents: 32 },
    { hour: 2, incidents: 28 },
    { hour: 3, incidents: 22 },
    { hour: 4, incidents: 18 },
    { hour: 5, incidents: 25 },
    { hour: 6, incidents: 42 },
    { hour: 7, incidents: 68 },
    { hour: 8, incidents: 95 },
    { hour: 9, incidents: 125 },
    { hour: 10, incidents: 158 },
    { hour: 11, incidents: 172 },
    { hour: 12, incidents: 185 },
    { hour: 13, incidents: 178 },
    { hour: 14, incidents: 192 },
    { hour: 15, incidents: 205 },
    { hour: 16, incidents: 188 },
    { hour: 17, incidents: 165 },
    { hour: 18, incidents: 142 },
    { hour: 19, incidents: 118 },
    { hour: 20, incidents: 96 },
    { hour: 21, incidents: 78 },
    { hour: 22, incidents: 62 },
    { hour: 23, incidents: 52 },
  ],
  ageGroups: [
    { group: "18-25", vulnerability: 72, incidents: 3600 },
    { group: "26-35", vulnerability: 68, incidents: 4800 },
    { group: "36-45", vulnerability: 58, incidents: 3200 },
    { group: "46-55", vulnerability: 45, incidents: 2400 },
    { group: "56-65", vulnerability: 52, incidents: 2800 },
    { group: "65+", vulnerability: 38, incidents: 1200 },
  ],
  resolutionRates: [
    { month: "Jan", resolved: 876, total: 1250 },
    { month: "Feb", resolved: 826, total: 1180 },
    { month: "Mar", resolved: 994, total: 1420 },
    { month: "Apr", resolved: 966, total: 1380 },
    { month: "May", resolved: 1155, total: 1650 },
    { month: "Jun", resolved: 1106, total: 1580 },
  ],
  financialLoss: [
    { month: "Jan", amount: 45000000, prevented: 12000000 },
    { month: "Feb", amount: 42000000, prevented: 15000000 },
    { month: "Mar", amount: 52000000, prevented: 18000000 },
    { month: "Apr", amount: 48000000, prevented: 16000000 },
    { month: "May", amount: 61000000, prevented: 22000000 },
    { month: "Jun", amount: 58000000, prevented: 25000000 },
  ],
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState("last12months");
  const [selectedMetric, setSelectedMetric] = useState("incidents");
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your analytics report is being prepared for download...",
    });

    // Simulate export
    setTimeout(() => {
      const data = {
        analytics_summary: {
          date_range: dateRange,
          total_incidents: mockAnalyticsData.fraudTrends.reduce(
            (sum, item) => sum + item.incidents,
            0,
          ),
          total_amount: mockAnalyticsData.fraudTrends.reduce(
            (sum, item) => sum + item.amount,
            0,
          ),
          export_date: new Date().toISOString(),
        },
        fraud_trends: mockAnalyticsData.fraudTrends,
        fraud_types: mockAnalyticsData.fraudTypes,
        top_hotspots: mockAnalyticsData.topHotspots,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fraud-analytics-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Analytics report downloaded successfully.",
      });
    }, 2000);
  };

  const currentMonthIncidents =
    mockAnalyticsData.fraudTrends[mockAnalyticsData.fraudTrends.length - 1]
      ?.incidents || 0;
  const previousMonthIncidents =
    mockAnalyticsData.fraudTrends[mockAnalyticsData.fraudTrends.length - 2]
      ?.incidents || 0;
  const incidentChange = (
    ((currentMonthIncidents - previousMonthIncidents) /
      previousMonthIncidents) *
    100
  ).toFixed(1);

  const currentMonthAmount =
    mockAnalyticsData.fraudTrends[mockAnalyticsData.fraudTrends.length - 1]
      ?.amount || 0;
  const previousMonthAmount =
    mockAnalyticsData.fraudTrends[mockAnalyticsData.fraudTrends.length - 2]
      ?.amount || 0;
  const amountChange = (
    ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) *
    100
  ).toFixed(1);

  const averageResolutionRate =
    (mockAnalyticsData.resolutionRates.reduce(
      (sum, item) => sum + item.resolved / item.total,
      0,
    ) /
      mockAnalyticsData.resolutionRates.length) *
    100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-india-saffron to-saffron-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Fraud Analytics Dashboard
              </h1>
              <p className="text-lg opacity-90">
                Comprehensive insights into fraud patterns and trends across
                India
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                  <SelectItem value="last12months">Last 12 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="bg-white text-india-saffron hover:bg-gray-100"
                onClick={() => handleExport("json")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation Buttons */}
        <NavigationButtons />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Incidents
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentMonthIncidents.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1">
                    {parseFloat(incidentChange) > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span
                      className={`text-sm ${parseFloat(incidentChange) > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {Math.abs(parseFloat(incidentChange))}% vs last month
                    </span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Financial Loss
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrencyCompact(currentMonthAmount)}
                  </p>
                  <div className="flex items-center mt-1">
                    {parseFloat(amountChange) > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span
                      className={`text-sm ${parseFloat(amountChange) > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {Math.abs(parseFloat(amountChange))}% vs last month
                    </span>
                  </div>
                </div>
                <IndianRupee className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resolution Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageResolutionRate.toFixed(1)}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +2.3% vs last month
                    </span>
                  </div>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">24.5K</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +8.2% vs last month
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fraud Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Fraud Incidents Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Interactive line chart showing fraud trends
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Peak incidents:{" "}
                    {Math.max(
                      ...mockAnalyticsData.fraudTrends.map((d) => d.incidents),
                    ).toLocaleString()}{" "}
                    in December
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fraud Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Fraud Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.fraudTypes.map((type, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{type.percentage}%</div>
                      <div className="text-sm text-gray-500">
                        {type.count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Fraud Hotspots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top 10 Fraud Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.topHotspots.map((hotspot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-semibold">{hotspot.city}</div>
                      <div className="text-sm text-gray-600">
                        {hotspot.state}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {hotspot.incidents.toLocaleString()} incidents
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-red-500" />
                      <span className="text-sm text-red-600">
                        +{hotspot.increase}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Pattern Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Fraud Activity by Hour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Heatmap showing peak fraud hours
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Peak activity: 3 PM - 5 PM (Business hours)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Age Group Vulnerability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.ageGroups.map((group, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{group.group} years</span>
                      <span className="text-sm text-gray-600">
                        {group.incidents.toLocaleString()} incidents
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-india-saffron h-2 rounded-full transition-all duration-300"
                        style={{ width: `${group.vulnerability}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Vulnerability Score: {group.vulnerability}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("png")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Charts as PNG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("csv")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data as CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
