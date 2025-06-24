
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const FraudIdentificationGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  const fraudTypes = [
    {
      title: "Phishing Scams",
      description: "Learn to identify fake emails, messages, and websites",
      indicators: ["Urgent language", "Suspicious links", "Grammar errors", "Unexpected requests"],
      example: "Email claiming your bank account will be closed unless you click a link",
      difficulty: "Common"
    },
    {
      title: "Investment Fraud",
      description: "Recognize fake investment opportunities and Ponzi schemes",
      indicators: ["Guaranteed returns", "Pressure to act fast", "Unlicensed advisors", "Complex structures"],
      example: "Promise of 50% returns in cryptocurrency with no risk",
      difficulty: "Advanced"
    },
    {
      title: "Romance Scams",
      description: "Identify fake relationships designed to steal money",
      indicators: ["Quick declarations of love", "Avoiding video calls", "Emergency money requests", "Foreign travel claims"],
      example: "Online partner asking for money for medical emergency",
      difficulty: "Intermediate"
    },
    {
      title: "Tech Support Scams",
      description: "Spot fake technical support calls and pop-ups",
      indicators: ["Unsolicited calls", "Pop-up warnings", "Request for remote access", "Immediate payment demands"],
      example: "Pop-up claiming your computer is infected and needs immediate fixing",
      difficulty: "Common"
    }
  ];

  const quizQuestions = [
    {
      question: "You receive an email from your bank asking you to verify your account by clicking a link. What should you do?",
      options: ["Click the link immediately", "Contact your bank directly", "Forward to friends", "Delete the email"],
      correct: 1
    },
    {
      question: "Someone online offers you a guaranteed 100% return on investment. This is likely:",
      options: ["A great opportunity", "Too good to be true", "Worth investigating", "A legitimate offer"],
      correct: 1
    }
  ];

  const handleQuizAnswer = (selectedOption: number) => {
    if (selectedOption === quizQuestions[currentStep].correct) {
      setScore(score + 1);
    }
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Interactive Fraud Identification Guide
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Master the art of spotting fraud with our interactive guide. Learn to recognize red flags and protect yourself from common scams.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {fraudTypes.map((fraud, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{fraud.title}</CardTitle>
                <Badge variant={fraud.difficulty === 'Common' ? 'secondary' : fraud.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                  {fraud.difficulty}
                </Badge>
              </div>
              <p className="text-gray-600">{fraud.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Red Flags:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {fraud.indicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-1">Example:</h4>
                  <p className="text-sm text-yellow-700">{fraud.example}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Knowledge Test</CardTitle>
          <Progress value={(currentStep / quizQuestions.length) * 100} className="w-full" />
        </CardHeader>
        <CardContent>
          {currentStep < quizQuestions.length ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{quizQuestions[currentStep].question}</h3>
              <div className="grid grid-cols-1 gap-3">
                {quizQuestions[currentStep].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start"
                    onClick={() => handleQuizAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-lg">Your Score: {score}/{quizQuestions.length}</p>
              <Button onClick={() => { setCurrentStep(0); setScore(0); }} className="mt-4">
                Retake Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default FraudIdentificationGuide;
