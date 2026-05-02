"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.chat": { ar: "المحادثة", en: "Chat" },
  "nav.services": { ar: "الخدمات", en: "Services" },
  "nav.reviews": { ar: "التقييمات", en: "Reviews" },
  "nav.admin": { ar: "لوحة التحكم", en: "Dashboard" },
  "nav.about": { ar: "حول النظام", en: "About" },

  // Landing page
  "hero.title": { ar: "المساعد الحكومي الأردني الذكي", en: "Jordan Government AI Assistant" },
  "hero.subtitle": {
    ar: "احصل على إجابات فورية ودقيقة حول الخدمات الحكومية الأردنية",
    en: "Get instant and accurate answers about Jordanian government services",
  },
  "hero.cta": { ar: "ابدأ المحادثة", en: "Start Chat" },
  "hero.secondary": { ar: "تصفح الخدمات", en: "Browse Services" },

  // Features
  "features.title": { ar: "مميزات المنصة", en: "Platform Features" },
  "features.bilingual.title": { ar: "ثنائي اللغة", en: "Bilingual" },
  "features.bilingual.desc": {
    ar: "دعم كامل للعربية والإنجليزية مع واجهة تتكيف تلقائياً",
    en: "Full Arabic and English support with auto-adaptive interface",
  },
  "features.voice.title": { ar: "إدخال صوتي", en: "Voice Input" },
  "features.voice.desc": {
    ar: "اسأل بصوتك والنظام يفهم ويجيب بدقة",
    en: "Ask with your voice and the system understands and responds accurately",
  },
  "features.official.title": { ar: "مصادر رسمية", en: "Official Sources" },
  "features.official.desc": {
    ar: "إجابات مبنية على وثائق حكومية رسمية فقط",
    en: "Answers based only on official government documents",
  },
  "features.available.title": { ar: "متاح 24/7", en: "Available 24/7" },
  "features.available.desc": {
    ar: "خدمة مستمرة على مدار الساعة بدون انتظار",
    en: "Continuous service around the clock with no waiting",
  },

  // How it works
  "how.title": { ar: "كيف يعمل النظام", en: "How It Works" },
  "how.step1.title": { ar: "اطرح سؤالك", en: "Ask Your Question" },
  "how.step1.desc": { ar: "اكتب أو تحدث بسؤالك عن أي خدمة حكومية", en: "Type or speak your question about any government service" },
  "how.step2.title": { ar: "البحث والتحليل", en: "Search & Analyze" },
  "how.step2.desc": { ar: "يبحث النظام في الوثائق الرسمية ويحلل المعلومات", en: "The system searches official documents and analyzes information" },
  "how.step3.title": { ar: "إجابة دقيقة", en: "Accurate Answer" },
  "how.step3.desc": { ar: "تحصل على إجابة منظمة مع المصادر والخطوات", en: "Get a structured answer with sources and steps" },

  // Services
  "services.title": { ar: "الخدمات الحكومية", en: "Government Services" },
  "services.civil": { ar: "الأحوال المدنية والجوازات", en: "Civil Status & Passports" },
  "services.traffic": { ar: "السير والترخيص", en: "Traffic & Licensing" },
  "services.labor": { ar: "وزارة العمل", en: "Ministry of Labor" },
  "services.social": { ar: "مؤسسة الضمان الاجتماعي", en: "Social Security Corporation" },
  "services.interior": { ar: "وزارة الداخلية", en: "Ministry of Interior" },
  "services.telecom": { ar: "هيئة تنظيم الاتصالات", en: "Telecommunications Regulatory Commission" },
  "services.amman": { ar: "أمانة عمان الكبرى", en: "Greater Amman Municipality" },

  // Chat
  "chat.title": { ar: "المحادثة", en: "Chat" },
  "chat.placeholder": { ar: "اكتب سؤالك هنا...", en: "Type your question here..." },
  "chat.send": { ar: "إرسال", en: "Send" },
  "chat.welcome": {
    ar: "مرحباً! أنا المساعد الحكومي الأردني الذكي. كيف يمكنني مساعدتك؟",
    en: "Hello! I am the Jordan Government AI Assistant. How can I help you?",
  },
  "chat.newChat": { ar: "محادثة جديدة", en: "New Chat" },
  "chat.history": { ar: "المحادثات السابقة", en: "Previous Chats" },
  "chat.thinking": { ar: "جاري التفكير...", en: "Thinking..." },
  "chat.suggestionsTitle": { ar: "جرب أن تسأل", en: "Try asking" },
  "chat.suggestion1": { ar: "كيف أجدد جواز السفر؟", en: "How do I renew my passport?" },
  "chat.suggestion2": { ar: "ما هي خطوات تسجيل شركة جديدة؟", en: "How do I register a new company?" },
  "chat.suggestion3": { ar: "كيف أحصل على شهادة عدم محكومية؟", en: "How do I get a non-conviction certificate?" },
  "chat.suggestion4": { ar: "ما هي رسوم تجديد رخصة القيادة؟", en: "What are the driver's license renewal fees?" },

  // Footer
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  "footer.project": { ar: "مشروع تخرج - المساعد الحكومي الأردني الذكي", en: "Graduation Project - Jordan Government AI Assistant" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "ar";
    }

    const saved = window.localStorage.getItem("jordangov-lang");
    return saved === "ar" || saved === "en" ? saved : "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem("jordangov-lang", lang);
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
