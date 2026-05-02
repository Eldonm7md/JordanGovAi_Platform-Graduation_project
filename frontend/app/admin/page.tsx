"use client";

import { useLanguage } from "@/lib/i18n";
import H from "@/components/ui/H";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import Btn from "@/components/ui/Btn";

export default function AdminPage() {
  const { dir, t } = useLanguage();
  const ar = dir === "rtl";

  const kpis: Array<[string, string, string, boolean]> = [
    [t("admin.kpi.questions"),     "1,284", "+12.4%", true],
    [t("admin.kpi.conversations"), "342",   "+5.1%",  true],
    [t("admin.kpi.reviews"),       "186",   "+22%",   true],
    [t("admin.kpi.rating"),        "4.5",   "+0.2",   true],
  ];

  const volume = [42, 64, 51, 88, 73, 96, 60];
  const days: string[] = ar
    ? ["سبت", "أحد", "اثن", "ثلا", "أربع", "خمي", "جمع"]
    : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const health: Array<[string, "OK" | "OFF", string]> = [
    ["RAG retriever",      "OK",  "42 ms"],
    ["Cerebras inference", "OK",  "318 ms"],
    ["Whisper STT",        "OK",  "1.2 s"],
    ["TTS synthesis",      "OFF", "—"],
    ["ChromaDB index",     "OK",  "8 ms"],
  ];

  const recent: Array<[string, string, string]> = ar
    ? [
        ["١٤:٢٢", "كيف أجدد جواز السفر؟", "civil"],
        ["١٤:٠٨", "ما رسوم رخصة القيادة؟", "traffic"],
        ["١٣:٥١", "كيف أحصل على إقامة؟",  "interior"],
        ["١٣:٤٠", "تسجيل شركة جديدة",     "labor"],
        ["١٣:٢٢", "تقاعد مبكر",            "social"],
      ]
    : [
        ["14:22", "How do I renew my passport?", "civil"],
        ["14:08", "Driver's licence fees?",      "traffic"],
        ["13:51", "How do I get a residency?",   "interior"],
        ["13:40", "Register new company",        "labor"],
        ["13:22", "Early retirement",            "social"],
      ];

  const top: Array<[string, number, number]> = [
    [ar ? "الأحوال المدنية والجوازات" : "Civil Status & Passports", 412, 92],
    [ar ? "السير والترخيص"           : "Traffic & Licensing",       284, 64],
    [ar ? "وزارة الداخلية"           : "Ministry of Interior",      198, 44],
    [ar ? "وزارة العمل"              : "Ministry of Labor",         172, 38],
    [ar ? "أمانة عمان الكبرى"        : "Greater Amman Municipality", 118, 26],
  ];

  return (
    <div dir={dir} style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <section
        className="flex justify-between items-end"
        style={{
          padding: "40px 56px 28px",
          background: "var(--color-panel)",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <div>
          <Mono style={{ fontSize: 10.5, color: "var(--color-primary)" }}>
            {t("admin.kicker")}
          </Mono>
          <H
            level={1}
            style={{ fontSize: ar ? 38 : 44, marginTop: 12 }}
          >
            {t("admin.title")}
          </H>
        </div>
        <div className="flex items-center gap-3">
          <Mono style={{ fontSize: 10.5, color: "var(--color-ink-mute)" }}>
            {t("admin.lastUpdated")} · 2026.05.02 · 14:22
          </Mono>
          <Btn kind="ghost" style={{ padding: "8px 14px", fontSize: 12 }}>
            {t("admin.export")}
          </Btn>
        </div>
      </section>

      {/* KPI strip */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          borderBottom: "1px solid var(--color-rule-soft)",
          background: "var(--color-panel)",
        }}
      >
        {kpis.map(([l, v, d, up], i) => (
          <div
            key={l}
            style={{
              padding: "28px 28px",
              borderInlineEnd:
                i < 3 ? "1px solid var(--color-rule-soft)" : "none",
            }}
          >
            <Mono
              as="div"
              className="block mb-3"
              style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
            >
              {l}
            </Mono>
            <span
              className="block tabular"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 44,
                fontWeight: 400,
                letterSpacing: "-0.025em",
                color: "var(--color-ink)",
              }}
            >
              {v}
            </span>
            <span
              className="inline-flex gap-1.5 items-center mt-2"
              style={{
                color: up ? "var(--color-primary)" : "var(--color-gold)",
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
              }}
            >
              <span>▲</span>
              <span>{d}</span>
              <span style={{ color: "var(--color-ink-mute)" }}>
                {t("admin.kpi.thisWeek")}
              </span>
            </span>
          </div>
        ))}
      </section>

      {/* Volume + system health */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "1.6fr 1fr",
          borderBottom: "1px solid var(--color-rule-soft)",
        }}
      >
        <div
          style={{
            padding: 28,
            borderInlineEnd: "1px solid var(--color-rule-soft)",
            background: "var(--color-panel)",
          }}
        >
          <div className="flex justify-between items-baseline mb-[22px]">
            <H level={3} style={{ fontSize: 19 }}>
              {t("admin.volume.title")}
            </H>
            <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
              {t("admin.volume.fig")}
            </Mono>
          </div>
          <div
            className="flex items-end gap-3.5 pb-2"
            style={{
              height: 200,
              borderBottom: "1px solid var(--color-rule-soft)",
            }}
          >
            {volume.map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <Mono
                  className="tabular"
                  style={{ fontSize: 9, color: "var(--color-ink-mute)" }}
                >
                  {h * 2}
                </Mono>
                <div
                  className="w-full"
                  style={{
                    height: h * 1.85,
                    background:
                      i === 5 ? "var(--color-primary)" : "var(--color-primary-deep)",
                    opacity: i === 5 ? 1 : 0.78,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3.5 mt-2">
            {days.map((d) => (
              <Mono
                key={d}
                style={{
                  flex: 1,
                  fontSize: 10,
                  color: "var(--color-ink-mute)",
                  textAlign: "center",
                }}
              >
                {d}
              </Mono>
            ))}
          </div>
        </div>

        <div style={{ padding: 28, background: "var(--color-bg-alt)" }}>
          <div className="flex justify-between items-baseline mb-[22px]">
            <H level={3} style={{ fontSize: 19 }}>
              {t("admin.health.title")}
            </H>
            <Pill tone="primary">LIVE</Pill>
          </div>
          {health.map(([n, st, lat], i, a) => {
            const ok = st === "OK";
            return (
              <div
                key={n}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "1fr auto auto",
                  padding: "13px 0",
                  gap: 14,
                  borderBottom:
                    i < a.length - 1
                      ? "1px solid var(--color-rule-soft)"
                      : "none",
                }}
              >
                <span style={{ fontSize: 13.5, color: "var(--color-ink)" }}>
                  {n}
                </span>
                <Mono
                  className="tabular"
                  style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
                >
                  {lat}
                </Mono>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="rounded-full"
                    style={{
                      width: 7,
                      height: 7,
                      background: ok ? "var(--color-primary)" : "var(--color-gold)",
                    }}
                  />
                  <Mono
                    style={{
                      fontSize: 10,
                      color: ok ? "var(--color-primary)" : "var(--color-gold)",
                    }}
                  >
                    {st}
                  </Mono>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent + ranking */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          background: "var(--color-panel)",
        }}
      >
        <div
          style={{
            padding: 28,
            borderInlineEnd: "1px solid var(--color-rule-soft)",
          }}
        >
          <div className="flex justify-between items-baseline mb-[18px]">
            <H level={3} style={{ fontSize: 19 }}>
              {t("admin.recent.title")}
            </H>
            <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
              05
            </Mono>
          </div>
          {recent.map(([time, q, c], i, a) => (
            <div
              key={i}
              className="grid items-center"
              style={{
                gridTemplateColumns: "60px 1fr 90px",
                gap: 12,
                padding: "12px 0",
                borderBottom:
                  i < a.length - 1
                    ? "1px solid var(--color-rule-soft)"
                    : "none",
              }}
            >
              <Mono
                className="tabular"
                style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
              >
                {time}
              </Mono>
              <span style={{ fontSize: 13.5, color: "var(--color-ink)" }}>
                {q}
              </span>
              <Mono
                style={{
                  fontSize: 9,
                  color: "var(--color-primary)",
                  textAlign: ar ? "left" : "right",
                }}
              >
                · {c}
              </Mono>
            </div>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          <div className="flex justify-between items-baseline mb-[18px]">
            <H level={3} style={{ fontSize: 19 }}>
              {t("admin.top.title")}
            </H>
            <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
              {t("admin.top.rank")}
            </Mono>
          </div>
          {top.map(([n, v, w], i, a) => (
            <div
              key={n}
              style={{
                padding: "13px 0",
                borderBottom:
                  i < a.length - 1
                    ? "1px solid var(--color-rule-soft)"
                    : "none",
              }}
            >
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: 13.5, color: "var(--color-ink)" }}>
                  <Mono
                    style={{
                      fontSize: 10,
                      color: "var(--color-ink-mute)",
                      marginInlineEnd: 10,
                    }}
                  >
                    0{i + 1}
                  </Mono>
                  {n}
                </span>
                <Mono
                  className="tabular"
                  style={{ fontSize: 11, color: "var(--color-ink)" }}
                >
                  {v}
                </Mono>
              </div>
              <div
                className="relative"
                style={{ height: 4, background: "var(--color-bg-alt)" }}
              >
                <div
                  style={{
                    width: `${w}%`,
                    height: "100%",
                    background: "var(--color-primary)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
