
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Trophy, Star, CheckCircle, Lock, Play } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'scenario' | 'quiz' | 'analysis' | 'speed';
  reward: number;
  timeLimit?: number;
  startDate: string;
  endDate: string;
  participants: number;
  completed: boolean;
  progress: number;
  requirements: string[];
}

interface WeeklyChallengesProps {
  userProgress: any;
  onProgressUpdate: (progress: any) => void;
}

const WeeklyChallenges = ({ userProgress, onProgressUpdate }: WeeklyChallengesProps) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const currentChallenges: Challenge[] = [
    {
      id: 'week-1-2024',
      title: 'Romance Scam Specialist',
      description: 'Master the art of detecting romance scams with 5 challenging scenarios featuring dating app fraudsters.',
      difficulty: 'medium',
      type: 'scenario',
      reward: 50,
      timeLimit: 300,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 234,
      completed: false,
      progress: 60,
      requirements: ['Complete 5 romance scam scenarios', 'Achieve 80% accuracy', 'Finish within time limit']
    },
    {
      id: 'speed-challenge-1',
      title: 'Lightning Round',
      description: 'Quick-fire identification of fraud patterns. How many can you spot in 60 seconds?',
      difficulty: 'hard',
      type: 'speed',
      reward: 75,
      timeLimit: 60,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 189,
      completed: true,
      progress: 100,
      requirements: ['Identify 20+ fraud patterns', 'Complete in under 60 seconds', 'No mistakes allowed']
    },
    {
      id: 'analysis-master',
      title: 'Text Pattern Master',
      description: 'Analyze complex email and SMS samples to identify sophisticated fraud techniques.',
      difficulty: 'hard',
      type: 'analysis',
      reward: 100,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 156,
      completed: false,
      progress: 25,
      requirements: ['Analyze 10 complex samples', 'Identify all hidden patterns', 'Provide detailed explanations']
    }
  ];

  const upcomingChallenges: Challenge[] = [
    {
      id: 'week-2-2024',
      title: 'Investment Scam Detective',
      description: 'Spot fake investment opportunities and Ponzi schemes in this comprehensive challenge.',
      difficulty: 'medium',
      type: 'scenario',
      reward: 60,
      startDate: '2024-01-22',
      endDate: '2024-01-28',
      participants: 0,
      completed: false,
      progress: 0,
      requirements: ['Complete investment scam scenarios', 'Achieve 85% accuracy', 'Identify all red flags']
    },
    {
      id: 'community-challenge',
      title: 'Community Helper',
      description: 'Help 10 community members by providing feedback on their practice sessions.',
      difficulty: 'easy',
      type: 'quiz',
      reward: 30,
      startDate: '2024-01-22',
      endDate: '2024-01-28',
      participants: 0,
      completed: false,
      progress: 0,
      requirements: ['Provide helpful feedback', 'Rate at least 4/5 stars', 'Help 10 different users']
    }
  ];

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    // In a real implementation, this would start the challenge
    console.log('Starting challenge:', challenge.title);
  };

  const handleCompleteChallenge = (challenge: Challenge) => {
    // Update user progress
    onProgressUpdate({
      ...userProgress,
      score: userProgress.score + challenge.reward,
      completedScenarios: userProgress.completedScenarios + 1
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scenario': return '🎭';
      case 'quiz': return '❓';
      case 'analysis': return '🔍';
      case 'speed': return '⚡';
      default: return '📝';
    }
  };

  const isExpired = (endDate: string) => {
    return new Date() > new Date(endDate);
  };

  const daysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Weekly Challenges</h2>
        <p className="text-gray-600">
          Take on special challenges to test your skills and earn exclusive rewards
        </p>
      </div>

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Active Challenges</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">75</div>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <p className="text-sm text-gray-600">Days Left</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week's Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentChallenges.map((challenge) => (
              <Card key={challenge.id} className={`relative ${challenge.completed ? 'border-green-500' : ''}`}>
                {challenge.completed && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl mb-2">{getTypeIcon(challenge.type)}</div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {challenge.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {challenge.description}
                  </p>

                  {/* Progress */}
                  {challenge.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  )}

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                    <ul className="text-xs space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reward and Info */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{challenge.reward} points</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{daysLeft(challenge.endDate)} days left</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {challenge.participants} participants
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    {challenge.completed ? (
                      <div className="text-center text-sm text-green-600 font-medium">
                        ✅ Challenge Completed!
                      </div>
                    ) : challenge.progress > 0 ? (
                      <Button 
                        className="w-full bg-india-saffron hover:bg-saffron-600"
                        onClick={() => handleStartChallenge(challenge)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue Challenge
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-india-saffron hover:bg-saffron-600"
                        onClick={() => handleStartChallenge(challenge)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Challenge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingChallenges.map((challenge) => (
              <Card key={challenge.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl mb-2">{getTypeIcon(challenge.type)}</div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {challenge.type}
                        </Badge>
                      </div>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {challenge.description}
                  </p>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{challenge.reward} points</span>
                    </div>
                    <div className="text-gray-500">
                      Starts {new Date(challenge.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenge History */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Phishing Email Expert', completed: true, reward: 45, date: '2024-01-08' },
              { name: 'Call Center Scam Buster', completed: true, reward: 55, date: '2024-01-01' },
              { name: 'Social Media Fraud Hunter', completed: false, reward: 40, date: '2023-12-25' }
            ].map((challenge, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {challenge.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{challenge.name}</p>
                    <p className="text-sm text-gray-500">Ended {challenge.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  {challenge.completed ? (
                    <Badge className="bg-green-100 text-green-800">
                      +{challenge.reward} points
                    </Badge>
                  ) : (
                    <Badge variant="outline">Missed</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyChallenges;
