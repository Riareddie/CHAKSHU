import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import InternationalCallService from "@/components/services/InternationalCallService";

const InternationalCallReport = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationButtons />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Report International Calls with Indian Numbers
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help protect others by reporting suspicious international calls
              that display Indian mobile numbers. Such calls are often
              fraudulent and used for scams.
            </p>
          </div>

          <InternationalCallService />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InternationalCallReport;
