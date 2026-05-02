"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { useLanguage } from "@/lib/i18n";
import { useHealth } from "@/lib/health";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { ServiceCategory } from "@/lib/types";
import Crest from "@/components/ui/Crest";
import H from "@/components/ui/H";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";

const NAV = [
  { href: "/",         id: "home",     key: "nav.home" },
  { href: "/chat",     id: "chat",     key: "nav.chat" },
  { href: "/services", id: "services", key: "nav.services" },
  { href: "/reviews",  id: "reviews",  key: "nav.reviews" },
  { href: "/admin",    id: "admin",    key: "nav.admin" },
  { href: "/about",    id: "about",    key: "nav.about" },
];

function HealthPill() {
  const { t } = useLanguage();
  const health = useHealth();

  const map = {
    loading: { label: t("topbar.checking"), tone: "neutral" as const, dot: "var(--color-ink-mute)" },
    ok:      { label: t("topbar.operational"), tone: "primary" as const, dot: "var(--color-primary)" },
    partial: { label: t("topbar.partial"),     tone: "gold"    as const, dot: "var(--color-gold)" },
    down:    { label: t("topbar.offline"),     tone: "gold"    as const, dot: "var(--color-gold)" },
  } as const;

  const cfg = map[health.kind];
  return (
    <Pill tone={cfg.tone}>
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: cfg.dot }}
      />
      {cfg.label}
    </Pill>
  );
}

export default function TopBar() {
  const { language, setLanguage, dir, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  // Fuzzy search across services. The same Fuse instance powers both the
  // suggestion dropdown and the Enter-key navigation to /services?q=.
  const fuse = useMemo(
    () =>
      new Fuse<ServiceCategory>(SERVICE_CATEGORIES, {
        keys: ["name_en", "name_ar", "description_en", "description_ar"],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [],
  );

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 5 }).map((r) => r.item);
  }, [query, fuse]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (results[0]) {
      // Top hit takes you straight to a chat with the service prompt.
      const s = results[0];
      const prompt = encodeURIComponent(language === "ar" ? s.starter_ar : s.starter_en);
      router.push(`/chat?service=${s.id}&prompt=${prompt}`);
    } else {
      router.push(`/services?q=${encodeURIComponent(trimmed)}`);
    }
    setOpen(false);
    setQuery("");
  };

  // Click-outside closes the dropdown.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header dir={dir} className="sticky top-0 z-50">
      {/* Slim utility band */}
      <div
        className="flex justify-between items-center"
        style={{
          background: "var(--color-primary-deep)",
          color: "#cfd9d4",
          fontSize: 11.5,
          padding: "6px 36px",
        }}
      >
        <span>{t("topbar.kingdom")}</span>
        <span className="inline-flex gap-[18px]">
          <Mono style={{ fontSize: 10.5 }}>{t("topbar.help")}</Mono>
          <Mono style={{ fontSize: 10.5 }}>{t("topbar.accessibility")}</Mono>
          <button
            type="button"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="cursor-pointer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            {language === "ar" ? "EN" : "عربي"}
          </button>
        </span>
      </div>

      {/* Identity row */}
      <div
        className="flex items-center justify-between gap-6"
        style={{
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-rule-soft)",
          padding: "20px 36px",
        }}
      >
        <Link href="/" className="flex items-center gap-3.5">
          <Crest size={44} />
          <div className="leading-[1.15]">
            <H
              level={4}
              style={{
                fontWeight: 600,
                color: "var(--color-primary-deep)",
                fontSize: 17,
              }}
            >
              {t("topbar.lockup")}
            </H>
            <span
              style={{
                fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-sans)",
                fontSize: 12.5,
                color: "var(--color-ink-mute)",
              }}
            >
              {t("topbar.tagline")}
            </span>
          </div>
        </Link>

        {/* Search */}
        <form
          ref={containerRef}
          onSubmit={submit}
          className="relative flex-1 max-w-[440px]"
        >
          <div
            className="flex items-center gap-2.5 bg-panel"
            style={{
              border: "1px solid var(--color-rule)",
              padding: "8px 14px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--color-ink-mute)" strokeWidth="1.5" aria-hidden>
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" />
            </svg>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={t("topbar.search")}
              className="flex-1 bg-transparent border-0 outline-none"
              style={{
                fontSize: 14,
                fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-sans)",
                color: "var(--color-ink)",
              }}
            />
            <Mono style={{ fontSize: 9.5, color: "var(--color-ink-mute)" }}>⌘K</Mono>
          </div>
          {open && results.length > 0 && (
            <div
              className="absolute left-0 right-0 z-40"
              style={{
                top: "100%",
                marginTop: 4,
                background: "var(--color-panel)",
                border: "1px solid var(--color-rule)",
                boxShadow: "0 8px 24px rgba(13,27,22,0.12)",
              }}
            >
              {results.map((s, i) => {
                const num = String(SERVICE_CATEGORIES.findIndex((x) => x.id === s.id) + 1).padStart(2, "0");
                return (
                  <Link
                    key={s.id}
                    href={`/chat?service=${s.id}&prompt=${encodeURIComponent(language === "ar" ? s.starter_ar : s.starter_en)}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 transition-colors"
                    style={{
                      padding: "10px 14px",
                      borderBottom:
                        i < results.length - 1
                          ? "1px solid var(--color-rule-soft)"
                          : "none",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--color-bg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
                      № {num}
                    </Mono>
                    <span
                      className="flex-1 truncate"
                      style={{
                        fontSize: 13.5,
                        color: "var(--color-ink)",
                        fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-sans)",
                      }}
                    >
                      {language === "ar" ? s.name_ar : s.name_en}
                    </span>
                    <Mono style={{ fontSize: 10, color: "var(--color-primary)" }}>→</Mono>
                  </Link>
                );
              })}
            </div>
          )}
        </form>

        <HealthPill />
      </div>

      {/* Primary nav */}
      <nav
        className="flex bg-panel"
        style={{
          borderBottom: "1px solid var(--color-rule)",
          padding: "0 36px",
        }}
      >
        {NAV.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.id}
              href={l.href}
              aria-current={active ? "page" : undefined}
              style={{
                padding: "16px 22px",
                fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-sans)",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? "var(--color-primary)" : "var(--color-ink-soft)",
                borderBottom: active
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
                marginBottom: -1,
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
            >
              {t(l.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
