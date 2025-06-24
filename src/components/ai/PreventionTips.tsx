
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Star, Share2, BookOpen, Shield } from 'lucide-react';

const PreventionTips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const aiGeneratedTips = [
    {
      id: 1,
      category: 'Phishing Protection',
      title: 'Verify Email Authenticity',
      tip: 'Always check the sender\'s email domain carefully. Fraudsters often use domains that look similar to legitimate ones (e.g., "gmai1.com" instead of "gmail.com").',
      confidence: 98,
      effectiveness: 'High',
      basedOn: '12,847 phishing cases analyzed',
      actionSteps: [
        'Hover over the sender\'s email without clicking',
        'Check for spelling errors in the domain name',
        'Verify through official company website',
        'Contact the organization directly if unsure'
      ]
    },
    {
      id: 2,
      category: 'Investment Scams',
      title: 'Research Before Investing',
      tip: 'Be extremely cautious of investment opportunities promising guaranteed high returns or requiring immediate action. Legitimate investments always involve risk.',
      confidence: 96,
      effectiveness: 'Very High',
      basedOn: '8,923 investment scam reports',
      actionSteps: [
        'Research the company\'s regulatory status',
        'Check with SEBI for authorized entities',
        'Ask for detailed documentation',
        'Consult with financial advisors'
      ]
    },
    {
      id: 3,
      category: 'Social Engineering',
      title: 'Protect Personal Information',
      tip: 'Never share sensitive information like OTPs, passwords, or bank details over phone or email, even if the caller claims to be from your bank.',
      confidence: 99,
      effectiveness: 'Critical',
      basedOn: '15,634 social engineering attempts',
      actionSteps: [
        'Banks never ask for OTPs or passwords',
        'Hang up and call official customer service',
        'Use official apps for banking transactions',
        'Enable two-factor authentication'
      ]
    },
    {
      id: 4,
      category: 'Online Shopping',
      title: 'Verify Website Security',
      tip: 'Always ensure websites use HTTPS encryption and check for security certificates before entering payment information.',
      confidence: 94,
      effectiveness: 'High',
      basedOn: '7,456 online fraud cases',
      actionSteps: [
        'Look for "https://" in the URL',
        'Check for padlock icon in browser',
        'Read customer reviews and ratings',
        'Use secure payment methods'
      ]
    },
    {
      id: 5,
      category: 'Prize/Lottery Scams',
      title: 'Question Unexpected Winnings',
      tip: 'Be suspicious of unexpected prize notifications, especially those requiring upfront payments or personal information to claim winnings.',
      confidence: 97,
      effectiveness: 'Very High',
      basedOn: '9,234 lottery scam reports',
      actionSteps: [
        'Remember: legitimate lotteries don\'t require fees',
        'Verify through official lottery websites',
        'Never pay to receive a prize',
        'Be wary of urgency tactics'
      ]
    },
    {
      id: 6,
      category: 'Tech Support Scams',
      title: 'Ignore Unsolicited Tech Support',
      tip: 'Microsoft, Apple, or other tech companies will never call you unsolicited about computer problems or security issues.',
      confidence: 100,
      effectiveness: 'Critical',
      basedOn: '4,567 tech support scam calls',
      actionSteps: [
        'Hang up on unsolicited tech support calls',
        'Never give remote access to your computer',
        'Contact official support if concerned',
        'Use legitimate antivirus software'
      ]
    }
  ];

  const categoryStats = [
    { category: 'Phishing Protection', tips: 23, effectiveness: 94 },
    { category: 'Investment Scams', tips: 18, effectiveness: 91 },
    { category: 'Social Engineering', tips: 31, effectiveness: 97 },
    { category: 'Online Shopping', tips: 15, effectiveness: 89 },
    { category: 'Prize/Lottery Scams', tips: 12, effectiveness: 95 },
    { category: 'Tech Support Scams', tips: 9, effectiveness: 98 }
  ];

  const generateNewTip = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % aiGeneratedTips.length);
      setIsGenerating(false);
    }, 1500);
  };

  const shareTip = () => {
    const tip = aiGeneratedTips[currentTip];
    if (navigator.share) {
      navigator.share({
        title: `Fraud Prevention Tip: ${tip.title}`,
        text: tip.tip,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${tip.title}: ${tip.tip}`);
      alert('Tip copied to clipboard!');
    }
  };

  const currentTipData = aiGeneratedTips[currentTip];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Generated Fraud Prevention Tips</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI analyzes millions of fraud cases to generate personalized, actionable prevention tips 
          based on the latest fraud patterns and successful prevention strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Tips</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2,847</div>
            <p className="text-xs text-muted-foreground">AI-created prevention tips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Effectiveness</CardTitle>
            <Star className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">94.2%</div>
            <p className="text-xs text-muted-foreground">User-reported success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">847K</div>
            <p className="text-xs text-muted-foreground">Fraud cases analyzed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  AI-Generated Prevention Tip
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareTip}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button 
                    onClick={generateNewTip} 
                    disabled={isGenerating}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'New Tip'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentTipData.category}
                </span>
                <span className="text-sm text-gray-600">
                  Based on {currentTipData.basedOn}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{currentTipData.title}</h3>
                <p className="text-gray-700 leading-relaxed">{currentTipData.tip}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">AI Confidence</div>
                  <div className="text-2xl font-bold text-green-700">{currentTipData.confidence}%</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Effectiveness</div>
                  <div className="text-lg font-bold text-purple-700">{currentTipData.effectiveness}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Action Steps:
                </h4>
                <ol className="space-y-2">
                  {currentTipData.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Tip Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-xs text-gray-600">{category.tips} tips</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${category.effectiveness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{category.effectiveness}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Tip Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {aiGeneratedTips.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentTip === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTip(index)}
                    className="text-xs"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            How AI Generates These Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Data Analysis</h4>
              <p className="text-sm text-gray-600">AI analyzes millions of fraud cases to identify patterns and successful prevention strategies</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Insight Generation</h4>
              <p className="text-sm text-gray-600">Machine learning models generate actionable insights based on fraud detection effectiveness</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Validation</h4>
              <p className="text-sm text-gray-600">Tips are validated against real-world scenarios and user feedback for effectiveness</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Continuous Learning</h4>
              <p className="text-sm text-gray-600">AI continuously learns from new fraud cases and user feedback to improve recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PreventionTips;
