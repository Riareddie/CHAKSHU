import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Clock,
  Users,
  Award,
  Star,
  ChevronRight,
  Smartphone,
  Shield,
  Zap,
} from "lucide-react";

const EnhancedAppDemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedDemo, setSelectedDemo] = useState("overview");

  const demoVideos = {
    overview: {
      title: "Complete App Overview",
      description: "Comprehensive walkthrough of all features",
      duration: "3:45",
      thumbnail: "overview-thumb",
      highlights: ["Dashboard tour", "One-tap reporting", "Community features"],
    },
    reporting: {
      title: "Quick Fraud Reporting",
      description: "See how to report fraud in under 30 seconds",
      duration: "1:20",
      thumbnail: "reporting-thumb",
      highlights: ["Voice input", "Auto-detection", "Instant submission"],
    },
    protection: {
      title: "Real-time Protection",
      description: "Live caller ID and fraud prevention",
      duration: "2:15",
      thumbnail: "protection-thumb",
      highlights: ["Call screening", "AI detection", "Community alerts"],
    },
  };

  const userTestimonials = [
    {
      name: "Ravi Kumar",
      role: "Business Owner",
      quote:
        "This video convinced me to download the app. Saved me ₹50,000 in the first week!",
      avatar: "RK",
    },
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      quote:
        "The demo shows exactly how easy it is. My parents can use it without any help.",
      avatar: "PS",
    },
    {
      name: "Dr. Mehta",
      role: "Retired Teacher",
      quote:
        "Clear explanation of each feature. Downloaded immediately after watching.",
      avatar: "DM",
    },
  ];

  const appStats = [
    {
      icon: Users,
      label: "Demo Views",
      value: "2.5M+",
      description: "Monthly video views",
    },
    {
      icon: Award,
      label: "Conversion Rate",
      value: "78%",
      description: "Viewers who download",
    },
    {
      icon: Star,
      label: "Video Rating",
      value: "4.9/5",
      description: "User feedback score",
    },
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentDemo = demoVideos[selectedDemo as keyof typeof demoVideos];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See चक्षु Mobile in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Watch real demonstrations of how our mobile app protects millions of
            Indians from fraud every day. See why it's India's #1 trusted fraud
            prevention app.
          </p>

          {/* Video Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {appStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-india-saffron mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Demo Selection */}
          <Card className="lg:col-span-1 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Choose Demo</h3>

              <Tabs
                value={selectedDemo}
                onValueChange={setSelectedDemo}
                orientation="vertical"
              >
                <TabsList className="grid w-full grid-rows-3 bg-white/10">
                  <TabsTrigger value="overview" className="text-left">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="reporting" className="text-left">
                    Reporting
                  </TabsTrigger>
                  <TabsTrigger value="protection" className="text-left">
                    Protection
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-4">
                  <div className="text-white">
                    <h4 className="font-semibold text-lg mb-2">
                      {currentDemo.title}
                    </h4>
                    <p className="text-gray-300 text-sm mb-4">
                      {currentDemo.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {currentDemo.duration}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Key Highlights:</h5>
                      {currentDemo.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <ChevronRight className="w-3 h-3 text-india-saffron" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Center - Video Player */}
          <Card className="lg:col-span-2 bg-black border-gray-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                {/* Video Mockup */}
                <div className="absolute inset-0 bg-gradient-to-br from-india-saffron/20 to-saffron-600/20">
                  {/* Phone Mockup in Video */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-80 bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                        {/* Demo content based on selected demo */}
                        <div className="h-full bg-gradient-to-br from-india-saffron to-saffron-600 p-4 text-white">
                          {selectedDemo === "overview" && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h5 className="font-bold">चक्षु Dashboard</h5>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/20 rounded-lg p-2 text-center text-xs">
                                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                                  <div>Quick Report</div>
                                </div>
                                <div className="bg-white/20 rounded-lg p-2 text-center text-xs">
                                  <Shield className="w-4 h-4 mx-auto mb-1" />
                                  <div>Protection</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedDemo === "reporting" && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h5 className="font-bold">Quick Report</h5>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-white/20 rounded p-2 text-xs">
                                  Fraud Type: Phone Scam
                                </div>
                                <div className="bg-white/20 rounded p-2 text-xs">
                                  Number: +91 XXXXX
                                </div>
                                <div className="bg-red-500 rounded p-2 text-center text-xs">
                                  Submit Report
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedDemo === "protection" && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h5 className="font-bold">Incoming Call</h5>
                              </div>
                              <div className="bg-red-500/80 rounded-lg p-3 text-center">
                                <div className="text-xs mb-1">
                                  ⚠️ FRAUD ALERT
                                </div>
                                <div className="text-xs">
                                  This number reported 47 times
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-india-saffron/90 hover:bg-saffron-600 text-white rounded-full w-20 h-20 p-0 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {currentDemo.duration}
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge className="bg-india-saffron">HD Quality</Badge>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white p-2"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div
                        className="bg-india-saffron h-1 rounded-full transition-all duration-300"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white p-2"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white p-2"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Testimonials */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            What Viewers Say After Watching
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {userTestimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-india-saffron rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-300">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-india-saffron border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Protected?
              </h3>
              <p className="text-lg text-white/90 mb-6">
                Download the app now and join millions of Indians staying safe
                from fraud
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-india-saffron hover:bg-gray-100 px-8"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-india-saffron px-8"
                >
                  Watch All Demos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EnhancedAppDemoVideo;
