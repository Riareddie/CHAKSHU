import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Verified,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Heart,
} from "lucide-react";

const EnhancedUserReviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState("all");

  const overallStats = {
    averageRating: 4.8,
    totalReviews: 25847,
    ratingDistribution: [
      { stars: 5, count: 18902, percentage: 73 },
      { stars: 4, count: 5169, percentage: 20 },
      { stars: 3, count: 1292, percentage: 5 },
      { stars: 2, count: 259, percentage: 1 },
      { stars: 1, count: 225, percentage: 1 },
    ],
  };

  const featuredReviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      avatar: "/placeholder.svg",
      rating: 5,
      title: "Saved me from a ₹50,000 fraud!",
      review:
        "This app is literally a lifesaver! I received a call claiming to be from my bank asking for OTP. The app immediately flagged it as a fraud number and showed me 47 similar reports. I didn't share the OTP and saved my entire salary from being stolen. Thank you Chakshu team!",
      date: "2 days ago",
      helpful: 234,
      verified: true,
      category: "Phone Call Fraud",
      saved: "₹50,000",
      features: ["Real-time caller ID", "Community alerts"],
      platform: "Android",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      avatar: "/placeholder.svg",
      rating: 5,
      title: "Amazing offline feature!",
      review:
        "I was traveling in a remote area with poor network when I received a suspicious call. The offline drafting feature allowed me to document everything and submit the report as soon as I got connectivity. The call recording integration provided solid evidence for police action.",
      date: "1 week ago",
      helpful: 189,
      verified: true,
      category: "Tech Support Scam",
      saved: "₹25,000",
      features: ["Offline mode", "Call recording"],
      platform: "iOS",
    },
    {
      id: 3,
      name: "Anjali Patel",
      location: "Bangalore, Karnataka",
      avatar: "/placeholder.svg",
      rating: 5,
      title: "Community power in action!",
      review:
        "GPS location sharing helped authorities track down an entire fraud network operating in my area. Within 3 days of my report, 5 fraudsters were arrested. The real-time community alerts kept me updated throughout the investigation process.",
      date: "2 weeks ago",
      helpful: 298,
      verified: true,
      category: "Investment Fraud",
      saved: "₹75,000",
      features: ["GPS sharing", "Community network"],
      platform: "Android",
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Chennai, Tamil Nadu",
      avatar: "/placeholder.svg",
      rating: 5,
      title: "AI detection is phenomenal!",
      review:
        "The AI-powered fraud detection warned me about a WhatsApp lottery scam before I even opened the message. The app analyzed the sender's pattern and immediately showed a fraud alert. Saved me from clicking malicious links!",
      date: "3 weeks ago",
      helpful: 156,
      verified: true,
      category: "Digital Fraud",
      saved: "₹15,000",
      features: ["AI detection", "WhatsApp integration"],
      platform: "Android",
    },
    {
      id: 5,
      name: "Meera Reddy",
      location: "Hyderabad, Telangana",
      avatar: "/placeholder.svg",
      rating: 4,
      title: "Excellent app with room for improvement",
      review:
        "Love the one-tap reporting and push notifications. The multi-language support in Telugu is fantastic for my parents. Only suggestion would be to add voice commands for elderly users who might struggle with touch interface.",
      date: "1 month ago",
      helpful: 87,
      verified: true,
      category: "General Experience",
      saved: "₹0",
      features: ["Multi-language", "Push notifications"],
      platform: "Android",
    },
    {
      id: 6,
      name: "Arjun Gupta",
      location: "Pune, Maharashtra",
      avatar: "/placeholder.svg",
      rating: 5,
      title: "Professional fraud protection",
      review:
        "As a business owner, I receive many calls daily. This app's caller ID feature has been invaluable in identifying potential business fraud calls. The detailed fraud patterns database helped me educate my entire team about common business scams.",
      date: "1 month ago",
      helpful: 145,
      verified: true,
      category: "Business Protection",
      saved: "₹200,000",
      features: ["Business mode", "Team sharing"],
      platform: "iOS",
    },
  ];

  const quickStats = [
    {
      icon: Users,
      label: "Total Downloads",
      value: "2.5M+",
      color: "text-blue-600",
    },
    {
      icon: Award,
      label: "Money Saved",
      value: "₹850Cr",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "94%",
      color: "text-purple-600",
    },
    {
      icon: Heart,
      label: "User Satisfaction",
      value: "4.8/5",
      color: "text-red-600",
    },
  ];

  const handlePreviousReview = () => {
    setCurrentReviewIndex((prev) =>
      prev === 0 ? featuredReviews.length - 1 : prev - 1,
    );
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % featuredReviews.length);
  };

  const filteredReviews =
    selectedRating === "all"
      ? featuredReviews
      : featuredReviews.filter(
          (review) => review.rating === parseInt(selectedRating),
        );

  const currentReview =
    filteredReviews[currentReviewIndex % filteredReviews.length];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join millions of satisfied users who trust Chakshu to protect them
            from fraud. Real stories from real people who saved real money.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Rating Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Rating Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {overallStats.averageRating}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= overallStats.averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-600">
                  Based on {overallStats.totalReviews.toLocaleString()} reviews
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {overallStats.ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{rating.stars}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 w-12 text-right">
                      {rating.percentage}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter by Rating */}
              <div>
                <h4 className="font-semibold mb-3">Filter Reviews</h4>
                <Tabs value={selectedRating} onValueChange={setSelectedRating}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="5">5★</TabsTrigger>
                    <TabsTrigger value="4">4★</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Right - Featured Review */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Featured Reviews
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousReview}
                    className="w-8 h-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextReview}
                    className="w-8 h-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentReview && (
                <>
                  {/* Review Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={currentReview.avatar}
                        alt={currentReview.name}
                      />
                      <AvatarFallback className="bg-india-saffron text-white text-lg">
                        {currentReview.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">
                          {currentReview.name}
                        </h4>
                        {currentReview.verified && (
                          <Verified className="w-5 h-5 text-blue-500" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {currentReview.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {currentReview.location}
                        <Calendar className="w-4 h-4 ml-2" />
                        {currentReview.date}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= currentReview.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentReview.title}
                  </h3>

                  {/* Review Content */}
                  <p className="text-gray-700 leading-relaxed">
                    {currentReview.review}
                  </p>

                  {/* Review Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {currentReview.saved}
                      </div>
                      <div className="text-sm text-gray-600">Money Saved</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {currentReview.category}
                      </div>
                      <div className="text-sm text-gray-600">Fraud Type</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {currentReview.helpful}
                      </div>
                      <div className="text-sm text-gray-600">Found Helpful</div>
                    </div>
                  </div>

                  {/* Features Used */}
                  <div>
                    <h5 className="font-semibold mb-2">
                      Features That Helped:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {currentReview.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({currentReview.helpful})
                    </Button>
                    <div className="text-sm text-gray-500">
                      Review {currentReviewIndex + 1} of{" "}
                      {filteredReviews.length}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            More Reviews From Our Community
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredReviews.slice(0, 6).map((review, index) => (
              <Card
                key={review.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-india-saffron text-white">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{review.name}</div>
                      <div className="text-xs text-gray-600">
                        {review.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <h4 className="font-semibold text-sm mb-2">{review.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {review.review}
                  </p>

                  <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <span>{review.date}</span>
                    <span>{review.helpful} helpful</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-india-saffron text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Share Your Success Story
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Help others by sharing how Chakshu protected you from fraud
              </p>
              <Button
                size="lg"
                className="bg-white text-india-saffron hover:bg-gray-100"
              >
                Write a Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EnhancedUserReviews;
