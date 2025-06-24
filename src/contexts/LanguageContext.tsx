import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "te"
  | "mr"
  | "ta"
  | "gu"
  | "ur"
  | "kn"
  | "or"
  | "ml"
  | "pa"
  | "as"
  | "mai"
  | "sat"
  | "ks"
  | "ne"
  | "gom"
  | "sd"
  | "doi"
  | "mni"
  | "brx"
  | "sa";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  script: string;
}

export const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    rtl: false,
    script: "latin",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇮🇳",
    rtl: false,
    script: "bengali",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    rtl: false,
    script: "telugu",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇮🇳",
    rtl: false,
    script: "tamil",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    flag: "🇮🇳",
    rtl: false,
    script: "gujarati",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    flag: "🇮🇳",
    rtl: true,
    script: "urdu",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    flag: "🇮🇳",
    rtl: false,
    script: "kannada",
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    flag: "🇮🇳",
    rtl: false,
    script: "oriya",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    flag: "🇮🇳",
    rtl: false,
    script: "malayalam",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    flag: "🇮🇳",
    rtl: false,
    script: "gurmukhi",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    flag: "🇮🇳",
    rtl: false,
    script: "bengali",
  },
  {
    code: "mai",
    name: "Maithili",
    nativeName: "मैथिली",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "sat",
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    flag: "🇮🇳",
    rtl: false,
    script: "ol-chiki",
  },
  {
    code: "ks",
    name: "Kashmiri",
    nativeName: "कॉशुर",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "ne",
    name: "Nepali",
    nativeName: "नेपाली",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "gom",
    name: "Konkani",
    nativeName: "कोंकणी",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "sd",
    name: "Sindhi",
    nativeName: "سنڌي",
    flag: "🇮🇳",
    rtl: true,
    script: "urdu",
  },
  {
    code: "doi",
    name: "Dogri",
    nativeName: "डोगरी",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "mni",
    name: "Manipuri",
    nativeName: "মেইতেই",
    flag: "🇮🇳",
    rtl: false,
    script: "bengali",
  },
  {
    code: "brx",
    name: "Bodo",
    nativeName: "बड़ो",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
  {
    code: "sa",
    name: "Sanskrit",
    nativeName: "संस्कृत",
    flag: "🇮🇳",
    rtl: false,
    script: "devanagari",
  },
];

export interface TranslationKeys {
  header: {
    title: string;
    subtitle: string;
    home: string;
    reportFraud: string;
    myReports: string;
    dashboard: string;
    citizenServices: string;
    community: string;
    education: string;
    mobileApp: string;
    aiFeatures: string;
    trackStatus: string;
    guidelines: string;
    help: string;
    search: string;
    login: string;
    signup: string;
    logout: string;
    profile: string;
  };
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    reportNow: string;
    learnMore: string;
    featuresTitle: string;
    statsTitle: string;
    howItWorksTitle: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    save: string;
    cancel: string;
    submit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    yes: string;
    no: string;
    ok: string;
    delete: string;
    edit: string;
    view: string;
    download: string;
    print: string;
    share: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    select: string;
    selectAll: string;
    clear: string;
    reset: string;
  };
  reporting: {
    reportFraud: string;
    fraudType: string;
    description: string;
    dateTime: string;
    phoneNumber: string;
    evidence: string;
    submitReport: string;
    reportSubmitted: string;
    reportId: string;
    status: string;
    pending: string;
    investigating: string;
    resolved: string;
    closed: string;
  };
  accessibility: {
    skipToContent: string;
    toggleTheme: string;
    toggleLanguage: string;
    mainNavigation: string;
    userMenu: string;
    notification: string;
    searchBox: string;
    languageSelector: string;
    themeToggle: string;
  };
}

