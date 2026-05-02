"use client";

import { useLanguage } from "@/lib/i18n";
import H from "@/components/ui/H";
import Body from "@/components/ui/Body";
import Mono from "@/components/ui/Mono";
import SectionHeader from "@/components/ui/SectionHeader";

export default function AboutPage() {
  const { dir, t } = useLanguage();
  const ar = dir === "rtl";

  const stats: Array<[string, string]> = [
    ["07",   t("about.stat.agencies")],
    ["02",   t("about.stat.languages")],
    ["24/7", t("about.stat.uptime")],
    ["RAG",  t("about.stat.method")],
  ];

  const stacks: Array<{ key: string; label: string; tag: string; items: string[] }> = [
    {
      key: "frontend",
      label: t("about.arch.frontend"),
      tag: "FRONTEND",
      items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
    },
    {
      key: "backend",
      label: t("about.arch.backend"),
      tag: "BACKEND",
      items: ["FastAPI · Python", "PostgreSQL", "SQLAlchemy", "ChromaDB"],
    },
    {
      key: "ai",
      label: t("about.arch.ai"),
      tag: "AI / NLP",
      items: ["Cerebras Inference", "LangChain RAG", "Groq Whisper STT", "Multilingual Embeds"],
    },
  ];

  const ragStages: Array<[string, string, string]> = [
    ["01", t("about.rag.s1.t"), t("about.rag.s1.d")],
    ["02", t("about.rag.s2.t"), t("about.rag.s2.d")],
    ["03", t("about.rag.s3.t"), t("about.rag.s3.d")],
    ["04", t("about.rag.s4.t"), t("about.rag.s4.d")],
  ];

  const info: Array<[string, string]> = [
    [t("about.info.name"),    "JordanGov AI Assistant"],
    [t("about.info.type"),    t("about.info.typeVal")],
    [t("about.info.year"),    "2025 / 2026"],
    [t("about.info.tech"),    "Next.js · FastAPI · Cerebras · LangChain"],
    [t("about.info.license"), t("about.info.licenseVal")],
  ];

  return (
    <div dir={dir} style={{ background: "var(--color-bg)" }}>
      {/* Hero */}
      <section
        className="grid"
        style={{
          padding: "64px 56px",
          background: "var(--color-panel)",
          borderBottom: "1px solid var(--color-rule-soft)",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 64,
        }}
      >
        <div>
          <Mono style={{ fontSize: 10.5, color: "var(--color-primary)" }}>
            {t("about.kicker")}
          </Mono>
          <H
            level={1}
            style={{
              fontSize: ar ? 44 : 52,
              marginTop: 14,
              lineHeight: 1.05,
            }}
          >
            {t("about.title")}
          </H>
        </div>
        <div>
          <Body
            style={{
              fontSize: 17,
              maxWidth: 580,
              color: "var(--color-ink)",
              marginBottom: 32,
            }}
          >
            {t("about.intro")}
          </Body>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid var(--color-rule-soft)",
              borderBottom: "1px solid var(--color-rule-soft)",
            }}
          >
            {stats.map(([v, l], i) => (
              <div
                key={l}
                style={{
                  padding: "20px 14px",
                  borderInlineEnd:
                    i < 3 ? "1px solid var(--color-rule-soft)" : "none",
                }}
              >
                <span
                  className="block tabular"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 30,
                    fontWeight: 400,
                    color: "var(--color-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {v}
                </span>
                <Mono
                  as="div"
                  className="block mt-1.5"
                  style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
                >
                  {l}
                </Mono>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section
        style={{
          padding: "64px 56px",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <SectionHeader
          kicker={t("about.arch.kicker")}
          title={t("about.arch.title")}
          meta={t("about.arch.meta")}
        />
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            background: "var(--color-panel)",
            border: "1px solid var(--color-rule-soft)",
          }}
        >
          {stacks.map((s, i) => (
            <div
              key={s.key}
              style={{
                padding: 28,
                borderInlineEnd:
                  i < 2 ? "1px solid var(--color-rule-soft)" : "none",
              }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <Mono
                  style={{
                    fontSize: 10,
                    color: "var(--color-primary)",
                    padding: "3px 8px",
                    border: "1px solid var(--color-primary)",
                  }}
                >
                  0{i + 1}
                </Mono>
                <Mono style={{ fontSize: 11, color: "var(--color-ink-mute)" }}>
                  {s.tag}
                </Mono>
              </div>
              <H level={3} style={{ fontSize: 22, marginBottom: 18 }}>
                {s.label}
              </H>
              <ul className="list-none p-0 m-0 grid gap-2">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="relative"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12.5,
                      color: "var(--color-ink)",
                      paddingInlineStart: 16,
                      paddingTop: 4,
                      paddingBottom: 4,
                      borderBottom: "1px dashed var(--color-rule-soft)",
                    }}
                  >
                    <span
                      className="absolute"
                      style={{
                        insetInlineStart: 0,
                        color: "var(--color-primary)",
                      }}
                    >
                      —
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* RAG flow */}
      <section
        style={{
          padding: "64px 56px",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <SectionHeader
          kicker={t("about.rag.kicker")}
          title={t("about.rag.title")}
          meta={t("about.rag.meta")}
        />
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}
        >
          {ragStages.map(([k, title, desc], i, arr) => (
            <div
              key={k}
              className="card-hover relative"
              style={{
                background: "var(--color-panel)",
                border: "1px solid var(--color-rule-soft)",
                padding: 22,
                minHeight: 170,
              }}
            >
              <Mono
                as="div"
                className="block mb-3.5"
                style={{ fontSize: 10.5, color: "var(--color-primary)" }}
              >
                {t("about.rag.stage")} {k}
              </Mono>
              <H level={3} style={{ fontSize: 18, marginBottom: 8 }}>
                {title}
              </H>
              <Body style={{ fontSize: 13 }}>{desc}</Body>
              {i < arr.length - 1 && (
                <span
                  className="absolute"
                  style={{
                    top: "50%",
                    insetInlineEnd: -12,
                    transform: "translateY(-50%)",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    background: "var(--color-bg)",
                    padding: "2px 4px",
                  }}
                >
                  {ar ? "←" : "→"}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Project info */}
      <section style={{ padding: "56px 56px" }}>
        <H level={2} style={{ fontSize: 30, marginBottom: 24 }}>
          {t("about.info.title")}
        </H>
        <div
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-rule-soft)",
          }}
        >
          {info.map(([k, v], i, a) => (
            <div
              key={k}
              className="grid"
              style={{
                gridTemplateColumns: "240px 1fr",
                padding: "18px 24px",
                borderBottom:
                  i < a.length - 1 ? "1px solid var(--color-rule-soft)" : "none",
                gap: 28,
              }}
            >
              <Mono style={{ fontSize: 11, color: "var(--color-ink-mute)" }}>
                {k}
              </Mono>
              <span
                style={{
                  fontSize: 14.5,
                  color: "var(--color-ink)",
                  fontWeight: 500,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
