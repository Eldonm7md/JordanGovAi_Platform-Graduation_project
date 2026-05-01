"use client";

import { useLanguage } from "@/lib/i18n";

export default function AboutPage() {
  const { language, dir } = useLanguage();

  return (
    <div dir={dir} className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {language === "ar" ? "حول النظام" : "About the System"}
      </h1>

      {/* Architecture Diagram */}
      <div className="mb-12 rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          {language === "ar" ? "هيكلية النظام" : "System Architecture"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Frontend */}
          <div className="rounded-xl bg-[#006633]/5 p-4">
            <h3 className="mb-3 font-semibold text-[#006633]">
              {language === "ar" ? "الواجهة الأمامية" : "Frontend"}
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Next.js 16</li>
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Tailwind CSS 4</li>
            </ul>
          </div>
          {/* Backend */}
          <div className="rounded-xl bg-[#0891b2]/5 p-4">
            <h3 className="mb-3 font-semibold text-[#0891b2]">
              {language === "ar" ? "الخادم الخلفي" : "Backend"}
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>FastAPI (Python)</li>
              <li>PostgreSQL</li>
              <li>SQLAlchemy</li>
              <li>ChromaDB</li>
            </ul>
          </div>
          {/* AI */}
          <div className="rounded-xl bg-[#14b8a6]/5 p-4">
            <h3 className="mb-3 font-semibold text-[#14b8a6]">
              {language === "ar" ? "الذكاء الاصطناعي" : "AI & NLP"}
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Cerebras Inference</li>
              <li>LangChain RAG</li>
              <li>Groq Whisper STT</li>
              <li>Multilingual Embeddings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How RAG Works */}
      <div className="mb-12 rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          {language === "ar" ? "كيف يعمل نظام RAG" : "How RAG Works"}
        </h2>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {[
            { step: "1", title: language === "ar" ? "رفع الوثائق" : "Upload Documents", desc: language === "ar" ? "وثائق حكومية رسمية" : "Official government documents" },
            { step: "2", title: language === "ar" ? "التقسيم والفهرسة" : "Chunk & Index", desc: language === "ar" ? "تقسيم وتخزين في قاعدة متجهات" : "Split and store in vector database" },
            { step: "3", title: language === "ar" ? "البحث والاسترجاع" : "Search & Retrieve", desc: language === "ar" ? "بحث دلالي عن المعلومات المناسبة" : "Semantic search for relevant info" },
            { step: "4", title: language === "ar" ? "توليد الإجابة" : "Generate Answer", desc: language === "ar" ? "إجابة مبنية على السياق الرسمي" : "Answer grounded in official context" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#006633] text-sm font-bold text-white">
                {item.step}
              </div>
              <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
              <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {language === "ar" ? "معلومات المشروع" : "Project Information"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">{language === "ar" ? "اسم المشروع" : "Project Name"}</p>
            <p className="font-medium text-gray-900">JordanGov AI Assistant</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{language === "ar" ? "النوع" : "Type"}</p>
            <p className="font-medium text-gray-900">{language === "ar" ? "مشروع تخرج" : "Graduation Project"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{language === "ar" ? "السنة" : "Year"}</p>
            <p className="font-medium text-gray-900">2026</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{language === "ar" ? "التقنيات" : "Technologies"}</p>
            <p className="font-medium text-gray-900">Next.js, FastAPI, Cerebras, LangChain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
