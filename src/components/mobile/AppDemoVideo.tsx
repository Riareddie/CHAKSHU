
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const AppDemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
      <div className="container mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See चक्षु Mobile in Action
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Watch how our mobile app makes fraud reporting quick, secure, and effective. 
              See real users protecting their communities with just a few taps.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-india-saffron rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <span>Detect suspicious call or message</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-india-saffron rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <span>One-tap report with automatic details</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-india-saffron rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <span>Instant submission and tracking</span>
              </div>
            </div>
          </div>
          
          <Card className="bg-black/20 border-gray-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-india-saffron hover:bg-saffron-600 text-white rounded-full w-16 h-16 p-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                </div>
                
                {/* Video placeholder overlay */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  2:45
                </div>
                
                {/* Demo app interface mockup */}
                <div className="absolute bottom-4 right-4 w-20 h-36 bg-white rounded-lg opacity-30"></div>
              </div>
              
              <div className="p-6 text-white">
                <h4 className="font-semibold mb-2">Mobile App Demo</h4>
                <p className="text-gray-300 text-sm">
                  A complete walkthrough of reporting fraud using the चक्षु mobile app
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppDemoVideo;
