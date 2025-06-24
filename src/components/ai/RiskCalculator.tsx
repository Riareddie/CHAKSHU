
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const RiskCalculator = () => {
  const [riskFactors, setRiskFactors] = useState({
    urgencyLevel: [3],
    requestsPersonalInfo: 'no',
    hasExternalLinks: 'no',
    senderVerification: 'verified',
    grammarQuality: [7],
    timeOfContact: 'business',
    amountMentioned: '',
    channelType: 'email'
  });

  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [recommendations, setRecommendations] = useState([]);

  const calculateRisk = () => {
    let score = 0;
    let recs = [];

    // Urgency level (0-10 scale, higher = more risky)
    score += riskFactors.urgencyLevel[0] * 8;
    if (riskFactors.urgencyLevel[0] >= 7) {
      recs.push('High urgency language detected - common fraud tactic');
    }

    // Personal information requests
    if (riskFactors.requestsPersonalInfo === 'yes') {
      score += 25;
      recs.push('Requesting personal information - major red flag');
    }

    // External links
    if (riskFactors.hasExternalLinks === 'yes') {
      score += 15;
      recs.push('Contains external links - verify authenticity before clicking');
    }

    // Sender verification
    switch (riskFactors.senderVerification) {
      case 'unverified':
        score += 30;
        recs.push('Sender identity unverified - high risk');
        break;
      case 'suspicious':
        score += 20;
        recs.push('Sender appears suspicious - proceed with caution');
        break;
      case 'unknown':
        score += 10;
        recs.push('Unknown sender - verify identity before responding');
        break;
    }

    // Grammar quality (0-10 scale, lower = more risky)
    score += (10 - riskFactors.grammarQuality[0]) * 3;
    if (riskFactors.grammarQuality[0] <= 4) {
      recs.push('Poor grammar/spelling - often indicates fraudulent content');
    }

    // Time of contact
    if (riskFactors.timeOfContact === 'odd') {
      score += 10;
      recs.push('Contact at unusual hours - suspicious timing');
    }

    // Amount mentioned
    if (riskFactors.amountMentioned) {
      const amount = parseInt(riskFactors.amountMentioned);
      if (amount > 100000) {
        score += 20;
        recs.push('Large monetary amount mentioned - high-value scam indicator');
      } else if (amount > 10000) {
        score += 10;
        recs.push('Significant amount mentioned - verify legitimacy');
      }
    }

    // Channel type
    switch (riskFactors.channelType) {
      case 'sms':
        score += 5;
        break;
      case 'social':
        score += 8;
        break;
      case 'unknown':
        score += 12;
        break;
    }

    // Determine risk level
    let level = 'Low';
    if (score >= 80) level = 'Critical';
    else if (score >= 60) level = 'High';
    else if (score >= 40) level = 'Medium';

    setRiskScore(Math.min(score, 100));
    setRiskLevel(level);
    setRecommendations(recs);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Risk Assessment Calculator</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Interactive tool that calculates fraud risk based on multiple factors, 
          providing instant risk assessment and personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Risk Factor Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Urgency Level (1-10)</Label>
                  <Slider
                    value={riskFactors.urgencyLevel}
                    onValueChange={(value) => setRiskFactors({...riskFactors, urgencyLevel: value})}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">Current: {riskFactors.urgencyLevel[0]}</div>
                </div>

                <div className="space-y-2">
                  <Label>Requests Personal Information?</Label>
                  <Select value={riskFactors.requestsPersonalInfo} onValueChange={(value) => setRiskFactors({...riskFactors, requestsPersonalInfo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Contains External Links?</Label>
                  <Select value={riskFactors.hasExternalLinks} onValueChange={(value) => setRiskFactors({...riskFactors, hasExternalLinks: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sender Verification Status</Label>
                  <Select value={riskFactors.senderVerification} onValueChange={(value) => setRiskFactors({...riskFactors, senderVerification: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                      <SelectItem value="suspicious">Suspicious</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grammar/Spelling Quality (1-10)</Label>
                  <Slider
                    value={riskFactors.grammarQuality}
                    onValueChange={(value) => setRiskFactors({...riskFactors, grammarQuality: value})}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">Current: {riskFactors.grammarQuality[0]}</div>
                </div>

                <div className="space-y-2">
                  <Label>Time of Contact</Label>
                  <Select value={riskFactors.timeOfContact} onValueChange={(value) => setRiskFactors({...riskFactors, timeOfContact: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business Hours</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="odd">Odd Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount Mentioned (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount if mentioned"
                    value={riskFactors.amountMentioned}
                    onChange={(e) => setRiskFactors({...riskFactors, amountMentioned: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Communication Channel</Label>
                  <Select value={riskFactors.channelType} onValueChange={(value) => setRiskFactors({...riskFactors, channelType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={calculateRisk} className="w-full bg-blue-600 hover:bg-blue-700">
                Calculate Risk Score
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Risk Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{riskScore}%</div>
                <span className={`px-4 py-2 rounded-full text-lg font-medium ${getRiskColor(riskLevel)}`}>
                  {riskLevel} Risk
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Risk Level</span>
                  <span>{riskScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${getScoreColor(riskScore)}`}
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>
              </div>

              {recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="text-sm bg-orange-50 p-2 rounded border-l-4 border-orange-400">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">General Safety Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Never share personal information</li>
                  <li>• Verify sender through official channels</li>
                  <li>• Be cautious with urgent requests</li>
                  <li>• Report suspicious communications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RiskCalculator;
