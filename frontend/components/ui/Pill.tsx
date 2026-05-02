import { CSSProperties, ReactNode } from "react";

type Tone = "neutral" | "primary" | "gold";

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}

const TONES: Record<Tone, { bg: string; fg: string; br: string }> = {
  neutral: { bg: "var(--color-bg)", fg: "var(--color-ink-soft)", br: "var(--color-rule-soft)" },
  primary: { bg: "var(--color-primary-soft)", fg: "var(--color-primary)", br: "transparent" },
  gold:    { bg: "var(--color-gold-soft)", fg: "var(--color-gold)", br: "transparent" },
};

export default function Pill({ children, tone = "neutral", className, style }: PillProps) {
  const t = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.08em] ${className ?? ""}`}
      style={{
        padding: "4px 10px",
        border: `1px solid ${t.br}`,
        background: t.bg,
        color: t.fg,
        fontSize: 10.5,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
