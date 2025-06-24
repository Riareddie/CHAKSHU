
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Brain, Trophy } from "lucide-react";

const FraudQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "You receive an SMS claiming your bank account will be blocked unless you click a link and verify your details. What should you do?",
      options: [
        "Click the link immediately to avoid account blocking",
        "Call your bank directly using the official number to verify",
        "Reply to the SMS asking for more information",
        "Forward the SMS to friends for advice"
      ],
      correct: 1,
      explanation: "Always contact your bank directly through official channels. Banks never ask for sensitive information via SMS links."
    },
    {
      id: 2,
      question: "A caller claims to be from Microsoft and says your computer is infected. They want remote access to fix it. What's the red flag?",
      options: [
        "Microsoft doesn't make unsolicited calls about computer problems",
        "They should ask for payment first",
        "They should send an email confirmation",
        "Nothing, this is normal procedure"
      ],
      correct: 0,
      explanation: "Microsoft and other tech companies never make unsolicited calls about computer issues. This is a classic tech support scam."
    },
    {
      id: 3,
      question: "You're on a dating app and your match asks for money for a family emergency after talking for a week. What should you do?",
      options: [
        "Send money immediately to help",
        "Ask for verification documents first",
        "Never send money to someone you haven't met in person",
        "Ask other friends what they think"
      ],
      correct: 2,
      explanation: "Romance scammers build emotional connections quickly then ask for money. Never send money to someone you haven't met in person."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: "Excellent! You're well-prepared against fraud.", color: "text-green-600" };
    if (percentage >= 60) return { message: "Good job! Keep learning about fraud prevention.", color: "text-yellow-600" };
    return { message: "Consider reviewing our educational materials.", color: "text-red-600" };
  };

  if (quizCompleted) {
    const scoreMessage = getScoreMessage();
    return (
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fraud Prevention Quiz
          </h2>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <div className="text-4xl font-bold text-india-saffron mb-2">
                {score} / {questions.length}
              </div>
              <div className={`text-lg ${scoreMessage.color}`}>
                {scoreMessage.message}
              </div>
            </div>
            <Button onClick={resetQuiz} className="bg-india-saffron hover:bg-saffron-600">
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Interactive Fraud Quiz
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Test your knowledge and learn to identify common fraud patterns.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-india-saffron" />
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            </div>
            <Badge variant="outline">
              Score: {score} / {currentQuestion + (showResult && selectedAnswer === questions[currentQuestion].correct ? 1 : 0)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-india-saffron h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === questions[currentQuestion].correct
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-india-saffron bg-saffron-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  } ${showResult && index === questions[currentQuestion].correct ? "border-green-500 bg-green-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <div>
                        {index === questions[currentQuestion].correct ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Explanation:</strong> {questions[currentQuestion].explanation}
                </p>
              </div>
            )}

            {!showResult && (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full mt-6 bg-india-saffron hover:bg-saffron-600"
              >
                Submit Answer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FraudQuiz;
