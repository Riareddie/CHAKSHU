
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import FraudSimulator from "@/components/education/interactive/FraudSimulator";
import ScoreTracker from "@/components/education/interactive/ScoreTracker";
import SampleAnalyzer from "@/components/education/interactive/SampleAnalyzer";
import ResultsDashboard from "@/components/education/interactive/ResultsDashboard";
import CertificationCenter from "@/components/education/interactive/CertificationCenter";
import Leaderboard from "@/components/education/interactive/Leaderboard";
import WeeklyChallenges from "@/components/education/interactive/WeeklyChallenges";
import TipsAndTricks from "@/components/education/interactive/TipsAndTricks";
import { Brain, Trophy, Target, BookOpen, Award, Users, Calendar, Lightbulb } from "lucide-react";

const EducationalTool = () => {
  const [userProgress, setUserProgress] = useState({
    level: 'beginner',
    score: 0,
    completedScenarios: 0,
    badges: [],
    certificates: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Fraud Education Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Master fraud detection through hands-on practice, real-world scenarios, and expert guidance.
            Progress through levels, earn certifications, and compete with others.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-india-saffron capitalize">{userProgress.level}</p>
                </div>
                <Brain className="h-8 w-8 text-india-saffron" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Score</p>
                  <p className="text-2xl font-bold text-green-600">{userProgress.score}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scenarios Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{userProgress.completedScenarios}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Badges Earned</p>
                  <p className="text-2xl font-bold text-purple-600">{userProgress.badges.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="samples" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Samples</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="certification" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Tips</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulator">
            <FraudSimulator userProgress={userProgress} onProgressUpdate={setUserProgress} />
          </TabsContent>

          <TabsContent value="samples">
            <SampleAnalyzer userProgress={userProgress} onProgressUpdate={setUserProgress} />
          </TabsContent>

          <TabsContent value="tracker">
            <ScoreTracker userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="dashboard">
            <ResultsDashboard userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="certification">
            <CertificationCenter userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="challenges">
            <WeeklyChallenges userProgress={userProgress} onProgressUpdate={setUserProgress} />
          </TabsContent>

          <TabsContent value="tips">
            <TipsAndTricks />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default EducationalTool;
