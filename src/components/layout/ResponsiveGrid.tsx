import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
  autoFit?: boolean;
  minItemWidth?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = "md",
  autoFit = false,
  minItemWidth = "280px",
}) => {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-10",
  };

  const getColumnClasses = () => {
    if (autoFit) {
      return "grid";
    }

    const { sm = 1, md = 2, lg = 3, xl = 4 } = columns;
    return cn(
      "grid",
      `grid-cols-${sm}`,
      md && `md:grid-cols-${md}`,
      lg && `lg:grid-cols-${lg}`,
      xl && `xl:grid-cols-${xl}`,
    );
  };

  const style = autoFit
    ? {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
      }
    : undefined;

  return (
    <div
      className={cn(getColumnClasses(), gapClasses[gap], className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
