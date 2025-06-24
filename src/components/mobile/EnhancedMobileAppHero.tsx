import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Smartphone,
  Shield,
  Star,
  Play,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  Globe,
  Award,
} from "lucide-react";

const EnhancedMobileAppHero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);

  const quickFeatures = [
    "One-tap fraud reporting",
    "Real-time caller ID protection",
    "Automatic call recording",
    "Offline report drafting",
    "GPS location sharing",
    "Community alerts",
  ];

  const stats = [
    {
      icon: Users,
      label: "Active Users",
      value: "2.5M+",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      label: "Frauds Prevented",
      value: "45K+",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Money Saved",
      value: "₹850Cr",
      color: "text-purple-600",
    },
    {
      icon: Award,
      label: "Success Rate",
      value: "94%",
      color: "text-orange-600",
    },
  ];

  // Animated download counter
  useEffect(() => {
    const timer = setInterval(() => {
      setDownloadCount((prev) => {
        if (prev < 2500000) {
          return prev + Math.floor(Math.random() * 1000) + 500;
        }
        return 2500000;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % quickFeatures.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-india-saffron via-saffron-500 to-orange-600 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* App Badge */}
            <div className="flex justify-center lg:justify-start">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                New Features Available
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block">चक्षु</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl opacity-90">
                Mobile App
              </span>
            </h1>

            <p className="text-xl md:text-2xl opacity-90 max-w-2xl">
              India's most trusted fraud reporting app. Protect yourself and
              your community with AI-powered fraud detection in your pocket.
            </p>

            {/* Rotating Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-lg font-medium">
                  {quickFeatures[activeFeature]}
                </span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-white text-india-saffron hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="mr-3 w-6 h-6" />
                Download Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-india-saffron active:bg-white active:text-india-saffron px-8 py-4 text-lg backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Play className="mr-3 w-6 h-6" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span>iOS & Android</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-yellow-300"
                    />
                  ))}
                </div>
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Available in 12 languages</span>
              </div>
            </div>

            {/* Live Download Counter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center lg:text-left">
              <div className="text-2xl font-bold">
                {downloadCount.toLocaleString()}+
              </div>
              <div className="text-sm opacity-75">
                Downloads and counting...
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* App Preview Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Experience the Power
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Join millions of Indians using Chakshu to fight fraud
                  </p>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-india-saffron active:bg-white active:text-india-saffron shadow-lg transition-all duration-300"
                  >
                    View Screenshots
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 inline-flex items-center gap-4">
            <Badge className="bg-green-500 text-white">
              Government Approved
            </Badge>
            <span className="text-white">
              Official app by Ministry of Communications, Govt. of India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedMobileAppHero;
