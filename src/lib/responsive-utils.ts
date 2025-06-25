// Responsive breakpoints that match Tailwind CSS
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Common responsive classes for containers
export const containerClasses = "container mx-auto px-4 sm:px-6 lg:px-8";

// Responsive grid classes
export const responsiveGrids = {
  cards2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  cards3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  cards4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
  features: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
  stats: "grid grid-cols-2 md:grid-cols-4 gap-6",
  services:
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
} as const;

// Responsive text classes
export const responsiveText = {
  hero: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold",
  heading: "text-2xl sm:text-3xl md:text-4xl font-bold",
  subheading: "text-xl sm:text-2xl md:text-3xl font-semibold",
  body: "text-base sm:text-lg",
  small: "text-sm sm:text-base",
} as const;

// Responsive spacing classes
export const responsiveSpacing = {
  section: "py-12 sm:py-16 lg:py-20",
  sectionSmall: "py-8 sm:py-12 lg:py-16",
  card: "p-4 sm:p-6 lg:p-8",
  button: "px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4",
} as const;

// Responsive flex utilities
export const responsiveFlex = {
  centerStack: "flex flex-col items-center justify-center",
  spaceBetween: "flex flex-col sm:flex-row justify-between items-center gap-4",
  buttonGroup: "flex flex-col sm:flex-row gap-4 justify-center items-center",
  navItems: "flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-6",
} as const;

// Check if device is mobile
export const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

// Check if device is tablet
export const isTablet = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Check if device is desktop
export const isDesktop = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 1024;
};

// Get current breakpoint
export const getCurrentBreakpoint = (): keyof typeof breakpoints => {
  if (typeof window === "undefined") return "lg";

  const width = window.innerWidth;
  if (width >= 1536) return "2xl";
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "sm";
};
