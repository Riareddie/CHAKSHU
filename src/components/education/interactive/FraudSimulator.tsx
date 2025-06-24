
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Volume2, Eye, Play } from "lucide-react";

interface FraudScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  type: 'call' | 'sms' | 'email' | 'investment';
  scenario: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  redFlags: string[];
  audioSample?: string;
  tips: string[];
}

const scenarios: FraudScenario[] = [
  {
    id: 'beginner-1',
    title: 'Bank Account Verification Call',
    description: 'A caller claims to be from your bank and needs to verify your account details.',
    difficulty: 'beginner',
    type: 'call',
    scenario: 'You receive a call: "Hello, this is Sarah from XYZ Bank security department. We\'ve detected suspicious activity on your account ending in 1234. To secure your account, I need you to verify your PIN and the CVV number on your card."',
    options: [
      {
        id: 'a',
        text: 'Provide the PIN and CVV to secure my account',
        isCorrect: false,
        explanation: 'Never share your PIN or CVV over the phone. Banks never ask for these details.'
      },
      {
        id: 'b',
        text: 'Hang up and call the bank directly using the number on my card',
        isCorrect: true,
        explanation: 'Correct! Always verify by calling the official number independently.'
      },
      {
        id: 'c',
        text: 'Ask for their employee ID and department',
        isCorrect: false,
        explanation: 'While this shows caution, fraudsters can provide fake credentials. Always call back directly.'
      },
      {
        id: 'd',
        text: 'Ask them to call back later',
        isCorrect: false,
        explanation: 'This doesn\'t solve the problem. The caller could still be a fraudster.'
      }
    ],
    redFlags: [
      'Asking for PIN/CVV over phone',
      'Creating urgency about account security',
      'Incoming call about account issues',
      'Requesting sensitive information'
    ],
    tips: [
      'Banks never ask for PINs or CVVs over the phone',
      'Always hang up and call the official number',
      'Be suspicious of urgent security claims'
    ]
  },
  {
    id: 'intermediate-1',
    title: 'Investment Opportunity SMS',
    description: 'You receive an SMS about a time-sensitive investment opportunity.',
    difficulty: 'intermediate',
    type: 'sms',
    scenario: 'SMS received: "🚀 URGENT: Limited time offer! Invest ₹10,000 today in crypto trading and get ₹50,000 in 7 days. Guaranteed returns! Click: bit.ly/cryptowin123 - Reply STOP to opt out"',
    options: [
      {
        id: 'a',
        text: 'Click the link to learn more about this opportunity',
        isCorrect: false,
        explanation: 'Never click suspicious links. This could install malware or steal your information.'
      },
      {
        id: 'b',
        text: 'Invest a smaller amount to test if it\'s legitimate',
        isCorrect: false,
        explanation: 'Any amount invested in such schemes is likely to be lost. No legitimate investment guarantees such returns.'
      },
      {
        id: 'c',
        text: 'Delete the message and report it as spam',
        isCorrect: true,
        explanation: 'Correct! This is clearly a scam. Guaranteed high returns are always fraudulent.'
      },
      {
        id: 'd',
        text: 'Reply STOP to opt out',
        isCorrect: false,
        explanation: 'Replying confirms your number is active and may result in more spam messages.'
      }
    ],
    redFlags: [
      'Guaranteed high returns',
      'Urgent time pressure',
      'Shortened URLs',
      'Unsolicited investment offers',
      'Too good to be true returns'
    ],
    tips: [
      'No legitimate investment guarantees specific returns',
      'Be wary of urgent investment offers',
      'Research any investment thoroughly before committing'
    ]
  }
];

interface FraudSimulatorProps {
  userProgress: any;
  onProgressUpdate: (progress: any) => void;
}

const FraudSimulator = ({ userProgress, onProgressUpdate }: FraudSimulatorProps) => {
  const [currentScenario, setCurrentScenario] = useState<FraudScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showRedFlags, setShowRedFlags] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);

  useEffect(() => {
    // Filter scenarios based on user level
    const availableScenarios = scenarios.filter(s => {
      if (userProgress.level === 'beginner') return s.difficulty === 'beginner';
      if (userProgress.level === 'intermediate') return s.difficulty === 'beginner' || s.difficulty === 'intermediate';
      return true; // expert can access all
    });
    
    if (availableScenarios.length > 0) {
      setCurrentScenario(availableScenarios[scenarioIndex % availableScenarios.length]);
    }
  }, [scenarioIndex, userProgress.level]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentScenario) return;

    const selectedAnswer = currentScenario.options.find(opt => opt.id === selectedOption);
    if (selectedAnswer?.isCorrect) {
      setSessionScore(prev => prev + 10);
      onProgressUpdate({
        ...userProgress,
        score: userProgress.score + 10,
        completedScenarios: userProgress.completedScenarios + 1
      });
    }
    setShowResult(true);
  };

  const handleNext = () => {
    setScenarioIndex(prev => prev + 1);
    setSelectedOption(null);
    setShowResult(false);
    setShowRedFlags(false);
  };

  const playAudioSample = () => {
    // In a real implementation, this would play the actual audio
    console.log('Playing audio sample for scenario:', currentScenario?.id);
  };

  const toggleRedFlags = () => {
    setShowRedFlags(!showRedFlags);
  };

  if (!currentScenario) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Loading scenarios...</p>
        </CardContent>
      </Card>
    );
  }

  const selectedAnswer = currentScenario.options.find(opt => opt.id === selectedOption);

  return (
    <div className="space-y-6">
      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Session Score</p>
              <p className="text-2xl font-bold text-green-600">{sessionScore}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Difficulty</p>
              <Badge className={
                currentScenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                currentScenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {currentScenario.difficulty}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Scenario Type</p>
              <Badge variant="outline" className="capitalize">
                {currentScenario.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Scenario */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{currentScenario.title}</CardTitle>
              <p className="text-gray-600 mt-2">{currentScenario.description}</p>
            </div>
            <div className="flex gap-2">
              {currentScenario.audioSample && (
                <Button variant="outline" size="sm" onClick={playAudioSample}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={toggleRedFlags}>
                <Eye className="w-4 h-4 mr-2" />
                Red Flags
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Text */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Scenario:</h3>
            <p className="text-gray-800">{currentScenario.scenario}</p>
          </div>

          {/* Red Flags (if shown) */}
          {showRedFlags && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-semibold mb-2">Red Flags to Watch For:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {currentScenario.redFlags.map((flag, index) => (
                    <li key={index} className="text-sm">{flag}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            <h3 className="font-semibold">What should you do?</h3>
            {currentScenario.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedOption === option.id
                    ? showResult
                      ? option.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-india-saffron bg-saffron-50"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                } ${showResult && option.isCorrect ? "border-green-500 bg-green-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  {showResult && (
                    <div>
                      {option.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : selectedOption === option.id ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result and Explanation */}
          {showResult && selectedAnswer && (
            <Alert className={selectedAnswer.isCorrect ? "border-green-500" : "border-red-500"}>
              <AlertDescription>
                <h4 className="font-semibold mb-2">
                  {selectedAnswer.isCorrect ? "Correct!" : "Incorrect"}
                </h4>
                <p className="mb-3">{selectedAnswer.explanation}</p>
                {currentScenario.tips.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-1">Expert Tips:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {currentScenario.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="bg-india-saffron hover:bg-saffron-600"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-india-saffron hover:bg-saffron-600">
                Next Scenario
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudSimulator;
