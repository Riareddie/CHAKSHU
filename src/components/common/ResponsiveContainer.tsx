import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  as?: "div" | "section" | "main" | "article" | "aside";
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  size = "lg",
  padding = "md",
  as: Component = "div",
}) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 sm:px-6",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-4 sm:px-6 lg:px-8 xl:px-12",
    xl: "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  };

  return (
    <Component
      className={cn(
        "w-full mx-auto",
        sizeClasses[size],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default ResponsiveContainer;
