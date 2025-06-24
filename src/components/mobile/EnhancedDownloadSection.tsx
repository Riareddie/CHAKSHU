import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Smartphone,
  QrCode,
  Star,
  Users,
  Shield,
  Globe,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Wifi,
  Zap,
} from "lucide-react";

const EnhancedDownloadSection = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("both");

  const downloadStats = [
    {
      icon: Users,
      label: "Downloads",
      value: "2.5M+",
      description: "Active monthly users",
    },
    {
      icon: Star,
      label: "Rating",
      value: "4.8/5",
      description: "From 250K+ reviews",
    },
    {
      icon: TrendingUp,
      label: "Growth",
      value: "+45%",
      description: "Month over month",
    },
    {
      icon: Award,
      label: "Awards",
      value: "12",
      description: "Industry recognitions",
    },
  ];

  const systemRequirements = {
    android: {
      version: "Android 6.0+",
      storage: "25 MB",
      ram: "2 GB RAM",
      features: ["Call recording", "SMS integration", "Location services"],
    },
    ios: {
      version: "iOS 12.0+",
      storage: "30 MB",
      ram: "3 GB RAM",
      features: ["CallKit integration", "Siri shortcuts", "Face ID support"],
    },
  };

  const appFeatures = [
    {
      icon: Zap,
      title: "Instant Reports",
      description: "One-tap fraud reporting",
    },
    {
      icon: Shield,
      title: "AI Protection",
      description: "Smart fraud detection",
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      description: "Works without internet",
    },
    {
      icon: Globe,
      title: "Multi-language",
      description: "12 Indian languages",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Download चक्षु Mobile App
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get the most comprehensive fraud protection app trusted by millions
            of Indians. Available for free on both Android and iOS platforms.
          </p>

          {/* Live Stats Banner */}
          <div className="bg-india-saffron text-white rounded-2xl p-6 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {downloadStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-90" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left - QR Codes */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Quick Download
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs
                value={selectedPlatform}
                onValueChange={setSelectedPlatform}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="both">Both</TabsTrigger>
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="ios">iOS</TabsTrigger>
                </TabsList>

                <TabsContent value="both" className="text-center">
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">
                        Universal QR Code
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Scan to auto-detect your device and download the appropriate
                    version
                  </p>
                </TabsContent>

                <TabsContent value="android" className="text-center">
                  <div className="w-48 h-48 bg-green-50 border-2 border-green-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-green-600 mx-auto mb-2" />
                      <Badge className="bg-green-600">Android</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Direct link to Google Play Store
                  </p>
                </TabsContent>

                <TabsContent value="ios" className="text-center">
                  <div className="w-48 h-48 bg-blue-50 border-2 border-blue-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                      <Badge className="bg-blue-600">iOS</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Direct link to Apple App Store
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Center - Download Buttons */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Play Button */}
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 px-6 text-left rounded-2xl group transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className="mr-4">
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                    <div className="text-xs opacity-75">Android 6.0+</div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-600">Free</Badge>
                  </div>
                </div>
              </Button>

              {/* App Store Button */}
              <Button className="w-full bg-black hover:bg-gray-900 text-white py-6 px-6 text-left rounded-2xl group transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className="mr-4">
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                    <div className="text-xs opacity-75">iOS 12.0+</div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-blue-600">Free</Badge>
                  </div>
                </div>
              </Button>

              {/* Direct APK Download */}
              <Button
                variant="outline"
                className="w-full py-4 border-2 border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Direct APK Download
                <Badge variant="outline" className="ml-2">
                  Offline
                </Badge>
              </Button>

              {/* File Size and Version Info */}
              <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600 pt-4">
                <div>
                  <div className="font-semibold">Size</div>
                  <div>25-30 MB</div>
                </div>
                <div>
                  <div className="font-semibold">Version</div>
                  <div>v2.4.1</div>
                </div>
                <div>
                  <div className="font-semibold">Updated</div>
                  <div>Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right - System Requirements & Features */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                App Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* System Requirements */}
              <div>
                <h4 className="font-semibold mb-3">System Requirements</h4>
                <Tabs defaultValue="android">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="android">Android</TabsTrigger>
                    <TabsTrigger value="ios">iOS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="android" className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Version:</span>
                      <span className="font-medium">
                        {systemRequirements.android.version}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage:</span>
                      <span className="font-medium">
                        {systemRequirements.android.storage}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>RAM:</span>
                      <span className="font-medium">
                        {systemRequirements.android.ram}
                      </span>
                    </div>
                  </TabsContent>

                  <TabsContent value="ios" className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Version:</span>
                      <span className="font-medium">
                        {systemRequirements.ios.version}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage:</span>
                      <span className="font-medium">
                        {systemRequirements.ios.storage}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>RAM:</span>
                      <span className="font-medium">
                        {systemRequirements.ios.ram}
                      </span>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="font-semibold mb-3">Key Features</h4>
                <div className="space-y-3">
                  {appFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-india-saffron/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-india-saffron" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {feature.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">
                    Verified Safe
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Scanned by Google Play Protect and verified by Government of
                  India cybersecurity standards.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-india-saffron to-saffron-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Join 2.5 Million+ Indians Fighting Fraud
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Download now and become part of India's largest fraud prevention
                community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-india-saffron hover:bg-gray-100 px-8"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-india-saffron px-8"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EnhancedDownloadSection;
