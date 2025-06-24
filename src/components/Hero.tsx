import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Shield, BarChart, TrendingUp } from "lucide-react";

const Hero = () => {
  const { user } = useAuth();

  if (user) {
    // Authenticated user hero
    return (
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 dark:from-emerald-500/10 dark:via-transparent dark:to-blue-500/10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-medium mb-8 animate-fade-in">
              <User className="w-4 h-4 mr-2" />
              Welcome back, {user.user_metadata?.full_name || "User"}
            </div>

            {/* Main Headline for Authenticated Users */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Your
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Fraud Protection
              </span>
              <br />
              Dashboard
            </h1>

            {/* Subheadline for Authenticated Users */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-white mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Welcome to your personal fraud protection hub. Track your reports,
              explore community insights, and stay protected with the latest
              fraud prevention tools.
            </p>

            {/* CTA Buttons for Authenticated Users */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <BarChart className="w-5 h-5" />
                  View Dashboard
                </Button>
              </Link>
              <Link to="/?report=true">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Report New Fraud
                </Button>
              </Link>
            </div>

            {/* User Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-gray-500 dark:text-light-yellow">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center mr-2">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                Active Protection Status
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                Real-time Monitoring
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs">✓</span>
                </div>
                Verified Account
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Non-authenticated user hero (original)
  return (
    <section className="relative bg-gradient-to-br from-saffron-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-india-saffron/5 via-transparent to-india-green/5 dark:from-india-saffron/10 dark:via-transparent dark:to-india-green/10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-india-saffron to-saffron-500 text-white text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Government of India Initiative
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Protect India from
            <span className="bg-gradient-to-r from-india-saffron to-india-green bg-clip-text text-transparent">
              {" "}
              Fraud Calls & SMS
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-white mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Join millions of Indians in the fight against cyber fraud. Report
            suspicious calls and messages to protect yourself and your
            community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Link to="/?report=true">
              <Button
                size="lg"
                className="bg-gradient-to-r from-india-saffron to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-white px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Report Fraud Now
              </Button>
            </Link>
            <Link to="/community">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-india-green text-india-green hover:bg-india-green hover:text-white dark:border-india-green dark:text-india-green dark:hover:bg-india-green dark:hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-200"
              >
                Join Community
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-gray-500 dark:text-light-yellow">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              Secure & Encrypted
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              Government Verified
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
