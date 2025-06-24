import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import ProtectedServiceCard from "@/components/services/ProtectedServiceCard";
import {
  Shield,
  Smartphone,
  Network,
  CheckCircle,
  Globe,
  Wifi,
  Phone,
  MessageSquare,
} from "lucide-react";

const CitizenServices = () => {
  const services = [
    {
      title: "New Chakshu",
      subtitle:
        "Chakshu - Report Suspected Fraud & Unsolicited Commercial Communication / Spam",
      description:
        "Report suspected fraud calls, SMS, and spam communications to protect yourself and others",
      icon: Shield,
      buttonText: "Access Service",
      buttonLink: "/",
      gradientColor: "red",
      requiresAuth: false, // Public service
    },
    {
      title: "CEIR",
      subtitle:
        "Citizen Centric Service Block your lost / stolen mobile handset",
      description:
        "Block your lost or stolen mobile device to prevent misuse and protect your personal data",
      icon: Smartphone,
      buttonText: "Block Device",
      buttonLink: "/services/ceir",
      gradientColor: "blue",
      requiresAuth: true, // Requires authentication
    },
    {
      title: "TAFCOP",
      subtitle: "Citizen Centric Service Know mobile connections in your name",
      description:
        "Check all mobile connections registered in your name and block unauthorized connections",
      icon: Network,
      buttonText: "Check Connections",
      buttonLink: "/services/tafcop",
      gradientColor: "green",
      requiresAuth: true, // Requires authentication
    },
    {
      title: "KYM",
      subtitle: "Know Your Mobile - Verify your mobile number registration",
      description:
        "Verify your mobile number registration details and ensure proper documentation",
      icon: CheckCircle,
      buttonText: "Verify Mobile",
      buttonLink: "/services/kym",
      gradientColor: "purple",
      requiresAuth: true, // Requires authentication
    },
    {
      title: "International Calls",
      subtitle: "Report suspected international call fraud and scams",
      description:
        "Report suspicious international calls and protect yourself from international fraud",
      icon: Globe,
      buttonText: "Report Fraud",
      buttonLink: "/services/international-calls",
      gradientColor: "orange",
      requiresAuth: true, // Requires authentication
    },
    {
      title: "Wireline & ISP",
      subtitle: "Report wireline and internet service provider related issues",
      description:
        "Report issues with landline connections and internet service providers",
      icon: Wifi,
      buttonText: "Report Issue",
      buttonLink: "/services/wireline-isp",
      gradientColor: "cyan",
      requiresAuth: true, // Requires authentication
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-india-saffron via-white to-india-green py-8 sm:py-12 lg:py-16 xl:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-india-saffron/10 to-india-green/10"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8">
              <span className="text-india-saffron">Citizen</span>{" "}
              <span className="text-india-green">Services</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-4">
              Access comprehensive government services for telecommunications
              fraud prevention, device security, and digital safety
            </p>

            {/* Emergency Contact Section - Enhanced for Mobile */}
            <div className="bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10 mx-4 sm:mx-0">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <Phone className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-red-600 mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 dark:text-red-200">
                  Emergency Fraud Helpline
                </h2>
              </div>
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-700 dark:text-red-300 mb-2">
                  1930
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-red-600 dark:text-red-400 mb-4 sm:mb-6">
                  24/7 National Cyber Crime Helpline - Report financial fraud
                  immediately
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
                  <a
                    href="tel:1930"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors focus-visible-ring touch-target inline-block text-center text-sm sm:text-base"
                  >
                    Call 1930 Now
                  </a>
                </div>
              </div>
              <div className="border-t border-red-300 dark:border-red-700 pt-4 sm:pt-6">
                <p className="text-xs sm:text-sm lg:text-base text-red-700 dark:text-red-300 mb-4">
                  For immediate assistance or if you've been defrauded:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
                  <Link
                    to="/help"
                    className="w-full sm:w-auto bg-india-saffron hover:bg-saffron-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors focus-visible-ring touch-target text-center text-sm sm:text-base"
                  >
                    Contact Support
                  </Link>
                  <Link
                    to="/guidelines"
                    className="w-full sm:w-auto border border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors focus-visible-ring touch-target text-center text-sm sm:text-base"
                  >
                    View Guidelines
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Access Section for Mobile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 mx-4 sm:mx-0">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 touch-target"
                >
                  Track Status
                </Link>
                <Link
                  to="/reports-management"
                  className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 touch-target"
                >
                  My Reports
                </Link>
                <Link
                  to="/search"
                  className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 touch-target"
                >
                  Search
                </Link>
                <Link
                  to="/community"
                  className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 touch-target"
                >
                  Community
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-10">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" />
                <div className="text-xs sm:text-sm lg:text-base">
                  Government Verified
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
                <div className="text-xs sm:text-sm lg:text-base opacity-90">
                  Secure & Free
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons - Responsive Container */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 sm:py-4">
        <div className="container-responsive">
          <NavigationButtons />
        </div>
      </div>

      {/* Services Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="container-responsive">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Available Services
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Access a comprehensive range of government services designed to
              protect you from fraud, secure your devices, and ensure safe
              digital communications
            </p>
          </div>

          {/* Services Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {services.map((service, index) => (
              <ProtectedServiceCard
                key={index}
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                icon={service.icon}
                buttonText={service.buttonText}
                buttonLink={service.buttonLink}
                gradientColor={service.gradientColor}
                requiresAuth={service.requiresAuth}
              />
            ))}
          </div>

          {/* Service Info Cards - Mobile Optimized */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
              {/* Security Info */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200">
                    Secure Services
                  </h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-green-700 dark:text-green-300">
                  All services are government-verified and use advanced
                  encryption to protect your personal information.
                </p>
              </div>

              {/* Support Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200">
                    24/7 Support
                  </h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-blue-700 dark:text-blue-300">
                  Round-the-clock assistance available for all services. Get
                  help whenever you need it.
                </p>
              </div>

              {/* Free Service Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 sm:p-6 md:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-3 sm:mb-4">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-purple-800 dark:text-purple-200">
                    Free Services
                  </h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-purple-700 dark:text-purple-300">
                  All citizen services are completely free. No hidden charges or
                  subscription fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CitizenServices;
