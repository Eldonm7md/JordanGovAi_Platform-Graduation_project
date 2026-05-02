"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { useLanguage } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import H from "@/components/ui/H";
import Body from "@/components/ui/Body";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";

type Audience = "all" | "individuals" | "business";

const AUDIENCE: Record<string, Exclude<Audience, "all">> = {
  civil:    "individuals",
  traffic:  "individuals",
  labor:    "business",
  social:   "individuals",
  interior: "individuals",
  telecom:  "business",
  amman:    "business",
};

function ServicesPageInner() {
  const { language, dir, t } = useLanguage();
  const ar = dir === "rtl";
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState<Audience>("all");
  const [query, setQuery] = useState("");

  // Pre-fill from /services?q=...
  useEffect(() => {
    const initial = searchParams.get("q");
    if (initial) setQuery(initial);
  }, [searchParams]);

  const fuse = useMemo(
    () =>
      new Fuse(SERVICE_CATEGORIES, {
        keys: ["name_en", "name_ar", "description_en", "description_ar"],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [],
  );

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    const base = trimmed
      ? fuse.search(trimmed).map((r) => r.item)
      : SERVICE_CATEGORIES;
    if (filter === "all") return base;
    return base.filter((s) => AUDIENCE[s.id] === filter);
  }, [filter, query, fuse]);

  const filters: Array<[Audience, string]> = [
    ["all",         t("services.filter.all")],
    ["individuals", t("services.filter.individuals")],
    ["business",    t("services.filter.business")],
  ];

  return (
    <div dir={dir} style={{ background: "var(--color-bg)" }}>
      {/* Page header */}
      <section
        style={{
          padding: "56px 56px 40px",
          background: "var(--color-panel)",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <Mono style={{ fontSize: 10.5, color: "var(--color-primary)" }}>
          {t("services.kicker")}
        </Mono>
        <H
          level={1}
          style={{
            fontSize: ar ? 48 : 56,
            lineHeight: 1.05,
            marginTop: 14,
            marginBottom: 16,
          }}
        >
          {t("services.title")}
        </H>
        <Body style={{ fontSize: 16, maxWidth: 640 }}>
          {t("services.intro")}
        </Body>
      </section>

      {/* Filter / search */}
      <section
        className="grid items-center"
        style={{
          gridTemplateColumns: "1fr auto auto",
          padding: "18px 56px",
          borderBottom: "1px solid var(--color-rule-soft)",
          gap: 18,
          background: "var(--color-panel)",
        }}
      >
        <div className="flex items-center gap-2.5 py-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--color-ink-mute)" strokeWidth="1.5" aria-hidden>
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("services.search")}
            className="flex-1 bg-transparent border-0 outline-none"
            style={{
              fontSize: 15,
              fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-ink)",
            }}
          />
        </div>
        <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
          {t("services.filter")}
        </Mono>
        <div className="flex gap-1.5">
          {filters.map(([id, label]) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className="cursor-pointer transition-colors"
                style={{
                  padding: "7px 14px",
                  border: "1px solid var(--color-rule)",
                  background: active ? "var(--color-primary)" : "var(--color-panel)",
                  color: active ? "#fff" : "var(--color-ink)",
                  fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  minHeight: 36,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: "48px 56px" }}>
        {filtered.length === 0 ? (
          <div
            className="flex items-center justify-center"
            style={{
              border: "1px dashed var(--color-rule-soft)",
              background: "var(--color-panel)",
              padding: "64px 24px",
            }}
          >
            <Body style={{ fontSize: 14, color: "var(--color-ink-mute)" }}>
              {t("services.empty")}
            </Body>
          </div>
        ) : (
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}
          >
            {filtered.map((s) => {
              const num = String(SERVICE_CATEGORIES.findIndex((x) => x.id === s.id) + 1).padStart(2, "0");
              const aud = AUDIENCE[s.id];
              const audLabel = aud === "individuals"
                ? t("services.aud.individuals")
                : t("services.aud.business");
              const tags = (language === "ar" ? s.description_ar : s.description_en)
                .split("·")[0]
                .replace(/[,،]/g, " ·")
                .trim();
              return (
                <Link
                  key={s.id}
                  href={`/chat?service=${s.id}&prompt=${encodeURIComponent(
                    language === "ar" ? s.starter_ar : s.starter_en
                  )}`}
                  className="card-hover grid"
                  style={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-rule-soft)",
                    padding: 28,
                    gridTemplateColumns: "76px 1fr",
                    gap: 20,
                    minHeight: 200,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div>
                    <span
                      className="block tabular"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 48,
                        fontWeight: 400,
                        color: "var(--color-primary)",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {num}
                    </span>
                    <Pill
                      tone="neutral"
                      style={{ marginTop: 16, padding: "3px 8px", fontSize: 9 }}
                    >
                      {audLabel}
                    </Pill>
                  </div>
                  <div className="flex flex-col">
                    <H level={3} style={{ fontSize: 22, marginBottom: 10 }}>
                      {language === "ar" ? s.name_ar : s.name_en}
                    </H>
                    <Body style={{ fontSize: 14, marginBottom: 18 }}>
                      {language === "ar" ? s.description_ar : s.description_en}
                    </Body>
                    <div className="flex-1" />
                    <div
                      className="flex justify-between items-center pt-3.5"
                      style={{ borderTop: "1px solid var(--color-rule-soft)" }}
                    >
                      <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
                        ▸ {tags}
                      </Mono>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--color-primary)",
                          fontWeight: 600,
                          fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
                        }}
                      >
                        {t("services.cta")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPageInner />
    </Suspense>
  );
}
