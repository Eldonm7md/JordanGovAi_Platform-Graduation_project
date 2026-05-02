"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const { language, setLanguage, dir, t } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/chat", label: t("nav.chat") },
    { href: "/services", label: t("nav.services") },
    { href: "/reviews", label: t("nav.reviews") },
    { href: "/about", label: t("nav.about") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

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
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm font-medium transition hover:text-[#006633] ${
                  active ? "text-[#006633]" : "text-gray-700"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 rounded-full bg-[#006633]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="cursor-pointer rounded-lg border border-[#006633] px-3 py-1.5 text-sm font-medium text-[#006633] transition hover:bg-[#006633] hover:text-white"
        >
          {language === "ar" ? "EN" : "عربي"}
        </button>
      </div>
    </nav>
  );
}
