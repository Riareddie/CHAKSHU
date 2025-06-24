
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Play, Search, Settings, Clock, User, Shield, FileText } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  views: number;
  progress?: number;
}

const VideoLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const videos: Video[] = [
    {
      id: '1',
      title: 'How to Report Fraud: Step-by-Step Guide',
      description: 'Complete walkthrough of the fraud reporting process from start to finish.',
      duration: '8:45',
      category: 'Reporting',
      thumbnail: '/placeholder.svg',
      difficulty: 'Beginner',
      views: 1248,
      progress: 65
    },
    {
      id: '2',
      title: 'Creating Your Account and Setting Up Profile',
      description: 'Learn how to create an account, verify your email, and set up your profile.',
      duration: '5:20',
      category: 'Account',
      thumbnail: '/placeholder.svg',
      difficulty: 'Beginner',
      views: 892,
      progress: 100
    },
    {
      id: '3',
      title: 'Identifying Phishing Emails and Fake Websites',
      description: 'Advanced techniques to spot fraudulent emails and malicious websites.',
      duration: '12:30',
      category: 'Fraud Training',
      thumbnail: '/placeholder.svg',
      difficulty: 'Intermediate',
      views: 2156,
    },
    {
      id: '4',
      title: 'Mobile App Features and Navigation',
      description: 'Complete guide to using the mobile application for fraud reporting.',
      duration: '7:15',
      category: 'Technical',
      thumbnail: '/placeholder.svg',
      difficulty: 'Beginner',
      views: 567,
    },
    {
      id: '5',
      title: 'Understanding Investigation Process',
      description: 'What happens after you submit a report and how investigations work.',
      duration: '9:40',
      category: 'Reporting',
      thumbnail: '/placeholder.svg',
      difficulty: 'Intermediate',
      views: 1023,
      progress: 30
    },
    {
      id: '6',
      title: 'Advanced Security Best Practices',
      description: 'Comprehensive security measures to protect yourself from fraud.',
      duration: '15:25',
      category: 'Fraud Training',
      thumbnail: '/placeholder.svg',
      difficulty: 'Advanced',
      views: 789,
    }
  ];

  const categories = ['all', 'Reporting', 'Account', 'Technical', 'Fraud Training'];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reporting': return <FileText className="h-4 w-4" />;
      case 'Account': return <User className="h-4 w-4" />;
      case 'Technical': return <Settings className="h-4 w-4" />;
      case 'Fraud Training': return <Shield className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Video Tutorial Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredVideos.length} videos found
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover bg-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button 
                  size="lg" 
                  className="rounded-full"
                  onClick={() => setPlayingVideo(video.id)}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
              {video.progress && (
                <div className="absolute bottom-0 left-0 right-0">
                  <Progress value={video.progress} className="h-1" />
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  {getCategoryIcon(video.category)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {video.views.toLocaleString()} views
                  </span>
                </div>
                
                {video.progress ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{video.progress}%</span>
                    </div>
                    <Progress value={video.progress} className="h-2" />
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full">
                    Start Watching
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500 mb-4">No videos found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Player Modal would go here in a real implementation */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPlayingVideo(null)}>
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Video Player would be here</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <h3 className="font-semibold">
                {videos.find(v => v.id === playingVideo)?.title}
              </h3>
              <Button variant="outline" onClick={() => setPlayingVideo(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;
