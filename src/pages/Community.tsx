import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchInterface from "@/components/search/SearchInterface";
import PublicFraudAlerts from "@/components/community/PublicFraudAlerts";
import TrendingScamPatterns from "@/components/community/TrendingScamPatterns";
import CommunityLeaderboard from "@/components/community/CommunityLeaderboard";
import EducationalArticles from "@/components/community/EducationalArticles";
import UserTestimonials from "@/components/community/UserTestimonials";
import FraudQuiz from "@/components/community/FraudQuiz";
import DiscussionForum from "@/components/community/DiscussionForum";
import RegionalStats from "@/components/community/RegionalStats";
import SuccessStories from "@/components/community/SuccessStories";
import SocialShare from "@/components/community/SocialShare";
import EnhancedCommunityReports from "@/components/community/EnhancedCommunityReports";
import NavigationButtons from "@/components/common/NavigationButtons";
import { Button } from "@/components/ui/button";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-india-saffron to-saffron-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Community Fraud Prevention
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of citizens in the fight against fraud. Share
            experiences, learn from others, and help build a safer digital
            India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                variant="outline"
                className="bg-white text-india-saffron hover:bg-gray-100"
              >
                Report Fraud
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="bg-white text-india-saffron hover:bg-gray-100"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Navigation Buttons */}
        <NavigationButtons />

        {/* Advanced Search Interface */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Search Community Reports & Discussions
          </h2>
          <SearchInterface />
        </section>

        {/* Discussion Forum - Moved to top for better engagement */}
        <DiscussionForum />

        {/* Enhanced Community Reports */}
        <EnhancedCommunityReports />

        {/* Public Fraud Alerts */}
        <PublicFraudAlerts />

        {/* Trending Scam Patterns */}
        <TrendingScamPatterns />

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          <CommunityLeaderboard />
          <RegionalStats />
        </div>

        {/* Educational Articles */}
        <EducationalArticles />

        {/* User Testimonials */}
        <UserTestimonials />

        {/* Interactive Quiz */}
        <FraudQuiz />

        {/* Success Stories */}
        <SuccessStories />

        {/* Social Share */}
        <SocialShare />
      </div>

      <Footer />
    </div>
  );
};

export default Community;
