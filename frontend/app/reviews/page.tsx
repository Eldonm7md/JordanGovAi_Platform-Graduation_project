"use client";

import { useLanguage } from "@/lib/i18n";

export default function ReviewsPage() {
  const { language, dir } = useLanguage();

  return (
    <div dir={dir} className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {language === "ar" ? "التقييمات والمراجعات" : "Reviews & Feedback"}
      </h1>

      {/* Average Rating */}
      <div className="mb-8 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm text-center">
        <div className="text-4xl font-bold text-[#006633]">4.5</div>
        <div className="mt-1 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className={`h-5 w-5 ${star <= 4 ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {language === "ar" ? "بناءً على 0 تقييم" : "Based on 0 reviews"}
        </p>
      </div>

      {/* Placeholder */}
      <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-400">
          {language === "ar"
            ? "سيتم عرض التقييمات هنا بعد تفعيل النظام"
            : "Reviews will be displayed here once the system is active"}
        </p>
      </div>
    </div>
  );
}
