
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';

const PredictiveTrends = () => {
  const fraudTrendData = [
    { month: 'Jan', actual: 245, predicted: 240 },
    { month: 'Feb', actual: 289, predicted: 285 },
    { month: 'Mar', actual: 324, predicted: 330 },
    { month: 'Apr', actual: 398, predicted: 395 },
    { month: 'May', actual: 456, predicted: 450 },
    { month: 'Jun', actual: 523, predicted: 520 },
    { month: 'Jul', actual: null, predicted: 587 },
    { month: 'Aug', actual: null, predicted: 645 },
    { month: 'Sep', actual: null, predicted: 712 },
  ];

  const categoryTrends = [
    { category: 'Phishing', current: 342, predicted: 410, growth: 19.9 },
    { category: 'Investment', current: 267, predicted: 298, growth: 11.6 },
    { category: 'Prize/Lottery', current: 189, predicted: 201, growth: 6.3 },
    { category: 'Bank Alert', current: 156, predicted: 178, growth: 14.1 },
    { category: 'Romance', current: 134, predicted: 142, growth: 6.0 },
  ];

  const riskPeriods = [
    { period: 'Festival Season', riskIncrease: '+45%', timeframe: 'Oct-Nov' },
    { period: 'Tax Season', riskIncrease: '+32%', timeframe: 'Mar-Apr' },
    { period: 'Year End', riskIncrease: '+28%', timeframe: 'Dec' },
    { period: 'Monsoon', riskIncrease: '+15%', timeframe: 'Jun-Sep' },
  ];

  const chartConfig = {
    actual: {
      label: "Actual",
      color: "#3b82f6",
    },
    predicted: {
      label: "Predicted",
      color: "#f59e0b",
    },
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Predictive Fraud Trend Graphs</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Machine learning models analyze historical patterns to forecast fraud trends, 
          helping organizations prepare for emerging threats and seasonal variations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Fraud Volume Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={fraudTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: "#f59e0b" }}
                />
              </LineChart>
            </ChartContainer>
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Predicted 23% increase in fraud attempts over next 3 months
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-purple-600" />
              Category Growth Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{trend.category}</div>
                    <div className="text-sm text-gray-600">
                      {trend.current} → {trend.predicted} cases
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${trend.growth > 15 ? 'text-red-600' : trend.growth > 10 ? 'text-orange-600' : 'text-green-600'}`}>
                      +{trend.growth}%
                    </div>
                    <div className="text-xs text-gray-500">next month</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Seasonal Risk Periods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riskPeriods.map((period, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-red-900">{period.period}</span>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">{period.riskIncrease}</div>
                <div className="text-sm text-red-700">{period.timeframe}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">AI Insights:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Festival seasons show highest fraud activity due to increased financial transactions</li>
              <li>• Investment scams peak during tax season when people seek tax-saving opportunities</li>
              <li>• Romance scams increase during holiday periods when people feel lonely</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PredictiveTrends;
