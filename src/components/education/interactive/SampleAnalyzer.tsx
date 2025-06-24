
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Pause, Volume2, MessageSquare, Mail, Phone, CreditCard } from "lucide-react";

interface Sample {
  id: string;
  type: 'call' | 'sms' | 'email' | 'website';
  title: string;
  content: string;
  audioUrl?: string;
  patterns: string[];
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
}

const samples: Sample[] = [
  {
    id: 'call-1',
    type: 'call',
    title: 'Fake Bank Security Call',
    content: 'Hello, this is Mike from HDFC Bank security department. We have detected some suspicious transactions on your account. For your security, I need to verify your debit card number and CVV to block any unauthorized access.',
    patterns: [
      'Claims to be from bank security',
      'Mentions suspicious transactions',
      'Asks for card details over phone',
      'Creates urgency for immediate action'
    ],
    riskLevel: 'high',
    explanation: 'This is a classic vishing (voice phishing) attempt. Banks never ask for card details over phone calls.'
  },
  {
    id: 'sms-1',
    type: 'sms',
    title: 'Lottery Scam Message',
    content: 'Congratulations! You have won ₹25,00,000 in the KBC lottery. To claim your prize, send your Aadhaar copy and pay processing fee of ₹5,000 to account 123456789. Contact: 9876543210',
    patterns: [
      'Unexpected lottery win announcement',
      'Requests personal documents',
      'Demands upfront payment',
      'Uses popular TV show name for credibility'
    ],
    riskLevel: 'high',
    explanation: 'This is a lottery scam. Legitimate lotteries never require upfront payments or personal documents via SMS.'
  },
  {
    id: 'email-1',
    type: 'email',
    title: 'Investment Scheme Email',
    content: 'Subject: Double Your Money in 30 Days - Guaranteed!\n\nDear Investor,\n\nI am offering an exclusive investment opportunity with 100% guaranteed returns. Invest any amount and get double the money back in just 30 days. This is a limited time offer for only 50 people.\n\nTransfer money to: Account No. 987654321, IFSC: SBIN0001234\n\nContact: invest.quick@gmail.com',
    patterns: [
      'Promises guaranteed returns',
      'Uses terms like "double your money"',
      'Creates artificial scarcity (limited to 50 people)',
      'Asks for immediate money transfer',
      'Uses unprofessional email address'
    ],
    riskLevel: 'high',
    explanation: 'This is a Ponzi scheme. No legitimate investment can guarantee 100% returns in such a short time.'
  }
];

interface SampleAnalyzerProps {
  userProgress: any;
  onProgressUpdate: (progress: any) => void;
}

const SampleAnalyzer = ({ userProgress, onProgressUpdate }: SampleAnalyzerProps) => {
  const [selectedSample, setSelectedSample] = useState<Sample>(samples[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [userAnalysis, setUserAnalysis] = useState<string[]>([]);

  const handlePatternSelect = (pattern: string) => {
    if (userAnalysis.includes(pattern)) {
      setUserAnalysis(prev => prev.filter(p => p !== pattern));
    } else {
      setUserAnalysis(prev => [...prev, pattern]);
    }
  };

  const handleSubmitAnalysis = () => {
    const correctPatterns = selectedSample.patterns.filter(p => userAnalysis.includes(p));
    const score = (correctPatterns.length / selectedSample.patterns.length) * 10;
    
    onProgressUpdate({
      ...userProgress,
      score: userProgress.score + Math.round(score)
    });
    
    setShowPatterns(true);
  };

  const playAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual audio playback
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'website': return <CreditCard className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Real Fraud Sample Analyzer</h2>
        <p className="text-gray-600">
          Practice identifying fraud patterns in real (anonymized) samples from actual scam attempts.
        </p>
      </div>

      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList>
          <TabsTrigger value="practice">Practice Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="audio">Audio Samples</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sample Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setSelectedSample(sample);
                      setShowPatterns(false);
                      setUserAnalysis([]);
                    }}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedSample.id === sample.id
                        ? "border-india-saffron bg-saffron-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(sample.type)}
                      <span className="font-medium">{sample.title}</span>
                    </div>
                    <Badge className={getRiskBadgeColor(sample.riskLevel)}>
                      {sample.riskLevel} risk
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Sample Content */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedSample.type)}
                      {selectedSample.title}
                    </CardTitle>
                    <Badge className={getRiskBadgeColor(selectedSample.riskLevel)}>
                      {selectedSample.riskLevel} risk
                    </Badge>
                  </div>
                  {selectedSample.type === 'call' && (
                    <Button variant="outline" onClick={playAudio}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play Audio'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Content */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Sample Content:</h3>
                  <p className="whitespace-pre-line text-gray-800">{selectedSample.content}</p>
                </div>

                {/* Pattern Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Identify Fraud Patterns:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSample.patterns.map((pattern, index) => (
                      <button
                        key={index}
                        onClick={() => handlePatternSelect(pattern)}
                        disabled={showPatterns}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          userAnalysis.includes(pattern)
                            ? "border-india-saffron bg-saffron-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                {!showPatterns && (
                  <Button
                    onClick={handleSubmitAnalysis}
                    className="bg-india-saffron hover:bg-saffron-600"
                    disabled={userAnalysis.length === 0}
                  >
                    Submit Analysis
                  </Button>
                )}

                {/* Results */}
                {showPatterns && (
                  <Alert>
                    <AlertDescription>
                      <h4 className="font-semibold mb-2">Analysis Results:</h4>
                      <p className="mb-3">{selectedSample.explanation}</p>
                      <div>
                        <h5 className="font-medium mb-2">Fraud Patterns Identified:</h5>
                        <div className="space-y-1">
                          {selectedSample.patterns.map((pattern, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                userAnalysis.includes(pattern) ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className="text-sm">{pattern}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Text Pattern Recognition Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Learn to identify common fraud patterns in text communications.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { pattern: 'Urgency Language', examples: ['Act now!', 'Limited time', 'Expires today'] },
                  { pattern: 'Authority Claims', examples: ['Bank security', 'Government official', 'Police'] },
                  { pattern: 'Too Good to True', examples: ['Guaranteed returns', 'Risk-free', '100% profit'] },
                  { pattern: 'Personal Info Requests', examples: ['Send Aadhaar', 'Share PIN', 'CVV needed'] },
                  { pattern: 'Payment Demands', examples: ['Pay processing fee', 'Transfer money', 'Send payment'] },
                  { pattern: 'Suspicious Links', examples: ['bit.ly/', 'tinyurl.com', 'Strange domains'] }
                ].map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{item.pattern}</h3>
                      <ul className="text-sm space-y-1">
                        {item.examples.map((example, i) => (
                          <li key={i} className="text-gray-600">• {example}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Fraud Samples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Listen to real fraud call recordings to understand voice patterns and tactics.
              </p>
              <div className="space-y-4">
                {samples.filter(s => s.type === 'call').map((sample) => (
                  <Card key={sample.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{sample.title}</h3>
                          <p className="text-sm text-gray-600">Practice identifying voice fraud patterns</p>
                        </div>
                        <Button variant="outline" onClick={playAudio}>
                          <Play className="w-4 h-4 mr-2" />
                          Play Sample
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SampleAnalyzer;
