
import React from 'react';
import { Brain, Shield, TrendingUp, Zap } from 'lucide-react';

const AIFeaturesHero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-india-saffron to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Fraud Detection
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Experience cutting-edge artificial intelligence that detects, analyzes, and prevents fraud 
            in real-time with unprecedented accuracy and speed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="w-8 h-8 text-india-saffron mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">99.7% Accuracy</h3>
              <p className="text-blue-100 text-sm">Advanced ML models with industry-leading precision</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Zap className="w-8 h-8 text-india-saffron mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Real-Time Processing</h3>
              <p className="text-blue-100 text-sm">Instant threat detection and response</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <TrendingUp className="w-8 h-8 text-india-saffron mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-blue-100 text-sm">Forecast fraud trends before they emerge</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesHero;
