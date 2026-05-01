"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const { language, setLanguage, dir, t } = useLanguage();

  return (
    <nav
      dir={dir}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#006633]">
            <span className="text-lg font-bold text-white">JG</span>
          </div>
          <span className="text-lg font-bold text-[#006633]">
            {language === "ar" ? "المساعد الحكومي" : "JordanGov AI"}
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 transition hover:text-[#006633]">
            {t("nav.home")}
          </Link>
          <Link href="/chat" className="text-sm font-medium text-gray-700 transition hover:text-[#006633]">
            {t("nav.chat")}
          </Link>
          <Link href="/services" className="text-sm font-medium text-gray-700 transition hover:text-[#006633]">
            {t("nav.services")}
          </Link>
          <Link href="/reviews" className="text-sm font-medium text-gray-700 transition hover:text-[#006633]">
            {t("nav.reviews")}
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 transition hover:text-[#006633]">
            {t("nav.about")}
          </Link>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="rounded-lg border border-[#006633] px-3 py-1.5 text-sm font-medium text-[#006633] transition hover:bg-[#006633] hover:text-white"
        >
          {language === "ar" ? "EN" : "عربي"}
        </button>
      </div>
    </nav>
  );
}
