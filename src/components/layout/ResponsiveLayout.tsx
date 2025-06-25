/**
 * Responsive Layout Component
 * Provides mobile-first responsive grid layouts and containers
 */

import React from "react";
import { cn } from "@/lib/utils";

// Breakpoint values matching Tailwind CSS defaults
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Grid column configurations
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ResponsiveValue<T> {
  default: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}

export interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: GridCols | ResponsiveValue<GridCols>;
  gap?: number | ResponsiveValue<number>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "screen";
  padding?: boolean | ResponsiveValue<boolean>;
  margin?: boolean | ResponsiveValue<boolean>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: "row" | "column" | ResponsiveValue<"row" | "column">;
  gap?: number | ResponsiveValue<number>;
  align?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | ResponsiveValue<"start" | "center" | "end" | "stretch">;
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | ResponsiveValue<
        "start" | "center" | "end" | "between" | "around" | "evenly"
      >;
  wrap?: boolean | ResponsiveValue<boolean>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export interface ResponsiveColumnProps {
  children: React.ReactNode;
  span?: GridCols | ResponsiveValue<GridCols>;
  offset?: GridCols | ResponsiveValue<GridCols>;
  order?: number | ResponsiveValue<number>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Utility function to generate responsive classes
function generateResponsiveClasses<T>(
  value: T | ResponsiveValue<T>,
  classGenerator: (val: T) => string,
): string {
  if (typeof value === "object" && value !== null && "default" in value) {
    const responsiveValue = value as ResponsiveValue<T>;
    return [
      classGenerator(responsiveValue.default),
      responsiveValue.sm && `sm:${classGenerator(responsiveValue.sm)}`,
      responsiveValue.md && `md:${classGenerator(responsiveValue.md)}`,
      responsiveValue.lg && `lg:${classGenerator(responsiveValue.lg)}`,
      responsiveValue.xl && `xl:${classGenerator(responsiveValue.xl)}`,
      responsiveValue["2xl"] && `2xl:${classGenerator(responsiveValue["2xl"])}`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return classGenerator(value as T);
}

// Responsive Grid Component
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = 1,
  gap = 4,
  className = "",
  as: Component = "div",
}) => {
  const colsClasses = generateResponsiveClasses(
    cols,
    (val) => `grid-cols-${val}`,
  );

  const gapClasses = generateResponsiveClasses(gap, (val) => `gap-${val}`);

  return (
    <Component className={cn("grid", colsClasses, gapClasses, className)}>
      {children}
    </Component>
  );
};

// Responsive Container Component
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = "full",
  padding = true,
  margin = false,
  className = "",
  as: Component = "div",
}) => {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
    screen: "max-w-screen-xl",
  }[maxWidth];

  const paddingClasses = generateResponsiveClasses(padding, (val) =>
    val ? "px-4 sm:px-6 lg:px-8" : "",
  );

  const marginClasses = generateResponsiveClasses(margin, (val) =>
    val ? "mx-auto" : "",
  );

  return (
    <Component
      className={cn(
        "w-full",
        maxWidthClass,
        typeof padding === "boolean"
          ? padding
            ? "px-4 sm:px-6 lg:px-8"
            : ""
          : paddingClasses,
        typeof margin === "boolean" ? (margin ? "mx-auto" : "") : marginClasses,
        className,
      )}
    >
      {children}
    </Component>
  );
};

// Responsive Stack Component (Flexbox)
export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = "column",
  gap = 4,
  align = "start",
  justify = "start",
  wrap = false,
  className = "",
  as: Component = "div",
}) => {
  const directionClasses = generateResponsiveClasses(direction, (val) =>
    val === "row" ? "flex-row" : "flex-col",
  );

  const gapClasses = generateResponsiveClasses(gap, (val) => `gap-${val}`);

  const alignClasses = generateResponsiveClasses(align, (val) => {
    const alignMap = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };
    return alignMap[val];
  });

  const justifyClasses = generateResponsiveClasses(justify, (val) => {
    const justifyMap = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };
    return justifyMap[val];
  });

  const wrapClasses = generateResponsiveClasses(wrap, (val) =>
    val ? "flex-wrap" : "flex-nowrap",
  );

  return (
    <Component
      className={cn(
        "flex",
        directionClasses,
        gapClasses,
        alignClasses,
        justifyClasses,
        wrapClasses,
        className,
      )}
    >
      {children}
    </Component>
  );
};

// Responsive Column Component
export const ResponsiveColumn: React.FC<ResponsiveColumnProps> = ({
  children,
  span = 1,
  offset = 0,
  order,
  className = "",
  as: Component = "div",
}) => {
  const spanClasses = generateResponsiveClasses(
    span,
    (val) => `col-span-${val}`,
  );

  const offsetClasses = generateResponsiveClasses(offset, (val) =>
    val > 0 ? `col-start-${val + 1}` : "",
  );

  const orderClasses = order
    ? generateResponsiveClasses(order, (val) => `order-${val}`)
    : "";

  return (
    <Component
      className={cn(spanClasses, offsetClasses, orderClasses, className)}
    >
      {children}
    </Component>
  );
};

