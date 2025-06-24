import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import AIFeaturesHero from "@/components/ai/AIFeaturesHero";
import RealTimeAnalysis from "@/components/ai/RealTimeAnalysis";
import ThreatAssessment from "@/components/ai/ThreatAssessment";
import DuplicateDetection from "@/components/ai/DuplicateDetection";
import PredictiveTrends from "@/components/ai/PredictiveTrends";
import NetworkMapping from "@/components/ai/NetworkMapping";
import RiskCalculator from "@/components/ai/RiskCalculator";
import PreventionTips from "@/components/ai/PreventionTips";
import InteractiveFraudDetector from "@/components/ai/InteractiveFraudDetector";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import AuthGuard from "@/components/auth/AuthGuard";

const AIFeatures = () => {
  return (
    <AuthGuard message="Sign in to access AI-powered fraud detection tools, risk analysis, and personalized protection recommendations.">
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />

          <AIFeaturesHero />

          <div className="container mx-auto px-4 py-12 space-y-16">
            {/* Navigation Buttons */}
            <NavigationButtons />

            {/* Interactive AI Fraud Detector - Featured Section */}
            <InteractiveFraudDetector />

            <RealTimeAnalysis />
            <ThreatAssessment />
            <DuplicateDetection />
            <PredictiveTrends />
            <NetworkMapping />
            <RiskCalculator />
            <PreventionTips />
          </div>

          <Footer />
        </div>
      </LanguageProvider>
    </AuthGuard>
  );
};

export default AIFeatures;
