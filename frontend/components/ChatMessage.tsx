"use client";

import { useLanguage } from "@/lib/i18n";
import Mono from "@/components/ui/Mono";

interface Source {
  filename: string;
  page?: number;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  ts: number;
  sources?: Source[];
}

function formatHM(ts: number, language: "ar" | "en"): string {
  const locale = language === "ar" ? "ar-EG" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(ts));
}

export default function ChatMessage({
  role,
  content,
  ts,
  sources,
}: ChatMessageProps) {
  const { dir, t, language } = useLanguage();
  const ar = dir === "rtl";
  const time = formatHM(ts, language);

  if (role === "user") {
    // Always sit on the trailing edge — flex-end resolves to right in LTR
    // and to left in RTL, which is the standard chat convention.
    return (
      <div className="flex items-start justify-end">
        <div
          style={{
            background: "var(--color-primary-deep)",
            color: "#fff",
            padding: "12px 18px",
            maxWidth: "70%",
          }}
        >
          <Mono
            as="div"
            className="block mb-1"
            style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)" }}
          >
            {t("chat.you")} · {time}
          </Mono>
          <span
            className="block whitespace-pre-wrap"
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
            }}
          >
            {content}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5">
      <div
        className="grid place-items-center flex-shrink-0"
        style={{
          width: 32,
          height: 32,
          background: "var(--color-primary)",
          color: "#fff",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        AI
      </div>
      <div className="flex-1 pt-0.5 min-w-0">
        <Mono
          as="div"
          className="block mb-2"
          style={{ fontSize: 9.5, color: "var(--color-ink-mute)" }}
        >
          {t("chat.assistant")} · {time}
        </Mono>
        <p
          className="m-0 whitespace-pre-wrap break-words"
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: "var(--color-ink)",
            fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
          }}
        >
          {content}
        </p>

        {sources && sources.length > 0 && (
          <div className="mt-4">
            <Mono
              as="div"
              className="block mb-2"
              style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
            >
              {t("chat.officialSources")} · {String(sources.length).padStart(2, "0")}
            </Mono>
            <div className="grid gap-1.5">
              {sources.map((s, i) => (
                <div
                  key={`${s.filename}-${i}`}
                  className="flex justify-between items-center"
                  style={{
                    padding: "8px 12px",
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-rule-soft)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                >
                  <span className="inline-flex gap-2 items-center min-w-0">
                    <span
                      className="flex-shrink-0"
                      style={{
                        width: 4,
                        height: 4,
                        background: "var(--color-primary)",
                        display: "inline-block",
                      }}
                    />
                    <span
                      className="truncate"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {s.filename}
                    </span>
                  </span>
                  {s.page != null && (
                    <span
                      className="flex-shrink-0"
                      style={{ color: "var(--color-ink-mute)" }}
                    >
                      {language === "ar" ? `ص. ${s.page}` : `p. ${s.page}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
