
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Mic, MapPin, FileText, Bell, Shield } from 'lucide-react';

const MobileFeatures = () => {
  const features = [
    {
      icon: Zap,
      title: "One-Tap Reporting",
      description: "Report fraud calls instantly with a single tap. No lengthy forms or complex processes."
    },
    {
      icon: Mic,
      title: "Call Recording Integration",
      description: "Automatically record suspicious calls with built-in recording features for evidence collection."
    },
    {
      icon: MapPin,
      title: "GPS Location Sharing",
      description: "Share your precise location to help authorities track fraud patterns in your area."
    },
    {
      icon: FileText,
      title: "Offline Report Drafting",
      description: "Draft reports offline and submit when connected. Never lose important fraud information."
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get instant alerts about new fraud patterns, scam warnings, and report status updates."
    },
    {
      icon: Shield,
      title: "Real-time Protection",
      description: "Live database checks against known fraud numbers with instant caller identification."
    }
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mobile-Exclusive Features
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our mobile app offers unique features designed specifically for on-the-go fraud protection
          that you won't find on the web version.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-india-saffron to-saffron-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MobileFeatures;
