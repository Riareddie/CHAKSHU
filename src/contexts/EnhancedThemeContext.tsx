import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "auto";
export type ContrastLevel = "normal" | "high";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  contrastLevel: ContrastLevel;
  setTheme: (theme: Theme) => void;
  setContrastLevel: (level: ContrastLevel) => void;
  toggleTheme: () => void;
  toggleContrast: () => void;
  isDark: boolean;
  isHighContrast: boolean;
  systemPrefersDark: boolean;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [contrastLevel, setContrastLevelState] =
    useState<ContrastLevel>("normal");
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect system preferences
  useEffect(() => {
    // Dark mode preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(darkModeQuery.matches);

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    darkModeQuery.addEventListener("change", handleDarkModeChange);

    // Reduced motion preference
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    setReducedMotion(reducedMotionQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    // High contrast preference
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    if (highContrastQuery.matches) {
      setContrastLevelState("high");
    }

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setContrastLevelState("high");
      }
    };

    highContrastQuery.addEventListener("change", handleHighContrastChange);

    return () => {
      darkModeQuery.removeEventListener("change", handleDarkModeChange);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
      highContrastQuery.removeEventListener("change", handleHighContrastChange);
    };
  }, []);

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("chakshu-theme") as Theme;
    const savedContrast = localStorage.getItem(
      "chakshu-contrast",
    ) as ContrastLevel;

    if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    if (savedContrast && ["normal", "high"].includes(savedContrast)) {
      setContrastLevelState(savedContrast);
    }
  }, []);

  // Calculate resolved theme
  const resolvedTheme: "light" | "dark" =
    theme === "auto"
      ? systemPrefersDark
        ? "dark"
        : "light"
      : theme === "dark"
        ? "dark"
        : "light";

  const isDark = resolvedTheme === "dark";
  const isHighContrast = contrastLevel === "high";

  // Apply theme and accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark", "high-contrast", "reduced-motion");

    // Apply current theme
    root.classList.add(resolvedTheme);

    // Apply contrast level
    if (isHighContrast) {
      root.classList.add("high-contrast");
    }

    // Apply reduced motion
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    }

    // Set data attributes for CSS targeting
    root.setAttribute("data-theme", resolvedTheme);
    root.setAttribute("data-contrast", contrastLevel);
    root.setAttribute("data-reduced-motion", reducedMotion.toString());

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColor = isDark
        ? isHighContrast
          ? "#000000"
          : "#0f172a"
        : isHighContrast
          ? "#ffffff"
          : "#ffffff";
      metaThemeColor.setAttribute("content", themeColor);
    }

    // Save preferences to localStorage
    localStorage.setItem("chakshu-theme", theme);
    localStorage.setItem("chakshu-contrast", contrastLevel);

    // Announce theme change to screen readers
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const announcement = `Theme changed to ${resolvedTheme} mode${isHighContrast ? " with high contrast" : ""}`;

      // Create a subtle announcement that doesn't interrupt
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(announcement);
        utterance.volume = 0.1;
        utterance.rate = 2;
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }, [resolvedTheme, isHighContrast, reducedMotion, theme, contrastLevel]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setContrastLevel = (level: ContrastLevel) => {
    setContrastLevelState(level);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("auto");
    } else {
      setTheme("light");
    }
  };

  const toggleContrast = () => {
    setContrastLevel(contrastLevel === "normal" ? "high" : "normal");
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    contrastLevel,
    setTheme,
    setContrastLevel,
    toggleTheme,
    toggleContrast,
    isDark,
    isHighContrast,
    systemPrefersDark,
    reducedMotion,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
