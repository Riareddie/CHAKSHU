import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Loader2, ArrowRight } from "lucide-react";

interface LearnMoreButtonProps {
  variant?:
    | "fraud-prevention"
    | "reporting-process"
    | "community-features"
    | "analytics"
    | "custom";
  customUrl?: string;
  customLabel?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({
  variant = "custom",
  customUrl,
  customLabel = "Learn More",
  className = "",
  size = "default",
  showIcon = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getNavigationConfig = (variant: string) => {
    switch (variant) {
      case "fraud-prevention":
        return {
          url: "/education#fraud-prevention",
          label: "Learn About Fraud Prevention",
          description:
            "Discover tips and strategies to protect yourself from fraud",
        };
      case "reporting-process":
        return {
          url: "/education#reporting-guide",
          label: "Learn Reporting Process",
          description: "Step-by-step guide on how to report fraud incidents",
        };
      case "community-features":
        return {
          url: "/community",
          label: "Explore Community Features",
          description:
            "Join discussions and share experiences with the community",
        };
      case "analytics":
        return {
          url: "/analytics",
          label: "View Detailed Analytics",
          description: "Comprehensive insights and fraud trend analysis",
        };
      default:
        return {
          url: customUrl || "/education",
          label: customLabel,
          description: "Learn more about this topic",
        };
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    const config = getNavigationConfig(variant);

    try {
      // Show loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast({
        title: "Navigating...",
        description: config.description,
      });

      // Navigate to the appropriate page
      if (config.url.startsWith("http")) {
        // External link
        window.open(config.url, "_blank", "noopener,noreferrer");
      } else if (config.url.includes("#")) {
        // Internal link with anchor
        const [path, anchor] = config.url.split("#");
        navigate(path);
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        // Regular internal navigation
        navigate(config.url);
      }
    } catch (error) {
      toast({
        title: "Navigation Error",
        description:
          "Unable to navigate to the requested page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const config = getNavigationConfig(variant);

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`
        group transition-all duration-200 
        hover:bg-india-saffron hover:text-white hover:border-india-saffron
        focus:ring-2 focus:ring-india-saffron focus:ring-offset-2
        ${className}
      `}
      aria-label={config.description}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <span>{config.label}</span>
          {showIcon && (
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          )}
        </>
      )}
    </Button>
  );
};

export default LearnMoreButton;
