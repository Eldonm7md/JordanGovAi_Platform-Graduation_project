"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import H from "@/components/ui/H";
import Body from "@/components/ui/Body";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import Btn from "@/components/ui/Btn";
import SectionHeader from "@/components/ui/SectionHeader";

const FEATURE_KEYS = ["bilingual", "voice", "official", "available"] as const;

const SPECIMEN_SOURCES: Array<[string, string]> = [
  ["passport_law_2003.pdf", "p. 04 · §12"],
  ["civil_dept_fees_2025.pdf", "p. 02 · tbl. A"],
  ["renewal_procedure.pdf", "p. 07 · ¶3"],
];

export default function HomePage() {
  const { dir, language, t } = useLanguage();
  const ar = dir === "rtl";

  const specimenSteps: Array<[string, string]> = [
    [t("home.specimen.step1.t"), t("home.specimen.step1.d")],
    [t("home.specimen.step2.t"), t("home.specimen.step2.d")],
    [t("home.specimen.step3.t"), t("home.specimen.step3.d")],
  ];

  const trust: Array<[string, string]> = [
    ["07",   t("home.trust.bodies")],
    ["02",   t("home.trust.languages")],
    ["24/7", t("home.trust.availability")],
  ];

  const stages: Array<[string, string]> = [
    [t("how.step1.title"), t("how.step1.desc")],
    [t("how.step2.title"), t("how.step2.desc")],
    [t("how.step3.title"), t("how.step3.desc")],
  ];

  return (
    <div dir={dir} style={{ background: "var(--color-bg)" }}>
      {/* HERO */}
      <section
        style={{
          padding: "72px 56px 64px",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <div
          className="grid items-start"
          style={{ gridTemplateColumns: "1.2fr 1fr", gap: 64 }}
        >
          <div>
            <Pill tone="primary" style={{ marginBottom: 28 }}>
              {t("home.kicker")}
            </Pill>
            <H
              level={1}
              style={{
                fontSize: ar ? 56 : 64,
                lineHeight: 1.05,
                marginBottom: 22,
              }}
            >
              {t("home.title")}
            </H>
            <Body style={{ fontSize: 17, maxWidth: 540, marginBottom: 36 }}>
              {t("home.subtitle")}
            </Body>
            <div className="flex gap-3">
              <Link href="/chat">
                <Btn kind="primary">{t("home.cta.primary")}</Btn>
              </Link>
              <Link href="/services">
                <Btn kind="ghost">{t("home.cta.secondary")}</Btn>
              </Link>
            </div>

            {/* Trust strip */}
            <div
              className="grid mt-14"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                borderTop: "1px solid var(--color-rule-soft)",
                borderBottom: "1px solid var(--color-rule-soft)",
              }}
            >
              {trust.map(([v, l], i) => (
                <div
                  key={l}
                  style={{
                    padding: "20px 18px 20px 0",
                    borderInlineEnd:
                      i < 2 ? "1px solid var(--color-rule-soft)" : "none",
                    paddingInlineStart: i > 0 ? 24 : 0,
                  }}
                >
                  <span
                    className="tabular"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 32,
                      fontWeight: 400,
                      color: "var(--color-primary)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {v}
                  </span>
                  <span
                    className="block"
                    style={{
                      fontSize: 12,
                      color: "var(--color-ink-mute)",
                      marginTop: 4,
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Specimen panel */}
          <div
            style={{
              background: "var(--color-panel)",
              border: "1px solid var(--color-rule)",
              boxShadow: "0 1px 0 rgba(13,27,22,0.04)",
            }}
          >
            <div
              className="flex justify-between items-center"
              style={{
                background: "var(--color-primary-deep)",
                color: "#fff",
                padding: "14px 20px",
              }}
            >
              <span className="inline-flex gap-2.5 items-center">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: "var(--color-gold)",
                    display: "inline-block",
                  }}
                />
                <Mono style={{ fontSize: 10.5 }}>
                  {t("home.specimen.kicker")}
                </Mono>
              </span>
              <Mono style={{ fontSize: 10.5, color: "#cfd9d4" }}>
                REF · CIVIL-042
              </Mono>
            </div>

            <div style={{ padding: 26 }}>
              <Mono
                as="div"
                className="block mb-2"
                style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
              >
                {t("home.specimen.question")}
              </Mono>
              <span
                className="block mb-[22px]"
                style={{
                  fontFamily: ar ? "var(--font-arabic)" : "var(--font-serif)",
                  fontSize: 19,
                  color: "var(--color-ink)",
                  fontWeight: ar ? 600 : 400,
                  lineHeight: 1.3,
                }}
              >
                {t("home.specimen.q")}
              </span>

              <Mono
                as="div"
                className="block mb-2.5"
                style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
              >
                {t("home.specimen.procedure")}
              </Mono>
              <ol className="list-none p-0 m-0 grid gap-3">
                {specimenSteps.map(([label, desc], i) => (
                  <li
                    key={i}
                    className="grid items-start gap-3"
                    style={{ gridTemplateColumns: "30px 1fr" }}
                  >
                    <Mono
                      style={{
                        fontSize: 11,
                        color: "var(--color-primary)",
                        paddingTop: 3,
                      }}
                    >
                      0{i + 1}
                    </Mono>
                    <span
                      style={{
                        fontSize: 14.5,
                        color: "var(--color-ink)",
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>{label}.</strong>{" "}
                      <span style={{ color: "var(--color-ink-soft)" }}>{desc}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div
                className="mt-[22px] pt-4"
                style={{ borderTop: "1px solid var(--color-rule-soft)" }}
              >
                <Mono
                  as="div"
                  className="block mb-2"
                  style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
                >
                  {t("home.specimen.sources")} · 03
                </Mono>
                <div className="grid gap-1.5">
                  {SPECIMEN_SOURCES.map(([f, p]) => (
                    <div
                      key={f}
                      className="flex justify-between"
                      style={{
                        padding: "6px 10px",
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-rule-soft)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: "var(--color-ink)" }}>{f}</span>
                      <span style={{ color: "var(--color-ink-mute)" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section
        style={{
          padding: "72px 56px",
          background: "var(--color-panel)",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <SectionHeader
          kicker={t("home.cap.kicker")}
          title={t("home.cap.title")}
          meta={t("home.cap.meta")}
        />
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--color-rule-soft)",
          }}
        >
          {FEATURE_KEYS.map((k, i) => (
            <div
              key={k}
              style={{
                padding: "32px 24px 32px 0",
                borderInlineEnd:
                  i < 3 ? "1px solid var(--color-rule-soft)" : "none",
                paddingInlineStart: i > 0 ? 24 : 0,
              }}
            >
              <Mono
                as="div"
                className="block mb-3.5"
                style={{ fontSize: 11, color: "var(--color-primary)" }}
              >
                0{i + 1}
              </Mono>
              <H level={3} style={{ fontSize: 22, marginBottom: 10 }}>
                {t(`features.${k}.title`)}
              </H>
              <Body style={{ fontSize: 14 }}>{t(`features.${k}.desc`)}</Body>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "72px 56px",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <SectionHeader
          kicker={t("home.how.kicker")}
          title={t("home.how.title")}
          meta={t("home.how.meta")}
        />
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}
        >
          {stages.map(([title, desc], i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: "var(--color-panel)",
                border: "1px solid var(--color-rule-soft)",
                padding: 28,
                position: "relative",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 56,
                    fontWeight: 400,
                    color: "var(--color-primary)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em",
                  }}
                >
                  0{i + 1}
                </span>
                <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
                  {t("home.how.stage")} {i + 1}/3
                </Mono>
              </div>
              <H level={3} style={{ fontSize: 20, marginBottom: 8 }}>
                {title}
              </H>
              <Body style={{ fontSize: 14 }}>{desc}</Body>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES — directory list */}
      <section
        style={{ padding: "72px 56px", background: "var(--color-panel)" }}
      >
        <SectionHeader
          kicker={t("home.svc.kicker")}
          title={t("home.svc.title")}
          meta={t("home.svc.meta")}
        />
        <div style={{ borderTop: "1px solid var(--color-rule)" }}>
          {SERVICE_CATEGORIES.map((s, i) => {
            const num = String(i + 1).padStart(2, "0");
            const name = language === "ar" ? s.name_ar : s.name_en;
            const desc = language === "ar" ? s.description_ar : s.description_en;
            return (
              <Link
                key={s.id}
                href={`/chat?service=${s.id}&prompt=${encodeURIComponent(
                  language === "ar" ? s.starter_ar : s.starter_en
                )}`}
                className="grid items-center transition-colors"
                style={{
                  gridTemplateColumns: "60px 1.4fr 2fr 140px",
                  padding: "20px 4px",
                  borderBottom: "1px solid var(--color-rule-soft)",
                  gap: 32,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Mono
                  className="tabular"
                  style={{ fontSize: 12, color: "var(--color-ink-mute)" }}
                >
                  № {num}
                </Mono>
                <H
                  level={4}
                  style={{
                    fontSize: 17,
                    fontWeight: ar ? 600 : 500,
                  }}
                >
                  {name}
                </H>
                <Body style={{ fontSize: 13.5 }}>{desc}</Body>
                <span
                  style={{
                    fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--color-primary)",
                    fontWeight: 500,
                    textAlign: ar ? "left" : "right",
                  }}
                >
                  {t("home.svc.cta")}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
