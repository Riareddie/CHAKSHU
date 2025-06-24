
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { AlertTriangle, Shield, TrendingUp, Brain, Eye, Target } from "lucide-react";

const PredictiveAnalytics = () => {
  const riskAssessment = {
    overall: 68,
    factors: [
      { name: 'Online Activity Level', score: 75, risk: 'medium' },
      { name: 'Location Risk', score: 45, risk: 'low' },
      { name: 'Transaction Patterns', score: 82, risk: 'high' },
      { name: 'Device Security', score: 60, risk: 'medium' },
      { name: 'Personal Information Exposure', score: 90, risk: 'high' }
    ]
  };

  const emergingThreats = [
    {
      id: '1',
      threat: 'AI-Generated Voice Scams',
      probability: 85,
      timeline: '2-3 months',
      impact: 'High',
      description: 'Sophisticated voice cloning technology being used for phone scams'
    },
    {
      id: '2',
      threat: 'Crypto Investment Ponzi Schemes',
      probability: 72,
      timeline: '1 month',
      impact: 'Very High',
      description: 'New cryptocurrency platforms with unsustainable return promises'
    },
    {
      id: '3',
      threat: 'QR Code Payment Frauds',
      probability: 68,
      timeline: '2 weeks',
      impact: 'Medium',
      description: 'Malicious QR codes replacing legitimate payment codes'
    },
    {
      id: '4',
      threat: 'Social Media Account Takeovers',
      probability: 91,
      timeline: '1 week',
      impact: 'Medium',
      description: 'Increased targeting of social media accounts for fraud operations'
    }
  ];

  const vulnerabilityScoring = [
    { category: 'Email Security', current: 85, target: 95, gap: 10 },
    { category: 'Financial Apps', current: 78, target: 90, gap: 12 },
    { category: 'Social Media', current: 62, target: 85, gap: 23 },
    { category: 'Online Shopping', current: 70, target: 88, gap: 18 },
    { category: 'Banking', current: 92, target: 98, gap: 6 }
  ];

  const fraudPredictions = [
    { month: 'Jul', predicted: 1200, confidence: 0.89 },
    { month: 'Aug', predicted: 1350, confidence: 0.85 },
    { month: 'Sep', predicted: 1100, confidence: 0.82 },
    { month: 'Oct', predicted: 1500, confidence: 0.78 },
    { month: 'Nov', predicted: 1650, confidence: 0.75 },
    { month: 'Dec', predicted: 1800, confidence: 0.72 }
  ];

  const protectiveActions = [
    {
      priority: 'High',
      action: 'Enable 2FA on all financial accounts',
      impact: 'Reduces risk by 45%',
      effort: 'Low',
      completed: false
    },
    {
      priority: 'High',
      action: 'Update privacy settings on social media',
      impact: 'Reduces risk by 30%',
      effort: 'Medium',
      completed: true
    },
    {
      priority: 'Medium',
      action: 'Install ad blocker and anti-phishing browser extension',
      impact: 'Reduces risk by 25%',
      effort: 'Low',
      completed: false
    },
    {
      priority: 'Medium',
      action: 'Review and limit app permissions',
      impact: 'Reduces risk by 20%',
      effort: 'Medium',
      completed: false
    },
    {
      priority: 'Low',
      action: 'Set up fraud alerts with bank',
      impact: 'Reduces risk by 15%',
      effort: 'Low',
      completed: true
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Fraud Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Your Fraud Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: riskAssessment.overall }]}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#ef4444" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{riskAssessment.overall}%</div>
                    <div className="text-xs text-gray-500">Risk Score</div>
                  </div>
                </div>
              </div>
              <Badge className="mt-4 bg-yellow-100 text-yellow-800">
                Medium Risk
              </Badge>
            </div>
            
            <div className="space-y-4">
              {riskAssessment.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{factor.name}</span>
                    <Badge className={getRiskColor(factor.risk)}>
                      {factor.score}%
                    </Badge>
                  </div>
                  <Progress value={factor.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Emerging Threat Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergingThreats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{threat.threat}</h4>
                    <Badge className={threat.impact === 'Very High' ? 'bg-red-100 text-red-800' : 
                                     threat.impact === 'High' ? 'bg-orange-100 text-orange-800' : 
                                     'bg-yellow-100 text-yellow-800'}>
                      {threat.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{threat.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className="font-medium">{threat.probability}%</span> probability
                    </div>
                    <div className="text-xs text-gray-500">
                      Expected: {threat.timeline}
                    </div>
                  </div>
                  <Progress value={threat.probability} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vulnerability Scoring by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {vulnerabilityScoring.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {item.current}% / {item.target}%
                    </span>
                    <Badge variant="outline" className="text-xs">
                      -{item.gap} gap
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={item.current} className="h-3" />
                  <div 
                    className="absolute top-0 h-3 bg-gray-200 rounded-r opacity-50"
                    style={{ 
                      left: `${item.current}%`, 
                      width: `${item.target - item.current}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fraud Predictions Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fraud Volume Predictions (Next 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudPredictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value} reports (${(props.payload.confidence * 100).toFixed(0)}% confidence)`,
                  'Predicted Volume'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#f59e0b" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommended Protective Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Protective Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {protectiveActions.map((action, index) => (
              <div key={index} className={`border rounded-lg p-4 ${action.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                      {action.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold">{action.action}</h4>
                    <p className="text-sm text-gray-600">{action.impact}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2">Effort: {action.effort}</p>
                    {!action.completed && (
                      <Button size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900">AI Recommendation</h4>
                <p className="text-sm text-blue-800">
                  Based on your risk profile, prioritizing 2FA implementation and social media privacy 
                  settings could reduce your overall fraud risk by up to 60% in the next 30 days.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
