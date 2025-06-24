import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import TAFCOPService from "@/components/services/TAFCOPService";

const TAFCOPCheck = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationButtons />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              TAFCOP - Mobile Connection Check
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Telecom Analytics for Fraud Management and Consumer Protection
              (TAFCOP) helps you identify all mobile connections registered in
              your name and block unauthorized ones.
            </p>
          </div>

          <TAFCOPService />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TAFCOPCheck;
