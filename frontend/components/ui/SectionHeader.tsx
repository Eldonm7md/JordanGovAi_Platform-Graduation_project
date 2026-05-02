"use client";

import { ReactNode } from "react";
import H from "./H";
import Mono from "./Mono";

interface SectionHeaderProps {
  kicker?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
}

export default function SectionHeader({ kicker, title, meta }: SectionHeaderProps) {
  return (
    <div
      className="flex justify-between items-end mb-8 pb-[18px]"
      style={{ borderBottom: "1px solid var(--color-rule-soft)" }}
    >
      <div>
        {kicker && (
          <Mono
            as="div"
            className="block mb-2.5"
            style={{ fontSize: 10.5, color: "var(--color-primary)" }}
          >
            {kicker}
          </Mono>
        )}
        <H level={2}>{title}</H>
      </div>
      {meta && (
        <Mono style={{ fontSize: 10.5, color: "var(--color-ink-mute)" }}>{meta}</Mono>
      )}
    </div>
  );
}
