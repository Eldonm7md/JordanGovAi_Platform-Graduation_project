"use client";

import { useLanguage } from "@/lib/i18n";

export default function AdminPage() {
  const { language, dir } = useLanguage();

  return (
    <div dir={dir} className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {language === "ar" ? "لوحة التحكم" : "Admin Dashboard"}
      </h1>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: language === "ar" ? "إجمالي الأسئلة" : "Total Questions", value: "0", color: "bg-[#006633]" },
          { label: language === "ar" ? "المحادثات" : "Conversations", value: "0", color: "bg-[#0891b2]" },
          { label: language === "ar" ? "التقييمات" : "Reviews", value: "0", color: "bg-[#14b8a6]" },
          { label: language === "ar" ? "متوسط التقييم" : "Avg Rating", value: "0.0", color: "bg-yellow-500" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mb-8 rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {language === "ar" ? "حالة النظام" : "System Status"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "RAG", status: false },
            { name: "Cerebras AI", status: false },
            { name: "STT (Whisper)", status: false },
            { name: "TTS", status: false },
          ].map((service) => (
            <div key={service.name} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <div className={`h-2.5 w-2.5 rounded-full ${service.status ? "bg-green-500" : "bg-red-400"}`}></div>
              <span className="text-sm text-gray-700">{service.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            {language === "ar" ? "الأسئلة الأخيرة" : "Recent Questions"}
          </h3>
          <p className="text-sm text-gray-400 italic">
            {language === "ar" ? "لا توجد أسئلة بعد" : "No questions yet"}
          </p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            {language === "ar" ? "أكثر الخدمات طلباً" : "Most Asked Services"}
          </h3>
          <p className="text-sm text-gray-400 italic">
            {language === "ar" ? "لا توجد بيانات بعد" : "No data yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
