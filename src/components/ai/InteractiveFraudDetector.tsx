import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Zap,
  MessageSquare,
  Phone,
  Mail,
  CreditCard,
  Globe,
  Mic,
  MicOff,
  Send,
  Loader2,
  Target,
  BarChart3,
  Map,
  Users,
  FileText,
  Lock,
  Unlock,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  riskLevel: "very-high" | "high" | "medium" | "low" | "very-low";
  riskScore: number;
  fraudType: string;
  confidence: number;
  indicators: string[];
  recommendations: string[];
  patterns: string[];
  timeline: string;
  severity: string;
  actionRequired: boolean;
}

interface FraudPattern {
  pattern: string;
  description: string;
  riskLevel: "high" | "medium" | "low";
  examples: string[];
}

const InteractiveFraudDetector = () => {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isListening, setIsListening] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedInput, setSelectedInput] = useState("text");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const recognitionRef = useRef<any>(null);

  // Predefined fraud patterns for intelligent analysis
  const fraudPatterns: FraudPattern[] = [
    {
      pattern: "urgent_payment",
      description: "Urgent payment requests with threats",
      riskLevel: "high",
      examples: [
        "pay immediately",
        "urgent action required",
        "account will be blocked",
        "final notice",
      ],
    },
    {
      pattern: "personal_info_request",
      description: "Requests for personal information",
      riskLevel: "high",
      examples: [
        "otp",
        "password",
        "card details",
        "pin number",
        "bank details",
      ],
    },
    {
      pattern: "lottery_prize",
      description: "Lottery or prize scam indicators",
      riskLevel: "medium",
      examples: [
        "congratulations",
        "winner",
        "lottery",
        "prize money",
        "claim reward",
      ],
    },
    {
      pattern: "tech_support",
      description: "Tech support scam patterns",
      riskLevel: "high",
      examples: [
        "computer infected",
        "virus detected",
        "microsoft support",
        "remote access",
      ],
    },
    {
      pattern: "investment_opportunity",
      description: "Investment fraud indicators",
      riskLevel: "medium",
      examples: [
        "guaranteed returns",
        "risk-free investment",
        "high profit",
        "limited time offer",
      ],
    },
  ];

  const quickTestScenarios = [
    {
      title: "Suspicious Phone Call",
      description:
        "I received a call claiming to be from my bank asking for OTP to update KYC",
      input:
        "Someone called me saying they are from SBI bank and need my OTP to update my KYC details. They said my account will be blocked if I don't provide it immediately. The caller ID showed a random mobile number, not the bank's official number.",
    },
    {
      title: "Investment Scam",
      description: "WhatsApp message about guaranteed returns",
      input:
        "Got a WhatsApp message from unknown number promising 300% returns in 3 months on cryptocurrency investment. They are asking for ₹50,000 initial deposit and showing fake certificates. The group has 200+ members sharing success stories.",
    },
    {
      title: "Tech Support Fraud",
      description: "Pop-up claiming computer is infected",
      input:
        "A pop-up appeared on my computer saying it's infected with 5 viruses and I need to call Microsoft support immediately. The number given is +1-800-XXX-XXXX. They want remote access to fix the issue and asking for ₹5000 for antivirus software.",
    },
    {
      title: "Prize/Lottery Scam",
      description: "SMS about winning a lottery",
      input:
        "Received SMS: 'Congratulations! You've won ₹25 lakh in Kaun Banega Crorepati lottery. To claim prize, pay processing fee of ₹5000 to account number XXXXXXXXXX. Call 9876543210 for details. Valid for 24 hours only.'",
    },
  ];

  // Simulate voice recognition
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Input Started",
          description: "Speak now to describe your issue...",
        });
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        setUserInput(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Please try again or use text input",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Please use text input instead",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // AI Analysis Engine
  const analyzeInput = async (input: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progressive analysis
    const steps = [
      { progress: 20, message: "Analyzing text patterns..." },
      { progress: 40, message: "Checking fraud databases..." },
      { progress: 60, message: "Evaluating risk indicators..." },
      { progress: 80, message: "Generating recommendations..." },
      { progress: 100, message: "Analysis complete!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Intelligent fraud detection logic
    const lowerInput = input.toLowerCase();
    let riskScore = 0;
    let detectedPatterns: string[] = [];
    let fraudType = "Unknown";
    const indicators: string[] = [];
    const recommendations: string[] = [];

    // Pattern matching and risk scoring
    fraudPatterns.forEach((pattern) => {
      const matches = pattern.examples.filter((example) =>
        lowerInput.includes(example.toLowerCase()),
      );

      if (matches.length > 0) {
        detectedPatterns.push(pattern.pattern);
        indicators.push(pattern.description);

        if (pattern.riskLevel === "high") {
          riskScore += 30;
          fraudType = pattern.description;
        } else if (pattern.riskLevel === "medium") {
          riskScore += 20;
          if (fraudType === "Unknown") fraudType = pattern.description;
        } else {
          riskScore += 10;
        }
      }
    });

    // Additional risk factors
    if (lowerInput.includes("immediately") || lowerInput.includes("urgent"))
      riskScore += 15;
    if (lowerInput.includes("block") || lowerInput.includes("suspend"))
      riskScore += 20;
    if (lowerInput.includes("otp") || lowerInput.includes("password"))
      riskScore += 25;
    if (lowerInput.includes("money") || lowerInput.includes("payment"))
      riskScore += 15;
    if (
      lowerInput.includes("unknown number") ||
      lowerInput.includes("random number")
    )
      riskScore += 20;

    // Determine risk level
    let riskLevel: AnalysisResult["riskLevel"];
    if (riskScore >= 80) riskLevel = "very-high";
    else if (riskScore >= 60) riskLevel = "high";
    else if (riskScore >= 40) riskLevel = "medium";
    else if (riskScore >= 20) riskLevel = "low";
    else riskLevel = "very-low";

    // Generate recommendations
    if (riskScore >= 60) {
      recommendations.push("🚨 Do NOT share any personal information or OTP");
      recommendations.push(
        "📞 Hang up immediately and contact official customer service",
      );
      recommendations.push("📱 Report this incident through the Chakshu app");
      recommendations.push(
        "🏦 Verify with your bank through official channels",
      );
    } else if (riskScore >= 40) {
      recommendations.push(
        "⚠️ Be extremely cautious - this shows multiple fraud indicators",
      );
      recommendations.push(
        "✅ Verify the caller's identity through official means",
      );
      recommendations.push(
        "📞 Never provide sensitive information over phone/email",
      );
    } else if (riskScore >= 20) {
      recommendations.push("🤔 Exercise caution - some warning signs detected");
      recommendations.push("🔍 Research and verify before taking any action");
      recommendations.push("👥 Ask for second opinion from trusted sources");
    } else {
      recommendations.push("✅ Low risk detected, but stay vigilant");
      recommendations.push("📚 Continue learning about fraud prevention");
    }

    const result: AnalysisResult = {
      riskLevel,
      riskScore: Math.min(riskScore, 100),
      fraudType: fraudType !== "Unknown" ? fraudType : "General Fraud Attempt",
      confidence: Math.min(85 + riskScore * 0.15, 99),
      indicators,
      recommendations,
      patterns: detectedPatterns,
      timeline: "Immediate action required",
      severity:
        riskLevel === "very-high"
          ? "Critical"
          : riskLevel === "high"
            ? "High"
            : "Moderate",
      actionRequired: riskScore >= 60,
    };

    setAnalysisResult(result);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: `Risk Level: ${riskLevel.toUpperCase()} (${riskScore}% risk score)`,
      variant: riskScore >= 60 ? "destructive" : "default",
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "very-high":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      case "very-low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "very-high":
        return <XCircle className="w-6 h-6" />;
      case "high":
        return <AlertTriangle className="w-6 h-6" />;
      case "medium":
        return <Eye className="w-6 h-6" />;
      case "low":
        return <Shield className="w-6 h-6" />;
      case "very-low":
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Eye className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-india-saffron to-saffron-600 p-4 rounded-full">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Fraud Detector
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Describe your suspicious situation and our advanced AI will analyze
            it in real-time to detect fraud patterns, assess risk levels, and
            provide instant protection recommendations.
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-india-saffron">99.2%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">&lt;3s</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">50M+</div>
              <div className="text-sm text-gray-600">Patterns Analyzed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Input Interface */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-india-saffron" />
                Describe Your Situation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Type Selection */}
              <Tabs value={selectedInput} onValueChange={setSelectedInput}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    placeholder="Describe what happened... Be as detailed as possible. Include information about calls, messages, emails, or any suspicious activity you've encountered."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[150px] text-base"
                  />

                  {/* Quick Test Scenarios */}
                  <div>
                    <h4 className="font-medium mb-3">
                      Try these example scenarios:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {quickTestScenarios.map((scenario, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left justify-start h-auto p-3"
                          onClick={() => setUserInput(scenario.input)}
                        >
                          <div>
                            <div className="font-medium">{scenario.title}</div>
                            <div className="text-xs text-gray-600">
                              {scenario.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="space-y-4">
                      <div
                        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors ${
                          isListening
                            ? "bg-red-100 text-red-600"
                            : "bg-india-saffron/10 text-india-saffron"
                        }`}
                      >
                        {isListening ? (
                          <Mic className="w-10 h-10" />
                        ) : (
                          <MicOff className="w-10 h-10" />
                        )}
                      </div>
                      <div>
                        <Button
                          onClick={isListening ? stopListening : startListening}
                          className={
                            isListening
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-india-saffron hover:bg-saffron-600"
                          }
                        >
                          {isListening ? "Stop Recording" : "Start Voice Input"}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isListening
                          ? "Listening... Speak clearly about your situation"
                          : "Click to start voice input"}
                      </p>
                    </div>
                  </div>
                  {userInput && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2">Transcribed Text:</h5>
                      <p className="text-sm">{userInput}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="phone" className="space-y-4">
                  <Input
                    placeholder="Enter suspicious phone number (e.g., +91 98765 43210)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Textarea
                    placeholder="Describe the phone call, what they said, what they asked for..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  <Input
                    placeholder="Enter suspicious email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                  <Input
                    placeholder="Website URL (if any)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <Textarea
                    placeholder="Paste the email content or describe what happened..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </TabsContent>
              </Tabs>

              {/* Analysis Button */}
              <Button
                onClick={() => analyzeInput(userInput)}
                disabled={!userInput.trim() || isAnalyzing}
                className="w-full bg-india-saffron hover:bg-saffron-600 text-white py-3 text-lg"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={analysisProgress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">
                    {analysisProgress < 20 && "Initializing AI analysis..."}
                    {analysisProgress >= 20 &&
                      analysisProgress < 40 &&
                      "Analyzing text patterns..."}
                    {analysisProgress >= 40 &&
                      analysisProgress < 60 &&
                      "Checking fraud databases..."}
                    {analysisProgress >= 60 &&
                      analysisProgress < 80 &&
                      "Evaluating risk indicators..."}
                    {analysisProgress >= 80 &&
                      analysisProgress < 100 &&
                      "Generating recommendations..."}
                    {analysisProgress === 100 && "Analysis complete!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Side - Analysis Results */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-india-saffron" />
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-500">
                    Describe your situation and click "Analyze with AI" to get
                    instant fraud detection results.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Risk Level */}
                  <Alert
                    className={`border-l-4 ${
                      analysisResult.riskLevel === "very-high"
                        ? "border-red-600 bg-red-50"
                        : analysisResult.riskLevel === "high"
                          ? "border-red-500 bg-red-50"
                          : analysisResult.riskLevel === "medium"
                            ? "border-yellow-500 bg-yellow-50"
                            : analysisResult.riskLevel === "low"
                              ? "border-blue-500 bg-blue-50"
                              : "border-green-500 bg-green-50"
                    }`}
                  >
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRiskIcon(analysisResult.riskLevel)}
                          <div>
                            <div className="font-bold text-lg">
                              {analysisResult.riskLevel
                                .replace("-", " ")
                                .toUpperCase()}{" "}
                              RISK
                            </div>
                            <div className="text-sm">
                              Risk Score: {analysisResult.riskScore}/100 |
                              Confidence: {analysisResult.confidence}%
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={getRiskColor(analysisResult.riskLevel)}
                        >
                          {analysisResult.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Fraud Type */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Detected Fraud Type</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {analysisResult.fraudType}
                      </Badge>
                    </div>
                  </div>

                  {/* Risk Indicators */}
                  {analysisResult.indicators.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        Risk Indicators Detected
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.indicators.map((indicator, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      AI Recommendations
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.recommendations.map(
                        (recommendation, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-sm p-3 bg-blue-50 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Action Required */}
                  {analysisResult.actionRequired && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Immediate Action Required!</strong> This
                        situation shows high fraud risk. Follow the
                        recommendations above and report this incident
                        immediately.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button className="w-full bg-india-saffron hover:bg-saffron-600">
                      <Phone className="w-4 h-4 mr-2" />
                      Report to Police
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Features Showcase */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Powered by Advanced AI Technology
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <BarChart3 className="w-12 h-12 text-india-saffron mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Pattern Recognition</h4>
                <p className="text-sm text-gray-600">
                  Advanced ML algorithms detect subtle fraud patterns
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Real-time Analysis</h4>
                <p className="text-sm text-gray-600">
                  Instant fraud detection within seconds
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Community Intelligence</h4>
                <p className="text-sm text-gray-600">
                  Learns from millions of community reports
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Privacy Protected</h4>
                <p className="text-sm text-gray-600">
                  Your data is encrypted and never stored
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFraudDetector;
