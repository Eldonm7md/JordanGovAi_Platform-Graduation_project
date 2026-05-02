import { CSSProperties, ReactNode } from "react";

interface MonoProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "div" | "p";
}

export default function Mono({ children, className, style, as = "span" }: MonoProps) {
  const Tag = as;
  return (
    <Tag
      className={`font-mono uppercase tracking-[0.1em] ${className ?? ""}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
