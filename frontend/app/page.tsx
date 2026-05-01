"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  const { language, dir, t } = useLanguage();

  return (
    <div dir={dir}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#006633] via-[#006633]/90 to-[#0891b2] py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-[#14b8a6] animate-pulse"></div>
            <span className="text-sm text-white/90">
              {language === "ar" ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI"}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#006633] shadow-lg transition hover:shadow-xl hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {t("hero.cta")}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {t("hero.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 gradient-hero-soft">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t("features.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "bilingual", icon: "🌐" },
              { key: "voice", icon: "🎙️" },
              { key: "official", icon: "📋" },
              { key: "available", icon: "⚡" },
            ].map((feature) => (
              <div
                key={feature.key}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#006633]/5 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t(`features.${feature.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t("how.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#006633] text-xl font-bold text-white">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {t(`how.step${step}.title`)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`how.step${step}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t("services.title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICE_CATEGORIES.map((service) => (
              <Link
                key={service.id}
                href={`/chat?service=${service.id}`}
                className="rounded-xl border border-gray-100 bg-white p-5 transition hover:border-[#006633]/20 hover:shadow-md"
              >
                <h3 className="mb-1 font-semibold text-gray-900">
                  {language === "ar" ? service.name_ar : service.name_en}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === "ar" ? service.description_ar : service.description_en}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
