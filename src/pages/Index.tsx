import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import FeatureCards from "@/components/FeatureCards";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import FraudReportingForm from "@/components/FraudReportingForm";
import NavigationButtons from "@/components/common/NavigationButtons";
import GuestFeatures from "@/components/common/GuestFeatures";
import { Button } from "@/components/ui/button";
import { Plus, Shield, User, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthenticatedContentProps {
  onReportFraud: () => void;
}

const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({
  onReportFraud,
}) => {
  const { user } = useAuth();

  if (user) {
    // Authenticated user content
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onReportFraud}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Report New Fraud
          </Button>
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-600 dark:text-blue-600 dark:hover:bg-blue-600 dark:hover:text-white text-lg px-8 py-4 flex items-center gap-2"
              size="lg"
            >
              <Shield className="h-5 w-5" />
              My Dashboard
            </Button>
          </Link>
          <Link to="/reports-management">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-600 dark:text-purple-600 dark:hover:bg-purple-600 dark:hover:text-white text-lg px-8 py-4 flex items-center gap-2"
              size="lg"
            >
              <User className="h-5 w-5" />
              My Reports
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-white max-w-2xl mx-auto">
          Welcome back! You're part of the community protecting India from
          fraud. Track your reports, explore insights, and stay protected.
        </p>
      </div>
    );
  }

  // Non-authenticated user content
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onReportFraud}
          className="bg-india-saffron hover:bg-saffron-600 text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Report Fraud Now
        </Button>
        <Link to="/education">
          <Button
            variant="outline"
            className="border-india-green text-india-green hover:bg-india-green hover:text-white dark:border-india-green dark:text-india-green dark:hover:bg-india-green dark:hover:text-white text-lg px-8 py-4 flex items-center gap-2"
            size="lg"
          >
            <BookOpen className="h-5 w-5" />
            Learn About Fraud
          </Button>
        </Link>
      </div>
      <p className="text-sm text-gray-600 dark:text-white max-w-2xl mx-auto">
        Join thousands of Indians in the fight against fraud. Report incidents,
        track trends, and help build a safer digital ecosystem for everyone.
      </p>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Sign up</strong> to track your reports, access personalized
          insights, and join our community of fraud fighters.
        </p>
      </div>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchParams] = useSearchParams();

  // Check if report parameter is present in URL
  useEffect(() => {
    if (searchParams.get("report") === "true") {
      setShowReportForm(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {!showReportForm ? (
        <>
          <Hero />
          <AuthenticatedContent onReportFraud={() => setShowReportForm(true)} />
          <StatsCounter />
          <FeatureCards />
          {!user && <GuestFeatures />}
          <TrustBadges />
          <Footer />
        </>
      ) : (
        <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
          <NavigationButtons showBack={false} showNext={false} />
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowReportForm(false)}
              className="mb-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ← Back to Home
            </Button>
          </div>
          <FraudReportingForm />
        </div>
      )}
    </div>
  );
};

export default Index;