export const translations: Record<LanguageCode, TranslationKeys> = {
  en: {
    header: {
      title: "Chakshu Portal",
      subtitle: "Enhanced Spam Reporting Portal",
      home: "Home",
      reportFraud: "Report Fraud",
      myReports: "My Reports",
      dashboard: "Dashboard",
      citizenServices: "Citizen Services",
      community: "Community",
      education: "Education",
      mobileApp: "Mobile App",
      aiFeatures: "AI Features",
      trackStatus: "Track Status",
      guidelines: "Guidelines",
      help: "Help",
      search: "Search",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      profile: "Profile",
    },
    homepage: {
      heroTitle: "Protect India from Fraud Calls & SMS",
      heroSubtitle:
        "Report fraudulent activities and help protect your community",
      reportNow: "Report Fraud Now",
      learnMore: "Learn More",
      featuresTitle: "Key Features",
      statsTitle: "Impact Statistics",
      howItWorksTitle: "How It Works",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      yes: "Yes",
      no: "No",
      ok: "OK",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      download: "Download",
      print: "Print",
      share: "Share",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      refresh: "Refresh",
      select: "Select",
      selectAll: "Select All",
      clear: "Clear",
      reset: "Reset",
    },
    reporting: {
      reportFraud: "Report Fraud",
      fraudType: "Fraud Type",
      description: "Description",
      dateTime: "Date & Time",
      phoneNumber: "Phone Number",
      evidence: "Evidence",
      submitReport: "Submit Report",
      reportSubmitted: "Report Submitted Successfully",
      reportId: "Report ID",
      status: "Status",
      pending: "Pending",
      investigating: "Under Investigation",
      resolved: "Resolved",
      closed: "Closed",
    },
    accessibility: {
      skipToContent: "Skip to main content",
      toggleTheme: "Toggle theme between light and dark",
      toggleLanguage: "Change language",
      mainNavigation: "Main navigation",
      userMenu: "User menu",
      notification: "Notifications",
      searchBox: "Search reports and information",
      languageSelector: "Language selector",
      themeToggle: "Theme toggle",
    },
  },
  hi: {
    header: {
      title: "चक्षु पोर्टल",
      subtitle: "संवर्धित स्पैम रिपोर्टिंग पोर्टल",
      home: "मुख्य पृष्ठ",
      reportFraud: "धोखाधड़ी की रिपोर्ट करें",
      myReports: "मेरी रिपोर्ट्स",
      dashboard: "डैशबोर्ड",
      citizenServices: "नागरिक सेवाएं",
      community: "समुदाय",
      education: "शिक्षा",
      mobileApp: "मोबाइल ऐप",
      aiFeatures: "AI सुविधाएं",
      trackStatus: "स्थिति ट्रैक करें",
      guidelines: "दिशानिर्देश",
      help: "सहायता",
      search: "खोजें",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      profile: "प्रोफाइल",
    },
    homepage: {
      heroTitle: "भारत को धोखाधड़ी कॉल और SMS से सुरक्षित रखें",
      heroSubtitle:
        "धोखाधड़ी की गतिविधियों की रिपोर्ट करें और अपने समुदाय की सुरक्षा में मदद करें",
      reportNow: "अभी रिपोर्ट करें",
      learnMore: "और जानें",
      featuresTitle: "मुख्य विशेषताएं",
      statsTitle: "प्रभाव आंकड़े",
      howItWorksTitle: "यह कैसे काम करता है",
    },
    common: {
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      warning: "चेतावनी",
      info: "जानकारी",
      save: "सेव करें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      close: "बंद करें",
      back: "वापस",
      next: "अगला",
      previous: "पिछला",
      yes: "हां",
      no: "नहीं",
      ok: "ठीक है",
      delete: "मिटाएं",
      edit: "संपादित करें",
      view: "देखें",
      download: "डाउनलोड",
      print: "प्रिंट",
      share: "साझा करें",
      search: "खोजें",
      filter: "फिल्टर",
      sort: "क्रमबद्ध करें",
      refresh: "रिफ्रेश",
      select: "चुनें",
      selectAll: "सभी चुनें",
      clear: "साफ करें",
      reset: "रीसेट",
    },
    reporting: {
      reportFraud: "धोखाधड़ी की रिपोर्ट करें",
      fraudType: "धोखाधड़ी का प्रकार",
      description: "विवरण",
      dateTime: "तारीख और समय",
      phoneNumber: "फोन नंबर",
      evidence: "सा��्ष्य",
      submitReport: "रिपोर्ट जमा करें",
      reportSubmitted: "रिपोर्ट सफलतापूर्वक जमा की गई",
      reportId: "रिपोर्ट आईडी",
      status: "स्थिति",
      pending: "लंबित",
      investigating: "जांच के तहत",
      resolved: "हल किया गया",
      closed: "बंद",
    },
    accessibility: {
      skipToContent: "मुख्य सामग्री पर जाएं",
      toggleTheme: "लाइट और डार्क थीम के बीच टॉगल करें",
      toggleLanguage: "भाषा बदलें",
      mainNavigation: "मुख्य नेवीगेशन",
      userMenu: "उपयोगकर्ता मेनू",
      notification: "सूचनाएं",
      searchBox: "रिपोर्ट और जानकारी खोजें",
      languageSelector: "भाषा चयनकर्ता",
      themeToggle: "थीम टॉगल",
    },
  },
  // Additional languages would follow the same pattern
  // For brevity, I'm including key languages. Full implementation would include all 22 languages
  bn: {
    header: {
      title: "চক্ষু পোর্টাল",
      subtitle: "উন্নত স্প্যাম রিপোর্টিং পোর্টাল",
      home: "হোম",
      reportFraud: "জালিয়াতির রিপোর্ট করুন",
      myReports: "আমার রিপোর্ট",
      dashboard: "ড্যাশবোর্ড",
      citizenServices: "নাগরিক সেবা",
      community: "সম্প্রদায়",
      education: "শিক্ষা",
      mobileApp: "মোবাইল অ্যাপ",
      aiFeatures: "AI বৈশিষ্ট্য",
      trackStatus: "অবস্থা ট্র্যাক করুন",
      guidelines: "নির্দেশিকা",
      help: "সাহায্য",
      search: "অনুসন্ধান",
      login: "লগইন",
      signup: "সাইন আপ",
      logout: "লগআউট",
      profile: "প্রোফাইল",
    },
    homepage: {
      heroTitle: "ভারতকে জালিয়াতি কল ও SMS থেকে রক্ষা করুন",
      heroSubtitle:
        "জালিয়াতি কার্যকলাপের রিপোর্ট করুন এবং আপনার সম্প্রদায়কে রক্ষা করতে সহায়তা করুন",
      reportNow: "এখনই রিপোর্ট করুন",
      learnMore: "আরও জানুন",
      featuresTitle: "মূল বৈশিষ্ট্য",
      statsTitle: "প্রভাব পরিসংখ্যান",
      howItWorksTitle: "এটি কীভাবে কাজ করে",
    },
    common: {
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      success: "সাফল্য",
      warning: "সতর্কতা",
      info: "তথ্য",
      save: "সংরক্ষণ",
      cancel: "বাতিল",
      submit: "জমা দিন",
      close: "বন্ধ",
      back: "পিছনে",
      next: "পরবর্তী",
      previous: "পূর্ববর্তী",
      yes: "হ্যাঁ",
      no: "না",
      ok: "ঠিক আছে",
      delete: "মুছুন",
      edit: "সম্পাদনা",
      view: "দেখুন",
      download: "ডাউনলোড",
      print: "প্রিন্ট",
      share: "শেয়ার",
      search: "অনুসন্ধান",
      filter: "ফিল্টার",
      sort: "সাজান",
      refresh: "রিফ্রেশ",
      select: "নির্বাচন",
      selectAll: "সব নির্বাচন",
      clear: "পরিষ্কার",
      reset: "রিসেট",
    },
    reporting: {
      reportFraud: "জালিয়াতির রিপোর্ট করুন",
      fraudType: "জালিয়াতির ধরন",
      description: "বিবরণ",
      dateTime: "তারিখ ও সময়",
      phoneNumber: "ফোন নম্বর",
      evidence: "প্রমাণ",
      submitReport: "রিপোর্ট জমা দিন",
      reportSubmitted: "রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে",
      reportId: "রিপোর্ট আইডি",
      status: "অবস্থা",
      pending: "অপেক্ষমাণ",
      investigating: "তদন্তাধীন",
      resolved: "সমাধান হয়েছে",
      closed: "বন্ধ",
    },
    accessibility: {
      skipToContent: "মূল কন্টেন্টে যান",
      toggleTheme: "লাইট এবং ডার্ক থিমের মধ্যে টগল করুন",
      toggleLanguage: "ভাষা পরিবর্তন করুন",
      mainNavigation: "মূল নেভিগেশন",
      userMenu: "ব্যবহারকারী মেনু",
      notification: "বিজ্ঞপ্তি",
      searchBox: "রিপোর্ট এবং তথ্য অনুসন্ধান করুন",
      languageSelector: "ভাষা নির্বাচনকারী",
      themeToggle: "থিম টগল",
    },
  },
  ur: {
    header: {
      title: "چکشو پورٹل",
      subtitle: "بہتر اسپیم رپورٹنگ پورٹل",
      home: "ہوم",
      reportFraud: "فراڈ کی اطلاع دیں",
      myReports: "میری رپورٹس",
      dashboard: "ڈیش بورڈ",
      citizenServices: "شہری خدمات",
      community: "کمیونٹی",
      education: "تعلیم",
      mobileApp: "موبائل ایپ",
      aiFeatures: "AI خصوصیات",
      trackStatus: "حالت کا پتہ لگائیں",
      guidelines: "رہنمائی",
      help: "مدد",
      search: "تلاش",
      login: "لاگ ان",
      signup: "سائن اپ",
      logout: "لاگ آؤٹ",
      profile: "پروفائل",
    },
    homepage: {
      heroTitle: "ہندوستان کو فراڈ کالز اور SMS سے محفوظ رکھیں",
      heroSubtitle:
        "فراڈ کی سرگرمیوں کی اطلاع دیں اور اپنی کمیونٹی کی حفاظت میں مدد کریں",
      reportNow: "ابھی رپورٹ کریں",
      learnMore: "مزید جانیں",
      featuresTitle: "اہم خصوصیات",
      statsTitle: "اثرات کے اعداد و شمار",
      howItWorksTitle: "یہ کیسے کام کرتا ہے",
    },
    common: {
      loading: "لوڈ ہو رہا ہے...",
      error: "خرابی",
      success: "کامیابی",
      warning: "انتباہ",
      info: "معلومات",
      save: "محفوظ کریں",
      cancel: "منسوخ",
      submit: "جمع کریں",
      close: "بند کریں",
      back: "واپس",
      next: "اگلا",
      previous: "پچھلا",
      yes: "ہاں",
      no: "نہیں",
      ok: "ٹھیک ہے",
      delete: "حذف کریں",
      edit: "ترمیم",
      view: "دیکھیں",
      download: "ڈاؤن لوڈ",
      print: "پرنٹ",
      share: "شیئر",
      search: "تلاش",
      filter: "فلٹر",
      sort: "ترتیب",
      refresh: "تازہ کریں",
      select: "منتخب کریں",
      selectAll: "تمام منتخب کریں",
      clear: "صاف کریں",
      reset: "دوبارہ سیٹ کریں",
    },
    reporting: {
      reportFraud: "فراڈ کی اطلاع دیں",
      fraudType: "فراڈ کی قسم",
      description: "تفصیل",
      dateTime: "تاریخ اور وقت",
      phoneNumber: "فون نمبر",
      evidence: "ثبوت",
      submitReport: "رپورٹ جمع کریں",
      reportSubmitted: "رپورٹ کامیابی سے جمع ہوگئی",
      reportId: "رپورٹ ID",
      status: "حالت",
      pending: "زیر التواء",
      investigating: "تحقیقات جاری",
      resolved: "حل ہوگیا",
      closed: "بند",
    },
    accessibility: {
      skipToContent: "اصل مواد پر جائیں",
      toggleTheme: "لائٹ اور ڈارک تھیم کے درمیان تبدیل کریں",
      toggleLanguage: "زبان تبدیل کریں",
      mainNavigation: "اصل نیویگیشن",
      userMenu: "صارف مینو",
      notification: "اطلاعات",
      searchBox: "رپورٹس اور معلومات تلاش کریں",
      languageSelector: "زبان منتخب کرنے والا",
      themeToggle: "تھیم ٹوگل",
    },
  },
} as const;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: TranslationKeys;
  isRTL: boolean;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  getLanguageInfo: (code: LanguageCode) => Language | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "chakshu-language",
    ) as LanguageCode;
    if (
      savedLanguage &&
      languages.some((lang) => lang.code === savedLanguage)
    ) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language preference
      const browserLang = navigator.language.split("-")[0] as LanguageCode;
      if (languages.some((lang) => lang.code === browserLang)) {
        setCurrentLanguage(browserLang);
      }
    }
  }, []);

  // Apply language settings to document
  useEffect(() => {
    const languageInfo = languages.find(
      (lang) => lang.code === currentLanguage,
    );
    if (languageInfo) {
      // Set HTML lang attribute
      document.documentElement.setAttribute("lang", currentLanguage);

      // Set direction for RTL languages
      document.documentElement.setAttribute(
        "dir",
        languageInfo.rtl ? "rtl" : "ltr",
      );

      // Add script class for font selection
      document.documentElement.className =
        document.documentElement.className.replace(/script-\w+/g, "") +
        ` script-${languageInfo.script}`;

      // Save to localStorage
      localStorage.setItem("chakshu-language", currentLanguage);
    }
  }, [currentLanguage]);

  const setLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
  };

  const isRTL =
    languages.find((lang) => lang.code === currentLanguage)?.rtl || false;

  const formatNumber = (num: number): string => {
    // Indian number formatting (lakhs, crores)
    if (currentLanguage === "en" || currentLanguage === "hi") {
      if (num >= 10000000) {
        return `${(num / 10000000).toFixed(2)} Cr`;
      } else if (num >= 100000) {
        return `${(num / 100000).toFixed(2)} L`;
      }
    }

    return new Intl.NumberFormat(
      currentLanguage === "en" ? "en-IN" : currentLanguage,
      {
        notation: "compact",
        compactDisplay: "short",
      },
    ).format(num);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(
      currentLanguage === "en" ? "en-IN" : currentLanguage,
      {
        style: "currency",
        currency: "INR",
        currencyDisplay: "symbol",
      },
    ).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(
      currentLanguage === "en" ? "en-IN" : currentLanguage,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ).format(date);
  };

  const getLanguageInfo = (code: LanguageCode): Language | undefined => {
    return languages.find((lang) => lang.code === code);
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage],
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate,
    getLanguageInfo,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
