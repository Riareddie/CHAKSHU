
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const ThreatAssessment = () => {
  const threats = [
    {
      id: 1,
      type: 'Phishing Email',
      level: 95,
      severity: 'Critical',
      indicators: ['Suspicious sender domain', 'URL redirection detected', 'Social engineering patterns'],
      action: 'Immediate block recommended'
    },
    {
      id: 2,
      type: 'SMS Scam',
      level: 78,
      severity: 'High',
      indicators: ['Premium rate number', 'Urgency language', 'Financial request'],
      action: 'User warning issued'
    },
    {
      id: 3,
      type: 'Fake Website',
      level: 62,
      severity: 'Medium',
      indicators: ['Domain similarity', 'Missing SSL certificate', 'Copied content'],
      action: 'Under investigation'
    },
    {
      id: 4,
      type: 'Social Media Fraud',
      level: 34,
      severity: 'Low',
      indicators: ['New account', 'Stock promotion patterns'],
      action: 'Monitoring'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'High': return <Shield className="w-4 h-4 text-orange-600" />;
      case 'Medium': return <Info className="w-4 h-4 text-yellow-600" />;
      case 'Low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getProgressColor = (level: number) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 60) return 'bg-orange-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Automated Threat Level Assessment</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered threat assessment analyzes multiple risk factors to provide 
          automated severity ratings and recommended actions for each detected threat.
        </p>
      </div>

      <div className="grid gap-6">
        {threats.map((threat) => (
          <Card key={threat.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getSeverityIcon(threat.severity)}
                  {threat.type}
                </CardTitle>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Threat Level</span>
                  <span className="text-lg font-bold">{threat.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(threat.level)}`}
                    style={{ width: `${threat.level}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Risk Indicators:</h4>
                <ul className="space-y-1">
                  {threat.indicators.map((indicator, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-india-saffron rounded-full"></div>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Recommended Action: </span>
                <span className="text-sm text-blue-700">{threat.action}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ThreatAssessment;
