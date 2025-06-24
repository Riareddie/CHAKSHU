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
import { Globe, Check } from "lucide-react";
import {
  useLanguage,
  languages,
  LanguageCode,
} from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t, getLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangInfo = getLanguageInfo(currentLanguage);

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setIsOpen(false);

    // Announce language change to screen readers
    const langInfo = getLanguageInfo(langCode);
    if (langInfo) {
      const announcement = `Language changed to ${langInfo.name}`;

      // Create announcement element for screen readers
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.className = "sr-only";
      announcer.textContent = announcement;
      document.body.appendChild(announcer);

      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }
  };

  // Group languages by script for better organization
  const languageGroups = {
    "Latin/English": languages.filter((lang) => lang.script === "latin"),
    Devanagari: languages.filter((lang) => lang.script === "devanagari"),
    Bengali: languages.filter((lang) => lang.script === "bengali"),
    Dravidian: languages.filter((lang) =>
      ["tamil", "telugu", "kannada", "malayalam"].includes(lang.script),
    ),
    "Indo-Arabic": languages.filter((lang) =>
      ["urdu", "persian"].includes(lang.script),
    ),
    "Other Scripts": languages.filter(
      (lang) =>
        ![
          "latin",
          "devanagari",
          "bengali",
          "tamil",
          "telugu",
          "kannada",
          "malayalam",
          "urdu",
          "persian",
        ].includes(lang.script),
    ),
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 px-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-india-saffron focus:ring-offset-2"
          aria-label={t.accessibility.languageSelector}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">
            {currentLangInfo?.flag} {currentLangInfo?.nativeName}
          </span>
          <span className="sm:hidden">{currentLangInfo?.flag}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 max-h-96 overflow-y-auto"
        align="end"
        sideOffset={5}
        role="menu"
        aria-label="Language selection menu"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-gray-900 dark:text-white px-3 py-2">
          <Globe className="h-4 w-4 inline mr-2" aria-hidden="true" />
          {currentLanguage === "en"
            ? "Select Language"
            : currentLanguage === "hi"
              ? "भाषा चुनें"
              : currentLanguage === "bn"
                ? "ভাষা নির্বাচন করুন"
                : currentLanguage === "ur"
                  ? "زبان منتخب کریں"
                  : "Select Language"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {Object.entries(languageGroups).map(([groupName, groupLangs]) => {
          if (groupLangs.length === 0) return null;

          return (
            <div key={groupName}>
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-light-yellow px-3 py-1 uppercase tracking-wide">
                {groupName}
              </DropdownMenuLabel>

              {groupLangs.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2 cursor-pointer focus:bg-india-saffron focus:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    currentLanguage === lang.code
                      ? "bg-india-saffron/10 text-india-saffron"
                      : ""
                  }`}
                  role="menuitem"
                  aria-current={
                    currentLanguage === lang.code ? "true" : "false"
                  }
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg" aria-hidden="true">
                        {lang.flag}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {lang.nativeName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-light-yellow">
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {lang.rtl && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5"
                        >
                          RTL
                        </Badge>
                      )}
                      {currentLanguage === lang.code && (
                        <Check
                          className="h-4 w-4 text-india-saffron"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
            </div>
          );
        })}

        {/* Language support info */}
        <div className="px-3 py-2 text-xs text-gray-500 dark:text-light-yellow border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span>
              {currentLanguage === "en"
                ? "Voice & Screen Reader Support"
                : currentLanguage === "hi"
                  ? "आवाज़ और स्क्रीन रीडर समर्थन"
                  : currentLanguage === "bn"
                    ? "ভয়েস ও স্ক্রিন রিডার সাপোর্ট"
                    : currentLanguage === "ur"
                      ? "آواز اور اسکرین ریڈر سپورٹ"
                      : "Voice & Screen Reader Support"}
            </span>
            <Badge variant="secondary" className="text-xs">
              {currentLanguage === "en"
                ? "Available"
                : currentLanguage === "hi"
                  ? "उपलब्ध"
                  : currentLanguage === "bn"
                    ? "উপলব্ধ"
                    : currentLanguage === "ur"
                      ? "دستیاب"
                      : "Available"}
            </Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
