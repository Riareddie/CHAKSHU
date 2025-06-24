
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AppMockupShowcase = () => {
  const screenshots = [
    {
      title: "Home Dashboard",
      description: "Quick access to all reporting features",
      image: "/placeholder.svg"
    },
    {
      title: "One-Tap Reporting",
      description: "Report fraud calls instantly",
      image: "/placeholder.svg"
    },
    {
      title: "Call Recording",
      description: "Automatic call recording for evidence",
      image: "/placeholder.svg"
    },
    {
      title: "GPS Location",
      description: "Share location for better tracking",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Experience the App
      </h2>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        See how our mobile app makes fraud reporting faster and more effective than ever before.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {screenshots.map((screenshot, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg aspect-[9/16] mb-4 flex items-center justify-center">
                <Smartphone className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{screenshot.title}</h3>
              <p className="text-gray-600 text-sm">{screenshot.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const Smartphone = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v12H7V4zm5 14c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/>
  </svg>
);

export default AppMockupShowcase;
