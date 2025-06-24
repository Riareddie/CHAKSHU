
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Brain, CheckCircle, AlertTriangle } from 'lucide-react';

const ConfidenceScoring = () => {
  const confidenceExamples = [
    {
      id: 1,
      content: 'URGENT: Your account will be suspended! Click here to verify: bit.ly/verify123',
      confidence: 96,
      factors: [
        { factor: 'Urgency keywords', weight: 85, impact: 'High' },
        { factor: 'Suspicious URL shortener', weight: 92, impact: 'High' },
        { factor: 'Account suspension threat', weight: 89, impact: 'High' },
        { factor: 'Call-to-action pattern', weight: 78, impact: 'Medium' }
      ],
      verdict: 'Fraud',
      reasoning: 'Multiple high-confidence fraud indicators detected'
    },
    {
      id: 2,
      content: 'Hi, this is John from ABC Bank. We need to update your KYC documents.',
      confidence: 73,
      factors: [
        { factor: 'Bank impersonation', weight: 81, impact: 'High' },
        { factor: 'KYC request pattern', weight: 67, impact: 'Medium' },
        { factor: 'Generic greeting', weight: 45, impact: 'Low' },
        { factor: 'No official channels', weight: 78, impact: 'Medium' }
      ],
      verdict: 'Likely Fraud',
      reasoning: 'Moderate confidence with bank impersonation patterns'
    },
    {
      id: 3,
      content: 'Reminder: Your monthly statement is ready. Visit our secure portal to download.',
      confidence: 24,
      factors: [
        { factor: 'Legitimate language', weight: 15, impact: 'Low' },
        { factor: 'No urgency indicators', weight: 12, impact: 'Low' },
        { factor: 'Standard notification', weight: 18, impact: 'Low' },
        { factor: 'No suspicious links', weight: 8, impact: 'Low' }
      ],
      verdict: 'Legitimate',
      reasoning: 'Low fraud indicators, appears to be genuine communication'
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-red-600';
    if (confidence >= 60) return 'text-orange-600';
    if (confidence >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getConfidenceBackground = (confidence: number) => {
    if (confidence >= 80) return 'bg-red-500';
    if (confidence >= 60) return 'bg-orange-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Fraud': return 'bg-red-100 text-red-800';
      case 'Likely Fraud': return 'bg-orange-100 text-orange-800';
      case 'Suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'Legitimate': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Confidence Scoring Visualization</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI provides transparent confidence scores showing exactly why content 
          was classified as fraud, with detailed breakdowns of contributing factors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87.3%</div>
            <p className="text-xs text-muted-foreground">Across all predictions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">Of fraud predictions {'>'}80%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">97.8%</div>
            <p className="text-xs text-muted-foreground">Validated predictions</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {confidenceExamples.map((example) => (
          <Card key={example.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Confidence Analysis #{example.id}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerdictColor(example.verdict)}`}>
                    {example.verdict}
                  </span>
                  <span className={`text-2xl font-bold ${getConfidenceColor(example.confidence)}`}>
                    {example.confidence}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Content:</h4>
                <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                  {example.content}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Confidence Score:</h4>
                  <span className={`text-lg font-bold ${getConfidenceColor(example.confidence)}`}>
                    {example.confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${getConfidenceBackground(example.confidence)}`}
                    style={{ width: `${example.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contributing Factors:</h4>
                <div className="space-y-3">
                  {example.factors.map((factor, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{factor.factor}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(factor.impact)}`}>
                            {factor.impact}
                          </span>
                          <span className="text-sm font-semibold">{factor.weight}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${factor.weight}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">AI Reasoning:</h4>
                <p className="text-blue-800 text-sm">{example.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ConfidenceScoring;
