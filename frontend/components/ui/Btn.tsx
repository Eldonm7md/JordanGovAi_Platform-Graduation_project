"use client";

import { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

type Kind = "primary" | "ghost" | "dark";

interface BtnProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  kind?: Kind;
  children: ReactNode;
  style?: CSSProperties;
}

const KINDS: Record<Kind, { bg: string; fg: string; br: string; hover: string }> = {
  primary: {
    bg: "var(--color-primary)",
    fg: "#ffffff",
    br: "var(--color-primary)",
    hover: "var(--color-primary-deep)",
  },
  ghost: {
    bg: "transparent",
    fg: "var(--color-ink)",
    br: "var(--color-rule)",
    hover: "var(--color-bg-alt)",
  },
  dark: {
    bg: "var(--color-ink)",
    fg: "var(--color-bg)",
    br: "var(--color-ink)",
    hover: "var(--color-primary-deep)",
  },
};

export default function Btn({ kind = "primary", children, style, className, onMouseEnter, onMouseLeave, ...rest }: BtnProps) {
  const { dir } = useLanguage();
  const ar = dir === "rtl";
  const k = KINDS[kind];
  return (
    <button
      {...rest}
      className={`cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ""}`}
      style={{
        background: k.bg,
        color: k.fg,
        border: `1px solid ${k.br}`,
        padding: "13px 22px",
        fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: ar ? 0 : "0.01em",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = k.hover;
        if (kind === "ghost") e.currentTarget.style.borderColor = "var(--color-rule)";
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = k.bg;
        if (kind === "ghost") e.currentTarget.style.borderColor = k.br;
        onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
