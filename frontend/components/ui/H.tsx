"use client";

import { CSSProperties, ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

type Level = 1 | 2 | 3 | 4;

interface HProps {
  level?: Level;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}

const SIZES_LTR: Record<Level, number> = { 1: 56, 2: 36, 3: 24, 4: 18 };
const SIZES_AR: Record<Level, number> = { 1: 52, 2: 32, 3: 20, 4: 14 };

export default function H({
  level = 1,
  children,
  className,
  style,
  as,
}: HProps) {
  const { dir } = useLanguage();
  const ar = dir === "rtl";
  const Tag = (as ?? (`h${level}` as keyof React.JSX.IntrinsicElements)) as "h1";
  return (
    <Tag
      className={className}
      style={{
        fontFamily: ar ? "var(--font-arabic)" : "var(--font-serif)",
        fontWeight: ar ? 600 : 400,
        fontSize: ar ? SIZES_AR[level] : SIZES_LTR[level],
        lineHeight: 1.12,
        letterSpacing: ar ? "0" : "-0.012em",
        color: "var(--color-ink)",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
