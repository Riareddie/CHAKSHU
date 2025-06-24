import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  className?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextUrl?: string;
  nextLabel?: string;
  backUrl?: string;
  backLabel?: string;
}

// Define the logical page flow for the portal
const pageFlow = [
  "/",
  "/dashboard",
  "/reports-management",
  "/community",
  "/education",
  "/analytics",
  "/ai-features",
  "/mobile-app",
  "/help",
];

const getNextPage = (currentPath: string): string | null => {
  const currentIndex = pageFlow.indexOf(currentPath);
  if (currentIndex !== -1 && currentIndex < pageFlow.length - 1) {
    return pageFlow[currentIndex + 1];
  }
  return null;
};

const getPreviousPage = (currentPath: string): string | null => {
  const currentIndex = pageFlow.indexOf(currentPath);
  if (currentIndex > 0) {
    return pageFlow[currentIndex - 1];
  }
  return null;
};

const getPageTitle = (path: string): string => {
  const titles: Record<string, string> = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/reports-management": "My Reports",
    "/community": "Community",
    "/education": "Education",
    "/analytics": "Analytics",
    "/ai-features": "AI Features",
    "/mobile-app": "Mobile App",
    "/help": "Help Center",
  };
  return titles[path] || "Next";
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  className = "",
  showBack = true,
  showNext = true,
  nextUrl,
  nextLabel,
  backUrl,
  backLabel,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine if we should show buttons based on context
  const isHomePage = currentPath === "/";
  const isLastPage =
    currentPath === "/help" || currentPath === pageFlow[pageFlow.length - 1];

  const shouldShowBack = showBack && !isHomePage;
  const shouldShowNext = showNext && !isLastPage;

  // Get next and previous pages
  const nextPage = nextUrl || getNextPage(currentPath);
  const previousPage = backUrl || getPreviousPage(currentPath);

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else if (previousPage) {
      navigate(previousPage);
    } else {
      // Fallback to browser history
      window.history.back();
    }
  };

  const handleNext = () => {
    if (nextUrl) {
      navigate(nextUrl);
    } else if (nextPage) {
      navigate(nextPage);
    }
  };

  // Don't render if neither button should be shown
  if (!shouldShowBack && !shouldShowNext) {
    return null;
  }

  return (
    <div
      className={`flex justify-between items-center w-full mb-6 ${className}`}
    >
      {/* Back Button */}
      <div className="flex-1">
        {shouldShowBack && (
          <Button
            onClick={handleBack}
            className="
              bg-india-saffron hover:bg-saffron-600 
              text-white 
              rounded-lg 
              px-4 py-2 
              flex items-center gap-2 
              transition-all duration-200 
              hover:shadow-lg 
              focus:ring-2 focus:ring-india-saffron focus:ring-offset-2
              touch-manipulation
              min-h-[44px] min-w-[44px]
            "
            size="default"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              {backLabel ||
                (previousPage ? getPageTitle(previousPage) : "Back")}
            </span>
            <span className="sm:hidden">Back</span>
          </Button>
        )}
      </div>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Next Button */}
      <div className="flex-1 flex justify-end">
        {shouldShowNext && nextPage && (
          <Button
            onClick={handleNext}
            className="
              bg-india-saffron hover:bg-saffron-600 
              text-white 
              rounded-lg 
              px-4 py-2 
              flex items-center gap-2 
              transition-all duration-200 
              hover:shadow-lg 
              focus:ring-2 focus:ring-india-saffron focus:ring-offset-2
              touch-manipulation
              min-h-[44px] min-w-[44px]
            "
            size="default"
          >
            <span className="hidden sm:inline">
              {nextLabel || getPageTitle(nextPage)}
            </span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