// Responsive Card Layout
export interface ResponsiveCardLayoutProps {
  children: React.ReactNode;
  cardMinWidth?: string;
  gap?: number | ResponsiveValue<number>;
  className?: string;
}

export const ResponsiveCardLayout: React.FC<ResponsiveCardLayoutProps> = ({
  children,
  cardMinWidth = "300px",
  gap = 6,
  className = "",
}) => {
  const gapClasses = generateResponsiveClasses(gap, (val) => `gap-${val}`);

  return (
    <div
      className={cn("grid auto-fit-grid", gapClasses, className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${cardMinWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

// Responsive Dashboard Layout
export interface ResponsiveDashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarWidth?: string;
  collapsibleSidebar?: boolean;
  className?: string;
}

export const ResponsiveDashboardLayout: React.FC<
  ResponsiveDashboardLayoutProps
> = ({
  children,
  sidebar,
  header,
  footer,
  sidebarWidth = "256px",
  collapsibleSidebar = true,
  className = "",
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      {/* Header */}
      {header && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {header}
        </header>
      )}

      <div className={cn("flex", header && "pt-16")}>
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={cn(
                "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0",
                header && "pt-16",
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0",
              )}
            >
              {sidebar}
            </div>
          </>
        )}

        {/* Main content */}
        <main className={cn("flex-1 min-h-screen", sidebar && "lg:ml-64")}>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer
          className={cn(
            "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700",
            sidebar && "lg:ml-64",
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  );
};

// Responsive Section with predefined spacing
export interface ResponsiveSectionProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  size = "md",
  className = "",
  as: Component = "section",
}) => {
  const sizeClasses = {
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-24 lg:py-32",
  }[size];

  return (
    <Component className={cn(sizeClasses, className)}>
      <ResponsiveContainer padding margin>
        {children}
      </ResponsiveContainer>
    </Component>
  );
};

// Responsive Image Component
export interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  srcSet?: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | string;
  priority?: boolean;
  placeholder?: React.ReactNode;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  srcSet,
  className = "",
  objectFit = "cover",
  aspectRatio = "video",
  priority = false,
  placeholder,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const aspectRatioClasses =
    {
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    }[aspectRatio] || aspectRatio;

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  }[objectFit];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
        aspectRatioClasses,
        className,
      )}
    >
      {/* Placeholder */}
      {(!imageLoaded || imageError) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder || (
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          )}
        </div>
      )}

      {/* Image */}
      {!imageError && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          srcSet={srcSet}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFitClasses,
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

// Responsive Typography Scale
export interface ResponsiveHeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | ResponsiveValue<
        "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
      >;
  weight?:
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | ResponsiveValue<"normal" | "medium" | "semibold" | "bold">;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ResponsiveHeading: React.FC<ResponsiveHeadingProps> = ({
  children,
  level,
  size,
  weight = "bold",
  className = "",
  as,
}) => {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);

  // Default responsive sizes based on heading level
  const defaultSizes: Record<number, ResponsiveValue<string>> = {
    1: { default: "2xl", sm: "3xl", md: "4xl", lg: "5xl" },
    2: { default: "xl", sm: "2xl", md: "3xl", lg: "4xl" },
    3: { default: "lg", sm: "xl", md: "2xl", lg: "3xl" },
    4: { default: "base", sm: "lg", md: "xl", lg: "2xl" },
    5: { default: "sm", sm: "base", md: "lg", lg: "xl" },
    6: { default: "xs", sm: "sm", md: "base", lg: "lg" },
  };

  const finalSize = size || defaultSizes[level];

  const sizeClasses = generateResponsiveClasses(
    finalSize,
    (val) => `text-${val}`,
  );

  const weightClasses = generateResponsiveClasses(
    weight,
    (val) => `font-${val}`,
  );

  return (
    <Component
      className={cn(
        sizeClasses,
        weightClasses,
        "leading-tight tracking-tight",
        className,
      )}
    >
      {children}
    </Component>
  );
};

// Export utility hook for breakpoint detection
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]})`,
    );
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

  return matches;
};

// Export utility hook for current breakpoint
export const useCurrentBreakpoint = (): Breakpoint => {
  const [currentBreakpoint, setCurrentBreakpoint] =
    React.useState<Breakpoint>("sm");

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setCurrentBreakpoint("2xl");
      else if (width >= 1280) setCurrentBreakpoint("xl");
      else if (width >= 1024) setCurrentBreakpoint("lg");
      else if (width >= 768) setCurrentBreakpoint("md");
      else setCurrentBreakpoint("sm");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return currentBreakpoint;
};

export default ResponsiveGrid;
