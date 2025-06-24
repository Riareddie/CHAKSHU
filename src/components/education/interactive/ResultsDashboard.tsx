
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, CheckCircle, AlertTriangle, Award } from "lucide-react";

interface ResultsDashboardProps {
  userProgress: any;
}

const ResultsDashboard = ({ userProgress }: ResultsDashboardProps) => {
  // Mock data for charts
  const weeklyProgress = [
    { day: 'Mon', score: 45, scenarios: 3 },
    { day: 'Tue', score: 52, scenarios: 4 },
    { day: 'Wed', score: 48, scenarios: 2 },
    { day: 'Thu', score: 61, scenarios: 5 },
    { day: 'Fri', score: 55, scenarios: 3 },
    { day: 'Sat', score: 58, scenarios: 4 },
    { day: 'Sun', score: 63, scenarios: 4 }
  ];

  const scenarioTypes = [
    { name: 'Phone Calls', value: 40, color: '#FF6B6B' },
    { name: 'SMS/Text', value: 30, color: '#4ECDC4' },
    { name: 'Email', value: 20, color: '#45B7D1' },
    { name: 'Investment', value: 10, color: '#96CEB4' }
  ];

  const skillsProgress = [
    { skill: 'Pattern Recognition', progress: 75 },
    { skill: 'Red Flag Identification', progress: 68 },
    { skill: 'Audio Analysis', progress: 52 },
    { skill: 'Text Analysis', progress: 83 },
    { skill: 'Risk Assessment', progress: 61 }
  ];

  const recentActivity = [
    { date: '2024-01-15', activity: 'Completed Bank Call Scenario', score: 85, type: 'success' },
    { date: '2024-01-14', activity: 'Failed Investment Scam Quiz', score: 45, type: 'warning' },
    { date: '2024-01-13', activity: 'Earned Pattern Master Badge', score: null, type: 'achievement' },
    { date: '2024-01-12', activity: 'Completed SMS Analysis', score: 92, type: 'success' },
    { date: '2024-01-11', activity: 'Started Intermediate Level', score: null, type: 'milestone' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'achievement': return <Award className="w-4 h-4 text-purple-500" />;
      case 'milestone': return <Target className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Performance Dashboard</h2>
        <p className="text-gray-600">
          Track your improvement over time and identify areas for growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">78%</p>
                <p className="text-xs text-gray-500">+5% from last week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">85%</p>
                <p className="text-xs text-gray-500">Fraud detection accuracy</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-purple-600">12h</p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">7</p>
                <p className="text-xs text-gray-500">Days in a row</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  name="Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="scenarios" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Scenarios Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scenario Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Types Practiced</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scenarioTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scenarioTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Development</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillsProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-600">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="font-medium">{activity.activity}</p>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                {activity.score && (
                  <Badge 
                    className={
                      activity.score >= 80 ? 'bg-green-100 text-green-800' :
                      activity.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {activity.score}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Focus Area: Audio Analysis</h3>
              <p className="text-sm text-blue-800">
                Your audio analysis skills need improvement. Practice with more voice call scenarios.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Strength: Text Analysis</h3>
              <p className="text-sm text-green-800">
                Excellent work on text pattern recognition! Consider helping others in the community.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Challenge: Investment Scams</h3>
              <p className="text-sm text-yellow-800">
                Try more complex investment fraud scenarios to reach expert level.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Goal: Certification</h3>
              <p className="text-sm text-purple-800">
                Complete 5 more scenarios to earn your Intermediate Certification.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDashboard;
