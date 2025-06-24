import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import KYMService from "@/components/services/KYMService";

const KYMVerification = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationButtons />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              KYM - Know Your Mobile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Know Your Mobile (KYM) service helps you verify the genuineness
              and legal status of your mobile handset to ensure it's not stolen
              or counterfeit.
            </p>
          </div>

          <KYMService />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default KYMVerification;
