import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";

interface ProtectedServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  buttonLink: string;
  gradientColor: string;
  requiresAuth?: boolean;
}

const ProtectedServiceCard: React.FC<ProtectedServiceCardProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  buttonText,
  buttonLink,
  gradientColor,
  requiresAuth = false,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const getGradientClass = (color: string) => {
    const gradients = {
      red: "from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:hover:from-red-800/30 dark:hover:to-red-700/30",
      blue: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30",
      green:
        "from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:hover:from-green-800/30 dark:hover:to-green-700/30",
      purple:
        "from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30",
      orange:
        "from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:hover:from-orange-800/30 dark:hover:to-orange-700/30",
      cyan: "from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 dark:from-cyan-900/20 dark:to-cyan-800/20 dark:hover:from-cyan-800/30 dark:hover:to-cyan-700/30",
    };
    return gradients[color as keyof typeof gradients] || gradients.blue;
  };

  const getIconColorClass = (color: string) => {
    const iconColors = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      cyan: "bg-cyan-500",
    };
    return iconColors[color as keyof typeof iconColors] || iconColors.blue;
  };

  const handleServiceAccess = () => {
    if (requiresAuth && !user) {
      toast({
        title: "Sign in Required",
        description: `Please sign in to access ${title}. Create an account to use all citizen services.`,
        variant: "default",
      });
      setAuthMode("signup");
      setIsAuthModalOpen(true);
      return;
    }
    // If user is authenticated or service doesn't require auth, navigation happens via Link
  };

  const ServiceButton = () => {
    if (requiresAuth && !user) {
      return (
        <Button
          onClick={handleServiceAccess}
          className="w-full bg-india-saffron hover:bg-saffron-600 text-white transition-all duration-300 font-semibold text-sm sm:text-base py-2.5 sm:py-3 touch-target group-hover:shadow-lg"
        >
          <Lock className="h-4 w-4 mr-2" />
          Sign in to Access
        </Button>
      );
    }

    return (
      <Button
        asChild
        className="w-full bg-india-saffron hover:bg-saffron-600 text-white transition-all duration-300 font-semibold text-sm sm:text-base py-2.5 sm:py-3 touch-target group-hover:shadow-lg"
      >
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    );
  };

  return (
    <>
      <Card
        className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-gradient-to-br ${getGradientClass(gradientColor)} border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${requiresAuth && !user ? "opacity-90" : ""}`}
      >
        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
          {/* Icon and Title Section */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${getIconColorClass(gradientColor)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              {requiresAuth && !user && (
                <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-1 rounded">
                  <Lock className="h-3 w-3" />
                </div>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight group-hover:text-india-saffron dark:group-hover:text-india-saffron transition-colors">
              {title}
            </h3>

            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white mb-3 sm:mb-4 leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          </div>

          {/* Description - Flex grow to push button to bottom */}
          <p className="text-gray-600 dark:text-light-yellow text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 flex-grow line-clamp-3">
            {description}
            {requiresAuth && !user && (
              <span className="block mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                ⚠��� Sign in required to access this service
              </span>
            )}
          </p>

          {/* Action Button - Always at bottom */}
          <div className="mt-auto">
            <ServiceButton />
          </div>
        </CardContent>
      </Card>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default ProtectedServiceCard;
