import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Volume2,
  VolumeX,
  Contrast,
  Type,
  Focus,
} from "lucide-react";
import { useTheme } from "@/contexts/EnhancedThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const AccessibilityUtils: React.FC = () => {
  const { toggleContrast, isHighContrast } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const [fontSize, setFontSize] = useState<number>(100);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.8);
  const [speechVolume, setSpeechVolume] = useState<number>(0.9);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [hoverSpeechEnabled, setHoverSpeechEnabled] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Font size adjustment
  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem("chakshu-font-size", newSize.toString());
      announceChange(`Font size increased to ${newSize}%`);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem("chakshu-font-size", newSize.toString());
      announceChange(`Font size decreased to ${newSize}%`);
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = "100%";
    localStorage.setItem("chakshu-font-size", "100");
    announceChange("Font size reset to default");
  };

  // Enhanced speech synthesis toggle with audio testing
  const toggleSpeech = () => {
    const newSpeechState = !speechEnabled;
    setSpeechEnabled(newSpeechState);
    localStorage.setItem("chakshu-speech-enabled", newSpeechState.toString());

    if (newSpeechState) {
      // Test speech immediately when enabling
      const testMessage =
        currentLanguage === "en"
          ? "Text-to-speech is now enabled. You will hear audio feedback when interacting with elements."
          : currentLanguage === "hi"
            ? "टेक्स्ट-टू-स्पीच अब सक्षम है। तत्वों के साथ बातचीत करते समय आपको ऑडियो फीडबैक सुनाई देगा।"
            : currentLanguage === "bn"
              ? "টেক্সট-টু-স্পিচ এখন সক্রিয়। উপাদানগুলির সাথে ইন্টারঅ্যাক্ট করার সময় আপনি অডিও ফিডব্যাক শুনতে পাবেন।"
              : "Text-to-speech is now enabled";

      announceChange(testMessage, false); // Don't play audio for announcement since we're testing

      // Play the test message with speech
      setTimeout(() => {
        speakText(testMessage, true, 0.7);
      }, 500);
    } else {
      window.speechSynthesis.cancel();
      announceChange(
        currentLanguage === "en"
          ? "Text-to-speech disabled"
          : currentLanguage === "hi"
            ? "टेक्स्ट-टू-स्पीच बंद"
            : currentLanguage === "bn"
              ? "টেক্সট-টু-স্পিচ বন্ধ"
              : "Text-to-speech disabled",
        false,
      );
    }
  };

  // Keyboard navigation helper
  const focusMainContent = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      announceChange("Jumped to main content");
    }
  };

  // Enhanced screen reader announcement utility with audio feedback
  const announceChange = (message: string, playAudio: boolean = true) => {
    // Screen reader announcement
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "assertive"); // Changed to assertive for immediate announcement
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = message;
    document.body.appendChild(announcer);

    // Audio feedback if speech is enabled
    if (playAudio && speechEnabled && window.speechSynthesis) {
      speakText(message, true); // Priority announcement
    }

    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 2000); // Increased timeout
  };

  // Enhanced speech synthesis function
  const speakText = (
    text: string,
    isPriority: boolean = false,
    rate: number = 0.8,
  ) => {
    if (!window.speechSynthesis || !speechEnabled) return;

    // Cancel any ongoing speech if this is a priority announcement
    if (isPriority) {
      window.speechSynthesis.cancel();
    }

    // Wait a bit for cancel to take effect
    setTimeout(
      () => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Enhanced audio settings for clarity and volume
        utterance.volume = speechVolume; // Use saved volume preference
        utterance.rate = rate || speechRate; // Use provided rate or saved preference
        utterance.pitch = 1.0; // Standard pitch for clarity

        // Set language with better voice selection
        const languageMap: Record<string, string> = {
          en: "en-US",
          hi: "hi-IN",
          bn: "bn-IN",
          ur: "ur-PK",
          ta: "ta-IN",
          te: "te-IN",
          mr: "mr-IN",
          gu: "gu-IN",
          kn: "kn-IN",
          ml: "ml-IN",
          pa: "pa-IN",
          or: "or-IN",
          as: "as-IN",
        };

        utterance.lang = languageMap[currentLanguage] || "en-US";

        // Try to find the best voice for the language
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith(utterance.lang.split("-")[0]) &&
              (voice.name.includes("Enhanced") ||
                voice.name.includes("Premium") ||
                voice.localService),
          ) ||
          voices.find((voice) =>
            voice.lang.startsWith(utterance.lang.split("-")[0]),
          );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Enhanced error handling and retry mechanism
        utterance.onerror = (event) => {
          console.warn("Speech synthesis error:", event.error);
          if (event.error === "network" || event.error === "synthesis-failed") {
            // Retry with fallback settings
            setTimeout(() => {
              const fallbackUtterance = new SpeechSynthesisUtterance(text);
              fallbackUtterance.volume = 1.0;
              fallbackUtterance.rate = 0.7;
              fallbackUtterance.lang = "en-US";
              window.speechSynthesis.speak(fallbackUtterance);
            }, 500);
          }
        };

        utterance.onstart = () => {
          console.log("Speech started:", text.substring(0, 50) + "...");
        };

        utterance.onend = () => {
          console.log("Speech ended");
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error("Speech synthesis failed:", error);
        }
      },
      isPriority ? 100 : 0,
    );
  };

  // Test speech quality
  const testSpeechQuality = () => {
    const testMessage =
      currentLanguage === "en"
        ? "This is a speech quality test. Can you hear this message clearly?"
        : currentLanguage === "hi"
          ? "यह एक भाषण गुणवत्ता परीक्षण है। क्या आप इस संदेश को स्पष्ट रूप से सुन सकते हैं?"
          : currentLanguage === "bn"
            ? "এটি একটি বক্তৃতা মানের পরীক্ষা। আপনি কি এই বার্তাটি স্পষ্টভাবে শুনতে পাচ্ছেন?"
            : "This is a speech quality test. Can you hear this message clearly?";

    speakText(testMessage, true, speechRate);
  };

  // Toggle hover speech functionality
  const toggleHoverSpeech = () => {
    const newHoverState = !hoverSpeechEnabled;
    setHoverSpeechEnabled(newHoverState);

    if (newHoverState) {
      const enableMessage =
        currentLanguage === "en"
          ? "Hover speech enabled. Move your cursor over elements to hear them spoken."
          : currentLanguage === "hi"
            ? "होवर स्पीच सक्षम। तत्वों को सुनने के लिए अपना कर्सर उन पर ले जाएं।"
            : currentLanguage === "bn"
              ? "হোভার স্পিচ সক্রিয়। উপাদানগুলি শুনতে আপনার কার্সার তাদের উপর সরান।"
              : "Hover speech enabled. Move your cursor over elements to hear them spoken.";

      announceChange(enableMessage, false);
      setTimeout(() => {
        speakText(enableMessage, true, 0.8);
      }, 500);
    } else {
      window.speechSynthesis.cancel();
      announceChange(
        currentLanguage === "en"
          ? "Hover speech disabled"
          : currentLanguage === "hi"
            ? "होवर स्पीच बंद"
            : "Hover speech disabled",
        false,
      );
    }
  };

  // Load voices and preferences
  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem("chakshu-font-size");
    const savedSpeechEnabled = localStorage.getItem("chakshu-speech-enabled");
    const savedSpeechRate = localStorage.getItem("chakshu-speech-rate");
    const savedSpeechVolume = localStorage.getItem("chakshu-speech-volume");
    const savedHoverSpeechEnabled = localStorage.getItem(
      "chakshu-hover-speech-enabled",
    );

    if (savedFontSize) {
      const size = parseInt(savedFontSize, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }

    if (savedSpeechEnabled) {
      setSpeechEnabled(savedSpeechEnabled === "true");
    }

    if (savedSpeechRate) {
      setSpeechRate(parseFloat(savedSpeechRate));
    }

    if (savedSpeechVolume) {
      setSpeechVolume(parseFloat(savedSpeechVolume));
    }

    if (savedHoverSpeechEnabled) {
      setHoverSpeechEnabled(savedHoverSpeechEnabled === "true");
    }

    // Load available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    // Load voices immediately and also when they're loaded
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Save speech preferences when they change
  useEffect(() => {
    localStorage.setItem("chakshu-speech-rate", speechRate.toString());
    localStorage.setItem("chakshu-speech-volume", speechVolume.toString());
    localStorage.setItem(
      "chakshu-hover-speech-enabled",
      hoverSpeechEnabled.toString(),
    );
  }, [speechRate, speechVolume, hoverSpeechEnabled]);

  // Enhanced text-to-speech for interactive elements with better audio quality and hover support
  useEffect(() => {
    if (!speechEnabled) return;

    const handleElementClick = (event: Event) => {
      const target = event.target as HTMLElement;

      // Clear any pending hover speech
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }

      // Get text content with priority order
      let textContent =
        target.getAttribute("aria-label") ||
        target.getAttribute("title") ||
        target.textContent?.trim() ||
        target.getAttribute("placeholder") ||
        target.getAttribute("value");

      // Skip if no meaningful content
      if (!textContent || textContent.length < 2) return;

      // Clean up text content
      textContent = textContent.replace(/\s+/g, " ").trim();

      // Limit length to avoid very long announcements
      if (textContent.length > 100) {
        textContent = textContent.substring(0, 97) + "...";
      }

      // Enhanced speech with better settings (priority for clicks)
      speakText(textContent, true, 0.8);
    };

    const handleElementHover = (event: Event) => {
      // Only proceed if hover speech is enabled
      if (!hoverSpeechEnabled) return;

      const target = event.target as HTMLElement;

      // Clear any existing hover timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      // Get text content with priority order
      let textContent =
        target.getAttribute("aria-label") ||
        target.getAttribute("title") ||
        target.textContent?.trim() ||
        target.getAttribute("placeholder") ||
        target.getAttribute("value");

      // Skip if no meaningful content
      if (!textContent || textContent.length < 2) return;

      // Skip certain elements that might be too noisy
      if (
        target.matches(
          "html, body, div:empty, span:empty, nav, header, footer, main, section, article",
        )
      ) {
        return;
      }

      // Clean up text content
      textContent = textContent.replace(/\s+/g, " ").trim();

      // Limit length for hover speech (shorter than click speech)
      if (textContent.length > 50) {
        textContent = textContent.substring(0, 47) + "...";
      }

      // Add a small delay to avoid speaking too much on quick mouse movements
      const timeout = setTimeout(() => {
        speakText(textContent, false, speechRate * 1.2); // Slightly faster for hover
      }, 300); // 300ms delay

      setHoverTimeout(timeout);
    };

    const handleElementHoverLeave = () => {
      // Clear pending hover speech when mouse leaves
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
    };

    const handleElementFocus = (event: Event) => {
      const target = event.target as HTMLElement;

      // Announce focus for form elements
      if (target.matches("input, select, textarea, [contenteditable]")) {
        const label =
          target.getAttribute("aria-label") ||
          target.getAttribute("placeholder") ||
          target.getAttribute("title") ||
          "Form field";

        const announcement = `${label} focused`;
        speakText(announcement, false, 1.0); // Faster for focus announcements
      }
    };

    // Enhanced selector for all hoverable elements
    const interactiveElements = document.querySelectorAll(`
      button, a, [role="button"], [role="link"], [role="menuitem"],
      input, select, textarea, [contenteditable],
      [tabindex="0"], [tabindex]:not([tabindex="-1"]),
      .clickable, .interactive, h1, h2, h3, h4, h5, h6, p, span, div[aria-label],
      [title], img[alt], svg[aria-label], li, td, th
    `);

    interactiveElements.forEach((element) => {
      element.addEventListener("click", handleElementClick);
      element.addEventListener("focus", handleElementFocus);

      // Add hover listeners for all elements (not just interactive ones)
      element.addEventListener("mouseenter", handleElementHover);
      element.addEventListener("mouseleave", handleElementHoverLeave);
    });

    // Also listen for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (
              element.matches(`
              button, a, [role="button"], [role="link"], [role="menuitem"],
              input, select, textarea, [contenteditable],
              [tabindex="0"], [tabindex]:not([tabindex="-1"]),
              .clickable, .interactive, h1, h2, h3, h4, h5, h6, p, span, div[aria-label],
              [title], img[alt], svg[aria-label], li, td, th
            `)
            ) {
              element.addEventListener("click", handleElementClick);
              element.addEventListener("focus", handleElementFocus);
              element.addEventListener("mouseenter", handleElementHover);
              element.addEventListener("mouseleave", handleElementHoverLeave);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      // Clear any pending hover timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      interactiveElements.forEach((element) => {
        element.removeEventListener("click", handleElementClick);
        element.removeEventListener("focus", handleElementFocus);
        element.removeEventListener("mouseenter", handleElementHover);
        element.removeEventListener("mouseleave", handleElementHoverLeave);
      });
      observer.disconnect();
    };
  }, [
    speechEnabled,
    hoverSpeechEnabled,
    currentLanguage,
    hoverTimeout,
    speechRate,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A: Open accessibility menu
      if (event.altKey && event.key === "a") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }

      // Alt + C: Toggle high contrast
      if (event.altKey && event.key === "c") {
        event.preventDefault();
        toggleContrast();
      }

      // Alt + Plus: Increase font size
      if (event.altKey && event.key === "=") {
        event.preventDefault();
        increaseFontSize();
      }

      // Alt + Minus: Decrease font size
      if (event.altKey && event.key === "-") {
        event.preventDefault();
        decreaseFontSize();
      }

      // Alt + 0: Reset font size
      if (event.altKey && event.key === "0") {
        event.preventDefault();
        resetFontSize();
      }

      // Alt + S: Toggle speech
      if (event.altKey && event.key === "s") {
        event.preventDefault();
        toggleSpeech();
      }

      // Alt + M: Jump to main content
      if (event.altKey && event.key === "m") {
        event.preventDefault();
        focusMainContent();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleContrast]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-india-saffron focus:ring-offset-2"
          aria-label="Accessibility options (Alt+A)"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Accessibility
            className="h-4 w-4 text-gray-600 dark:text-light-yellow"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80"
        align="end"
        sideOffset={5}
        role="menu"
        aria-label="Accessibility options menu"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-gray-900 dark:text-white px-3 py-2">
          <Accessibility className="h-4 w-4 inline mr-2" aria-hidden="true" />
          {currentLanguage === "en"
            ? "Accessibility Options"
            : currentLanguage === "hi"
              ? "सुगम्यता विकल्प"
              : currentLanguage === "bn"
                ? "অ্যাক্সেসিবিলিটি অপশন"
                : currentLanguage === "ur"
                  ? "رسائی کے اختیارات"
                  : "Accessibility Options"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Font Size Controls */}
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-gray-500 dark:text-light-yellow px-2 py-1 uppercase tracking-wide">
            {currentLanguage === "en"
              ? "Text Size"
              : currentLanguage === "hi"
                ? "टेक्स्ट का आकार"
                : currentLanguage === "bn"
                  ? "টেক্সট আকার"
                  : currentLanguage === "ur"
                    ? "متن کا سائز"
                    : "Text Size"}
          </div>

          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= 80}
                className="h-8 w-8 p-0"
                aria-label="Decrease font size (Alt+-)"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>

              <span className="text-sm font-medium min-w-[60px] text-center">
                {fontSize}%
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 150}
                className="h-8 w-8 p-0"
                aria-label="Increase font size (Alt+=)"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFontSize}
              className="h-8 px-2"
              aria-label="Reset font size (Alt+0)"
            >
              <RotateCw className="h-3 w-3 mr-1" />
              {currentLanguage === "en"
                ? "Reset"
                : currentLanguage === "hi"
                  ? "रीसेट"
                  : currentLanguage === "bn"
                    ? "রিসেট"
                    : currentLanguage === "ur"
                      ? "ری سیٹ"
                      : "Reset"}
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* High Contrast Toggle */}
        <DropdownMenuItem
          onClick={toggleContrast}
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
                  Alt+C
                </span>
              </div>
            </div>

            <Badge
              variant={isHighContrast ? "default" : "secondary"}
              className="text-xs px-2 py-0.5"
            >
              {isHighContrast
                ? currentLanguage === "en"
                  ? "ON"
                  : "चालू"
                : currentLanguage === "en"
                  ? "OFF"
                  : "बंद"}
            </Badge>
          </div>
        </DropdownMenuItem>

        {/* Text-to-Speech Toggle */}
        <DropdownMenuItem
          onClick={toggleSpeech}
          className="px-3 py-2 cursor-pointer focus:bg-india-saffron focus:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              {speechEnabled ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {currentLanguage === "en"
                    ? "Text-to-Speech"
                    : currentLanguage === "hi"
                      ? "टेक्स्ट-टू-स्पीच"
                      : currentLanguage === "bn"
                        ? "টেক্সট-টু-স্পিচ"
                        : currentLanguage === "ur"
                          ? "متن سے آواز"
                          : "Text-to-Speech"}
                </span>
                <span className="text-xs text-gray-500 dark:text-light-yellow">
                  Alt+S
                </span>
              </div>
            </div>

            <Badge
              variant={speechEnabled ? "default" : "secondary"}
              className="text-xs px-2 py-0.5"
            >
              {speechEnabled
                ? currentLanguage === "en"
                  ? "ON"
                  : "चालू"
                : currentLanguage === "en"
                  ? "OFF"
                  : "बंद"}
            </Badge>
          </div>
        </DropdownMenuItem>

        {/* Hover Speech Toggle - Only show when main speech is enabled */}
        {speechEnabled && (
          <DropdownMenuItem
            onClick={toggleHoverSpeech}
            className="px-3 py-2 cursor-pointer focus:bg-india-saffron focus:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122"
                  />
                </svg>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {currentLanguage === "en"
                      ? "Hover Speech"
                      : currentLanguage === "hi"
                        ? "होवर स्पीच"
                        : currentLanguage === "bn"
                          ? "হোভার স্পিচ"
                          : currentLanguage === "ur"
                            ? "ہوور اسپیچ"
                            : "Hover Speech"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-light-yellow">
                    {currentLanguage === "en"
                      ? "Speak on cursor hover"
                      : currentLanguage === "hi"
                        ? "कर्सर होवर पर बोलें"
                        : currentLanguage === "bn"
                          ? "কার্সার হোভারে কথা বলুন"
                          : currentLanguage === "ur"
                            ? "کرسر ہوور پر بولیں"
                            : "Speak on cursor hover"}
                  </span>
                </div>
              </div>

              <Badge
                variant={hoverSpeechEnabled ? "default" : "secondary"}
                className="text-xs px-2 py-0.5"
              >
                {hoverSpeechEnabled
                  ? currentLanguage === "en"
                    ? "ON"
                    : "चालू"
                  : currentLanguage === "en"
                    ? "OFF"
                    : "बंद"}
              </Badge>
            </div>
          </DropdownMenuItem>
        )}

        {/* Speech Quality Controls - Only show when speech is enabled */}
        {speechEnabled && (
          <>
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-light-yellow px-2 py-1 uppercase tracking-wide">
                {currentLanguage === "en"
                  ? "Speech Settings"
                  : currentLanguage === "hi"
                    ? "भाषण सेटिंग्स"
                    : currentLanguage === "bn"
                      ? "বক্তৃতা সেটিংস"
                      : currentLanguage === "ur"
                        ? "تقریر کی ترتیبات"
                        : "Speech Settings"}
              </div>

              {/* Speech Rate Control */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {currentLanguage === "en"
                      ? "Speed"
                      : currentLanguage === "hi"
                        ? "गति"
                        : currentLanguage === "bn"
                          ? "গতি"
                          : currentLanguage === "ur"
                            ? "رفتار"
                            : "Speed"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(speechRate * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  aria-label="Speech rate control"
                />
              </div>

              {/* Speech Volume Control */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {currentLanguage === "en"
                      ? "Volume"
                      : currentLanguage === "hi"
                        ? "आवाज़"
                        : currentLanguage === "bn"
                          ? "ভলিউম"
                          : currentLanguage === "ur"
                            ? "آواز"
                            : "Volume"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(speechVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  aria-label="Speech volume control"
                />
              </div>

              {/* Test Speech Button */}
              <div className="px-3 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testSpeechQuality}
                  className="w-full text-xs"
                  aria-label="Test speech quality"
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  {currentLanguage === "en"
                    ? "Test Speech"
                    : currentLanguage === "hi"
                      ? "भाषण परीक्षण"
                      : currentLanguage === "bn"
                        ? "বক্তৃতা পরীক্ষা"
                        : currentLanguage === "ur"
                          ? "تقریر کا امتحان"
                          : "Test Speech"}
                </Button>
              </div>
            </div>

            <DropdownMenuSeparator />
          </>
        )}

        {/* Jump to Main Content */}
        <DropdownMenuItem
          onClick={focusMainContent}
          className="px-3 py-2 cursor-pointer focus:bg-india-saffron focus:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <div className="flex items-center space-x-3">
            <Focus className="h-4 w-4" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {currentLanguage === "en"
                  ? "Jump to Main Content"
                  : currentLanguage === "hi"
                    ? "मुख्य साम���्री पर जाएं"
                    : currentLanguage === "bn"
                      ? "মূল কন্টেন্টে যান"
                      : currentLanguage === "ur"
                        ? "اصل مواد پر جائیں"
                        : "Jump to Main Content"}
              </span>
              <span className="text-xs text-gray-500 dark:text-light-yellow">
                Alt+M
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Keyboard Shortcuts Help */}
        <div className="px-3 py-2 text-xs text-gray-500 dark:text-light-yellow">
          <div className="font-medium mb-2">
            {currentLanguage === "en"
              ? "Keyboard Shortcuts:"
              : currentLanguage === "hi"
                ? "कीबोर्ड शॉर्टकट:"
                : currentLanguage === "bn"
                  ? "কীবোর্ড শর্টকাট:"
                  : currentLanguage === "ur"
                    ? "کیبورڈ شارٹ کٹس:"
                    : "Keyboard Shortcuts:"}
          </div>
          <div className="space-y-1 text-xs">
            <div>
              Alt+A:{" "}
              {currentLanguage === "en" ? "Open this menu" : "यह मेनू खोलें"}
            </div>
            <div>
              Alt+C:{" "}
              {currentLanguage === "en"
                ? "Toggle contrast"
                : "कंट्रास्ट टॉगल करें"}
            </div>
            <div>
              Alt+=/−:{" "}
              {currentLanguage === "en"
                ? "Adjust font size"
                : "फ़ॉन्ट आकार समायोजित करें"}
            </div>
            <div>
              Alt+S:{" "}
              {currentLanguage === "en" ? "Toggle speech" : "स्पीच टॉगल करें"}
            </div>
            <div>
              Mouse hover:{" "}
              {currentLanguage === "en"
                ? "Speak element (if enabled)"
                : "तत्व बोलें (यदि सक्षम हो)"}
            </div>
            <div>
              Tab/Shift+Tab:{" "}
              {currentLanguage === "en" ? "Navigate" : "नेवीगेट करें"}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccessibilityUtils;
