
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tags, Zap, CheckCircle, AlertCircle } from 'lucide-react';

const AutoCategorization = () => {
  const categoryDistribution = [
    { category: 'Phishing', count: 3421, accuracy: 98.7, color: '#ef4444' },
    { category: 'Investment Scam', count: 2847, accuracy: 96.3, color: '#f59e0b' },
    { category: 'Prize/Lottery', count: 1923, accuracy: 94.8, color: '#3b82f6' },
    { category: 'Bank Alert', count: 1654, accuracy: 97.2, color: '#10b981' },
    { category: 'Romance Scam', count: 1298, accuracy: 92.4, color: '#8b5cf6' },
    { category: 'Job Offer', count: 987, accuracy: 89.6, color: '#06b6d4' },
    { category: 'Tech Support', count: 743, accuracy: 95.1, color: '#84cc16' },
    { category: 'Other', count: 567, accuracy: 87.3, color: '#6b7280' }
  ];

  const accuracyTrends = [
    { month: 'Jan', accuracy: 91.2 },
    { month: 'Feb', accuracy: 92.8 },
    { month: 'Mar', accuracy: 94.1 },
    { month: 'Apr', accuracy: 95.3 },
    { month: 'May', accuracy: 96.7 },
    { month: 'Jun', accuracy: 97.8 }
  ];

  const confusionExamples = [
    {
      content: 'Congratulations! You have won iPhone 15 Pro Max. Click link to claim your prize now!',
      predicted: 'Prize/Lottery',
      actual: 'Prize/Lottery',
      confidence: 97.8,
      status: 'correct'
    },
    {
      content: 'Your Amazon account has been compromised. Verify your identity immediately.',
      predicted: 'Phishing',
      actual: 'Phishing',
      confidence: 94.2,
      status: 'correct'
    },
    {
      content: 'Hi dear, I am Sarah from London. I have a business proposal for you.',
      predicted: 'Romance Scam',
      actual: 'Investment Scam',
      confidence: 76.4,
      status: 'incorrect'
    },
    {
      content: 'Work from home opportunity! Earn ₹50,000 per month. No experience required.',
      predicted: 'Job Offer',
      actual: 'Job Offer',
      confidence: 89.6,
      status: 'correct'
    }
  ];

  const chartConfig = {
    accuracy: { label: "Accuracy", color: "#3b82f6" },
  };

  const getStatusColor = (status: string) => {
    return status === 'correct' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Auto-Categorization Accuracy Stats</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI automatically classifies fraud reports into specific categories with high accuracy, 
          enabling faster response times and better pattern recognition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12</div>
            <p className="text-xs text-muted-foreground">Active fraud types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.6%</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">156ms</div>
            <p className="text-xs text-muted-foreground">Average categorization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Resolved</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78.3%</div>
            <p className="text-xs text-muted-foreground">No manual review needed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="w-5 h-5 text-purple-600" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ category, count }) => `${category}: ${count}`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Accuracy by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryDistribution.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-semibold">{category.accuracy}%</div>
                      <div className="text-xs text-gray-500">{category.count} cases</div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${category.accuracy}%` }}
                      ></div>
                    </div>
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
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Classification Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confusionExamples.map((example, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Content:</div>
                  <div className="text-sm bg-gray-100 p-2 rounded font-mono">{example.content}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Predicted</div>
                    <div className="text-sm font-medium">{example.predicted}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Actual</div>
                    <div className="text-sm font-medium">{example.actual}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Confidence</div>
                    <div className={`text-sm font-semibold ${getConfidenceColor(example.confidence)}`}>
                      {example.confidence}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(example.status)}`}>
                      {example.status === 'correct' ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AutoCategorization;
