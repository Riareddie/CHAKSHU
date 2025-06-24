
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DownloadSection = () => {
  return (
    <section className="bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Download चक्षु Mobile App
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get instant access to fraud reporting tools. Available on iOS and Android.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 items-center">
        {/* QR Code Section */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">Scan to Download</h3>
            <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code</span>
            </div>
            <p className="text-gray-600 text-sm">
              Scan with your phone camera to download instantly
            </p>
          </CardContent>
        </Card>
        
        {/* Download Buttons */}
        <div className="space-y-4">
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white py-6 px-8 text-lg rounded-xl"
          >
            <div className="flex items-center">
              <div className="mr-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs opacity-75">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </div>
          </Button>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 px-8 text-lg rounded-xl"
          >
            <div className="flex items-center">
              <div className="mr-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs opacity-75">GET IT ON</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </div>
          </Button>
        </div>
        
        {/* Stats */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">App Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Downloads</span>
                <span className="font-semibold">1M+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="font-semibold">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reviews</span>
                <span className="font-semibold">25K+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size</span>
                <span className="font-semibold">15 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DownloadSection;
