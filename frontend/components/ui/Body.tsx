"use client";

import { CSSProperties, ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

interface BodyProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "p" | "div" | "span";
}

export default function Body({ children, className, style, as = "p" }: BodyProps) {
  const { dir } = useLanguage();
  const ar = dir === "rtl";
  const Tag = as;
  return (
    <Tag
      className={className}
      style={{
        fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
        fontSize: 15,
        lineHeight: 1.65,
        color: "var(--color-ink-soft)",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
