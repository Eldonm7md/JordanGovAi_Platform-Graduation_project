"use client";

import { useLanguage } from "@/lib/i18n";
import H from "@/components/ui/H";
import Body from "@/components/ui/Body";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";

export default function ReviewsPage() {
  const { dir, t } = useLanguage();
  const ar = dir === "rtl";

  // Distribution band — placeholder structure per the design KPI pattern.
  const distribution: Array<[number, number]> = [
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
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
          {t("reviews.kicker")}
        </Mono>
        <H
          level={1}
          style={{
            fontSize: ar ? 44 : 52,
            lineHeight: 1.05,
            marginTop: 14,
            marginBottom: 16,
          }}
        >
          {t("reviews.title")}
        </H>
        <Body style={{ fontSize: 16, maxWidth: 640 }}>
          {t("reviews.intro")}
        </Body>
      </section>

      {/* Average + distribution band */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "1fr 2fr",
          borderBottom: "1px solid var(--color-rule-soft)",
          background: "var(--color-panel)",
        }}
      >
        <div
          style={{
            padding: 28,
            borderInlineEnd: "1px solid var(--color-rule-soft)",
          }}
        >
          <Mono
            as="div"
            className="block mb-3"
            style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
          >
            {t("reviews.avgLabel")}
          </Mono>
          <div className="flex items-baseline gap-3">
            <span
              className="block tabular"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 64,
                fontWeight: 400,
                color: "var(--color-ink)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              4.5
            </span>
            <span
              className="inline-flex"
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-ink-mute)" }}
            >
              / 5.0
            </span>
          </div>
          <Mono
            as="div"
            className="block mt-3"
            style={{ fontSize: 10.5, color: "var(--color-ink-mute)" }}
          >
            {t("reviews.basedOn")} 0 {t("reviews.reviewsLabel")}
          </Mono>
        </div>

        <div style={{ padding: 28 }}>
          <Mono
            as="div"
            className="block mb-3"
            style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
          >
            DISTRIBUTION
          </Mono>
          {distribution.map(([star, count], i, a) => (
            <div
              key={star}
              className="grid items-center"
              style={{
                gridTemplateColumns: "40px 1fr 60px",
                gap: 14,
                padding: "10px 0",
                borderBottom:
                  i < a.length - 1
                    ? "1px solid var(--color-rule-soft)"
                    : "none",
              }}
            >
              <Mono
                className="tabular"
                style={{ fontSize: 11, color: "var(--color-ink)" }}
              >
                0{star} ★
              </Mono>
              <div
                className="relative"
                style={{ height: 4, background: "var(--color-bg-alt)" }}
              >
                <div
                  style={{
                    width: `${count}%`,
                    height: "100%",
                    background: "var(--color-primary)",
                  }}
                />
              </div>
              <Mono
                className="tabular"
                style={{
                  fontSize: 10,
                  color: "var(--color-ink-mute)",
                  textAlign: "end",
                }}
              >
                {count}
              </Mono>
            </div>
          ))}
        </div>
      </section>

      {/* Empty state list */}
      <section style={{ padding: "48px 56px" }}>
        <div
          className="flex justify-between items-end mb-6"
          style={{
            paddingBottom: 18,
            borderBottom: "1px solid var(--color-rule-soft)",
          }}
        >
          <H level={2} style={{ fontSize: 30 }}>
            {ar ? "أحدث التقييمات" : "Latest reviews"}
          </H>
          <Pill tone="neutral">00</Pill>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            border: "1px dashed var(--color-rule-soft)",
            background: "var(--color-panel)",
            padding: "64px 24px",
          }}
        >
          <Body
            style={{
              fontSize: 14,
              color: "var(--color-ink-mute)",
              textAlign: "center",
            }}
          >
            {t("reviews.empty")}
          </Body>
        </div>
      </section>
    </div>
  );
}
