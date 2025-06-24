
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Target, TrendingUp, Star, Medal } from "lucide-react";

interface ScoreTrackerProps {
  userProgress: any;
}

const ScoreTracker = ({ userProgress }: ScoreTrackerProps) => {
  const badges = [
    { id: 'first-scenario', name: 'First Steps', description: 'Completed your first scenario', icon: Star, earned: userProgress.completedScenarios >= 1 },
    { id: 'five-scenarios', name: 'Getting Started', description: 'Completed 5 scenarios', icon: Target, earned: userProgress.completedScenarios >= 5 },
    { id: 'ten-scenarios', name: 'Fraud Fighter', description: 'Completed 10 scenarios', icon: Award, earned: userProgress.completedScenarios >= 10 },
    { id: 'perfect-score', name: 'Perfect Score', description: 'Got 100% in a scenario', icon: Trophy, earned: userProgress.score >= 100 },
    { id: 'intermediate', name: 'Intermediate Level', description: 'Reached intermediate level', icon: TrendingUp, earned: userProgress.level !== 'beginner' },
    { id: 'expert', name: 'Expert Level', description: 'Reached expert level', icon: Medal, earned: userProgress.level === 'expert' }
  ];

  const achievements = [
    { title: 'Scenarios Completed', value: userProgress.completedScenarios, target: 20, unit: '' },
    { title: 'Total Score', value: userProgress.score, target: 500, unit: 'pts' },
    { title: 'Current Level', value: userProgress.level, target: 'expert', unit: '' },
    { title: 'Badges Earned', value: badges.filter(b => b.earned).length, target: badges.length, unit: '' }
  ];

  const getProgressPercentage = (value: number | string, target: number | string) => {
    if (typeof value === 'string' && typeof target === 'string') {
      const levels = ['beginner', 'intermediate', 'expert'];
      return (levels.indexOf(value) / (levels.length - 1)) * 100;
    }
    return Math.min((Number(value) / Number(target)) * 100, 100);
  };

  const getLevelInfo = () => {
    switch (userProgress.level) {
      case 'beginner':
        return { next: 'intermediate', requirement: '5 scenarios completed', progress: (userProgress.completedScenarios / 5) * 100 };
      case 'intermediate':
        return { next: 'expert', requirement: '15 scenarios completed', progress: (userProgress.completedScenarios / 15) * 100 };
      case 'expert':
        return { next: 'master', requirement: 'All scenarios completed', progress: 100 };
      default:
        return { next: 'intermediate', requirement: '5 scenarios completed', progress: 0 };
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Your Progress Tracker</h2>
        <p className="text-gray-600">
          Track your journey to becoming a fraud detection expert
        </p>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold capitalize">Current Level: {userProgress.level}</h3>
              {userProgress.level !== 'expert' && (
                <p className="text-sm text-gray-600">Next level: {levelInfo.next}</p>
              )}
            </div>
            <Badge className="bg-india-saffron text-white capitalize">
              {userProgress.level}
            </Badge>
          </div>
          {userProgress.level !== 'expert' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {levelInfo.next}</span>
                <span>{Math.round(levelInfo.progress)}%</span>
              </div>
              <Progress value={levelInfo.progress} className="h-2" />
              <p className="text-sm text-gray-600">{levelInfo.requirement}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{achievement.title}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-india-saffron">
                    {typeof achievement.value === 'string' ? achievement.value : achievement.value}
                  </span>
                  {achievement.unit && (
                    <span className="text-sm text-gray-600">{achievement.unit}</span>
                  )}
                </div>
                {typeof achievement.value === 'number' && typeof achievement.target === 'number' && (
                  <div className="space-y-1">
                    <Progress 
                      value={getProgressPercentage(achievement.value, achievement.target)} 
                      className="h-1" 
                    />
                    <p className="text-xs text-gray-500">
                      {achievement.value} / {achievement.target}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Badges and Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Badges & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border ${
                    badge.earned 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${
                      badge.earned ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className={`font-semibold ${
                        badge.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {badge.name}
                      </h3>
                      <p className={`text-sm ${
                        badge.earned ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {badge.description}
                      </p>
                      {badge.earned && (
                        <Badge className="mt-1 bg-yellow-500 text-white">
                          Earned!
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const score = Math.floor(Math.random() * 50); // Mock data
              return (
                <div key={day} className="text-center">
                  <p className="text-sm text-gray-600 mb-2">{day}</p>
                  <div 
                    className="h-16 bg-india-saffron rounded" 
                    style={{ opacity: score / 50 }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{score}pts</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreTracker;
