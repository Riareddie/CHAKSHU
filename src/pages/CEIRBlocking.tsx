import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import CEIRService from "@/components/services/CEIRService";

const CEIRBlocking = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationButtons />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              CEIR Device Blocking Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Central Equipment Identity Register (CEIR) helps you block lost or
              stolen mobile devices to prevent unauthorized usage across all
              telecom networks in India.
            </p>
          </div>

          <CEIRService />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CEIRBlocking;
