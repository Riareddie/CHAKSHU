
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Shield } from 'lucide-react';

const MobileAppHero = () => {
  return (
    <section className="bg-gradient-to-br from-india-saffron via-saffron-500 to-orange-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-4 rounded-full">
            <Smartphone className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          चक्षु Mobile App
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Report fraud on-the-go with our powerful mobile app. One-tap reporting, 
          call recording, and real-time protection in your pocket.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-white text-india-saffron hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            <Download className="mr-2 w-5 h-5" />
            Download Now
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white hover:text-india-saffron px-8 py-4 text-lg"
          >
            Watch Demo
          </Button>
        </div>
        
        <div className="flex justify-center items-center gap-8 text-sm">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            100% Secure
          </div>
          <div className="flex items-center">
            <span className="w-5 h-5 mr-2">📱</span>
            iOS & Android
          </div>
          <div className="flex items-center">
            <span className="w-5 h-5 mr-2">⭐</span>
            4.8/5 Rating
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppHero;
