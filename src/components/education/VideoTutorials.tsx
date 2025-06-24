import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Bell, Play, Search } from "lucide-react";

const VideoTutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const tutorials = [
    {
      title: "How to Report Fraud - Step by Step",
      duration: "5:30",
      difficulty: "Beginner",
      description:
        "Complete walkthrough of the fraud reporting process on our platform",
      category: "Reporting Process",
      thumbnail:
        "https://images.pexels.com/photos/5355721/pexels-photo-5355721.jpeg",
      views: "12.3K",
      uploadDate: "2 weeks ago",
    },
    {
      title: "Identifying Phishing Emails",
      duration: "8:15",
      difficulty: "Beginner",
      description:
        "Learn to spot fake emails and protect your personal information",
      category: "Email Security",
      thumbnail:
        "https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg",
      views: "8.7K",
      uploadDate: "1 month ago",
    },
    {
      title: "UPI Fraud Prevention",
      duration: "6:45",
      difficulty: "Intermediate",
      description: "Stay safe while using digital payment methods",
      category: "Digital Payments",
      thumbnail:
        "https://images.pexels.com/photos/7621136/pexels-photo-7621136.jpeg",
      views: "15.2K",
      uploadDate: "3 weeks ago",
    },
    {
      title: "Investment Scam Red Flags",
      duration: "12:20",
      difficulty: "Advanced",
      description:
        "Recognize fraudulent investment schemes before you lose money",
      category: "Investment Security",
      thumbnail:
        "https://images.pexels.com/photos/7111619/pexels-photo-7111619.jpeg",
      views: "9.8K",
      uploadDate: "1 week ago",
    },
    {
      title: "Social Media Safety",
      duration: "7:40",
      difficulty: "Beginner",
      description: "Protect yourself from fraud on social media platforms",
      category: "Social Media",
      thumbnail:
        "https://images.pexels.com/photos/5475813/pexels-photo-5475813.jpeg",
      views: "11.5K",
      uploadDate: "2 months ago",
    },
    {
      title: "Senior Citizen Specific Scams",
      duration: "9:30",
      difficulty: "Beginner",
      description:
        "Common scams targeting elderly citizens and how to avoid them",
      category: "Senior Protection",
      thumbnail:
        "https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg",
      views: "6.4K",
      uploadDate: "1 month ago",
    },
  ];

  const categories = [
    "All",
    "Reporting Process",
    "Email Security",
    "Digital Payments",
    "Investment Security",
    "Social Media",
    "Senior Protection",
  ];

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory =
      selectedCategory === "All" || tutorial.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = async () => {
    if (!subscriberEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscriberEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Successfully Subscribed!",
      description: "You'll receive notifications about new video tutorials.",
    });

    setSubscriberEmail("");
    setIsSubscribing(false);
  };

  const handlePlayVideo = (tutorial: (typeof tutorials)[0]) => {
    toast({
      title: "Playing Video",
      description: `Now playing: "${tutorial.title}"`,
    });
  };

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Video Tutorials
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Watch step-by-step tutorials to learn fraud prevention techniques and
          understand the reporting process.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-india-saffron hover:bg-saffron-600"
                : ""
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {filteredTutorials.length} of {tutorials.length} tutorials
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {filteredTutorials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No tutorials found matching your criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-20 transition-all cursor-pointer"
                    onClick={() => handlePlayVideo(tutorial)}
                  >
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-india-saffron ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-black bg-opacity-70 text-white"
                    >
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-black bg-opacity-70 text-white text-xs"
                    >
                      {tutorial.views} views
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg leading-tight">
                      {tutorial.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {tutorial.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{tutorial.uploadDate}</span>
                    <span>{tutorial.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        tutorial.difficulty === "Beginner"
                          ? "secondary"
                          : tutorial.difficulty === "Intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {tutorial.difficulty}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handlePlayVideo(tutorial)}
                      className="bg-india-saffron hover:bg-saffron-600"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-india-saffron mr-2" />
              <h3 className="font-semibold">Subscribe for Updates</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get notified when new fraud prevention tutorials are available
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                disabled={isSubscribing}
              />
              <Button
                className="w-full bg-india-saffron hover:bg-saffron-600"
                onClick={handleSubscribe}
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe to Updates"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We'll only send you educational content and important security
              updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VideoTutorials;
