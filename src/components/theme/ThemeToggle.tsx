import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Contrast, Check, Eye } from "lucide-react";
import { useTheme } from "@/contexts/EnhancedThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const ThemeToggle: React.FC = () => {
  const {
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
  } = useTheme();

  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    {
      value: "light" as const,
      label:
        currentLanguage === "en"
          ? "Light"
          : currentLanguage === "hi"
            ? "हल्का"
            : currentLanguage === "bn"
              ? "হালকা"
              : currentLanguage === "ur"
                ? "ہلکا"
                : "Light",
      icon: Sun,
      description:
        currentLanguage === "en"
          ? "Always use light theme"
          : currentLanguage === "hi"
            ? "हमेशा हल्की थीम का उपयोग करें"
            : currentLanguage === "bn"
              ? "সর্বদা হালকা থিম ব্যবহার করুন"
              : currentLanguage === "ur"
                ? "ہ��یشہ ہلکا تھیم استعمال کریں"
                : "Always use light theme",
    },
    {
      value: "dark" as const,
      label:
        currentLanguage === "en"
          ? "Dark"
          : currentLanguage === "hi"
            ? "गहरा"
            : currentLanguage === "bn"
              ? "গাঢ়"
              : currentLanguage === "ur"
                ? "گہرا"
                : "Dark",
      icon: Moon,
      description:
        currentLanguage === "en"
          ? "Always use dark theme"
          : currentLanguage === "hi"
            ? "हमेशा गहरी थीम का उपयोग करें"
            : currentLanguage === "bn"
              ? "সর্বদা গাঢ় থিম ব্যবহার করুন"
              : currentLanguage === "ur"
                ? "ہمیشہ گہرا تھیم استعمال کریں"
                : "Always use dark theme",
    },
    {
      value: "auto" as const,
      label:
        currentLanguage === "en"
          ? "System"
          : currentLanguage === "hi"
            ? "सिस्टम"
            : currentLanguage === "bn"
              ? "সিস্টেম"
              : currentLanguage === "ur"
                ? "نظام"
                : "System",
      icon: Monitor,
      description:
        currentLanguage === "en"
          ? "Follow system preference"
          : currentLanguage === "hi"
            ? "सिस्टम प्राथमिकता का पालन करें"
            : currentLanguage === "bn"
              ? "সিস্টেম পছন্দ অনুসরণ করুন"
              : currentLanguage === "ur"
                ? "نظام کی ترجیح کا پیروی کریں"
                : "Follow system preference",
    },
  ];

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setIsOpen(false);

    // Announce theme change to screen readers
    const announcement = `Theme changed to ${newTheme === "auto" ? `system (currently ${resolvedTheme})` : newTheme} mode`;

    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = announcement;
    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  const handleContrastToggle = () => {
    toggleContrast();

    // Announce contrast change to screen readers
    const newLevel = contrastLevel === "normal" ? "high" : "normal";
    const announcement = `Contrast changed to ${newLevel} contrast mode`;

    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = announcement;
    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  const getCurrentThemeIcon = () => {
    if (theme === "auto") {
      return systemPrefersDark ? Moon : Sun;
    }
    return theme === "dark" ? Moon : Sun;
  };

  const CurrentIcon = getCurrentThemeIcon();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-india-saffron focus:ring-offset-2"
          aria-label={`${t.accessibility.themeToggle}. Current theme: ${theme === "auto" ? `system (${resolvedTheme})` : theme}${isHighContrast ? ", high contrast" : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <CurrentIcon
            className={`h-4 w-4 transition-all duration-300 ${
              isDark ? "text-yellow-400" : "text-gray-600 dark:text-light-yellow"
            }`}
            aria-hidden="true"
          />
          {isHighContrast && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
              aria-hidden="true"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72"
        align="end"
        sideOffset={5}
        role="menu"
        aria-label="Theme settings menu"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-gray-900 dark:text-white px-3 py-2">
          <Eye className="h-4 w-4 inline mr-2" aria-hidden="true" />
          {currentLanguage === "en"
            ? "Appearance Settings"
            : currentLanguage === "hi"
              ? "रूप सेटिंग्स"
              : currentLanguage === "bn"
                ? "চেহারা সেটিংস"
                : currentLanguage === "ur"
                  ? "ظاہ��ی سیٹنگز"
                  : "Appearance Settings"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Theme Options */}
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-gray-500 dark:text-light-yellow px-2 py-1 uppercase tracking-wide">
            {currentLanguage === "en"
              ? "Theme Mode"
              : currentLanguage === "hi"
                ? "थीम मोड"
                : currentLanguage === "bn"
                  ? "থিম মোড"
                  : currentLanguage === "ur"
                    ? "تھیم موڈ"
                    : "Theme Mode"}
          </div>

          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = theme === option.value;

            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`px-3 py-2 cursor-pointer focus:bg-india-saffron focus:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isSelected ? "bg-india-saffron/10 text-india-saffron" : ""
                }`}
                role="menuitem"
                aria-current={isSelected ? "true" : "false"}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {option.label}
                        {option.value === "auto" && (
                          <span className="ml-2 text-xs opacity-75">
                            ({systemPrefersDark ? "Dark" : "Light"})
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-light-yellow">
                        {option.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      className="h-4 w-4 text-india-saffron"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* Contrast Toggle */}
        <DropdownMenuItem
          onClick={handleContrastToggle}
          className="px-3 py-2 cursor-pointer focus:bg-india-saffron focus:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <Contrast className="h-4 w-4" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {currentLanguage === "en"
                    ? "High Contrast"
                    : currentLanguage === "hi"
                      ? "उच्च कंट्रास्ट"
                      : currentLanguage === "bn"
                        ? "উচ্চ কনট্রাস্ট"
                        : currentLanguage === "ur"
                          ? "اعلیٰ تضاد"
                          : "High Contrast"}
                </span>
                <span className="text-xs text-gray-500 dark:text-light-yellow">
                  {currentLanguage === "en"
                    ? "Enhance visibility for better accessibility"
                    : currentLanguage === "hi"
                      ? "बेहतर पहुंच के लिए दृश्यता बढ़ाएं"
                      : currentLanguage === "bn"
                        ? "ভাল অ্যাক্সেসিবিলিটির জন্য দৃশ্যমানতা উন্নত করুন"
                        : currentLanguage === "ur"
                          ? "بہتر رسائی کے لیے نظر کو بہتر بنائیں"
                          : "Enhance visibility for better accessibility"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={isHighContrast ? "default" : "secondary"}
                className="text-xs px-2 py-0.5"
              >
                {isHighContrast
                  ? currentLanguage === "en"
                    ? "ON"
                    : currentLanguage === "hi"
                      ? "चालू"
                      : currentLanguage === "bn"
                        ? "চালু"
                        : currentLanguage === "ur"
                          ? "آن"
                          : "ON"
                  : currentLanguage === "en"
                    ? "OFF"
                    : currentLanguage === "hi"
                      ? "बंद"
                      : currentLanguage === "bn"
                        ? "বন্ধ"
                        : currentLanguage === "ur"
                          ? "آف"
                          : "OFF"}
              </Badge>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Accessibility Status */}
        <div className="px-3 py-2 text-xs text-gray-500 dark:text-light-yellow">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>
                {currentLanguage === "en"
                  ? "Reduced Motion"
                  : currentLanguage === "hi"
                    ? "कम गति"
                    : currentLanguage === "bn"
                      ? "কম গতি"
                      : currentLanguage === "ur"
                        ? "کم حرکت"
                        : "Reduced Motion"}
              </span>
              <Badge
                variant={reducedMotion ? "default" : "secondary"}
                className="text-xs"
              >
                {reducedMotion
                  ? currentLanguage === "en"
                    ? "ON"
                    : currentLanguage === "hi"
                      ? "चालू"
                      : currentLanguage === "bn"
                        ? "চালু"
                        : currentLanguage === "ur"
                          ? "آن"
                          : "ON"
                  : currentLanguage === "en"
                    ? "OFF"
                    : currentLanguage === "hi"
                      ? "बंद"
                      : currentLanguage === "bn"
                        ? "বন্ধ"
                        : currentLanguage === "ur"
                          ? "آف"
                          : "OFF"}
              </Badge>
            </div>
            <div className="text-xs opacity-75">
              {currentLanguage === "en"
                ? "WCAG AA Compliant"
                : currentLanguage === "hi"
                  ? "WCAG AA अनुपालित"
                  : currentLanguage === "bn"
                    ? "WCAG AA সম্মত"
                    : currentLanguage === "ur"
                      ? "WCAG AA منطبق"
                      : "WCAG AA Compliant"}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
