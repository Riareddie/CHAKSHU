import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  BarChart,
  Users,
  BookOpen,
  Lock,
  Star,
  TrendingUp,
  Eye,
  AlertTriangle,
} from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { Link } from "react-router-dom";

const GuestFeatures: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const guestFeatures = [
    {
      title: "Public Fraud Alerts",
      description:
        "View recent fraud alerts and trends in your area without signing in.",
      icon: AlertTriangle,
      available: true,
      link: "/community",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Educational Resources",
      description:
        "Learn about fraud prevention, identification techniques, and safety tips.",
      icon: BookOpen,
      available: true,
      link: "/education",
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Report Fraud (Limited)",
      description:
        "Submit fraud reports anonymously, but won't be able to track status.",
      icon: Shield,
      available: true,
      link: "/?report=true",
      color: "from-india-saffron to-saffron-600",
      limitation: "No tracking without account",
    },
    {
      title: "Community Forum",
      description:
        "Read discussions and tips, but participate by creating an account.",
      icon: Users,
      available: false,
      color: "from-green-500 to-emerald-500",
      limitation: "Sign up to participate",
    },
    {
      title: "Personal Dashboard",
      description:
        "Track your reports, view personal insights, and manage your contributions.",
      icon: BarChart,
      available: false,
      color: "from-blue-600 to-indigo-600",
      limitation: "Account required",
    },
    {
      title: "Advanced Analytics",
      description:
        "Access detailed fraud trends, personalized risk assessments, and predictions.",
      icon: TrendingUp,
      available: false,
      color: "from-purple-600 to-pink-600",
      limitation: "Premium feature",
    },
  ];

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const handleSignInClick = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Fraud Protection Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto mb-8">
            See what's available to everyone and what you can unlock by creating
            a free account
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleSignUpClick}
              className="bg-india-saffron hover:bg-saffron-600 text-white px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              Create Free Account
            </Button>
            <Button
              variant="outline"
              onClick={handleSignInClick}
              className="border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {guestFeatures.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <Card
                key={index}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  !feature.available ? "opacity-75" : "hover:-translate-y-1"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Lock overlay for unavailable features */}
                {!feature.available && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                )}

                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    {feature.available ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-orange-600 dark:border-orange-600 dark:text-orange-400"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Sign up
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100">
                    {feature.title}
                  </CardTitle>

                  <CardDescription className="text-gray-600 dark:text-white">
                    {feature.description}
                  </CardDescription>

                  {feature.limitation && (
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500 border-gray-300"
                      >
                        {feature.limitation}
                      </Badge>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  {feature.available && feature.link ? (
                    <Link to={feature.link}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:${feature.color} hover:text-white hover:border-transparent transition-all duration-200`}
                      >
                        Explore Now
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white transition-all duration-200"
                      onClick={handleSignUpClick}
                    >
                      {feature.available
                        ? "Get Full Access"
                        : "Create Account to Unlock"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-gradient-to-r from-india-saffron/10 to-india-green/10 dark:from-india-saffron/20 dark:to-india-green/20 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Create an Account?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-india-saffron rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Track Your Reports
                </h4>
                <p className="text-sm text-gray-600 dark:text-white">
                  Monitor the status of your fraud reports and receive updates
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-india-green rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Insights
                </h4>
                <p className="text-sm text-gray-600 dark:text-white">
                  Get personalized fraud risk assessments and protection tips
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Join Community
                </h4>
                <p className="text-sm text-gray-600 dark:text-white">
                  Connect with others and participate in fraud prevention
                  discussions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </section>
  );
};

export default GuestFeatures;
