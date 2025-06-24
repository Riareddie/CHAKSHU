import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import WirelineISPService from "@/components/services/WirelineISPService";

const WirelineISPCheck = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationButtons />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Know Your Wireline ISP
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Verify your wireline internet service provider details, plan
              information, and get customer support contact details for your
              broadband connection.
            </p>
          </div>

          <WirelineISPService />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WirelineISPCheck;
