
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: string;
  badges: number;
  scenarios: number;
  streak: number;
  avatar: string;
  change: number; // +/- from last week
}

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const weeklyLeaders: LeaderboardEntry[] = [
    { rank: 1, username: 'FraudHunter2024', score: 1250, level: 'Expert', badges: 12, scenarios: 45, streak: 14, avatar: 'FH', change: 2 },
    { rank: 2, username: 'CyberGuardian', score: 1180, level: 'Expert', badges: 10, scenarios: 42, streak: 11, avatar: 'CG', change: -1 },
    { rank: 3, username: 'ScamDetective', score: 1120, level: 'Intermediate', badges: 8, scenarios: 38, streak: 9, avatar: 'SD', change: 3 },
    { rank: 4, username: 'SafetyFirst', score: 1050, level: 'Intermediate', badges: 7, scenarios: 35, streak: 7, avatar: 'SF', change: 0 },
    { rank: 5, username: 'TechWise', score: 980, level: 'Intermediate', badges: 6, scenarios: 32, streak: 5, avatar: 'TW', change: -2 },
    { rank: 6, username: 'AlertEagle', score: 920, level: 'Beginner', badges: 5, scenarios: 28, streak: 8, avatar: 'AE', change: 1 },
    { rank: 7, username: 'VigilantUser', score: 850, level: 'Beginner', badges: 4, scenarios: 25, streak: 3, avatar: 'VU', change: -1 },
    { rank: 8, username: 'YouCurrentUser', score: 780, level: 'Beginner', badges: 3, scenarios: 22, streak: 6, avatar: 'YU', change: 4 }
  ];

  const categories = [
    { 
      id: 'top-scorers', 
      title: 'Top Scorers', 
      icon: Trophy, 
      description: 'Highest overall scores',
      leaders: weeklyLeaders.sort((a, b) => b.score - a.score).slice(0, 10)
    },
    { 
      id: 'streaks', 
      title: 'Longest Streaks', 
      icon: Star, 
      description: 'Most consecutive days active',
      leaders: weeklyLeaders.sort((a, b) => b.streak - a.streak).slice(0, 10)
    },
    { 
      id: 'scenarios', 
      title: 'Scenario Masters', 
      icon: Award, 
      description: 'Most scenarios completed',
      leaders: weeklyLeaders.sort((a, b) => b.scenarios - a.scenarios).slice(0, 10)
    },
    { 
      id: 'rising', 
      title: 'Rising Stars', 
      icon: TrendingUp, 
      description: 'Biggest improvements this week',
      leaders: weeklyLeaders.sort((a, b) => b.change - a.change).slice(0, 10)
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <span className="text-green-600 text-xs">↗ +{change}</span>;
    if (change < 0) return <span className="text-red-600 text-xs">↘ {change}</span>;
    return <span className="text-gray-500 text-xs">→ 0</span>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Community Leaderboard</h2>
        <p className="text-gray-600">
          Compete with fraud detection experts worldwide and climb the rankings
        </p>
      </div>

      {/* Time Frame Selector */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {(['weekly', 'monthly', 'allTime'] as const).map((frame) => (
            <Button
              key={frame}
              variant={timeFrame === frame ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeFrame(frame)}
              className={timeFrame === frame ? 'bg-india-saffron hover:bg-saffron-600' : ''}
            >
              {frame === 'allTime' ? 'All Time' : frame.charAt(0).toUpperCase() + frame.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">🏆 This Week's Champions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end gap-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-20 h-16 bg-gray-200 rounded-t-lg flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-gray-600">2</span>
              </div>
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarFallback>{weeklyLeaders[1].avatar}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{weeklyLeaders[1].username}</p>
              <p className="text-lg font-bold text-gray-600">{weeklyLeaders[1].score}</p>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-t-lg flex items-center justify-center mb-2">
                <Crown className="w-8 h-8 text-yellow-800" />
              </div>
              <Avatar className="w-20 h-20 mx-auto mb-2">
                <AvatarFallback className="bg-yellow-100">{weeklyLeaders[0].avatar}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{weeklyLeaders[0].username}</p>
              <p className="text-xl font-bold text-yellow-600">{weeklyLeaders[0].score}</p>
              <Badge className="bg-yellow-100 text-yellow-800">Champion</Badge>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-20 h-12 bg-amber-600 rounded-t-lg flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarFallback>{weeklyLeaders[2].avatar}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{weeklyLeaders[2].username}</p>
              <p className="text-lg font-bold text-amber-600">{weeklyLeaders[2].score}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs defaultValue="top-scorers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="w-5 h-5" />
                  {category.title}
                </CardTitle>
                <p className="text-gray-600">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.leaders.map((leader, index) => (
                    <div
                      key={leader.username}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        leader.username === 'YouCurrentUser' 
                          ? 'bg-india-saffron bg-opacity-10 border border-india-saffron' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(leader.rank)}
                      </div>

                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{leader.avatar}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{leader.username}</p>
                          {leader.username === 'YouCurrentUser' && (
                            <Badge className="bg-india-saffron text-white">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Level: {leader.level}</span>
                          <span>{leader.badges} badges</span>
                          <span>{leader.scenarios} scenarios</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold">{leader.score}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getLevelColor(leader.level)}>
                            {leader.level}
                          </Badge>
                          {getChangeIndicator(leader.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Your Ranking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">#8</p>
              <p className="text-sm text-blue-700">Overall Rank</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">780</p>
              <p className="text-sm text-green-700">Total Score</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">6</p>
              <p className="text-sm text-purple-700">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">+4</p>
              <p className="text-sm text-orange-700">Rank Change</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
