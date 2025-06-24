import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import EnhancedMobileAppHero from "@/components/mobile/EnhancedMobileAppHero";
import InteractiveAppShowcase from "@/components/mobile/InteractiveAppShowcase";
import EnhancedDownloadSection from "@/components/mobile/EnhancedDownloadSection";
import MobileFeatures from "@/components/mobile/MobileFeatures";
import EnhancedUserReviews from "@/components/mobile/EnhancedUserReviews";
import EnhancedAppDemoVideo from "@/components/mobile/EnhancedAppDemoVideo";
import FeatureComparison from "@/components/mobile/FeatureComparison";

const MobileApp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <EnhancedMobileAppHero />

      <div className="space-y-0">
        {/* Navigation Buttons */}
        <div className="container mx-auto px-4 py-16">
          <NavigationButtons />
        </div>

        <InteractiveAppShowcase />

        <EnhancedDownloadSection />

        <div className="container mx-auto px-4 py-20">
          <MobileFeatures />
        </div>

        <EnhancedAppDemoVideo />

        <div className="container mx-auto px-4 py-20">
          <FeatureComparison />
        </div>

        <EnhancedUserReviews />
      </div>

      <Footer />
    </div>
  );
};

export default MobileApp;
