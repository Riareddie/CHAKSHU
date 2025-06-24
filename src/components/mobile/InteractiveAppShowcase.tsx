import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Zap,
  Mic,
  MapPin,
  FileText,
  Bell,
  Shield,
  Users,
  BarChart3,
  MessageSquare,
  Phone,
} from "lucide-react";

const InteractiveAppShowcase = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const appScreens = [
    {
      id: "dashboard",
      title: "Smart Dashboard",
      subtitle: "Your fraud protection command center",
      features: [
        "Real-time alerts",
        "Quick report access",
        "Community updates",
      ],
      icon: BarChart3,
      color: "from-blue-500 to-blue-700",
      mockupContent: {
        header: "चक्षु Dashboard",
        stats: [
          { label: "Reports Filed", value: "2" },
          { label: "Alerts Received", value: "7" },
          { label: "Community Score", value: "★ 4.8" },
        ],
        quickActions: [
          "Report Fraud",
          "Check Number",
          "View Alerts",
          "Community",
        ],
      },
    },
    {
      id: "report",
      title: "One-Tap Reporting",
      subtitle: "Report fraud in seconds, not minutes",
      features: [
        "Voice-to-text input",
        "Instant submission",
        "Auto evidence collection",
      ],
      icon: Zap,
      color: "from-green-500 to-green-700",
      mockupContent: {
        header: "Quick Report",
        form: [
          { label: "Fraud Type", value: "Phone Call Scam" },
          { label: "Caller Number", value: "+91 98765 43210" },
          { label: "Amount Lost", value: "₹ 0 (Prevented)" },
        ],
        button: "Submit Report",
      },
    },
    {
      id: "calling",
      title: "Smart Call Protection",
      subtitle: "AI-powered caller identification",
      features: [
        "Real-time fraud detection",
        "Automatic call recording",
        "Community warnings",
      ],
      icon: Phone,
      color: "from-red-500 to-red-700",
      mockupContent: {
        header: "Incoming Call",
        caller: "+91 98765 43210",
        warning: "⚠️ FRAUD ALERT",
        details: "This number reported 47 times",
        actions: ["Block", "Report", "Answer"],
      },
    },
    {
      id: "community",
      title: "Community Alerts",
      subtitle: "Stay informed with real-time updates",
      features: [
        "Live fraud alerts",
        "Location-based warnings",
        "Community discussions",
      ],
      icon: Users,
      color: "from-purple-500 to-purple-700",
      mockupContent: {
        header: "Community Alerts",
        alerts: [
          { type: "New Scam", location: "Mumbai", time: "2 min ago" },
          { type: "Number Blocked", location: "Delhi", time: "5 min ago" },
          { type: "Success Story", location: "Bangalore", time: "1 hr ago" },
        ],
      },
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % appScreens.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, appScreens.length]);

  const handlePrevious = () => {
    setActiveScreen((prev) => (prev === 0 ? appScreens.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveScreen((prev) => (prev + 1) % appScreens.length);
  };

  const currentScreen = appScreens[activeScreen];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Experience the App in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how our mobile app transforms fraud protection with intuitive
            design and powerful features that work seamlessly together.
          </p>

          {/* Playback Controls */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full w-10 h-10 p-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Screen Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {appScreens.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveScreen(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeScreen
                    ? "bg-india-saffron scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>

                  {/* Screen Content */}
                  <div
                    className={`h-full bg-gradient-to-br ${currentScreen.color} relative overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full"></div>
                      <div className="absolute bottom-20 left-10 w-24 h-24 border border-white rounded-full"></div>
                    </div>

                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 pt-8 pb-4 text-white text-sm">
                      <span>9:41</span>
                      <span>••• चक्षु</span>
                      <span>100%</span>
                    </div>

                    {/* Dynamic Content Based on Screen */}
                    <div className="px-6 py-4 text-white h-full">
                      {/* Dashboard Screen */}
                      {currentScreen.id === "dashboard" && (
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold">
                            {currentScreen.mockupContent.header}
                          </h3>

                          <div className="grid grid-cols-3 gap-2">
                            {currentScreen.mockupContent.stats?.map(
                              (stat, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/20 rounded-lg p-3 text-center"
                                >
                                  <div className="font-bold">{stat.value}</div>
                                  <div className="text-xs opacity-80">
                                    {stat.label}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          <div className="space-y-2">
                            {currentScreen.mockupContent.quickActions?.map(
                              (action, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/10 rounded-lg p-3 text-center"
                                >
                                  {action}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Report Screen */}
                      {currentScreen.id === "report" && (
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold">
                            {currentScreen.mockupContent.header}
                          </h3>

                          <div className="space-y-3">
                            {currentScreen.mockupContent.form?.map(
                              (field, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/20 rounded-lg p-3"
                                >
                                  <div className="text-xs opacity-80 mb-1">
                                    {field.label}
                                  </div>
                                  <div className="font-medium">
                                    {field.value}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          <div className="bg-white text-center py-3 rounded-lg text-gray-900 font-bold">
                            {currentScreen.mockupContent.button}
                          </div>
                        </div>
                      )}

                      {/* Calling Screen */}
                      {currentScreen.id === "calling" && (
                        <div className="text-center space-y-6">
                          <div className="mt-8">
                            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <Phone className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-bold">
                              {currentScreen.mockupContent.header}
                            </h3>
                            <div className="text-lg">
                              {currentScreen.mockupContent.caller}
                            </div>
                          </div>

                          <div className="bg-red-500/80 rounded-lg p-4">
                            <div className="font-bold text-lg">
                              {currentScreen.mockupContent.warning}
                            </div>
                            <div className="text-sm">
                              {currentScreen.mockupContent.details}
                            </div>
                          </div>

                          <div className="flex justify-center gap-2">
                            {currentScreen.mockupContent.actions?.map(
                              (action, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/20 rounded-lg px-4 py-2 text-sm"
                                >
                                  {action}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Community Screen */}
                      {currentScreen.id === "community" && (
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold">
                            {currentScreen.mockupContent.header}
                          </h3>

                          <div className="space-y-3">
                            {currentScreen.mockupContent.alerts?.map(
                              (alert, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/20 rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">
                                        {alert.type}
                                      </div>
                                      <div className="text-sm opacity-80">
                                        {alert.location}
                                      </div>
                                    </div>
                                    <div className="text-xs opacity-80">
                                      {alert.time}
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Badges */}
              <div className="absolute -right-4 top-20">
                <Badge className="bg-white text-gray-900 shadow-lg">
                  <currentScreen.icon className="w-4 h-4 mr-1" />
                  Live Demo
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Side - Feature Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentScreen.color} flex items-center justify-center`}
                >
                  <currentScreen.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {currentScreen.title}
                  </h3>
                  <p className="text-gray-600">{currentScreen.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {currentScreen.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-india-saffron rounded-full"></div>
                  <span className="text-lg text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-india-saffron mx-auto mb-2" />
                  <div className="font-semibold">Lightning Fast</div>
                  <div className="text-sm text-gray-600">
                    Report in under 2 seconds
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">AI Protected</div>
                  <div className="text-sm text-gray-600">99.2% accuracy</div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full bg-india-saffron hover:bg-saffron-600 text-white py-4 text-lg"
              >
                Try This Feature
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveAppShowcase;
