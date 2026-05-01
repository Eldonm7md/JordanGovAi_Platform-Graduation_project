"use client";

import { useLanguage } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export default function ServicesPage() {
  const { language, dir, t } = useLanguage();

  return (
    <div dir={dir} className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{t("services.title")}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_CATEGORIES.map((service) => (
          <Link
            key={service.id}
            href={`/chat?service=${service.id}`}
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#006633]/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#006633]/5 text-xl transition group-hover:bg-[#006633]/10">
              {service.icon === "passport" && "🛂"}
              {service.icon === "car" && "🚗"}
              {service.icon === "briefcase" && "💼"}
              {service.icon === "shield" && "🛡️"}
              {service.icon === "building" && "🏛️"}
              {service.icon === "signal" && "📡"}
              {service.icon === "city" && "🏙️"}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {language === "ar" ? service.name_ar : service.name_en}
            </h3>
            <p className="text-sm text-gray-600">
              {language === "ar" ? service.description_ar : service.description_en}
            </p>
            <div className="mt-4 text-sm font-medium text-[#006633]">
              {language === "ar" ? "اسأل عن هذه الخدمة ←" : "Ask about this service →"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
