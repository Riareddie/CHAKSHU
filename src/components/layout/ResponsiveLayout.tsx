import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "page" | "section" | "card" | "container";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  variant = "container",
  size = "lg",
  padding = "md",
  spacing = "md",
}) => {
  const variantClasses = {
    page: "min-h-screen",
    section: "w-full",
    card: "rounded-lg border bg-card text-card-foreground shadow-sm",
    container: "container mx-auto",
  };

  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 py-2",
    md: "px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
    lg: "px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12",
    xl: "px-8 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-16",
  };

  const spacingClasses = {
    none: "",
    sm: "space-y-2",
    md: "space-y-4 sm:space-y-6",
    lg: "space-y-6 sm:space-y-8",
    xl: "space-y-8 sm:space-y-12",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        variant === "container" && sizeClasses[size],
        paddingClasses[padding],
        spacingClasses[spacing],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveLayout;
