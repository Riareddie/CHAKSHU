import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import EducationHero from "@/components/education/EducationHero";
import FraudIdentificationGuide from "@/components/education/FraudIdentificationGuide";
import VideoTutorials from "@/components/education/VideoTutorials";
import DownloadableResources from "@/components/education/DownloadableResources";
import SpecialProtectionTips from "@/components/education/SpecialProtectionTips";
import ChildrenSafetySection from "@/components/education/ChildrenSafetySection";
import BusinessFraudGuide from "@/components/education/BusinessFraudGuide";
import LatestFraudAlerts from "@/components/education/LatestFraudAlerts";
import GovernmentAdvisories from "@/components/education/GovernmentAdvisories";
import FAQSection from "@/components/education/FAQSection";
import { LanguageProvider } from "@/components/language/LanguageProvider";

const Education = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <EducationHero />

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Navigation Buttons */}
          <NavigationButtons />

          <FraudIdentificationGuide />

          <VideoTutorials />

          <DownloadableResources />

          <div className="grid lg:grid-cols-2 gap-12">
            <SpecialProtectionTips />
            <ChildrenSafetySection />
          </div>

          <BusinessFraudGuide />

          <div className="grid lg:grid-cols-2 gap-12">
            <LatestFraudAlerts />
            <GovernmentAdvisories />
          </div>

          <FAQSection />
        </div>

        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Education;
