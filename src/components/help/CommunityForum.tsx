
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, MessageSquare, Star, Users, Search } from "lucide-react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  upvotes: number;
  downvotes: number;
  replies: number;
  isBestAnswer: boolean;
  createdAt: Date;
  tags: string[];
}

const CommunityForum = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'How to identify cryptocurrency scams?',
      content: 'I recently received an email about a cryptocurrency investment opportunity. How can I verify if this is legitimate?',
      author: 'SecureUser123',
      category: 'Fraud Prevention',
      upvotes: 24,
      downvotes: 2,
      replies: 8,
      isBestAnswer: true,
      createdAt: new Date('2024-06-08'),
      tags: ['cryptocurrency', 'email-scam', 'verification']
    },
    {
      id: '2',
      title: 'Reporting process feedback',
      content: 'The new reporting interface is much easier to use. Thank you for the improvements!',
      author: 'HappyReporter',
      category: 'Platform Feedback',
      upvotes: 15,
      downvotes: 0,
      replies: 3,
      isBestAnswer: false,
      createdAt: new Date('2024-06-07'),
      tags: ['feedback', 'ui-improvement']
    },
    {
      id: '3',
      title: 'Phishing email templates to watch out for',
      content: 'Sharing common phishing email patterns I\'ve encountered. Please add your own experiences below.',
      author: 'CyberAware',
      category: 'Fraud Prevention',
      upvotes: 32,
      downvotes: 1,
      replies: 12,
      isBestAnswer: true,
      createdAt: new Date('2024-06-06'),
      tags: ['phishing', 'email', 'patterns']
    }
  ]);

  const categories = ['all', 'Fraud Prevention', 'Platform Feedback', 'Technical Support', 'General Discussion'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVote = (postId: string, isUpvote: boolean) => {
    if (votedPosts.has(postId)) return;
    
    setVotedPosts(prev => new Set([...prev, postId]));
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            upvotes: isUpvote ? post.upvotes + 1 : post.upvotes,
            downvotes: !isUpvote ? post.downvotes + 1 : post.downvotes
          }
        : post
    ));
  };

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.category) return;

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'CurrentUser',
      category: newPost.category,
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      isBestAnswer: false,
      createdAt: new Date(),
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: '', tags: '' });
    setShowCreatePost(false);
  };

  if (showCreatePost) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Create New Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's your question or topic?"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <select 
              value={newPost.category}
              onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe your question or share your knowledge..."
              rows={5}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input
              value={newPost.tags}
              onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="fraud, phishing, cryptocurrency"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCreatePost} className="flex-1">
              Post
            </Button>
            <Button variant="outline" onClick={() => setShowCreatePost(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Forum
          </div>
          <Button onClick={() => setShowCreatePost(true)} size="sm">
            New Post
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts..."
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
            {filteredPosts.length} posts found
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      {post.isBestAnswer && (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Best Answer
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{post.author}</span>
                      </div>
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-gray-500">
                        {post.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700">{post.content}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(post.id, true)}
                        disabled={votedPosts.has(post.id)}
                        className="h-8 px-2"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {post.upvotes}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(post.id, false)}
                        disabled={votedPosts.has(post.id)}
                        className="h-8 px-2"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        {post.downvotes}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                      {post.replies} replies
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    View Discussion
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No posts found matching your criteria.</p>
              <Button onClick={() => setShowCreatePost(true)}>
                Start a Discussion
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityForum;
