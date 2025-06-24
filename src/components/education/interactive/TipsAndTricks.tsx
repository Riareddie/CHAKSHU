
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Lightbulb, Search, BookOpen, Star, ThumbsUp, Share2, Filter, TrendingUp } from "lucide-react";

interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'phone' | 'sms' | 'email' | 'investment' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  author: string;
  likes: number;
  shares: number;
  tags: string[];
  helpful: boolean;
}

const TipsAndTricks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'helpful'>('popular');

  const tips: Tip[] = [
    {
      id: '1',
      title: 'The 60-Second Rule for Suspicious Calls',
      content: 'If a caller is pressuring you to act within 60 seconds, it\'s almost certainly a scam. Legitimate organizations never demand immediate action for financial matters. Always hang up and call the organization directly using a verified number.',
      category: 'phone',
      difficulty: 'beginner',
      author: 'CyberSecurity Expert',
      likes: 245,
      shares: 89,
      tags: ['urgency', 'pressure tactics', 'verification'],
      helpful: true
    },
    {
      id: '2',
      title: 'Grammar Check: A Simple Fraud Detector',
      content: 'Professional organizations have excellent grammar in their communications. Look for spelling errors, awkward phrasing, or poor grammar in emails and texts. Scammers often use automated translation tools that produce unnatural language.',
      category: 'email',
      difficulty: 'beginner',
      author: 'Fraud Prevention Specialist',
      likes: 198,
      shares: 67,
      tags: ['grammar', 'language patterns', 'email security'],
      helpful: true
    },
    {
      id: '3',
      title: 'The Link Preview Technique',
      content: 'Before clicking any link, hover over it (on desktop) or long-press (on mobile) to see the actual URL. Scammers use URL shorteners or domains that look similar to legitimate ones. Look for misspellings or unusual domains.',
      category: 'email',
      difficulty: 'intermediate',
      author: 'Tech Security Analyst',
      likes: 167,
      shares: 134,
      tags: ['links', 'urls', 'phishing', 'verification'],
      helpful: false
    },
    {
      id: '4',
      title: 'Investment Red Flags: The Trinity of Scams',
      content: 'Three phrases that should immediately raise red flags in investment offers: "Guaranteed returns", "Limited time only", and "Exclusive opportunity". Legitimate investments always carry risk and are never exclusive or time-limited.',
      category: 'investment',
      difficulty: 'intermediate',
      author: 'Financial Fraud Investigator',
      likes: 312,
      shares: 156,
      tags: ['investments', 'guarantees', 'ponzi schemes'],
      helpful: true
    },
    {
      id: '5',
      title: 'Voice Analysis: Detecting Stress Patterns',
      content: 'Listen for unnatural speech patterns in phone calls: overly fast talking, reading from a script, or background noise that doesn\'t match their claimed location. Many scammers work from call centers with poor audio quality.',
      category: 'phone',
      difficulty: 'expert',
      author: 'Voice Analysis Expert',
      likes: 89,
      shares: 23,
      tags: ['voice analysis', 'call centers', 'audio patterns'],
      helpful: false
    },
    {
      id: '6',
      title: 'The Two-Device Verification Method',
      content: 'When someone calls claiming to be from your bank, ask them to wait while you verify on a separate device. Real bank representatives will gladly wait. Scammers will pressure you to stay on the line and not verify independently.',
      category: 'phone',
      difficulty: 'intermediate',
      author: 'Banking Security Officer',
      likes: 203,
      shares: 91,
      tags: ['verification', 'banking', 'independence'],
      helpful: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tips', icon: '📚' },
    { id: 'phone', name: 'Phone Calls', icon: '📞' },
    { id: 'sms', name: 'SMS/Text', icon: '💬' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'investment', name: 'Investment', icon: '💰' },
    { id: 'general', name: 'General', icon: '🛡️' }
  ];

  const expertProfiles = [
    {
      name: 'Dr. Sarah Chen',
      title: 'Cybersecurity Researcher',
      expertise: 'Email Phishing & Social Engineering',
      tips: 12,
      likes: 1250,
      avatar: 'SC'
    },
    {
      name: 'Mike Rodriguez',
      title: 'Former FBI Fraud Investigator',
      expertise: 'Investment Scams & Financial Fraud',
      tips: 8,
      likes: 980,
      avatar: 'MR'
    },
    {
      name: 'Priya Sharma',
      title: 'Telecom Security Analyst',
      expertise: 'Call & SMS Fraud Detection',
      tips: 15,
      likes: 1430,
      avatar: 'PS'
    }
  ];

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.likes - a.likes;
      case 'recent': return b.id.localeCompare(a.id); // Simple ID-based sorting
      case 'helpful': return (b.helpful ? 1 : 0) - (a.helpful ? 1 : 0);
      default: return 0;
    }
  });

  const handleLike = (tipId: string) => {
    // In a real implementation, this would update the likes count
    console.log('Liked tip:', tipId);
  };

  const handleShare = (tip: Tip) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${tip.title}\n\n${tip.content}`);
      alert('Tip copied to clipboard!');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📝';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Expert Tips & Tricks</h2>
        <p className="text-gray-600">
          Learn from fraud prevention experts and master advanced detection techniques
        </p>
      </div>

      <Tabs defaultValue="tips" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tips">All Tips</TabsTrigger>
          <TabsTrigger value="experts">Expert Profiles</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="tips">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tips, techniques, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTips.map((tip) => (
              <Card key={tip.id} className="h-fit">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(tip.category)}</span>
                        <Badge className={getDifficultyColor(tip.difficulty)}>
                          {tip.difficulty}
                        </Badge>
                        {tip.helpful && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Helpful
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                      <p className="text-sm text-gray-600">by {tip.author}</p>
                    </div>
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{tip.content}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tip.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {tip.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {tip.shares}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(tip.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(tip)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertProfiles.map((expert, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-india-saffron rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                      {expert.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{expert.name}</h3>
                      <p className="text-sm text-gray-600">{expert.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{expert.expertise}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-india-saffron">{expert.tips}</div>
                        <p className="text-xs text-gray-600">Tips Shared</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{expert.likes}</div>
                        <p className="text-xs text-gray-600">Total Likes</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Tips
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTips.slice(0, 5).map((tip, index) => (
                  <div key={tip.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-india-saffron">#{index + 1}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{tip.title}</h3>
                      <p className="text-sm text-gray-600">by {tip.author}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{tip.likes} likes</span>
                        <span>{tip.shares} shares</span>
                        <Badge className={getDifficultyColor(tip.difficulty)}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TipsAndTricks;
