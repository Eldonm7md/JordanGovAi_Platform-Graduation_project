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
  // ─── TopBar / utility band ───────────────────────────────────
  "topbar.kingdom": {
    ar: "بوابة الخدمات الحكومية الأردنية · مشروع تخرج",
    en: "Hashemite Kingdom of Jordan · Government Services Portal — Graduation Project",
  },
  "topbar.help":          { ar: "مساعدة",       en: "Help" },
  "topbar.accessibility": { ar: "إتاحة",         en: "Accessibility" },
  "topbar.lockup":        { ar: "المساعد الحكومي الأردني الذكي", en: "JordanGov · AI Assistant" },
  "topbar.tagline":       { ar: "بوابة الاستعلام الموحدة للخدمات العامة", en: "Unified inquiry portal for public services" },
  "topbar.search":        { ar: "ابحث في الخدمات والوثائق…", en: "Search services and documents…" },
  "topbar.operational":   { ar: "النظام يعمل",     en: "Operational" },
  "topbar.partial":       { ar: "خدمة محدودة",     en: "Partial service" },
  "topbar.offline":       { ar: "غير متصل",         en: "Offline" },
  "topbar.checking":      { ar: "جاري الفحص…",     en: "Checking…" },

  // ─── Nav ─────────────────────────────────────────────────────
  "nav.home":     { ar: "الرئيسية",       en: "Home" },
  "nav.chat":     { ar: "المساعد الذكي",  en: "AI Assistant" },
  "nav.services": { ar: "الخدمات",        en: "Services" },
  "nav.reviews":  { ar: "التقييمات",      en: "Feedback" },
  "nav.admin":    { ar: "لوحة الإدارة",   en: "Dashboard" },
  "nav.about":    { ar: "حول النظام",     en: "About" },

  // ─── Home ────────────────────────────────────────────────────
  "home.kicker":        { ar: "إصدار رسمي · ٢٠٢٦", en: "Official release · 2026" },
  "home.title": {
    ar: "إجابات موثوقة للخدمات الحكومية، في مكان واحد.",
    en: "Trusted answers to government services, in one place.",
  },
  "home.subtitle": {
    ar: "احصل على إجابات فورية ودقيقة حول الخدمات الحكومية الأردنية، مدعومة بالذكاء الاصطناعي ومستندة إلى الوثائق الرسمية فقط.",
    en: "Get instant, accurate answers about Jordanian government services, powered by AI and grounded strictly in official documents.",
  },
  "home.cta.primary":   { ar: "ابدأ المحادثة ←", en: "Start a conversation →" },
  "home.cta.secondary": { ar: "تصفح الخدمات",    en: "Browse services" },

  "home.trust.bodies":       { ar: "جهات حكومية",    en: "Government bodies" },
  "home.trust.languages":    { ar: "لغات مدعومة",   en: "Supported languages" },
  "home.trust.availability": { ar: "إتاحة الخدمة",   en: "Service availability" },

  // Specimen panel
  "home.specimen.kicker":     { ar: "نموذج إجابة", en: "Sample answer" },
  "home.specimen.question":   { ar: "السؤال",      en: "Question" },
  "home.specimen.q":          { ar: "كيف أجدد جواز السفر؟", en: "How do I renew my passport?" },
  "home.specimen.procedure":  { ar: "الإجراء",     en: "Procedure" },
  "home.specimen.sources":    { ar: "المصادر الرسمية", en: "Official sources" },
  "home.specimen.step1.t":    { ar: "تقديم الطلب", en: "Submit application" },
  "home.specimen.step1.d":    { ar: "إلكترونياً عبر بوابة الخدمات بعد إدخال الرقم الوطني.", en: "Online via the e-services portal after entering your national ID." },
  "home.specimen.step2.t":    { ar: "دفع الرسوم",   en: "Pay the fees" },
  "home.specimen.step2.d":    { ar: "٤٢ دينار للجواز العادي / ١٠٥ دينار للمستعجل.", en: "JOD 42 standard / JOD 105 expedited issuance." },
  "home.specimen.step3.t":    { ar: "استلام الجواز", en: "Collect passport" },
  "home.specimen.step3.d":    { ar: "خلال ٥ أيام عمل من المكتب المختار.", en: "Within 5 working days from your selected office." },

  // Sections
  "home.cap.kicker":     { ar: "المميزات",     en: "Capabilities" },
  "home.cap.title":      { ar: "مميزات المنصة", en: "Platform capabilities" },
  "home.cap.meta":       { ar: "٤ أقسام",       en: "4 sections" },
  "home.how.kicker":     { ar: "آلية العمل",   en: "How it works" },
  "home.how.title":      { ar: "كيف يعمل النظام", en: "How the system works" },
  "home.how.meta":       { ar: "٣ مراحل",       en: "3 stages" },
  "home.how.stage":      { ar: "مرحلة",         en: "Stage" },
  "home.svc.kicker":     { ar: "الجهات المعتمدة", en: "Authorized bodies" },
  "home.svc.title":      { ar: "الخدمات الحكومية المتاحة", en: "Available government services" },
  "home.svc.meta":       { ar: "٧ جهات حكومية", en: "7 government bodies" },
  "home.svc.cta":        { ar: "← اسأل المساعد", en: "Ask assistant →" },

  // Features (existing keys, kept)
  "features.bilingual.title": { ar: "ثنائي اللغة", en: "Bilingual" },
  "features.bilingual.desc":  { ar: "دعم كامل للعربية والإنجليزية مع واجهة تتكيف تلقائياً.", en: "Full Arabic and English support with auto-adaptive interface." },
  "features.voice.title":     { ar: "إدخال صوتي", en: "Voice input" },
  "features.voice.desc":      { ar: "اسأل بصوتك والنظام يفهم ويجيب بدقة.", en: "Ask with your voice; the system understands and responds accurately." },
  "features.official.title":  { ar: "مصادر رسمية", en: "Official sources" },
  "features.official.desc":   { ar: "إجابات مبنية على وثائق حكومية رسمية فقط.", en: "Answers based only on official government documents." },
  "features.available.title": { ar: "متاح ٢٤/٧",   en: "Available 24/7" },
  "features.available.desc":  { ar: "خدمة مستمرة على مدار الساعة بدون انتظار.", en: "Continuous service around the clock with no waiting." },

  // How-it-works
  "how.step1.title": { ar: "اطرح سؤالك",     en: "Ask your question" },
  "how.step1.desc":  { ar: "اكتب أو تحدث بسؤالك عن أي خدمة حكومية.", en: "Type or speak your question about any government service." },
  "how.step2.title": { ar: "البحث والتحليل",  en: "Search & analyze" },
  "how.step2.desc":  { ar: "يبحث النظام في الوثائق الرسمية ويحلل المعلومات.", en: "The system searches official documents and analyzes the information." },
  "how.step3.title": { ar: "إجابة دقيقة",     en: "Receive an answer" },
  "how.step3.desc":  { ar: "تحصل على إجابة منظمة مع المصادر والخطوات.", en: "Get a structured response with sources and steps." },

  // ─── Services ───────────────────────────────────────────────
  "services.kicker":          { ar: "دليل الخدمات", en: "Services directory" },
  "services.title":           { ar: "دليل الخدمات الحكومية", en: "Government services directory" },
  "services.intro": {
    ar: "سبع جهات حكومية معتمدة. اختر أي خدمة لبدء محادثة جاهزة بسؤال نموذجي مع المساعد الذكي.",
    en: "Seven authorized government bodies. Select any service to open a pre-filled conversation with the AI assistant.",
  },
  "services.search":          { ar: "ابحث عن خدمة…", en: "Search the directory…" },
  "services.filter":          { ar: "تصفية",        en: "Filter" },
  "services.filter.all":      { ar: "الكل",          en: "All" },
  "services.filter.individuals": { ar: "أفراد",      en: "Individuals" },
  "services.filter.business": { ar: "أعمال",        en: "Business" },
  "services.cta":             { ar: "← اسأل المساعد", en: "Ask the assistant →" },
  "services.empty":           { ar: "لا توجد نتائج تطابق بحثك.", en: "No services match your search." },
  "services.aud.individuals": { ar: "أفراد",         en: "Individuals" },
  "services.aud.business":    { ar: "أعمال",         en: "Business" },

  // ─── Chat ───────────────────────────────────────────────────
  "chat.title":          { ar: "المحادثة", en: "Chat" },
  "chat.placeholder":    { ar: "اكتب سؤالك هنا…", en: "Type your question here…" },
  "chat.send":           { ar: "إرسال",     en: "Send" },
  "chat.welcome": {
    ar: "مرحباً! أنا المساعد الحكومي الأردني الذكي. كيف يمكنني مساعدتك؟",
    en: "Hello. I'm the JordanGov AI Assistant. How can I help you today?",
  },
  "chat.newChat":        { ar: "محادثة جديدة", en: "New conversation" },
  "chat.history":        { ar: "السجل",        en: "History" },
  "chat.historyEmpty":   { ar: "لا توجد محادثات سابقة", en: "No previous conversations" },
  "chat.thinking":       { ar: "جاري التفكير…", en: "Thinking…" },
  "chat.suggestionsTitle": { ar: "اقتراحات",    en: "Try asking" },
  "chat.suggestion1":    { ar: "كيف أجدد جواز السفر؟", en: "How do I renew my passport?" },
  "chat.suggestion2":    { ar: "ما هي خطوات تسجيل شركة جديدة؟", en: "How do I register a new company?" },
  "chat.suggestion3":    { ar: "كيف أحصل على شهادة عدم محكومية؟", en: "How do I get a non-conviction certificate?" },
  "chat.suggestion4":    { ar: "ما هي رسوم تجديد رخصة القيادة؟", en: "What are the driver's license renewal fees?" },
  "chat.session":        { ar: "جلسة",         en: "Session" },
  "chat.you":            { ar: "أنت",          en: "You" },
  "chat.assistant":      { ar: "المساعد",      en: "Assistant" },
  "chat.officialProc":   { ar: "الإجراء الرسمي", en: "Official procedure" },
  "chat.voiceLabel":     { ar: "تسجيل صوتي",   en: "Voice input" },
  "chat.transcribing":   { ar: "جاري التحويل…", en: "Transcribing…" },
  "chat.errorMsg": {
    ar: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
    en: "Sorry, a connection error occurred. Please try again.",
  },
  "chat.officialSources": { ar: "المصادر الرسمية", en: "Official sources" },

  // ─── About ──────────────────────────────────────────────────
  "about.kicker":        { ar: "حول المشروع",    en: "About the project" },
  "about.title":         { ar: "نظام رسمي لخدمة المواطن.", en: "An official system, in service of citizens." },
  "about.intro": {
    ar: "المساعد الحكومي الأردني الذكي هو مشروع تخرج يهدف إلى تبسيط الوصول إلى المعلومات الحكومية باستخدام الذكاء الاصطناعي التوليدي مع الاستناد إلى الوثائق الرسمية فقط.",
    en: "JordanGov AI Assistant is a graduation project that simplifies access to public-sector information using generative AI grounded strictly in official documents.",
  },
  "about.stat.agencies":  { ar: "جهات حكومية", en: "Agencies" },
  "about.stat.languages": { ar: "لغات",        en: "Languages" },
  "about.stat.uptime":    { ar: "إتاحة",        en: "Uptime" },
  "about.stat.method":    { ar: "أسلوب",        en: "Method" },

  "about.arch.kicker":   { ar: "البنية التقنية", en: "Technical architecture" },
  "about.arch.title":    { ar: "هيكلية النظام",   en: "System architecture" },
  "about.arch.meta":     { ar: "ثلاث طبقات",     en: "Three layers" },
  "about.arch.frontend": { ar: "الواجهة الأمامية", en: "Frontend" },
  "about.arch.backend":  { ar: "الخادم الخلفي",   en: "Backend" },
  "about.arch.ai":       { ar: "الذكاء الاصطناعي", en: "AI / NLP" },

  "about.rag.kicker":    { ar: "آلية RAG",       en: "RAG pipeline" },
  "about.rag.title":     { ar: "كيف يعمل نظام RAG", en: "How RAG works" },
  "about.rag.meta":      { ar: "أربع مراحل",     en: "Four stages" },
  "about.rag.stage":     { ar: "مرحلة",          en: "Stage" },
  "about.rag.s1.t":      { ar: "رفع الوثائق",     en: "Upload documents" },
  "about.rag.s1.d":      { ar: "وثائق حكومية رسمية", en: "Official government documents" },
  "about.rag.s2.t":      { ar: "التقسيم والفهرسة", en: "Chunk & index" },
  "about.rag.s2.d":      { ar: "تقسيم وتخزين في قاعدة متجهات", en: "Split and store in vector database" },
  "about.rag.s3.t":      { ar: "البحث والاسترجاع", en: "Search & retrieve" },
  "about.rag.s3.d":      { ar: "بحث دلالي عن المعلومات", en: "Semantic search for relevant info" },
  "about.rag.s4.t":      { ar: "توليد الإجابة",  en: "Generate answer" },
  "about.rag.s4.d":      { ar: "إجابة مبنية على السياق الرسمي", en: "Grounded answer with citations" },

  "about.info.title":    { ar: "معلومات المشروع", en: "Project information" },
  "about.info.name":     { ar: "اسم المشروع",     en: "Project name" },
  "about.info.type":     { ar: "النوع",            en: "Type" },
  "about.info.typeVal":  { ar: "مشروع تخرج",      en: "Graduation project" },
  "about.info.year":     { ar: "السنة الأكاديمية", en: "Academic year" },
  "about.info.tech":     { ar: "التقنيات",        en: "Technologies" },
  "about.info.license":  { ar: "الترخيص",         en: "License" },
  "about.info.licenseVal": { ar: "أكاديمي / تعليمي", en: "Academic / Educational" },

  // ─── Admin ──────────────────────────────────────────────────
  "admin.kicker":         { ar: "العمليات",       en: "Operations" },
  "admin.title":          { ar: "لوحة الإدارة",   en: "Administrative dashboard" },
  "admin.lastUpdated":    { ar: "آخر تحديث",      en: "Last updated" },
  "admin.export":         { ar: "تصدير التقرير",  en: "Export report" },
  "admin.kpi.questions":  { ar: "إجمالي الأسئلة",  en: "Total questions" },
  "admin.kpi.conversations": { ar: "المحادثات",   en: "Conversations" },
  "admin.kpi.reviews":    { ar: "التقييمات",      en: "Reviews" },
  "admin.kpi.rating":     { ar: "متوسط التقييم",   en: "Avg. rating" },
  "admin.kpi.thisWeek":   { ar: "هذا الأسبوع",    en: "this week" },
  "admin.volume.title":   { ar: "حجم الأسئلة · ٧ أيام", en: "Question volume · last 7 days" },
  "admin.volume.fig":     { ar: "شكل ٠١",         en: "FIG · 01" },
  "admin.health.title":   { ar: "حالة النظام",    en: "System health" },
  "admin.recent.title":   { ar: "الأسئلة الأخيرة", en: "Recent questions" },
  "admin.top.title":      { ar: "أكثر الخدمات طلباً", en: "Top services" },
  "admin.top.rank":       { ar: "ترتيب",          en: "Rank" },

  // ─── Reviews ────────────────────────────────────────────────
  "reviews.kicker":       { ar: "تقييمات المستخدمين", en: "User feedback" },
  "reviews.title":        { ar: "آراء وملاحظات المستخدمين", en: "Reviews & feedback" },
  "reviews.intro": {
    ar: "تجميع لتقييمات المستخدمين على إجابات المساعد الذكي.",
    en: "Aggregated user feedback on the assistant's responses.",
  },
  "reviews.avgLabel":     { ar: "متوسط التقييم", en: "Average rating" },
  "reviews.basedOn":      { ar: "بناءً على",     en: "Based on" },
  "reviews.reviewsLabel": { ar: "تقييم",          en: "reviews" },
  "reviews.empty":        { ar: "ستظهر التقييمات هنا بعد تفعيل النظام.", en: "Reviews will appear here once the system is active." },

  // ─── Footer ─────────────────────────────────────────────────
  "footer.lockup":        { ar: "المساعد الحكومي الأردني", en: "JordanGov AI Assistant" },
  "footer.tagline":       { ar: "بوابة موحدة",   en: "Unified portal" },
  "footer.about": {
    ar: "مشروع تخرج · إجابات مبنية على وثائق رسمية للجهات الحكومية الأردنية المعتمدة.",
    en: "Graduation project · Answers grounded in official documents from authorized Jordanian government bodies.",
  },
  "footer.col.site":      { ar: "الموقع",     en: "Site" },
  "footer.col.resources": { ar: "المصادر",    en: "Resources" },
  "footer.col.contact":   { ar: "اتصل بنا",   en: "Contact" },
  "footer.docs":          { ar: "الوثائق",    en: "Documentation" },
  "footer.ragNotes":      { ar: "ملاحظات RAG", en: "RAG · Notes" },
  "footer.rights":        { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  "footer.built":         { ar: "مبني على NEXT.JS · FASTAPI · LANGCHAIN · CEREBRAS", en: "BUILT WITH NEXT.JS · FASTAPI · LANGCHAIN · CEREBRAS" },
  "footer.project":       { ar: "مشروع تخرج - المساعد الحكومي الأردني الذكي", en: "Graduation Project - Jordan Government AI Assistant" },
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
